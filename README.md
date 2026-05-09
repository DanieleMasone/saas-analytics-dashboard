# SaaS Analytics Dashboard

A production-style SaaS analytics dashboard built with Next.js 16 App Router, React 19, TypeScript, TanStack Query, Recharts, Tailwind CSS, and typed mock data.

The project is designed as a portfolio-grade frontend app: it favors real dashboard behavior over decorative scaffolding, including server-state caching, loading states, recoverable errors, empty states, pagination, filtering, responsive layout, persisted dark mode, automated tests, coverage reports, static API reference docs, and GitHub Pages publishing.

## Features

- Executive SaaS analytics overview
- KPI cards for MRR, active accounts, churn, and trial conversion
- Revenue composition chart with MRR, new business, expansion, and churn
- Customer table with search, status filter, plan filter, pagination, and empty state
- Mock API routes with artificial latency for local server demos
- Static data mode for GitHub Pages export
- TanStack Query caching and manual refresh
- Skeleton loading states for route and panel-level loading
- Route-level error boundary for unexpected failures
- Responsive dashboard shell for desktop and mobile widths
- Persisted light/dark theme preference
- Vitest and Testing Library coverage across utilities, data, API clients, route handlers, and UI states
- TypeDoc-generated reference documentation from JSDoc/TSDoc comments

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- TanStack Query
- Recharts
- Tailwind CSS 4
- Lucide React icons
- Vitest, V8 coverage, jsdom, and Testing Library
- TypeDoc for static reference documentation
- GitHub Actions and GitHub Pages

Test files are colocated with the code they verify. Runtime/build outputs are intentionally ignored:

```txt
coverage/
out/
```

The generated TypeDoc reference in `docs/reference/` is tracked so the repository can expose static documentation even outside the GitHub Pages artifact.

## Requirements

- Node.js 24.10.0 or newer
- npm 10 or newer

Next.js 16 requires Node.js 20.9.0 or newer; this project pins Node 24 for a consistent local and CI toolchain.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The root route renders the dashboard directly, and `/dashboard` remains available as a dedicated route.

## Scripts

```bash
npm run dev
npm run build
npm run build:pages
npm run start
npm run lint
npm run typecheck
npm run test
npm run test:watch
npm run test:coverage
npm run quality
npm run docs
npm run docs:check
```

`npm run quality` runs typecheck, lint, coverage, and documentation validation in one command.

## Testing and Coverage

The test suite uses Vitest with jsdom and Testing Library. Coverage uses the V8 provider and emits text, HTML, and lcov reports.

Run tests:

```bash
npm run test
```

Generate coverage:

```bash
npm run test:coverage
```

Coverage output:

```txt
coverage/
```

The project currently enforces minimum coverage thresholds in `vitest.config.ts`:

```txt
statements: 70%
branches: 60%
functions: 60%
lines: 70%
```

## JSDoc and Static Docs

This project uses TypeDoc for generated static reference docs. TypeDoc is a better fit than JSDoc templates such as Docdash because the codebase is TypeScript-first and the most useful documentation comes from exported contracts, typed mock APIs, reusable components, and utility functions.

Generate the static HTML reference:

```bash
npm run docs
```

Validate documentation generation without writing files:

```bash
npm run docs:check
```

The local output is written to:

```txt
docs/reference/
```

The npm scripts call TypeDoc's CLI entrypoint directly so generation also works in restricted Windows shells where the default TypeDoc wrapper may be blocked from spawning a child process.

## GitHub Pages and CI

The workflow in `.github/workflows/pages.yml` runs on pull requests, pushes to `main`, and manual dispatches.

The CI build performs:

```txt
npm ci
npm run typecheck
npm run lint
npm run test:coverage
npm run docs
npm run build:pages
```

On `main`, GitHub Pages publishes the static export from `out/`:

```txt
/           Static dashboard
/dashboard/ Static dashboard route
/reference/ TypeDoc reference
/coverage/  HTML coverage report
/quality.html Report index
```

GitHub Pages does not run a Node.js server. For that reason, the Pages build sets:

```txt
GITHUB_PAGES=true
NEXT_PUBLIC_DATA_MODE=static
```

In static data mode, the client reads the typed mock data directly instead of calling `/api/*`. The Route Handlers are marked `force-static` so Next.js can export them for Pages, while the interactive Pages dashboard keeps filtering and pagination client-side through the same typed mock dataset.

To test the Pages build locally on PowerShell:

```powershell
$env:GITHUB_PAGES='true'
$env:NEXT_PUBLIC_DATA_MODE='static'
npm run build:pages
```

## Mock API

### Metrics

```http
GET /api/metrics
```

Returns KPI data for revenue, active accounts, churn, and conversion.

### Revenue

```http
GET /api/revenue
```

Returns chart-ready monthly revenue data.

### Customers

```http
GET /api/customers?page=1&pageSize=8&status=active&plan=pro&query=acme
```

Returns paginated customer data with search, status filtering, and plan filtering.

In the GitHub Pages export this endpoint is emitted as static JSON; the published dashboard uses static data mode for interactive filtering.

## Engineering Notes

`AGENTS.md` is the canonical instruction file for AI coding agents working on this repository. `CLAUDE.md` intentionally stays as a small compatibility pointer to `AGENTS.md`.

Before changing Next.js routing, config, rendering behavior, API handlers, metadata, loading states, errors, or caching, check the relevant local Next.js 16 docs in:

```txt
node_modules/next/dist/docs/
```

The dashboard is built around the full data-state loop:

```txt
loading -> error -> empty -> data
```

Visible UI avoids implementation callouts and behaves like an internal SaaS console. Technical details stay in the code and README; the app itself is focused on the operator workflow.
