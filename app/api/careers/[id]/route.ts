import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { db, init } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await init();

  const { title, location, type } = await req.json();
  await db.execute({
    sql:  'UPDATE careers SET title=?, location=?, type=? WHERE id=?',
    args: [title, location, type, Number(params.id)],
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await init();

  await db.execute({ sql: 'DELETE FROM careers WHERE id=?', args: [Number(params.id)] });
  return NextResponse.json({ ok: true });
}
