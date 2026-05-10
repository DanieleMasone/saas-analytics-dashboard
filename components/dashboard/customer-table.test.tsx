import {fireEvent, render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {CustomerTable, type CustomerTableProps} from "@/components/dashboard/customer-table";
import {getCustomers} from "@/lib/mock-data";

const defaultFilters = {
  page: 1,
  plan: "all",
  query: "",
  status: "all",
} as const;

function renderCustomerTable(overrides: Partial<CustomerTableProps> = {}) {
  const props: CustomerTableProps = {
    data: getCustomers({page: 1, pageSize: 8}),
    filters: defaultFilters,
    isError: false,
    isFetching: false,
    isLoading: false,
    onChangeFilters: vi.fn(),
    onRetry: vi.fn(),
    ...overrides,
  };

  const view = render(<CustomerTable {...props}/>);
  return {...props, ...view};
}

describe("CustomerTable", () => {
  it("renders row skeletons while customers are loading", () => {
    const {container} = renderCustomerTable({data: undefined, isLoading: true});

    expect(screen.getByRole("status", {name: "Loading customer accounts"})).toBeInTheDocument();
    expect(screen.getByRole("region", {name: "Customer accounts"})).toHaveAttribute(
        "aria-busy",
        "true",
    );
    expect(container.querySelectorAll(".animate-pulse")).toHaveLength(8);
  });

  it("renders customer rows with pagination metadata", () => {
    renderCustomerTable();

    expect(screen.getByRole("region", {name: "Customer accounts"})).toHaveAttribute(
        "aria-busy",
        "false",
    );
    expect(screen.getByRole("heading", {name: "Customer accounts"})).toBeInTheDocument();
    expect(screen.getByText(/Customer account list with plan/i)).toBeInTheDocument();
    expect(screen.getByText("Northstar Labs")).toBeInTheDocument();
    expect(screen.getByText("Marta Rossi - EMEA")).toBeInTheDocument();
    expect(screen.getAllByRole("meter")).toHaveLength(8);
    expect(screen.getByRole("meter", {name: "Northstar Labs health score"})).toHaveAttribute(
        "aria-valuenow",
        "94",
    );
    expect(screen.getByText("Showing 8 of 20 customers")).toBeInTheDocument();
    expect(screen.getByRole("navigation", {name: "Customer pagination"})).toBeInTheDocument();
    expect(screen.getByRole("button", {name: "Previous page"})).toBeDisabled();
    expect(screen.getByRole("button", {name: "Next page"})).toBeEnabled();
  });

  it("shows refresh state and emits pagination changes", async () => {
    const user = userEvent.setup();
    const {onChangeFilters} = renderCustomerTable({
      data: getCustomers({page: 2, pageSize: 8}),
      filters: {...defaultFilters, page: 2},
      isFetching: true,
    });

    expect(screen.getByText("Showing 8 of 20 customers - refreshing")).toBeInTheDocument();
    expect(screen.getByRole("region", {name: "Customer accounts"})).toHaveAttribute(
        "aria-busy",
        "true",
    );

    await user.click(screen.getByRole("button", {name: "Previous page"}));
    await user.click(screen.getByRole("button", {name: "Next page"}));

    expect(onChangeFilters).toHaveBeenCalledWith({page: 1});
    expect(onChangeFilters).toHaveBeenCalledWith({page: 3});
  });

  it("emits normalized filter changes", () => {
    const {onChangeFilters} = renderCustomerTable();

    fireEvent.change(screen.getByPlaceholderText("Search company, owner, region"), {
      target: {value: "acme"},
    });
    fireEvent.change(screen.getByLabelText("Status"), {target: {value: "trial"}});
    fireEvent.change(screen.getByLabelText("Plan"), {target: {value: "pro"}});

    expect(onChangeFilters).toHaveBeenCalledWith({page: 1, query: "acme"});
    expect(onChangeFilters).toHaveBeenCalledWith({page: 1, status: "trial"});
    expect(onChangeFilters).toHaveBeenCalledWith({page: 1, plan: "pro"});
  });

  it("clears active filters from the toolbar action", async () => {
    const user = userEvent.setup();
    const {onChangeFilters} = renderCustomerTable({
      filters: {...defaultFilters, query: "north"},
    });

    await user.click(screen.getAllByRole("button", {name: "Clear filters"})[0]);

    expect(onChangeFilters).toHaveBeenCalledWith({
      page: 1,
      plan: "all",
      query: "",
      status: "all",
    });
  });

  it("shows empty state actions for filtered zero-result sets", async () => {
    const user = userEvent.setup();
    const {onChangeFilters} = renderCustomerTable({
      data: getCustomers({query: "missing account"}),
      filters: {...defaultFilters, query: "missing account"},
    });

    expect(screen.getByText("No customers match these filters")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("No customers match these filters");

    await user.click(screen.getAllByRole("button", {name: "Clear filters"}).at(-1)!);
    expect(onChangeFilters).toHaveBeenCalledWith({
      page: 1,
      plan: "all",
      query: "",
      status: "all",
    });
  });

  it("keeps retry available when the customer request fails", async () => {
    const user = userEvent.setup();
    const {onRetry} = renderCustomerTable({data: undefined, isError: true});

    expect(screen.getByRole("alert")).toHaveTextContent("Customers failed to load");
    await user.click(screen.getByRole("button", {name: "Retry"}));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
