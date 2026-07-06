import { useQuery } from '@tanstack/react-query';
import { fetchTelemetrySync, TelemetrySyncResponse } from './api';

export const telemetryQueryKey = ['telemetry', 'sync'] as const;

export function useTelemetrySync() {
  return useQuery<TelemetrySyncResponse>({
    queryKey: telemetryQueryKey,
    queryFn: fetchTelemetrySync,
    refetchInterval: 4000,
    refetchIntervalInBackground: false,
  });
}
