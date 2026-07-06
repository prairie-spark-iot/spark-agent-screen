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
const TELEMETRY_LABELS: Record<string, string> = {
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
