import {fetchCustomers, fetchDelivery, fetchMetrics, fetchRevenue} from "@/lib/api";

const originalDataMode = process.env.NEXT_PUBLIC_DATA_MODE;

afterEach(() => {
  if (originalDataMode === undefined) {
    delete process.env.NEXT_PUBLIC_DATA_MODE;
  } else {
    process.env.NEXT_PUBLIC_DATA_MODE = originalDataMode;
  }
});

describe("dashboard API client", () => {
  it("fetches metrics and parses successful JSON responses", async () => {
    const payload = {data: [], updatedAt: "2026-05-09T12:00:00.000Z"};
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(payload)));
    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchMetrics()).resolves.toEqual(payload);
    expect(fetchMock).toHaveBeenCalledWith("/api/metrics");
  });

  it("throws a useful error message for failed responses", async () => {
    vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue(new Response("Revenue unavailable", {status: 503})),
    );

    await expect(fetchRevenue()).rejects.toThrow("Revenue unavailable");
  });

  it("fetches Jira-like delivery KPI data", async () => {
    const payload = {
      data: {
        risks: [],
        summary: {completionRate: 86},
        trends: [],
      },
      updatedAt: "2026-05-09T12:00:00.000Z",
    };
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(payload)));
    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchDelivery()).resolves.toEqual(payload);
    expect(fetchMock).toHaveBeenCalledWith("/api/delivery");
  });

  it("serializes only active customer filters", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      data: [],
      page: 2,
      pageSize: 10,
      summary: {active: 0, atRisk: 0, averageHealth: 0, totalMrr: 0, trial: 0},
      total: 0,
      totalPages: 1,
    })));
    vi.stubGlobal("fetch", fetchMock);

    await fetchCustomers({
      page: 2,
      pageSize: 10,
      plan: "enterprise",
      query: "north",
      status: "active",
    });

    const requestUrl = fetchMock.mock.calls[0][0] as string;
    const params = new URL(`http://localhost${requestUrl}`).searchParams;

    expect(params.get("page")).toBe("2");
    expect(params.get("pageSize")).toBe("10");
    expect(params.get("plan")).toBe("enterprise");
    expect(params.get("query")).toBe("north");
    expect(params.get("status")).toBe("active");
  });

  it("uses typed mock data directly for static GitHub Pages builds", async () => {
    const fetchMock = vi.fn();
    process.env.NEXT_PUBLIC_DATA_MODE = "static";
    vi.stubGlobal("fetch", fetchMock);

    const metrics = await fetchMetrics();
    const delivery = await fetchDelivery();
    const customers = await fetchCustomers({query: "northstar"});

    expect(fetchMock).not.toHaveBeenCalled();
    expect(metrics.data[0].id).toBe("mrr");
    expect(delivery.data.summary.sprintName).toBe("Sprint 24.10");
    expect(customers.data[0].company).toBe("Northstar Labs");
  });
});
