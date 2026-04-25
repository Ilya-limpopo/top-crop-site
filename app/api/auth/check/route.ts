import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { isAuthenticated } from '@/lib/auth';

export async function GET() {
  return NextResponse.json({ authenticated: isAuthenticated() });
}
