import {render, screen} from "@testing-library/react";
import GuidePage, {metadata} from "@/app/guide/page";

describe("GuidePage", () => {
  it("renders the published product guide with semantic navigation", () => {
    render(<GuidePage/>);

    expect(metadata.title).toBe("User Guide | SaaS Analytics Dashboard");
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("heading", {level: 1, name: "SaaS Analytics Dashboard User Guide"})).toBeInTheDocument();
    expect(screen.getByRole("navigation", {name: "User guide sections"})).toBeInTheDocument();
    expect(screen.getByRole("heading", {level: 2, name: "Delivery"})).toBeInTheDocument();
    expect(screen.getByRole("heading", {level: 2, name: "Accessibility and responsive behavior"})).toBeInTheDocument();
  });

  it("links to the dashboard and the distinct technical documentation surfaces", () => {
    render(<GuidePage/>);

    expect(screen.getAllByRole("link", {name: /dashboard/i})[0]).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", {name: /Developer reference/})).toHaveAttribute("href", "/reference/");
    expect(screen.getByRole("link", {name: /Coverage report/})).toHaveAttribute("href", "/coverage/");
    expect(screen.getByRole("link", {name: /Architecture notes/})).toHaveAttribute(
        "href",
        "https://github.com/DanieleMasone/saas-analytics-dashboard/blob/master/docs/architecture.md",
    );
  });
});
