# SaaS Analytics Dashboard

[![CI](https://github.com/DanieleMasone/saas-analytics-dashboard/actions/workflows/pages.yml/badge.svg?branch=master)](https://github.com/DanieleMasone/saas-analytics-dashboard/actions/workflows/pages.yml)
[![Coverage Report](https://img.shields.io/badge/coverage-report-15803d)](https://danielemasone.github.io/saas-analytics-dashboard/coverage/)
[![Next.js App Router](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)](https://nextjs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A portfolio-grade SaaS management dashboard built with Next.js App Router, React, TypeScript, TanStack Query, Recharts, Tailwind CSS, typed mock data, automated tests, generated reference docs, and GitHub Pages deployment.

The project demonstrates how I structure a product-like frontend: focused manager workspaces, accessible data views, route-level states, responsive navigation, typed data contracts, and a CI pipeline that publishes the static dashboard with coverage and API reference reports.

## Live Artifacts

| Artifact | Link |
| --- | --- |
| Live dashboard | [danielemasone.github.io/saas-analytics-dashboard](https://danielemasone.github.io/saas-analytics-dashboard/) |
| TypeDoc reference | [Reference report](https://danielemasone.github.io/saas-analytics-dashboard/reference/) |
| Coverage report | [HTML coverage](https://danielemasone.github.io/saas-analytics-dashboard/coverage/) |
| CI workflow | [GitHub Actions](https://github.com/DanieleMasone/saas-analytics-dashboard/actions/workflows/pages.yml) |

## What This Demonstrates

- Product thinking for SaaS management views across revenue, customers, delivery, health, and operating settings.
- Next.js App Router routing, mock Route Handlers, static export, and GitHub Pages base-path handling.
- Typed domain data that can run through local API routes or static GitHub Pages data mode.
- TanStack Query loading, retry, refresh, empty, error, and populated flows.
- Accessible, responsive dashboard UI with semantic regions, keyboard-friendly controls, chart summaries, and mobile navigation.
- Automated confidence through TypeScript, ESLint, Vitest, Testing Library, Playwright, V8 coverage, TypeDoc, and GitHub Actions.

## Product Scope

| Route | Workspace |
| --- | --- |
| `/` and `/dashboard` | Executive overview with KPI cards, revenue composition, and operating pulse. |
| `/revenue` | Revenue trend, expansion/churn movement, and commercial summary. |
| `/customers` | Searchable customer table with filters, pagination, health, usage, and retry states. |
| `/delivery` | Jira-like sprint predictability, cycle time, blockers, scope change, and risk queue. |
| `/health` | Customer health distribution, low-usage accounts, and follow-up prioritization. |
| `/settings` | Alert subscriptions, operating guardrails, alert preview, and report-pack context. |

## Tech Stack

| Area | Tools |
| --- | --- |
| App | Next.js App Router, React, TypeScript |
| Data | TanStack Query, typed mock data, static data mode |
| UI | Tailwind CSS, Recharts, Lucide React |
| Quality | ESLint, TypeScript, Vitest, Testing Library, Playwright, V8 coverage |
| Docs and deploy | TypeDoc, GitHub Actions, GitHub Pages |

Exact dependency and runtime versions are declared in `package.json` and `package-lock.json`.

## Quick Start

Requirements:

- Node.js version declared in `package.json` `engines`
- npm version declared in `package.json` `engines`

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Documentation

- [User guide](docs/user-guide.md)
- [Architecture](docs/architecture.md)
- [Quality and deployment](docs/quality-and-deployment.md)
- [Live TypeDoc reference](https://danielemasone.github.io/saas-analytics-dashboard/reference/)
- [Live coverage report](https://danielemasone.github.io/saas-analytics-dashboard/coverage/)

## License

Released under the MIT License. See [LICENSE](LICENSE).

Copyright (c) 2026 Daniele Masone.
