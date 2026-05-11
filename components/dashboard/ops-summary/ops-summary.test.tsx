import {render, screen} from "@testing-library/react";
import {OpsSummary} from "@/components/dashboard/ops-summary/ops-summary";
import {getCustomers, revenue} from "@/lib/mock-data/mock-data";

describe("OpsSummary", () => {
  it("renders skeleton cards while dashboard data is loading", () => {
    const {container} = render(<OpsSummary isLoading/>);

    expect(screen.getByRole("status", {name: "Loading operating pulse"})).toHaveAttribute(
        "aria-busy",
        "true",
    );
    expect(container.querySelectorAll(".animate-pulse")).toHaveLength(8);
  });

  it("derives operating values from customer and revenue data", () => {
    render(
        <OpsSummary
            customers={getCustomers({page: 1, pageSize: 8})}
            isLoading={false}
            revenue={revenue}
        />,
    );

    expect(screen.getByRole("complementary", {name: "Operating pulse"})).toBeInTheDocument();
    expect(screen.getByRole("heading", {name: "Operating pulse"})).toBeInTheDocument();
    expect(screen.getAllByRole("term")).toHaveLength(3);
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByText("Filtered MRR")).toBeInTheDocument();
    expect(screen.getByText("+2.5%")).toBeInTheDocument();
    expect(screen.getByText(/accounts need billing follow-up/i)).toBeInTheDocument();
  });
});
