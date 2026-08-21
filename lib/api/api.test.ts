import {fetchCustomers, fetchDelivery, fetchMetrics, fetchRevenue} from "@/lib/api/api";
import {customers, getCustomers} from "@/lib/mock-data/mock-data";

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

  it("filters and paginates the customer dataset returned by the API", async () => {
    const payload = getCustomers({page: 1, pageSize: customers.length});
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(payload)));
    vi.stubGlobal("fetch", fetchMock);

    const result = await fetchCustomers({
      page: 2,
      pageSize: 10,
      plan: "enterprise",
      query: "northstar",
      status: "active",
    });

    expect(fetchMock).toHaveBeenCalledWith("/api/customers");
    expect(result.page).toBe(1);
    expect(result.total).toBe(1);
    expect(result.data[0].company).toBe("Northstar Labs");
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
