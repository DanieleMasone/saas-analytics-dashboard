/** Valid customer lifecycle states used by filters, badges, and mock APIs. */
export const customerStatuses = ["active", "trial", "past_due", "churned"] as const;

/** Supported commercial plans for customer segmentation. */
export const customerPlans = ["starter", "pro", "scale", "enterprise"] as const;

/** Union derived from the supported customer lifecycle states. */
export type CustomerStatus = (typeof customerStatuses)[number];

/** Union derived from the supported commercial plan names. */
export type CustomerPlan = (typeof customerPlans)[number];

/** Presentation formats supported by KPI cards. */
export type MetricFormat = "currency" | "number" | "percentage";

/** Direction values used to render KPI trend movement. */
export type TrendDirection = "up" | "down" | "neutral";

/** Jira-style priority levels used by delivery risk cards. */
export type JiraIssuePriority = "low" | "medium" | "high" | "critical";

/** Jira-style workflow statuses used by delivery risk cards. */
export type JiraIssueStatus = "todo" | "in_progress" | "blocked" | "review" | "done";

/** Jira-style issue categories used by the delivery sample data. */
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

/** Next.js route-level error boundary props. */
export type DashboardErrorProps = {
  error: Error & { digest?: string };
  retry: () => void;
};
