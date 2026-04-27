# SaaS Analytics Dashboard

A realistic SaaS analytics dashboard built with Next.js App Router, React, TypeScript, TanStack Query, Recharts, and mock API routes.

The goal of this project is to demonstrate frontend engineering skills that matter in real production dashboards: complex UI state, server-driven data, loading states, error handling, pagination, filtering, caching, responsive layout, and polished dark mode.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- TanStack Query
- Recharts
- Tailwind CSS
- Mock API routes via Next.js Route Handlers

## Features

- SaaS-style analytics dashboard
- KPI metric cards
- Revenue chart
- Customer table
- Filtering by status, plan, and search query
- Pagination
- API mock with artificial network latency
- TanStack Query caching
- Skeleton loading states
- Error boundary
- Responsive layout
- Dark mode with persisted preference

## Project Structure

```txt
src/
  app/
    api/
      metrics/
      customers/
      revenue/
    dashboard/
      page.tsx
      loading.tsx
      error.tsx
    layout.tsx
    page.tsx
    globals.css

  components/
    dashboard/
    ui/

  lib/
    api.ts
    mock-data.ts
    query-client.ts
    utils.ts

  providers/
    ReactQueryProvider.tsx

  types/
    dashboard.ts
```

Getting Started
Requirements
Node.js 24.15.0 or newer
npm
Install dependencies
npm install
Run development server
npm run dev

Open:

http://localhost:3000
Available Scripts
npm run dev
npm run build
npm run start
npm run lint
Mock API Endpoints
Metrics
GET /api/metrics

Returns SaaS KPI data such as revenue, active users, churn rate, and conversion rate.

Revenue
GET /api/revenue

Returns chart-ready revenue data.

Customers
GET /api/customers?page=1&status=active&plan=pro&query=acme

Returns paginated customer data with filtering support.

Engineering Highlights

This project intentionally includes patterns commonly used in production dashboards:

Query caching with TanStack Query
Explicit loading and error states
Mock backend behavior through API routes
Client-side state for filters and pagination
Reusable UI components
Typed data contracts
Responsive dashboard layout
Accessible contrast-aware dark mode
Roadmap
Add date range filtering
Add CSV export
Add optimistic table actions
Add authentication mock
Add dashboard settings page
Add Playwright smoke tests
Purpose

This repository is designed as a portfolio project for demonstrating modern frontend architecture, UX discipline, and production-oriented React/Next.js patterns.


---

## Nota importante

Per GitHub personale, non fare una dashboard “bella ma vuota”. Deve sembrare un prodotto reale. Quindi cura soprattutto:

```txt
loading → error → empty state → data state
```
