import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTelemetrySync, telemetryQueryKey } from '@/src/features/telemetry/hooks';
import type { TelemetrySyncResponse } from '@/src/features/telemetry/api';
import { diagnoseAlert, approveAlertAction, autoDiagnoseAllAlerts } from './api';
import { Alert } from '@/src/types';

export function useAlerts() {
  const { data, ...rest } = useTelemetrySync();
  return { alerts: data?.alerts ?? [], ...rest };
}

function setAlertInCache(queryClient: ReturnType<typeof useQueryClient>, alertId: string, updater: (a: Alert) => Alert) {
  queryClient.setQueryData<TelemetrySyncResponse>(telemetryQueryKey, (prev) =>
    prev ? { ...prev, alerts: prev.alerts.map(a => (a.id === alertId ? updater(a) : a)) } : prev
  );
}

export function useDiagnoseAlert() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: diagnoseAlert,
    onMutate: async (alertId: string) => {
      setAlertInCache(queryClient, alertId, (a) => ({ ...a, status: 'Diagnosing' }));
    },
    onSuccess: (updatedAlert) => {
      setAlertInCache(queryClient, updatedAlert.id, () => updatedAlert);
    },
    onError: (_err, alertId) => {
      setAlertInCache(queryClient, alertId, (a) => ({ ...a, status: 'Pending' }));
    },
  });
}

export function useApproveAlertAction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: approveAlertAction,
    onSuccess: (updatedAlert) => {
      setAlertInCache(queryClient, updatedAlert.id, () => updatedAlert);
    },
  });
}

export function useAutoDiagnoseAllAlerts() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: autoDiagnoseAllAlerts,
    onSuccess: (updatedAlerts) => {
      queryClient.setQueryData<TelemetrySyncResponse>(telemetryQueryKey, (prev) =>
        prev ? { ...prev, alerts: updatedAlerts } : prev
      );
    },
  });
}
