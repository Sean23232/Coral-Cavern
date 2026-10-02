import { getProducts } from '@/lib/store';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  try {
    const params = new URL(request.url).searchParams;
    const q = (params.get('q') || '').toLowerCase();
    const category = params.get('category');
    let products = await getProducts();
    if (category) products = products.filter(p => p.category === category);
    if (q) products = products.filter(p => `${p.name} ${p.category} ${p.type} ${p.description}`.toLowerCase().includes(q));
    return Response.json({ products });
  } catch { return Response.json({ error: 'The catalog is temporarily unavailable. Please try again.' }, { status: 503 }); }
}
