import {render, screen} from "@testing-library/react";
import CustomersPage from "@/app/customers/page";
import DeliveryPage from "@/app/delivery/page";
import HealthPage from "@/app/health/page";
import RevenuePage from "@/app/revenue/page";
import SettingsPage from "@/app/settings/page";

vi.mock("@/components/dashboard/revenue-page-client", () => ({
  RevenuePageClient: () => <div data-testid="revenue-page-client">Revenue client</div>,
}));

vi.mock("@/components/dashboard/customers-page-client", () => ({
  CustomersPageClient: () => <div data-testid="customers-page-client">Customers client</div>,
}));

vi.mock("@/components/dashboard/delivery-page-client", () => ({
  DeliveryPageClient: () => <div data-testid="delivery-page-client">Delivery client</div>,
}));

vi.mock("@/components/dashboard/health-page-client", () => ({
  HealthPageClient: () => <div data-testid="health-page-client">Health client</div>,
}));

vi.mock("@/components/dashboard/settings-page-client", () => ({
  SettingsPageClient: () => <div data-testid="settings-page-client">Settings client</div>,
}));

describe("focused dashboard pages", () => {
  it("renders each focused route client", () => {
    render(<RevenuePage/>);
    expect(screen.getByTestId("revenue-page-client")).toBeInTheDocument();

    render(<CustomersPage/>);
    expect(screen.getByTestId("customers-page-client")).toBeInTheDocument();

    render(<DeliveryPage/>);
    expect(screen.getByTestId("delivery-page-client")).toBeInTheDocument();

    render(<HealthPage/>);
    expect(screen.getByTestId("health-page-client")).toBeInTheDocument();

    render(<SettingsPage/>);
    expect(screen.getByTestId("settings-page-client")).toBeInTheDocument();
  });
});

