"use client";

import {useQuery} from "@tanstack/react-query";
import {AlertTriangle, CheckCircle2, ShieldCheck, TrendingUp} from "lucide-react";
import {DashboardShell} from "../dashboard-shell/dashboard-shell";
import {Badge} from "@/components/ui/badge/badge";
import {Button} from "@/components/ui/button/button";
import {MeterBar, type MeterTone} from "@/components/ui/meter-bar/meter-bar";
import {Skeleton} from "@/components/ui/skeleton/skeleton";
import {uiStyles} from "@/components/ui/style-primitives";
import {fetchCustomers} from "@/lib/api/api";
import {cn, formatCurrency, formatDate, formatNumber, formatPercent} from "@/lib/utils/utils";
import type {Customer, CustomerStatus} from "@/types/dashboard";

const statusCopy: Record<CustomerStatus, string> = {
  active: "Active",
  churned: "Churned",
  past_due: "Past due",
  trial: "Trial",
};

const statusTone: Record<CustomerStatus, "amber" | "emerald" | "rose" | "slate"> = {
  active: "emerald",
  churned: "slate",
  past_due: "rose",
  trial: "amber",
};

const healthCustomerFilters = {
  page: 1,
  pageSize: 100,
  plan: "all" as const,
  query: "",
  status: "all" as const,
};

function healthTone(value: number): MeterTone {
  if (value >= 80) return "emerald";
  if (value >= 60) return "amber";
  return "rose";
}

function HealthSummary({
                         customers,
                         isLoading,
                       }: {
  customers: Customer[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
        <section aria-label="Health summary" className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({length: 4}).map((_, index) => (
              <Skeleton className="h-28" key={index}/>
          ))}
        </section>
    );
  }

  const averageHealth = customers.length
      ? Math.round(customers.reduce((total, customer) => total + customer.healthScore, 0) / customers.length)
      : 0;
  const lowUsage = customers.filter((customer) => customer.usage < 60).length;
  const pastDue = customers.filter((customer) => customer.status === "past_due").length;
  const healthy = customers.filter((customer) => customer.healthScore >= 80).length;

  const cards = [
    {
      caption: "Average customer health",
      icon: ShieldCheck,
      label: "Health score",
      value: `${formatNumber(averageHealth)}/100`,
    },
    {
      caption: "Customers below usage target",
      icon: TrendingUp,
      label: "Low usage",
      value: formatNumber(lowUsage),
    },
    {
      caption: "Billing or commercial risk",
      icon: AlertTriangle,
      label: "Past due",
      value: formatNumber(pastDue),
    },
    {
      caption: "Healthy accounts above 80",
      icon: CheckCircle2,
      label: "Healthy",
      value: formatNumber(healthy),
    },
  ];

  return (
      <section aria-label="Health summary" className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
            <article className={cn("p-4", uiStyles.surface)} key={card.label}>
              <p className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <card.icon aria-hidden="true" size={16}/>
                {card.label}
              </p>
              <p className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">{card.value}</p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{card.caption}</p>
            </article>
        ))}
      </section>
  );
}

function HealthDistribution({customers}: { customers: Customer[] }) {
  const total = Math.max(customers.length, 1);
  const ranges = [
    {
      count: customers.filter((customer) => customer.healthScore >= 80).length,
      label: "Healthy",
      tone: "emerald" as const,
    },
    {
      count: customers.filter((customer) => customer.healthScore >= 60 && customer.healthScore < 80).length,
      label: "Watch",
      tone: "amber" as const,
    },
    {
      count: customers.filter((customer) => customer.healthScore < 60).length,
      label: "Risk",
      tone: "rose" as const,
    },
  ];

  return (
      <section aria-labelledby="health-distribution-title" className={cn("p-5", uiStyles.surface)}>
        <h2 className={uiStyles.sectionHeading} id="health-distribution-title">Health distribution</h2>
        <div className="mt-5 space-y-4">
          {ranges.map((range) => {
            const percent = Math.round((range.count / total) * 100);

            return (
                <div className="space-y-2" key={range.label}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{range.label}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {formatNumber(range.count)} accounts - {formatPercent(percent / 100)}
                    </p>
                  </div>
                  <MeterBar
                      label={`${range.label} account distribution`}
                      tone={range.tone}
                      value={percent}
                      valueText={`${percent}%`}
                  />
                </div>
            );
          })}
        </div>
      </section>
  );
}

function RiskQueue({customers}: { customers: Customer[] }) {
  const riskCustomers = [...customers]
      .sort((left, right) => left.healthScore - right.healthScore)
      .slice(0, 6);

  return (
      <section aria-labelledby="health-risk-title" className={cn("p-5", uiStyles.surface)}>
        <h2 className={uiStyles.sectionHeading} id="health-risk-title">Risk queue</h2>
        <ul className="mt-4 grid gap-3 lg:grid-cols-2">
          {riskCustomers.map((customer) => (
              <li className={cn("p-4", uiStyles.insetSurface)} key={customer.id}>
                <article aria-labelledby={`${customer.id}-health-title`}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-slate-950 dark:text-white"
                        id={`${customer.id}-health-title`}>
                      {customer.company}
                    </h3>
                    <Badge tone={statusTone[customer.status]}>{statusCopy[customer.status]}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {customer.owner} - {customer.region}
                  </p>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Health</span>
                      <span
                          className="font-medium text-slate-950 dark:text-white">{customer.healthScore}/100</span>
                    </div>
                    <MeterBar
                        label={`${customer.company} health score`}
                        tone={healthTone(customer.healthScore)}
                        value={customer.healthScore}
                        valueText={`${customer.healthScore} out of 100`}
                    />
                  </div>
                  <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <dt className="text-slate-500 dark:text-slate-400">MRR</dt>
                      <dd className="mt-1 font-medium text-slate-900 dark:text-white">
                        {formatCurrency(customer.mrr, true)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500 dark:text-slate-400">Usage</dt>
                      <dd className="mt-1 font-medium text-slate-900 dark:text-white">
                        {formatPercent(customer.usage / 100)}
                      </dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="text-slate-500 dark:text-slate-400">Last seen</dt>
                      <dd className="mt-1 font-medium text-slate-900 dark:text-white">
                        {formatDate(customer.lastSeen)}
                      </dd>
                    </div>
                  </dl>
                </article>
              </li>
          ))}
        </ul>
      </section>
  );
}

/** Focused health route for customer risk, usage quality, and account follow-up. */
export function HealthPageClient() {
  const customersQuery = useQuery({
    queryFn: () => fetchCustomers(healthCustomerFilters),
    queryKey: ["customers", healthCustomerFilters],
  });

  const customers = customersQuery.data?.data ?? [];

  return (
      <DashboardShell
          activeSection="health"
          description="Prioritize customer follow-up by health score, usage pressure, billing risk, and account activity."
          eyebrow="Health"
          isRefreshing={customersQuery.isFetching}
          onRefresh={() => void customersQuery.refetch()}
          title="Health"
      >
        <HealthSummary customers={customers} isLoading={customersQuery.isLoading}/>

        {customersQuery.isLoading ? (
            <div className="grid gap-4 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
              <Skeleton className="h-88"/>
              <Skeleton className="h-130"/>
            </div>
        ) : customersQuery.isError ? (
            <section className={cn("p-5", uiStyles.dangerSurface)} role="alert">
              <h2 className={uiStyles.sectionHeading}>Customer health failed to load</h2>
              <p className={cn("mt-2", uiStyles.bodyText)}>
                Health scoring is unavailable, but the rest of the workspace remains usable.
              </p>
              <Button className="mt-4" onClick={() => void customersQuery.refetch()} variant="danger">
                Retry
              </Button>
            </section>
        ) : (
            <div className="grid gap-4 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
              <HealthDistribution customers={customers}/>
              <RiskQueue customers={customers}/>
            </div>
        )}
      </DashboardShell>
  );
}
