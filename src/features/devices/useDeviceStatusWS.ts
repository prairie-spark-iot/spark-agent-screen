'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { subscribeTopic } from '@/src/lib/ws/client';
import type { DeviceStatusEvent } from '@/src/lib/ws/types';
import { telemetryQueryKey } from '@/src/features/telemetry/hooks';
import type { TelemetrySyncResponse } from '@/src/features/telemetry/api';

/**
 * Subscribes to the shared /topic/devices/status (online/offline transitions for every device —
 * not per-device topics, since every device-table view wants all of them, see the engine-side
 * design spec). Not one of the three hooks named in the original Phase 4 ask, but required to make
 * "live device table" (Phase 4 Step 4) actually live for status, not just telemetry values —
 * device online/offline was one of the four real-time flows identified in Phase 1.
 */
export function useDeviceStatusWS(): void {
  const queryClient = useQueryClient();

  useEffect(() => {
    return subscribeTopic('/topic/devices/status', payload => {
      const event = payload as DeviceStatusEvent;
      queryClient.setQueryData<TelemetrySyncResponse>(telemetryQueryKey, prev => {
        if (!prev) return prev;
        const index = prev.devices.findIndex(d => d.id === event.deviceKey);
        if (index === -1) return prev;

        const newStatus = event.online ? 'ONLINE' : 'OFFLINE';
        if (prev.devices[index].status === newStatus) return prev;

        const devices = prev.devices.slice();
        devices[index] = { ...devices[index], status: newStatus };
        return { ...prev, devices };
      });
    });
  }, [queryClient]);
}
