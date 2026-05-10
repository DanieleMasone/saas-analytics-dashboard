"use client";

import {useQuery} from "@tanstack/react-query";
import {TrendingDown, TrendingUp, UsersRound} from "lucide-react";
import {DashboardShell} from "@/components/dashboard/dashboard-shell";
import {RevenueChart} from "@/components/dashboard/revenue-chart";
import {Skeleton} from "@/components/ui/skeleton";
import {uiStyles} from "@/components/ui/style-primitives";
import {fetchRevenue} from "@/lib/api";
import {cn, formatCurrency, formatNumber, formatPercent} from "@/lib/utils";
import type {RevenuePoint} from "@/types/dashboard";

function latestRevenueCards(data: RevenuePoint[]) {
  const current = data.at(-1);
  const previous = data.at(-2);
  const growth = current && previous ? (current.revenue - previous.revenue) / previous.revenue : 0;

  return [
    {
      caption: "Current monthly recurring revenue",
      label: "MRR",
      value: formatCurrency(current?.revenue ?? 0),
    },
    {
      caption: "New business booked this month",
      label: "New business",
      value: formatCurrency(current?.newBusiness ?? 0, true),
    },
    {
      caption: "Expansion movement from existing accounts",
      label: "Expansion",
      value: formatCurrency(current?.expansion ?? 0, true),
    },
    {
      caption: `${formatNumber(current?.customers ?? 0)} active accounts`,
      label: "Month growth",
      value: formatPercent(growth),
    },
  ];
}

function RevenueSummaryCards({data, isLoading}: { data: RevenuePoint[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <section aria-label="Revenue summary" className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({length: 4}).map((_, index) => (
          <Skeleton className="h-28" key={index}/>
        ))}
      </section>
    );
  }

  return (
    <section aria-label="Revenue summary" className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {latestRevenueCards(data).map((card) => (
        <article className={cn("p-4", uiStyles.surface)} key={card.label}>
          <p className={uiStyles.subtleText}>{card.label}</p>
          <p className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">{card.value}</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{card.caption}</p>
        </article>
      ))}
    </section>
  );
}

function RevenueTable({data}: { data: RevenuePoint[] }) {
  return (
    <section aria-labelledby="revenue-history-title" className={cn("p-5", uiStyles.surface)}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className={uiStyles.sectionHeading} id="revenue-history-title">Revenue history</h2>
          <p className={cn("mt-1", uiStyles.subtleText)}>
            Monthly movement across acquisition, expansion, churn, and customers.
          </p>
        </div>
        <TrendingUp aria-hidden="true" className="text-emerald-600 dark:text-emerald-300" size={20}/>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-175 text-left text-sm">
          <caption className="sr-only">
            Monthly revenue history with MRR, new business, expansion, churn, and customer count.
          </caption>
          <thead className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
          <tr>
            <th className="py-2 pr-4">Month</th>
            <th className="px-4 py-2 text-right">MRR</th>
            <th className="px-4 py-2 text-right">New</th>
            <th className="px-4 py-2 text-right">Expansion</th>
            <th className="px-4 py-2 text-right">Churn</th>
            <th className="px-4 py-2 text-right">Customers</th>
          </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
          {data.map((point) => (
            <tr key={point.month}>
              <td className="py-3 pr-4 font-medium text-slate-950 dark:text-white">{point.month}</td>
              <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-200">
                {formatCurrency(point.revenue, true)}
              </td>
              <td className="px-4 py-3 text-right text-emerald-700 dark:text-emerald-300">
                {formatCurrency(point.newBusiness, true)}
              </td>
              <td className="px-4 py-3 text-right text-amber-700 dark:text-amber-200">
                {formatCurrency(point.expansion, true)}
              </td>
              <td className="px-4 py-3 text-right text-rose-700 dark:text-rose-300">
                {formatCurrency(point.churn, true)}
              </td>
              <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-200">
                {formatNumber(point.customers)}
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/** Focused revenue route with chart, month cards, and historical detail. */
export function RevenuePageClient() {
  const revenueQuery = useQuery({
    queryFn: fetchRevenue,
    queryKey: ["revenue"],
  });

  const data = revenueQuery.data?.data ?? [];

  return (
    <DashboardShell
      activeSection="revenue"
      description="Understand recurring revenue movement, acquisition, expansion, churn, and account growth from one focused view."
      eyebrow="Revenue"
      isRefreshing={revenueQuery.isFetching}
      onRefresh={() => void revenueQuery.refetch()}
      title="Revenue"
    >
      <RevenueSummaryCards data={data} isLoading={revenueQuery.isLoading}/>

      <RevenueChart
        data={data}
        isError={revenueQuery.isError}
        isLoading={revenueQuery.isLoading}
        onRetry={() => void revenueQuery.refetch()}
      />

      {!revenueQuery.isLoading && !revenueQuery.isError ? (
        <>
          <RevenueTable data={data}/>

          <section aria-label="Revenue watch items" className="grid gap-3 md:grid-cols-2">
            <article className={cn("p-4", uiStyles.surface)}>
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                <TrendingUp aria-hidden="true" size={16}/>
                Expansion motion
              </div>
              <p className={cn("mt-2", uiStyles.bodyText)}>
                Expansion is tracking above churn, with the latest month adding {formatCurrency(data.at(-1)?.expansion ?? 0, true)}.
              </p>
            </article>
            <article className={cn("p-4", uiStyles.surface)}>
              <div className="flex items-center gap-2 text-sm font-semibold text-rose-700 dark:text-rose-300">
                <TrendingDown aria-hidden="true" size={16}/>
                Churn pressure
              </div>
              <p className={cn("mt-2", uiStyles.bodyText)}>
                Current churn impact is {formatCurrency(Math.abs(data.at(-1)?.churn ?? 0), true)} and should stay below new business velocity.
              </p>
            </article>
            <article className={cn("p-4 md:col-span-2", uiStyles.surface)}>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                <UsersRound aria-hidden="true" size={16}/>
                Account base
              </div>
              <p className={cn("mt-2", uiStyles.bodyText)}>
                The customer base closed at {formatNumber(data.at(-1)?.customers ?? 0)} accounts in the latest reporting month.
              </p>
            </article>
          </section>
        </>
      ) : null}
    </DashboardShell>
  );
}
