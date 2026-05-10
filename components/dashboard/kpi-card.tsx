import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BadgePercent,
  CircleDollarSign,
  UsersRound,
} from "lucide-react";
import {uiStyles} from "@/components/ui/style-primitives";
import {cn, formatDelta, formatMetricValue} from "@/lib/utils";
import type {Metric} from "@/types/dashboard";

const iconByMetric: Record<string, typeof CircleDollarSign> = {
  "active-accounts": UsersRound,
  churn: Activity,
  conversion: BadgePercent,
  mrr: CircleDollarSign,
};

/** KPI card for one executive metric, including trend direction and outcome color. */
export function KpiCard({metric}: { metric: Metric }) {
  const Icon = iconByMetric[metric.id] ?? Activity;
  const TrendIcon = metric.trend === "down" ? ArrowDownRight : ArrowUpRight;
  const captionId = `kpi-${metric.id}-caption`;
  const headingId = `kpi-${metric.id}-heading`;
  const isPositiveOutcome =
      (metric.trend === "up" && metric.delta >= 0) ||
      (metric.trend === "down" && metric.delta < 0);

  return (
      <article
          aria-describedby={captionId}
          aria-labelledby={headingId}
          className={cn("p-4", uiStyles.surface)}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400" id={headingId}>
              {metric.label}
            </h3>
            <p className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">
              {formatMetricValue(metric)}
            </p>
          </div>
          <div className={uiStyles.iconFrame}>
            <Icon aria-hidden="true" size={20}/>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
        <span
            aria-label={`${formatDelta(metric.delta)} versus last month`}
            className={cn(
                "inline-flex h-7 items-center gap-1 rounded-md px-2 text-sm font-semibold",
                isPositiveOutcome
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-200"
                    : "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-200",
            )}
        >
          <TrendIcon aria-hidden="true" size={15}/>
          {formatDelta(metric.delta)}
        </span>
          <span className="text-sm text-slate-500 dark:text-slate-400">vs last month</span>
        </div>
        <p className="mt-3 min-h-10 text-sm leading-5 text-slate-600 dark:text-slate-300" id={captionId}>
          {metric.caption}
        </p>
      </article>
  );
}
