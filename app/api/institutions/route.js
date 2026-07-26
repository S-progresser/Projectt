import { NextResponse } from 'next/server';
import { INITIAL_INSTITUTIONS } from '@/lib/institutionsStore';

export async function GET() {
  return NextResponse.json({
    institutions: INITIAL_INSTITUTIONS,
    total: INITIAL_INSTITUTIONS.length
  });
}
