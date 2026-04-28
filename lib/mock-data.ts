import type {
  Customer,
  CustomerFilters,
  CustomersResponse,
  Metric,
  RevenuePoint,
} from "@/types/dashboard";

/** Portfolio-ready KPI fixtures returned by `/api/metrics`. */
export const metrics: Metric[] = [
  {
    id: "mrr",
    label: "Monthly recurring revenue",
    value: 286400,
    format: "currency",
    delta: 12.4,
    trend: "up",
    caption: "Net expansion is outpacing churn by 4.8x.",
  },
  {
    id: "active-accounts",
    label: "Active accounts",
    value: 1842,
    format: "number",
    delta: 8.1,
    trend: "up",
    caption: "104 accounts activated in the last 30 days.",
  },
  {
    id: "churn",
    label: "Logo churn",
    value: 2.7,
    format: "percentage",
    delta: -0.6,
    trend: "down",
    caption: "At-risk customers fell after QBR outreach.",
  },
  {
    id: "conversion",
    label: "Trial conversion",
    value: 18.9,
    format: "percentage",
    delta: 3.2,
    trend: "up",
    caption: "Product-qualified trials convert fastest.",
  },
];

/** Monthly revenue fixtures returned by `/api/revenue`. */
export const revenue: RevenuePoint[] = [
  {month: "May", revenue: 181200, newBusiness: 42600, expansion: 16900, churn: -9600, customers: 1294},
  {month: "Jun", revenue: 190800, newBusiness: 44800, expansion: 18400, churn: -8200, customers: 1348},
  {month: "Jul", revenue: 202100, newBusiness: 49100, expansion: 19300, churn: -9100, customers: 1396},
  {month: "Aug", revenue: 216500, newBusiness: 52400, expansion: 20700, churn: -8700, customers: 1467},
  {month: "Sep", revenue: 224300, newBusiness: 49800, expansion: 22600, churn: -10400, customers: 1512},
  {month: "Oct", revenue: 231700, newBusiness: 56300, expansion: 21500, churn: -11900, customers: 1574},
  {month: "Nov", revenue: 246800, newBusiness: 61800, expansion: 24600, churn: -9800, customers: 1638},
  {month: "Dec", revenue: 252400, newBusiness: 58600, expansion: 27100, churn: -12300, customers: 1691},
  {month: "Jan", revenue: 263100, newBusiness: 64200, expansion: 29400, churn: -10800, customers: 1744},
  {month: "Feb", revenue: 270900, newBusiness: 67400, expansion: 31300, churn: -11600, customers: 1788},
  {month: "Mar", revenue: 279300, newBusiness: 69100, expansion: 34600, churn: -12900, customers: 1819},
  {month: "Apr", revenue: 286400, newBusiness: 72100, expansion: 36100, churn: -11800, customers: 1842},
];

/** Customer account fixtures used by the searchable, paginated API route. */
export const customers: Customer[] = [
  {
    id: "cus-1001",
    company: "Northstar Labs",
    owner: "Marta Rossi",
    plan: "enterprise",
    status: "active",
    mrr: 18200,
    seats: 148,
    healthScore: 94,
    usage: 87,
    region: "EMEA",
    signupDate: "2024-03-12",
    lastSeen: "2026-04-27",
  },
  {
    id: "cus-1002",
    company: "Apex Cloudworks",
    owner: "Dario Conti",
    plan: "scale",
    status: "active",
    mrr: 12600,
    seats: 96,
    healthScore: 88,
    usage: 79,
    region: "North America",
    signupDate: "2024-06-03",
    lastSeen: "2026-04-28",
  },
  {
    id: "cus-1003",
    company: "HelioStack",
    owner: "Nina Esposito",
    plan: "pro",
    status: "trial",
    mrr: 2900,
    seats: 22,
    healthScore: 76,
    usage: 66,
    region: "EMEA",
    signupDate: "2026-04-11",
    lastSeen: "2026-04-27",
  },
  {
    id: "cus-1004",
    company: "Mercury Finance",
    owner: "Samir Patel",
    plan: "enterprise",
    status: "past_due",
    mrr: 22400,
    seats: 214,
    healthScore: 52,
    usage: 44,
    region: "North America",
    signupDate: "2023-11-18",
    lastSeen: "2026-04-22",
  },
  {
    id: "cus-1005",
    company: "Evergreen Retail",
    owner: "Giulia Greco",
    plan: "scale",
    status: "active",
    mrr: 9800,
    seats: 74,
    healthScore: 81,
    usage: 73,
    region: "APAC",
    signupDate: "2025-01-29",
    lastSeen: "2026-04-26",
  },
  {
    id: "cus-1006",
    company: "BrightHire",
    owner: "Luca Bianchi",
    plan: "pro",
    status: "active",
    mrr: 4100,
    seats: 31,
    healthScore: 68,
    usage: 58,
    region: "EMEA",
    signupDate: "2025-09-16",
    lastSeen: "2026-04-25",
  },
  {
    id: "cus-1007",
    company: "OrbitOps",
    owner: "Sara Moretti",
    plan: "starter",
    status: "trial",
    mrr: 780,
    seats: 8,
    healthScore: 62,
    usage: 49,
    region: "Latin America",
    signupDate: "2026-04-18",
    lastSeen: "2026-04-27",
  },
  {
    id: "cus-1008",
    company: "Kestrel Systems",
    owner: "Omar Haddad",
    plan: "enterprise",
    status: "active",
    mrr: 19100,
    seats: 176,
    healthScore: 91,
    usage: 84,
    region: "EMEA",
    signupDate: "2023-08-21",
    lastSeen: "2026-04-28",
  },
  {
    id: "cus-1009",
    company: "Bluepeak Media",
    owner: "Elena Ferri",
    plan: "scale",
    status: "past_due",
    mrr: 8700,
    seats: 63,
    healthScore: 46,
    usage: 39,
    region: "North America",
    signupDate: "2024-12-05",
    lastSeen: "2026-04-19",
  },
  {
    id: "cus-1010",
    company: "SignalForge",
    owner: "Marco Rinaldi",
    plan: "pro",
    status: "active",
    mrr: 5200,
    seats: 42,
    healthScore: 74,
    usage: 67,
    region: "APAC",
    signupDate: "2025-05-08",
    lastSeen: "2026-04-26",
  },
  {
    id: "cus-1011",
    company: "Acme Logistics",
    owner: "Priya Shah",
    plan: "starter",
    status: "active",
    mrr: 940,
    seats: 10,
    healthScore: 71,
    usage: 63,
    region: "North America",
    signupDate: "2025-10-13",
    lastSeen: "2026-04-24",
  },
  {
    id: "cus-1012",
    company: "Zenith Health",
    owner: "Claudia Fontana",
    plan: "enterprise",
    status: "active",
    mrr: 24100,
    seats: 238,
    healthScore: 97,
    usage: 91,
    region: "EMEA",
    signupDate: "2023-05-17",
    lastSeen: "2026-04-28",
  },
  {
    id: "cus-1013",
    company: "Pioneer AI",
    owner: "Diego Romano",
    plan: "scale",
    status: "trial",
    mrr: 6200,
    seats: 54,
    healthScore: 83,
    usage: 75,
    region: "North America",
    signupDate: "2026-04-04",
    lastSeen: "2026-04-27",
  },
  {
    id: "cus-1014",
    company: "Atlas Commerce",
    owner: "Francesca Villa",
    plan: "pro",
    status: "churned",
    mrr: 0,
    seats: 28,
    healthScore: 18,
    usage: 8,
    region: "EMEA",
    signupDate: "2024-02-01",
    lastSeen: "2026-03-16",
  },
  {
    id: "cus-1015",
    company: "Riverlane Studio",
    owner: "Andrea Sala",
    plan: "starter",
    status: "active",
    mrr: 680,
    seats: 6,
    healthScore: 64,
    usage: 57,
    region: "APAC",
    signupDate: "2025-12-20",
    lastSeen: "2026-04-23",
  },
  {
    id: "cus-1016",
    company: "Cobalt Security",
    owner: "Laura Costa",
    plan: "enterprise",
    status: "past_due",
    mrr: 16300,
    seats: 132,
    healthScore: 49,
    usage: 42,
    region: "North America",
    signupDate: "2024-09-09",
    lastSeen: "2026-04-20",
  },
  {
    id: "cus-1017",
    company: "Greenbyte Energy",
    owner: "Matteo Galli",
    plan: "scale",
    status: "active",
    mrr: 11100,
    seats: 88,
    healthScore: 85,
    usage: 82,
    region: "EMEA",
    signupDate: "2024-04-24",
    lastSeen: "2026-04-28",
  },
  {
    id: "cus-1018",
    company: "NovaCRM",
    owner: "Sofia Ricci",
    plan: "pro",
    status: "active",
    mrr: 4700,
    seats: 35,
    healthScore: 79,
    usage: 72,
    region: "Latin America",
    signupDate: "2025-03-06",
    lastSeen: "2026-04-26",
  },
  {
    id: "cus-1019",
    company: "Summit Legal",
    owner: "Irene Longo",
    plan: "starter",
    status: "trial",
    mrr: 860,
    seats: 9,
    healthScore: 58,
    usage: 46,
    region: "EMEA",
    signupDate: "2026-04-21",
    lastSeen: "2026-04-26",
  },
  {
    id: "cus-1020",
    company: "Vector Supply",
    owner: "Roberto De Luca",
    plan: "scale",
    status: "active",
    mrr: 10300,
    seats: 81,
    healthScore: 89,
    usage: 86,
    region: "APAC",
    signupDate: "2024-07-30",
    lastSeen: "2026-04-28",
  },
];

const latencyByEndpoint = {
  customers: 650,
  metrics: 420,
  revenue: 520,
};

// Artificial latency keeps loading and refresh states visible during portfolio demos.
/** Delay mock Route Handler responses to exercise loading and refresh states. */
export function simulateLatency(endpoint: keyof typeof latencyByEndpoint) {
  return new Promise((resolve) => {
    setTimeout(resolve, latencyByEndpoint[endpoint]);
  });
}

/** Apply customer search, filters, pagination, and filtered-set summary metrics. */
export function getCustomers(filters: CustomerFilters): CustomersResponse {
  const pageSize = filters.pageSize ?? 8;
  const query = filters.query?.trim().toLowerCase() ?? "";
  const status = filters.status ?? "all";
  const plan = filters.plan ?? "all";

  // Search intentionally spans business fields that operators scan most often.
  const filtered = customers.filter((customer) => {
    const matchesQuery =
        query.length === 0 ||
        [customer.company, customer.owner, customer.region]
            .join(" ")
            .toLowerCase()
            .includes(query);
    const matchesStatus = status === "all" || customer.status === status;
    const matchesPlan = plan === "all" || customer.plan === plan;

    return matchesQuery && matchesStatus && matchesPlan;
  });

  const totalPages = Math.max(Math.ceil(filtered.length / pageSize), 1);
  const page = Math.min(Math.max(filters.page ?? 1, 1), totalPages);
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);
  const mrrCustomers = filtered.filter((customer) => customer.status !== "churned");

  // Summary values are derived from the filtered set so side panels match the table.
  return {
    data,
    page,
    pageSize,
    total: filtered.length,
    totalPages,
    summary: {
      active: filtered.filter((customer) => customer.status === "active").length,
      atRisk: filtered.filter((customer) => customer.status === "past_due").length,
      averageHealth:
          filtered.length === 0
              ? 0
              : Math.round(
                  filtered.reduce((total, customer) => total + customer.healthScore, 0) /
                  filtered.length,
              ),
      totalMrr: mrrCustomers.reduce((total, customer) => total + customer.mrr, 0),
      trial: filtered.filter((customer) => customer.status === "trial").length,
    },
  };
}
