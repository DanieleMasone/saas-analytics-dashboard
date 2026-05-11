import type {MeterHTMLAttributes} from "react";
import {cn} from "@/lib/utils/utils";

/** Semantic fill colors for bounded score meters. */
export type MeterTone = "amber" | "cyan" | "emerald" | "rose";

/** Props for the shared accessible meter primitive. */
export type MeterBarProps = Omit<MeterHTMLAttributes<HTMLMeterElement>, "children" | "max" | "min" | "value"> & {
  label: string;
  max?: number;
  min?: number;
  tone?: MeterTone;
  value: number;
  valueText?: string;
};

/** Accessible native meter styled through CSS instead of inline width values. */
export function MeterBar({
                           className,
                           label,
                           max = 100,
                           min = 0,
                           tone = "cyan",
                           value,
                           valueText,
                           ...props
                         }: MeterBarProps) {
  const boundedValue = Math.min(Math.max(value, min), max);

  return (
      <meter
          aria-label={label}
          aria-valuemax={max}
          aria-valuemin={min}
          aria-valuenow={boundedValue}
          aria-valuetext={valueText ?? `${boundedValue} of ${max}`}
          className={cn("meter-bar", className)}
          data-tone={tone}
          max={max}
          min={min}
          value={boundedValue}
          {...props}
      />
  );
}

