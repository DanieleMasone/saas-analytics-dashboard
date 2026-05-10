import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {SettingsPageClient} from "@/components/dashboard/settings-page-client";

describe("SettingsPageClient", () => {
  it("renders workspace preferences and data-source status", () => {
    render(<SettingsPageClient/>);

    expect(screen.getByRole("main", {name: "Settings"})).toBeInTheDocument();
    expect(screen.getByRole("region", {name: "Workspace preferences"})).toBeInTheDocument();
    expect(screen.getByRole("region", {name: "Data sources"})).toBeInTheDocument();
    expect(screen.getByText("Mock API")).toBeInTheDocument();
    expect(screen.getAllByRole("link", {name: "Settings"}).every((link) =>
      link.getAttribute("aria-current") === "page",
    )).toBe(true);
  });

  it("updates local notification preference state", async () => {
    const user = userEvent.setup();

    render(<SettingsPageClient/>);

    expect(screen.getByText("Enabled signals: 2 of 3.")).toBeInTheDocument();
    await user.click(screen.getByRole("checkbox", {name: /Revenue variance review/i}));
    expect(screen.getByText("Enabled signals: 3 of 3.")).toBeInTheDocument();
  });
});

