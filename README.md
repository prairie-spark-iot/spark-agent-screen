<div align="center">

# 🖥️ Spark Agent Screen

**English** | [中文](README.zh.md)

### Industrial IoT Management Dashboard — Web UI for [spark-agent-engine](https://github.com/kunlong-luo/spark-agent-engine)  
*(工业物联网管理控制台)*

[![Version](https://img.shields.io/badge/Version-1.0.0-00cfbf?style=for-the-badge&logo=semver&logoColor=0B0E14)](https://github.com/kunlong-luo/spark-agent-screen)
[![React](https://img.shields.io/badge/Frontend-React%2019-00cfbf?style=for-the-badge&logo=react&logoColor=0B0E14)](https://react.dev/)
[![Next.js](https://img.shields.io/badge/Framework-Next.js%2015-ffffff?style=for-the-badge&logo=next.js&logoColor=0B0E14)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript%205.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/UI-shadcn%2Fui%20v4-000000?style=for-the-badge&logo=shadcnui&logoColor=white)](https://ui.shadcn.com/)
[![Vitest](https://img.shields.io/badge/Tested%20With-Vitest%204.1-FCC72B?style=for-the-badge&logo=vitest&logoColor=0B0E14)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-MIT-4c566a?style=for-the-badge)](LICENSE)

---

<p align="center">
  <b>Spark Agent Screen</b> is the web management console for the <b>spark-agent-engine</b> — an industrial IoT telemetry access, rule alerting, and AI root-cause diagnosis platform. It provides a comprehensive dark-themed dashboard for device monitoring, alert management, AI diagnosis review, and RAG knowledge base administration.
</p>

</div>

---

## 🔗 Project Ecosystem

| Project | Role |
|---|---|
| **spark-agent-screen** (this repo) | Web management UI — Next.js 15 BFF + React 19 SPA |
| [spark-agent-engine](https://github.com/kunlong-luo/spark-agent-engine) | Industrial IoT engine — telemetry ingestion, alert rules, AI diagnosis, RAG knowledge base (Spring Boot 4 / Java 25) |
| spark-agent-docs | Integration strategy, API contracts, architecture decisions |

This dashboard acts as a **Backend For Frontend (BFF)**: it proxies API requests to `spark-agent-engine`, translates its DTOs into UI-friendly shapes, and can fall back to a built-in in-memory mock for standalone demo/dev without the engine running.

---

## 🔐 Demo Login

```text
Username: admin
Password: admin123456
```

> The login page includes a **Quick Fill** button for one-click access. Auth is client-side only (localStorage) — no real security boundary.

---

## ✨ Features

| Module | Description |
| :--- | :--- |
| **Device Monitor** | Real-time device list, status indicators, telemetry sparkline charts, multi-node switching |
| **Alert Console** | Active alerts with severity classification, threshold context, diagnosis status tracking |
| **AI Diagnosis** | Trigger root-cause analysis on any alert, view LLM-generated diagnosis (root cause, confidence, remediation suggestions), batch auto-diagnose pending alerts |
| **Action Approval** | Review and approve AI-proposed remediation actions |
| **RAG Knowledge Base** | Upload and manage device manuals, SOPs, and technical documents; AI automatically chunks and embeds for semantic retrieval during diagnosis |
| **Bilingual i18n** | Full English and Chinese UI — hot-switchable at any time |
| **Industrial Dark Theme** | High-contrast slate design with cyber-teal accents, optimized for control room environments |

---

## 🏗️ Architecture

```
+-------------------------------------------------------------------+
|                    [ spark-agent-screen ]                         |
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

---

## 📂 Project Structure

```
app/                  Next.js App Router — pages + API routes
├── api/              BFF proxy layer (alerts, devices, documents, telemetry)
├── layout.tsx        Global layout — fonts, I18nProvider, globals.css
└── page.tsx          Entry point — dynamic import of src/App (ssr: false)
lib/                  Server-only data layer
├── adapters/         Engine DTO → UI type mappers (alertAdapter, deviceAdapter)
├── db.ts             In-memory mock DB + device drift simulator
├── alertI18n.ts      Chinese localization for alert/diagnosis fields
└── utils.ts          cn() helper (clsx + tailwind-merge)
src/                  Client-side application
├── App.tsx           Main React app — routing, auth state, API orchestration
├── components/       Per-feature UI (layout/, alerts/, dashboard/, devices/, knowledge/, diagnosis/)
├── i18n/context.tsx  ~150-key en/zh translation provider with variable interpolation
├── types.ts          Core TypeScript types (Alert, Device, Doc, DiagnosisReport)
└── theme/colors.ts   Centralized dark-theme design palette
components/ui/        shadcn/ui components (base-nova style, @base-ui/react, lucide icons)
tests/                Vitest test files
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- **pnpm** (recommended)

```bash
npm install -g pnpm
# or via corepack:
corepack enable
```

### Install

```bash
pnpm install
```

### Run with Backend Engine (recommended)

Point the UI to a running instance of `spark-agent-engine`:

```env
# .env.local
BACKEND_ENGINE_URL="http://localhost:8080"
BACKEND_SOURCE_DEVICE="engine"
BACKEND_SOURCE_ALERT="engine"
```

Then start:

```bash
pnpm dev
```

Open `http://localhost:3000`. Log in with `admin` / `admin123456`.

### Run Standalone (mock mode, no engine needed)

The UI can run entirely self-contained using the built-in in-memory mock (`lib/db.ts`), which includes a device drift simulator that auto-generates telemetry changes and alerts every 5 seconds.

```env
# .env.local — BACKEND_SOURCE_{DEVICE,ALERT} default to "mock" when unset
# No BACKEND_ENGINE_URL needed
```

```bash
pnpm dev
```

---

## 🧪 Testing

```bash
# Run all tests
npx vitest run

# Run a single test file
npx vitest run tests/db.test.ts
```

### Test Coverage

1. **Data Layer & Heuristic Diagnosis** (`tests/db.test.ts`) — validates alert severity, device constraints, document structure, and diagnosis fallback logic
2. **Adapter Layer** (`tests/alertAdapter.test.ts`, `tests/deviceAdapter.test.ts`) — engine DTO-to-UI shape mapping with dirty-data fallbacks
3. **i18n Completeness** (`tests/i18n.test.ts`) — every translation key has both English and Chinese values

> Before submitting PRs: `pnpm lint` (TypeScript check) → `npx vitest run`.

---

## 🎨 UI & Design

- **Industrial Slate Theme**: Dark background (`#0B0E14`) with cyber-teal accents (`#00cfbf`), warning gold (`#ffba43`), and alert red (`#ffb4ab`)
- **Responsive Layout**: Full sidebar on desktop; collapses to mobile bottom nav on smaller screens
- **Tech Stack**: Next.js 15 App Router, React 19, Tailwind CSS v4, shadcn/ui (base-nova with `@base-ui/react`), Recharts, Framer Motion

---

## 📄 License

[MIT](LICENSE) © 2026 kunlong-luo

---

<div align="center">
  <p><b>Built with engineering precision by Spark IoT Systems.</b> — v1.0.0</p>
</div>
