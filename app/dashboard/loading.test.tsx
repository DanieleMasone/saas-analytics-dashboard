import {render, screen} from "@testing-library/react";
import Loading from "@/app/dashboard/loading";

describe("dashboard loading route", () => {
  it("renders the full route skeleton", () => {
    const {container} = render(<Loading/>);

    expect(screen.getByRole("status", {name: "Loading dashboard"})).toBeInTheDocument();
    expect(container.querySelectorAll(".animate-pulse")).toHaveLength(20);
  });
});
