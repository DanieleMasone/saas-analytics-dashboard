import {render} from "@testing-library/react";
import Loading from "@/app/dashboard/loading";

describe("dashboard loading route", () => {
  it("renders the full route skeleton", () => {
    const {container} = render(<Loading/>);

    expect(container.querySelectorAll(".animate-pulse")).toHaveLength(17);
  });
});
