<div align="center">

# ⚡ Spark Agent Screen

**Web management console for [spark-agent-engine](https://github.com/prairie-spark-iot/spark-agent-engine).**
A Next.js 15 Backend-for-Frontend (BFF) and React 19 SPA — from device telemetry monitoring to AI diagnosis review, all in one dark-themed dashboard.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38B2AC?logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-4-000000?logo=shadcnui&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-4-6DB33F?logo=vitest&logoColor=white)

**English** · [简体中文](./README.zh.md)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Testing](#testing)
- [Related Projects](#related-projects)
- [License](#license)

---

## 📖 Overview

**Spark Agent Screen** is the web management UI for the [spark-agent-engine](https://github.com/prairie-spark-iot/spark-agent-engine) — an industrial IoT telemetry ingestion, rule alerting, and AI root-cause diagnosis platform. It provides a comprehensive graphical interface for device monitoring, alert management, AI diagnosis review, and RAG knowledge base administration.

The UI acts as a **Backend for Frontend (BFF)**: it proxies API requests to the engine, translates its DTOs into UI-friendly shapes, and can fall back to a built-in in-memory mock for standalone demo/dev without the engine running.

## 🏗️ Architecture

```
+-------------------------------------------------------------------+
|                    [ Spark Agent Screen ]                          |
|  Next.js 15 App Router — BFF layer                                |
|  +-----------+  +-----------+  +-------------+  +-------------+   |
|  | Device    |  | Alert     |  | Diagnosis   |  | Knowledge   |   |
|  | Monitor   |  | Console   |  | Dashboard   |  | Manager     |   |
|  +-----+-----+  +-----+-----+  +------+------+  +------+------+   |
|        |              |                |                |          |
|  +-----+--------------+----------------+----------------+------+   |
|  |              API Proxy Layer (adapters)                    |   |
|  |  /api/devices  /api/alerts  /api/alerts/diagnose/[...]    |   |
|  |  /api/documents  /api/telemetry/sync                       |   |
|  +-----+--------------+----------------+----------------+------+   |
|        |              |                |                |          |
|  +-----+--------------+----------------+----------------+------+   |
|  |         In-Memory Mock (lib/db.ts)   ← fallback only       |   |
|  +------------------------------------------------------------+   |
+---------------------------+---------------------------------------+
                            | HTTP REST API (BACKEND_ENGINE_URL)
                            v
+-------------------------------------------------------------------+
|                    [ spark-agent-engine ]                          |
|  Spring Boot 4 / Java 25                                          |
|  MQTT → PostgreSQL → Kafka → AI Diagnosis (Ollama)               |
|  RAG (pgvector + HNSW) → MCP Tool Server                          |
+-------------------------------------------------------------------+
```

Data flow:
1. The engine ingests device telemetry via MQTT, persists it, evaluates alert rules, and runs AI diagnosis
2. This UI proxies read/write requests to the engine's REST API
3. When the engine is unavailable, the built-in mock (`lib/db.ts`) provides demo data with a device drift simulator
4. WebSocket (STOMP) connects the browser directly to the engine for real-time telemetry updates

## ✨ Key Features

| Module | What it does |
|---|---|
| **Device Monitor** | Real-time device list with online status indicators, telemetry sparkline charts, and multi-node switching across factory sectors |
| **Alert Console** | Active alerts with severity classification, threshold context, diagnosis status tracking; supports batch auto-diagnose |
| **AI Diagnosis Review** | Trigger root-cause analysis on any alert, view LLM-generated diagnosis (root cause, confidence score, remediation suggestion), approve or reject proposed actions |
| **RAG Knowledge Base** | Upload device manuals, SOPs, and technical documents; AI automatically chunks and embeds for semantic retrieval during diagnosis |
| **Bilingual i18n** | Full English (en) and Chinese (zh) UI, hot-switchable at any time |
| **Authentication** | Client-side login gateway (admin / admin123456) with session persistence |

## 🧰 Tech Stack

| Category | Technology |
|---|---|
| **Framework** | Next.js 15 App Router · React 19 |
| **Language** | TypeScript 5.8 |
| **Styling** | Tailwind CSS v4 · shadcn/ui (base-nova with @base-ui/react) |
| **Charts** | Recharts · Framer Motion |
| **Testing** | Vitest 4 |
| **Data (mock)** | In-memory DB (globalThis singletons) with device drift simulator |
| **Integration** | BFF adapters translating engine DTOs to UI types |

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- **pnpm** (recommended)

```bash
npm install -g pnpm
# or enable via corepack:
corepack enable
```

### Install

```bash
pnpm install
```

### Run with Backend Engine

Point the UI to a running instance of `spark-agent-engine`:

```bash
# .env.local
BACKEND_ENGINE_URL="http://localhost:8080"
BACKEND_SOURCE_DEVICE="engine"
BACKEND_SOURCE_ALERT="engine"
```

```bash
pnpm dev
```

Open `http://localhost:3000`. Log in with `admin` / `admin123456`.

### Run Standalone (mock mode, no engine needed)

The UI can run entirely self-contained using the built-in in-memory mock, which includes a device drift simulator that auto-generates telemetry changes and alerts every 5 seconds.

```bash
# BACKEND_SOURCE_{DEVICE,ALERT} default to "mock" when unset.
# No BACKEND_ENGINE_URL needed.
pnpm dev
```

## 🧪 Testing

```bash
# Run all tests
npx vitest run

# Run a single test file
npx vitest run tests/db.test.ts
```

### Test Coverage

1. **Data Layer & Heuristic Diagnosis** (`tests/db.test.ts`) — validates alert severity classification, device metric constraints, SOP document structure, and diagnosis fallback logic
2. **Adapter Layer** (`tests/alertAdapter.test.ts`, `tests/deviceAdapter.test.ts`) — engine DTO-to-UI shape mapping with dirty-data fallbacks
3. **Bilingual i18n Completeness** (`tests/i18n.test.ts`) — every translation key has both English and Chinese values

> Before submitting PRs: run `pnpm lint` (TypeScript check only) then `npx vitest run`.

## 🔗 Related Projects

- [spark-agent-engine](https://github.com/prairie-spark-iot/spark-agent-engine) — the industrial IoT engine this UI is built for: telemetry ingestion, alert rules, AI diagnosis, RAG knowledge base (Spring Boot 4 / Java 25)
- [spark-iot-emulator](https://github.com/prairie-spark-iot/spark-iot-emulator) — a device telemetry emulator that publishes MQTT messages to EMQX, used for reproducing fault scenarios
- [spark-ai-infra](https://github.com/prairie-spark-iot/spark-ai-infra) — shared middleware infrastructure (EMQX, PostgreSQL+pgvector, Redis, Kafka) via Docker Compose

## 📄 License

Released under the [MIT License](./LICENSE).
