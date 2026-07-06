import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  if (process.env.BACKEND_SOURCE_DEVICE === 'engine') {
    return NextResponse.json([]);
  }
  return NextResponse.json(db.getDocuments());
}
