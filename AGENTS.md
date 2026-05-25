# Agent Instructions

## Project Context

This is a Next.js App Router dashboard. Use `package.json` and `package-lock.json` as the source of truth for framework, runtime, and tooling versions. Do not rely on older Next.js assumptions without checking the local documentation first.

Before changing Next.js routing, config, rendering, API handlers, metadata, errors, loading states, or caching behavior, read the relevant guide in:

```txt
node_modules/next/dist/docs/
```

Pay attention to deprecations and conventions for the installed Next.js version.

## Local Requirements

- Use the Node.js and npm versions declared in `package.json` `engines`.
- Prefer the existing npm scripts:
  - `npm run typecheck`
  - `npm run lint`
  - `npm run test`
  - `npm run test:coverage`
  - `npm run test:e2e`
  - `npm run build`
  - `npm run build:pages`
  - `npm run docs`
  - `npm run docs:check`
  - `npm run quality`
  - `npm run dev`

## Implementation Notes

- Keep the dashboard product-like: no visible scaffold copy, tutorial text, or implementation callouts in the UI.
- Preserve the full UI data loop: loading, error, empty, and populated states.
- Use the existing App Router structure at the repository root (`app/`, `components/`, `lib/`, `providers/`, `types/`).
- Keep mock data typed and colocated under `lib/mock-data/`.
- Use Route Handlers under `app/api/**/route.ts` for mock API endpoints.
- Keep the GitHub Pages static data mode working with `NEXT_PUBLIC_DATA_MODE=static`.
- Use TanStack Query for client-side server state and Recharts for dashboard charts.
- Use Vitest and Testing Library for unit/component coverage.
- Use Playwright for focused end-to-end coverage of route smoke, navigation, responsive behavior, and critical accessibility regressions.
- Use TypeDoc for generated JSDoc/TSDoc reference docs.
- Keep changes focused; avoid unrelated refactors or generated file churn.

## Testing Policy

- Vitest remains responsible for unit and component coverage.
- Playwright should stay pragmatic: cover public route smoke, real navigation, mobile usability, document-level overflow, key accessible names, keyboard reachability, and critical regressions such as theme persistence.
- Do not duplicate Vitest implementation-detail assertions in Playwright.
- Do not add broad visual regression tooling unless there is a clear product need.
- Keep Playwright browser coverage limited to Desktop Chromium and a Pixel-like Mobile Chromium profile unless a specific browser issue needs coverage.

## Dependency And Version Policy

- Do not run broad upgrades, `npm update`, or forceful audit fixes without a concrete reason and review.
- Use `npm outdated` to inspect available updates before changing dependency versions.
- Prefer patch and minor updates when compatibility is clear.
- Do not blindly upgrade major versions. Read release notes or migration notes first, then verify the affected framework, library, and tooling behavior.
- Use `npm install <package>@<version>` or `npm install <package>@latest` only after compatibility is checked.
- Update `package-lock.json` intentionally with dependency changes.
- If Next.js changes, re-check the relevant guides under `node_modules/next/dist/docs/`, especially App Router, Route Handlers, static export, and config behavior.
- After dependency changes, run all available quality gates: `npm run typecheck`, `npm run lint`, `npm run test`, `npm run test:coverage`, `npm run test:e2e`, `npm run docs:check`, `npm run build`, and `npm run build:pages`.
- Update README badges, requirements, and version claims when dependency or engine versions change.

## Stability Policy

- Treat the current project structure as stable.
- Preserve the App Router route structure unless there is dead code or a concrete product/architecture defect.
- Avoid moving files unless the move reduces verified dead code or fixes a real maintainability issue.
- Remove unused files, exports, components, mock data, and API paths only after checking imports and usages.
- Keep route coverage aligned with the README product scope.
- Keep TypeDoc, coverage, tests, GitHub Pages, static export, and `NEXT_PUBLIC_DATA_MODE=static` working.
