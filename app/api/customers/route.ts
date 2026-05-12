import type {NextRequest} from "next/server";
import {getCustomers, simulateLatency} from "@/lib/mock-data/mock-data";
import {customerPlans, customerStatuses} from "@/types/dashboard";
import type {CustomerPlan, CustomerStatus} from "@/types/dashboard";

/** Keep the mock customer endpoint exportable in GitHub Pages builds. */
export const dynamic = "force-static";

// Keep query parsing defensive so malformed URLs still return a valid dashboard state.
const isCustomerStatus = (value: string | null): value is CustomerStatus =>
    Boolean(value && customerStatuses.includes(value as CustomerStatus));

const isCustomerPlan = (value: string | null): value is CustomerPlan =>
    Boolean(value && customerPlans.includes(value as CustomerPlan));

function getPositiveInteger(value: string | null, fallback: number) {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

/** Return paginated customer data after validating URL search params. */
export async function GET(request?: NextRequest) {
    await simulateLatency("customers");

    const searchParams = request?.nextUrl.searchParams ?? new URLSearchParams();
    const status = searchParams.get("status");
    const plan = searchParams.get("plan");

    return Response.json(
        getCustomers({
            page: getPositiveInteger(searchParams.get("page"), 1),
            // Cap page size to keep mock responses predictable and UI rows scannable.
            pageSize: Math.min(getPositiveInteger(searchParams.get("pageSize"), 8), 20),
            plan: isCustomerPlan(plan) ? plan : "all",
            query: searchParams.get("query") ?? "",
            status: isCustomerStatus(status) ? status : "all",
        }),
    );
}
