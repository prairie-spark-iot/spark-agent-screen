<div align="center">

# Spark Agent Screen

**[spark-agent-engine](https://github.com/prairie-spark-iot/spark-agent-engine) 的 Web 管理控制台**
基于 Next.js 15 BFF 与 React 19 SPA 构建，提供设备遥测监控、告警管理、AI 诊断审核与 RAG 知识库管理等功能。

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38B2AC?logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-4-000000?logo=shadcnui&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-4-6DB33F?logo=vitest&logoColor=white)

[English](README.md) · **中文**

</div>

---

## 目录

- [概述](#概述)
- [系统架构](#系统架构)
- [核心功能](#核心功能)
- [技术栈](#技术栈)
- [快速开始](#快速开始)
- [测试](#测试)
- [相关项目](#相关项目)
- [许可证](#许可证)

---

## 📖 概述

**Spark Agent Screen** 是 [spark-agent-engine](https://github.com/prairie-spark-iot/spark-agent-engine) 的 Web 管理界面 —— 为工业 IoT 遥测接入、规则告警与 AI 根因诊断平台提供全面的图形化管理控制台，包含设备监控、告警管理、AI 诊断审核与 RAG 知识库管理等功能。

本控制台采用 **BFF（Backend for Frontend）** 模式：将 API 请求代理至引擎，将其 DTO 转换为 UI 友好类型，并内置内存 mock，可在无需引擎的情况下独立运行演示。

## 🏗️ 系统架构

```
+-------------------------------------------------------------------+
|                    [ Spark Agent Screen ]                          |
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

## ✨ 核心功能

| 模块 | 说明 |
|---|---|
| **设备监控** | 实时设备列表与在线状态指示、遥测微型趋势图、多车间节点热切换 |
| **告警控制台** | 按严重程度分级的活跃告警列表，支持阈值上下文展示与批量自动诊断 |
| **AI 诊断审核** | 对任意告警触发根因分析，查看 LLM 生成的诊断结论（根因、置信度、处置建议），审核或批准处置方案 |
| **RAG 知识库** | 上传设备手册、SOP 与技术文档，AI 自动切片嵌入，诊断时进行语义检索辅助推理 |
| **双语国际化** | 完整的中英文界面，支持随时热切换 |
| **身份认证** | 客户端登录网关（admin / admin123456），支持会话持久化 |

## 🧰 技术栈

| 分类 | 技术 |
|---|---|
| **框架** | Next.js 15 App Router · React 19 |
| **语言** | TypeScript 5.8 |
| **样式** | Tailwind CSS v4 · shadcn/ui（base-nova + @base-ui/react）|
| **图表** | Recharts · Framer Motion |
| **测试** | Vitest 4 |
| **数据层（mock）** | 内存数据库（globalThis 单例）+ 设备漂移模拟器 |
| **集成层** | BFF 适配器，将引擎 DTO 转换为 UI 类型 |

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

### 连接后端引擎运行

将控制台指向正在运行的 `spark-agent-engine` 实例：

```bash
# .env.local
BACKEND_ENGINE_URL="http://localhost:8080"
BACKEND_SOURCE_DEVICE="engine"
BACKEND_SOURCE_ALERT="engine"
```

```bash
pnpm dev
```

打开 `http://localhost:3000`，使用 `admin` / `admin123456` 登录。

### 独立运行（Mock 模式，无需引擎）

控制台可完全自包含运行，使用内置内存 mock。设备漂移模拟器每 5 秒自动变更遥测值并生成告警。

```bash
# BACKEND_SOURCE_{DEVICE,ALERT} 未设置时默认 "mock"
# 无需配置 BACKEND_ENGINE_URL
pnpm dev
```

## 🧪 测试

```bash
# 运行全部测试
npx vitest run

# 运行单个测试文件
npx vitest run tests/db.test.ts
```

### 测试覆盖

1. **数据层与启发式诊断**（`tests/db.test.ts`）— 验证告警级别分类、设备约束、文档结构与诊断回退逻辑
2. **适配器层**（`tests/alertAdapter.test.ts`、`tests/deviceAdapter.test.ts`）— 引擎 DTO 到 UI 类型的映射，含脏数据处理
3. **双语国际化完整性**（`tests/i18n.test.ts`）— 确保每个翻译键均有中英文值

> 提交 PR 前请依次执行：`pnpm lint`（TypeScript 类型检查）→ `npx vitest run`。

## 🔗 相关项目

- [spark-agent-engine](https://github.com/prairie-spark-iot/spark-agent-engine) — 本 UI 所面向的工业 IoT 引擎：遥测接入、告警规则、AI 诊断、RAG 知识库（Spring Boot 4 / Java 25）
- [spark-iot-emulator](https://github.com/prairie-spark-iot/spark-iot-emulator) — 设备遥测模拟器，向 EMQX 发布 MQTT 消息，用于故障场景复现
- [spark-ai-infra](https://github.com/prairie-spark-iot/spark-ai-infra) — 共享中间件基础设施（EMQX、PostgreSQL+pgvector、Redis、Kafka）Docker Compose 配置

## 📄 许可证

基于 [MIT License](./LICENSE) 开源。
