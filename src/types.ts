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
