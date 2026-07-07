<div align="center">

# ⚡ Spark IoT AI Diagnostic Agent

### 工业智能物联网故障推理与自适应修复诊断系统  
*(Industrial AI Telemetry Diagnostic & RAG-Powered Remediation Platform)*

[![Version](https://img.shields.io/badge/版本-1.0.0-00cfbf?style=for-the-badge&logo=semver&logoColor=0B0E14)](https://github.com/kunlong-luo/spark-iot-agent)
[![React](https://img.shields.io/badge/Frontend-React%2019-00cfbf?style=for-the-badge&logo=react&logoColor=0B0E14)](https://react.dev/)
[![Next.js](https://img.shields.io/badge/Framework-Next.js%2015-ffffff?style=for-the-badge&logo=next.js&logoColor=0B0E14)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript%205.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Qwen](https://img.shields.io/badge/AI-Qwen3.5%20Local-ffba43?style=for-the-badge)](https://github.com/QwenLM/Qwen)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Tested%20With-Vitest%204.1-FCC72B?style=for-the-badge&logo=vitest&logoColor=0B0E14)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-MIT-4c566a?style=for-the-badge)](LICENSE)

> [English](README.md) | **中文**

---

<p align="center">
  <b>Spark IoT AI Agent</b> 专为现代工业物联网 (IIoT) 打造，结合高频传感器数据遥测、检索增强生成 (RAG) 知识切片与 <b>本地 Qwen 3.5 (4B)</b> 深层推理引擎，为复杂制造机械提供毫秒级故障根因溯源、工程图纸自动比对与闭环运维处置方案。
</p>

</div>

---

## 🔐 演示登录

系统集成了安全认证网关，确保工业物联网控制终端操作权限安全。

```text
用户名: admin
密码: admin123456
```

> 登录页面支持 **一键快捷填入** 按钮，秒级授权进入实时遥测仪表盘。导航栏右上方与侧边栏均集成了快捷登出功能。

---

## ✨ 核心特性

| 图标 | 功能模块 | 说明 |
| :---: | :--- | :--- |
| 🛡️ | **身份认证网关** | 赛博工业风登录网关，凭据验证、会话持久化与实时网络连通状态指示。 |
| 🌐 | **双语国际化** | 完整的英文 (`en`) 与中文 (`zh`) 翻译支持，覆盖仪表盘、遥测指标、SOP 建议和图表，随时热切换。 |
| 🧠 | **本地 LLM 诊断** | 当监测到振动、过热等阈值异常时，自动提取多维遥测上下文，触发本地 LLM 深度推理并生成带置信度的处理时间轴。 |
| 📚 | **RAG 知识引擎** | 上传维修手册、原理图与日志文件，AI 自动切片嵌入，诊断时关联最佳实践参考。 |
| 📡 | **多节点切换** | 在主装配线、液压区、仓储机房等分布式车间网关之间热切换，实时显示延迟与在线状态。 |
| 🎛️ | **工业遥测仪表盘** | 深色赛博工业主题，微型趋势图、动态脉冲节点状态与多工区设备矩阵。 |

---

## 🏗️ 系统架构

系统采用模块化分层架构，实现设备数据采集、推理决策与人机交互的隔离与高效流转：

```
+-----------------------------------------------------------------------------------+
|                        [ 🔐 登录网关 ]                                            |
|                     (admin / admin123456)                                         |
+-----------------------------------------------------------------------------------+
                                          | JWT / Session Auth
                                          v
+-----------------------------------------------------------------------------------+
|                        [ 🌐 边缘端数据采集 ]                                      |
|       (CNC-Axis-X1)           (Hydro-Pump 04)           (Ventilation Unit A)      |
+-----------------------------------------+-----------------------------------------+
                                          | 高频遥测数据 / HTTP API
                                          v
+-----------------------------------------------------------------------------------+
|                         [ ⚡ Next.js API 层 ]                                     |
|   /api/alerts          /api/devices            /api/documents                     |
+-----------------------------------------+-----------------------------------------+
                                          |
        +---------------------------------+---------------------------------+
        | 实时阈值触发                                                | RAG 知识检索
        v                                                                 v
+-------------------------------+                                 +-----------------+
|  🤖 Qwen 3.5 本地推理引擎   | <==== (RAG 增强检索) ==== |  📚 知识工程引擎  |
|  (Ollama / 4B 参数)         |                               |  (SOP 手册切片库) |
+-------------------------------+                                 +-----------------+
        |
        v
+-----------------------------------------------------------------------------------+
|                          [ 🖥️ 前端界面 ]                                         |
|  • 布局 (Sidebar / TopNavbar / MobileNav)                                        |
|  • 仪表盘 / 设备监控 / 告警中心 / RAG 知识库                                     |
|  • 集群节点切换 (SystemNodeModal)                                                |
|  • 双语国际化上下文层                                                             |
+-----------------------------------------------------------------------------------+
```

---

## 📂 项目结构

```
app/                  Next.js App Router — 页面与 API 路由
├── api/              REST API 代理层 (alerts, devices, documents, telemetry)
├── layout.tsx        全局布局（字体、I18nProvider、CSS）
└── page.tsx          入口页面（dynamic import src/App, ssr: false）
lib/                  数据层
├── db.ts             内存数据库、设备漂移模拟器、启发式诊断引擎
├── alertI18n.ts      告警与诊断字段中文本地化
└── utils.ts          cn() 工具函数 (clsx + tailwind-merge)
src/                  客户端应用
├── App.tsx           主 React 应用 — 路由、认证状态、API 编排
├── components/       按功能划分的 UI 组件 (layout/, alerts/, dashboard/, devices/, knowledge/, diagnosis/)
├── i18n/context.tsx  约 150 个键的 en/zh 翻译 Provider，支持变量插值
├── types.ts          核心 TypeScript 类型 (Alert, Device, Doc, DiagnosisReport)
└── theme/colors.ts   集中式暗色主题调色板
components/ui/        shadcn/ui 组件 (base-nova 样式, @base-ui/react, lucide 图标)
tests/                Vitest 测试文件
```

---

## 🚀 快速开始

### 环境要求

- [Node.js](https://nodejs.org/) v18+
- **pnpm**（推荐）— 安装方式：

```bash
npm install -g pnpm
# 或启用 Node.js Corepack:
corepack enable
```

### 安装依赖

```bash
pnpm install
```

### 配置后端引擎地址

诊断代理将请求转发至本地后端引擎。在项目根目录创建 `.env.local` 文件：

```env
BACKEND_ENGINE_URL="http://localhost:8000"
```

引擎运行 **Qwen 3.5 (4B)** 进行深度推理，**Qwen3-Embedding (0.6B)** 用于 RAG 知识检索。未配置此地址时，诊断请求将返回网关错误。

### 启动开发服务器

```bash
pnpm dev
```

打开 `http://localhost:3000`，使用 `admin` / `admin123456` 登录（或点击"快捷填入"）。

---

## 🧪 测试

项目使用 **Vitest** 进行单元测试和集成测试。

```bash
# 运行全部测试
npx vitest run

# 运行单个测试文件
npx vitest run tests/db.test.ts
```

> 注意：`package.json` 中没有 `pnpm test` 脚本，请直接使用 `npx vitest run`。

### 测试覆盖

1. **数据层与启发式诊断** (`tests/db.test.ts`) — 验证告警级别分类、设备指标约束、SOP 文档结构与诊断回退逻辑。
2. **双语国际化完整性** (`tests/i18n.test.ts`) — 扫描翻译字典，确保每个键均有完整的中英文释义。

> 提交 PR 前请依次执行：`pnpm lint`（仅 TypeScript 类型检查）→ `npx vitest run`。

---

## 🎨 UI 与设计

- **高对比度工业深色主题**：深色背景 (`#0B0E14`) 搭配赛博青 (`#00cfbf`)、警告金 (`#ffba43`)、告警红 (`#ffb4ab`)。
- **响应式布局**：桌面端全功能侧边栏与节点监视器；移动端自动折叠为原生 App 风格的底部导航栏。
- **技术栈**：Next.js 15 App Router、React 19、Tailwind CSS v4、shadcn/ui (base-nova + `@base-ui/react`)、Recharts、Framer Motion。

---

## 📄 许可证

[MIT](LICENSE) © 2026 kunlong-luo

---

<div align="center">
  <p><b>Built with engineering precision by Spark IoT Systems.</b> — v1.0.0</p>
</div>
