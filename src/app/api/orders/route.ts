import { randomBytes } from 'crypto';
import { db, isDatabaseConfigured } from '@/db';
import { orders, type OrderItem, type ShippingAddress } from '@/db/schema';
import { getProducts } from '@/lib/store';
import { currentCustomer, validEmail, sameOrigin, rateLimited } from '@/lib/auth';

export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: 'Request not allowed.' }, { status: 403 });
  if (rateLimited(request, 'orders', 10)) return Response.json({ error: 'Please wait a minute before trying again.' }, { status: 429 });
  try {
    const body = await request.json();
    if (body.previewAcknowledged !== true) return Response.json({ error: 'Please acknowledge that no payment or fulfillment occurs in this preview.' }, { status: 400 });
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const s = body.shipping as ShippingAddress;
    if (!validEmail(email) || !s || !['pickup', 'delivery'].includes(s.method) || typeof s.name !== 'string' || s.name.trim().length < 2 || s.name.length > 100) return Response.json({ error: 'Please provide valid contact and shipping information.' }, { status: 400 });
    if (s.method === 'delivery' && (!['address','city','state','zip'].every(k => typeof s[k as keyof ShippingAddress] === 'string' && s[k as keyof ShippingAddress].trim().length > 0 && s[k as keyof ShippingAddress].length < 250) || !/^\d{5}(-\d{4})?$/.test(s.zip) || s.country !== 'US')) return Response.json({ error: 'Please enter a complete US delivery address and valid ZIP code.' }, { status: 400 });
    if (!Array.isArray(body.items) || body.items.length === 0 || body.items.length > 50) return Response.json({ error: 'Your cart is empty or contains too many items.' }, { status: 400 });
    
    const products = await getProducts();
    const items: OrderItem[] = [];
    const seen = new Set<string>();
    for (const entry of body.items) {
      const product = products.find(p => p.slug === entry.slug);
      if (!product || !product.available || product.price === null) return Response.json({ error: `${product?.name || 'A product'} is no longer available. Please update your cart.` }, { status: 409 });
      const quantity = Number(entry.quantity);
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20 || seen.has(product.slug)) return Response.json({ error: 'Product quantities must be between 1 and 20 with no duplicate lines.' }, { status: 400 });
      seen.add(product.slug);
      const variant = entry.variant ? product.variants?.find(v => v.id === entry.variant) : undefined;
      if (entry.variant && !variant) return Response.json({ error: 'Please choose a valid product option.' }, { status: 400 });
      items.push({ slug: product.slug, name: product.name, image: product.image, price: variant?.price ?? product.price, quantity, ...(variant ? { variant: variant.name } : {}) });
    }
    
    const customer = await currentCustomer();
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const number = 'CC-' + randomBytes(4).toString('hex').toUpperCase();
    const clean = (v: unknown) => typeof v === 'string' ? v.trim().slice(0,250) : '';
    const shipping: ShippingAddress = { name: clean(s.name), address: clean(s.address), city: clean(s.city), state: clean(s.state), zip: clean(s.zip), country: s.method === 'delivery' ? 'US' : '', phone: clean(s.phone), method: s.method };
    
    if (isDatabaseConfigured) {
      try {
        const [order] = await db.insert(orders).values({ number, customerId: customer?.id, email, items, shipping, subtotal, status: 'Preview order — no payment collected' }).returning();
        if (order) return Response.json({ order }, { status: 201 });
      } catch (err) {
        console.warn('Database order insert skipped:', (err as Error).message);
      }
    }
    
    // Standalone fallback order
    const fallbackOrder = {
      id: randomBytes(16).toString('hex'),
      number,
      customerId: customer?.id ?? null,
      email,
      items,
      shipping,
      subtotal,
      status: 'Preview order — no payment collected',
      createdAt: new Date().toISOString()
    };
    return Response.json({ order: fallbackOrder }, { status: 201 });
  } catch {
    return Response.json({ error: 'Your order could not be saved. No payment was taken. Please try again.' }, { status: 500 });
  }
}
