# SaaS Analytics Dashboard

[![CI and GitHub Pages](https://github.com/DanieleMasone/saas-analytics-dashboard/actions/workflows/pages.yml/badge.svg?branch=master)](https://github.com/DanieleMasone/saas-analytics-dashboard/actions/workflows/pages.yml)
[![Live Demo](https://img.shields.io/badge/demo-GitHub%20Pages-0e7490?logo=githubpages&logoColor=white)](https://danielemasone.github.io/saas-analytics-dashboard/)
[![Reference Docs](https://img.shields.io/badge/docs-TypeDoc-2563eb)](https://danielemasone.github.io/saas-analytics-dashboard/reference/)
[![Coverage](https://img.shields.io/badge/coverage-96%25-15803d)](https://danielemasone.github.io/saas-analytics-dashboard/coverage/)
[![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black?logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-61dafb?logo=react&logoColor=0f172a)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

A production-style SaaS analytics dashboard built with Next.js 16 App Router, React 19, TypeScript, TanStack Query, Recharts, Tailwind CSS, and typed mock data.

## Links

- Live dashboard: [danielemasone.github.io/saas-analytics-dashboard](https://danielemasone.github.io/saas-analytics-dashboard/)
- API reference: [reference docs](https://danielemasone.github.io/saas-analytics-dashboard/reference/)
- Coverage report: [coverage HTML](https://danielemasone.github.io/saas-analytics-dashboard/coverage/)
- Quality index: [quality.html](https://danielemasone.github.io/saas-analytics-dashboard/quality.html)

## Features

- Executive SaaS overview with KPI cards, revenue composition, customer health, and account risk.
- Searchable customer table with status/plan filters, pagination, empty state, and retry state.
- Jira-like delivery KPI examples for sprint predictability, cycle time, blockers, scope change, and issue risk.
- TanStack Query data flow with loading, error, refresh, and populated states.
- Accessible landmarks, named data regions, keyboard focus states, and screen-reader summaries for charts and health meters.
- Mock Route Handlers for local demos and static data mode for GitHub Pages.
- Persisted light/dark theme preference.
- Vitest and Testing Library coverage across utilities, data, API clients, Route Handlers, and UI states.
- TypeDoc reference generated from JSDoc/TSDoc comments.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- TanStack Query
- Recharts
- Tailwind CSS 4
- Lucide React icons
- Vitest, V8 coverage, jsdom, and Testing Library
- TypeDoc
- GitHub Actions and GitHub Pages

## Requirements

- Node.js 24.10.0 or newer
- npm 10 or newer

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The root route renders the dashboard directly, and `/dashboard` remains available as a dedicated route.

## Quality Commands

```bash
npm run typecheck
npm run lint
npm run test
npm run test:coverage
npm run docs
npm run docs:check
npm run quality
```

`npm run quality` runs typecheck, lint, coverage, and documentation validation in one command.

Coverage thresholds are enforced in `vitest.config.ts`:

```txt
statements: 90%
branches: 75%
functions: 90%
lines: 90%
```

Generated reports:

```txt
coverage/
docs/reference/
```

## GitHub Pages

The workflow in `.github/workflows/pages.yml` runs on pull requests, pushes to `master`, and manual dispatches.

On `master`, GitHub Pages publishes:

```txt
/             Static dashboard
/dashboard/   Static dashboard route
/api/delivery/ Static Jira-like delivery KPI JSON
/reference/   TypeDoc reference
/coverage/    HTML coverage report
/quality.html Report index
```

GitHub Pages does not run a Node.js server, so the Pages build uses:

```txt
GITHUB_PAGES=true
NEXT_PUBLIC_DATA_MODE=static
```

In static data mode, the client reads typed mock data directly instead of calling `/api/*`. The Route Handlers remain in the app for local demos and are marked `force-static` so Next.js can export them for Pages.

To test the Pages build locally on PowerShell:

```powershell
$env:GITHUB_PAGES='true'
$env:NEXT_PUBLIC_DATA_MODE='static'
npm run build:pages
```

## Agent Notes

`AGENTS.md` is the canonical instruction file for AI coding agents working on this repository. `CLAUDE.md` stays as a compatibility pointer to `AGENTS.md`.

Before changing Next.js routing, config, rendering behavior, API handlers, metadata, loading states, errors, or caching, check the relevant local Next.js 16 docs in:

```txt
node_modules/next/dist/docs/
```
