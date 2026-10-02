import { db, isDatabaseConfigured } from '@/db';
import { subscribers } from '@/db/schema';
import { validEmail, sameOrigin, rateLimited } from '@/lib/auth';

export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: 'Request not allowed.' }, { status: 403 });
  if (rateLimited(request, 'newsletter', 10)) return Response.json({ error: 'Please wait a minute before trying again.' }, { status: 429 });
  try {
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    if (!validEmail(email)) return Response.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    if (isDatabaseConfigured) {
      try {
        await db.insert(subscribers).values({ email }).onConflictDoNothing();
      } catch (err) {
        console.warn('Database newsletter insert skipped:', (err as Error).message);
      }
    }
    return Response.json({ message: 'You’re on the list! Your subscription is saved in this preview. Email delivery is not yet connected.' });
  } catch { return Response.json({ error: 'We couldn’t save your subscription. Please try again.' }, { status: 500 }); }
}
