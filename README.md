<div align="center">

# ⚡ Spark IoT AI Diagnostic Agent

### Industrial AI Telemetry Diagnostic & RAG-Powered Remediation Platform  
*(工业智能物联网故障推理与自适应修复诊断系统)*

[![React](https://img.shields.io/badge/Frontend-React%2019-00cfbf?style=for-the-badge&logo=react&logoColor=0B0E14)](https://react.dev/)
[![Next.js](https://img.shields.io/badge/Framework-Next.js%2015-ffffff?style=for-the-badge&logo=next.js&logoColor=0B0E14)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript%205.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Gemini AI](https://img.shields.io/badge/AI%20Engine-Gemini%203.5%20Flash-ffba43?style=for-the-badge&logo=google&logoColor=0B0E14)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Tested%20With-Vitest%204.1-FCC72B?style=for-the-badge&logo=vitest&logoColor=0B0E14)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-MIT-4c566a?style=for-the-badge)](LICENSE)

---

<p align="center">
  <b>Spark IoT AI Agent</b> is built for modern Industrial IoT (IIoT) environments, combining high-frequency sensor telemetry, Retrieval-Augmented Generation (RAG) knowledge retrieval, and <b>Gemini 3.5 Flash</b> deep reasoning to deliver millisecond-level fault root-cause tracing, engineering drawing cross-referencing, and closed-loop remediation for complex manufacturing machinery.
</p>

</div>

---

## 🔐 Demo Login

The system includes a full authentication gateway for operational security.

```text
Username: admin
Password: admin123456
```

> The login page includes a **Quick Fill** button for one-click access to the telemetry dashboard. Logout is available from the top navbar and sidebar.

---

## ✨ Key Features

| Icon | Module | Description |
| :---: | :--- | :--- |
| 🛡️ | **Authentication Gateway** | Cyber-industrial login gateway with credential validation, session persistence, and real-time network status indicators. |
| 🌐 | **Bilingual i18n** | Full English (`en`) and Chinese (`zh`) translation support across login, dashboard, telemetry, SOP recommendations, and charts. Hot-switchable at any time. |
| 🧠 | **Gemini AI Diagnosis** | On threshold breach (vibration, overheating, etc.), automatically extracts multi-dimensional telemetry context and triggers AI deep reasoning with confidence-scored remediation timelines. |
| 📚 | **RAG Knowledge Base** | Upload maintenance manuals, schematics, and log files. AI automatically chunks and embeds content, then cross-references best practices during diagnosis. |
| 📡 | **Multi-Node Switching** | Hot-switch between distributed factory sector gateways (assembly line, hydraulics, warehouse). Real-time latency ping and online status per node. |
| 🎛️ | **Industrial Telemetry UI** | Dark cyber-industrial theme with sparkline charts, dynamic pulse node states, and multi-zone device matrix. |

---

## 🏗️ System Architecture

The system uses a modular layered architecture isolating data acquisition, inference, and human-machine interaction:

```
+-----------------------------------------------------------------------------------+
|                        [ 🔐 Login Gateway ]                                       |
|                     (admin / admin123456)                                         |
+-----------------------------------------------------------------------------------+
                                          | JWT / Session Auth
                                          v
+-----------------------------------------------------------------------------------+
|                        [ 🌐 Edge Data Collection ]                                |
|       (CNC-Axis-X1)           (Hydro-Pump 04)           (Ventilation Unit A)      |
+-----------------------------------------+-----------------------------------------+
                                          | High-frequency Telemetry / HTTP API
                                          v
+-----------------------------------------------------------------------------------+
|                         [ ⚡ Next.js API Layer ]                                   |
|   /api/alerts          /api/devices            /api/documents                     |
+-----------------------------------------+-----------------------------------------+
                                          |
        +---------------------------------+---------------------------------+
        | Real-time threshold triggers                                  | RAG retrieval
        v                                                                   v
+-------------------------------+                                 +-----------------+
|  🤖 Gemini 3.5 Flash Engine   | <====== (RAG Augmentation) ===== |  📚 Knowledge   |
|  (Evidence chain + confidence) |                                 |  (SOP library)  |
+-------------------------------+                                 +-----------------+
        |
        v
+-----------------------------------------------------------------------------------+
|                          [ 🖥️ Frontend UI ]                                       |
|  • Layout (Sidebar / TopNavbar / MobileNav)                                       |
|  • Dashboard / Device Monitor / Alert Center / RAG Ingestion                      |
|  • Cluster Nodes (SystemNodeModal)                                                |
|  • I18n Context Layer (Bilingual)                                                 |
+-----------------------------------------------------------------------------------+
```

---

## 📂 Project Structure

```
app/                  Next.js App Router — pages + API routes
├── api/              REST API proxy layer (alerts, devices, documents, telemetry)
├── layout.tsx        Global layout with fonts, I18nProvider, CSS
└── page.tsx          Entry point (dynamic import of src/App with ssr: false)
lib/                  Data layer
├── db.ts             In-memory DB, device drift simulator, heuristic diagnosis engine
├── alertI18n.ts      Chinese localization helpers for alert / diagnosis fields
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
- **pnpm** (recommended) — install via:

```bash
npm install -g pnpm
# or use Node.js Corepack:
corepack enable
```

### Install

```bash
pnpm install
```

### Configure AI API Key (Optional)

Create `.env.local` in the project root to enable real Gemini 3.5 Flash inference:

```env
GEMINI_API_KEY="your_google_ai_studio_api_key_here"
```

Without this key, AI diagnosis falls back to a built-in heuristic engine in `lib/db.ts`.

### Start Dev Server

```bash
pnpm dev
```

Open `http://localhost:3000`. Log in with `admin` / `admin123456` (or click Quick Fill).

---

## 🧪 Testing

The project uses **Vitest** for unit and integration tests.

```bash
# Run all tests
npx vitest run

# Run a single test file
npx vitest run tests/db.test.ts
```

Note: there is no `pnpm test` script; use `npx vitest run` directly.

### Test Coverage

1. **Data Layer & Heuristic Diagnosis** (`tests/db.test.ts`) — validates alert severity classification, device metric constraints, SOP document structure, and diagnosis fallback logic.
2. **Bilingual i18n Completeness** (`tests/i18n.test.ts`) — scans the translation dictionary ensuring every key has both English and Chinese values with no gaps.

> Before submitting PRs: run `pnpm lint` (TypeScript check only) then `npx vitest run`.

---

## 🎨 UI & Design

- **High-Contrast Industrial Slate Theme**: Dark background (`#0B0E14`) with cyber-teal accents (`#00cfbf`), warning gold (`#ffba43`), and alert red (`#ffb4ab`).
- **Responsive Layout**: Full sidebar + node monitor on desktop; collapses to mobile bottom nav (native app style) on smaller screens.
- **Technology**: Next.js 15 App Router, React 19, Tailwind CSS v4, shadcn/ui (base-nova with `@base-ui/react`), Recharts, Framer Motion.

---

## 📄 License

[MIT](LICENSE) © 2026 kunlong-luo

---

<div align="center">
  <p><b>Built with engineering precision by Spark IoT Systems.</b></p>
</div>
