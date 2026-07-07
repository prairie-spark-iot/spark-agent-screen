import { Alert, Device, Doc } from "@/src/types";

/**
 * Per-metric decimal precision for display values.
 * TEMPERATURE / LOAD: 1 decimal (84.2°C, 82.1%)
 * PRESSURE / VIBRATION / CURRENT: 2 decimals (12.40 MPa, 4.80 mm/s)
 * AIRFLOW / SPEED: 0 decimals (1250 CFM)
 */
const METRIC_DECIMALS: Record<string, number> = {
  TEMPERATURE: 1,
  PRESSURE: 2,
  VIBRATION: 2,
  CURRENT: 2,
  SPEED: 0,
  AIRFLOW: 0,
  LOAD: 1,
};

function formatMetricValue(value: number, metricName: string): string {
  const dp = METRIC_DECIMALS[metricName] ?? 1;
  return value.toFixed(dp);
}

// In-Memory Database State Initializers
export const initialAlerts = (): Alert[] => [
  {
    id: 'alert-1',
    time: '14:32:05',
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
    device: 'Core-Router-US-E1',
    metric: 'Thermal Threshold Exceeded',
    triggerValue: '92.5 °C',
    threshold: '85.0 °C',
    severity: 'Critical',
    status: 'Pending',
    details: 'Thermal sensor in core router detected temperature exceeding maximum limit. Packet drops imminent.',
    icon: 'router'
  },
  {
    id: 'alert-2',
    time: '14:28:11',
    timestamp: new Date(Date.now() - 34 * 60000).toISOString(),
    device: 'DB-Cluster-02',
    metric: 'CPU Utilization Spike',
    triggerValue: '88.2 %',
    threshold: '80.0 %',
    severity: 'Warning',
    status: 'Diagnosed',
    details: 'Database cluster CPU resource allocation has spiked beyond standard operating bounds.',
    icon: 'dns',
    diagnosis: {
      rootCause: 'Database Query Plan Inefficiency',
      confidence: 91,
      timeline: [
        {
          title: 'Analyzed resource logs',
          description: 'Inspected DB-Cluster-02 thread pools and process logs. Identified heavy write operations.',
          metrics: [
            { label: 'CPU Usage', value: '88.2%', status: 'warning' },
            { label: 'Active Conn', value: '412', status: 'normal' }
          ]
        },
        {
          title: 'Discovered missing indexes',
          description: 'Identified unindexed JOIN query on customer_transactions table executing 12,000 times/min.',
          docs: ['DB_Schema_v3.sql']
        }
      ],
      suggestedActionPlan: [
        { id: 'ap-db-1', text: 'Apply missing composite index to customer_transactions(customer_id, created_at)', completed: false },
        { id: 'ap-db-2', text: 'Kill lock-holding process PID 4125', completed: true }
      ],
      approved: false
    }
  },
  {
    id: 'alert-3',
    time: '13:55:00',
    timestamp: new Date(Date.now() - 67 * 60000).toISOString(),
    device: 'Storage-Node-A',
    metric: 'Routine Backup Initiated',
    triggerValue: '--',
    threshold: '--',
    severity: 'Info',
    status: 'Pending',
    details: 'Routine full-volume backup sequence has been successfully initiated by automated cron system.',
    icon: 'dns'
  },
  {
    id: 'alert-4',
    time: '13:10:45',
    timestamp: new Date(Date.now() - 111 * 60000).toISOString(),
    device: 'Auth-Gateway-EU',
    metric: 'Unusual Login Rate Detected',
    triggerValue: '542 /sec',
    threshold: '100 /sec',
    severity: 'Critical',
    status: 'Pending',
    details: 'Security module detected login requests far exceeding baseline maximum, suggesting possible brute force or credential stuffing campaign.',
    icon: 'security'
  },
  {
    id: 'alert-5',
    time: '10:42:15',
    timestamp: new Date(Date.now() - 260 * 60000).toISOString(),
    device: 'Pump-04-North',
    metric: 'Vibration threshold exceeded',
    triggerValue: '12.4 mm/s',
    threshold: '5.0 mm/s',
    severity: 'Critical',
    status: 'Diagnosed',
    details: 'Hydraulic high-pressure pump 04 (North segment) vibration levels exceeded warning limits.',
    icon: 'precision_manufacturing',
    diagnosis: {
      rootCause: 'Mechanical Valve Failure',
      confidence: 87,
      timeline: [
        {
          title: 'Collected telemetry context',
          description: 'Telemetry readings indicate normal core temperature but severe vibration delta on main pump casing.',
          metrics: [
            { label: 'Vibration', value: '12.4 mm/s', status: 'error' },
            { label: 'Core Temp', value: '44.8 °C', status: 'normal' }
          ]
        },
        {
          title: 'Retrieved relevant knowledge docs',
          description: 'Compared vibration patterns to historical failure records.',
          docs: ['Manual_V2.pdf', 'Repair_Log_2023.txt']
        },
        {
          title: 'LLM Analysis',
          description: 'Analysis indicates severe wear on the pressure relief valve assembly (PRV-2). Vibration cycles correlate strongly with fluid flow rate drops reported upstream.'
        }
      ],
      suggestedActionPlan: [
        { id: 'ap-p-1', text: 'Isolate line segment', completed: true },
        { id: 'ap-p-2', text: 'Depressurize locally', completed: false },
        { id: 'ap-p-3', text: 'Replace PRV-2 assembly', completed: false }
      ],
      approved: false
    }
  },
  {
    id: 'alert-6',
    time: '09:15:02',
    timestamp: new Date(Date.now() - 347 * 60000).toISOString(),
    device: 'Cooling-Tower-B',
    metric: 'Flow rate dropped below nominal',
    triggerValue: '140 L/m',
    threshold: '200 L/m',
    severity: 'Warning',
    status: 'Diagnosed',
    details: 'Flow rate dropped below secondary safety limits on secondary loop B.',
    icon: 'water_damage',
    diagnosis: {
      rootCause: 'Flow Control Valve Calibration',
      confidence: 81,
      timeline: [
        {
          title: 'Sensor Delta Check',
          description: 'Detected a 30% reduction in fluid velocity over a 5-minute window.',
          metrics: [
            { label: 'Flow Rate', value: '140 L/m', status: 'warning' },
            { label: 'Inlet Press', value: '1.2 MPa', status: 'normal' }
          ]
        },
        {
          title: 'Heuristics Verification',
          description: 'Identified that mechanical valve FCV-10B had a feedback mismatch of 12 degrees.'
        }
      ],
      suggestedActionPlan: [
        { id: 'ap-ct-1', text: 'Calibrate flow control valve FCV-10B', completed: false },
        { id: 'ap-ct-2', text: 'Inspect inlet strainer for particulate blockage', completed: false }
      ],
      approved: false
    }
  },
  {
    id: 'alert-7',
    time: '08:30:55',
    timestamp: new Date(Date.now() - 391 * 60000).toISOString(),
    device: 'Sensor-Array-12',
    metric: 'Packet loss detected (4%)',
    triggerValue: '4.2 %',
    threshold: '1.0 %',
    severity: 'Warning',
    status: 'Pending',
    details: 'Network packet loss detected over serial transceiver array 12.',
    icon: 'router'
  }
];

export const initialDevices = (): Device[] => [
  {
    id: 'dev-1',
    name: '1号注塑机',
    status: 'ONLINE',
    location: 'Floor A - Section 1',
    metricName: 'TEMPERATURE',
    value: '84.2',
    unit: '°C',
    sparkline: [62, 65, 58, 74, 69, 81, 78, 84, 82],
    icon: 'precision_manufacturing'
  },
  {
    id: 'dev-2',
    name: 'Hydro-Pump 04',
    status: 'ONLINE',
    location: 'Basement - Sector C',
    metricName: 'PRESSURE',
    value: '12.40',
    unit: 'MPa',
    sparkline: [12.1, 12.3, 11.9, 12.5, 12.2, 12.4, 12.3, 12.4, 12.4],
    icon: 'water_damage'
  },
  {
    id: 'dev-3',
    name: 'Conveyor Belt B',
    status: 'OFFLINE',
    location: 'Floor B - Assembly',
    metricName: 'SPEED',
    value: '--',
    unit: 'm/s',
    sparkline: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    icon: 'conveyor_belt'
  },
  {
    id: 'dev-4',
    name: 'Ventilation Unit A',
    status: 'ONLINE',
    location: 'Roof - North',
    metricName: 'AIRFLOW',
    value: '1250',
    unit: 'CFM',
    sparkline: [1210, 1230, 1180, 1240, 1260, 1250, 1240, 1250, 1250],
    icon: 'wind_power'
  },
  {
    id: 'dev-5',
    name: 'CNC Lathe 02',
    status: 'WARNING',
    location: 'Floor A - Section 3',
    metricName: 'VIBRATION',
    value: '4.80',
    unit: 'mm/s',
    sparkline: [2.1, 4.5, 2.3, 5.2, 3.1, 4.8, 3.9, 5.1, 4.8],
    icon: 'precision_manufacturing'
  },
  {
    id: 'dev-6',
    name: 'Main Power Grid',
    status: 'ONLINE',
    location: 'Substation 1',
    metricName: 'LOAD',
    value: '82.1',
    unit: '%',
    sparkline: [80.5, 81.2, 82.0, 81.5, 82.1, 82.3, 81.9, 82.1, 82.1],
    icon: 'electrical_services'
  }
];

export const initialDocuments = (): Doc[] => [
  { id: 'doc-1', name: 'Hydraulic_Press_Manual_V2.pdf', type: 'Manual', dateAdded: '2023-10-24', status: 'Used in AI Diagnosis' },
  { id: 'doc-2', name: 'Q3_Sensor_Calibration_Log.txt', type: 'Log File', dateAdded: '2023-10-22' },
  { id: 'doc-3', name: 'Thermal_Runaway_Protocol_A.pdf', type: 'Safety', dateAdded: '2023-10-18', status: 'Used in AI Diagnosis' },
  { id: 'doc-4', name: 'DB_Schema_v3.sql', type: 'Manual', dateAdded: '2023-09-12', status: 'Used in AI Diagnosis' },
  { id: 'doc-5', name: 'PRV_Assembly_Guide.pdf', type: 'Manual', dateAdded: '2023-08-01' }
];

declare global {
  var _alerts: Alert[] | undefined;
  var _devices: Device[] | undefined;
  var _documents: Doc[] | undefined;
  var _intervalId: NodeJS.Timeout | undefined;
  var _driftCounters: Record<string, number> | undefined;
}

export const db = {
  getAlerts: () => {
    if (process.env.BACKEND_SOURCE_ALERT === 'engine') return globalThis._alerts || initialAlerts();
    if (!globalThis._alerts) {
      globalThis._alerts = initialAlerts();
    }
    const seen = new Set<string>();
    return globalThis._alerts.map((a, i) => {
      if (seen.has(a.id)) {
        const uniqueId = `${a.id}-uniq-${i}-${Date.now()}`;
        seen.add(uniqueId);
        return { ...a, id: uniqueId };
      }
      seen.add(a.id);
      return a;
    });
  },
  setAlerts: (newAlerts: Alert[]) => {
    globalThis._alerts = newAlerts;
  },
  getDevices: () => {
    if (!globalThis._devices) {
      globalThis._devices = initialDevices();
      
      // When integrated with the live engine, never start the drift simulation.
      // The engine owns device telemetry and alert generation.
      if (process.env.BACKEND_SOURCE_DEVICE === 'engine') return globalThis._devices || initialDevices();

      // Start the dynamic drift and closed-loop alert simulation interval
      if (!globalThis._intervalId) {
        globalThis._driftCounters = {};
        globalThis._intervalId = setInterval(() => {
          if (globalThis._devices) {
            if (!globalThis._driftCounters) globalThis._driftCounters = {};
            const currentAlerts = globalThis._alerts || [];

            globalThis._devices = globalThis._devices.map(dev => {
              if (dev.status === 'OFFLINE') return dev;
              const val = parseFloat(dev.value);
              if (isNaN(val)) return dev;

              // Introduce correlated drift simulation
              let noise = (Math.random() - 0.48) * (val * 0.05); // slightly upward biased drift
              let newVal = Math.max(0.1, val + noise);

              // Check drift limits for devices like CNC Lathe or Ventilation
              const safeThreshold = dev.metricName === 'VIBRATION' ? 4.5 : dev.metricName === 'PRESSURE' ? 12.0 : 999;
              if (newVal > safeThreshold) {
                globalThis._driftCounters[dev.id] = (globalThis._driftCounters[dev.id] || 0) + 1;
              } else {
                globalThis._driftCounters[dev.id] = Math.max(0, (globalThis._driftCounters[dev.id] || 0) - 1);
              }

              // Closed-loop trigger: If continuous upwards drift exceeds threshold 3 times
              if ((globalThis._driftCounters[dev.id] || 0) >= 3) {
                const hasActiveAlert = (globalThis._alerts || []).some(
                  a => (a.device === dev.name || a.device.includes(dev.name)) && (a.status === 'Pending' || a.status === 'Diagnosing')
                );

                if (!hasActiveAlert && globalThis._alerts) {
                  const newAlert: Alert = {
                    id: `alt-drift-${dev.id}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                    time: 'Just now',
                    timestamp: new Date().toISOString(),
                    device: dev.name,
                    metric: dev.metricName,
                    triggerValue: `${formatMetricValue(newVal, dev.metricName)} ${dev.unit}`,
                    threshold: `${formatMetricValue(safeThreshold, dev.metricName)} ${dev.unit}`,
                    severity: 'Critical',
                    status: 'Pending',
                    details: `Automated closed-loop trigger: Continuous upward physical drift detected (${globalThis._driftCounters[dev.id]} consecutive anomaly cycles).`
                  };
                  globalThis._alerts = [newAlert, ...globalThis._alerts];
                }
                globalThis._driftCounters[dev.id] = 0; // reset after trigger
                return {
                  ...dev,
                  status: 'WARNING',
                  value: formatMetricValue(newVal, dev.metricName),
                  sparkline: [...dev.sparkline.slice(1), parseFloat(formatMetricValue(newVal, dev.metricName))]
                };
              }

              return {
                ...dev,
                value: formatMetricValue(newVal, dev.metricName),
                sparkline: [...dev.sparkline.slice(1), parseFloat(formatMetricValue(newVal, dev.metricName))]
              };
            });
          }
        }, 5000);
      }
    }
    return globalThis._devices;
  },
  setDevices: (newDevices: Device[]) => {
    globalThis._devices = newDevices;
  },
  getDocuments: () => {
    if (process.env.BACKEND_SOURCE_DEVICE === 'engine') return globalThis._documents || initialDocuments();
    if (!globalThis._documents) {
      globalThis._documents = initialDocuments();
    }
    return globalThis._documents;
  }
};
