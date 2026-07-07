'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'zh';

export interface Translations {
  [key: string]: {
    en: string;
    zh: string;
  };
}

export const translations: Translations = {
  systemGateway: {
    en: "IoT System Gateway",
    zh: "物联网关"
  },
  appName: {
    en: "Spark IoT Agent",
    zh: "Spark IoT 智能代理"
  },
  overview: {
    en: "Overview Dashboard",
    zh: "概览仪表盘"
  },
  devices: {
    en: "Device Monitoring",
    zh: "设备监控"
  },
  alerts: {
    en: "Alert Center",
    zh: "告警中心"
  },
  knowledge: {
    en: "Knowledge Base",
    zh: "知识库"
  },
  knowledgeBase: {
    en: "Knowledge Base",
    zh: "知识库"
  },
  devicesOnline: {
    en: "Devices Online",
    zh: "在线设备"
  },
  activeAlerts: {
    en: "Active Alerts",
    zh: "活动告警"
  },
  aiDiagnosesToday: {
    en: "AI Diagnoses Today",
    zh: "今日 AI 诊断"
  },
  avgConfidence: {
    en: "Avg Confidence",
    zh: "平均置信度"
  },
  liveTelemetry: {
    en: "Live Telemetry",
    zh: "实时遥测"
  },
  temperature: {
    en: "Temperature",
    zh: "温度"
  },
  pressure: {
    en: "Pressure",
    zh: "压力"
  },
  recentAlertsFeed: {
    en: "Recent Alerts Feed",
    zh: "最近告警动态"
  },
  viewAll: {
    en: "View All",
    zh: "查看全部"
  },
  runAi: {
    en: "Run AI",
    zh: "运行 AI 诊断"
  },
  diagnosing: {
    en: "Diagnosing...",
    zh: "正在诊断..."
  },
  aiDiagnosed: {
    en: "AI Diagnosed",
    zh: "AI 已诊断"
  },
  searchDevices: {
    en: "Search devices...",
    zh: "搜索设备..."
  },
  addNode: {
    en: "Add Node",
    zh: "添加节点"
  },
  location: {
    en: "Location",
    zh: "位置"
  },
  status: {
    en: "Status",
    zh: "状态"
  },
  ONLINE: {
    en: "ONLINE",
    zh: "在线"
  },
  OFFLINE: {
    en: "OFFLINE",
    zh: "离线"
  },
  WARNING: {
    en: "WARNING",
    zh: "警告"
  },
  Critical: {
    en: "Critical",
    zh: "严重"
  },
  Warning: {
    en: "Warning",
    zh: "警告"
  },
  Info: {
    en: "Info",
    zh: "信息"
  },
  pending: {
    en: "Pending",
    zh: "待处理"
  },
  all: {
    en: "All",
    zh: "全部"
  },
  last24Hours: {
    en: "Last 24 Hours",
    zh: "最近 24 小时"
  },
  autoDiagnoseAll: {
    en: "Auto-Diagnose All",
    zh: "自动诊断全部"
  },
  diagnosingAll: {
    en: "Auto-Diagnosing...",
    zh: "正在自动诊断..."
  },
  timeUtc: {
    en: "Time (UTC)",
    zh: "时间 (UTC)"
  },
  deviceEntity: {
    en: "Device / Entity",
    zh: "设备 / 实体"
  },
  metric: {
    en: "Metric",
    zh: "指标"
  },
  triggerValue: {
    en: "Trigger Value",
    zh: "触发值"
  },
  severity: {
    en: "Severity",
    zh: "严重程度"
  },
  diagnosisStatus: {
    en: "Diagnosis Status",
    zh: "诊断状态"
  },
  showingAlerts: {
    en: "Showing {count} of {total} alerts",
    zh: "显示 {count} 条，共 {total} 条告警"
  },
  noAlertsFound: {
    en: "No active anomalies found matching criteria.",
    zh: "未发现符合条件的活动异常。"
  },
  runAiDiagnosticModel: {
    en: "Run AI Diagnostic Model",
    zh: "运行 AI 诊断模型"
  },
  aiDiagnosisPending: {
    en: "AI Diagnosis Pending",
    zh: "AI 诊断待处理"
  },
  aiDiagnosisPendingDesc: {
    en: "No analysis has been compiled for this anomaly. Tap run to execute diagnostic reasoning models.",
    zh: "尚未对此异常生成分析。点击运行以执行诊断推理模型。"
  },
  generatingReasoning: {
    en: "Generating Analytical Reasoning...",
    zh: "正在生成分析推理..."
  },
  generatingReasoningDesc: {
    en: "Evaluating telemetry buffers, matching knowledge base specifications, and running generative reasoning pipelines.",
    zh: "评估遥测数据缓存、匹配知识库规范，并运行生成式推理流程。"
  },
  aiDiagnosticReasoning: {
    en: "AI Diagnostic Reasoning",
    zh: "AI 诊断推理"
  },
  aiDiagnosticConfidence: {
    en: "AI Diagnostic Confidence",
    zh: "AI 诊断置信度"
  },
  identifiedRootCause: {
    en: "Identified Root Cause",
    zh: "已识别根因"
  },
  suggestedActionPlan: {
    en: "Suggested Action Plan",
    zh: "建议的应对计划"
  },
  humanConfirmationRequired: {
    en: "Human confirmation required before actions can be dispatched to actuators.",
    zh: "在将操作分发至执行器之前，需要人工确认。"
  },
  approveActionPlan: {
    en: "Approve Action Plan",
    zh: "批准应对计划"
  },
  actionPlanDispatched: {
    en: "Action Plan Dispatched",
    zh: "应对计划已分发"
  },
  backToAlertCenter: {
    en: "Back to Alert Center",
    zh: "返回告警中心"
  },
  controlManual: {
    en: "Control Manual",
    zh: "控制手册"
  },
  telematicLogs: {
    en: "Telematic Logs",
    zh: "遥测日志"
  },
  operator: {
    en: "Operator",
    zh: "操作员"
  },
  connectingToGateway: {
    en: "Connecting to Spark IoT Gateway...",
    zh: "正在连接到 Spark 物联网网关..."
  },
  syncingBuffers: {
    en: "Downloading server-state buffers and synchronizing telematics.",
    zh: "下载服务器状态缓存并同步遥测数据。"
  },
  syncOffline: {
    en: "Control Room Synchronization Offline",
    zh: "控制室同步离线"
  },
  retrySync: {
    en: "Retry Synchronizing",
    zh: "重试同步"
  },
  noAlertSelected: {
    en: "No Alert Selected",
    zh: "未选择告警"
  },
  noAlertSelectedDesc: {
    en: "Select an anomaly in the Feed or Alert Center to trigger AI analytical diagnosis.",
    zh: "在动态或告警中心选择一个异常以触发 AI 分析诊断。"
  },
  systemWideOptimization: {
    en: "System-wide Optimization Guide v4.2",
    zh: "系统范围优化指南 v4.2"
  },
  systemWideOptimizationDesc: {
    en: "Critical updates to cooling-tower flow thresholds and CNC vibration bounds for Q4 operations. Ingested by Spark AI.",
    zh: "针对第四季度运营中冷却塔流量阈值和数控机床振动边界的关键更新。已由 Spark AI 摄入。"
  },
  downloadPdf: {
    en: "Download PDF",
    zh: "下载 PDF"
  },
  searchDoc: {
    en: "Search documentation or logs...",
    zh: "搜索文档或日志..."
  },
  equipmentManuals: {
    en: "Equipment Manuals",
    zh: "设备手册"
  },
  equipmentManualsDesc: {
    en: "243 documents parsed by AI agent diagnostics.",
    zh: "由 AI 代理诊断解析的 243 份文档。"
  },
  safetyProtocols: {
    en: "Safety Protocols",
    zh: "安全协议"
  },
  safetyProtocolsDesc: {
    en: "Critical guidelines on electrical and thermal thresholds.",
    zh: "关于电气和热阈值的关键准则。"
  },
  maintenanceLogs: {
    en: "Maintenance Logs",
    zh: "维护日志"
  },
  maintenanceLogsDesc: {
    en: "Historical field engineer reports and calibrations.",
    zh: "历史现场工程师报告和校准。"
  },
  troubleshootingGuides: {
    en: "Troubleshooting Guides",
    zh: "故障排除指南"
  },
  troubleshootingGuidesDesc: {
    en: "Step-by-step resolution flowcharts for PRV, routers.",
    zh: "针对 PRV、路由器的逐步解决流程图。"
  },
  documentName: {
    en: "Document Name",
    zh: "文档名称"
  },
  type: {
    en: "Type",
    zh: "类型"
  },
  dateIngested: {
    en: "Date Ingested",
    zh: "摄入日期"
  },
  addSystemNode: {
    en: "Add New System Node",
    zh: "添加新系统节点"
  },
  nodeName: {
    en: "Node Name *",
    zh: "节点名称 *"
  },
  locationSegment: {
    en: "Location / Segment",
    zh: "位置 / 区域"
  },
  metricName: {
    en: "Metric Name *",
    zh: "指标名称 *"
  },
  fieldRequired: {
    en: "This field is required",
    zh: "此字段为必填项"
  },
  initialValue: {
    en: "Initial Value",
    zh: "初始值"
  },
  startingStatus: {
    en: "Starting Status",
    zh: "初始状态"
  },
  cancel: {
    en: "Cancel",
    zh: "取消"
  },
  addNodeBtn: {
    en: "Add Node",
    zh: "添加节点"
  },
  allNodes: {
    en: "All Nodes",
    zh: "全部节点"
  },
  onlineNodes: {
    en: "Online",
    zh: "正常在线"
  },
  warningNodes: {
    en: "Warning",
    zh: "告警异常"
  },
  offlineNodes: {
    en: "Offline",
    zh: "离线断开"
  },
  totalNodes: {
    en: "Total Active Nodes",
    zh: "网关接入总数"
  },
  systemHealthRate: {
    en: "Health Index",
    zh: "节点健康率"
  },
  activeWarningsCount: {
    en: "Active Anomalies",
    zh: "实时告警节点"
  },
  avgResponseTime: {
    en: "Avg Telemetry Latency",
    zh: "平均遥测时延"
  },
  nodeDetails: {
    en: "Telemetry Inspection & Node Control",
    zh: "遥测实时监控与节点控制"
  },
  liveStream: {
    en: "Live Telemetry Stream",
    zh: "实时遥测数据流"
  },
  sendPing: {
    en: "Ping Transceiver",
    zh: "发包检测网络"
  },
  remoteReboot: {
    en: "Remote Reset",
    zh: "远程重启复位"
  },
  clearWarning: {
    en: "Clear Anomaly Flag",
    zh: "清除告警标志"
  },
  pinging: {
    en: "Pinging...",
    zh: "发包检测中..."
  },
  rebooting: {
    en: "Rebooting node...",
    zh: "节点重启复位中..."
  },
  unit: {
    en: "Unit",
    zh: "单位"
  },
  controlArchitecture: {
    en: "Spark IoT - Control Architecture",
    zh: "Spark 物联网 - 控制架构"
  },
  controlArchDesc: {
    en: "Spark IoT Agent is an advanced telemetry monitoring dashboard equipped with cognitive diagnostic capabilities.",
    zh: "Spark IoT Agent 是一个配备认知诊断功能的高级遥测监控仪表盘。"
  },
  controlArchDetails: {
    en: "When an anomaly is flagged, the operator or system can trigger the diagnostic pipeline. The engine evaluates live telemetry buffers, correlates logs from the Knowledge Base, and utilizes Google Gemini AI on the backend to generate precise root-cause analysis and actionable step-by-step resolution manuals.",
    zh: "当标记异常时，操作员或系统可以触发诊断流程。该引擎会评估实时遥测数据缓存，关联知识库中的日志，并在后端利用 Google Gemini AI 生成精准的根本原因分析和可执行的逐步解决手册。"
  },
  acknowledgeProtocol: {
    en: "Acknowledge Protocol",
    zh: "确认协议"
  },
  aiModelLabel: {
    en: "Model: gemini-3.5-flash",
    zh: "模型: gemini-3.5-flash"
  },
  featuredDocument: {
    en: "Featured Document",
    zh: "推荐文档"
  },
  featuredDocDesc: {
    en: "Critical updates to cooling-tower flow thresholds and CNC vibration bounds for Q4 operations. Ingested by Spark AI.",
    zh: "针对第四季度运营调整的冷却塔流量阈值及数控机床振动界限的重大更新。已由 Spark AI 深度解析。"
  },
  systemNode: {
    en: "System Node 01",
    zh: "系统节点 01"
  },
  vigilantActive: {
    en: "Vigilant Active",
    zh: "监测处于活跃状态"
  },
  analytics: {
    en: "Analytics",
    zh: "分析"
  },
  maintenance: {
    en: "Maintenance",
    zh: "维护"
  },
  appDescription: {
    en: "is an advanced telemetry monitoring dashboard equipped with cognitive diagnostic capabilities.",
    zh: "是一个配备认知诊断功能的高级遥测监控仪表盘。"
  },
  component: {
    en: "Component",
    zh: "组件"
  },
  specification: {
    en: "Specification",
    zh: "规格"
  },
  serverInterface: {
    en: "Server Interface",
    zh: "服务器接口"
  },
  viteProxyPipeline: {
    en: "Vite Proxy Pipeline",
    zh: "Vite 代理管道"
  },
  diagnosticCore: {
    en: "Diagnostic Core",
    zh: "诊断核心"
  },
  knowledgeParsing: {
    en: "Knowledge Parsing",
    zh: "知识解析"
  },
  manualRefIngestion: {
    en: "Manual Ref Ingestion",
    zh: "手册参考摄入"
  },
  aiAnalyticalCore: {
    en: "AI Analytical Core",
    zh: "AI 智能解析内核"
  },
  diagnosticsDetailTab: {
    en: "Diagnostics Detail",
    zh: "智能诊断详情"
  },
  switchToLang: {
    en: "Switch to Chinese",
    zh: "切换为英文"
  },
  langBadge: {
    en: "ZH",
    zh: "EN"
  },
  requiresAttention: {
    en: "Requires attention",
    zh: "需要处理"
  },
  systemNominal: {
    en: "System nominal",
    zh: "系统正常"
  },
  plus3LastHour: {
    en: "+3 since last hour",
    zh: "+3 自上小时起"
  },
  registerNewNodeDesc: {
    en: "Register a new active transceiver node",
    zh: "注册一个新的活动收发器节点"
  },
  placeholderNodeName: {
    en: "e.g. Centrifuge 09, Core-Switch",
    zh: "例如：离心机 09，核心交换机"
  },
  placeholderLocation: {
    en: "e.g. Floor B - Section 4",
    zh: "例如：B 层 - 第 4 区"
  },
  placeholderMetric: {
    en: "e.g. CORE TEMP, PRESSURE",
    zh: "例如：核心温度，压力"
  },
  noTransceiversFound: {
    en: "No transceivers found matching criteria.",
    zh: "未找到匹配筛选条件的收发终端节点。"
  },
  tryClearingSearch: {
    en: "Try clearing your search query or switching status filters.",
    zh: "请尝试清空搜索词或切换节点状态分类标签。"
  },
  liveStreamStatus: {
    en: "Live Stream",
    zh: "实时遥测中"
  },
  linkQuality: {
    en: "Link Quality & RTT",
    zh: "通信链路时延"
  },
  sub1GhzMesh: {
    en: "Sub-1GHz Mesh",
    zh: "无线 Mesh"
  },
  packetLossZero: {
    en: "Loss 0.00%",
    zh: "丢包率 0%"
  },
  nodeUptimePower: {
    en: "Node Uptime & Power",
    zh: "节点运行与供电"
  },
  powerNormal: {
    en: "24V DC Normal",
    zh: "24V 直流稳压"
  },
  uninterrupted: {
    en: "Uninterrupted",
    zh: "持续稳定运行"
  },
  carrierWaveformTrend: {
    en: "Carrier Waveform & Telemetry Trend",
    zh: "实时遥测载波波形与动态趋势"
  },
  sampleWindow60s: {
    en: "Window: 60s",
    zh: "采样窗口: 60秒"
  },
  transceiverOfflineMsg: {
    en: "Transceiver offline. No live carrier wave.",
    zh: "通信收发模块已下线，暂无实时载波信号。"
  },
  liveStreaming: {
    en: "LIVE STREAMING",
    zh: "实时采样传输"
  },
  now: {
    en: "Now",
    zh: "当前"
  },
  remoteControlDesc: {
    en: "Direct remote instruction execution and network recovery actions.",
    zh: "向终端边缘控制器直接下发自检指令与远程维护操作。"
  },
  cmdSysReady: {
    en: "[SYS_READY] Transceiver channel active. Node ID: ",
    zh: "[系统就绪] 终端信道已连接，设备 ID: "
  },
  cmdPingDispatch: {
    en: "[PING] Dispatching diagnostic packet to edge gateway...",
    zh: "[发送探针] 正在向网关发送诊断包..."
  },
  cmdPingOk: {
    en: "[PING_OK] Packet returned. Round-trip latency: ",
    zh: "[网络检测通过] 探针回应返回，往返时延: "
  },
  pingLossZero: {
    en: "ms (0% loss)",
    zh: "ms (丢包率 0%)"
  },
  cmdRebootDispatch: {
    en: "[REBOOT] Sending soft reset sequence to edge controller...",
    zh: "[远程重启] 正在向终端发送热重置指令序列..."
  },
  cmdRebootSuccess: {
    en: "[REBOOT_SUCCESS] Transceiver re-synchronized and returned to online state.",
    zh: "[重启成功] 终端收发模块已完成重设并成功恢复在线状态。"
  },
  cmdAlarmCleared: {
    en: "[ALARM_CLEARED] Anomaly flag acknowledged and cleared by operator.",
    zh: "[告警已解除] 异常标志已被运维人员确认并清除。"
  },
  alertsSubtitle: {
    en: "Monitor, diagnose, and resolve system anomalies.",
    zh: "监控、诊断并解决系统异常情况。"
  },
  filterAlertsPlaceholder: {
    en: "Filter alerts by ID, metric...",
    zh: "按 ID、指标过滤告警..."
  },
  diagnoseAnomaly: {
    en: "Diagnose Anomaly",
    zh: "诊断异常告警"
  },
  showing: {
    en: "Showing",
    zh: "显示"
  },
  ofTotal: {
    en: "of",
    zh: "共"
  },
  alertsCount: {
    en: "alerts",
    zh: "条告警"
  },
  rowsPerPage: {
    en: "Rows per page",
    zh: "每页显示"
  },
  firstPage: {
    en: "First page",
    zh: "首页"
  },
  previousPage: {
    en: "Previous page",
    zh: "上一页"
  },
  nextPage: {
    en: "Next page",
    zh: "下一页"
  },
  lastPage: {
    en: "Last page",
    zh: "末页"
  },
  confidenceLabel: {
    en: "Confidence",
    zh: "置信度"
  },
  metricAnalyzed: {
    en: "Metric Analyzed",
    zh: "分析指标"
  },
  value: {
    en: "Value",
    zh: "数值"
  },
  alertSuffix: {
    en: "Alert",
    zh: "异常告警"
  },
  triggeredValue: {
    en: "Triggered Value",
    zh: "触发数值"
  },
  thresholdLimit: {
    en: "Threshold Limit",
    zh: "基准阈值"
  },
  kbSubtitle: {
    en: "Technical manuals, historical blueprints and guide manuals.",
    zh: "技术操作手册、历史备忘蓝图及指导规程集合。"
  },
  searchDocsPlaceholder: {
    en: "Search documents...",
    zh: "搜索技术文档..."
  },
  uploadManual: {
    en: "Upload Manual",
    zh: "上传技术文档"
  },
  manualName: {
    en: "Manual Name",
    zh: "手册/文档名称"
  },
  documentType: {
    en: "Document Type",
    zh: "文档类型"
  },
  dateUploaded: {
    en: "Date Uploaded",
    zh: "上传日期"
  },
  vectorEmbedding: {
    en: "Vector Embedding",
    zh: "向量索引状态"
  },
  noDocsMatched: {
    en: "No documents matched search filter.",
    zh: "未找到匹配的技术文档。"
  },
  updated2HrsAgo: {
    en: "Updated 2 hrs ago",
    zh: "2 小时前更新"
  },
  docTypeManual: {
    en: "Manual",
    zh: "技术手册"
  },
  docTypeLogFile: {
    en: "Log File",
    zh: "运维日志"
  },
  docTypeSafety: {
    en: "Safety",
    zh: "安全规程"
  },
  docStatusIndexed: {
    en: "Indexed",
    zh: "已建立向量索引"
  },
  docStatusUsedInAI: {
    en: "Used in AI Diagnosis",
    zh: "已用于 AI 根因诊断"
  },
  switchSystemNode: {
    en: "Switch System Node",
    zh: "切换监控系统节点"
  },
  selectSystemNodeDesc: {
    en: "Select an industrial edge gateway or surveillance node cluster to monitor in real-time.",
    zh: "选择要实时监控的工业边缘网关或监控区段节点集群。"
  },
  activeNodeBadge: {
    en: "ACTIVE NODE",
    zh: "当前激活节点"
  },
  nodeSwitchSuccess: {
    en: "Switched active telemetry monitoring to {node}",
    zh: "已成功将遥测监控网关切换至工区节点 {node}"
  },
  sysNode01Name: {
    en: "System Node 01 (North CNC Bay)",
    zh: "系统节点 01（北区数控机床车间）"
  },
  sysNode02Name: {
    en: "System Node 02 (Thermal Cooling Plant)",
    zh: "系统节点 02（热力冷却水塔枢纽）"
  },
  sysNode03Name: {
    en: "System Node 03 (Substation Gateway E1)",
    zh: "系统节点 03（变电站网关 E1）"
  },
  sysNode04Name: {
    en: "System Node 04 (Hydraulic Assembly Line)",
    zh: "系统节点 04（高压液压总装流水线）"
  },
  uploadDocTitle: {
    en: "Upload Technical Knowledge Manual",
    zh: "上传技术知识手册"
  },
  uploadDocDesc: {
    en: "Upload equipment maintenance manuals or diagnostic logs to the vector store for AI root-cause analysis.",
    zh: "将设备维保手册或诊断规范日志上传至向量知识库，供 AI 自动匹配进行根本原因推理。"
  },
  docTitleLabel: {
    en: "Document Title *",
    zh: "手册文档名称 *"
  },
  docTypeLabel: {
    en: "Category / Type *",
    zh: "分类 / 文档类型 *"
  },
  docContentLabel: {
    en: "Key Specifications & Content Summary *",
    zh: "核心规格参数 & 内容摘要 *"
  },
  docPreviewTitle: {
    en: "Knowledge Base Document Preview",
    zh: "知识库手册详查与预览"
  },
  docPreviewDesc: {
    en: "Indexed text vectors and diagnostic reference instructions ingested by Gemini AI.",
    zh: "已建立索引的文本向量及供 Gemini AI 推理引用的诊断指导手册。"
  },
  uploadSuccessMsg: {
    en: "Successfully indexed technical document into AI vector store.",
    zh: "已成功将技术规范手册存入 AI 向量推理引擎知识库。"
  },
  previewClose: {
    en: "Close Preview",
    zh: "关闭预览"
  },
  timeAll: {
    en: "All Time",
    zh: "全部时间"
  },
  timeLast1h: {
    en: "Last 1 Hour",
    zh: "近 1 小时"
  },
  timeLast24h: {
    en: "Last 24 Hours",
    zh: "近 24 小时"
  },
  timeLast7d: {
    en: "Last 7 Days",
    zh: "近 7 天"
  },
  exportReport: {
    en: "Export Report",
    zh: "导出诊断报告"
  },
  refresh: {
    en: "Refresh",
    zh: "刷新"
  },
  refreshing: {
    en: "Refreshing...",
    zh: "刷新中..."
  },
  exportReportSuccess: {
    en: "Diagnostic summary report exported as CSV.",
    zh: "诊断汇总分析报告已成功导出为 CSV 表格。"
  },
  locSectionA: {
    en: "Section A - CNC Line",
    zh: "车间 A - 数控加工流水线"
  },
  locSectionB: {
    en: "Section B - Cooling Tower",
    zh: "车间 B - 循环水冷塔系统"
  },
  locSubstation: {
    en: "Grid Gateway Substation E1",
    zh: "供电网关变电所 E1"
  },
  locSectionD: {
    en: "Section D - Hydraulic Assembly",
    zh: "车间 D - 高压液压总装线"
  },
  statusStandby: {
    en: "Standby",
    zh: "待机热备"
  },
  statusMaintenance: {
    en: "Maintenance",
    zh: "维护检修中"
  },
  cancelBtn: {
    en: "Cancel",
    zh: "取消"
  },
  registerNodeBtn: {
    en: "Register Node",
    zh: "注册接入节点"
  },
  startIngestionBtn: {
    en: "Start Vector Ingestion",
    zh: "开始向量索引存入"
  },
  vecEmbedStatus: {
    en: "Vector Embedding Status",
    zh: "向量表征与索引状态"
  },
  vecDim: {
    en: "768-dim Dense Vector",
    zh: "768维稠密语义向量"
  },
  cosineSimLabel: {
    en: "Cosine Similarity Match:",
    zh: "余弦匹配相似度:"
  },
  cosineSimValue: {
    en: "0.942 (Active Baseline)",
    zh: "0.942 (处于激活基线)"
  },
  diagUsageLabel: {
    en: "Diagnostic Usage Status:",
    zh: "推理诊断应用状态:"
  },
  aiExcerptTitle: {
    en: "AI Knowledge Ingestion Excerpt",
    zh: "AI 知识库切片引用摘要"
  },
  aiExcerptContent: {
    en: "When telemetry reports mechanical vibration velocity exceeding 7.5 mm/s on CNC bearing housings or hydraulic pressure relief valves (PRV-2), verify inlet strainer pressure differentials and perform automated calibration prior to issuing critical shutdown commands.",
    zh: "当遥测数据表明数控轴承座或高压液压溢流阀（PRV-2）的机械振动速度超过 7.5 mm/s 时，系统在执行紧急停机指令前，必须自动核查入口滤网压差并执行自校准逻辑。"
  },
  loginTitle: {
    en: "System Diagnostic Gateway",
    zh: "系统诊断监护登录终端"
  },
  loginSubtitle: {
    en: "Authorized operator authentication required to access real-time IoT AI diagnostic grid.",
    zh: "需经过授权操作员身份验证即可访问实时工业物联网 AI 诊断矩阵。"
  },
  loginUsernameLabel: {
    en: "Operator Account / Username",
    zh: "操作员账号 / 用户名"
  },
  loginPasswordLabel: {
    en: "Security Access Code / Password",
    zh: "安全访问密码"
  },
  loginSubmitBtn: {
    en: "Authorize & Enter Grid",
    zh: "授权登录系统矩阵"
  },
  loginDemoHint: {
    en: "Admin Access Credential:",
    zh: "管理员快捷登录凭据:"
  },
  loginErrorMsg: {
    en: "Authentication failed: Invalid operator credentials. Please use admin / admin123456.",
    zh: "身份认证失败：操作员账号或密码错误。请使用 admin / admin123456。"
  },
  logoutBtn: {
    en: "Logout Gateway",
    zh: "退出登录"
  }
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, variables?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // Read from localStorage if in client
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('spark_iot_lang') as Language;
      if (stored === 'en' || stored === 'zh') {
        setLanguageState(stored);
      } else {
        // Fallback to browser language
        const isChinese = navigator.language && navigator.language.startsWith('zh');
        setLanguageState(isChinese ? 'zh' : 'en');
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('spark_iot_lang', lang);
    }
  };

  const t = (key: string, variables?: Record<string, string | number>): string => {
    const item = translations[key];
    if (!item) {
      return key;
    }
    let val = item[language] || item['en'] || key;
    if (variables) {
      Object.entries(variables).forEach(([k, v]) => {
        val = val.replace(`{${k}}`, String(v));
      });
    }
    return val;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
};
