import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getDashboardStats,
  getUpcomingWeddings,
  getRecentLeads,
  getUrgentTasks,
  getMarketplaceStats,
  getRitualStats,
  getMenuStats,
} from "./actions";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  const [stats, upcomingWeddings, recentLeads, urgentTasks, marketplaceStats, ritualStats, menuStats] = await Promise.all([
    getDashboardStats(),
    getUpcomingWeddings(10),
    getRecentLeads(10),
    getUrgentTasks(10),
    getMarketplaceStats(),
    getRitualStats(),
    getMenuStats(),
  ]);

  return (
    <DashboardClient
      stats={stats}
      upcomingWeddings={JSON.parse(JSON.stringify(upcomingWeddings))}
      recentLeads={JSON.parse(JSON.stringify(recentLeads))}
      urgentTasks={JSON.parse(JSON.stringify(urgentTasks))}
      userName={session?.user?.name || "Planner"}
      marketplaceStats={marketplaceStats}
      ritualStats={ritualStats}
      menuStats={menuStats}
    />
  );
}
