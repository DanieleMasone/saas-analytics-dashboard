import {revenue, simulateLatency} from "@/lib/mock-data/mock-data";

/** Keep the mock revenue endpoint exportable in GitHub Pages builds. */
export const dynamic = "force-static";

/** Return monthly revenue data with demo latency. */
export async function GET() {
  await simulateLatency("revenue");

  return Response.json({
    data: revenue,
    updatedAt: new Date().toISOString(),
  });
}
