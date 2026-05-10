/** Shared panel and text class recipes used across dashboard UI surfaces. */
export const uiStyles = {
  bodyText: "text-sm leading-6 text-slate-600 dark:text-slate-300",
  dangerSurface:
    "rounded-lg border border-rose-200 bg-white shadow-sm dark:border-rose-900/70 dark:bg-slate-900",
  field:
    "h-10 rounded-md border border-slate-300 bg-white text-sm text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white",
  iconFrame:
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200",
  insetSurface: "rounded-md border border-slate-200 dark:border-slate-800",
  sectionHeading: "text-lg font-semibold text-slate-950 dark:text-white",
  strongText: "font-medium text-slate-950 dark:text-white",
  subtleText: "text-sm text-slate-500 dark:text-slate-400",
  surface:
    "rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900",
} as const;

