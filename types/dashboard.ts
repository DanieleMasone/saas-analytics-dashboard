/** Valid customer lifecycle states used by filters, badges, and mock APIs. */
export const customerStatuses = ["active", "trial", "past_due", "churned"] as const;

/** Supported commercial plans for customer segmentation. */
export const customerPlans = ["starter", "pro", "scale", "enterprise"] as const;

export type CustomerStatus = (typeof customerStatuses)[number];
export type CustomerPlan = (typeof customerPlans)[number];
export type MetricFormat = "currency" | "number" | "percentage";
export type TrendDirection = "up" | "down" | "neutral";
export type JiraIssuePriority = "low" | "medium" | "high" | "critical";
export type JiraIssueStatus = "todo" | "in_progress" | "blocked" | "review" | "done";
export type JiraIssueType = "story" | "bug" | "task" | "risk";

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

/** Jira-like delivery summary that lets managers read execution risk beside SaaS KPIs. */
export type JiraDeliverySummary = {
  sprintName: string;
  releaseName: string;
  dueDate: string;
  plannedPoints: number;
  completedPoints: number;
  completionRate: number;
  scopeChangeRate: number;
  cycleTimeDays: number;
  leadTimeDays: number;
  blockerCount: number;
  escapedBugs: number;
  teamConfidence: number;
};

/** Weekly delivery trend points normally derived from Jira sprint and issue history. */
export type JiraDeliveryTrendPoint = {
  week: string;
  committed: number;
  completed: number;
  created: number;
  resolved: number;
  blockers: number;
};

/** Prioritized Jira-style issue that needs management attention. */
export type JiraRiskIssue = {
  key: string;
  title: string;
  team: string;
  owner: string;
  type: JiraIssueType;
  priority: JiraIssuePriority;
  status: JiraIssueStatus;
  storyPoints: number;
  ageDays: number;
  dueDate: string;
  customerImpact: string;
  managerSignal: string;
};

/** Delivery health response consumed by the Jira KPI panel. */
export type JiraDeliveryResponse = {
  summary: JiraDeliverySummary;
  trends: JiraDeliveryTrendPoint[];
  risks: JiraRiskIssue[];
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
