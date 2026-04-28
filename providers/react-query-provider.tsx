"use client";

import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import React, {useState} from "react";

/** Provide a browser-scoped TanStack Query client for all dashboard panels. */
export function ReactQueryProvider({children}: { children: React.ReactNode }) {
    // Keep one QueryClient instance for the lifetime of the browser session.
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        gcTime: 5 * 60 * 1000,
                        refetchOnWindowFocus: false,
                        retry: 1,
                        staleTime: 45 * 1000,
                    },
                },
            }),
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {process.env.NODE_ENV === "development" ? (
                <ReactQueryDevtools initialIsOpen={false}/>
            ) : null}
        </QueryClientProvider>
    );
}
