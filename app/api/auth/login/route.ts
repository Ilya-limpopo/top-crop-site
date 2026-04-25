import { NextRequest, NextResponse } from 'next/server';
import { setSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const validEmail    = process.env.ADMIN_EMAIL    || 'admin@topcrop.tz';
  const validPassword = process.env.ADMIN_PASSWORD || 'topcrop2024';

  if (email !== validEmail || password !== validPassword) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  setSession();
  return NextResponse.json({ ok: true });
}
