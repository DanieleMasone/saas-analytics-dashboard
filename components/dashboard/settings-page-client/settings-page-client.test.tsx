import {fireEvent, render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {SettingsPageClient} from "@/components/dashboard/settings-page-client/settings-page-client";

describe("SettingsPageClient", () => {
  it("renders actionable alert settings and data-source status", () => {
    render(<SettingsPageClient/>);

    expect(screen.getByRole("main", {name: "Settings"})).toBeInTheDocument();
    expect(screen.getByRole("region", {name: "Alert subscriptions"})).toBeInTheDocument();
    expect(screen.getByRole("region", {name: "Operating guardrails"})).toBeInTheDocument();
    expect(screen.getByRole("region", {name: "Alert preview"})).toBeInTheDocument();
    expect(screen.getByRole("region", {name: "Data sources"})).toBeInTheDocument();
    expect(screen.getByText("Demo data")).toBeInTheDocument();
    expect(screen.getByText("Escalate delivery when blockers exceed 3.")).toBeInTheDocument();
    expect(screen.getByRole("spinbutton", {name: /Delivery blocker limit/i})).toHaveValue(3);
    expect(screen.getAllByRole("link", {name: "Settings"}).every((link) =>
        link.getAttribute("aria-current") === "page",
    )).toBe(true);
  });

  it("updates local alert subscriptions and guardrail preview state", async () => {
    const user = userEvent.setup();

    render(<SettingsPageClient/>);

    expect(screen.getByText("Enabled signals: 2 of 3.")).toBeInTheDocument();
    await user.click(screen.getByRole("checkbox", {name: /Revenue variance review/i}));
    expect(screen.getByText("Enabled signals: 3 of 3.")).toBeInTheDocument();
    expect(screen.getByText("Flag churn above 2.5% of MRR.")).toBeInTheDocument();

    fireEvent.change(screen.getByRole("spinbutton", {name: /Health risk threshold/i}), {
      target: {value: "72"},
    });

    expect(screen.getByText("Review accounts below 72/100 health.")).toBeInTheDocument();
  });

  it("resets preferences and guardrails to workspace defaults", async () => {
    const user = userEvent.setup();

    render(<SettingsPageClient/>);

    await user.click(screen.getByRole("checkbox", {name: /Revenue variance review/i}));
    fireEvent.change(screen.getByRole("spinbutton", {name: /Delivery blocker limit/i}), {
      target: {value: "5"},
    });
    expect(screen.getByText("Escalate delivery when blockers exceed 5.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", {name: "Reset defaults"}));

    expect(screen.getByText("Enabled signals: 2 of 3.")).toBeInTheDocument();
    expect(screen.getByRole("checkbox", {name: /Revenue variance review/i})).not.toBeChecked();
    expect(screen.getByText("Escalate delivery when blockers exceed 3.")).toBeInTheDocument();
    expect(screen.getByRole("spinbutton", {name: /Delivery blocker limit/i})).toHaveValue(3);
  });
});

