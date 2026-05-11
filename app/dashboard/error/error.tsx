"use client";

import {AlertTriangle, RotateCcw} from "lucide-react";
import {Button} from "@/components/ui/button/button";
import {uiStyles} from "@/components/ui/style-primitives";
import {cn} from "@/lib/utils/utils";
import type {DashboardErrorProps} from "@/types/dashboard";

export default function DashboardError({
                                           error,
                                           unstable_retry,
                                       }: DashboardErrorProps) {
    return (
        <main
            className="flex min-h-screen items-center justify-center bg-slate-100 p-6 text-slate-950 dark:bg-slate-950 dark:text-slate-50">
            <section
                aria-labelledby="dashboard-error-title"
                role="alert"
                className={cn("w-full max-w-lg p-6", uiStyles.dangerSurface)}>
                <div className="flex items-start gap-3">
                    <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-200">
                        <AlertTriangle aria-hidden="true" size={20}/>
                    </div>
                    <div className="min-w-0">
                        <h1 className="text-xl font-semibold" id="dashboard-error-title">
                            Dashboard unavailable
                        </h1>
                        <p className={cn("mt-2", uiStyles.bodyText)}>
                            {error.message || "The dashboard could not be rendered."}
                        </p>
                        <Button className="mt-5" onClick={unstable_retry} variant="primary">
                            <RotateCcw aria-hidden="true" size={16}/>
                            Try again
                        </Button>
                    </div>
                </div>
            </section>
        </main>
    );
}
