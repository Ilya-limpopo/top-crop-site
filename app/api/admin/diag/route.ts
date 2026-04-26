import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { execute } from '@/lib/db';
import { checkAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const news     = await execute('SELECT id, date, category, title FROM news ORDER BY id');
    const careers  = await execute('SELECT id, title FROM careers ORDER BY id');
    const seeded   = await execute("SELECT value FROM settings WHERE key='_seeded'");
    const cContent = await execute('SELECT COUNT(*) as n FROM content');
    const cPhotos  = await execute('SELECT COUNT(*) as n FROM photos');
    return NextResponse.json({
      news_count:    news.rows.length,
      news_rows:     news.rows,
      careers_count: careers.rows.length,
      careers_rows:  careers.rows,
      seeded_flag:   seeded.rows.length > 0 ? seeded.rows[0].value : null,
      content_count: cContent.rows[0]?.n,
      photos_count:  cPhotos.rows[0]?.n,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
