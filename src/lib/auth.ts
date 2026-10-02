import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { and, eq, gt } from 'drizzle-orm';
import { db, isDatabaseConfigured } from '@/db';
import { customers, sessions } from '@/db/schema';

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`;
}

export function verifyPassword(password: string, hash: string) {
  const [salt, key] = hash.split(':');
  const expected = Buffer.from(key, 'hex');
  const actual = scryptSync(password, salt, 64);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

const tokenHash = (token: string) => createHash('sha256').update(token).digest('hex');

export async function createSession(customerId: string) {
  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14);
  if (isDatabaseConfigured) {
    try {
      await db.insert(sessions).values({ token: tokenHash(token), customerId, expiresAt });
    } catch (err) {
      console.warn('Database session insert skipped:', (err as Error).message);
    }
  }
  const jar = await cookies();
  jar.set('coral_session', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', expires: expiresAt });
}

export async function currentCustomer() {
  if (!isDatabaseConfigured) return null;
  try {
    const jar = await cookies();
    const token = jar.get('coral_session')?.value;
    if (!token) return null;
    const [result] = await db
      .select({ id: customers.id, name: customers.name, email: customers.email })
      .from(sessions)
      .innerJoin(customers, eq(customers.id, sessions.customerId))
      .where(and(eq(sessions.token, tokenHash(token)), gt(sessions.expiresAt, new Date())))
      .limit(1);
    return result || null;
  } catch (err) {
    console.warn('Database currentCustomer skipped:', (err as Error).message);
    return null;
  }
}

export async function deleteSession() {
  try {
    const jar = await cookies();
    const token = jar.get('coral_session')?.value;
    if (token && isDatabaseConfigured) {
      try {
        await db.delete(sessions).where(eq(sessions.token, tokenHash(token)));
      } catch (err) {
        console.warn('Database session delete skipped:', (err as Error).message);
      }
    }
    jar.delete('coral_session');
  } catch {
    // Cookie deletion is best effort
  }
}

export const validEmail = (value: unknown): value is string => typeof value === 'string' && value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export function sameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  try { return new URL(origin).host === host || new URL(origin).host === new URL(request.url).host; } catch { return false; }
}

const limits = new Map<string, { count: number; reset: number }>();

export function rateLimited(request: Request, scope: string, max = 20) {
  const key = scope + ':' + (request.headers.get('x-forwarded-for')?.split(',')[0] || 'local');
  const now = Date.now();
  if (limits.size > 5000) for (const [k, v] of limits) if (v.reset < now) limits.delete(k);
  const existing = limits.get(key);
  if (!existing || existing.reset < now) { limits.set(key, { count: 1, reset: now + 60000 }); return false; }
  existing.count++;
  return existing.count > max;
}
