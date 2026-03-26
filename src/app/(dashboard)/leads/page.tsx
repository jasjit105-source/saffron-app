import { db } from "@/lib/db";
import { LeadsClient } from "@/components/leads/leads-client";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const leads = await db.lead.findMany({
    include: {
      assignedPlanner: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const planners = await db.user.findMany({
    where: { role: { in: ["LEAD_PLANNER", "WEDDING_PLANNER", "OWNER"] } },
    select: { id: true, name: true },
  });

  return (
    <LeadsClient
      leads={JSON.parse(JSON.stringify(leads))}
      planners={planners}
    />
  );
}
