import { get, post } from '@/src/api/client';
import { Device } from '@/src/types';

export interface AddDevicePayload {
  name: string;
  location: string;
  metricName: string;
  initialValue: string;
  unit: string;
  status: 'ONLINE' | 'OFFLINE' | 'WARNING';
}

export function fetchDevices(): Promise<Device[]> {
  return get<Device[]>('/api/devices');
}

export function addDevice(payload: AddDevicePayload): Promise<Device> {
  return post<Device>('/api/devices', payload);
}
