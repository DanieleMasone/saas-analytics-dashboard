import {
  clampPage,
  cn,
  formatCurrency,
  formatDate,
  formatDelta,
  formatMetricValue,
  formatNumber,
  formatPercent,
} from "@/lib/utils/utils";

describe("dashboard formatting utilities", () => {
  it("formats dashboard values for compact UI surfaces", () => {
    expect(formatCurrency(286400, true)).toBe("$286.4K");
    expect(formatCurrency(1200)).toBe("$1,200");
    expect(formatNumber(1842)).toBe("1.8K");
    expect(formatPercent(0.189)).toBe("18.9%");
    expect(formatPercent(0.87, true)).toBe("87%");
  });

  it("formats metric values according to their declared format", () => {
    expect(formatMetricValue({format: "currency", value: 286400})).toBe("$286.4K");
    expect(formatMetricValue({format: "number", value: 1842})).toBe("1.8K");
    expect(formatMetricValue({format: "percentage", value: 2.7})).toBe("2.7%");
  });

  it("formats deltas, dates, merged classes, and page bounds", () => {
    expect(formatDelta(3.2)).toBe("+3.2%");
    expect(formatDelta(-0.6)).toBe("-0.6%");
    expect(formatDelta(0)).toBe("0.0%");
    expect(formatDate("2026-04-27")).toBe("Apr 27");
    expect(cn("px-2", false, "px-4")).toBe("px-4");
    expect(clampPage(-10, 3)).toBe(1);
    expect(clampPage(99, 3)).toBe(3);
    expect(clampPage(2, 3)).toBe(2);
  });
});
