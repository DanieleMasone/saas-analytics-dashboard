import {render, screen} from "@testing-library/react";
import {MeterBar} from "@/components/ui/meter-bar";

describe("MeterBar", () => {
  it("renders an accessible native meter with the selected tone", () => {
    render(<MeterBar label="Customer health" tone="emerald" value={84} valueText="84 out of 100"/>);

    const meter = screen.getByRole("meter", {name: "Customer health"});
    expect(meter).toHaveAttribute("aria-valuenow", "84");
    expect(meter).toHaveAttribute("aria-valuetext", "84 out of 100");
    expect(meter).toHaveAttribute("data-tone", "emerald");
    expect(meter).toHaveClass("meter-bar");
  });

  it("clamps values inside the configured range", () => {
    render(<MeterBar label="Sprint confidence" max={100} min={0} value={140}/>);

    expect(screen.getByRole("meter", {name: "Sprint confidence"})).toHaveAttribute(
        "aria-valuenow",
        "100",
    );
  });
});

