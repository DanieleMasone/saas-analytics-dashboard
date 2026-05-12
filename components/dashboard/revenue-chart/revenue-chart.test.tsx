import {cloneElement, isValidElement, type ReactElement, type ReactNode} from "react";
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {RevenueChart} from "@/components/dashboard/revenue-chart/revenue-chart";
import {revenue} from "@/lib/mock-data/mock-data";

vi.mock("recharts", () => {
  const Passthrough = ({children}: { children?: ReactNode }) => <div>{children}</div>;
  const MockResponsiveContainer = ({
                                     children,
                                     height,
                                     minWidth,
                                     width,
                                   }: {
    children?: ReactNode;
    height?: number | string;
    minWidth?: number;
    width?: number | string;
  }) => (
      <div data-height={height} data-min-width={minWidth} data-testid="responsive-container" data-width={width}>
        {children}
      </div>
  );
  const Marker = ({name}: { name?: string }) => <div data-testid="chart-marker">{name}</div>;
  const AxisMarker = ({tickFormatter}: { tickFormatter?: (value: number) => string }) => (
      <div data-testid="axis-marker">{tickFormatter?.(286400)}</div>
  );
  const MockTooltip = ({content}: { content?: ReactNode }) => (
      <div data-testid="chart-tooltip">
        {isValidElement(content)
            ? cloneElement(content as ReactElement<Record<string, unknown>>, {
              active: true,
              label: "Apr",
              payload: [{color: "#0891b2", name: "MRR", value: 286400}],
            })
            : null}
      </div>
  );

  return {
    Area: Marker,
    Bar: Marker,
    CartesianGrid: Marker,
    ComposedChart: Passthrough,
    Legend: Marker,
    ResponsiveContainer: MockResponsiveContainer,
    Tooltip: MockTooltip,
    XAxis: Marker,
    YAxis: AxisMarker,
  };
});

describe("RevenueChart", () => {
  it("renders loading skeletons while revenue data is pending", () => {
    const {container} = render(
        <RevenueChart data={[]} isError={false} isLoading onRetry={vi.fn()}/>,
    );

    expect(screen.getByRole("status", {name: "Loading revenue composition"})).toHaveAttribute(
        "aria-busy",
        "true",
    );
    expect(container.querySelectorAll(".animate-pulse")).toHaveLength(3);
  });

  it("renders the populated chart state with current MRR", () => {
    render(<RevenueChart data={revenue} isError={false} isLoading={false} onRetry={vi.fn()}/>);

    expect(screen.getByRole("region", {name: "Revenue composition"})).toBeInTheDocument();
    expect(screen.getByRole("heading", {name: "Revenue composition"})).toBeInTheDocument();
    expect(screen.getByRole("img", {name: "Revenue composition chart"})).toHaveAccessibleDescription(
        "Revenue composition across 12 months. Current MRR is $286,400.",
    );
    expect(screen.getByText("$286,400")).toBeInTheDocument();
    expect(screen.getByText("New business")).toBeInTheDocument();
    expect(screen.getByText("Expansion")).toBeInTheDocument();
    expect(screen.getAllByText("MRR")).toHaveLength(2);
    expect(screen.getByText("286.4K")).toBeInTheDocument();
    expect(screen.getByText("Apr")).toBeInTheDocument();
    expect(screen.getByText("$286.4K")).toBeInTheDocument();
    expect(screen.getByTestId("responsive-container")).toHaveAttribute("data-height", "320");
    expect(screen.getByTestId("responsive-container")).toHaveAttribute("data-min-width", "0");
    expect(screen.getByTestId("responsive-container")).toHaveAttribute("data-width", "100%");
  });

  it("renders a recoverable error state", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    render(<RevenueChart data={[]} isError isLoading={false} onRetry={onRetry}/>);

    expect(screen.getByRole("alert")).toHaveTextContent("Revenue data failed to load");
    await user.click(screen.getByRole("button", {name: "Retry"}));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
