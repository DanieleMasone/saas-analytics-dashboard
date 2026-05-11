import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {RevenuePageClient} from "@/components/dashboard/revenue-page-client/revenue-page-client";
import {fetchRevenue} from "@/lib/api/api";
import {revenue} from "@/lib/mock-data/mock-data";
import type {RevenuePoint} from "@/types/dashboard";

vi.mock("@/lib/api", () => ({
  fetchRevenue: vi.fn(),
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
        chart:{data.length}:loading:{String(isLoading)}:error:{String(isError)}
        <button onClick={onRetry} type="button">Retry revenue</button>
      </section>
  ),
}));

const fetchRevenueMock = vi.mocked(fetchRevenue);

function renderRevenuePage() {
  const queryClient = new QueryClient({
    defaultOptions: {queries: {gcTime: 0, retry: false}},
  });

  return render(
      <QueryClientProvider client={queryClient}>
        <RevenuePageClient/>
      </QueryClientProvider>,
  );
}

describe("RevenuePageClient", () => {
  it("renders focused revenue cards, chart, and history table", async () => {
    fetchRevenueMock.mockResolvedValue({
      data: revenue,
      updatedAt: "2026-05-09T12:00:00.000Z",
    });

    renderRevenuePage();

    expect(screen.getByRole("main", {name: "Revenue"})).toBeInTheDocument();
    expect(screen.getByTestId("revenue-chart")).toHaveTextContent("loading:true");

    expect(await screen.findByText("$286,400")).toBeInTheDocument();
    expect(screen.getByRole("region", {name: "Revenue summary"})).toBeInTheDocument();
    expect(screen.getByRole("region", {name: "Revenue history"})).toBeInTheDocument();
    expect(screen.getByText("Apr")).toBeInTheDocument();
    expect(screen.getByTestId("revenue-chart")).toHaveTextContent("chart:12");
  });

  it("refreshes and retries revenue data", async () => {
    const user = userEvent.setup();
    fetchRevenueMock.mockResolvedValue({
      data: revenue,
      updatedAt: "2026-05-09T12:00:00.000Z",
    });

    renderRevenuePage();

    await screen.findByText("$286,400");
    await user.click(screen.getByRole("button", {name: "Refresh"}));
    await waitFor(() => expect(fetchRevenueMock).toHaveBeenCalledTimes(2));

    await user.click(screen.getByRole("button", {name: "Retry revenue"}));
    await waitFor(() => expect(fetchRevenueMock).toHaveBeenCalledTimes(3));
  });

  it("keeps the revenue error state recoverable", async () => {
    fetchRevenueMock.mockRejectedValue(new Error("failed"));

    renderRevenuePage();

    await waitFor(() => expect(screen.getByTestId("revenue-chart")).toHaveTextContent("error:true"));
    expect(screen.queryByRole("region", {name: "Revenue history"})).not.toBeInTheDocument();
  });
});

