import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Flame,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatNumber } from "@/lib/utils";
import type { CustomersResponse, RevenuePoint } from "@/types/dashboard";

type OpsSummaryProps = {
  customers?: CustomersResponse;
  revenue?: RevenuePoint[];
  isLoading: boolean;
};

export function OpsSummary({ customers, isLoading, revenue }: OpsSummaryProps) {
  if (isLoading) {
    return (
      <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <Skeleton className="h-7 w-44" />
        <Skeleton className="mt-3 h-4 w-60" />
        <div className="mt-6 space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton className="h-16 w-full" key={index} />
          ))}
        </div>
      </aside>
    );
  }

  const current = revenue?.at(-1);
  const previous = revenue?.at(-2);
  const growth =
    current && previous ? ((current.revenue - previous.revenue) / previous.revenue) * 100 : 0;

  return (
    <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
            Operating pulse
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
            A compact read on health, revenue movement, and account risk.
          </p>
        </div>
        <Badge tone="cyan">Live data</Badge>
      </div>

      <div className="mt-6 grid gap-3">
        <div className="rounded-md border border-slate-200 p-3 dark:border-slate-800">
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Flame aria-hidden="true" size={16} />
              Filtered MRR
            </span>
            <strong className="text-lg text-slate-950 dark:text-white">
              {formatCurrency(customers?.summary.totalMrr ?? 0, true)}
            </strong>
          </div>
        </div>
        <div className="rounded-md border border-slate-200 p-3 dark:border-slate-800">
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <ShieldCheck aria-hidden="true" size={16} />
              Average health
            </span>
            <strong className="text-lg text-slate-950 dark:text-white">
              {customers?.summary.averageHealth ?? 0}
            </strong>
          </div>
        </div>
        <div className="rounded-md border border-slate-200 p-3 dark:border-slate-800">
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <ArrowUpRight aria-hidden="true" size={16} />
              MRR growth
            </span>
            <strong className="text-lg text-emerald-700 dark:text-emerald-300">
              +{growth.toFixed(1)}%
            </strong>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <h3 className="text-sm font-semibold text-slate-950 dark:text-white">Account queue</h3>
        <div className="space-y-2">
          <div className="flex items-start gap-3 rounded-md bg-rose-50 p-3 text-sm dark:bg-rose-950/20">
            <AlertCircle aria-hidden="true" className="mt-0.5 text-rose-600" size={16} />
            <p className="leading-5 text-rose-900 dark:text-rose-100">
              {formatNumber(customers?.summary.atRisk ?? 0)} accounts need billing follow-up.
            </p>
          </div>
          <div className="flex items-start gap-3 rounded-md bg-amber-50 p-3 text-sm dark:bg-amber-950/20">
            <Clock3 aria-hidden="true" className="mt-0.5 text-amber-600" size={16} />
            <p className="leading-5 text-amber-900 dark:text-amber-100">
              {formatNumber(customers?.summary.trial ?? 0)} trials are ready for conversion review.
            </p>
          </div>
          <div className="flex items-start gap-3 rounded-md bg-emerald-50 p-3 text-sm dark:bg-emerald-950/20">
            <CheckCircle2 aria-hidden="true" className="mt-0.5 text-emerald-600" size={16} />
            <p className="leading-5 text-emerald-900 dark:text-emerald-100">
              {formatNumber(customers?.summary.active ?? 0)} filtered accounts are currently active.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
