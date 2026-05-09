import {NextRequest} from "next/server";
import {GET} from "./route";

describe("customers route handler", () => {
  it("validates query params before returning paginated customer data", async () => {
    vi.useFakeTimers();

    const responsePromise = GET(
        new NextRequest(
            "http://localhost/api/customers?page=-3&pageSize=99&status=unknown&plan=invalid&query=Northstar",
        ),
    );

    await vi.advanceTimersByTimeAsync(650);
    const response = await responsePromise;
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.page).toBe(1);
    expect(body.pageSize).toBe(20);
    expect(body.total).toBe(1);
    expect(body.data[0].company).toBe("Northstar Labs");
  });
});
