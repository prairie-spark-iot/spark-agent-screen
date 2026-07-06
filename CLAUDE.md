# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

| Command | What it does |
|---|---|
| `pnpm dev` | Dev server on `:3000`, uses `./.next-dev/` output |
| `pnpm build` | Production build, uses `./.next/` output |
| `pnpm start` | Production server on `:3000` |
| `pnpm lint` | **TypeScript check only** (`tsc --noEmit`). No ESLint, no Prettier. |
| `npx vitest run` | Run all tests (no `pnpm test` script in package.json). |
| `npx vitest run tests/db.test.ts` | Run a single test file. |

Run order for PR-ready changes: `tsc --noEmit` → `npx vitest run`.

Always use `pnpm` (not `npm install`) — `pnpm-lock.yaml` is the lockfile of record.

## Project structure

```
app/                  Next.js App Router — pages + API routes
  page.tsx            Entry page: dynamic(() => import(@/src/App), { ssr: false })
  layout.tsx          Root layout: Inter + JetBrains Mono fonts, I18nProvider, globals
  api/                REST API routes (alerts, devices, documents, telemetry)
src/                  Client-side application
  App.tsx             Main React app: routing, auth state, API fetch, orchestration
  components/         UI per-feature: layout/, alerts/, dashboard/, devices/, knowledge/, diagnosis/, system/
  i18n/context.tsx    ~150-key en/zh translation provider, t() helper with variable interpolation
  types.ts            Alert, Device, Doc, DiagnosisReport
  theme/colors.ts     Centralized dark-theme palette constants
lib/                  Server-only data layer
  db.ts               In-memory DB (globalThis singletons) — mock fallback for BACKEND_SOURCE_*=mock only
  alertI18n.ts        Chinese localization helpers for alert/diagnosis fields
  utils.ts            cn() helper (clsx + tailwind-merge)
components/ui/        shadcn/ui components (base-nova style, base-ui React, lucide icons)
tests/                Vitest test files
```

## Key architecture

- **Client-heavy SPA**: The actual app (`src/App.tsx`) is loaded via `next/dynamic` with `ssr: false`. Nearly all UI is client-rendered.
- **API routes are a BFF over `spark-agent-engine`**: All REST endpoints live under `app/api/`. `devices`/`alerts` GET routes and the `diagnose`/`approve-action`/`auto-diagnose-all` POST routes proxy to the real engine (`BACKEND_ENGINE_URL`) via adapters in `lib/adapters/`, translating its DTOs into this app's `Alert`/`Device` shapes — see `spark-agent-docs/frontend-backend-integration-strategy.md` and `phase-1-2-api-data-contracts.md` in the workspace root's `spark-agent-docs/`. `lib/db.ts`'s **in-memory mock** only backs `GET /api/devices`/`GET /api/alerts` when `BACKEND_SOURCE_DEVICE`/`BACKEND_SOURCE_ALERT` is explicitly set to `mock`, or as a fallback if the engine fetch throws — data resets on server restart in that mode.
- **Device drift simulation**: A 5-second `setInterval` in the server process (`lib/db.ts`, in the device getter) drifts device telemetry values and auto-generates new alerts when thresholds are exceeded (closed-loop simulation) — only active in mock mode.
- **AI diagnosis flow**: `POST /api/alerts/diagnose/[alertId]` proxies to the engine's `POST /api/alerts/{id}/diagnose` (202 Accepted, async via the engine's Kafka/Ollama pipeline — no Gemini, no client fallback). The alert shows "Diagnosing" immediately; the real diagnosis arrives via the existing 4s poll once the engine's single-concurrency consumer completes it. `POST /api/alerts/approve-action/[alertId]` proxies to the engine's `POST /api/alerts/{id}/approve` — it does **not** reset the device to nominal values like the old mock did; that "physical remediation" behavior was mock-only simulation and was never implemented against the real engine (open product question, not decided).
- **Auth**: Client-side only. `admin / admin123456`, stored in `localStorage` key `spark_iot_auth`. No real auth — do not treat this as a security boundary.

## API routes

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/alerts` | List alerts |
| POST | `/api/alerts/diagnose/[alertId]` | Run AI diagnosis on one alert |
| POST | `/api/alerts/approve-action/[alertId]` | Approve action plan + reset device metrics |
| POST | `/api/alerts/auto-diagnose-all` | Diagnose all pending alerts in parallel |
| GET | `/api/devices` | List devices |
| POST | `/api/devices` | Add a device |
| GET | `/api/documents` | List documents |
| GET | `/api/telemetry/sync` | Batch fetch {alerts, devices, documents} |

## Stack quirks

- **Tailwind v4**: Uses `@tailwindcss/postcss` plugin and `@import "tailwindcss"` syntax — **not** Tailwind v3 style with `@tailwind` directives.
- **TypeScript `strict: false`**. Type errors still matter, but the compiler is lenient.
- **No ESLint / Prettier / CI workflows**. Only type-checking is configured.
- **shadcn/ui v4 (base-nova)**: Uses `@base-ui/react` instead of Radix. Components are in `components/ui/`.
- **Path alias**: `@/` maps to project root (e.g. `import { cn } from '@/lib/utils'`).
- **Next.js 15 async params**: All route handlers use `{ params }: { params: Promise<{...}> }` with `await params`.

## Testing

- **Framework**: Vitest 4 with `@vitejs/plugin-react`.
- **Tests live in `tests/`**: `db.test.ts` (mock data layer), `deviceAdapter.test.ts`/`alertAdapter.test.ts` (engine-DTO-to-UI-shape mapping, incl. real-world dirty-data fallbacks), and `i18n.test.ts` (translation completeness).
- Test environment is `node` (not jsdom), so no DOM-dependent tests exist.
- Run: `npx vitest run` (no pnpm script defined).

## Dev notes

- Dev server reads `.env.local` for `BACKEND_ENGINE_URL`, `BACKEND_SOURCE_DEVICE`, `BACKEND_SOURCE_ALERT` (see `.env.example`). There is no Gemini integration anymore — it was fully removed once the engine's own Ollama-backed diagnosis pipeline was wired up.
- The `metadata.json` file indicates this was originally designed for Google AI Studio deployment (auto-injected `APP_URL`); its Gemini capability declaration was removed along with the SDK.
- When adding new translation keys, both `en` and `zh` values are required (validated by `tests/i18n.test.ts`).
