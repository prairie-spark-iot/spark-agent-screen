'use client';

import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { applyTelemetrySnapshot } from '@/lib/adapters/deviceAdapter';
import { useTopicSet } from '@/src/lib/ws/client';
import type { TelemetrySnapshot } from '@/src/lib/ws/types';
import { telemetryQueryKey, useTelemetrySync } from './hooks';
import type { TelemetrySyncResponse } from './api';

/**
 * Subscribes to /topic/telemetry/{deviceKey} for every device currently known to the cache,
 * updating each device's value/sparkline in place as coalesced snapshots arrive. No-ops (via
 * useTopicSet -> subscribeTopic) when NEXT_PUBLIC_BACKEND_WS_URL is unset — the existing 4s REST
 * poll (useTelemetrySync) keeps working unchanged in that case.
 */
export function useDeviceTelemetryWS(): void {
  const queryClient = useQueryClient();
  const { data } = useTelemetrySync();
  const deviceKeys = (data?.devices ?? []).map(d => d.id);

  const handleMessage = useCallback((deviceKey: string, payload: unknown) => {
    const snapshot = payload as TelemetrySnapshot;
    queryClient.setQueryData<TelemetrySyncResponse>(telemetryQueryKey, (prev) => {
      if (!prev) return prev;
      const index = prev.devices.findIndex(d => d.id === deviceKey);
      if (index === -1) return prev;

      const updated = applyTelemetrySnapshot(prev.devices[index], snapshot);
      if (updated === prev.devices[index]) return prev; // no matching property this tick

      const devices = prev.devices.slice();
      devices[index] = updated;
      return { ...prev, devices };
    });
  }, [queryClient]);

  useTopicSet(deviceKeys, deviceKey => `/topic/telemetry/${deviceKey}`, handleMessage);
}
