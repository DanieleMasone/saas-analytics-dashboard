# User Guide

SaaS Analytics Dashboard is a portfolio dashboard for managers who need a compact view of commercial performance, customer health, delivery risk, and operating guardrails. It is designed as a product surface rather than a demo page, so every workspace presents a concrete management question and a usable data view.

## Workspaces

| Workspace | What it demonstrates |
| --- | --- |
| Overview / Dashboard | Executive KPIs, revenue composition, and operating pulse for a quick daily readout. |
| Revenue | Monthly recurring revenue trends, expansion/churn movement, and commercial summary signals. |
| Customers | Search, filters, pagination, health indicators, usage context, and account follow-up states. |
| Delivery | Jira-like sprint predictability, cycle time, blockers, scope change, and delivery risk triage. |
| Health | Customer health distribution, low-usage accounts, and prioritization for customer success action. |
| Settings | Alert subscriptions, operating thresholds, data-source notes, and report-pack context. |

## UI States

The dashboard keeps the full data loop visible:

- Loading states use skeleton surfaces that preserve page structure while data is pending.
- Error states provide visible context and retry actions where the user can recover.
- Empty states explain that no matching data is available without implying a broken page.
- Populated states emphasize comparison, trend direction, and manager-level prioritization.

## Responsive Behavior

The desktop layout favors scan density with side navigation, multi-column cards, and wider chart/table regions. Mobile layouts collapse navigation behind touch-friendly controls, stack KPI and insight panels, and turn dense data regions into scrollable or card-like patterns where needed. The delivery workspace keeps Jira-like metrics readable on narrow screens without requiring horizontal page scrolling.

## Accessibility-Oriented UX

Pages use semantic landmarks, discoverable headings, named regions, labelled controls, keyboard-reachable navigation, visible focus states, and accessible labels for icon-only actions. Charts are paired with text summaries so the main insight is available without relying only on color or geometry.
