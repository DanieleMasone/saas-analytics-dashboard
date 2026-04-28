# Agent Instructions

## Project Context

This is a Next.js 16 App Router dashboard. Do not rely on older Next.js assumptions without checking the local documentation first.

Before changing Next.js routing, config, rendering, API handlers, metadata, errors, loading states, or caching behavior, read the relevant guide in:

```txt
node_modules/next/dist/docs/
```

Pay attention to deprecations and Next.js 16-specific conventions.

## Local Requirements

- Use Node.js 24.10.0 or newer.
- Prefer the existing npm scripts:
  - `npm run typecheck`
  - `npm run lint`
  - `npm run build`
  - `npm run dev`

## Implementation Notes

- Keep the dashboard product-like: no visible scaffold copy, tutorial text, or implementation callouts in the UI.
- Preserve the full UI data loop: loading, error, empty, and populated states.
- Use the existing App Router structure at the repository root (`app/`, `components/`, `lib/`, `providers/`, `types/`).
- Keep mock data typed and colocated in `lib/mock-data.ts`.
- Use Route Handlers under `app/api/**/route.ts` for mock API endpoints.
- Use TanStack Query for client-side server state and Recharts for dashboard charts.
- Keep changes focused; avoid unrelated refactors or generated file churn.
