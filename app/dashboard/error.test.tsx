import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DashboardError from "@/app/dashboard/error";

describe("DashboardError", () => {
  it("shows the provided error and retries through the Next.js boundary", async () => {
    const retry = vi.fn();
    const user = userEvent.setup();

    render(<DashboardError error={new Error("Query boundary failed")} retry={retry}/>);

    expect(screen.getByRole("heading", {name: "Dashboard unavailable"})).toBeInTheDocument();
    expect(screen.getByRole("alert", {name: "Dashboard unavailable"})).toBeInTheDocument();
    expect(screen.getByText("Query boundary failed")).toBeInTheDocument();

    await user.click(screen.getByRole("button", {name: "Try again"}));
    expect(retry).toHaveBeenCalledTimes(1);
  });

  it("falls back to a generic message when the error is empty", () => {
    render(<DashboardError error={new Error("")} retry={vi.fn()}/>);

    expect(screen.getByText("The dashboard could not be rendered.")).toBeInTheDocument();
  });
});
