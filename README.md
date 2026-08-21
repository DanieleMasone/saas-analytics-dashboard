# SaaS Analytics Dashboard

[![CI](https://github.com/DanieleMasone/saas-analytics-dashboard/actions/workflows/pages.yml/badge.svg?branch=master)](https://github.com/DanieleMasone/saas-analytics-dashboard/actions/workflows/pages.yml)
[![Coverage Report](https://img.shields.io/badge/coverage-report-15803d)](https://danielemasone.github.io/saas-analytics-dashboard/coverage/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A portfolio-grade SaaS management dashboard for reviewing revenue, customer health, Jira-like delivery risk, and operating guardrails.

It demonstrates a product-like Next.js frontend with focused workspaces, typed data contracts, accessible responsive views, explicit UI states, and an automated GitHub Pages delivery pipeline.

## Explore

| Artifact | Link |
| --- | --- |
| Live dashboard | [danielemasone.github.io/saas-analytics-dashboard](https://danielemasone.github.io/saas-analytics-dashboard/) |
| User Guide | [Product documentation](https://danielemasone.github.io/saas-analytics-dashboard/guide/) |
| Developer reference | [TypeDoc API reference](https://danielemasone.github.io/saas-analytics-dashboard/reference/) |
| Quality evidence | [HTML coverage report](https://danielemasone.github.io/saas-analytics-dashboard/coverage/) |

## What This Demonstrates

- App Router routes, mock Route Handlers, static export, and GitHub Pages base-path handling.
- API and static data modes sharing typed domain contracts and TanStack Query state handling.
- Semantic navigation, keyboard-friendly controls, chart summaries, responsive data presentation, and persisted theme behavior.
- Unit, component, coverage, and Chromium E2E validation with generated TypeDoc and Pages reports.

## Tech Stack

Next.js App Router, React, TypeScript, TanStack Query, Tailwind CSS, Recharts, Lucide React, Vitest, Testing Library, Playwright, TypeDoc, GitHub Actions, and GitHub Pages.

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

Run the compact local gate with `npm run quality`; integrated browser coverage is available through `npm run test:e2e`.

## Documentation

- [Published User Guide](https://danielemasone.github.io/saas-analytics-dashboard/guide/)
- [Architecture notes](docs/architecture.md)
- [Quality and deployment](docs/quality-and-deployment.md)
- [TypeDoc developer reference](https://danielemasone.github.io/saas-analytics-dashboard/reference/)

## License

Released under the MIT License. See [LICENSE](LICENSE).

Copyright (c) 2026 Daniele Masone.
