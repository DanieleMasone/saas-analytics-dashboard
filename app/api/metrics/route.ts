import { metrics, simulateLatency } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export async function GET() {
  await simulateLatency("metrics");

  return Response.json({
    data: metrics,
    updatedAt: new Date().toISOString(),
  });
}
