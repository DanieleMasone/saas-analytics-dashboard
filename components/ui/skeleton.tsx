import type {HTMLAttributes} from "react";
import {cn} from "@/lib/utils";

/** Reusable skeleton block for route and panel loading states. */
export function Skeleton({
                           "aria-hidden": ariaHidden = true,
                           className,
                           ...props
                         }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            aria-hidden={ariaHidden}
            className={cn(
                "animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800",
                className,
            )}
            {...props}
        />
    );
}
