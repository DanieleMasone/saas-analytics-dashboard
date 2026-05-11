import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Flame,
  ShieldCheck,
} from "lucide-react";
import {Badge} from "@/components/ui/badge/badge";
import {Skeleton} from "@/components/ui/skeleton/skeleton";
import {uiStyles} from "@/components/ui/style-primitives";
import {cn, formatCurrency, formatNumber} from "@/lib/utils/utils";
import type {CustomersResponse, RevenuePoint} from "@/types/dashboard";

/** Props for the operating pulse summary panel. */
export type OpsSummaryProps = {
  customers?: CustomersResponse;
  revenue?: RevenuePoint[];
  isLoading: boolean;
};

/** Side-panel summary that stays aligned with the active customer filters. */
export function OpsSummary({customers, isLoading, revenue}: OpsSummaryProps) {
  if (isLoading) {
    return (
        <aside
            aria-busy="true"
            aria-label="Loading operating pulse"
            aria-live="polite"
            role="status"
            className={cn("p-5", uiStyles.surface)}>
          <Skeleton className="h-7 w-44"/>
          <Skeleton className="mt-3 h-4 w-60"/>
          <div className="mt-6 space-y-3">
            {Array.from({length: 6}).map((_, index) => (
                <Skeleton className="h-16 w-full" key={index}/>
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
      <aside
          aria-labelledby="ops-summary-title"
          className={cn("p-5", uiStyles.surface)}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className={uiStyles.sectionHeading} id="ops-summary-title">
              Operating pulse
            </h2>
            <p className={cn("mt-1 leading-6", uiStyles.subtleText)}>
              A compact read on health, revenue movement, and account risk.
            </p>
          </div>
          <Badge tone="cyan">Live data</Badge>
        </div>

        <dl className="mt-6 grid gap-3">
          <div className={cn("flex items-center justify-between gap-3 p-3", uiStyles.insetSurface)}>
            <dt className={cn("flex items-center gap-2", uiStyles.subtleText)}>
              <Flame aria-hidden="true" size={16}/>
              Filtered MRR
            </dt>
            <dd className="text-lg font-bold text-slate-950 dark:text-white">
              {formatCurrency(customers?.summary.totalMrr ?? 0, true)}
            </dd>
          </div>
          <div className={cn("flex items-center justify-between gap-3 p-3", uiStyles.insetSurface)}>
            <dt className={cn("flex items-center gap-2", uiStyles.subtleText)}>
              <ShieldCheck aria-hidden="true" size={16}/>
              Average health
            </dt>
            <dd className="text-lg font-bold text-slate-950 dark:text-white">
              {customers?.summary.averageHealth ?? 0}
            </dd>
          </div>
          <div className={cn("flex items-center justify-between gap-3 p-3", uiStyles.insetSurface)}>
            <dt className={cn("flex items-center gap-2", uiStyles.subtleText)}>
              <ArrowUpRight aria-hidden="true" size={16}/>
              MRR growth
            </dt>
            <dd className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
              +{growth.toFixed(1)}%
            </dd>
          </div>
        </dl>

        <div className="mt-6 space-y-3">
          <h3 className="text-sm font-semibold text-slate-950 dark:text-white">Account queue</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-3 rounded-md bg-rose-50 p-3 text-sm dark:bg-rose-950/20">
              <AlertCircle aria-hidden="true" className="mt-0.5 text-rose-600" size={16}/>
              <p className="leading-5 text-rose-900 dark:text-rose-100">
                {formatNumber(customers?.summary.atRisk ?? 0)} accounts need billing follow-up.
              </p>
            </li>
            <li className="flex items-start gap-3 rounded-md bg-amber-50 p-3 text-sm dark:bg-amber-950/20">
              <Clock3 aria-hidden="true" className="mt-0.5 text-amber-600" size={16}/>
              <p className="leading-5 text-amber-900 dark:text-amber-100">
                {formatNumber(customers?.summary.trial ?? 0)} trials are ready for conversion review.
              </p>
            </li>
            <li className="flex items-start gap-3 rounded-md bg-emerald-50 p-3 text-sm dark:bg-emerald-950/20">
              <CheckCircle2 aria-hidden="true" className="mt-0.5 text-emerald-600" size={16}/>
              <p className="leading-5 text-emerald-900 dark:text-emerald-100">
                {formatNumber(customers?.summary.active ?? 0)} filtered accounts are currently active.
              </p>
            </li>
          </ul>
        </div>
      </aside>
  );
}
