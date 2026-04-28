/** Valid customer lifecycle states used by filters, badges, and mock APIs. */
export const customerStatuses = ["active", "trial", "past_due", "churned"] as const;

/** Supported commercial plans for customer segmentation. */
export const customerPlans = ["starter", "pro", "scale", "enterprise"] as const;

export type CustomerStatus = (typeof customerStatuses)[number];
export type CustomerPlan = (typeof customerPlans)[number];
export type MetricFormat = "currency" | "number" | "percentage";
export type TrendDirection = "up" | "down" | "neutral";

/** KPI card contract used by the executive dashboard overview. */
export type Metric = {
  id: string;
  label: string;
  value: number;
  format: MetricFormat;
  delta: number;
  trend: TrendDirection;
  caption: string;
};

/** Monthly revenue series consumed by the Recharts composition chart. */
export type RevenuePoint = {
  month: string;
  revenue: number;
  newBusiness: number;
  expansion: number;
  churn: number;
  customers: number;
};

/** Customer account record returned by the paginated mock API. */
export type Customer = {
  id: string;
  company: string;
  owner: string;
  plan: CustomerPlan;
  status: CustomerStatus;
  mrr: number;
  seats: number;
  healthScore: number;
  usage: number;
  region: string;
  signupDate: string;
  lastSeen: string;
};

/** Query parameters accepted by the customer table and API route. */
export type CustomerFilters = {
  query?: string;
  status?: CustomerStatus | "all";
  plan?: CustomerPlan | "all";
  page?: number;
  pageSize?: number;
};

/** Aggregate values derived from the currently filtered customer set. */
export type CustomersSummary = {
  totalMrr: number;
  active: number;
  trial: number;
  atRisk: number;
  averageHealth: number;
};

/** Paginated customer API response. */
export type CustomersResponse = {
  data: Customer[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  summary: CustomersSummary;
};

/** Common response envelope for simple dashboard endpoints. */
export type ApiEnvelope<T> = {
  data: T;
  updatedAt: string;
};

/** Next.js 16 route-level error boundary props. */
export type DashboardErrorProps = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};
