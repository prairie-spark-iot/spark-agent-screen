import { describe, it, expect } from 'vitest';
import { mapEngineAlertToUiAlert, EngineAlert } from '../lib/adapters/alertAdapter';

function baseEngineAlert(overrides: Partial<EngineAlert> = {}): EngineAlert {
  return {
    id: 1948213,
    ruleId: 100,
    deviceId: 3,
    deviceKey: 'DK_INJ_001',
    identifier: 'temperature',
    triggerValue: '245.2',
    level: 3,
    alertContent: 'temperature exceeded threshold on DK_INJ_001',
    triggerTime: '2026-07-05T09:14:20',
    diagnosisStatus: 0,
    handleStatus: 0,
    rootCause: null,
    suggestion: null,
    confidence: null,
    diagnosisDetail: null,
    diagnosisTime: null,
    ruleOperator: 'gt',
    ruleThreshold: '240',
    diagnosisRequestedAt: null,
    approvedAt: null,
    ...overrides,
  };
}

describe('mapEngineAlertToUiAlert', () => {
  it('maps a pending alert with no diagnosis yet', () => {
    const alert = mapEngineAlertToUiAlert(baseEngineAlert());

    expect(alert.id).toBe('1948213');
    expect(alert.device).toBe('DK_INJ_001');
    expect(alert.metric).toBe('temperature');
    expect(alert.triggerValue).toBe('245.2');
    expect(alert.threshold).toBe('> 240');
    expect(alert.severity).toBe('Critical');
    expect(alert.status).toBe('Pending');
    expect(alert.diagnosis).toBeUndefined();
  });

  it('maps severity from level 1/2/3 to Info/Warning/Critical', () => {
    expect(mapEngineAlertToUiAlert(baseEngineAlert({ level: 1 })).severity).toBe('Info');
    expect(mapEngineAlertToUiAlert(baseEngineAlert({ level: 2 })).severity).toBe('Warning');
    expect(mapEngineAlertToUiAlert(baseEngineAlert({ level: 3 })).severity).toBe('Critical');
  });

  it('derives Diagnosing status when a diagnosis was requested but has not completed yet', () => {
    const alert = mapEngineAlertToUiAlert(baseEngineAlert({
      diagnosisRequestedAt: '2026-07-05T09:15:00',
      diagnosisTime: null,
    }));

    expect(alert.status).toBe('Diagnosing');
  });

  it('derives Diagnosed status once diagnosisTime is at/after the request', () => {
    const alert = mapEngineAlertToUiAlert(baseEngineAlert({
      diagnosisStatus: 2,
      diagnosisRequestedAt: '2026-07-05T09:15:00',
      diagnosisTime: '2026-07-05T09:15:30',
      rootCause: 'Cooling circuit restriction',
      suggestion: 'Inspect coolant flow',
      confidence: 82,
      diagnosisDetail: JSON.stringify({
        timeline: [{ title: 'Anomaly detected', description: 'Temperature crossed threshold' }],
        suggestedActionPlan: [{ text: 'Inspect coolant flow at circuit B' }],
      }),
    }));

    expect(alert.status).toBe('Diagnosed');
    expect(alert.diagnosis).toBeDefined();
    expect(alert.diagnosis!.rootCause).toBe('Cooling circuit restriction');
    expect(alert.diagnosis!.confidence).toBe(82);
    expect(alert.diagnosis!.timeline).toHaveLength(1);
    expect(alert.diagnosis!.timeline[0].title).toBe('Anomaly detected');
    expect(alert.diagnosis!.suggestedActionPlan).toHaveLength(1);
    expect(alert.diagnosis!.suggestedActionPlan[0].text).toBe('Inspect coolant flow at circuit B');
    expect(alert.diagnosis!.suggestedActionPlan[0].completed).toBe(false);
    expect(alert.diagnosis!.suggestedActionPlan[0].id).toBeDefined();
  });

  it('diagnosisStatus 1 (human review required) also derives Diagnosed with an auto-approved=false diagnosis', () => {
    const alert = mapEngineAlertToUiAlert(baseEngineAlert({
      diagnosisStatus: 1,
      diagnosisTime: '2026-07-05T09:15:30',
      rootCause: 'Uncertain cause',
      confidence: 35,
    }));

    expect(alert.status).toBe('Diagnosed');
    expect(alert.diagnosis!.approved).toBe(false);
    expect(alert.diagnosis!.approvedAt).toBeUndefined();
  });

  it('malformed garbage diagnosisDetail does not throw and yields an empty actionPlan with the raw text preserved as a single timeline entry', () => {
    const alert = mapEngineAlertToUiAlert(baseEngineAlert({
      diagnosisStatus: 2,
      diagnosisTime: '2026-07-05T09:15:30',
      rootCause: 'cause',
      confidence: 90,
      diagnosisDetail: 'not valid json {{{',
    }));

    expect(alert.diagnosis!.timeline).toHaveLength(1);
    expect(alert.diagnosis!.timeline[0].description).toBe('not valid json {{{');
    expect(alert.diagnosis!.suggestedActionPlan).toEqual([]);
  });

  // 91 of 100 alerts in the live database were diagnosed before diagnosisDetail was restructured
  // to JSON and still hold free-text Chinese prose — JSON.parse throws on these, and the previous
  // adapter silently dropped them to {}, rendering a blank Timeline for the vast majority of real
  // alerts. Falling back to a single synthetic timeline entry (instead of an empty array) is what
  // fixes the "empty UI fields" bug — the diagnosis is real and should still render, just
  // unstructured.
  it('legacy plain-text diagnosisDetail (pre-JSON-restructuring rows) renders as a single fallback timeline entry instead of blank', () => {
    const legacyProse = '设备DK_INJ_002在过去一段时间内多次触发了"空压机排气压力超限"和"空压机排气温度过高"的警报。建议立即采取措施检查和清洁设备的相关部件。';
    const alert = mapEngineAlertToUiAlert(baseEngineAlert({
      diagnosisStatus: 2,
      diagnosisTime: '2026-07-04T11:04:20.306108',
      rootCause: '排气管路堵塞或冷却系统故障',
      suggestion: '检查和清洁排气管路',
      confidence: 85,
      diagnosisDetail: legacyProse,
    }));

    expect(alert.diagnosis!.timeline).toHaveLength(1);
    expect(alert.diagnosis!.timeline[0].description).toBe(legacyProse);
    expect(alert.diagnosis!.timeline[0].title).toBeTruthy();
    expect(alert.diagnosis!.suggestedActionPlan).toEqual([]);
    // rootCause/suggestion/confidence come from their own separate fields, unaffected by
    // diagnosisDetail's format — they must still render correctly for legacy rows too.
    expect(alert.diagnosis!.rootCause).toBe('排气管路堵塞或冷却系统故障');
    expect(alert.diagnosis!.confidence).toBe(85);
  });

  it('empty-string diagnosisDetail (no narrative recorded) yields an empty timeline, not a fallback entry', () => {
    const alert = mapEngineAlertToUiAlert(baseEngineAlert({
      diagnosisStatus: 2,
      diagnosisTime: '2026-07-05T09:15:30',
      rootCause: 'cause',
      confidence: 90,
      diagnosisDetail: '',
    }));

    expect(alert.diagnosis!.timeline).toEqual([]);
  });

  it('missing ruleOperator/ruleThreshold falls back to a safe placeholder instead of "undefined undefined"', () => {
    const alert = mapEngineAlertToUiAlert(baseEngineAlert({ ruleOperator: null, ruleThreshold: null }));

    expect(alert.threshold).toBe('--');
  });

  it('approved reflects the engine\'s real handleStatus field — there is no separate isApproved field on the wire', () => {
    const unhandled = mapEngineAlertToUiAlert(baseEngineAlert({
      diagnosisStatus: 2,
      diagnosisTime: '2026-07-05T09:15:30',
      rootCause: 'cause',
      confidence: 95,
      handleStatus: 0,
    }));
    expect(unhandled.diagnosis!.approved).toBe(false);

    const handled = mapEngineAlertToUiAlert(baseEngineAlert({
      diagnosisStatus: 2,
      diagnosisTime: '2026-07-05T09:15:30',
      rootCause: 'cause',
      confidence: 95,
      handleStatus: 1,
    }));
    expect(handled.diagnosis!.approved).toBe(true);
  });

  it('approvedAt is mapped from the engine\'s real approved_at column when the alert has been approved', () => {
    const alert = mapEngineAlertToUiAlert(baseEngineAlert({
      diagnosisStatus: 2,
      diagnosisTime: '2026-07-05T09:15:30',
      rootCause: 'cause',
      confidence: 95,
      handleStatus: 1,
      approvedAt: '2026-07-05T20:00:00',
    }));

    expect(alert.diagnosis!.approvedAt).toBe('2026-07-05T20:00:00');
  });

  it('approvedAt stays undefined when the alert has not been approved yet', () => {
    const alert = mapEngineAlertToUiAlert(baseEngineAlert({
      diagnosisStatus: 2,
      diagnosisTime: '2026-07-05T09:15:30',
      rootCause: 'cause',
      confidence: 95,
      handleStatus: 0,
      approvedAt: null,
    }));

    expect(alert.diagnosis!.approvedAt).toBeUndefined();
  });

  // Matches the original mock's approve-action behavior: approving marks every action-plan
  // item completed, not just the alert as a whole. The engine has no per-step completion
  // tracking (deferred, would need a new table), so this is derived entirely from the
  // whole-alert approved flag rather than sourced from the backend.
  it('approving an alert marks every suggestedActionPlan item completed, not just the alert', () => {
    const alert = mapEngineAlertToUiAlert(baseEngineAlert({
      diagnosisStatus: 2,
      diagnosisTime: '2026-07-05T09:15:30',
      rootCause: 'cause',
      confidence: 90,
      handleStatus: 1,
      diagnosisDetail: JSON.stringify({
        timeline: [],
        suggestedActionPlan: [{ text: 'Inspect coolant flow' }, { text: 'Replace filter' }],
      }),
    }));

    expect(alert.diagnosis!.suggestedActionPlan).toHaveLength(2);
    alert.diagnosis!.suggestedActionPlan.forEach(item => expect(item.completed).toBe(true));
  });
});
