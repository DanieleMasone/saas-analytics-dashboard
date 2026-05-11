import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {HealthPageClient} from "@/components/dashboard/health-page-client/health-page-client";
import {fetchCustomers} from "@/lib/api/api";
import {getCustomers} from "@/lib/mock-data/mock-data";

vi.mock("@/lib/api/api", () => ({
  fetchCustomers: vi.fn(),
}));

const fetchCustomersMock = vi.mocked(fetchCustomers);

function renderHealthPage() {
  const queryClient = new QueryClient({
    defaultOptions: {queries: {gcTime: 0, retry: false}},
  });

  return render(
      <QueryClientProvider client={queryClient}>
        <HealthPageClient/>
      </QueryClientProvider>,
  );
}

describe("HealthPageClient", () => {
  it("renders health summary, distribution, and risk queue", async () => {
    fetchCustomersMock.mockImplementation((filters) => Promise.resolve(getCustomers(filters)));

    renderHealthPage();

    expect(screen.getByRole("main", {name: "Health"})).toBeInTheDocument();

    expect(await screen.findByText("Health score")).toBeInTheDocument();
    expect(screen.getByRole("region", {name: "Health summary"})).toBeInTheDocument();
    expect(screen.getByRole("region", {name: "Health distribution"})).toBeInTheDocument();
    expect(screen.getByRole("region", {name: "Risk queue"})).toBeInTheDocument();
    expect(screen.getByRole("meter", {name: "Risk account distribution"})).toBeInTheDocument();
    expect(screen.getByText("Atlas Commerce")).toBeInTheDocument();
  });

  it("keeps customer health errors recoverable", async () => {
    const user = userEvent.setup();
    fetchCustomersMock.mockRejectedValue(new Error("failed"));

    renderHealthPage();

    expect(await screen.findByRole("alert")).toHaveTextContent("Customer health failed to load");
    await user.click(screen.getByRole("button", {name: "Retry"}));
    await waitFor(() => expect(fetchCustomersMock).toHaveBeenCalledTimes(2));
  });
});

