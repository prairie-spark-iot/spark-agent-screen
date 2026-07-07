import { Alert, DiagnosisReport, DiagnosisStatus, Severity } from '@/src/types';

// Shape returned by spark-agent-engine's GET /api/alert/recent (AlertRecordResponse) — see
// spark-agent-docs/phase-1-2-api-data-contracts.md. Note `id` is a plain JSON number here
// (Jackson's default Long serialization on this existing endpoint), unlike the new
// POST /api/alerts/{id}/diagnose response which deliberately stringifies it — a pre-existing
// inconsistency in the engine, not introduced by this adapter. Values above 2^53 would already
// have lost precision before this adapter ever sees them; out of scope to fix here.
export interface EngineAlert {
  id: number;
  ruleId: number | null;
  deviceId: number;
  deviceKey: string;
  identifier: string;
  triggerValue: string;
  level: number;
  alertContent: string;
  triggerTime: string;
  diagnosisStatus: number;
  handleStatus: number;
  rootCause: string | null;
  suggestion: string | null;
  confidence: number | null;
  diagnosisDetail: string | null;
  diagnosisTime: string | null;
  ruleOperator: string | null;
  ruleThreshold: string | null;
  diagnosisRequestedAt: string | null;
  approvedAt: string | null;
  // BaseEntity.updateTime — present on WS pushes (AlertWsBridgeConsumer, DiagnosisAgentService
  // writeBack), which serialize the raw AlertRecord entity; not present on GET /api/alert/recent
  // today. Optional so both sources satisfy this interface.
  updateTime?: string;
}

const SEVERITY_BY_LEVEL: Record<number, Severity> = {
  1: 'Info',
  2: 'Warning',
  3: 'Critical',
};

const OPERATOR_SYMBOLS: Record<string, string> = {
  gt: '>',
  lt: '<',
  gte: '≥',
  lte: '≤',
  eq: '=',
  ne: '≠',
};

interface EngineDiagnosisDetail {
  timeline?: { title: string; description: string }[];
  suggestedActionPlan?: { text: string }[];
}

/**
 * Verified against the live database: 91 of 100 real alerts were diagnosed before
 * diagnosisDetail was restructured to JSON today and still hold free-text prose from the old
 * DiagnosisAgentService. JSON.parse throws on these — rather than degrading to an empty
 * timeline (which rendered as a blank Timeline section for the vast majority of real alerts,
 * the "empty UI fields" bug), wrap the raw prose into a single synthetic timeline entry so the
 * diagnosis narrative still renders, just unstructured. Only genuinely empty/absent detail
 * yields an empty timeline — that's a real "nothing recorded" state, not a parse failure.
 */
function parseDiagnosisDetail(raw: string | null): EngineDiagnosisDetail {
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {
      timeline: [{ title: 'Diagnosis (legacy format)', description: raw }],
    };
  }
}

/**
 * status derivation table — see phase-1-2-api-data-contracts.md §2. diagnosisRequestedAt vs
 * diagnosisTime distinguishes "Diagnosing" (in flight) from "Pending" (never requested) without
 * a stored status value for the transient state.
 */
function deriveStatus(a: EngineAlert): DiagnosisStatus {
  const requestedAt = a.diagnosisRequestedAt ? Date.parse(a.diagnosisRequestedAt) : null;
  const diagnosedAt = a.diagnosisTime ? Date.parse(a.diagnosisTime) : null;

  if (requestedAt !== null && (diagnosedAt === null || diagnosedAt < requestedAt)) {
    return 'Diagnosing';
  }
  if (a.diagnosisStatus === 1 || a.diagnosisStatus === 2) {
    return 'Diagnosed';
  }
  return 'Pending';
}

function mapThreshold(a: EngineAlert): string {
  if (!a.ruleOperator || !a.ruleThreshold) return '--';
  const symbol = OPERATOR_SYMBOLS[a.ruleOperator] ?? a.ruleOperator;
  return `${symbol} ${a.ruleThreshold}`;
}

function mapDiagnosis(a: EngineAlert): DiagnosisReport | undefined {
  if (a.diagnosisStatus === 0) return undefined;

  const detail = parseDiagnosisDetail(a.diagnosisDetail);
  // There is no separate isApproved field on the wire (verified against the live engine) —
  // handleStatus (0=unhandled, 1=handled) is the real, existing signal closest to "operator
  // approved this diagnosis", set by POST /api/alerts/{id}/approve.
  const approved = a.handleStatus === 1;

  return {
    rootCause: a.rootCause ?? '',
    confidence: a.confidence ?? 0,
    timeline: detail.timeline ?? [],
    // The engine has no per-step completion tracking (would need a new table, deferred) — it
    // only tracks whole-alert approval. Matching the original mock's approve-action behavior
    // (which marked every action-plan item completed on approve), completed is derived from the
    // whole-alert approved flag rather than sourced per-item from the backend.
    suggestedActionPlan: (detail.suggestedActionPlan ?? []).map((item, index) => ({
      id: `${a.id}-step-${index}`,
      text: item.text,
      completed: approved,
    })),
    approved,
    approvedAt: a.approvedAt ?? undefined,
  };
}

/**
 * Fetches alerts from the external engine API. Used by both the alerts route and the
 * telemetry sync route to avoid duplicating the fetch+parse+map logic.
 */
export async function fetchAlertsFromEngine(): Promise<Alert[]> {
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

export function mapEngineAlertToUiAlert(a: EngineAlert): Alert {
  return {
    id: String(a.id),
    time: a.triggerTime.substring(11, 19),
    timestamp: a.triggerTime,
    // engine's AlertRecordResponse has no Device-name join yet — deviceKey stands in until that
    // gap is closed (see phase-1-2-api-data-contracts.md §2, "device" mapping).
    device: a.deviceKey,
    metric: a.identifier,
    triggerValue: a.triggerValue,
    threshold: mapThreshold(a),
    severity: SEVERITY_BY_LEVEL[a.level] ?? 'Info',
    status: deriveStatus(a),
    details: a.alertContent,
    diagnosis: mapDiagnosis(a),
    updateTime: a.updateTime,
  };
}
