import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    const lead = await db.lead.create({
      data: {
        brideName: body.brideName,
        groomName: body.groomName,
        phone: body.phone,
        email: body.email || null,
        city: body.city || "",
        source: body.source || "OTHER",
        weddingDateOrMonth: body.weddingDateOrMonth || null,
        estimatedGuestCount: body.estimatedGuestCount
          ? parseInt(body.estimatedGuestCount)
          : null,
        religionTradition: body.religionTradition || null,
        planningScope: body.planningScope || null,
        expectedBudgetRange: body.expectedBudgetRange || null,
        notes: body.notes || null,
        status: "NEW",
        assignedPlannerId: body.assignedPlannerId || session.user.id,
        followUpDate: body.followUpDate ? new Date(body.followUpDate) : null,
      },
    });

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { error: "Failed to create lead" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const leads = await db.lead.findMany({
    include: {
      assignedPlanner: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(leads);
}
