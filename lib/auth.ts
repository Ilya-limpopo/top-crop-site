import { cookies } from 'next/headers';
import { createHmac } from 'crypto';
import type { NextRequest } from 'next/server';

const SECRET  = process.env.AUTH_SECRET || 'dev-secret-please-change-in-production-min32';
const COOKIE  = 'tc_session';
const PAYLOAD = 'admin';

function sign(val: string): string {
  const mac = createHmac('sha256', SECRET).update(val).digest('hex');
  return `${val}.${mac}`;
}

function verify(signed: string): boolean {
  const dot = signed.lastIndexOf('.');
  if (dot === -1) return false;
  const val = signed.slice(0, dot);
  return sign(val) === signed;
}

export function setSession(): void {
  cookies().set(COOKIE, sign(PAYLOAD), {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   60 * 60 * 24 * 7,
    path:     '/',
  });
}

export function clearSession(): void {
  cookies().delete(COOKIE);
}

export function isAuthenticated(): boolean {
  try {
    const c = cookies().get(COOKIE);
    return !!c && verify(c.value);
  } catch {
    return false;
  }
}

export function checkAuth(req: NextRequest): boolean {
  const val = req.cookies.get(COOKIE)?.value;
  return !!val && verify(val);
}
