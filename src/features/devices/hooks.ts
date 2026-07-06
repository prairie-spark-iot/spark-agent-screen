import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTelemetrySync, telemetryQueryKey } from '@/src/features/telemetry/hooks';
import type { TelemetrySyncResponse } from '@/src/features/telemetry/api';
import { addDevice } from './api';
import { Device } from '@/src/types';

export function useDevices() {
  const { data, ...rest } = useTelemetrySync();
  return { devices: data?.devices ?? [], ...rest };
}

export function useAddDevice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addDevice,
    onSuccess: (newDevice) => {
      queryClient.setQueryData<TelemetrySyncResponse>(telemetryQueryKey, (prev) =>
        prev ? { ...prev, devices: [...prev.devices, newDevice] } : prev
      );
    },
  });
}

export function useUpdateDeviceStatusLocal() {
  const queryClient = useQueryClient();
  return (deviceId: string, newStatus: Device['status']) => {
    queryClient.setQueryData<TelemetrySyncResponse>(telemetryQueryKey, (prev) =>
      prev
        ? { ...prev, devices: prev.devices.map(d => (d.id === deviceId ? { ...d, status: newStatus } : d)) }
        : prev
    );
  };
}

export function addFallbackDeviceToCache(queryClient: ReturnType<typeof useQueryClient>, newDevice: Device) {
  queryClient.setQueryData<TelemetrySyncResponse>(telemetryQueryKey, (prev) =>
    prev ? { ...prev, devices: [...prev.devices, newDevice] } : prev
  );
}
