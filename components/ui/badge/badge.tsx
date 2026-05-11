import type {HTMLAttributes} from "react";
import {cn} from "@/lib/utils/utils";

/** Semantic tones used by compact status badges. */
export type BadgeTone = "cyan" | "emerald" | "amber" | "rose" | "slate";

const tones: Record<BadgeTone, string> = {
    amber:
        "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/70 dark:bg-amber-950/30 dark:text-amber-200",
    cyan:
        "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-900/70 dark:bg-cyan-950/30 dark:text-cyan-200",
    emerald:
        "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/30 dark:text-emerald-200",
    rose:
        "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/70 dark:bg-rose-950/30 dark:text-rose-200",
    slate:
        "border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200",
};

/** Compact status badge with semantic dashboard tones. */
export function Badge({
                          className,
                          tone = "slate",
                          ...props
                      }: HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
    return (
        <span
            className={cn(
                "inline-flex h-6 items-center rounded-md border px-2 text-xs font-medium",
                tones[tone],
                className,
            )}
            {...props}
        />
    );
}
