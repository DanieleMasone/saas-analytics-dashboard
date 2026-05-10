import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {DashboardClient} from "@/components/dashboard/dashboard-client";
import {fetchCustomers, fetchMetrics, fetchRevenue} from "@/lib/api";
import {getCustomers, metrics, revenue} from "@/lib/mock-data";
import type {CustomerFilters, CustomersResponse, Metric, RevenuePoint} from "@/types/dashboard";

vi.mock("@/lib/api", () => ({
  fetchCustomers: vi.fn(),
  fetchMetrics: vi.fn(),
  fetchRevenue: vi.fn(),
}));

vi.mock("@/components/dashboard/kpi-card", () => ({
  KpiCard: ({metric}: { metric: Metric }) => (
      <article data-testid="kpi-card">{metric.label}</article>
  ),
}));

vi.mock("@/components/dashboard/revenue-chart", () => ({
  RevenueChart: ({
                   data,
                   isError,
                   isLoading,
                   onRetry,
                 }: {
    data: RevenuePoint[];
    isError: boolean;
    isLoading: boolean;
    onRetry: () => void;
  }) => (
      <section data-testid="revenue-chart">
        revenue:{data.length}:loading:{String(isLoading)}:error:{String(isError)}
        <button onClick={onRetry} type="button">Retry revenue</button>
      </section>
  ),
}));

vi.mock("@/components/dashboard/ops-summary", () => ({
  OpsSummary: ({
                customers,
                isLoading,
                revenue,
              }: {
    customers?: CustomersResponse;
    isLoading: boolean;
    revenue?: RevenuePoint[];
  }) => (
      <aside data-testid="ops-summary">
        ops:{customers?.total ?? 0}:{revenue?.length ?? 0}:loading:{String(isLoading)}
      </aside>
  ),
}));

vi.mock("@/components/dashboard/customer-table", () => ({
  CustomerTable: ({
                   data,
                   filters,
                   isError,
                   isFetching,
                   isLoading,
                   onChangeFilters,
                   onRetry,
                 }: {
    data?: CustomersResponse;
    filters: Required<Pick<CustomerFilters, "page">> &
        Pick<CustomerFilters, "plan" | "query" | "status">;
    isError: boolean;
    isFetching: boolean;
    isLoading: boolean;
    onChangeFilters: (filters: Partial<CustomerFilters>) => void;
    onRetry: () => void;
  }) => (
      <section data-testid="customer-table">
        customers:{data?.total ?? 0}:page:{filters.page}:query:{filters.query}:loading:
        {String(isLoading)}:fetching:{String(isFetching)}:error:{String(isError)}
        <button onClick={() => onChangeFilters({page: 2, query: "north"})} type="button">
          Mock filter
        </button>
        <button onClick={onRetry} type="button">Retry customers</button>
      </section>
  ),
}));

vi.mock("@/components/dashboard/theme-toggle", () => ({
  ThemeToggle: () => <button aria-label="Use dark theme" type="button"/>,
}));

const fetchMetricsMock = vi.mocked(fetchMetrics);
const fetchRevenueMock = vi.mocked(fetchRevenue);
const fetchCustomersMock = vi.mocked(fetchCustomers);

function renderDashboardClient() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 0,
        retry: false,
      },
    },
  });

  return render(
      <QueryClientProvider client={queryClient}>
        <DashboardClient/>
      </QueryClientProvider>,
  );
}

function mockSuccessfulQueries() {
  fetchMetricsMock.mockResolvedValue({
    data: metrics,
    updatedAt: "2026-05-09T12:00:00.000Z",
  });
  fetchRevenueMock.mockResolvedValue({
    data: revenue,
    updatedAt: "2026-05-09T12:00:00.000Z",
  });
  fetchCustomersMock.mockImplementation((filters) => Promise.resolve(getCustomers(filters)));
}

describe("DashboardClient", () => {
  it("renders dashboard loading and populated states", async () => {
    mockSuccessfulQueries();

    renderDashboardClient();

    expect(screen.getByRole("main", {name: "SaaS Analytics Dashboard"})).toBeInTheDocument();
    expect(screen.getByRole("button", {name: "Overview"})).toHaveAttribute(
        "aria-current",
        "page",
    );
    expect(screen.getByRole("region", {name: "Executive metrics"})).toHaveAttribute(
        "aria-busy",
        "true",
    );
    expect(screen.getByRole("heading", {name: "SaaS Analytics Dashboard"})).toBeInTheDocument();
    expect(screen.getByTestId("revenue-chart")).toHaveTextContent("loading:true");
    expect(screen.getByTestId("customer-table")).toHaveTextContent("loading:true");

    expect(await screen.findByText("Monthly recurring revenue")).toBeInTheDocument();
    expect(screen.getAllByTestId("kpi-card")).toHaveLength(4);
    expect(screen.getByTestId("revenue-chart")).toHaveTextContent("revenue:12");
    expect(screen.getByTestId("ops-summary")).toHaveTextContent("ops:20:12");
    expect(screen.getByTestId("customer-table")).toHaveTextContent("customers:20:page:1");
  });

  it("refreshes all dashboard queries from the toolbar", async () => {
    const user = userEvent.setup();
    mockSuccessfulQueries();

    renderDashboardClient();

    await screen.findByText("Monthly recurring revenue");

    await user.click(screen.getByRole("button", {name: "Refresh"}));

    await waitFor(() => expect(fetchMetricsMock).toHaveBeenCalledTimes(2));
    expect(fetchRevenueMock).toHaveBeenCalledTimes(2);
    expect(fetchCustomersMock).toHaveBeenCalledTimes(2);
  });

  it("updates customer filters from the table", async () => {
    const user = userEvent.setup();
    mockSuccessfulQueries();

    renderDashboardClient();

    await screen.findByText("Monthly recurring revenue");
    await user.click(screen.getByRole("button", {name: "Mock filter"}));

    await waitFor(() =>
        expect(fetchCustomersMock).toHaveBeenLastCalledWith({
          page: 2,
          pageSize: 8,
          plan: "all",
          query: "north",
          status: "all",
        }),
    );
    expect(screen.getByTestId("customer-table")).toHaveTextContent("page:2:query:north");
  });

  it("retries panel queries through child recovery callbacks", async () => {
    const user = userEvent.setup();
    mockSuccessfulQueries();

    renderDashboardClient();

    await screen.findByText("Monthly recurring revenue");

    await user.click(screen.getByRole("button", {name: "Retry revenue"}));
    await waitFor(() => expect(fetchRevenueMock).toHaveBeenCalledTimes(2));

    await user.click(screen.getByRole("button", {name: "Retry customers"}));
    await waitFor(() => expect(fetchCustomersMock).toHaveBeenCalledTimes(2));
  });

  it("keeps the dashboard usable when metrics fail", async () => {
    fetchMetricsMock.mockRejectedValue(new Error("Metrics failed"));
    fetchRevenueMock.mockResolvedValue({
      data: revenue,
      updatedAt: "2026-05-09T12:00:00.000Z",
    });
    fetchCustomersMock.mockImplementation((filters) => Promise.resolve(getCustomers(filters)));

    renderDashboardClient();

    expect(await screen.findByRole("alert")).toHaveTextContent(
        "Metrics failed to load. The rest of the dashboard remains usable.",
    );
    expect(screen.getByTestId("revenue-chart")).toHaveTextContent("revenue:12");
    expect(screen.getByTestId("customer-table")).toHaveTextContent("customers:20");
  });
});
