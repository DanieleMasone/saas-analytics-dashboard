import {jiraDelivery, simulateLatency} from "@/lib/mock-data/mock-data";

/** Keep the mock delivery endpoint exportable in GitHub Pages builds. */
export const dynamic = "force-static";

/** Return Jira-like delivery KPI data with demo latency. */
export async function GET() {
  await simulateLatency("delivery");

  return Response.json({
    data: jiraDelivery,
    updatedAt: new Date().toISOString(),
  });
}
