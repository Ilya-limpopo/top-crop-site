import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { execute, init } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

export async function GET() {
  await init();
  const { rows } = await execute('SELECT id, title, location, type FROM careers');
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await init();

  const { title, location, type } = await req.json();
  const result = await execute(
    'INSERT INTO careers (title, location, type) VALUES (?, ?, ?)',
    [title, location, type],
  );
  return NextResponse.json({ id: result.lastInsertRowid, title, location, type });
}
