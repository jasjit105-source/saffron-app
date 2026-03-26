"use server";

import { db } from "@/lib/db";

export async function getDashboardStats() {
  try {
    const [
      activeWeddings,
      totalWeddings,
      totalLeads,
      pendingLeads,
      pendingTasks,
      totalVendors,
      totalGuests,
      totalEvents,
    ] = await Promise.all([
      db.wedding.count({
        where: {
          status: {
            in: ["CONFIRMED", "PLANNING_IN_PROGRESS", "FINAL_PREP", "LIVE_EXECUTION"],
          },
        },
      }),
      db.wedding.count(),
      db.lead.count(),
      db.lead.count({ where: { status: { in: ["NEW", "CONTACTED", "MEETING_SCHEDULED"] } } }),
      db.task.count({ where: { status: { in: ["TODO", "IN_PROGRESS", "BLOCKED"] } } }),
      db.vendor.count(),
      db.guest.count(),
      db.event.count(),
    ]);

    return {
      activeWeddings,
      totalWeddings,
      totalLeads,
      pendingLeads,
      pendingTasks,
      totalVendors,
      totalGuests,
      totalEvents,
    };
  } catch (error) {
    console.error("getDashboardStats error:", error);
    return {
      activeWeddings: 0,
      totalWeddings: 0,
      totalLeads: 0,
      pendingLeads: 0,
      pendingTasks: 0,
      totalVendors: 0,
      totalGuests: 0,
      totalEvents: 0,
    };
  }
}

export async function getUpcomingWeddings(limit: number = 10) {
  try {
    // Show ALL active weddings, not just future-dated ones
    return await db.wedding.findMany({
      where: {
        status: { notIn: ["COMPLETED", "ARCHIVED", "CANCELLED"] },
      },
      include: {
        leadPlanner: { select: { id: true, name: true } },
        couple: { select: { brideFullName: true, groomFullName: true } },
        _count: { select: { events: true, guests: true } },
      },
      orderBy: { startDate: "asc" },
      take: limit,
    });
  } catch (error) {
    console.error("getUpcomingWeddings error:", error);
    return [];
  }
}

export async function getRecentLeads(limit: number = 10) {
  try {
    return await db.lead.findMany({
      include: {
        assignedPlanner: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  } catch (error) {
    console.error("getRecentLeads error:", error);
    return [];
  }
}

export async function getUrgentTasks(limit: number = 10) {
  try {
    return await db.task.findMany({
      where: {
        status: { in: ["TODO", "IN_PROGRESS", "BLOCKED"] },
      },
      include: {
        wedding: { select: { id: true, title: true } },
        assignedTo: { select: { id: true, name: true } },
      },
      orderBy: [{ dueDate: "asc" }],
      take: limit,
    });
  } catch (error) {
    console.error("getUrgentTasks error:", error);
    return [];
  }
}

export async function getAllVendors(limit: number = 10) {
  try {
    return await db.vendor.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      take: limit,
    });
  } catch (error) {
    console.error("getAllVendors error:", error);
    return [];
  }
}

export async function getAllEvents(limit: number = 20) {
  try {
    return await db.event.findMany({
      include: {
        wedding: { select: { id: true, title: true } },
      },
      orderBy: [{ date: "asc" }, { sequence: "asc" }],
      take: limit,
    });
  } catch (error) {
    console.error("getAllEvents error:", error);
    return [];
  }
}

export async function getRitualTemplates() {
  try {
    return await db.ritualTemplate.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("getRitualTemplates error:", error);
    return [];
  }
}

export async function getMarketplaceStats() {
  try {
    const [totalMarketplaceVendors, topPicks, cities, topVendorsByCity] =
      await Promise.all([
        db.marketplaceVendor.count(),
        db.marketplaceVendor.count({ where: { top3: true } }),
        db.city.findMany({
          include: { _count: { select: { vendors: true } } },
          orderBy: { name: "asc" },
        }),
        db.marketplaceVendor.findMany({
          where: { top3: true },
          include: { city: true, category: true },
          orderBy: [{ city: { name: "asc" } }, { name: "asc" }],
          take: 6,
        }),
      ]);

    return {
      totalMarketplaceVendors,
      topPicks,
      cities: cities.map((c) => ({
        name: c.name,
        count: c._count.vendors,
      })),
      topVendorsByCity: topVendorsByCity.map((v) => ({
        id: v.id,
        name: v.name,
        cityName: v.city.name,
        categoryName: v.category.name,
        categoryIcon: v.category.icon,
      })),
    };
  } catch (error) {
    console.error("getMarketplaceStats error:", error);
    return {
      totalMarketplaceVendors: 0,
      topPicks: 0,
      cities: [],
      topVendorsByCity: [],
    };
  }
}
