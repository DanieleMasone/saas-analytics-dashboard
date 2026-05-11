import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {DashboardShell} from "@/components/dashboard/dashboard-shell/dashboard-shell";

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
    expect(screen.getAllByRole("link", {name: "Delivery"})).toHaveLength(1);
    expect(screen.getAllByRole("link", {name: "Delivery"}).every((link) =>
        link.getAttribute("aria-current") === "page",
    )).toBe(true);
    expect(screen.getAllByRole("link", {name: "Revenue"})[0]).toHaveAttribute("href", "/revenue");
  });

  it("expands the mobile navigation menu from the header", async () => {
    const user = userEvent.setup();

    render(
        <DashboardShell
            activeSection="overview"
            description="Overview description"
            eyebrow="Executive overview"
            title="SaaS Analytics Dashboard"
        >
          <div/>
        </DashboardShell>,
    );

    const menuButton = screen.getByRole("button", {name: "Menu"});
    expect(menuButton).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("navigation", {name: "Mobile dashboard navigation"})).not.toBeInTheDocument();

    await user.click(menuButton);

    expect(menuButton).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("navigation", {name: "Mobile dashboard navigation"})).toBeInTheDocument();
    expect(screen.getAllByRole("link", {name: "Revenue"})).toHaveLength(2);
  });

  it("opens a notifications panel from the bell action", async () => {
    const user = userEvent.setup();

    render(
        <DashboardShell
            activeSection="overview"
            description="Overview description"
            eyebrow="Executive overview"
            title="SaaS Analytics Dashboard"
        >
          <div/>
        </DashboardShell>,
    );

    const notificationButton = screen.getByRole("button", {name: "Notifications"});
    expect(notificationButton).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("region", {name: "Notifications panel"})).not.toBeInTheDocument();

    await user.click(notificationButton);

    expect(notificationButton).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("region", {name: "Notifications panel"})).toHaveTextContent("Delivery risk");
    expect(screen.getByText("3 active")).toBeInTheDocument();
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
