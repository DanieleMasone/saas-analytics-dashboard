"use client";

import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {
  Activity,
  BarChart3,
  Bell,
  LayoutDashboard,
  LifeBuoy,
  PanelLeft,
  RefreshCcw,
  Settings,
  UsersRound,
} from "lucide-react";
import {useMemo, useState} from "react";
import {CustomerTable} from "@/components/dashboard/customer-table";
import {KpiCard} from "@/components/dashboard/kpi-card";
import {OpsSummary} from "@/components/dashboard/ops-summary";
import {RevenueChart} from "@/components/dashboard/revenue-chart";
import {ThemeToggle} from "@/components/dashboard/theme-toggle";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import {fetchCustomers, fetchMetrics, fetchRevenue} from "@/lib/api";
import {cn} from "@/lib/utils";
import type {CustomerFilters} from "@/types/dashboard";

const pageSize = 8;

const navItems = [
  {icon: LayoutDashboard, label: "Overview", active: true},
  {icon: BarChart3, label: "Revenue", active: false},
  {icon: UsersRound, label: "Customers", active: false},
  {icon: Activity, label: "Health", active: false},
  {icon: Settings, label: "Settings", active: false},
];

export function DashboardClient() {
  const [filters, setFilters] = useState<CustomerFilters>({
    page: 1,
    pageSize,
    plan: "all",
    query: "",
    status: "all",
  });

  const customerFilters = useMemo(
      () => ({
        page: filters.page ?? 1,
        pageSize,
        plan: filters.plan ?? "all",
        query: filters.query ?? "",
        status: filters.status ?? "all",
      }),
      [filters.page, filters.plan, filters.query, filters.status],
  );

  const metricsQuery = useQuery({
    queryFn: fetchMetrics,
    queryKey: ["metrics"],
  });

  const revenueQuery = useQuery({
    queryFn: fetchRevenue,
    queryKey: ["revenue"],
  });

  const customersQuery = useQuery({
    placeholderData: keepPreviousData,
    queryFn: () => fetchCustomers(customerFilters),
    queryKey: ["customers", customerFilters],
  });

  const isRefreshing =
      metricsQuery.isFetching || revenueQuery.isFetching || customersQuery.isFetching;

  const updateFilters = (nextFilters: Partial<CustomerFilters>) => {
    setFilters((current) => ({...current, ...nextFilters}));
  };

  const refreshDashboard = () => {
    void metricsQuery.refetch();
    void revenueQuery.refetch();
    void customersQuery.refetch();
  };

  return (
      <div className="min-h-screen bg-slate-100 text-slate-950 dark:bg-slate-950 dark:text-slate-50">
        <div className="mx-auto flex max-w-370 gap-6 px-4 py-4 sm:px-6 lg:px-8">
          <aside
              className="sticky top-4 hidden h-[calc(100vh-2rem)] w-64 shrink-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:flex lg:flex-col">
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

            <nav className="mt-8 space-y-1" aria-label="Dashboard navigation">
              {navItems.map((item) => (
                  <button
                      className={cn(
                          "flex h-10 w-full items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors",
                          item.active
                              ? "bg-cyan-50 text-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-200"
                              : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
                      )}
                      key={item.label}
                      type="button"
                  >
                    <item.icon aria-hidden="true" size={17}/>
                    {item.label}
                  </button>
              ))}
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

          <main className="min-w-0 flex-1 space-y-5">
            <header
                className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="min-w-0">
                  <div
                      className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <span>Dashboard</span>
                    <span aria-hidden="true">/</span>
                    <span className="font-medium text-slate-700 dark:text-slate-200">
                    Executive overview
                  </span>
                  </div>
                  <h1 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">
                    SaaS Analytics Dashboard
                  </h1>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                    Monitor recurring revenue, customer health, account risk, and expansion
                    movement from one operating view.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                      aria-label="Notifications"
                      size="icon"
                      title="Notifications"
                      variant="secondary"
                  >
                    <Bell aria-hidden="true" size={17}/>
                  </Button>
                  <ThemeToggle/>
                  <Button disabled={isRefreshing} onClick={refreshDashboard} variant="primary">
                    <RefreshCcw
                        aria-hidden="true"
                        className={cn(isRefreshing && "animate-spin")}
                        size={16}
                    />
                    Refresh
                  </Button>
                </div>
              </div>
            </header>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {metricsQuery.isLoading
                  ? Array.from({length: 4}).map((_, index) => (
                      <Skeleton className="h-40" key={index}/>
                  ))
                  : metricsQuery.data?.data.map((metric) => (
                      <KpiCard key={metric.id} metric={metric}/>
                  ))}
            </section>

            {metricsQuery.isError ? (
                <div
                    className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900 dark:border-rose-900/70 dark:bg-rose-950/20 dark:text-rose-100">
                  Metrics failed to load. The rest of the dashboard remains usable.
                </div>
            ) : null}

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
              <RevenueChart
                  data={revenueQuery.data?.data ?? []}
                  isError={revenueQuery.isError}
                  isLoading={revenueQuery.isLoading}
                  onRetry={() => void revenueQuery.refetch()}
              />
              <OpsSummary
                  customers={customersQuery.data}
                  isLoading={customersQuery.isLoading || revenueQuery.isLoading}
                  revenue={revenueQuery.data?.data}
              />
            </div>

            <CustomerTable
                data={customersQuery.data}
                filters={customerFilters}
                isError={customersQuery.isError}
                isFetching={customersQuery.isFetching}
                isLoading={customersQuery.isLoading}
                onChangeFilters={updateFilters}
                onRetry={() => void customersQuery.refetch()}
            />
          </main>
        </div>
      </div>
  );
}
