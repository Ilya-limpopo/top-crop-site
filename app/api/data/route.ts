import { NextResponse } from 'next/server';
import { getSiteData } from '@/lib/db';

export async function GET() {
  try {
    const data = await getSiteData();
    return NextResponse.json(data);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 });
  }
}
