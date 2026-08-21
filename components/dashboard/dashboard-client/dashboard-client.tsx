"use client";

import {useQuery} from "@tanstack/react-query";
import {
  ArrowRight,
  BarChart3,
  ListChecks,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import {DashboardShell} from "@/components/dashboard/dashboard-shell/dashboard-shell";
import {KpiCard} from "@/components/dashboard/kpi-card/kpi-card";
import {OpsSummary} from "@/components/dashboard/ops-summary/ops-summary";
import {RevenueChart} from "@/components/dashboard/revenue-chart/revenue-chart";
import {Skeleton} from "@/components/ui/skeleton/skeleton";
import {uiStyles} from "@/components/ui/style-primitives";
import {fetchCustomers, fetchDelivery, fetchMetrics, fetchRevenue} from "@/lib/api/api";
import {cn, formatCurrency, formatNumber, formatPercent} from "@/lib/utils/utils";
import type {CustomersResponse, JiraDeliveryResponse, RevenuePoint} from "@/types/dashboard";

const pageSize = 8;
const overviewCustomerFilters = {
  page: 1,
  pageSize,
  plan: "all" as const,
  query: "",
  status: "all" as const,
};

function OverviewFocusPanel({
                              customers,
                              delivery,
                              isLoading,
                              revenue,
                            }: {
  customers?: CustomersResponse;
  delivery?: JiraDeliveryResponse;
  isLoading: boolean;
  revenue?: RevenuePoint[];
}) {
  if (isLoading) {
    return (
        <section aria-label="Management focus" className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({length: 4}).map((_, index) => (
              <Skeleton className="h-32" key={index}/>
          ))}
        </section>
    );
  }

  const latestRevenue = revenue?.at(-1);
  const focusCards = [
    {
      caption: `${formatCurrency(latestRevenue?.newBusiness ?? 0, true)} new business this month`,
      href: "/revenue",
      icon: BarChart3,
      label: "Revenue",
      value: formatCurrency(latestRevenue?.revenue ?? 0, true),
    },
    {
      caption: `${formatNumber(customers?.summary.atRisk ?? 0)} accounts need attention`,
      href: "/customers",
      icon: UsersRound,
      label: "Customers",
      value: formatNumber(customers?.total ?? 0),
    },
    {
      caption: `${formatNumber(delivery?.summary.blockerCount ?? 0)} blockers before release`,
      href: "/delivery",
      icon: ListChecks,
      label: "Delivery",
      value: formatPercent((delivery?.summary.completionRate ?? 0) / 100),
    },
    {
      caption: `${formatNumber(customers?.summary.trial ?? 0)} trials in conversion window`,
      href: "/health",
      icon: ShieldCheck,
      label: "Health",
      value: `${formatNumber(customers?.summary.averageHealth ?? 0)}/100`,
    },
  ];

  return (
      <section aria-label="Management focus" className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {focusCards.map((card) => (
            <Link
                className={cn(
                    "group flex min-h-32 flex-col justify-between p-4 transition-colors hover:border-cyan-300 hover:bg-cyan-50/60 dark:hover:border-cyan-800 dark:hover:bg-cyan-950/20",
                    uiStyles.surface,
                )}
                href={card.href}
                key={card.label}
            >
          <span className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
              <card.icon aria-hidden="true" size={16}/>
              {card.label}
            </span>
            <ArrowRight
                aria-hidden="true"
                className="text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-cyan-700 dark:group-hover:text-cyan-300"
                size={16}
            />
          </span>
              <span>
            <span className="block text-2xl font-semibold text-slate-950 dark:text-white">
              {card.value}
            </span>
            <span className="mt-1 block text-sm text-slate-500 dark:text-slate-400">
              {card.caption}
            </span>
          </span>
            </Link>
        ))}
      </section>
  );
}

/** Executive overview route that coordinates summary queries and cross-page refreshes. */
export function DashboardClient() {
  const metricsQuery = useQuery({
    queryFn: fetchMetrics,
    queryKey: ["metrics"],
  });

  const revenueQuery = useQuery({
    queryFn: fetchRevenue,
    queryKey: ["revenue"],
  });

  const deliveryQuery = useQuery({
    queryFn: fetchDelivery,
    queryKey: ["delivery"],
  });

  const customersQuery = useQuery({
    queryFn: () => fetchCustomers(overviewCustomerFilters),
    queryKey: ["customers", overviewCustomerFilters],
  });

  const isRefreshing =
      metricsQuery.isFetching ||
      revenueQuery.isFetching ||
      deliveryQuery.isFetching ||
      customersQuery.isFetching;

  const refreshDashboard = () => {
    void metricsQuery.refetch();
    void revenueQuery.refetch();
    void deliveryQuery.refetch();
    void customersQuery.refetch();
  };

  return (
      <DashboardShell
          activeSection="overview"
          description="Scan revenue, customer health, delivery risk, and operating movement before opening a focused view."
          eyebrow="Executive overview"
          isRefreshing={isRefreshing}
          onRefresh={refreshDashboard}
          title="SaaS Analytics Dashboard"
      >
        <section
            aria-busy={metricsQuery.isLoading || metricsQuery.isFetching}
            aria-label="Executive metrics"
            aria-live="polite"
            className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        >
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
                role="alert"
                className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900 dark:border-rose-900/70 dark:bg-rose-950/20 dark:text-rose-100">
              Metrics failed to load. The rest of the dashboard remains usable.
            </div>
        ) : null}

        <OverviewFocusPanel
            customers={customersQuery.data}
            delivery={deliveryQuery.data?.data}
            isLoading={customersQuery.isLoading || deliveryQuery.isLoading || revenueQuery.isLoading}
            revenue={revenueQuery.data?.data}
        />

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
      </DashboardShell>
  );
}
