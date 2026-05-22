import {render, screen, within} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {DeliveryInsights} from "@/components/dashboard/delivery-insights/delivery-insights";
import {jiraDelivery} from "@/lib/mock-data/mock-data";

describe("DeliveryInsights", () => {
  it("renders a named loading state for Jira delivery signals", () => {
    const {container} = render(
        <DeliveryInsights isError={false} isLoading onRetry={vi.fn()}/>,
    );

    expect(screen.getByRole("status", {name: "Loading Jira delivery signals"})).toHaveAttribute(
        "aria-busy",
        "true",
    );
    expect(container.querySelectorAll(".animate-pulse")).toHaveLength(8);
  });

  it("renders Jira-like KPI cards, trend table, and risk queue", () => {
    render(
        <DeliveryInsights
            data={jiraDelivery}
            isError={false}
            isLoading={false}
            onRetry={vi.fn()}
        />,
    );

    expect(screen.getByRole("region", {name: "Jira delivery signals"})).toBeInTheDocument();
    expect(screen.getByText("86%")).toBeInTheDocument();
    expect(screen.getByRole("meter", {name: "Sprint predictability"})).toHaveAttribute(
        "aria-valuenow",
        "86",
    );
    expect(screen.getByRole("meter", {name: "Team confidence"})).toHaveAttribute(
        "aria-valuenow",
        "78",
    );
    expect(screen.getByText("SAD-142")).toBeInTheDocument();
    expect(screen.getByText("Jira weekly delivery trend with committed, completed, created, resolved, and blocker counts.")).toBeInTheDocument();
    expect(within(screen.getByRole("list", {name: "Jira weekly delivery trend"})).getAllByRole("listitem")).toHaveLength(
        jiraDelivery.trends.length,
    );
    expect(screen.getByRole("complementary", {name: "Manager readout"})).toBeInTheDocument();
    expect(within(screen.getByRole("list", {name: "Jira risk queue"})).getAllByRole("listitem")).toHaveLength(3);
  });

  it("keeps a recoverable error state", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    render(
        <DeliveryInsights
            data={undefined}
            isError
            isLoading={false}
            onRetry={onRetry}
        />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("Jira delivery signals failed to load");

    await user.click(screen.getByRole("button", {name: "Retry"}));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
