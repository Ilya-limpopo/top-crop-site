import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { execute } from '@/lib/db';
import { checkAuth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const before = await execute('SELECT COUNT(*) as n FROM careers');
    await execute('DELETE FROM careers');
    await execute("INSERT OR IGNORE INTO settings (key, value) VALUES ('_seeded', '1')");
    const after = await execute('SELECT COUNT(*) as n FROM careers');
    return NextResponse.json({
      before: Number(before.rows[0]?.n ?? 0),
      after:  Number(after.rows[0]?.n ?? 0),
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
