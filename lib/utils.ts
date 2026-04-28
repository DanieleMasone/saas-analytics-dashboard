import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Metric, MetricFormat } from "@/types/dashboard";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const compactNumber = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const currency = new Intl.NumberFormat("en-US", {
  currency: "USD",
  maximumFractionDigits: 0,
  style: "currency",
});

const compactCurrency = new Intl.NumberFormat("en-US", {
  currency: "USD",
  maximumFractionDigits: 1,
  notation: "compact",
  style: "currency",
});

const percent = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
  style: "percent",
});

const wholePercent = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
  style: "percent",
});

export function formatCurrency(value: number, compact = false) {
  return compact ? compactCurrency.format(value) : currency.format(value);
}

export function formatNumber(value: number) {
  return compactNumber.format(value);
}

export function formatPercent(value: number, whole = false) {
  return (whole ? wholePercent : percent).format(value);
}

export function formatMetricValue(metric: Pick<Metric, "format" | "value">) {
  const formatters: Record<MetricFormat, (value: number) => string> = {
    currency: (value) => formatCurrency(value, value >= 100000),
    number: formatNumber,
    percentage: (value) => formatPercent(value / 100),
  };

  return formatters[metric.format](metric.value);
}

export function formatDelta(value: number) {
  const prefix = value > 0 ? "+" : "";
  return `${prefix}${value.toFixed(1)}%`;
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
  }).format(new Date(value));
}

export function clampPage(page: number, totalPages: number) {
  return Math.min(Math.max(page, 1), Math.max(totalPages, 1));
}
