export type Severity = 'Critical' | 'Warning' | 'Info';
export type DiagnosisStatus = 'Pending' | 'Diagnosing' | 'Diagnosed';

export interface Alert {
  id: string;
  time: string; // UTC or Relative
  timestamp: string; // ISO string
  device: string;
  metric: string;
  triggerValue: string;
  threshold: string;
  severity: Severity;
  status: DiagnosisStatus;
  details?: string;
  icon?: string;
  diagnosis?: DiagnosisReport;
  // BaseEntity.updateTime from the engine, carried through only on alerts sourced from a WS push
  // (see lib/adapters/alertAdapter.ts, src/lib/ws/merge.ts) — used for last-write-wins ordering
  // between the /topic/alerts and /topic/diagnosis/{alertId} push paths, which have no relative
  // ordering guarantee between them. Absent on alerts sourced from REST.
  updateTime?: string;
}

export interface DiagnosisReport {
  rootCause: string;
  confidence: number; // 0-100
  timeline: {
    title: string;
    description: string;
    metrics?: { label: string; value: string; status?: 'normal' | 'error' | 'warning' }[];
    docs?: string[];
  }[];
  suggestedActionPlan: {
    id: string;
    text: string;
    completed: boolean;
  }[];
  approved: boolean;
  approvedAt?: string;
}

export interface Device {
  id: string;
  name: string;
  status: 'ONLINE' | 'OFFLINE' | 'WARNING';
  location: string;
  metricName: string;
  value: string;
  unit: string;
  sparkline: number[];
  icon: string;
}

export interface Doc {
  id: string;
  name: string;
  type: 'Manual' | 'Log File' | 'Safety';
  dateAdded: string;
  status?: string;
}
