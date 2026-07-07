// Mirrors spark-agent-engine's WS payload shapes (TelemetryWsBridgeConsumer.TelemetrySnapshot,
// com.spark.agent.ws.DeviceStatusEvent) — see
// spark-agent-engine/docs/superpowers/specs/2026-07-06-websocket-realtime-design.md.

export interface TelemetrySnapshot {
  deviceKey: string;
  properties: Record<string, unknown>;
  reportTime: string | null;
}

export interface DeviceStatusEvent {
  deviceKey: string;
  online: boolean;
  changedAt: string;
}
