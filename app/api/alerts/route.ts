import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Alert } from '@/src/types';
import { fetchAlertsFromEngine } from '@/lib/adapters/alertAdapter';

// BACKEND_SOURCE_ALERT=engine|mock — strangler-fig flag, see
// spark-agent-docs/frontend-backend-integration-strategy.md §1. This route's own contract
// (a plain Alert[] array) stays stable for src/App.tsx regardless of which source backs it.
export async function GET() {
  console.log('[BFF][alerts] BACKEND_SOURCE_ALERT =', JSON.stringify(process.env.BACKEND_SOURCE_ALERT),
    '| BACKEND_ENGINE_URL =', JSON.stringify(process.env.BACKEND_ENGINE_URL));

  if (process.env.BACKEND_SOURCE_ALERT === 'engine') {
    try {
      return NextResponse.json(await fetchAlertsFromEngine());
    } catch (err) {
      console.error('🚨 BFF RETRIEVAL FAILED:', err);
      return NextResponse.json({ error: err instanceof Error ? err.message : 'Engine unreachable' }, { status: 502 });
    }
  }
  return NextResponse.json(db.getAlerts());
}
