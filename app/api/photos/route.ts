import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { db, init } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';
import { uploadImage } from '@/lib/cloudinary';

export async function GET() {
  await init();
  const { rows } = await db.execute('SELECT slot, url FROM photos');
  const photos: Record<string, string> = {};
  rows.forEach(r => { photos[r.slot as string] = r.url as string; });
  return NextResponse.json(photos);
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await init();

  const form = await req.formData();
  const file = form.get('file') as File | null;
  const slot = form.get('slot') as string | null;

  if (!file || !slot) return NextResponse.json({ error: 'Missing file or slot' }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const url    = await uploadImage(buffer, slot);

  await db.execute({
    sql:  'INSERT INTO photos (slot, url) VALUES (?, ?) ON CONFLICT(slot) DO UPDATE SET url = excluded.url',
    args: [slot, url],
  });

  return NextResponse.json({ url });
}
