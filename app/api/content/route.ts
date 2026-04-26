import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { execute, batch } from '@/lib/db';
import { checkAuth } from '@/lib/auth';

export async function GET() {
  try {
    const { rows } = await execute('SELECT key, value FROM content');
    const content: Record<string, string> = {};
    rows.forEach(r => { content[r.key as string] = r.value as string; });
    return NextResponse.json(content);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body: Record<string, string> = await req.json();
    await batch(
      Object.entries(body).map(([k, v]) => ({
        sql:  'INSERT INTO content (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
        args: [k, v],
      })),
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[PUT /api/content]', e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
