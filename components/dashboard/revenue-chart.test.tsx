import type {ReactNode} from "react";
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {RevenueChart} from "@/components/dashboard/revenue-chart";
import {revenue} from "@/lib/mock-data";

vi.mock("recharts", () => {
  const Passthrough = ({children}: { children?: ReactNode }) => <div>{children}</div>;
  const Marker = ({name}: { name?: string }) => <div data-testid="chart-marker">{name}</div>;

  return {
    Area: Marker,
    Bar: Marker,
    CartesianGrid: Marker,
    ComposedChart: Passthrough,
    Legend: Marker,
    ResponsiveContainer: Passthrough,
    Tooltip: Marker,
    XAxis: Marker,
    YAxis: Marker,
  };
});

describe("RevenueChart", () => {
  it("renders the populated chart state with current MRR", () => {
    render(<RevenueChart data={revenue} isError={false} isLoading={false} onRetry={vi.fn()}/>);

    expect(screen.getByRole("heading", {name: "Revenue composition"})).toBeInTheDocument();
    expect(screen.getByText("$286,400")).toBeInTheDocument();
    expect(screen.getByText("New business")).toBeInTheDocument();
    expect(screen.getByText("Expansion")).toBeInTheDocument();
    expect(screen.getByText("MRR")).toBeInTheDocument();
  });

  it("renders a recoverable error state", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    render(<RevenueChart data={[]} isError isLoading={false} onRetry={onRetry}/>);

    await user.click(screen.getByRole("button", {name: "Retry"}));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
