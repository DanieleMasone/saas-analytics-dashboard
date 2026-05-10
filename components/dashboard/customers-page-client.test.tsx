import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {CustomersPageClient} from "@/components/dashboard/customers-page-client";
import {fetchCustomers} from "@/lib/api";
import {getCustomers} from "@/lib/mock-data";
import type {CustomerFilters, CustomersResponse} from "@/types/dashboard";

vi.mock("@/lib/api", () => ({
  fetchCustomers: vi.fn(),
}));

vi.mock("@/components/dashboard/customer-table", () => ({
  CustomerTable: ({
    data,
    filters,
    isFetching,
    isLoading,
    onChangeFilters,
    onRetry,
  }: {
    data?: CustomersResponse;
    filters: Required<Pick<CustomerFilters, "page">> &
      Pick<CustomerFilters, "plan" | "query" | "status">;
    isFetching: boolean;
    isLoading: boolean;
    onChangeFilters: (filters: Partial<CustomerFilters>) => void;
    onRetry: () => void;
  }) => (
    <section data-testid="customer-table">
      customers:{data?.total ?? 0}:page:{filters.page}:query:{filters.query}:loading:
      {String(isLoading)}:fetching:{String(isFetching)}
      <button onClick={() => onChangeFilters({page: 2, query: "north"})} type="button">
        Mock filter
      </button>
      <button onClick={onRetry} type="button">Retry customers</button>
    </section>
  ),
}));

const fetchCustomersMock = vi.mocked(fetchCustomers);

function renderCustomersPage() {
  const queryClient = new QueryClient({
    defaultOptions: {queries: {gcTime: 0, retry: false}},
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <CustomersPageClient/>
    </QueryClientProvider>,
  );
}

describe("CustomersPageClient", () => {
  it("renders customer summary and table state", async () => {
    fetchCustomersMock.mockImplementation((filters) => Promise.resolve(getCustomers(filters)));

    renderCustomersPage();

    expect(screen.getByRole("main", {name: "Customers"})).toBeInTheDocument();
    expect(screen.getByTestId("customer-table")).toHaveTextContent("loading:true");

    expect(await screen.findByText("Total customers")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByRole("region", {name: "Customer summary"})).toBeInTheDocument();
    expect(screen.getByTestId("customer-table")).toHaveTextContent("customers:20:page:1");
  });

  it("updates filters and retries customer data", async () => {
    const user = userEvent.setup();
    fetchCustomersMock.mockImplementation((filters) => Promise.resolve(getCustomers(filters)));

    renderCustomersPage();

    await screen.findByText("Total customers");
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

    await user.click(screen.getByRole("button", {name: "Retry customers"}));
    await waitFor(() => expect(fetchCustomersMock).toHaveBeenCalledTimes(3));
  });
});

