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

    // Create wedding with couple and events in a transaction
    const wedding = await db.$transaction(async (tx) => {
      // 1. Create wedding
      const w = await tx.wedding.create({
        data: {
          title:
            body.title ||
            `${body.brideName.split(" ").pop()}–${body.groomName.split(" ").pop()} Wedding`,
          status: "CONFIRMED",
          weddingType: body.weddingType || "SIKH",
          planningScope: body.planningScope || "FULL_SERVICE",
          primaryCity: body.primaryCity || "",
          startDate: body.startDate ? new Date(body.startDate) : null,
          endDate: body.endDate ? new Date(body.endDate) : null,
          estimatedGuestCount: body.estimatedGuestCount
            ? parseInt(body.estimatedGuestCount)
            : null,
          contractValue: body.contractValue
            ? parseFloat(body.contractValue)
            : null,
          budgetCap: body.budgetCap ? parseFloat(body.budgetCap) : null,
          specialNotes: body.specialNotes || null,
          leadPlannerId: session.user.id,
        },
      });

      // 2. Create couple profile
      if (body.brideName || body.groomName) {
        await tx.couple.create({
          data: {
            weddingId: w.id,
            brideFullName: body.brideName || "",
            groomFullName: body.groomName || "",
            bridePhone: body.bridePhone || null,
            groomPhone: body.groomPhone || null,
            brideCity: body.brideCity || null,
            groomCity: body.groomCity || null,
          },
        });
      }

      // 3. Create events from selected list
      if (body.selectedEvents?.length > 0) {
        const startDate = body.startDate ? new Date(body.startDate) : null;

        for (let i = 0; i < body.selectedEvents.length; i++) {
          const eventName = body.selectedEvents[i];
          const eventDate = startDate
            ? new Date(
                startDate.getTime() +
                  Math.floor(i / 3) * 86400000 // spread across days
              )
            : null;

          await tx.event.create({
            data: {
              weddingId: w.id,
              name: eventName,
              eventType: eventName,
              side: "SHARED",
              sequence: i + 1,
              date: eventDate,
              status: "DRAFT",
            },
          });
        }
      }

      // 4. Log audit
      await tx.auditLog.create({
        data: {
          userId: session.user.id,
          action: "CREATE",
          entity: "Wedding",
          entityId: w.id,
          details: { title: w.title, weddingType: w.weddingType },
        },
      });

      return w;
    });

    return NextResponse.json(wedding, { status: 201 });
  } catch (error) {
    console.error("Error creating wedding:", error);
    return NextResponse.json(
      { error: "Failed to create wedding" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const weddings = await db.wedding.findMany({
    include: {
      couple: { select: { brideFullName: true, groomFullName: true } },
      leadPlanner: { select: { id: true, name: true } },
      _count: { select: { events: true, guests: true } },
    },
    orderBy: { startDate: "asc" },
  });

  return NextResponse.json(weddings);
}
