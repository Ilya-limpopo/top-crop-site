import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { execute } from '@/lib/db';
import { checkAuth } from '@/lib/auth';

export async function GET() {
  try {
    const { rows } = await execute('SELECT id, title, location, type FROM careers');
    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { title, location, type } = await req.json();
    const result = await execute(
      'INSERT INTO careers (title, location, type) VALUES (?, ?, ?)',
      [title, location, type],
    );
    return NextResponse.json({ id: result.lastInsertRowid, title, location, type });
  } catch (e) {
    console.error('[POST /api/careers]', e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
