import {render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {renderToString} from "react-dom/server";
import {ThemeToggle} from "@/components/dashboard/theme-toggle";

describe("ThemeToggle", () => {
  it("renders the same deterministic control before browser preferences are read", () => {
    expect(renderToString(<ThemeToggle/>)).toContain("Use dark theme");
  });

  it("persists theme changes and updates the root class", async () => {
    const user = userEvent.setup();

    render(<ThemeToggle/>);

    const button = screen.getByRole("button", {name: "Use dark theme"});
    expect(window.localStorage.getItem("dashboard-theme")).toBeNull();

    await user.click(button);

    expect(document.documentElement).toHaveClass("dark");
    expect(window.localStorage.getItem("dashboard-theme")).toBe("dark");
    expect(button).toHaveAccessibleName("Use light theme");
  });

  it("honors a stored dark preference on first render", async () => {
    window.localStorage.setItem("dashboard-theme", "dark");

    render(<ThemeToggle/>);

    await waitFor(() => expect(document.documentElement).toHaveClass("dark"));
    expect(screen.getByRole("button", {name: "Use light theme"})).toBeInTheDocument();
  });
});
