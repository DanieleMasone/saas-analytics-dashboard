import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {DeliveryPageClient} from "@/components/dashboard/delivery-page-client/delivery-page-client";
import {fetchDelivery} from "@/lib/api/api";
import {jiraDelivery} from "@/lib/mock-data/mock-data";
import type {JiraDeliveryResponse} from "@/types/dashboard";

vi.mock("@/lib/api/api", () => ({
  fetchDelivery: vi.fn(),
}));

vi.mock("@/components/dashboard/delivery-insights/delivery-insights", () => ({
  DeliveryInsights: ({
                       data,
                       isError,
                       isLoading,
                       onRetry,
                     }: {
    data?: JiraDeliveryResponse;
    isError: boolean;
    isLoading: boolean;
    onRetry: () => void;
  }) => (
      <section data-testid="delivery-insights">
        delivery:{data?.summary.sprintName ?? "none"}:loading:{String(isLoading)}:error:
        {String(isError)}
        <button onClick={onRetry} type="button">Retry delivery</button>
      </section>
  ),
}));

const fetchDeliveryMock = vi.mocked(fetchDelivery);

function renderDeliveryPage() {
  const queryClient = new QueryClient({
    defaultOptions: {queries: {gcTime: 0, retry: false}},
  });

  return render(
      <QueryClientProvider client={queryClient}>
        <DeliveryPageClient/>
      </QueryClientProvider>,
  );
}

describe("DeliveryPageClient", () => {
  it("renders the focused delivery view", async () => {
    fetchDeliveryMock.mockResolvedValue({
      data: jiraDelivery,
      updatedAt: "2026-05-09T12:00:00.000Z",
    });

    renderDeliveryPage();

    expect(screen.getByRole("main", {name: "Delivery"})).toBeInTheDocument();
    expect(screen.getByTestId("delivery-insights")).toHaveTextContent("loading:true");

    await waitFor(() =>
        expect(screen.getByTestId("delivery-insights")).toHaveTextContent("delivery:Sprint 24.10"),
    );
  });

  it("refreshes and retries delivery data", async () => {
    const user = userEvent.setup();
    fetchDeliveryMock.mockResolvedValue({
      data: jiraDelivery,
      updatedAt: "2026-05-09T12:00:00.000Z",
    });

    renderDeliveryPage();

    await waitFor(() =>
        expect(screen.getByTestId("delivery-insights")).toHaveTextContent("delivery:Sprint 24.10"),
    );
    await user.click(screen.getByRole("button", {name: "Refresh"}));
    await waitFor(() => expect(fetchDeliveryMock).toHaveBeenCalledTimes(2));

    await user.click(screen.getByRole("button", {name: "Retry delivery"}));
    await waitFor(() => expect(fetchDeliveryMock).toHaveBeenCalledTimes(3));
  });
});

