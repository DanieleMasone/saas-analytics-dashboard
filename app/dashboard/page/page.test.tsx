import {render, screen} from "@testing-library/react";
import DashboardPage from "@/app/dashboard/page/page";

vi.mock("@/components/dashboard/dashboard-client", () => ({
  DashboardClient: () => <div data-testid="dashboard-client">Dashboard client shell</div>,
}));

describe("DashboardPage", () => {
  it("renders the dashboard client shell", () => {
    render(<DashboardPage/>);

    expect(screen.getByTestId("dashboard-client")).toHaveTextContent("Dashboard client shell");
  });
});
