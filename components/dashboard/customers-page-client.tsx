"use client";

import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {CreditCard, ShieldAlert, Sparkles, UsersRound} from "lucide-react";
import {useMemo, useState} from "react";
import {CustomerTable} from "@/components/dashboard/customer-table";
import {DashboardShell} from "@/components/dashboard/dashboard-shell";
import {Skeleton} from "@/components/ui/skeleton";
import {uiStyles} from "@/components/ui/style-primitives";
import {fetchCustomers} from "@/lib/api";
import {cn, formatCurrency, formatNumber} from "@/lib/utils";
import type {CustomerFilters, CustomersResponse} from "@/types/dashboard";

const pageSize = 8;

function CustomerSummary({
  data,
  isLoading,
}: {
  data?: CustomersResponse;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <section aria-label="Customer summary" className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({length: 4}).map((_, index) => (
          <Skeleton className="h-28" key={index}/>
        ))}
      </section>
    );
  }

  const cards = [
    {
      caption: "Accounts in the current segment",
      icon: UsersRound,
      label: "Total customers",
      value: formatNumber(data?.total ?? 0),
    },
    {
      caption: "Recurring revenue in scope",
      icon: CreditCard,
      label: "Filtered MRR",
      value: formatCurrency(data?.summary.totalMrr ?? 0, true),
    },
    {
      caption: "Past due customers needing follow-up",
      icon: ShieldAlert,
      label: "At risk",
      value: formatNumber(data?.summary.atRisk ?? 0),
    },
    {
      caption: "Trials ready for conversion review",
      icon: Sparkles,
      label: "Trials",
      value: formatNumber(data?.summary.trial ?? 0),
    },
  ];

  return (
    <section aria-label="Customer summary" className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
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

/** Focused customer route with segmentation, paging, and account health context. */
export function CustomersPageClient() {
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

  const customersQuery = useQuery({
    placeholderData: keepPreviousData,
    queryFn: () => fetchCustomers(customerFilters),
    queryKey: ["customers", customerFilters],
  });

  const updateFilters = (nextFilters: Partial<CustomerFilters>) => {
    setFilters((current) => ({...current, ...nextFilters}));
  };

  return (
    <DashboardShell
      activeSection="customers"
      description="Segment customers, monitor risk, and review account-level health without crowding the executive overview."
      eyebrow="Customers"
      isRefreshing={customersQuery.isFetching}
      onRefresh={() => void customersQuery.refetch()}
      title="Customers"
    >
      <CustomerSummary data={customersQuery.data} isLoading={customersQuery.isLoading}/>
      <CustomerTable
        data={customersQuery.data}
        filters={customerFilters}
        isError={customersQuery.isError}
        isFetching={customersQuery.isFetching}
        isLoading={customersQuery.isLoading}
        onChangeFilters={updateFilters}
        onRetry={() => void customersQuery.refetch()}
      />
    </DashboardShell>
  );
}

