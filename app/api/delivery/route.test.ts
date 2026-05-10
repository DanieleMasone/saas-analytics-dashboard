import {GET} from "./route";

describe("delivery route handler", () => {
  it("returns Jira-like delivery KPI data inside a timestamped envelope", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-09T12:00:00.000Z"));

    const responsePromise = GET();

    await vi.advanceTimersByTimeAsync(560);
    const response = await responsePromise;
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.updatedAt).toBe("2026-05-09T12:00:00.560Z");
    expect(body.data.summary.sprintName).toBe("Sprint 24.10");
    expect(body.data.risks).toEqual(
        expect.arrayContaining([expect.objectContaining({key: "SAD-142"})]),
    );
  });
});
