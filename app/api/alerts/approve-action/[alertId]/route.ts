import { NextRequest, NextResponse } from 'next/server';
import { EngineAlert, mapEngineAlertToUiAlert } from '@/lib/adapters/alertAdapter';

/**
 * Proxies to the engine's POST /api/alerts/{id}/approve. Unlike the old mock, this does NOT
 * reset the device to nominal values — the mock's "closed-loop physical remediation" was a
 * simulation only; whether approving an action plan should issue a real device command is an
 * open product question (flagged in frontend-backend-integration-strategy.md §2) that hasn't
 * been decided, so it isn't implemented here. Approving now only marks the alert handled
 * (handleStatus=1) and records approvedAt — the device's live telemetry is unaffected and will
 * only change once the physical/simulated device itself reports a different value.
 */
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ alertId: string }> }
) {
  const { alertId } = await params;
  const baseUrl = process.env.BACKEND_ENGINE_URL;

  try {
    const res = await fetch(`${baseUrl}/api/alerts/${alertId}/approve`, { method: 'POST' });

    if (res.status === 404) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }
    if (res.status === 409) {
      return NextResponse.json({ error: 'Alert has not been diagnosed yet' }, { status: 409 });
    }
    if (!res.ok) {
      throw new Error(`engine approve request returned ${res.status}`);
    }

    const body: { code: number; msg: string; data: EngineAlert } = await res.json();
    if (body.code !== 0) {
      throw new Error(`engine approve error: ${body.msg}`);
    }

    return NextResponse.json(mapEngineAlertToUiAlert(body.data));
  } catch (err) {
    console.error('[BFF] approve-action request failed:', err);
    return NextResponse.json({ error: 'Failed to approve action plan' }, { status: 502 });
  }
}
