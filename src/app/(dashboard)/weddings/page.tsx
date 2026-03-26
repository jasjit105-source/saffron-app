import { db } from "@/lib/db";
import { WeddingsClient } from "@/components/weddings/weddings-client";

export const dynamic = "force-dynamic";

export default async function WeddingsPage() {
  const weddings = await db.wedding.findMany({
    include: {
      leadPlanner: { select: { id: true, name: true } },
      couple: { select: { brideFullName: true, groomFullName: true } },
      _count: { select: { events: true, guests: true, tasks: true } },
    },
    orderBy: { startDate: "asc" },
  });

  return <WeddingsClient weddings={JSON.parse(JSON.stringify(weddings))} />;
}
