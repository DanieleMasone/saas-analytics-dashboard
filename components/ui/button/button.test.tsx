import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {Button} from "@/components/ui/button/button";

describe("Button", () => {
  it("defaults to a non-submit button and forwards click handlers", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={onClick}>Refresh</Button>);

    const button = screen.getByRole("button", {name: "Refresh"});
    expect(button).toHaveAttribute("type", "button");

    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("applies variant and size classes without dropping custom classes", () => {
    render(
        <Button aria-label="Icon action" className="custom-class" size="icon" variant="primary"/>,
    );

    const button = screen.getByRole("button", {name: "Icon action"});
    expect(button).toHaveClass("h-10", "w-10", "bg-cyan-700", "custom-class");
  });
});
