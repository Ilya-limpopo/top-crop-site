import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { getSiteData } from '@/lib/db';

const NO_CACHE = { 'Cache-Control': 'no-store, no-cache, must-revalidate', 'CDN-Cache-Control': 'no-store', 'Vercel-CDN-Cache-Control': 'no-store' };

export async function GET() {
  try {
    const data = await getSiteData();
    return NextResponse.json(data, { headers: NO_CACHE });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500, headers: NO_CACHE });
  }
}
