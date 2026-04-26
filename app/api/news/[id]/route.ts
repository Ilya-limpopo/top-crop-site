import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { execute } from '@/lib/db';
import { checkAuth } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { date, category, title, body } = await req.json();
    await execute(
      'UPDATE news SET date=?, category=?, title=?, body=? WHERE id=?',
      [date, category, title, body, Number(params.id)],
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[PUT /api/news]', e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const id = Number(params.id);
    const r = await execute('DELETE FROM news WHERE id=?', [id]);
    console.log('[DELETE /api/news]', { rawParam: params.id, parsedId: id, affected: r.affected });
    return NextResponse.json({ ok: true, id, affected: r.affected });
  } catch (e) {
    console.error('[DELETE /api/news]', e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
