import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { execute, init } from '@/lib/db';
import { checkAuth } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    await init();
    const { title, location, type } = await req.json();
    await execute(
      'UPDATE careers SET title=?, location=?, type=? WHERE id=?',
      [title, location, type, Number(params.id)],
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[PUT /api/careers]', e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    await init();
    await execute('DELETE FROM careers WHERE id=?', [Number(params.id)]);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[DELETE /api/careers]', e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
