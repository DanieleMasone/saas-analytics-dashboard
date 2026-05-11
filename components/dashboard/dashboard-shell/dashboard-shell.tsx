"use client";

import {
  Activity,
  BarChart3,
  Bell,
  LayoutDashboard,
  LifeBuoy,
  ListChecks,
  Menu,
  PanelLeft,
  RefreshCcw,
  Settings,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import {useId, useState, type ReactNode} from "react";
import {ThemeToggle} from "@/components/dashboard/theme-toggle/theme-toggle";
import {Button} from "@/components/ui/button/button";
import {uiStyles} from "@/components/ui/style-primitives";
import {cn} from "@/lib/utils/utils";

export type DashboardSection = "overview" | "revenue" | "customers" | "delivery" | "health" | "settings";

type NavItem = {
  href: string;
  icon: LucideIcon;
  label: string;
  section: DashboardSection;
};

/** Props for the shared dashboard workspace shell. */
export type DashboardShellProps = {
  activeSection: DashboardSection;
  children: ReactNode;
  description: string;
  eyebrow: string;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  title: string;
};

const navItems: NavItem[] = [
  {href: "/", icon: LayoutDashboard, label: "Overview", section: "overview"},
  {href: "/revenue", icon: BarChart3, label: "Revenue", section: "revenue"},
  {href: "/customers", icon: UsersRound, label: "Customers", section: "customers"},
  {href: "/delivery", icon: ListChecks, label: "Delivery", section: "delivery"},
  {href: "/health", icon: Activity, label: "Health", section: "health"},
  {href: "/settings", icon: Settings, label: "Settings", section: "settings"},
];

const notifications = [
  {
    description: "Delivery has 3 blockers before the May customer health release.",
    label: "Delivery risk",
    tone: "text-amber-700 dark:text-amber-200",
  },
  {
    description: "Past-due accounts need billing follow-up before renewal review.",
    label: "Customer health",
    tone: "text-rose-700 dark:text-rose-300",
  },
  {
    description: "Expansion continues to outpace churn in the latest revenue period.",
    label: "Revenue motion",
    tone: "text-emerald-700 dark:text-emerald-300",
  },
];

function NavigationLinks({
                           activeSection,
                           onNavigate,
                           layout = "sidebar",
                         }: {
  activeSection: DashboardSection;
  onNavigate?: () => void;
  layout?: "mobile" | "sidebar";
}) {
  return (
      <>
        {navItems.map((item) => {
          const isActive = item.section === activeSection;

          return (
              <Link
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                      "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors",
                      layout === "sidebar" ? "w-full" : "min-w-0",
                      isActive
                          ? "bg-cyan-50 text-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-200"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
                  )}
                  href={item.href}
                  key={item.section}
                  onClick={onNavigate}
              >
                <item.icon aria-hidden="true" size={17}/>
                <span className="truncate">{item.label}</span>
              </Link>
          );
        })}
      </>
  );
}

/** Shared product shell with real route navigation for all dashboard pages. */
export function DashboardShell({
                                 activeSection,
                                 children,
                                 description,
                                 eyebrow,
                                 isRefreshing = false,
                                 onRefresh,
                                 title,
                               }: DashboardShellProps) {
  const mobileNavId = useId();
  const notificationsId = useId();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
      <div className="min-h-screen bg-slate-100 text-slate-950 dark:bg-slate-950 dark:text-slate-50">
        <div className="mx-auto flex max-w-370 gap-6 px-4 py-4 sm:px-6 lg:px-8">
          <aside
              aria-label="Dashboard workspace"
              className={cn("sticky top-4 hidden h-[calc(100vh-2rem)] w-64 shrink-0 p-4 lg:flex lg:flex-col", uiStyles.surface)}
          >
            <div className="flex items-center gap-3 px-2">
              <div
                  className="flex h-10 w-10 items-center justify-center rounded-md bg-cyan-700 text-white dark:bg-cyan-400 dark:text-slate-950">
                <PanelLeft aria-hidden="true" size={20}/>
              </div>
              <div>
                <p className="font-semibold text-slate-950 dark:text-white">SaaS Pulse</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Analytics console</p>
              </div>
            </div>

            <nav aria-label="Dashboard navigation" className="mt-8 space-y-1">
              <NavigationLinks activeSection={activeSection}/>
            </nav>

            <div
                className="mt-auto rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-950 dark:text-white">
                <LifeBuoy aria-hidden="true" size={16}/>
                Ops note
              </div>
              <p className="mt-2 text-sm leading-5 text-slate-600 dark:text-slate-300">
                Enterprise renewals and onboarding reviews are due this week.
              </p>
            </div>
          </aside>

          <main aria-labelledby="dashboard-title" className="min-w-0 flex-1 space-y-5">
            <header className={cn("p-4 sm:p-5", uiStyles.surface)}>
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="min-w-0">
                  <div
                      className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <span>Dashboard</span>
                    <span aria-hidden="true">/</span>
                    <span className="font-medium text-slate-700 dark:text-slate-200">
                    {eyebrow}
                  </span>
                  </div>
                  <h1 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white"
                      id="dashboard-title">
                    {title}
                  </h1>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {description}
                  </p>
                </div>

                <div className="relative flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
                  <Button
                      aria-controls={mobileNavId}
                      aria-expanded={isMobileNavOpen}
                      className="min-w-24 lg:hidden"
                      onClick={() => setIsMobileNavOpen((current) => !current)}
                      title="Menu"
                      variant="secondary"
                  >
                    <Menu aria-hidden="true" size={17}/>
                    Menu
                  </Button>
                  <Button
                      aria-controls={notificationsId}
                      aria-expanded={isNotificationsOpen}
                      aria-label="Notifications"
                      onClick={() => setIsNotificationsOpen((current) => !current)}
                      size="icon"
                      title="Notifications"
                      variant="secondary"
                  >
                    <Bell aria-hidden="true" size={17}/>
                  </Button>
                  <ThemeToggle/>
                  {onRefresh ? (
                      <Button
                          aria-busy={isRefreshing}
                          disabled={isRefreshing}
                          onClick={onRefresh}
                          variant="primary"
                      >
                        <RefreshCcw
                            aria-hidden="true"
                            className={cn(isRefreshing && "animate-spin")}
                            size={16}
                        />
                        Refresh
                      </Button>
                  ) : null}

                  {isNotificationsOpen ? (
                      <section
                          aria-label="Notifications panel"
                          className={cn(
                              "absolute right-0 top-12 z-20 w-76 max-w-[calc(100vw-2rem)] p-3",
                              uiStyles.surface,
                          )}
                          id={notificationsId}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <h2 className="text-sm font-semibold text-slate-950 dark:text-white">Notifications</h2>
                          <span
                              className="rounded-md bg-cyan-50 px-2 py-1 text-xs font-medium text-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-200">
                        {notifications.length} active
                      </span>
                        </div>
                        <ul className="mt-3 space-y-2">
                          {notifications.map((notification) => (
                              <li className={cn("p-3", uiStyles.insetSurface)}
                                  key={notification.label}>
                                <p className={cn("text-sm font-semibold", notification.tone)}>
                                  {notification.label}
                                </p>
                                <p className="mt-1 text-sm leading-5 text-slate-600 dark:text-slate-300">
                                  {notification.description}
                                </p>
                              </li>
                          ))}
                        </ul>
                      </section>
                  ) : null}
                </div>
              </div>

              {isMobileNavOpen ? (
                  <nav
                      aria-label="Mobile dashboard navigation"
                      className="mt-4 grid gap-2 sm:grid-cols-3 lg:hidden"
                      id={mobileNavId}
                  >
                    <NavigationLinks
                        activeSection={activeSection}
                        layout="mobile"
                        onNavigate={() => setIsMobileNavOpen(false)}
                    />
                  </nav>
              ) : null}
            </header>

            {children}
          </main>
        </div>
      </div>
  );
}
