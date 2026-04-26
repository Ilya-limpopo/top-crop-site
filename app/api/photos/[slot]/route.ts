import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { execute, init } from '@/lib/db';
import { checkAuth } from '@/lib/auth';
import { deleteImage } from '@/lib/cloudinary';

export async function DELETE(req: NextRequest, { params }: { params: { slot: string } }) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    await init();
    const slot = decodeURIComponent(params.slot);
    try { await deleteImage(slot); } catch { /* not on cloudinary */ }
    await execute('DELETE FROM photos WHERE slot=?', [slot]);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[DELETE /api/photos]', e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
