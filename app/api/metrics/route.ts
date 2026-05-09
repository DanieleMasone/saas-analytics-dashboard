import {metrics, simulateLatency} from "@/lib/mock-data";

export const dynamic = "force-static";

/** Return SaaS KPI data with demo latency. */
export async function GET() {
  await simulateLatency("metrics");

  return Response.json({
    data: metrics,
    updatedAt: new Date().toISOString(),
  });
}
