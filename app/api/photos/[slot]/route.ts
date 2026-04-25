import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { db, init } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';
import { deleteImage } from '@/lib/cloudinary';

export async function DELETE(_req: NextRequest, { params }: { params: { slot: string } }) {
  if (!isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await init();

  const slot = decodeURIComponent(params.slot);
  try { await deleteImage(slot); } catch { /* already deleted or never on cloudinary */ }

  await db.execute({ sql: 'DELETE FROM photos WHERE slot=?', args: [slot] });
  return NextResponse.json({ ok: true });
}
