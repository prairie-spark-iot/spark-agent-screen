import { get } from '@/src/api/client';
import { Alert, Device, Doc } from '@/src/types';

export interface TelemetrySyncResponse {
  alerts: Alert[];
  devices: Device[];
  documents: Doc[];
}

export function fetchTelemetrySync(): Promise<TelemetrySyncResponse> {
  return get<TelemetrySyncResponse>('/api/telemetry/sync');
}
