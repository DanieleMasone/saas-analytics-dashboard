import type {
  ApiEnvelope,
  CustomerFilters,
  CustomersResponse,
  Metric,
  RevenuePoint,
} from "@/types/dashboard";

// Centralize API error handling so TanStack Query can expose consistent error states.
async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return await response.json() as Promise<T>;
}

/** Fetch KPI metrics for the executive overview cards. */
export function fetchMetrics() {
  return fetchJson<ApiEnvelope<Metric[]>>("/api/metrics");
}

/** Fetch monthly revenue points for the composition chart. */
export function fetchRevenue() {
  return fetchJson<ApiEnvelope<RevenuePoint[]>>("/api/revenue");
}

/** Fetch paginated and filtered customer accounts for the customer table. */
export function fetchCustomers(filters: CustomerFilters) {
  const params = new URLSearchParams();

  // Only send active filters; the route handler treats omitted values as "all".
  if (filters.query) params.set("query", filters.query);
  if (filters.status && filters.status !== "all") params.set("status", filters.status);
  if (filters.plan && filters.plan !== "all") params.set("plan", filters.plan);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.pageSize) params.set("pageSize", String(filters.pageSize));

  return fetchJson<CustomersResponse>(`/api/customers?${params.toString()}`);
}
