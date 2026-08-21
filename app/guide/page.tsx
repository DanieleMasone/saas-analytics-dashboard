import type {Metadata} from "next";
import {
  Activity,
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  LayoutDashboard,
  ListChecks,
  Settings,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import {ThemeToggle} from "@/components/dashboard/theme-toggle/theme-toggle";

export const metadata: Metadata = {
  description: "Product guide for the SaaS Analytics Dashboard workspaces, controls, states, and accessibility features.",
  title: "User Guide | SaaS Analytics Dashboard",
};

type GuideSection = {
  icon: LucideIcon;
  id: string;
  introduction: string;
  points: string[];
  title: string;
};

const guideSections: GuideSection[] = [
  {
    icon: BookOpen,
    id: "overview",
    introduction:
        "SaaS Analytics Dashboard models a multi-workspace management console for reviewing commercial performance, customer risk, and delivery execution in one place.",
    points: [
      "The dashboard uses deterministic sample data so every workspace can be reviewed without credentials or external services.",
      "Overview supports a quick operating scan; Revenue, Customers, Delivery, and Health provide focused analysis.",
      "Settings demonstrates how management alerts and operating thresholds could be configured.",
    ],
    title: "Overview",
  },
  {
    icon: LayoutDashboard,
    id: "dashboard",
    introduction:
        "The executive overview combines the signals a manager is most likely to scan before opening a focused workspace.",
    points: [
      "KPI cards track monthly recurring revenue, active accounts, logo churn, and trial conversion with trend context.",
      "Revenue composition separates new business and expansion while the MRR series shows the overall direction.",
      "Management focus cards link directly to revenue, customer, delivery, and health follow-up views.",
      "Operating pulse summarizes customer and commercial movement, while Refresh re-runs the current data queries.",
    ],
    title: "Dashboard / Overview",
  },
  {
    icon: BarChart3,
    id: "revenue",
    introduction:
        "Revenue isolates recurring-revenue movement so acquisition, expansion, churn, and account growth can be compared without the density of the overview.",
    points: [
      "Summary cards show current MRR, new business, expansion, and month-over-month growth.",
      "The composition chart pairs bars for new business and expansion with the MRR trend; a text summary exposes the same key insight accessibly.",
      "Revenue history provides exact monthly values for MRR, acquisition, expansion, churn, and customer count.",
      "Watch items call out expansion momentum, churn pressure, and the latest account-base size.",
    ],
    title: "Revenue",
  },
  {
    icon: UsersRound,
    id: "customers",
    introduction:
        "Customers supports account triage through search, segmentation, health context, and paginated results.",
    points: [
      "Search matches customer records, while lifecycle-status and plan filters narrow the current segment.",
      "Clear filters restores the full segment and pagination moves through eight accounts at a time.",
      "Health score, product usage, MRR, plan, status, and ownership make each account actionable.",
      "Loading preserves the page structure; empty, error, and retry states explain what happened and how to recover.",
    ],
    title: "Customers",
  },
  {
    icon: ListChecks,
    id: "delivery",
    introduction:
        "Delivery presents Jira-like sample signals for release readiness and flow analysis; it is not connected to a live Jira workspace.",
    points: [
      "Sprint predictability compares completed and planned points, while cycle and lead time expose flow speed.",
      "Blocked work, escaped bugs, scope change, and team confidence frame release risk.",
      "The weekly trend compares committed, completed, created, and resolved work with blocker counts.",
      "The risk queue prioritizes issue status, owner, age, customer impact, and the management signal requiring attention.",
    ],
    title: "Delivery",
  },
  {
    icon: Activity,
    id: "health",
    introduction:
        "Health turns account activity, billing status, and health scores into a customer-success follow-up view.",
    points: [
      "Summary metrics show average health, low usage, past-due accounts, and customers above the healthy threshold.",
      "The distribution groups accounts into Healthy, Watch, and Risk bands with accessible meter values.",
      "The risk queue orders the lowest-health accounts first and includes usage, MRR, owner, region, and last activity.",
      "The workspace supports prioritization; it does not modify customer records or send outreach.",
    ],
    title: "Health",
  },
  {
    icon: Settings,
    id: "settings",
    introduction:
        "Settings demonstrates manager-facing alert preferences and guardrails with an immediate preview of the enabled rules.",
    points: [
      "Alert subscriptions cover delivery risk, customer health, and revenue variance review.",
      "Guardrails set the blocker limit, churn budget, and health-risk threshold used by the preview.",
      "Reset defaults restores the initial values, and the data-source panel identifies live-shaped demo and Jira sample inputs.",
      "Settings are session-local demo state. Reloading the page restores defaults; no account or backend persistence is implied.",
    ],
    title: "Settings",
  },
  {
    icon: CheckCircle2,
    id: "experience",
    introduction:
        "The interface is designed to remain understandable across input methods, color schemes, data states, and viewport sizes.",
    points: [
      "Semantic landmarks, heading hierarchy, labelled controls, visible focus, and keyboard-reachable navigation support non-pointer use.",
      "Charts include text summaries, tables use captions and headers, and status changes expose meaningful loading, error, empty, and retry content.",
      "Desktop layouts favor scan density; mobile navigation remains reachable and dense tables become scrollable regions or compact cards.",
      "The light or dark theme follows the saved choice, then the system preference, and the theme action always describes the available change.",
    ],
    title: "Accessibility and responsive behavior",
  },
];

const repositoryUrl = "https://github.com/DanieleMasone/saas-analytics-dashboard";

function normalizeBasePath(value?: string) {
  if (!value || value === "/") return "";

  const trimmed = value.replace(/^\/+|\/+$/g, "");
  return trimmed ? `/${trimmed}` : "";
}

function artifactHref(path: string) {
  return `${normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH)}${path}`;
}

const technicalResources = [
  {
    description: "Generated TypeDoc for public TypeScript APIs and components.",
    href: artifactHref("/reference/"),
    label: "Developer reference",
  },
  {
    description: "Generated HTML evidence for the Vitest coverage run.",
    href: artifactHref("/coverage/"),
    label: "Coverage report",
  },
  {
    description: "Repository-maintained notes on routes, components, and data flow.",
    href: `${repositoryUrl}/blob/master/docs/architecture.md`,
    label: "Architecture notes",
  },
  {
    description: "Quality gates, static export, CI, and Pages deployment details.",
    href: `${repositoryUrl}/blob/master/docs/quality-and-deployment.md`,
    label: "Quality and deployment",
  },
];

/** Published product documentation included in the Next.js static export. */
export default function GuidePage() {
  return (
      <div className="min-h-screen bg-slate-100 text-slate-950 dark:bg-slate-950 dark:text-slate-50">
        <a
            className="sr-only z-50 rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-950 shadow-lg focus:not-sr-only focus:fixed focus:left-4 focus:top-4 dark:bg-slate-900 dark:text-white"
            href="#guide-content"
        >
          Skip to guide content
        </a>

        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
          <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <Link className="flex min-w-0 items-center gap-3" href="/">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-cyan-700 text-white dark:bg-cyan-400 dark:text-slate-950">
                <BookOpen aria-hidden="true" size={18}/>
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-slate-950 dark:text-white">SaaS Pulse</span>
                <span className="block truncate text-xs text-slate-500 dark:text-slate-400">User guide</span>
              </span>
            </Link>

            <nav aria-label="Guide actions" className="flex items-center gap-2">
              <Link
                  aria-label="Open dashboard"
                  className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                  href="/"
              >
                <ArrowLeft aria-hidden="true" size={16}/>
                <span className="hidden sm:inline">Open dashboard</span>
                <span className="sm:hidden">Dashboard</span>
              </Link>
              <a
                  aria-label="Open GitHub repository"
                  className="hidden h-10 items-center gap-2 rounded-md px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 sm:inline-flex dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                  href={repositoryUrl}
              >
                Repository
                <ArrowUpRight aria-hidden="true" size={15}/>
              </a>
              <ThemeToggle/>
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-7xl" id="guide-content" tabIndex={-1}>
          <section aria-labelledby="guide-title" className="border-b border-slate-200 px-4 py-10 sm:px-6 sm:py-14 lg:px-8 dark:border-slate-800">
            <p className="flex items-center gap-2 text-sm font-semibold text-cyan-700 dark:text-cyan-300">
              <BookOpen aria-hidden="true" size={16}/>
              Product documentation
            </p>
            <h1 className="mt-3 text-4xl font-semibold text-slate-950 dark:text-white" id="guide-title">
              SaaS Analytics Dashboard User Guide
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">
              Use this guide to understand what each management workspace shows, how to read its signals, and which interactions and states are available.
            </p>
            <p className="mt-5 max-w-3xl border-l-4 border-cyan-600 pl-4 text-sm leading-6 text-slate-600 dark:border-cyan-400 dark:text-slate-300" role="note">
              This portfolio application uses typed sample data. It demonstrates product behavior and engineering decisions; it does not connect to a production SaaS account or Jira tenant.
            </p>
          </section>

          <div className="grid min-w-0 lg:grid-cols-[15rem_minmax(0,1fr)]">
            <aside className="border-b border-slate-200 px-4 py-6 sm:px-6 lg:border-b-0 lg:border-r lg:px-6 dark:border-slate-800">
              <nav aria-label="User guide sections" className="lg:sticky lg:top-22">
                <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">On this page</p>
                <ul className="mt-3 grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-1">
                  {guideSections.map((section) => (
                      <li key={section.id}>
                        <a
                            className="flex min-h-10 items-center rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-white hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
                            href={`#${section.id}`}
                        >
                          {section.title}
                        </a>
                      </li>
                  ))}
                  <li>
                    <a
                        className="flex min-h-10 items-center rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-white hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
                        href="#resources"
                    >
                      Technical resources
                    </a>
                  </li>
                </ul>
              </nav>
            </aside>

            <article className="min-w-0 px-4 sm:px-6 lg:px-10">
              {guideSections.map((section) => (
                  <section
                      aria-labelledby={`${section.id}-title`}
                      className="scroll-mt-22 border-b border-slate-200 py-9 sm:py-11 dark:border-slate-800"
                      id={section.id}
                      key={section.id}
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white text-cyan-700 dark:border-slate-800 dark:bg-slate-900 dark:text-cyan-300">
                        <section.icon aria-hidden="true" size={18}/>
                      </span>
                      <div className="min-w-0">
                        <h2 className="text-2xl font-semibold text-slate-950 dark:text-white" id={`${section.id}-title`}>
                          {section.title}
                        </h2>
                        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                          {section.introduction}
                        </p>
                      </div>
                    </div>

                    <h3 className="mt-6 text-sm font-semibold text-slate-950 dark:text-white">What to look for</h3>
                    <ul className="mt-3 max-w-3xl space-y-3">
                      {section.points.map((point) => (
                          <li className="flex items-start gap-3 text-sm leading-6 text-slate-600 dark:text-slate-300" key={point}>
                            <CheckCircle2 aria-hidden="true" className="mt-1 shrink-0 text-emerald-600 dark:text-emerald-400" size={15}/>
                            <span>{point}</span>
                          </li>
                      ))}
                    </ul>
                  </section>
              ))}

              <section aria-labelledby="resources-title" className="scroll-mt-22 py-9 sm:py-11" id="resources">
                <h2 className="text-2xl font-semibold text-slate-950 dark:text-white" id="resources-title">
                  Technical resources
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                  Product guidance stays here. Generated API details, coverage evidence, architecture, and deployment notes have their own focused surfaces.
                </p>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {technicalResources.map((resource) => (
                      <li key={resource.label}>
                        <a
                            className="group flex h-full min-h-28 items-start justify-between gap-3 rounded-md border border-slate-200 bg-white p-4 transition-colors hover:border-cyan-500 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-cyan-500"
                            href={resource.href}
                        >
                          <span>
                            <span className="block text-sm font-semibold text-slate-950 dark:text-white">{resource.label}</span>
                            <span className="mt-2 block text-sm leading-6 text-slate-600 dark:text-slate-300">
                              {resource.description}
                            </span>
                          </span>
                          <ArrowUpRight aria-hidden="true" className="shrink-0 text-slate-400 transition-colors group-hover:text-cyan-700 dark:group-hover:text-cyan-300" size={17}/>
                        </a>
                      </li>
                  ))}
                </ul>
              </section>
            </article>
          </div>
        </main>

        <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8 dark:text-slate-400">
            <p>SaaS Analytics Dashboard product documentation.</p>
            <Link className="font-medium text-cyan-700 hover:text-cyan-800 dark:text-cyan-300 dark:hover:text-cyan-200" href="/">
              Return to dashboard
            </Link>
          </div>
        </footer>
      </div>
  );
}
