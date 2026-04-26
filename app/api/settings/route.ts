import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { execute, batch, init } from '@/lib/db';
import { checkAuth } from '@/lib/auth';

export async function GET() {
  await init();
  const { rows } = await execute('SELECT key, value FROM settings');
  const settings: Record<string, string> = {};
  rows.forEach(r => { settings[r.key as string] = r.value as string; });
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    await init();
    const body: Record<string, string> = await req.json();
    await batch(
      Object.entries(body).map(([k, v]) => ({
        sql:  'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
        args: [k, v],
      })),
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[PUT /api/settings]', e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
