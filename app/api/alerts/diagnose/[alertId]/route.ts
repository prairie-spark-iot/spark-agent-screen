import { NextRequest, NextResponse } from 'next/server';
import { Alert } from '@/src/types';
import { EngineAlert, mapEngineAlertToUiAlert } from '@/lib/adapters/alertAdapter';

async function fetchSingleAlertFromEngine(baseUrl: string, alertId: string): Promise<Alert | null> {
  const res = await fetch(`${baseUrl}/api/alert/recent?limit=500`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`engine GET /api/alert/recent returned ${res.status}`);
  }
  const body: { code: number; msg: string; data: EngineAlert[] } = await res.json();
  if (body.code !== 0) {
    throw new Error(`engine GET /api/alert/recent error: ${body.msg}`);
  }
  const match = body.data.find(a => String(a.id) === alertId);
  return match ? mapEngineAlertToUiAlert(match) : null;
}

/**
 * Proxies to the engine's POST /api/alerts/{id}/diagnose (202 Accepted, async via the
 * Kafka/Ollama pipeline — see phase-1-2-api-data-contracts.md §3). No Gemini, no heuristic
 * fallback, no mock branch: a failed engine call surfaces as a real error to the caller
 * rather than silently substituting a fake diagnosis, per
 * frontend-backend-integration-strategy.md Phase 4.
 *
 * The engine only returns {id, status} on 202 — not a full alert — so this route re-fetches
 * the full alert from the engine afterwards to satisfy the existing Alert-shaped contract
 * src/App.tsx expects. The alert will show status "Diagnosing"; the real diagnosis (rootCause,
 * timeline, etc.) arrives later via the existing 4s poll once the engine's single-concurrency
 * consumer actually completes the LLM call.
 */
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ alertId: string }> }
) {
  const { alertId } = await params;
  const baseUrl = process.env.BACKEND_ENGINE_URL;

  try {
    const engineRes = await fetch(`${baseUrl}/api/alerts/${alertId}/diagnose`, { method: 'POST' });

    if (engineRes.status === 404) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }
    // 409 = already Diagnosing/Diagnosed — soft no-op per contract, not an error: return
    // current state so a double-click or stale UI doesn't show a scary error toast.
    if (!engineRes.ok && engineRes.status !== 409) {
      throw new Error(`engine diagnose request returned ${engineRes.status}`);
    }

    const updated = await fetchSingleAlertFromEngine(baseUrl!, alertId);
    if (!updated) {
      return NextResponse.json({ error: 'Alert not found after diagnosis request' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (err) {
    console.error('[BFF] diagnose request failed:', err);
    return NextResponse.json({ error: 'Diagnosis request failed' }, { status: 502 });
  }
}
