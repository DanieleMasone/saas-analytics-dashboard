import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {render, screen, waitFor, within} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {DashboardClient} from "@/components/dashboard/dashboard-client/dashboard-client";
import {fetchCustomers, fetchDelivery, fetchMetrics, fetchRevenue} from "@/lib/api/api";
import {getCustomers, jiraDelivery, metrics, revenue} from "@/lib/mock-data/mock-data";
import type {
  CustomersResponse,
  Metric,
  RevenuePoint,
} from "@/types/dashboard";

vi.mock("@/lib/api", () => ({
  fetchCustomers: vi.fn(),
  fetchDelivery: vi.fn(),
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

vi.mock("@/components/dashboard/theme-toggle", () => ({
  ThemeToggle: () => <button aria-label="Use dark theme" type="button"/>,
}));

const fetchMetricsMock = vi.mocked(fetchMetrics);
const fetchRevenueMock = vi.mocked(fetchRevenue);
const fetchDeliveryMock = vi.mocked(fetchDelivery);
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
  fetchDeliveryMock.mockResolvedValue({
    data: jiraDelivery,
    updatedAt: "2026-05-09T12:00:00.000Z",
  });
  fetchCustomersMock.mockImplementation((filters) => Promise.resolve(getCustomers(filters)));
}

describe("DashboardClient", () => {
  it("renders a lean overview with navigation and populated focus cards", async () => {
    mockSuccessfulQueries();

    renderDashboardClient();

    expect(screen.getByRole("main", {name: "SaaS Analytics Dashboard"})).toBeInTheDocument();
    expect(screen.getAllByRole("link", {name: "Overview"}).every((link) =>
        link.getAttribute("aria-current") === "page",
    )).toBe(true);
    expect(screen.getByRole("region", {name: "Executive metrics"})).toHaveAttribute(
        "aria-busy",
        "true",
    );
    expect(screen.getByRole("heading", {name: "SaaS Analytics Dashboard"})).toBeInTheDocument();
    expect(screen.getByTestId("revenue-chart")).toHaveTextContent("loading:true");

    expect(await screen.findByText("Monthly recurring revenue")).toBeInTheDocument();
    expect(screen.getAllByTestId("kpi-card")).toHaveLength(4);
    expect(screen.getByTestId("revenue-chart")).toHaveTextContent("revenue:12");
    expect(screen.getByTestId("ops-summary")).toHaveTextContent("ops:20:12");

    const focus = within(screen.getByRole("region", {name: "Management focus"}));
    expect(focus.getByText("$286.4K")).toBeInTheDocument();
    expect(focus.getByText("86%")).toBeInTheDocument();
    expect(focus.getByRole("link", {name: /Customers/i})).toHaveAttribute("href", "/customers");
  });

  it("refreshes all overview queries from the toolbar", async () => {
    const user = userEvent.setup();
    mockSuccessfulQueries();

    renderDashboardClient();

    await screen.findByText("Monthly recurring revenue");

    await user.click(screen.getByRole("button", {name: "Refresh"}));

    await waitFor(() => expect(fetchMetricsMock).toHaveBeenCalledTimes(2));
    expect(fetchRevenueMock).toHaveBeenCalledTimes(2);
    expect(fetchDeliveryMock).toHaveBeenCalledTimes(2);
    expect(fetchCustomersMock).toHaveBeenCalledTimes(2);
  });

  it("keeps child revenue recovery available from the overview", async () => {
    const user = userEvent.setup();
    mockSuccessfulQueries();

    renderDashboardClient();

    await screen.findByText("Monthly recurring revenue");

    await user.click(screen.getByRole("button", {name: "Retry revenue"}));
    await waitFor(() => expect(fetchRevenueMock).toHaveBeenCalledTimes(2));
  });

  it("keeps the overview usable when metrics fail", async () => {
    fetchMetricsMock.mockRejectedValue(new Error("Metrics failed"));
    fetchRevenueMock.mockResolvedValue({
      data: revenue,
      updatedAt: "2026-05-09T12:00:00.000Z",
    });
    fetchDeliveryMock.mockResolvedValue({
      data: jiraDelivery,
      updatedAt: "2026-05-09T12:00:00.000Z",
    });
    fetchCustomersMock.mockImplementation((filters) => Promise.resolve(getCustomers(filters)));

    renderDashboardClient();

    expect(await screen.findByRole("alert")).toHaveTextContent(
        "Metrics failed to load. The rest of the dashboard remains usable.",
    );
    expect(screen.getByTestId("revenue-chart")).toHaveTextContent("revenue:12");
    expect(screen.getByTestId("ops-summary")).toHaveTextContent("ops:20");
    expect(screen.getByRole("region", {name: "Management focus"})).toBeInTheDocument();
  });
});
