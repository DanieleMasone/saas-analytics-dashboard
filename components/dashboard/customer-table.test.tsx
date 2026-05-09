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

  render(<CustomerTable {...props}/>);
  return props;
}

describe("CustomerTable", () => {
  it("renders customer rows with pagination metadata", () => {
    renderCustomerTable();

    expect(screen.getByRole("heading", {name: "Customer accounts"})).toBeInTheDocument();
    expect(screen.getByText("Northstar Labs")).toBeInTheDocument();
    expect(screen.getByText("Marta Rossi - EMEA")).toBeInTheDocument();
    expect(screen.getByText("Showing 8 of 20 customers")).toBeInTheDocument();
    expect(screen.getByRole("button", {name: "Previous page"})).toBeDisabled();
    expect(screen.getByRole("button", {name: "Next page"})).toBeEnabled();
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

  it("shows empty state actions for filtered zero-result sets", async () => {
    const user = userEvent.setup();
    const {onChangeFilters} = renderCustomerTable({
      data: getCustomers({query: "missing account"}),
      filters: {...defaultFilters, query: "missing account"},
    });

    expect(screen.getByText("No customers match these filters")).toBeInTheDocument();

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

    await user.click(screen.getByRole("button", {name: "Retry"}));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
