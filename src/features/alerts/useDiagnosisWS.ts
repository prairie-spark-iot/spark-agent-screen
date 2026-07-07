'use client';

import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { mapEngineAlertToUiAlert, type EngineAlert } from '@/lib/adapters/alertAdapter';
import { useTopicSet } from '@/src/lib/ws/client';
import { mergeIncomingAlert } from '@/src/lib/ws/merge';
import { telemetryQueryKey, useTelemetrySync } from '@/src/features/telemetry/hooks';
import type { TelemetrySyncResponse } from '@/src/features/telemetry/api';

/**
 * Subscribes to /topic/diagnosis/{alertId} for every alert currently "Diagnosing" — this is the
 * ONLY channel the diagnosis-complete transition arrives on (DiagnosisAgentService.writeBack pushes
 * here directly, not to /topic/alerts), so it has to be a per-alert dynamic subscription set, not
 * one shared topic. Reuses the same mergeIncomingAlert last-write-wins logic as useAlertWS since
 * both write to the same cached alert entities.
 */
export function useDiagnosisWS(): void {
  const queryClient = useQueryClient();
  const { data } = useTelemetrySync();
  const diagnosingAlertIds = (data?.alerts ?? []).filter(a => a.status === 'Diagnosing').map(a => a.id);

  const handleMessage = useCallback((_alertId: string, payload: unknown) => {
    const incoming = mapEngineAlertToUiAlert(payload as EngineAlert);
    queryClient.setQueryData<TelemetrySyncResponse>(telemetryQueryKey, prev => {
      if (!prev) return prev;
      const alerts = mergeIncomingAlert(prev.alerts, incoming);
      if (alerts === prev.alerts) return prev;
      return { ...prev, alerts };
    });
  }, [queryClient]);

  useTopicSet(diagnosingAlertIds, alertId => `/topic/diagnosis/${alertId}`, handleMessage);
}
