<div align="center">

# ⚡ Spark IoT AI Diagnostic Agent
### 工业智能物联网故障推理与自适应修复诊断系统
*(Industrial AI Telemetry Diagnostic & RAG-Powered Remediation Platform)*

[![React](https://img.shields.io/badge/Frontend-React%2019-00cfbf?style=for-the-badge&logo=react&logoColor=0B0E14)](https://react.dev/)
[![Next.js](https://img.shields.io/badge/Framework-Next.js%2015-ffffff?style=for-the-badge&logo=next.js&logoColor=0B0E14)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript%205.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Gemini AI](https://img.shields.io/badge/AI%20Engine-Gemini%203.5%20Flash-ffba43?style=for-the-badge&logo=google&logoColor=0B0E14)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Tested%20With-Vitest%204.1-FCC72B?style=for-the-badge&logo=vitest&logoColor=0B0E14)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-MIT-4c566a?style=for-the-badge)](LICENSE)

---

<p align="center">
  <b>Spark IoT AI Agent</b> 专为现代工业物联网 (IIoT) 打造，结合了高频传感器数据遥测、检索增强生成 (RAG) 知识切片与 <b>Gemini 3.5 Flash</b> 深层推理引擎，为复杂制造机械提供毫秒级故障根因溯源、工程图纸自动比对与闭环运维处置方案。
</p>

</div>

---

## 🔐 快捷演示登录凭据 (Quick Demo Login Gateway)

为了确保工业物联网控制终端操作权限安全，系统集成了全功能安全认证网关。您在初次访问或本地部署体验时，可直接使用内置操作员管理员凭据快捷登录矩阵：

```text
============================================================
   操作员账号 (Operator Username) : admin
   安全访问密码 (Security Password) : admin123456
============================================================
```
> **提示**：登录界面支持**一键快捷填入 (Quick Fill)** 按钮，可秒级授权并进入实时车间遥测矩阵工作台；同时在导航栏右上方与侧边栏均集成了快捷登出（Logout）功能。

---

## ✨ 核心特性大纲 (Key Features)

| 图标 | 功能模块 | 功能架构描述 |
| :---: | :--- | :--- |
| 🛡️ | **身份安全验证终端 (Authentication Gateway)** | 集成赛博工业风登录网关，支持凭据验证、会话持久化与实时工业网络连通状态指示。 |
| 🌐 | **全场景双语国际化 (Full i18n)** | 内置完整的英文 (`en`) 与中台中文 (`zh`) 语境库，支持登录页、控制台、遥测指标、工程 SOP 建议与图表坐标的毫秒级无缝热切换。 |
| 🧠 | **Gemini 3.5 智能诊断 (AI Engine)** | 当 CNC 数控机床或液压泵组监测到高频振动/过热等异常阈值时，自动提取多维遥测上下文发起 AI 深度推理，生成带置信度的处理时间轴。 |
| 📚 | **多模态 RAG 知识引擎 (Knowledge Base)** | 支持用户直接把维修手册 PDF、原理图切片、日志记录上传至系统引擎，AI 自动进行文本切片嵌入，在诊断时关联最佳实践参考手册。 |
| 📡 | **车间集群节点热切换 (Multi-Node Switching)** | 支持在主装配线、高压液压区、仓储机房等分布式物理车间节点网关之间热切换，实时展示集群平均时延（Latency Ping）与在线状态。 |
| 🎛️ | **工业级高密度仪表盘 (Telemetry UI)** | 采用赛博工业深色主题 (Dark Cyber-Industrial Theme)，内置微型趋势图 (Sparklines)、动态脉冲节点状态与多工区车间设备矩阵。 |

---

## 🏗️ 系统设计与功能架构 (System Architecture)

系统采用模块化分层分发架构，实现设备数据流采集、推理决策层与人机协同交互层的完全隔离与高效流转：

```
+-----------------------------------------------------------------------------------+
|                        [ 🔐 操作员授权访问网关 Login Gateway ]                      |
|                     (Account: admin / Password: admin123456)                      |
+-----------------------------------------------------------------------------------+
                                          | JWT / Session Auth
                                          v
+-----------------------------------------------------------------------------------+
|                        [ 🌐 工业物联网边缘端数据采集网关 ]                           |
|       (CNC-Axis-X1)           (Hydro-Pump 04)           (Ventilation Unit A)      |
+-----------------------------------------+-----------------------------------------+
                                          | 高频遥测数据 / MQTT & HTTP API
                                          v
+-----------------------------------------------------------------------------------+
|                         [ ⚡ Express + Node.js 聚合代理层 ]                         |
|   /api/alerts (告警流)        /api/devices (设备指标)       /api/documents (SOP)  |
+-----------------------------------------+-----------------------------------------+
                                          |
        +---------------------------------+---------------------------------+
        | 实时指标触发                                                      | 知识库检索
        v                                                                   v
+-------------------------------+                                 +-----------------+
|  🤖 Gemini 3.5 Flash 推理核心  | <====== (RAG 检索增强切片) ===== |  📚 知识工程引擎  |
|  (多重证据链生成 & 根因置信度)  |                                 |  (SOP 手册切片库) |
+-------------------------------+                                 +-----------------+
        |
        v
+-----------------------------------------------------------------------------------+
|                          [ 🖥️ 模块化前端人机协作界面 (UI) ]                        |
|  • Layout Module (Sidebar / TopNavbar / MobileNav)                                |
|  • Industrial Views (Dashboard / Device Monitor / Alert Center / RAG Ingestion)   |
|  • Cluster Nodes (SystemNodeModal - Distributed Factory Sector Switching)         |
|  • I18n Context Layer (Bilingual Dynamic Dictionary Engine)                       |
+-----------------------------------------------------------------------------------+
```

---

## 📂 模块化代码结构目录 (Project Structure)

项目文件组织遵循清晰的模块化与领域驱动工程最佳实践：

```text
├── app/                  # Next.js App Router API 与应用根入口
│   ├── api/              # 后端 API 路由代理层 (alerts / devices / documents)
│   ├── layout.tsx        # 响应式全局框架布局
│   └── page.tsx          # 挂载应用主体
├── lib/                  # 业务逻辑与数据存储层
│   └── db.ts             # 初始遥测状态库、设备数据模拟器与启发式推理引擎
├── src/
│   ├── components/       # 模块化 UI 组件库
│   │   ├── layout/       # 导航与系统模态框 (Sidebar / TopNavbar / MobileBottomNav)
│   │   ├── knowledge/    # 知识工程组件 (KnowledgeBaseView / KnowledgeModals)
│   │   ├── system/       # 车间分布节点切换器组件 (SystemNodeModal)
│   │   ├── devices/      # 设备监控卡片与详情诊断视图 (DeviceDetailModal / AddDeviceDialog)
│   │   └── LoginView.tsx # 工业网关授权登录终端页面
│   ├── i18n/             # 国际化双语语言引擎
│   │   └── context.tsx   # React Context 字典状态管理器与多语种词条库
│   ├── types.ts          # 全局 TypeScript 严谨核心类型定义 (Alert, Device, Doc...)
│   └── App.tsx           # 应用核心根视图路由分配器
├── tests/                # 自动化单元与集成测试套件
│   ├── db.test.ts        # 遥测核心逻辑与 AI 推理生成规则测试
│   └── i18n.test.ts      # 双语完整性校验与核心词汇单元测试
└── vitest.config.ts      # 自动化测试框架配置
```

---

## 🚀 快速启动与本地运行 (Getting Started)

### 1. 环境准备
确保您的开发环境中已安装 [Node.js](https://nodejs.org/) (v18+)；本项目支持直接使用 **pnpm** (推荐) 进行依赖管理。

如果您尚未安装 `pnpm`，可通过以下方式开启或安装：
```bash
npm install -g pnpm
# 或启用 Node.js 内置的 Corepack:
corepack enable
```

### 2. 安装依赖项
```bash
# 使用 pnpm 安装依赖
pnpm install
```

### 3. 配置 AI API 密钥 (可选)
如果需要连接实际的 Google Gemini 3.5 接口进行在线推理，请在项目根目录创建 `.env.local` 文件：
```env
GEMINI_API_KEY="your_google_ai_studio_api_key_here"
```

### 4. 启动工业开发服务器
```bash
pnpm dev
```
打开浏览器访问 `http://localhost:3000` 即可进入登录网关。输入用户名 `admin` 与密码 `admin123456`（或点击“快捷填入”）即可授权进入工业控制矩阵。

---

## 🧪 自动化测试 (Testing Suite)

系统内置了基于 **Vitest** 的自动化单元测试流程，确保任何新增页面与功能迭代不会破坏核心数据模型与国际化字典的完整性。

### 运行完整测试流程：
```bash
pnpm test
# 或者使用 npx vitest run
```

**测试覆盖范围包括：**
1. 🛡️ **遥测引擎安全检查 (`tests/db.test.ts`)**: 验证告警级别分类、设备指标极值约束、SOP 文档结构与启发式推理兜底逻辑。
2. 🌐 **双语国际化一致性检查 (`tests/i18n.test.ts`)**: 自动扫描 `translations` 字典，确保 100% 的词条同时具备高精度的中英文释义，无漏译或错位。

---

## 🎨 界面与设计理念 (UI & Experience Design)

* **工业高对比度配色 (High-Contrast Industrial Slate)**: 背景以深墨夜 `#0B0E14` 与青石 `#10131B` 铺陈，核心关键数据采用脉冲霓虹青 `#00cfbf` 突显，故障告警以预警金 `#ffba43` 与紧急红 `#ffb4ab` 标识。
* **桌面与移动端响应式兼容 (Full Responsive Layout)**: 桌面端展开全功能侧边栏与车间节点监视器；移动端自动折叠为原生 App 风格的底部导航条 (`MobileBottomNav`)，触控区域均满足工控平板操作规范。

---

<div align="center">
  <p><b>Built with engineering precision by Spark IoT Systems.</b></p>
</div>
