import {revenue, simulateLatency} from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export async function GET() {
  await simulateLatency("revenue");

  return Response.json({
    data: revenue,
    updatedAt: new Date().toISOString(),
  });
}
