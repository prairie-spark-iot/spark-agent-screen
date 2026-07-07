import { Device } from '@/src/types';

// Shapes returned by spark-agent-engine's GET /api/devices (DeviceResponse / DeviceLatestResponse
// records) — see spark-agent-docs/phase-1-2-api-data-contracts.md.
export interface EngineTelemetry {
  deviceKey: string;
  identifier: string;
  value: string;
  valueNum: number | null;
  quality: number | null;
  reportTime: string;
}

export interface EngineDevice {
  deviceKey: string;
  deviceName: string;
  productKey: string | null;
  online: boolean;
  telemetry: EngineTelemetry[];
}

// identifier -> label/unit are BFF-side static lookups rather than a backend change, per
// phase-1-2-api-data-contracts.md §2 — these rarely change and don't warrant round-tripping
// through the engine. Sourced from spark-agent-simulator/config.py's PRODUCTS attribute specs.
export const TELEMETRY_LABELS: Record<string, string> = {
  temperature: 'TEMPERATURE',
  pressure: 'PRESSURE',
  current: 'CURRENT',
  speed: 'SPEED',
  humidity: 'HUMIDITY',
};

const TELEMETRY_UNITS: Record<string, string> = {
  temperature: '℃',
  pressure: 'bar',
  current: 'A',
  speed: 'rpm',
  humidity: '%',
};

const PRODUCT_ICONS: Record<string, string> = {
  PK_INJECTION_MA: 'precision_manufacturing',
  PK_COMPRESSOR_GA: 'wind_power',
  PK_TEMPCTRL_TC100: 'electrical_services',
};

const DEFAULT_ICON = 'precision_manufacturing';

// Reverse of TELEMETRY_LABELS — needed to map a live WS telemetry snapshot (keyed by the engine's
// raw identifier, e.g. "temperature") back onto a Device already resolved to its display label
// (e.g. "TEMPERATURE"), since the WS payload (TelemetryWsBridgeConsumer.TelemetrySnapshot) has no
// productKey to redo the PRIMARY_METRIC_BY_PRODUCT lookup from scratch — reusing whichever
// identifier is already the device's displayed metric is the only info available at merge time.
const IDENTIFIER_BY_LABEL: Record<string, string> = Object.fromEntries(
  Object.entries(TELEMETRY_LABELS).map(([identifier, label]) => [label, identifier])
);

export function identifierForMetricName(metricName: string): string {
  return IDENTIFIER_BY_LABEL[metricName] ?? metricName.toLowerCase();
}

/**
 * Merges one coalesced WS telemetry snapshot (one device, all properties that changed within the
 * engine's ~400ms coalescing window) onto a cached Device. Only touches value/sparkline for the
 * device's already-resolved primary identifier — if that identifier isn't part of this particular
 * snapshot (a different property on the same device changed instead), the device is returned
 * unchanged (same reference) so callers/memoization can no-op.
 */
export function applyTelemetrySnapshot(
  device: Device,
  snapshot: { properties: Record<string, unknown> }
): Device {
  const identifier = identifierForMetricName(device.metricName);
  const raw = snapshot.properties[identifier];
  if (raw === undefined || raw === null) return device;

  const numericValue = typeof raw === 'number' ? raw : parseFloat(String(raw));
  if (!Number.isFinite(numericValue)) return device;

  return {
    ...device,
    value: String(raw),
    sparkline: [...device.sparkline.slice(1), numericValue],
  };
}

// The live engine returns telemetry[] ordered alphabetically by identifier (an artifact of the
// underlying query, not a semantic ordering) — e.g. an injection molder returns
// [current, pressure, temperature]. Blindly taking telemetry[0] headlines the wrong metric
// (CURRENT instead of TEMPERATURE), which is exactly the "data mismatch" observed in real E2E
// testing against the live engine. This table picks the product-appropriate primary metric;
// telemetry[0] is still the fallback when the preferred identifier isn't present (new product
// types, or a device that hasn't reported that property yet). No "primary metric" concept exists
// in the product/thing-model config yet (owned by spark-iot-agent) — this stays a BFF-side
// lookup, same reasoning as TELEMETRY_LABELS/TELEMETRY_UNITS above, until that changes.
const PRIMARY_METRIC_BY_PRODUCT: Record<string, string> = {
  PK_INJECTION_MA: 'temperature',
  PK_COMPRESSOR_GA: 'pressure',
  PK_TEMPCTRL_TC100: 'temperature',
};

/**
 * Maps the engine's multi-property telemetry[] array onto the frontend's legacy single-metric
 * Device shape.
 *
 * location has no backend source yet (aiot_device has no location column — a real DDL change
 * owned by spark-iot-agent, not yet decided/applied) so it's a placeholder here, not silently
 * dropped or guessed.
 *
 * WARNING device status (derived from "online AND has an unresolved alert" in the frozen
 * contract) is NOT computed here — this adapter only has device data, not alert data, in scope.
 * Only ONLINE/OFFLINE are mapped for now; wiring WARNING is follow-up work once this route needs
 * to cross-reference alerts.
 */
export function mapEngineDeviceToUiDevice(engineDevice: EngineDevice): Device {
  const preferredIdentifier = engineDevice.productKey ? PRIMARY_METRIC_BY_PRODUCT[engineDevice.productKey] : undefined;
  const primary = engineDevice.telemetry.find(t => t.identifier === preferredIdentifier) ?? engineDevice.telemetry[0];
  const identifier = primary?.identifier;

  const metricName = identifier ? (TELEMETRY_LABELS[identifier] ?? identifier.toUpperCase()) : 'UNKNOWN';
  const unit = identifier ? (TELEMETRY_UNITS[identifier] ?? '') : '';
  const value = primary?.value ?? '--';
  const numericValue = primary ? parseFloat(primary.value) : NaN;
  const sparklinePoint = Number.isFinite(numericValue) ? numericValue : 0;

  return {
    id: engineDevice.deviceKey,
    name: engineDevice.deviceName,
    status: engineDevice.online ? 'ONLINE' : 'OFFLINE',
    location: 'Unassigned',
    metricName,
    value,
    unit,
    sparkline: Array(9).fill(sparklinePoint),
    icon: (engineDevice.productKey && PRODUCT_ICONS[engineDevice.productKey]) || DEFAULT_ICON,
  };
}

export interface EngineDeviceHistoryPoint {
  deviceKey: string;
  identifier: string;
  value: string;
  valueNum: number | null;
  quality: number | null;
  reportTime: string;
}

const SPARKLINE_LENGTH = 9;

/**
 * Fetches the last SPARKLINE_LENGTH historical samples for one device/identifier from the engine
 * and returns them oldest-first (matching the sparkline convention: newest value is always
 * appended last via applyTelemetrySnapshot's slice(1)+push). Never throws — any failure (network,
 * non-2xx, empty history, unparseable values) falls back to a flat array of `fallback`, so callers
 * can always safely use the result as a drop-in replacement for Array(9).fill(fallback).
 */
export async function fetchSparklineHistory(
  baseUrl: string,
  deviceKey: string,
  identifier: string,
  fallback: number
): Promise<number[]> {
  const flat = () => Array(SPARKLINE_LENGTH).fill(fallback);
  try {
    const res = await fetch(
      `${baseUrl}/api/device/${encodeURIComponent(deviceKey)}/history?identifier=${encodeURIComponent(identifier)}&limit=${SPARKLINE_LENGTH}`,
      { cache: 'no-store' }
    );
    if (!res.ok) return flat();
    const body: { code: number; data: EngineDeviceHistoryPoint[] } = await res.json();
    if (body.code !== 0 || !body.data?.length) return flat();

    const oldestFirst = [...body.data].reverse();
    const values = oldestFirst
      .map(p => (typeof p.valueNum === 'number' ? p.valueNum : parseFloat(p.value)))
      .filter((v): v is number => Number.isFinite(v));

    if (values.length === 0) return flat();

    // Left-pad with the oldest known sample if the device doesn't have SPARKLINE_LENGTH
    // samples yet (e.g. just provisioned) — callers (DeviceCard) index sparkline[0..8]
    // directly and require exactly this length.
    return values.length < SPARKLINE_LENGTH
      ? [...Array(SPARKLINE_LENGTH - values.length).fill(values[0]), ...values]
      : values.slice(-SPARKLINE_LENGTH);
  } catch {
    return flat();
  }
}

/** Replaces a mapped Device's flat-filled sparkline with real history from the engine. Never
 *  throws (fetchSparklineHistory always resolves), so this is always safe to Promise.all(). */
export async function withRealSparkline(baseUrl: string, device: Device): Promise<Device> {
  const identifier = identifierForMetricName(device.metricName);
  const fallback = parseFloat(device.value);
  const sparkline = await fetchSparklineHistory(baseUrl, device.id, identifier, Number.isFinite(fallback) ? fallback : 0);
  return { ...device, sparkline };
}
