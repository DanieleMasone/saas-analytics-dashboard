import {render, screen} from "@testing-library/react";
import {OpsSummary} from "@/components/dashboard/ops-summary";
import {getCustomers, revenue} from "@/lib/mock-data";

describe("OpsSummary", () => {
  it("derives operating values from customer and revenue data", () => {
    render(
        <OpsSummary
            customers={getCustomers({page: 1, pageSize: 8})}
            isLoading={false}
            revenue={revenue}
        />,
    );

    expect(screen.getByRole("heading", {name: "Operating pulse"})).toBeInTheDocument();
    expect(screen.getByText("Filtered MRR")).toBeInTheDocument();
    expect(screen.getByText("+2.5%")).toBeInTheDocument();
    expect(screen.getByText(/accounts need billing follow-up/i)).toBeInTheDocument();
  });
});
