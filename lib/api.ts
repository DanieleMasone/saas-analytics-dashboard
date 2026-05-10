import type {
  ApiEnvelope,
  CustomerFilters,
  CustomersResponse,
  JiraDeliveryResponse,
  Metric,
  RevenuePoint,
} from "@/types/dashboard";

const isStaticDataMode = () => process.env.NEXT_PUBLIC_DATA_MODE === "static";

function createEnvelope<T>(data: T): ApiEnvelope<T> {
  return {
    data,
    updatedAt: new Date().toISOString(),
  };
}

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
export async function fetchMetrics() {
  if (isStaticDataMode()) {
    const {metrics} = await import("@/lib/mock-data");
    return createEnvelope(metrics);
  }

  return fetchJson<ApiEnvelope<Metric[]>>("/api/metrics");
}

/** Fetch monthly revenue points for the composition chart. */
export async function fetchRevenue() {
  if (isStaticDataMode()) {
    const {revenue} = await import("@/lib/mock-data");
    return createEnvelope(revenue);
  }

  return fetchJson<ApiEnvelope<RevenuePoint[]>>("/api/revenue");
}

/** Fetch Jira-like delivery KPI signals for manager execution analysis. */
export async function fetchDelivery() {
  if (isStaticDataMode()) {
    const {jiraDelivery} = await import("@/lib/mock-data");
    return createEnvelope(jiraDelivery);
  }

  return fetchJson<ApiEnvelope<JiraDeliveryResponse>>("/api/delivery");
}

/** Fetch paginated and filtered customer accounts for the customer table. */
export async function fetchCustomers(filters: CustomerFilters) {
  if (isStaticDataMode()) {
    const {getCustomers} = await import("@/lib/mock-data");
    return getCustomers(filters);
  }

  const params = new URLSearchParams();

  // Only send active filters; the route handler treats omitted values as "all".
  if (filters.query) params.set("query", filters.query);
  if (filters.status && filters.status !== "all") params.set("status", filters.status);
  if (filters.plan && filters.plan !== "all") params.set("plan", filters.plan);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.pageSize) params.set("pageSize", String(filters.pageSize));

  return fetchJson<CustomersResponse>(`/api/customers?${params.toString()}`);
}
