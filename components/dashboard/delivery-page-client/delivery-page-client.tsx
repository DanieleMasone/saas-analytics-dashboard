"use client";

import {useQuery} from "@tanstack/react-query";
import {DashboardShell} from "../dashboard-shell/dashboard-shell";
import {DeliveryInsights} from "../delivery-insights/delivery-insights";
import {fetchDelivery} from "@/lib/api/api";

/** Focused delivery route for Jira-like execution and release readiness signals. */
export function DeliveryPageClient() {
  const deliveryQuery = useQuery({
    queryFn: fetchDelivery,
    queryKey: ["delivery"],
  });

  return (
      <DashboardShell
          activeSection="delivery"
          description="Review Jira-style sprint predictability, cycle time, blockers, scope movement, and issue risk."
          eyebrow="Delivery"
          isRefreshing={deliveryQuery.isFetching}
          onRefresh={() => void deliveryQuery.refetch()}
          title="Delivery"
      >
        <DeliveryInsights
            data={deliveryQuery.data?.data}
            isError={deliveryQuery.isError}
            isLoading={deliveryQuery.isLoading}
            onRetry={() => void deliveryQuery.refetch()}
        />
      </DashboardShell>
  );
}

