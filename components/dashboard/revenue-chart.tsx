import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {AlertTriangle, RotateCcw} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import {uiStyles} from "@/components/ui/style-primitives";
import {cn, formatCurrency, formatNumber} from "@/lib/utils";
import type {RevenuePoint} from "@/types/dashboard";

/** Props for the revenue composition chart panel. */
export type RevenueChartProps = {
  data: RevenuePoint[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
};

type TooltipPayload = {
  color?: string;
  name?: string;
  value?: number;
};

const chartColors = {
  cursor: "rgba(148, 163, 184, 0.12)",
  expansion: "#f59e0b",
  grid: "#d7dee8",
  newBusiness: "#10b981",
  revenue: "#0891b2",
  revenueFillEnd: "#0891b2",
  revenueFillStart: "#0891b2",
  tick: "#64748b",
} as const;

const seriesMarkerClass: Record<string, string> = {
  Expansion: "bg-amber-500",
  MRR: "bg-cyan-600",
  "New business": "bg-emerald-500",
};

// Recharts passes a broad tooltip payload; this local shape keeps rendering typed.
function ChartTooltip({
                        active,
                        label,
                        payload,
                      }: {
  active?: boolean;
  label?: string;
  payload?: TooltipPayload[];
}) {
  if (!active || !payload?.length) return null;

  return (
      <div
          className="rounded-md border border-slate-200 bg-white p-3 text-sm shadow-lg dark:border-slate-700 dark:bg-slate-900">
        <p className="font-semibold text-slate-950 dark:text-white">{label}</p>
        <div className="mt-2 space-y-1">
          {payload.map((entry) => (
              <div className="flex min-w-44 items-center justify-between gap-4" key={entry.name}>
            <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <span
                  className={cn("h-2.5 w-2.5 rounded-sm", seriesMarkerClass[entry.name ?? ""] ?? "bg-slate-400")}
              />
              {entry.name}
            </span>
                <span className="font-medium text-slate-950 dark:text-white">
              {formatCurrency(entry.value ?? 0, true)}
            </span>
              </div>
          ))}
        </div>
      </div>
  );
}

/** Revenue composition panel with loading, error, and populated chart states. */
export function RevenueChart({data, isError, isLoading, onRetry}: RevenueChartProps) {
  if (isLoading) {
    return (
        <section
            aria-busy="true"
            aria-label="Loading revenue composition"
            aria-live="polite"
            role="status"
            className={cn("p-5", uiStyles.surface)}>
          <Skeleton className="h-7 w-48"/>
          <Skeleton className="mt-3 h-4 w-72 max-w-full"/>
          <Skeleton className="mt-8 h-80 w-full"/>
        </section>
    );
  }

  if (isError) {
    return (
        <section
            aria-labelledby="revenue-chart-error-title"
            className={cn("p-5", uiStyles.dangerSurface)}>
          <div className="flex items-start gap-3" role="alert">
            <AlertTriangle aria-hidden="true" className="mt-0.5 text-rose-600 dark:text-rose-300" size={20}/>
            <div>
              <h2 className={uiStyles.sectionHeading} id="revenue-chart-error-title">
                Revenue data failed to load
              </h2>
              <p className={cn("mt-2", uiStyles.bodyText)}>
                The revenue service returned an error. Retry the query to recover this panel.
              </p>
              <Button className="mt-4" onClick={onRetry} variant="danger">
                <RotateCcw aria-hidden="true" size={16}/>
                Retry
              </Button>
            </div>
          </div>
        </section>
    );
  }

  const latestPoint = data.at(-1);
  const chartSummary = latestPoint
      ? `Revenue composition across ${data.length} months. Current MRR is ${formatCurrency(latestPoint.revenue)}.`
      : "Revenue composition chart has no data.";

  return (
      <section
          aria-labelledby="revenue-chart-title"
          className={cn("p-5", uiStyles.surface)}>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className={uiStyles.sectionHeading} id="revenue-chart-title">
              Revenue composition
            </h2>
            <p className={cn("mt-1", uiStyles.subtleText)}>
              MRR, new business, expansion, and churn over the last 12 months.
            </p>
          </div>
          <div className="rounded-md border border-slate-200 px-3 py-2 text-sm dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400">Current MRR</span>
            <span className="ml-2 font-semibold text-slate-950 dark:text-white">
            {formatCurrency(latestPoint?.revenue ?? 0)}
          </span>
          </div>
        </div>

        <div
            aria-describedby="revenue-chart-description"
            aria-label="Revenue composition chart"
            className="mt-6 h-85 min-w-0"
            role="img"
        >
          <p className="sr-only" id="revenue-chart-description">{chartSummary}</p>
          {/* ResponsiveContainer needs a stable parent height to avoid a blank chart. */}
          <div aria-hidden="true" className="h-full w-full">
            <ResponsiveContainer height="100%" width="100%">
              <ComposedChart data={data} margin={{bottom: 8, left: 0, right: 6, top: 10}}>
                <defs>
                  <linearGradient id="revenue-fill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor={chartColors.revenueFillStart} stopOpacity={0.28}/>
                    <stop offset="95%" stopColor={chartColors.revenueFillEnd} stopOpacity={0.02}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={chartColors.grid} strokeDasharray="4 4" vertical={false}/>
                <XAxis
                    axisLine={false}
                    dataKey="month"
                    tick={{fill: chartColors.tick, fontSize: 12}}
                    tickLine={false}
                />
                <YAxis
                    axisLine={false}
                    tick={{fill: chartColors.tick, fontSize: 12}}
                    tickFormatter={(value) => formatNumber(Number(value))}
                    tickLine={false}
                    width={58}
                />
                <Tooltip content={<ChartTooltip/>} cursor={{fill: chartColors.cursor}}/>
                <Legend iconType="square" wrapperStyle={{fontSize: 12, paddingTop: 12}}/>
                <Bar dataKey="newBusiness" fill={chartColors.newBusiness} name="New business" radius={[4, 4, 0, 0]}/>
                <Bar dataKey="expansion" fill={chartColors.expansion} name="Expansion" radius={[4, 4, 0, 0]}/>
                <Area
                    dataKey="revenue"
                    fill="url(#revenue-fill)"
                    name="MRR"
                    stroke={chartColors.revenue}
                    strokeWidth={3}
                    type="monotone"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
  );
}
