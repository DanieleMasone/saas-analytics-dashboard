import {render, screen} from "@testing-library/react";
import {Skeleton} from "@/components/ui/skeleton/skeleton";

describe("Skeleton", () => {
  it("stays hidden from assistive technology by default", () => {
    render(<Skeleton data-testid="skeleton"/>);

    expect(screen.getByTestId("skeleton")).toHaveAttribute("aria-hidden", "true");
  });

  it("allows callers to expose a custom skeleton when needed", () => {
    render(<Skeleton aria-hidden={false} data-testid="skeleton"/>);

    expect(screen.getByTestId("skeleton")).toHaveAttribute("aria-hidden", "false");
  });
});
