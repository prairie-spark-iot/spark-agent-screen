import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { fetchTelemetrySync, TelemetrySyncResponse } from './api';
import { isWsConfigured, useWsConnected } from '@/src/lib/ws/client';

export const telemetryQueryKey = ['telemetry', 'sync'] as const;

/**
 * REST is now a fallback, not the primary channel: while WS is up, telemetry/alert/diagnosis/
 * device-status updates arrive via useDeviceTelemetryWS/useAlertWS/useDiagnosisWS/
 * useDeviceStatusWS and this poll is disabled. It resumes automatically whenever WS is
 * unconfigured (mock mode) or disconnected, and does one extra resync fetch right after a
 * reconnect to pick up anything missed while disconnected (Kafka/outbox has no replay-to-WS path).
 */
export function useTelemetrySync() {
  const wsConnected = useWsConnected();
  const shouldPoll = !isWsConfigured() || !wsConnected;

  const query = useQuery<TelemetrySyncResponse>({
    queryKey: telemetryQueryKey,
    queryFn: fetchTelemetrySync,
    refetchInterval: shouldPoll ? 4000 : false,
    refetchIntervalInBackground: false,
  });

  const wasConnectedRef = useRef(wsConnected);
  useEffect(() => {
    if (wsConnected && !wasConnectedRef.current) {
      query.refetch();
    }
    wasConnectedRef.current = wsConnected;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wsConnected]);

  return query;
}
