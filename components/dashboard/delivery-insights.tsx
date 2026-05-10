import {
  AlertTriangle,
  CircleAlert,
  GitPullRequest,
  ListChecks,
  RotateCcw,
  Timer,
} from "lucide-react";
import {Badge, type BadgeTone} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import {cn, formatDate, formatNumber, formatPercent} from "@/lib/utils";
import type {
  JiraDeliveryResponse,
  JiraIssuePriority,
  JiraIssueStatus,
} from "@/types/dashboard";

/** Props for the manager-facing Jira delivery KPI panel. */
export type DeliveryInsightsProps = {
  data?: JiraDeliveryResponse;
  isError: boolean;
  isLoading: boolean;
  onRetry: () => void;
};

const priorityTone: Record<JiraIssuePriority, BadgeTone> = {
  critical: "rose",
  high: "amber",
  low: "slate",
  medium: "cyan",
};

const statusCopy: Record<JiraIssueStatus, string> = {
  blocked: "Blocked",
  done: "Done",
  in_progress: "In progress",
  review: "Review",
  todo: "To do",
};

function formatDays(value: number) {
  return `${value.toFixed(1)}d`;
}

function DeliveryMeter({
                         label,
                         tone = "bg-cyan-600 dark:bg-cyan-400",
                         value,
                       }: {
  label: string;
  tone?: string;
  value: number;
}) {
  return (
      <div
          aria-label={label}
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={value}
          aria-valuetext={`${value}%`}
          className="h-2 rounded-md bg-slate-200 dark:bg-slate-800"
          role="meter"
      >
        <div
            aria-hidden="true"
            className={cn("h-2 rounded-md", tone)}
            style={{width: `${Math.min(Math.max(value, 0), 100)}%`}}
        />
      </div>
  );
}

function DeliveryLoading() {
  return (
      <section
          aria-busy="true"
          aria-label="Loading Jira delivery signals"
          aria-live="polite"
          className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          role="status"
      >
        <Skeleton className="h-7 w-52"/>
        <Skeleton className="mt-3 h-4 w-90 max-w-full"/>
        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({length: 4}).map((_, index) => (
              <Skeleton className="h-28" key={index}/>
          ))}
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_380px]">
          <Skeleton className="h-64"/>
          <Skeleton className="h-64"/>
        </div>
      </section>
  );
}

/** Jira-style delivery KPI panel for product and engineering management. */
export function DeliveryInsights({
                                   data,
                                   isError,
                                   isLoading,
                                   onRetry,
                                 }: DeliveryInsightsProps) {
  if (isLoading) return <DeliveryLoading/>;

  if (isError || !data) {
    return (
        <section
            aria-labelledby="delivery-error-title"
            className="rounded-lg border border-rose-200 bg-white p-5 shadow-sm dark:border-rose-900/70 dark:bg-slate-900"
        >
          <div className="flex items-start gap-3" role="alert">
            <AlertTriangle aria-hidden="true" className="mt-0.5 text-rose-600 dark:text-rose-300" size={20}/>
            <div>
              <h2 className="text-lg font-semibold text-slate-950 dark:text-white" id="delivery-error-title">
                Jira delivery signals failed to load
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Delivery data is unavailable, but revenue and customer health remain usable.
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

  const {risks, summary, trends} = data;
  const currentTrend = trends.at(-1);
  const deliveryGap = summary.plannedPoints - summary.completedPoints;

  return (
      <section
          aria-labelledby="delivery-title"
          className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ListChecks aria-hidden="true" className="text-cyan-700 dark:text-cyan-300" size={18}/>
              <h2 className="text-lg font-semibold text-slate-950 dark:text-white" id="delivery-title">
                Jira delivery signals
              </h2>
            </div>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Sprint predictability, flow, scope change, and blocked work for product decisions.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="cyan">Jira sample</Badge>
            <Badge tone={summary.blockerCount > 2 ? "amber" : "emerald"}>
              {summary.releaseName}
            </Badge>
          </div>
        </div>

        <dl aria-label="Jira delivery KPI cards" className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-md border border-slate-200 p-3 dark:border-slate-800">
            <dt className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <GitPullRequest aria-hidden="true" size={16}/>
              Sprint predictability
            </dt>
            <dd className="mt-3">
              <p className="text-2xl font-semibold text-slate-950 dark:text-white">
                {formatPercent(summary.completionRate / 100)}
              </p>
              <DeliveryMeter label="Sprint predictability" value={summary.completionRate}/>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {formatNumber(summary.completedPoints)} of {formatNumber(summary.plannedPoints)} points done
              </p>
            </dd>
          </div>

          <div className="rounded-md border border-slate-200 p-3 dark:border-slate-800">
            <dt className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Timer aria-hidden="true" size={16}/>
              Cycle time
            </dt>
            <dd className="mt-3">
              <p className="text-2xl font-semibold text-slate-950 dark:text-white">
                {formatDays(summary.cycleTimeDays)}
              </p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Lead time {formatDays(summary.leadTimeDays)} from selected to done
              </p>
            </dd>
          </div>

          <div className="rounded-md border border-slate-200 p-3 dark:border-slate-800">
            <dt className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <CircleAlert aria-hidden="true" size={16}/>
              Blocked work
            </dt>
            <dd className="mt-3">
              <p className="text-2xl font-semibold text-amber-700 dark:text-amber-200">
                {formatNumber(summary.blockerCount)}
              </p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {formatNumber(summary.escapedBugs)} escaped bugs are tracked for release readiness
              </p>
            </dd>
          </div>

          <div className="rounded-md border border-slate-200 p-3 dark:border-slate-800">
            <dt className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <ListChecks aria-hidden="true" size={16}/>
              Scope change
            </dt>
            <dd className="mt-3">
              <p className="text-2xl font-semibold text-slate-950 dark:text-white">
                {formatPercent(summary.scopeChangeRate / 100)}
              </p>
              <DeliveryMeter
                  label="Team confidence"
                  tone="bg-emerald-600 dark:bg-emerald-400"
                  value={summary.teamConfidence}
              />
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Team confidence {formatPercent(summary.teamConfidence / 100)}
              </p>
            </dd>
          </div>
        </dl>

        <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="rounded-md border border-slate-200 p-4 dark:border-slate-800">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-950 dark:text-white">
                  Delivery trend
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Weekly committed, completed, created, and resolved Jira work.
                </p>
              </div>
              <Badge tone={deliveryGap > 6 ? "amber" : "emerald"}>
                {formatNumber(deliveryGap)} pt gap
              </Badge>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-150 text-left text-sm">
                <caption className="sr-only">
                  Jira weekly delivery trend with committed, completed, created, resolved, and blocker counts.
                </caption>
                <thead className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="py-2 pr-4">Week</th>
                  <th className="px-4 py-2 text-right">Committed</th>
                  <th className="px-4 py-2 text-right">Completed</th>
                  <th className="px-4 py-2 text-right">Resolved</th>
                  <th className="px-4 py-2 text-right">Blockers</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {trends.map((point) => (
                    <tr key={point.week}>
                      <td className="py-3 pr-4 font-medium text-slate-950 dark:text-white">
                        {point.week}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-200">
                        {formatNumber(point.committed)}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-200">
                        {formatNumber(point.completed)}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-200">
                        {formatNumber(point.resolved)}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-amber-700 dark:text-amber-200">
                        {formatNumber(point.blockers)}
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>

          <aside
              aria-labelledby="delivery-manager-title"
              className="rounded-md border border-slate-200 p-4 dark:border-slate-800"
          >
            <h3 className="text-sm font-semibold text-slate-950 dark:text-white" id="delivery-manager-title">
              Manager readout
            </h3>
            <dl className="mt-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-sm text-slate-500 dark:text-slate-400">Sprint</dt>
                <dd className="text-sm font-medium text-slate-950 dark:text-white">{summary.sprintName}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-sm text-slate-500 dark:text-slate-400">Release date</dt>
                <dd className="text-sm font-medium text-slate-950 dark:text-white">{formatDate(summary.dueDate)}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-sm text-slate-500 dark:text-slate-400">Current throughput</dt>
                <dd className="text-sm font-medium text-slate-950 dark:text-white">
                  {formatNumber(currentTrend?.resolved ?? 0)} resolved
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-sm text-slate-500 dark:text-slate-400">New intake</dt>
                <dd className="text-sm font-medium text-slate-950 dark:text-white">
                  {formatNumber(currentTrend?.created ?? 0)} created
                </dd>
              </div>
            </dl>
          </aside>
        </div>

        <div className="mt-5">
          <h3 className="text-sm font-semibold text-slate-950 dark:text-white">
            Jira risk queue
          </h3>
          <ul className="mt-3 grid gap-3 lg:grid-cols-3">
            {risks.map((issue) => (
                <li
                    className="rounded-md border border-slate-200 p-3 dark:border-slate-800"
                    key={issue.key}
                >
                  <article aria-labelledby={`${issue.key}-title`}>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone={priorityTone[issue.priority]}>{issue.priority}</Badge>
                      <Badge tone={issue.status === "blocked" ? "rose" : "slate"}>
                        {statusCopy[issue.status]}
                      </Badge>
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {issue.key}
                      </span>
                    </div>
                    <h4 className="mt-3 text-sm font-semibold text-slate-950 dark:text-white" id={`${issue.key}-title`}>
                      {issue.title}
                    </h4>
                    <p className="mt-2 text-sm leading-5 text-slate-600 dark:text-slate-300">
                      {issue.managerSignal}
                    </p>
                    <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <dt className="text-slate-500 dark:text-slate-400">Owner</dt>
                        <dd className="mt-1 font-medium text-slate-900 dark:text-white">{issue.owner}</dd>
                      </div>
                      <div>
                        <dt className="text-slate-500 dark:text-slate-400">Age</dt>
                        <dd className="mt-1 font-medium text-slate-900 dark:text-white">
                          {formatNumber(issue.ageDays)} days
                        </dd>
                      </div>
                      <div className="col-span-2">
                        <dt className="text-slate-500 dark:text-slate-400">Impact</dt>
                        <dd className="mt-1 font-medium text-slate-900 dark:text-white">
                          {issue.customerImpact}
                        </dd>
                      </div>
                    </dl>
                  </article>
                </li>
            ))}
          </ul>
        </div>
      </section>
  );
}
