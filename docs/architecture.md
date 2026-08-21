# Architecture

The project uses the Next.js App Router with a stable root-level structure:

```txt
app/                         Routes, layouts, loading/error states, and mock API Route Handlers
app/guide/page.tsx           Published HTML User Guide included in the static export
components/dashboard/        Product workspaces and composed dashboard panels
components/ui/               Small reusable UI primitives
lib/api/                     Client data access for API and static modes
lib/customer-query/          Shared customer filtering, pagination, and summary logic
lib/mock-data/               Typed mock SaaS, customer, revenue, and Jira-like data
lib/utils/                   Formatting and class-name helpers
providers/                   TanStack Query provider setup
types/                       Shared domain contracts
```

## Routing And Components

Public routes live under `app/` and map to focused workspaces: overview, dashboard, revenue, customers, delivery, health, and settings. Route files stay thin and delegate product UI to `components/dashboard/`, where each workspace owns its page-level composition and tests.

`app/guide/page.tsx` is the exception by design: it is a static Server Component and the single source of truth for published product documentation. Keeping the guide in the existing App Router makes it part of the normal Next.js build, theme, base-path handling, and GitHub Pages export without a second documentation application.

Shared primitives under `components/ui/` cover reusable buttons, badges, meters, skeletons, and style helpers. They stay intentionally small so the portfolio remains easy to inspect.

## Data Flow

Mock API Route Handlers live under `app/api/**/route.ts` and return typed dashboard data for local product demos. The same domain data is available through `lib/mock-data/`, with shared contracts in `types/dashboard.ts`.

`NEXT_PUBLIC_DATA_MODE=static` switches client data access to local typed data instead of route fetching. This keeps GitHub Pages static export working while preserving the same UI states and data contracts used by the API mode.

The customer Route Handler emits the complete typed fixture dataset so it remains compatible with static export. Shared client-side query logic applies search, status, plan, pagination, and summary calculations in API mode; the Pages client applies the same logic directly to local fixtures without fetching an endpoint.

## GitHub Pages Base Path

`NEXT_PUBLIC_BASE_PATH=saas-analytics-dashboard` is used for GitHub Pages so routes, assets, and metadata resolve under the repository path. `GITHUB_PAGES=true` enables the static export settings in `next.config.ts`.

The static build emits the guide at `out/guide/index.html`. TypeDoc and coverage are generated separately and copied into `out/reference/` and `out/coverage/` because they are external report surfaces rather than App Router routes.

## TanStack Query

TanStack Query is used even with mock/static data because the dashboard models real server-state behavior: loading, refresh, retry, error, and stale data boundaries. This keeps the architecture close to a production SaaS frontend while remaining fully static-deployable.

## Documentation Ownership

- `README.md` introduces the repository and links to live artifacts.
- `/guide/` owns product usage, workspace interpretation, UI states, accessibility, and responsive behavior.
- TypeDoc owns generated developer/API reference.
- The coverage report owns detailed test-coverage evidence.
- This file and `docs/quality-and-deployment.md` retain developer-facing maintenance context that does not belong in the product guide.
