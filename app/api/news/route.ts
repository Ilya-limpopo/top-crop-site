import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { execute, init } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

export async function GET() {
  await init();
  const { rows } = await execute('SELECT id, date, category, title, body FROM news ORDER BY created_at DESC');
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await init();

  const { date, category, title, body } = await req.json();
  const result = await execute(
    'INSERT INTO news (date, category, title, body) VALUES (?, ?, ?, ?)',
    [date, category, title, body],
  );
  return NextResponse.json({ id: result.lastInsertRowid, date, category, title, body });
}
