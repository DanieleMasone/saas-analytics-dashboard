import type {
  ApiEnvelope,
  CustomerFilters,
  CustomersResponse,
  JiraDeliveryResponse,
  Metric,
  RevenuePoint,
} from "@/types/dashboard";
import {queryCustomers} from "@/lib/customer-query/customer-query";

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
    const {metrics} = await import("@/lib/mock-data/mock-data");
    return createEnvelope(metrics);
  }

  return fetchJson<ApiEnvelope<Metric[]>>("/api/metrics");
}

/** Fetch monthly revenue points for the composition chart. */
export async function fetchRevenue() {
  if (isStaticDataMode()) {
    const {revenue} = await import("@/lib/mock-data/mock-data");
    return createEnvelope(revenue);
  }

  return fetchJson<ApiEnvelope<RevenuePoint[]>>("/api/revenue");
}

/** Fetch Jira-like delivery KPI signals for manager execution analysis. */
export async function fetchDelivery() {
  if (isStaticDataMode()) {
    const {jiraDelivery} = await import("@/lib/mock-data/mock-data");
    return createEnvelope(jiraDelivery);
  }

  return fetchJson<ApiEnvelope<JiraDeliveryResponse>>("/api/delivery");
}

/** Fetch paginated and filtered customer accounts for the customer table. */
export async function fetchCustomers(filters: CustomerFilters) {
  if (isStaticDataMode()) {
    const {customers} = await import("@/lib/mock-data/mock-data");
    return queryCustomers(customers, filters);
  }

  const response = await fetchJson<CustomersResponse>("/api/customers");
  return queryCustomers(response.data, filters);
}
