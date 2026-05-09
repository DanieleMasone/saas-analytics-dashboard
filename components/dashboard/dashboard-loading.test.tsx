import {render} from "@testing-library/react";
import {DashboardLoading} from "@/components/dashboard/dashboard-loading";

describe("DashboardLoading", () => {
  it("matches the dashboard skeleton layout", () => {
    const {container} = render(<DashboardLoading/>);

    expect(container.firstChild).toHaveClass("min-h-screen");
    expect(container.querySelectorAll(".animate-pulse")).toHaveLength(17);
  });
});
