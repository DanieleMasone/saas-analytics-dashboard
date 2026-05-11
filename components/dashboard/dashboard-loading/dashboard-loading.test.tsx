import {render, screen} from "@testing-library/react";
import {DashboardLoading} from "@/components/dashboard/dashboard-loading/dashboard-loading";

describe("DashboardLoading", () => {
  it("matches the dashboard skeleton layout", () => {
    const {container} = render(<DashboardLoading/>);

    expect(screen.getByRole("status", {name: "Loading dashboard"})).toHaveAttribute(
        "aria-busy",
        "true",
    );
    expect(container.firstChild).toHaveClass("min-h-screen");
    expect(container.querySelectorAll(".animate-pulse")).toHaveLength(20);
  });
});
