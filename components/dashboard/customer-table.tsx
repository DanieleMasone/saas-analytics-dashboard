import {
  ChevronLeft,
  ChevronRight,
  FilterX,
  RotateCcw,
  Search,
  SearchX,
} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import {
  cn,
  formatCurrency,
  formatDate,
  formatNumber,
  formatPercent,
} from "@/lib/utils";
import type {
  CustomerFilters,
  CustomerPlan,
  CustomersResponse,
  CustomerStatus,
} from "@/types/dashboard";

/** Props for the customer account table. */
export type CustomerTableProps = {
  filters: Required<Pick<CustomerFilters, "page">> &
      Pick<CustomerFilters, "plan" | "query" | "status">;
  data?: CustomersResponse;
  isError: boolean;
  isFetching: boolean;
  isLoading: boolean;
  onChangeFilters: (filters: Partial<CustomerFilters>) => void;
  onRetry: () => void;
};

const statusCopy: Record<CustomerStatus, string> = {
  active: "Active",
  churned: "Churned",
  past_due: "Past due",
  trial: "Trial",
};

const planCopy: Record<CustomerPlan, string> = {
  enterprise: "Enterprise",
  pro: "Pro",
  scale: "Scale",
  starter: "Starter",
};

const statusTone: Record<CustomerStatus, "amber" | "emerald" | "rose" | "slate"> = {
  active: "emerald",
  churned: "slate",
  past_due: "rose",
  trial: "amber",
};

function HealthBar({value}: { value: number }) {
  return (
      <div className="flex min-w-32 items-center gap-3">
        <div className="h-2 flex-1 rounded-md bg-slate-200 dark:bg-slate-800">
          <div
              className={cn(
                  "h-2 rounded-md",
                  value >= 80 ? "bg-emerald-500" : value >= 60 ? "bg-amber-500" : "bg-rose-500",
              )}
              style={{width: `${value}%`}}
          />
        </div>
        <span className="w-8 text-right text-sm font-medium text-slate-700 dark:text-slate-200">
        {value}
      </span>
      </div>
  );
}

function TableSkeleton() {
  return (
      <div className="space-y-3 p-4">
        {Array.from({length: 8}).map((_, index) => (
            <Skeleton className="h-12 w-full" key={index}/>
        ))}
      </div>
  );
}

/** Searchable, paginated customer table with explicit API states. */
export function CustomerTable({
                                data,
                                filters,
                                isError,
                                isFetching,
                                isLoading,
                                onChangeFilters,
                                onRetry,
                              }: CustomerTableProps) {
  const hasFilters =
      Boolean(filters.query) || filters.status !== "all" || filters.plan !== "all";

  // This component keeps expected API states explicit: error, loading, empty, and data.
  return (
      <section
          className="rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 p-4 dark:border-slate-800">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
                Customer accounts
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Search, segment, and page through customer accounts.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="relative block sm:w-72">
                <span className="sr-only">Search customers</span>
                <Search
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                />
                <input
                    className="h-10 w-full rounded-md border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-950 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    onChange={(event) =>
                        onChangeFilters({page: 1, query: event.currentTarget.value})
                    }
                    placeholder="Search company, owner, region"
                    value={filters.query ?? ""}
                />
              </label>
              <label className="sr-only" htmlFor="status-filter">
                Status
              </label>
              <select
                  className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  id="status-filter"
                  onChange={(event) =>
                      onChangeFilters({
                        page: 1,
                        status: event.currentTarget.value as CustomerStatus | "all",
                      })
                  }
                  value={filters.status}
              >
                <option value="all">All statuses</option>
                <option value="active">Active</option>
                <option value="trial">Trial</option>
                <option value="past_due">Past due</option>
                <option value="churned">Churned</option>
              </select>
              <label className="sr-only" htmlFor="plan-filter">
                Plan
              </label>
              <select
                  className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  id="plan-filter"
                  onChange={(event) =>
                      onChangeFilters({
                        page: 1,
                        plan: event.currentTarget.value as CustomerPlan | "all",
                      })
                  }
                  value={filters.plan}
              >
                <option value="all">All plans</option>
                <option value="starter">Starter</option>
                <option value="pro">Pro</option>
                <option value="scale">Scale</option>
                <option value="enterprise">Enterprise</option>
              </select>
              <Button
                  aria-label="Clear filters"
                  disabled={!hasFilters}
                  onClick={() => onChangeFilters({page: 1, plan: "all", query: "", status: "all"})}
                  title="Clear filters"
                  variant="ghost"
              >
                <FilterX aria-hidden="true" size={16}/>
                Clear
              </Button>
            </div>
          </div>
        </div>

        {isError ? (
            <div className="flex min-h-64 flex-col items-center justify-center p-8 text-center">
              <SearchX className="text-rose-500" size={32}/>
              <h3 className="mt-4 text-base font-semibold text-slate-950 dark:text-white">
                Customers failed to load
              </h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">
                Retry the customer data request without losing your active filters.
              </p>
              <Button className="mt-5" onClick={onRetry} variant="danger">
                <RotateCcw aria-hidden="true" size={16}/>
                Retry
              </Button>
            </div>
        ) : isLoading ? (
            <TableSkeleton/>
        ) : data?.data.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center p-8 text-center">
              <SearchX className="text-slate-400" size={34}/>
              <h3 className="mt-4 text-base font-semibold text-slate-950 dark:text-white">
                No customers match these filters
              </h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">
                Adjust the search term, status, or plan to widen the result set.
              </p>
              <Button
                  className="mt-5"
                  onClick={() => onChangeFilters({page: 1, plan: "all", query: "", status: "all"})}
                  variant="secondary"
              >
                <FilterX aria-hidden="true" size={16}/>
                Clear filters
              </Button>
            </div>
        ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-225 border-collapse text-left">
                  <thead
                      className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 dark:bg-slate-950/60 dark:text-slate-400">
                  <tr>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Plan</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">MRR</th>
                    <th className="px-4 py-3">Health</th>
                    <th className="px-4 py-3">Usage</th>
                    <th className="px-4 py-3">Last seen</th>
                  </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {data?.data.map((customer) => (
                      <tr
                          className={cn(
                              "transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50",
                              isFetching && "opacity-70",
                          )}
                          key={customer.id}
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-cyan-50 text-sm font-semibold text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-200">
                              {customer.company.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-slate-950 dark:text-white">
                                {customer.company}
                              </p>
                              <p className="text-sm text-slate-500 dark:text-slate-400">
                                {customer.owner} - {customer.region}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-700 dark:text-slate-200">
                          {planCopy[customer.plan]}
                        </td>
                        <td className="px-4 py-4">
                          <Badge tone={statusTone[customer.status]}>
                            {statusCopy[customer.status]}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 text-right text-sm font-semibold text-slate-950 dark:text-white">
                          {formatCurrency(customer.mrr)}
                        </td>
                        <td className="px-4 py-4">
                          <HealthBar value={customer.healthScore}/>
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-700 dark:text-slate-200">
                          {formatPercent(customer.usage / 100, true)}
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">
                          {formatDate(customer.lastSeen)}
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
              <div
                  className="flex flex-col gap-3 border-t border-slate-200 p-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Showing {formatNumber(data?.data.length ?? 0)} of {formatNumber(data?.total ?? 0)}{" "}
                  customers
                  {isFetching ? " - refreshing" : ""}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                      aria-label="Previous page"
                      disabled={(data?.page ?? 1) <= 1}
                      onClick={() => onChangeFilters({page: Math.max((data?.page ?? 1) - 1, 1)})}
                      size="icon"
                      title="Previous page"
                      variant="secondary"
                  >
                    <ChevronLeft aria-hidden="true" size={18}/>
                  </Button>
                  <span
                      className="min-w-24 text-center text-sm font-medium text-slate-700 dark:text-slate-200">
                Page {data?.page ?? 1} / {data?.totalPages ?? 1}
              </span>
                  <Button
                      aria-label="Next page"
                      disabled={(data?.page ?? 1) >= (data?.totalPages ?? 1)}
                      onClick={() =>
                          onChangeFilters({
                            page: Math.min((data?.page ?? 1) + 1, data?.totalPages ?? 1),
                          })
                      }
                      size="icon"
                      title="Next page"
                      variant="secondary"
                  >
                    <ChevronRight aria-hidden="true" size={18}/>
                  </Button>
                </div>
              </div>
            </>
        )}
      </section>
  );
}
