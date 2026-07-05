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
  db.ts               In-memory DB (globalThis singletons) + heuristic diagnosis engine
  alertI18n.ts        Chinese localization helpers for alert/diagnosis fields
  utils.ts            cn() helper (clsx + tailwind-merge)
components/ui/        shadcn/ui components (base-nova style, base-ui React, lucide icons)
tests/                Vitest test files
```

## Key architecture

- **Client-heavy SPA**: The actual app (`src/App.tsx`) is loaded via `next/dynamic` with `ssr: false`. Nearly all UI is client-rendered.
- **API routes are the "backend"**: All REST endpoints live under `app/api/`. They use an **in-memory DB** (`globalThis` singletons in `lib/db.ts`) — data resets on server restart.
- **Device drift simulation**: A 5-second `setInterval` in the server process (`lib/db.ts`, in the device getter) drifts device telemetry values and auto-generates new alerts when thresholds are exceeded (closed-loop simulation). Relevant when debugging unexpected device/alert state changes.
- **AI diagnosis flow**: `POST /api/alerts/diagnose/[alertId]` tries Gemini 3.5 Flash if `GEMINI_API_KEY` is configured, then falls back to `generateHeuristicDiagnosis()` in `lib/db.ts`.
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
- **Tests live in `tests/`**: `db.test.ts` (data layer + heuristic diagnosis) and `i18n.test.ts` (translation completeness).
- Test environment is `node` (not jsdom), so no DOM-dependent tests exist.
- Run: `npx vitest run` (no pnpm script defined).

## Dev notes

- Dev server reads `.env.local` for `GEMINI_API_KEY`. Without it, AI diagnosis falls back to the heuristic engine in `lib/db.ts`.
- The `metadata.json` file indicates this was originally designed for Google AI Studio deployment (auto-injected `GEMINI_API_KEY` and `APP_URL`).
- When adding new translation keys, both `en` and `zh` values are required (validated by `tests/i18n.test.ts`).
