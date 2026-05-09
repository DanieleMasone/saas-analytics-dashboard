import {render, screen} from "@testing-library/react";
import {Badge} from "@/components/ui/badge";

describe("Badge", () => {
  it("renders compact status text with the selected semantic tone", () => {
    render(<Badge tone="emerald">Active</Badge>);

    const badge = screen.getByText("Active");
    expect(badge).toHaveClass("border-emerald-200", "text-emerald-700");
  });
});
