import { Alert } from '@/src/types';

/**
 * True if `incoming` should win over `cached` — i.e. it's not stale.
 * Two independent WS push paths write the same alert over time (AlertWsBridgeConsumer via Kafka,
 * and DiagnosisAgentService's direct writeBack push), with no relative ordering guarantee between
 * them (see docs/superpowers/specs/2026-07-06-websocket-realtime-design.md in spark-agent-engine).
 * updateTime (BaseEntity, bumped on every save) is the tiebreaker. If either side lacks a
 * timestamp, prefer accepting the incoming push — a REST-sourced cached alert (no updateTime) is
 * always considered staler than any WS push, since WS pushes only fire after a newer DB write.
 */
export function isNewerAlert(incoming: Alert, cached: Alert | undefined): boolean {
  if (!cached) return true;
  if (!incoming.updateTime || !cached.updateTime) return true;
  return Date.parse(incoming.updateTime) >= Date.parse(cached.updateTime);
}

/**
 * Merges one incoming alert (from /topic/alerts or /topic/diagnosis/{alertId}) into the cached
 * alert list. New alerts are prepended (matching the engine's newest-first ordering). Returns the
 * same array reference when the incoming alert is stale, so callers can skip a cache write/rerender.
 */
export function mergeIncomingAlert(alerts: Alert[], incoming: Alert): Alert[] {
  const existingIndex = alerts.findIndex(a => a.id === incoming.id);
  if (existingIndex === -1) {
    return [incoming, ...alerts];
  }

  if (!isNewerAlert(incoming, alerts[existingIndex])) {
    return alerts;
  }

  const next = alerts.slice();
  next[existingIndex] = incoming;
  return next;
}
