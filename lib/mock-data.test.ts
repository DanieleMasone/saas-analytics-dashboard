import {getCustomers, simulateLatency} from "@/lib/mock-data";

describe("mock dashboard data", () => {
  it("filters customers by search text, status, and plan", () => {
    const response = getCustomers({
      page: 1,
      pageSize: 5,
      plan: "enterprise",
      query: "emea",
      status: "active",
    });

    expect(response.data.length).toBeGreaterThan(0);
    expect(response.data.every((customer) => customer.plan === "enterprise")).toBe(true);
    expect(response.data.every((customer) => customer.status === "active")).toBe(true);
    expect(response.data.every((customer) => customer.region.toLowerCase().includes("emea"))).toBe(true);
  });

  it("clamps pagination and derives summaries from the filtered set", () => {
    const response = getCustomers({
      page: 99,
      pageSize: 3,
      status: "active",
    });

    expect(response.page).toBe(response.totalPages);
    expect(response.data).toHaveLength(response.total % 3 || 3);
    expect(response.summary.active).toBe(response.total);
    expect(response.summary.totalMrr).toBeGreaterThan(0);
  });

  it("returns a stable empty response shape", () => {
    const response = getCustomers({query: "no matching account", page: 4});

    expect(response.data).toEqual([]);
    expect(response.total).toBe(0);
    expect(response.totalPages).toBe(1);
    expect(response.page).toBe(1);
    expect(response.summary.averageHealth).toBe(0);
    expect(response.summary.totalMrr).toBe(0);
  });

  it("keeps artificial latency deterministic for loading-state tests", async () => {
    vi.useFakeTimers();
    const onSettled = vi.fn();

    void simulateLatency("metrics").then(onSettled);

    await vi.advanceTimersByTimeAsync(419);
    expect(onSettled).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1);
    expect(onSettled).toHaveBeenCalledTimes(1);
  });
});
