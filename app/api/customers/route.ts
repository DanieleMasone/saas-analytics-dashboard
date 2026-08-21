import {customers, getCustomers, simulateLatency} from "@/lib/mock-data/mock-data";

/** Keep the mock customer dataset exportable in GitHub Pages builds. */
export const dynamic = "force-static";

/** Return the complete customer dataset for client-side querying. */
export async function GET() {
    await simulateLatency("customers");

    return Response.json(getCustomers({page: 1, pageSize: customers.length}));
}
