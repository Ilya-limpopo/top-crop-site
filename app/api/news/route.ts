import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { execute } from '@/lib/db';
import { checkAuth } from '@/lib/auth';

export async function GET() {
  try {
    const { rows } = await execute('SELECT id, date, category, title, body FROM news ORDER BY created_at DESC');
    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { date, category, title, body } = await req.json();
    const result = await execute(
      'INSERT INTO news (date, category, title, body) VALUES (?, ?, ?, ?)',
      [date, category, title, body],
    );
    return NextResponse.json({ id: result.lastInsertRowid, date, category, title, body });
  } catch (e) {
    console.error('[POST /api/news]', e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
