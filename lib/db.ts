import { Alert, Device, Doc, DiagnosisReport } from "@/src/types";

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
    metricName: 'CORE TEMP',
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
    value: '12.4',
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
    value: '4.8',
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
                    triggerValue: `${newVal.toFixed(1)} ${dev.unit}`,
                    threshold: `${safeThreshold} ${dev.unit}`,
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
                  value: newVal.toFixed(1),
                  sparkline: [...dev.sparkline.slice(1), parseFloat(newVal.toFixed(1))]
                };
              }

              return {
                ...dev,
                value: newVal.toFixed(1),
                sparkline: [...dev.sparkline.slice(1), parseFloat(newVal.toFixed(1))]
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
    if (!globalThis._documents) {
      globalThis._documents = initialDocuments();
    }
    return globalThis._documents;
  }
};

export function generateHeuristicDiagnosis(alert: Alert, lang: string = 'en'): DiagnosisReport {
  const isZh = lang === 'zh';
  let rootCause = isZh ? '零部件磨损与参数漂移' : 'Component Drift';
  let confidence = 85;
  let timeline: any[] = [];
  let suggestedActionPlan: any[] = [];

  const deviceStr = alert.device || '';
  const metricStr = alert.metric || '';

  if (deviceStr.includes('Router') || metricStr.includes('Thermal')) {
    rootCause = isZh ? '散热风扇轴承磨损故障导致热失控' : 'Cooling Fan Bearing Failure';
    confidence = 94;
    timeline = [
      {
        title: isZh ? '遥测数据遥感日志分析' : 'Collected telemetry context',
        description: isZh
          ? `热力学日志确认 CPU 封装温度在 15 分钟内自 65°C 攀升至 ${alert.triggerValue}。风扇转速传感器反馈转速自 4500 RPM 骤降至 1200 RPM。`
          : `Thermal logs confirm CPU packaging temperature rose from 65°C to ${alert.triggerValue} over a 15-minute sequence. Fan tachometer reported RPM drop from 4500 to 1200.`,
        metrics: [
          { label: isZh ? 'CPU 封装温度' : 'CPU Temp', value: alert.triggerValue, status: 'error' },
          { label: isZh ? '风扇转速' : 'Fan Speed', value: '1200 RPM', status: 'error' }
        ]
      },
      {
        title: isZh ? '调阅设备维护规程与知识库' : 'Retrieved relevant knowledge docs',
        description: isZh ? '将实时波形异常与技术维护手册规范进行对比检索。' : 'Correlated telemetry against technical manuals.',
        docs: ['Thermal_Runaway_Protocol_A.pdf', 'Equipment_Router_Spec.pdf']
      },
      {
        title: isZh ? 'AI 根因推演与综合评估' : 'AI Synthesis',
        description: isZh
          ? '温升曲线与转速降幅形成负相关，确诊内部无刷风扇轴承机械润滑失效，主控自动触发降频保护机制。'
          : 'Thermal levels indicate fan bearing failure. Internal cooling is insufficient. System automatically reduced clock rates to prevent silicon damage.'
      }
    ];
    suggestedActionPlan = [
      { id: 'ap-r-1', text: isZh ? '安排 E1 路由工区停机维护计划窗口' : 'Schedule maintenance shutdown on routing segment E1', completed: false },
      { id: 'ap-r-2', text: isZh ? '更换备用内部无刷散热风扇总成 (型号: BF-450)' : 'Replace secondary internal brushless fan assembly', completed: false },
      { id: 'ap-r-3', text: isZh ? '重启并验证高温警报解除，确保工作温度稳定低于 70°C' : 'Confirm thermal values drop below 70°C after reboot', completed: false }
    ];
  } else if (deviceStr.includes('Gateway') || metricStr.includes('Login')) {
    rootCause = isZh ? '自动撞库攻击与高并发异常认证请求' : 'Automated Credential Stuffing Attack';
    confidence = 96;
    timeline = [
      {
        title: isZh ? '边侧流量深度审计' : 'Traffic inspection logging',
        description: isZh
          ? `认证安全日志监测到瞬时失败登录频次飙升至 ${alert.triggerValue}，源自 12 个海外不同 IP 网段（欧/亚子网）。`
          : `Authentication logs flag a surge to ${alert.triggerValue} concurrent failures across 12 distributed IP subnets (EU/Asia).`,
        metrics: [
          { label: isZh ? '登录请求速率' : 'Login Rate', value: alert.triggerValue, status: 'error' },
          { label: isZh ? '异常源 IP 数量' : 'IP Sources', value: '142 unique', status: 'warning' }
        ]
      },
      {
        title: isZh ? '特征库与策略安全匹配' : 'Security policy match',
        description: isZh ? '触发工控边界防护限流规则库。' : 'Matched signature rules on rate thresholds.',
        docs: ['Brute_Force_Mitigation_Procedure_2024.pdf']
      },
      {
        title: isZh ? 'AI 根因推演与综合评估' : 'AI Synthesis',
        description: isZh
          ? '检测到高频分布式暴力尝试破解网关账户，已自动激活动态滑动挑战与临时源地址封禁策略。'
          : 'High frequency brute force detected on user account endpoints. Initiating temporary rate limits and cloudflare challenge rules.'
      }
    ];
    suggestedActionPlan = [
      { id: 'ap-sec-1', text: isZh ? '全量开启网关端点的强制 CAPTCHA 人机交互校验' : 'Trigger mandatory CAPTCHA challenges for all gateway endpoints', completed: true },
      { id: 'ap-sec-2', text: isZh ? '调用防火墙策略临时下发 Top 5 恶意子网黑名单' : 'Temporarily block the top 5 offending IP subnets', completed: false },
      { id: 'ap-sec-3', text: isZh ? '持续观测认证请求衰减趋势并生成审计报告' : 'Monitor auth log statistics for signature attenuation', completed: false }
    ];
  } else if (deviceStr.includes('Sensor') || metricStr.includes('Packet') || deviceStr.includes('Lathe')) {
    rootCause = isZh ? '动力线缆电磁干扰 (EMI) 与接地屏蔽层老化' : 'EMI (Electromagnetic Interference) on Cable Shielding';
    confidence = 88;
    timeline = [
      {
        title: isZh ? '传输链路信号完整性分析' : 'Signal Integrity Analysis',
        description: isZh
          ? '主通信总线上监测到 CRC 校验错误率突增，传输阻抗出现明显波动。'
          : 'Detected rise in CRC errors and line impedance values on the primary transceiver wire.',
        metrics: [
          { label: isZh ? '丢包率 / 抖动' : 'Packet Loss', value: alert.triggerValue, status: 'warning' },
          { label: isZh ? 'CRC 报错频次' : 'CRC Errors', value: '1420 /min', status: 'error' }
        ]
      },
      {
        title: isZh ? '工业时序波形相关性对齐' : 'Knowledge correlation',
        description: isZh ? '将数控机床主轴震动周期与总线误码率进行交叉验证。' : 'Compared logs against previous incidents near the CNC line.'
      },
      {
        title: isZh ? 'AI 根因推演与综合评估' : 'AI Synthesis',
        description: isZh
          ? '数控车床进给震动峰值与数据丢包时间窗 100% 吻合，判断强电磁脉冲穿透了附近老化的通信排线屏蔽层。'
          : 'Vibration cycles of CNC Lathe 02 correlate precisely with packet loss spikes, indicating shielding degradation on nearby signal run.'
      }
    ];
    suggestedActionPlan = [
      { id: 'ap-sen-1', text: isZh ? '检查并紧固 12 号传感器阵列的同轴外壳接地夹钳' : 'Inspect and secure coaxial grounding clamps on Sensor-Array-12', completed: false },
      { id: 'ap-sen-2', text: isZh ? '将低压数据线桥架重新铺设至距离动力主线缆 2 米以外' : 'Reroute cabling 2 meters away from CNC power cables', completed: false }
    ];
  } else {
    rootCause = isZh ? '设备工作参数缓变漂移与基准超出' : 'Unspecified Sensor Calibration Drift';
    confidence = 82;
    timeline = [
      {
        title: isZh ? '异常触发快照采集' : 'Collected telemetry context',
        description: isZh ? `系统自动检测到 ${alert.metric} 达到触发阈值 ${alert.triggerValue}。` : `System flag triggered on ${alert.metric} at ${alert.triggerValue}.`,
        metrics: [
          { label: isZh ? '实时数值' : 'Value', value: alert.triggerValue, status: 'warning' }
        ]
      },
      {
        title: isZh ? 'AI 根因推演与综合评估' : 'AI Synthesis',
        description: isZh
          ? `启发式工程推理表明该节点传感器需进行零点复位，当前参数已渐进超出安全范围 (${alert.threshold})。`
          : `Heuristic analysis suggests a localized sensor recalibration is required. Metric has drifted slightly above acceptable threshold ${alert.threshold}.`
      }
    ];
    suggestedActionPlan = [
      { id: 'ap-d-1', text: isZh ? '远程下发传感器零点自校准与偏置补偿指令' : 'Perform remote sensor self-calibration sequence', completed: false },
      { id: 'ap-d-2', text: isZh ? '持续复核 5 个采样周期，确保数值稳态回归到安全阈值内' : 'Verify metric returns to nominal threshold', completed: false }
    ];
  }

  return {
    rootCause,
    confidence,
    timeline,
    suggestedActionPlan,
    approved: false
  };
}
