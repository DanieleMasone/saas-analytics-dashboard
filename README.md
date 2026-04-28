# SaaS Analytics Dashboard

A production-style SaaS analytics dashboard built with Next.js 16 App Router, React, TypeScript, TanStack Query, Recharts, Tailwind CSS, and mock Route Handlers.

The project is designed as a portfolio-grade frontend app: it prioritizes real dashboard behaviors over decorative UI, including server-driven data, loading states, recoverable errors, empty states, pagination, filtering, caching, responsive layout, and persisted dark mode.

## Features

- Executive SaaS analytics overview
- KPI cards for MRR, active accounts, churn, and trial conversion
- Revenue composition chart with MRR, new business, and expansion
- Customer table with search, status filter, plan filter, pagination, and empty state
- Mock API routes with artificial latency
- TanStack Query caching and manual refresh
- Skeleton loading states for route and panel-level loading
- Route-level error boundary for unexpected failures
- Responsive dashboard shell for desktop and mobile widths
- Persisted light/dark theme preference

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- TanStack Query
- Recharts
- Tailwind CSS 4
- Lucide React icons
- Mock APIs via Next.js Route Handlers

## Project Structure

```txt
app/
  api/
    customers/route.ts
    metrics/route.ts
    revenue/route.ts
  dashboard/
    error.tsx
    loading.tsx
    page.tsx
  globals.css
  layout.tsx
  page.tsx

components/
  dashboard/
  ui/

lib/
  api.ts
  mock-data.ts
  utils.ts

providers/
  react-query-provider.tsx

types/
  dashboard.ts
```

## Getting Started

### Requirements

- Node.js 24.10.0 or newer
- npm 10 or newer

Next.js 16 requires Node.js 20.9.0 or newer; this project pins Node 24 for a consistent local toolchain.

### Install

```bash
npm install
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The root route redirects to `/dashboard`.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
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

## Engineering Notes

The dashboard is built around the full data-state loop:

```txt
loading -> error -> empty -> data
```

Visible UI avoids implementation callouts and behaves like an internal SaaS console. Technical details stay in the code and README; the app itself is focused on the operator workflow.

## Roadmap

- Add date range filtering
- Add CSV export
- Add row-level customer actions
- Add authentication mock
- Add Playwright smoke tests
