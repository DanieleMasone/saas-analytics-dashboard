import {customers} from "@/lib/mock-data/mock-data";
import {GET} from "./route";

afterEach(() => {
  vi.useRealTimers();
});

describe("customers route handler", () => {
  it("returns the complete customer dataset for client-side querying", async () => {
    vi.useFakeTimers();

    const responsePromise = GET();

    await vi.advanceTimersByTimeAsync(650);
    const response = await responsePromise;
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.page).toBe(1);
    expect(body.pageSize).toBe(customers.length);
    expect(body.total).toBe(customers.length);
    expect(body.data).toHaveLength(customers.length);
    expect(body.data[0].company).toBe("Northstar Labs");
  });
});
