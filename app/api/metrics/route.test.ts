import {GET} from "./route";

describe("metrics route handler", () => {
  it("returns KPI metrics inside a timestamped envelope", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-09T12:00:00.000Z"));

    const responsePromise = GET();

    await vi.advanceTimersByTimeAsync(420);
    const response = await responsePromise;
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.updatedAt).toBe("2026-05-09T12:00:00.420Z");
    expect(body.data).toEqual(
        expect.arrayContaining([expect.objectContaining({id: "mrr"})]),
    );
  });
});
