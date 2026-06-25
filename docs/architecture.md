# Architecture

The project uses the Next.js App Router with a stable root-level structure:

```txt
app/                         Routes, layouts, loading/error states, and mock API Route Handlers
components/dashboard/        Product workspaces and composed dashboard panels
components/ui/               Small reusable UI primitives
lib/api/                     Client data access for API and static modes
lib/mock-data/               Typed mock SaaS, customer, revenue, and Jira-like data
lib/utils/                   Formatting and class-name helpers
providers/                   TanStack Query provider setup
types/                       Shared domain contracts
```

## Routing And Components

Public routes live under `app/` and map to focused workspaces: overview, dashboard, revenue, customers, delivery, health, and settings. Route files stay thin and delegate product UI to `components/dashboard/`, where each workspace owns its page-level composition and tests.

Shared primitives under `components/ui/` cover reusable buttons, badges, meters, skeletons, and style helpers. They stay intentionally small so the portfolio remains easy to inspect.

## Data Flow

Mock API Route Handlers live under `app/api/**/route.ts` and return typed dashboard data for local product demos. The same domain data is available through `lib/mock-data/`, with shared contracts in `types/dashboard.ts`.

`NEXT_PUBLIC_DATA_MODE=static` switches client data access to local typed data instead of route fetching. This keeps GitHub Pages static export working while preserving the same UI states and data contracts used by the API mode.

## GitHub Pages Base Path

`NEXT_PUBLIC_BASE_PATH=saas-analytics-dashboard` is used for GitHub Pages so routes, assets, and metadata resolve under the repository path. `GITHUB_PAGES=true` enables the static export settings in `next.config.ts`.

## TanStack Query

TanStack Query is used even with mock/static data because the dashboard models real server-state behavior: loading, refresh, retry, error, and stale data boundaries. This keeps the architecture close to a production SaaS frontend while remaining fully static-deployable.
