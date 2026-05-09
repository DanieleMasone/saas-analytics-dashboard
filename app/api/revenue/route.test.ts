import {GET} from "./route";

describe("revenue route handler", () => {
  it("returns chart-ready revenue points", async () => {
    vi.useFakeTimers();

    const responsePromise = GET();

    await vi.advanceTimersByTimeAsync(520);
    const response = await responsePromise;
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data).toHaveLength(12);
    expect(body.data.at(-1)).toMatchObject({month: "Apr", revenue: 286400});
  });
});
