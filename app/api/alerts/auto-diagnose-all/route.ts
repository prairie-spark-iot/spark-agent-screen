import { NextResponse } from 'next/server';
import { Alert } from '@/src/types';
import { EngineAlert, mapEngineAlertToUiAlert } from '@/lib/adapters/alertAdapter';

async function fetchAlertsFromEngine(baseUrl: string): Promise<Alert[]> {
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

/**
 * There is no batch-diagnose endpoint on the engine — this fans out to the same single-alert
 * POST /api/alerts/{id}/diagnose once per currently-Pending alert instead. This is a deliberate
 * behavioral difference from the old Gemini-backed version, which diagnosed everything in
 * parallel: the engine's diagnosis pipeline is pinned to concurrency=1 (matched to Ollama's
 * single inference slot), so N pending alerts now complete one at a time over N ×
 * (single-diagnosis latency), not in one round-trip. See
 * frontend-backend-integration-strategy.md §5 Phase 4 and phase-1-2-api-data-contracts.md §3.
 * Individual diagnose-call failures (e.g. a 409 from a race with another trigger) don't abort
 * the batch — they're swallowed per-alert so one bad alert doesn't block the rest.
 */
export async function POST() {
  const baseUrl = process.env.BACKEND_ENGINE_URL!;

  try {
    const alerts = await fetchAlertsFromEngine(baseUrl);
    const pending = alerts.filter(a => a.status === 'Pending');

    if (pending.length === 0) {
      return NextResponse.json({ message: 'No pending alerts to diagnose', alerts });
    }

    await Promise.all(pending.map(a =>
      fetch(`${baseUrl}/api/alerts/${a.id}/diagnose`, { method: 'POST' }).catch(err =>
        console.warn(`[BFF] auto-diagnose: request failed for alert ${a.id}:`, err))
    ));

    const updated = await fetchAlertsFromEngine(baseUrl);
    return NextResponse.json({ alerts: updated });
  } catch (err) {
    console.error('[BFF] auto-diagnose-all failed:', err);
    return NextResponse.json({ error: 'Auto-diagnose all failed' }, { status: 502 });
  }
}
