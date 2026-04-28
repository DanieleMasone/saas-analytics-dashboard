export const customerStatuses = ["active", "trial", "past_due", "churned"] as const;
export const customerPlans = ["starter", "pro", "scale", "enterprise"] as const;

export type CustomerStatus = (typeof customerStatuses)[number];
export type CustomerPlan = (typeof customerPlans)[number];
export type MetricFormat = "currency" | "number" | "percentage";
export type TrendDirection = "up" | "down" | "neutral";

export type Metric = {
  id: string;
  label: string;
  value: number;
  format: MetricFormat;
  delta: number;
  trend: TrendDirection;
  caption: string;
};

export type RevenuePoint = {
  month: string;
  revenue: number;
  newBusiness: number;
  expansion: number;
  churn: number;
  customers: number;
};

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

export type CustomerFilters = {
  query?: string;
  status?: CustomerStatus | "all";
  plan?: CustomerPlan | "all";
  page?: number;
  pageSize?: number;
};

export type CustomersSummary = {
  totalMrr: number;
  active: number;
  trial: number;
  atRisk: number;
  averageHealth: number;
};

export type CustomersResponse = {
  data: Customer[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  summary: CustomersSummary;
};

export type ApiEnvelope<T> = {
  data: T;
  updatedAt: string;
};

export type DashboardErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};
