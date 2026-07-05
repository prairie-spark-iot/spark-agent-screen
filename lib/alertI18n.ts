import { Alert, DiagnosisReport } from "@/src/types";

export function localizeAlert(alert: Alert, language: string): Alert {
  if (language !== 'zh') return alert;

  const metricMap: Record<string, string> = {
    'Thermal Threshold Exceeded': '温度超出安全阈值',
    'CPU Utilization Spike': 'CPU 利用率激增',
    'Routine Backup Initiated': '已启动例行数据备份',
    'Unusual Login Rate Detected': '检测到异常登录请求速率',
    'Vibration threshold exceeded': '机床振动速度超过安全上限',
    'Flow rate dropped below nominal': '流体流量降至额定标准下限以下',
    'Packet loss detected (4%)': '检测到数据包通信丢失 (4%)'
  };

  const detailsMap: Record<string, string> = {
    'Thermal sensor in core router detected temperature exceeding maximum limit. Packet drops imminent.': '核心路由器内部温度传感器检测到温度超出最大上限。即将发生数据包丢失。',
    'Database cluster CPU resource allocation has spiked beyond standard operating bounds.': '数据库集群 CPU 资源占用激增，超出标准运行边界。',
    'Routine full-volume backup sequence has been successfully initiated by automated cron system.': '自动化定时系统已成功启动全盘例行数据备份任务。',
    'Security module detected login requests far exceeding baseline maximum, suggesting possible brute force or credential stuffing campaign.': '安全检测模块发现登录请求频率远超基线最大值，疑似遭受暴力破解或撞库攻击。',
    'Hydraulic high-pressure pump 04 (North segment) vibration levels exceeded warning limits.': '高压液压泵 04（北区段）机壳振动速度超出预警界限。',
    'Flow rate dropped below secondary safety limits on secondary loop B.': '冷却塔辅回路 B 区段流体流量降至二级安全下限边界以下。',
    'Network packet loss detected over serial transceiver array 12.': '串行总线收发阵列 12 检测到持续网络数据包丢失。'
  };

  const rootCauseMap: Record<string, string> = {
    'Database Query Plan Inefficiency': '数据库查询执行计划低效',
    'Mechanical Valve Failure': '机械溢流阀组件磨损故障',
    'Flow Control Valve Calibration': '流量控制阀校准偏差',
    'Cooling Fan Bearing Failure': '散热风扇轴承磨损故障',
    'Automated Credential Stuffing Attack': '自动化撞库破解攻击',
    'EMI (Electromagnetic Interference) on Cable Shielding': '线缆屏蔽层遭受电磁干扰 (EMI)',
    'Unspecified Sensor Calibration Drift': '未明确的传感器校准漂移',
    'Component Drift': '硬件参数持续漂移'
  };

  const titleMap: Record<string, string> = {
    'Analyzed resource logs': '分析资源与进程日志',
    'Discovered missing indexes': '发现缺失数据库复合索引',
    'Collected telemetry context': '采集实时遥测数据上下文',
    'Retrieved relevant knowledge docs': '检索关联知识库手册',
    'LLM Analysis': 'AI 大模型深度分析',
    'Sensor Delta Check': '传感器流速差异校验',
    'Heuristics Verification': '启发式规则引擎校验',
    'AI Synthesis': 'AI 综合诊断研判',
    'Traffic inspection logging': '全流量深度检查日志',
    'Security policy match': '安全防护策略匹配',
    'Signal Integrity Analysis': '信号完整性分析',
    'Knowledge correlation': '知识库关联检索'
  };

  const descMap: Record<string, string> = {
    'Inspected DB-Cluster-02 thread pools and process logs. Identified heavy write operations.': '检查 DB-Cluster-02 线程池与进程日志，定位到高负载高并发写入操作。',
    'Identified unindexed JOIN query on customer_transactions table executing 12,000 times/min.': '定位到 customer_transactions 表上存在未加索引的联表查询，执行频率高达每分钟 12,000 次。',
    'Telemetry readings indicate normal core temperature but severe vibration delta on main pump casing.': '遥测数据显示核心温度正常，但主泵机壳振动速度出现剧烈异常突变。',
    'Compared vibration patterns to historical failure records.': '将机床振动频谱模式与历史维修故障记录进行了多维比对。',
    'Analysis indicates severe wear on the pressure relief valve assembly (PRV-2). Vibration cycles correlate strongly with fluid flow rate drops reported upstream.': '分析表明减压溢流阀组件（PRV-2）严重磨损。振动周期变化与上游报告的流体流量下降高度相关。',
    'Detected a 30% reduction in fluid velocity over a 5-minute window.': '检测到 5 分钟窗口内流体流速下降幅度达 30%。',
    'Identified that mechanical valve FCV-10B had a feedback mismatch of 12 degrees.': '识别出机械调节阀 FCV-10B 存在 12 度的阀门开度反馈失配。',
    'Correlated telemetry against technical manuals.': '将遥测参数关联匹配至技术手册标准。',
    'Thermal levels indicate fan bearing failure. Internal cooling is insufficient. System automatically reduced clock rates to prevent silicon damage.': '温度指标表明散热风扇轴承损坏导致内部散热严重不足。系统已自动降低时钟频率以防止芯片过热烧毁。',
    'Matched signature rules on rate thresholds.': '已匹配限制阈值与安全攻防特征规则。',
    'High frequency brute force detected on user account endpoints. Initiating temporary rate limits and cloudflare challenge rules.': '用户账户接口检测到高频暴力破解请求。已触发临时速率限制及自动化安全防御挑战策略。',
    'Detected rise in CRC errors and line impedance values on the primary transceiver wire.': '主总线收发线路上检测到 CRC 校验错误及线路阻抗异常上升。',
    'Compared logs against previous incidents near the CNC line.': '对比了数控机床管线附近的近期历史干扰日志。',
    'Vibration cycles of CNC Lathe 02 correlate precisely with packet loss spikes, indicating shielding degradation on nearby signal run.': '数控车床 02 的振动周期与丢包峰值精确吻合，表明附近信号线路的屏蔽层已出现物理劣化。'
  };

  const labelMap: Record<string, string> = {
    'CPU Usage': 'CPU 利用率',
    'Active Conn': '活跃连接数',
    'Vibration': '振动速度',
    'Core Temp': '核心温度',
    'Flow Rate': '流体流速',
    'Inlet Press': '入口压力',
    'CPU Temp': 'CPU 温度',
    'Fan Speed': '风扇转速',
    'Login Rate': '登录频率',
    'IP Sources': 'IP 源数量',
    'Packet Loss': '丢包率',
    'CRC Errors': 'CRC 校验错',
    'Value': '检测数值'
  };

  const actionMap: Record<string, string> = {
    'Apply missing composite index to customer_transactions(customer_id, created_at)': '为 customer_transactions(customer_id, created_at) 添加缺失的复合索引',
    'Kill lock-holding process PID 4125': '强制终止持有表锁的进程 PID 4125',
    'Isolate line segment': '隔离出现异常的管线区段',
    'Depressurize locally': '对局部管线进行泄压安全处理',
    'Replace PRV-2 assembly': '更换 PRV-2 减压阀机械总成',
    'Calibrate flow control valve FCV-10B': '在线校准流量控制阀 FCV-10B 开度',
    'Inspect inlet strainer for particulate blockage': '检查入口过滤器是否有杂质颗粒堵塞',
    'Schedule maintenance shutdown on routing segment E1': '针对路由网段 E1 安排停机检修计划',
    'Replace secondary internal brushless fan assembly': '更换内部二级无刷散热风扇组件',
    'Confirm thermal values drop below 70°C after reboot': '重启后确认热力学温度稳定降至 70°C 以下',
    'Trigger mandatory CAPTCHA challenges for all gateway endpoints': '对所有网关登录接口开启强制 CAPTCHA 人机验证',
    'Temporarily block the top 5 offending IP subnets': '临时封禁发起攻击频率最高的前 5 个 IP 子网段',
    'Monitor auth log statistics for signature attenuation': '实时监控鉴权日志统计数据以评估攻击衰减趋势',
    'Inspect and secure coaxial grounding clamps on Sensor-Array-12': '检查并加固 Sensor-Array-12 节点的所有同轴接地夹具',
    'Reroute cabling 2 meters away from CNC power cables': '重新布线，将信号电缆与数控机床动力电缆保持 2 米以上安全距离',
    'Perform remote sensor self-calibration sequence': '执行远程传感器在线自校准程序',
    'Verify metric returns to nominal threshold': '确认监测指标恢复至额定安全阈值范围内'
  };

  const translateValue = (val: string): string => {
    return val
      .replace('/sec', '/秒')
      .replace('/min', '/分')
      .replace('unique', '个独立源');
  };

  const translateDescription = (desc: string): string => {
    if (descMap[desc]) return descMap[desc];
    if (desc.startsWith('Thermal logs confirm CPU packaging temperature rose')) {
      return `热监测日志确认 CPU 封装温度在 15 分钟内从 65°C 飙升至 ${alert.triggerValue}。风扇转速表显示转速从 4500 骤降至 1200 RPM。`;
    }
    if (desc.startsWith('Authentication logs flag a surge')) {
      return `身份验证日志标出了高达 ${alert.triggerValue} 的并发失败峰值，源头分布于欧美及亚洲 12 个独立 IP 网段。`;
    }
    if (desc.startsWith('System flag triggered on')) {
      return `系统在 ${alert.triggerValue} 触发了 ${alert.metric} 告警标记。`;
    }
    if (desc.startsWith('Heuristic analysis suggests')) {
      return `启发式分析表明需要进行局部传感器在线校准。指标数值已小幅漂移至安全基准阈值 ${alert.threshold} 上方。`;
    }
    return desc;
  };

  let localizedDiagnosis: DiagnosisReport | undefined = undefined;
  if (alert.diagnosis) {
    localizedDiagnosis = {
      ...alert.diagnosis,
      rootCause: rootCauseMap[alert.diagnosis.rootCause] || alert.diagnosis.rootCause,
      timeline: alert.diagnosis.timeline.map(step => ({
        ...step,
        title: titleMap[step.title] || step.title,
        description: translateDescription(step.description),
        metrics: step.metrics?.map(m => ({
          ...m,
          label: labelMap[m.label] || m.label,
          value: translateValue(m.value)
        }))
      })),
      suggestedActionPlan: alert.diagnosis.suggestedActionPlan.map(act => ({
        ...act,
        text: actionMap[act.text] || act.text
      }))
    };
  }

  return {
    ...alert,
    metric: metricMap[alert.metric] || alert.metric,
    details: detailsMap[alert.details] || alert.details,
    triggerValue: translateValue(alert.triggerValue),
    threshold: translateValue(alert.threshold),
    diagnosis: localizedDiagnosis
  };
}
