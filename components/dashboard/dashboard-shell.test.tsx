import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {DashboardShell} from "@/components/dashboard/dashboard-shell";

describe("DashboardShell", () => {
  it("renders shared navigation with the active page marked", () => {
    render(
      <DashboardShell
        activeSection="delivery"
        description="Delivery description"
        eyebrow="Delivery"
        title="Delivery"
      >
        <div>Route content</div>
      </DashboardShell>,
    );

    expect(screen.getByRole("main", {name: "Delivery"})).toBeInTheDocument();
    expect(screen.getByText("Route content")).toBeInTheDocument();
    expect(screen.getAllByRole("link", {name: "Delivery"})).toHaveLength(2);
    expect(screen.getAllByRole("link", {name: "Delivery"}).every((link) =>
      link.getAttribute("aria-current") === "page",
    )).toBe(true);
    expect(screen.getAllByRole("link", {name: "Revenue"})[0]).toHaveAttribute("href", "/revenue");
  });

  it("keeps the refresh action optional", async () => {
    const user = userEvent.setup();
    const onRefresh = vi.fn();

    render(
      <DashboardShell
        activeSection="overview"
        description="Overview description"
        eyebrow="Executive overview"
        onRefresh={onRefresh}
        title="SaaS Analytics Dashboard"
      >
        <div/>
      </DashboardShell>,
    );

    await user.click(screen.getByRole("button", {name: "Refresh"}));

    expect(onRefresh).toHaveBeenCalledTimes(1);
  });
});

