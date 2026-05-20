# SaaS Analytics Dashboard

[![CI and GitHub Pages](https://github.com/DanieleMasone/saas-analytics-dashboard/actions/workflows/pages.yml/badge.svg?branch=master)](https://github.com/DanieleMasone/saas-analytics-dashboard/actions/workflows/pages.yml)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Coverage](https://img.shields.io/badge/coverage-96%25-15803d)](https://danielemasone.github.io/saas-analytics-dashboard/coverage/)
[![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black?logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-61dafb?logo=react&logoColor=0f172a)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

A portfolio-grade SaaS management dashboard built with Next.js 16, React 19, TypeScript, TanStack Query, Recharts, Tailwind CSS, typed mock APIs, generated documentation, coverage reporting, and GitHub Pages deployment.

The goal is not just to show a UI, but to demonstrate how I structure a product-like frontend: typed domain data, route-level states, responsive navigation, accessible data views, automated quality gates, and a static deployment pipeline.

## Live Artifacts

| Artifact | Link |
| --- | --- |
| Live dashboard | [danielemasone.github.io/saas-analytics-dashboard](https://danielemasone.github.io/saas-analytics-dashboard/) |
| API reference | [TypeDoc reference](https://danielemasone.github.io/saas-analytics-dashboard/reference/) |
| Coverage report | [HTML coverage](https://danielemasone.github.io/saas-analytics-dashboard/coverage/) |
| CI workflow | [GitHub Actions](https://github.com/DanieleMasone/saas-analytics-dashboard/actions/workflows/pages.yml) |

## What This Demonstrates

- Product thinking for a SaaS manager dashboard: revenue, customers, delivery, health, and settings workspaces.
- Next.js 16 App Router route conventions, Route Handlers, static export, and GitHub Pages base-path handling.
- Typed mock domain data that can power local API routes or static GitHub Pages data mode.
- TanStack Query server-state flows with loading, error, retry, refresh, empty, and populated states.
- Accessible dashboards with semantic landmarks, named regions, keyboard-friendly controls, native meters, chart summaries, and mobile navigation.
- Component-level UI primitives for buttons, badges, skeletons, meters, and reusable dashboard surfaces.
- Automated confidence through Vitest, Testing Library, V8 coverage thresholds, TypeScript, ESLint, TypeDoc, and CI.

## Product Scope

The dashboard is organized as focused workspaces instead of a single overloaded page:

| Route | Purpose |
| --- | --- |
| `/` and `/dashboard` | Executive overview with KPI cards, revenue composition, and operating pulse. |
| `/revenue` | Revenue trend, expansion/churn movement, and commercial summary. |
| `/customers` | Searchable customer table with filters, pagination, health, usage, and retry states. |
| `/delivery` | Jira-like sprint predictability, cycle time, blockers, scope change, and risk queue. |
| `/health` | Customer health distribution, low-usage accounts, and follow-up prioritization. |
| `/settings` | Alert subscriptions, operating guardrails, alert preview, data-source notes, and static deployment context. |

## Architecture

```txt
app/                         Next.js App Router routes and mock Route Handlers
components/dashboard/        Product dashboard views and composed feature panels
components/ui/               Small shared UI primitives
lib/api/                     Client data access for API and static modes
lib/mock-data/               Typed SaaS, customer, revenue, and Jira-like data
lib/utils/                   Formatting and Tailwind class helpers
providers/                   TanStack Query provider setup
types/                       Shared domain contracts
.github/workflows/           CI, coverage, docs, static export, and Pages deploy
```

Key implementation choices:

- `NEXT_PUBLIC_DATA_MODE=static` switches the client to local typed data for GitHub Pages.
- Route Handlers under `app/api/**/route.ts` stay available for local demos and are marked `force-static` for export compatibility.
- `NEXT_PUBLIC_BASE_PATH=saas-analytics-dashboard` keeps assets, routes, and favicon links correct under GitHub Pages.
- TypeDoc reads JSDoc/TSDoc comments from the public component, data, API, and type surfaces.

## Tech Stack

| Area | Tools |
| --- | --- |
| App | Next.js 16 App Router, React 19, TypeScript |
| Data | TanStack Query, typed mock data, static data mode |
| UI | Tailwind CSS 4, Recharts, Lucide React |
| Quality | ESLint, TypeScript, Vitest, Testing Library, V8 coverage |
| Docs and deploy | TypeDoc, GitHub Actions, GitHub Pages |

## Run Locally

Requirements:

- Node.js 24.10.0 or newer
- npm 10 or newer

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality Gates

```bash
npm run typecheck
npm run lint
npm run test
npm run test:coverage
npm run docs
npm run docs:check
npm run quality
```

`npm run quality` runs typecheck, lint, coverage, and documentation validation. Coverage thresholds are enforced in `vitest.config.ts`:

```txt
statements: 90%
branches: 75%
functions: 90%
lines: 90%
```

## GitHub Pages

The workflow runs on pull requests, pushes to `master`, and manual dispatches. On `master`, it builds the app, generates coverage and TypeDoc reports, attaches them to the static artifact, and deploys to GitHub Pages.

Pages build environment:

```txt
GITHUB_PAGES=true
NEXT_PUBLIC_BASE_PATH=saas-analytics-dashboard
NEXT_PUBLIC_DATA_MODE=static
```

Local Pages build on PowerShell:

```powershell
$env:GITHUB_PAGES='true'
$env:NEXT_PUBLIC_BASE_PATH='saas-analytics-dashboard'
$env:NEXT_PUBLIC_DATA_MODE='static'
npm run build:pages
```

Generated reports are intentionally ignored by Git and published as CI artifacts:

```txt
coverage/
docs/reference/
```

## License

Released under the MIT License. See [LICENSE](LICENSE).

Copyright (c) 2026 Daniele Masone.
