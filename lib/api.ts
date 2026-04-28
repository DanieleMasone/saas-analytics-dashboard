import type {
  ApiEnvelope,
  CustomerFilters,
  CustomersResponse,
  Metric,
  RevenuePoint,
} from "@/types/dashboard";

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function fetchMetrics() {
  return fetchJson<ApiEnvelope<Metric[]>>("/api/metrics");
}

export function fetchRevenue() {
  return fetchJson<ApiEnvelope<RevenuePoint[]>>("/api/revenue");
}

export function fetchCustomers(filters: CustomerFilters) {
  const params = new URLSearchParams();

  if (filters.query) params.set("query", filters.query);
  if (filters.status && filters.status !== "all") params.set("status", filters.status);
  if (filters.plan && filters.plan !== "all") params.set("plan", filters.plan);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.pageSize) params.set("pageSize", String(filters.pageSize));

  return fetchJson<CustomersResponse>(`/api/customers?${params.toString()}`);
}
