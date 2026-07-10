<div align="center">

# 🖥️ Spark Agent Screen

[English](README.md) | **中文**

### 工业物联网管理控制台 — [spark-agent-engine](https://github.com/kunlong-luo/spark-agent-engine) 的 Web 界面  
*(Industrial IoT Management Dashboard)*

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38B2AC?logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-4-000000?logo=shadcnui&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-4-6DB33F?logo=vitest&logoColor=white)

---

<p align="center">
  <b>Spark Agent Screen</b> 是 <b>spark-agent-engine</b> 的 Web 管理控制台 —— 为工业 IoT 遥测接入、规则告警与 AI 根因诊断平台提供全面的图形化界面，包含设备监控、告警管理、AI 诊断审核与 RAG 知识库管理等功能。
</p>

</div>

---

## 🔗 项目生态

| 项目 | 角色 |
|---|---|
| **spark-agent-screen**（本仓库） | Web 管理界面 —— Next.js 15 BFF + React 19 SPA |
| [spark-agent-engine](https://github.com/kunlong-luo/spark-agent-engine) | 工业 IoT 引擎 —— 遥测接入、告警规则、AI 诊断、RAG 知识库（Spring Boot 4 / Java 25） |
| spark-agent-docs | 集成策略、API 契约、架构决策记录 |

本控制台采用 **BFF（Backend For Frontend）** 模式：将 API 请求代理至 `spark-agent-engine`，将其 DTO 转换为 UI 友好类型，并内置内存 mock，可在无需引擎的情况下独立运行演示。

---

## 🔐 演示登录

```text
用户名: admin
密码: admin123456
```

> 登录页面支持 **快捷填入** 按钮一键登录。认证基于客户端 localStorage 实现，不构成真实安全边界。

---

## ✨ 功能特性

| 模块 | 说明 |
| :--- | :--- |
| **设备监控** | 实时设备列表、在线状态指示、遥测微型趋势图、多节点切换 |
| **告警控制台** | 活跃告警列表（严重程度分级、阈值上下文、诊断状态追踪） |
| **AI 诊断** | 对任意告警触发根因分析，查看 LLM 生成的诊断结论（根因、置信度、处置建议），支持批量自动诊断 |
| **处置审批** | 审核并批准 AI 建议的处置方案 |
| **RAG 知识库** | 上传管理设备手册、SOP 与技术文档；AI 自动切片嵌入，诊断时进行语义检索辅助推理 |
| **双语国际化** | 完整的中英文界面，随时热切换 |
| **工业暗色主题** | 高对比度深色设计，赛博青点缀，专为控制室环境优化 |

---

## 🏗️ 系统架构

```
+-------------------------------------------------------------------+
|                    [ spark-agent-screen ]                         |
|  Next.js 15 App Router — BFF 层                                   |
|  +-----------+  +-----------+  +-------------+  +-------------+   |
|  | 设备监控   |  | 告警控制台 |  | 诊断面板    |  | 知识库管理  |   |
|  +-----+-----+  +-----+-----+  +------+------+  +------+------+   |
|        |              |                |                |          |
|  +-----+--------------+----------------+----------------+------+   |
|  |            API 代理层（适配器）                             |   |
|  |  /api/devices  /api/alerts  /api/alerts/diagnose/[...]    |   |
|  |  /api/documents  /api/telemetry/sync                       |   |
|  +-----+--------------+----------------+----------------+------+   |
|        |              |                |                |          |
|  +-----+--------------+----------------+----------------+------+   |
|  |        内存 Mock（lib/db.ts）       ← 仅作为回退降级方案     |   |
|  +------------------------------------------------------------+   |
+---------------------------+---------------------------------------+  
                            | HTTP REST API (BACKEND_ENGINE_URL)
                            v
+-------------------------------------------------------------------+
|                    [ spark-agent-engine ]                          |
|  Spring Boot 4 / Java 25                                          |
|  MQTT → PostgreSQL → Kafka → AI 诊断 (Ollama)                    |
|  RAG（pgvector + HNSW）→ MCP 工具服务                            |
+-------------------------------------------------------------------+
```

数据流向：
1. 引擎通过 MQTT 接入设备遥测，持久化存储、匹配告警规则、运行 AI 根因诊断
2. 本控制台通过 REST API 代理引擎的读写请求
3. 引擎不可用时，内置 mock（`lib/db.ts`）配合设备漂移模拟器提供演示数据
4. 浏览器通过 WebSocket（STOMP）直连引擎，获取实时遥测更新

---

## 📂 项目结构

```
app/                  Next.js App Router — 页面与 API 路由
├── api/              BFF 代理层 (alerts, devices, documents, telemetry)
├── layout.tsx        全局布局 — 字体、I18nProvider、globals.css
└── page.tsx          入口页面 — dynamic import src/App (ssr: false)
lib/                  服务端数据层
├── adapters/         引擎 DTO → UI 类型转换器 (alertAdapter, deviceAdapter)
├── db.ts             内存 mock 数据库 + 设备漂移模拟器
├── alertI18n.ts      告警/诊断字段中文本地化
└── utils.ts          cn() 工具函数 (clsx + tailwind-merge)
src/                  客户端应用
├── App.tsx           主 React 应用 — 路由、认证状态、API 编排
├── components/       按功能划分 UI 组件 (layout/, alerts/, dashboard/, devices/, knowledge/, diagnosis/)
├── i18n/context.tsx  约 150 键的 en/zh 翻译 Provider，支持变量插值
├── types.ts          核心 TypeScript 类型 (Alert, Device, Doc, DiagnosisReport)
└── theme/colors.ts   集中式暗色主题调色板
components/ui/        shadcn/ui 组件 (base-nova 样式, @base-ui/react, lucide 图标)
tests/                Vitest 测试文件
```

---

## 🚀 快速开始

### 环境要求

- [Node.js](https://nodejs.org/) v18+
- **pnpm**（推荐）

```bash
npm install -g pnpm
# 或通过 corepack 启用：
corepack enable
```

### 安装依赖

```bash
pnpm install
```

### 连接后端引擎运行（推荐）

将控制台指向正在运行的 `spark-agent-engine` 实例：

```env
# .env.local
BACKEND_ENGINE_URL="http://localhost:8080"
BACKEND_SOURCE_DEVICE="engine"
BACKEND_SOURCE_ALERT="engine"
```

启动开发服务器：

```bash
pnpm dev
```

打开 `http://localhost:3000`，使用 `admin` / `admin123456` 登录。

### 独立运行（Mock 模式，无需引擎）

控制台可完全自包含运行，使用内置内存 mock（`lib/db.ts`）。内置的设备漂移模拟器每 5 秒自动变更遥测值并生成告警。

```env
# .env.local — BACKEND_SOURCE_{DEVICE,ALERT} 未设置时默认 "mock"
# 无需配置 BACKEND_ENGINE_URL
```

```bash
pnpm dev
```

---

## 🧪 测试

```bash
# 运行全部测试
npx vitest run

# 运行单个测试文件
npx vitest run tests/db.test.ts
```

### 测试覆盖

1. **数据层与启发式诊断** (`tests/db.test.ts`) — 验证告警级别分类、设备约束、文档结构与诊断回退逻辑
2. **适配器层** (`tests/alertAdapter.test.ts`, `tests/deviceAdapter.test.ts`) — 引擎 DTO 到 UI 类型的映射，含脏数据处理
3. **双语国际化完整性** (`tests/i18n.test.ts`) — 确保每个翻译键均有中英文值

> 提交 PR 前请依次执行：`pnpm lint`（TypeScript 类型检查）→ `npx vitest run`。

---

## 🎨 UI 与设计

- **工业深色主题**：深色背景 (`#0B0E14`) 搭配赛博青 (`#00cfbf`)、警告金 (`#ffba43`)、告警红 (`#ffb4ab`)
- **响应式布局**：桌面端全功能侧边栏与节点监视器；移动端自动折叠为底部导航栏
- **技术栈**：Next.js 15 App Router、React 19、Tailwind CSS v4、shadcn/ui（base-nova + `@base-ui/react`）、Recharts、Framer Motion

---

## 📄 许可证

[MIT](LICENSE) © 2026 kunlong-luo

---

<div align="center">
  <p><b>Built with engineering precision by Spark IoT Systems.</b> — v1.0.0</p>
</div>
