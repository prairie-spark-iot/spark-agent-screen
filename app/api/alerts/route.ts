import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Alert } from '@/src/types';
import { EngineAlert, mapEngineAlertToUiAlert } from '@/lib/adapters/alertAdapter';

// BACKEND_SOURCE_ALERT=engine|mock — strangler-fig flag, see
// spark-agent-docs/frontend-backend-integration-strategy.md §1. This route's own contract
// (a plain Alert[] array) stays stable for src/App.tsx regardless of which source backs it.
async function fetchAlertsFromEngine(): Promise<Alert[]> {
  const baseUrl = process.env.BACKEND_ENGINE_URL;
  const res = await fetch(`${baseUrl}/api/alert/recent?limit=500`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`engine GET /api/alert/recent returned ${res.status}`);
  }
  const body: { code: number; msg: string; data: EngineAlert[] } = await res.json();
  if (body.code !== 0) {
    throw new Error(`engine GET /api/alert/recent error: ${body.msg}`);
  }
  return body.data.map(mapEngineAlertToUiAlert);
}

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
