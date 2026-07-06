import { get, post } from '@/src/api/client';
import { Alert } from '@/src/types';

export function fetchAlerts(): Promise<Alert[]> {
  return get<Alert[]>('/api/alerts');
}

export function diagnoseAlert(alertId: string): Promise<Alert> {
  return post<Alert>(`/api/alerts/diagnose/${alertId}`);
}

export function approveAlertAction(alertId: string): Promise<Alert> {
  return post<Alert>(`/api/alerts/approve-action/${alertId}`);
}

export async function autoDiagnoseAllAlerts(): Promise<Alert[]> {
  const data = await post<{ alerts?: Alert[] } | Alert[]>('/api/alerts/auto-diagnose-all');
  return Array.isArray(data) ? data : data.alerts ?? [];
}
