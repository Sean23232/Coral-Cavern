import { db, isDatabaseConfigured } from '@/db';
import { customers, orders } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { currentCustomer, createSession, deleteSession, hashPassword, verifyPassword, validEmail, sameOrigin, rateLimited } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const customer = await currentCustomer();
    if (!customer) return Response.json({ customer: null, orders: [] });
    let history: Array<typeof orders.$inferSelect> = [];
    if (isDatabaseConfigured) {
      try {
        history = await db.select().from(orders).where(eq(orders.customerId, customer.id)).orderBy(desc(orders.createdAt));
      } catch (err) {
        console.warn('Database account orders query skipped:', (err as Error).message);
      }
    }
    return Response.json({ customer, orders: history });
  } catch {
    return Response.json({ customer: null, orders: [] });
  }
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: 'Request not allowed.' }, { status: 403 });
  if (rateLimited(request, 'account', 8)) return Response.json({ error: 'Too many attempts. Please wait a minute.' }, { status: 429 });
  try {
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = body.password;
    if (!validEmail(email) || typeof password !== 'string' || password.length < 8 || password.length > 128) {
      return Response.json({ error: 'Use a valid email and a password between 8 and 128 characters.' }, { status: 400 });
    }
    if (body.action !== 'register' && body.action !== 'login') {
      return Response.json({ error: 'Invalid account action.' }, { status: 400 });
    }

    if (!isDatabaseConfigured) {
      // In standalone mode without a database, provide an in-memory preview session
      const name = typeof body.name === 'string' ? body.name.trim().slice(0, 100) : email.split('@')[0];
      return Response.json({
        customer: { id: 'preview-user', name: name || 'Reef Explorer', email },
      });
    }

    const [existing] = await db.select().from(customers).where(eq(customers.email, email)).limit(1);
    let customer;
    if (body.action === 'register') {
      if (existing) return Response.json({ error: 'An account with this email already exists. Please sign in.' }, { status: 409 });
      const name = typeof body.name === 'string' ? body.name.trim().slice(0, 100) : '';
      if (name.length < 2) return Response.json({ error: 'Please enter your full name.' }, { status: 400 });
      [customer] = await db.insert(customers).values({ name, email, passwordHash: hashPassword(password) }).returning();
    } else {
      if (!existing || !verifyPassword(password, existing.passwordHash)) {
        return Response.json({ error: 'The email or password is incorrect.' }, { status: 401 });
      }
      customer = existing;
    }
    await createSession(customer.id);
    return Response.json({ customer: { id: customer.id, name: customer.name, email: customer.email } });
  } catch {
    return Response.json({ error: 'We couldn’t complete that request. Please try again.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: 'Request not allowed.' }, { status: 403 });
  await deleteSession();
  return Response.json({ success: true });
}
