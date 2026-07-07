'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { mapEngineAlertToUiAlert, type EngineAlert } from '@/lib/adapters/alertAdapter';
import { subscribeTopic } from '@/src/lib/ws/client';
import { mergeIncomingAlert } from '@/src/lib/ws/merge';
import { telemetryQueryKey } from '@/src/features/telemetry/hooks';
import type { TelemetrySyncResponse } from '@/src/features/telemetry/api';

/**
 * Subscribes to /topic/alerts (new alert created, or an existing alert's state changed — e.g. a
 * manual re-diagnose request flipping it to "Diagnosing"). Merges via mergeIncomingAlert, which
 * applies the updateTime last-write-wins rule against a possibly-newer push already applied by
 * useDiagnosisWS. No-ops when NEXT_PUBLIC_BACKEND_WS_URL is unset.
 */
export function useAlertWS(): void {
  const queryClient = useQueryClient();

  useEffect(() => {
    return subscribeTopic('/topic/alerts', payload => {
      const incoming = mapEngineAlertToUiAlert(payload as EngineAlert);
      queryClient.setQueryData<TelemetrySyncResponse>(telemetryQueryKey, prev => {
        if (!prev) return prev;
        const alerts = mergeIncomingAlert(prev.alerts, incoming);
        if (alerts === prev.alerts) return prev;
        return { ...prev, alerts };
      });
    });
  }, [queryClient]);
}
