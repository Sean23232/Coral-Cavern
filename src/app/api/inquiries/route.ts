import { db, isDatabaseConfigured } from '@/db';
import { inquiries } from '@/db/schema';
import { validEmail, sameOrigin, rateLimited } from '@/lib/auth';

export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: 'Request not allowed.' }, { status: 403 });
  if (rateLimited(request, 'inquiries', 8)) return Response.json({ error: 'Please wait a minute before sending another message.' }, { status: 429 });
  try {
    const body = await request.json();
    const clean = (value: unknown, max: number) => typeof value === 'string' ? value.trim().slice(0, max) : '';
    const name = clean(body.name, 100), email = clean(body.email, 254).toLowerCase(), subject = clean(body.subject, 200), message = clean(body.message, 5000);
    if (name.length < 2 || !validEmail(email) || subject.length < 2 || message.length < 10) return Response.json({ error: 'Please include your name, a valid email, a subject, and a message of at least 10 characters.' }, { status: 400 });
    
    let entryId = 'inquiry-' + Date.now();
    if (isDatabaseConfigured) {
      try {
        const [entry] = await db.insert(inquiries).values({ name, email, subject, message, phone: clean(body.phone, 30), kind: body.kind === 'service' ? 'service' : 'contact' }).returning({ id: inquiries.id });
        if (entry) entryId = entry.id;
      } catch (err) {
        console.warn('Database inquiry insert skipped:', (err as Error).message);
      }
    }
    return Response.json({ id: entryId, message: 'Your inquiry has been saved in this preview. For a live response, please contact coralcavern7@gmail.com or call 971-374-4572.' });
  } catch { return Response.json({ error: 'Your message could not be saved. Please try again or contact us directly.' }, { status: 500 }); }
}
