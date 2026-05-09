import {render, screen} from "@testing-library/react";
import {KpiCard} from "@/components/dashboard/kpi-card";
import {metrics} from "@/lib/mock-data";

describe("KpiCard", () => {
  it("renders the metric value, trend delta, and business caption", () => {
    render(<KpiCard metric={metrics[0]}/>);

    expect(screen.getByText("Monthly recurring revenue")).toBeInTheDocument();
    expect(screen.getByText("$286.4K")).toBeInTheDocument();
    expect(screen.getByText("+12.4%")).toBeInTheDocument();
    expect(screen.getByText("Net expansion is outpacing churn by 4.8x.")).toBeInTheDocument();
  });

  it("treats lower churn as a positive outcome", () => {
    render(<KpiCard metric={metrics[2]}/>);

    expect(screen.getByText("Logo churn")).toBeInTheDocument();
    expect(screen.getByText("-0.6%")).toHaveClass("bg-emerald-50");
  });
});
