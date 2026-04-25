import { NextRequest, NextResponse } from 'next/server';
import { db, init } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

export async function GET() {
  await init();
  const { rows } = await db.execute('SELECT key, value FROM content');
  const content: Record<string, string> = {};
  rows.forEach(r => { content[r.key as string] = r.value as string; });
  return NextResponse.json(content);
}

export async function PUT(req: NextRequest) {
  if (!isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await init();

  const body: Record<string, string> = await req.json();
  await db.batch(
    Object.entries(body).map(([k, v]) => ({
      sql:  'INSERT INTO content (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
      args: [k, v],
    })),
  );
  return NextResponse.json({ ok: true });
}
