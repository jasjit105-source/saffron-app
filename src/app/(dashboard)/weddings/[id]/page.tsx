import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  PageHeader,
  StatusBadge,
  CardSection,
  ProgressBar,
  ActionButton,
} from "@/components/shared";
import {
  CalendarDays,
  Users,
  CheckSquare,
  Store,
  IndianRupee,
  ArrowLeft,
  Edit,
} from "lucide-react";
import Link from "next/link";

interface Props {
  params: { id: string };
}

export default async function WeddingDetailPage({ params }: Props) {
  const wedding = await db.wedding.findUnique({
    where: { id: params.id },
    include: {
      couple: true,
      leadPlanner: { select: { id: true, name: true } },
      events: { orderBy: { sequence: "asc" } },
      tasks: { where: { status: { in: ["TODO", "IN_PROGRESS", "BLOCKED"] } }, take: 5 },
      guests: { select: { id: true, rsvpStatus: true, isVIP: true } },
      _count: {
        select: {
          events: true,
          guests: true,
          tasks: true,
          checklistItems: true,
          vendorAssignments: true,
          payments: true,
        },
      },
    },
  });

  if (!wedding) notFound();

  const confirmedGuests = wedding.guests.filter(
    (g) => g.rsvpStatus === "CONFIRMED"
  ).length;
  const vipGuests = wedding.guests.filter((g) => g.isVIP).length;

  return (
    <div className="space-y-6">
      {/* Breadcrumb + Header */}
      <div>
        <Link
          href="/weddings"
          className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 mb-3 transition"
        >
          <ArrowLeft size={12} /> Back to Weddings
        </Link>
        <PageHeader
          title={wedding.title}
          subtitle={`${wedding.primaryCity} • ${wedding.weddingType?.replace(/_/g, " ")} • ${wedding.planningScope?.replace(/_/g, " ")}`}
          actions={
            <div className="flex items-center gap-2">
              <StatusBadge status={wedding.status} />
              <ActionButton icon={Edit} variant="outline" size="sm">
                Edit
              </ActionButton>
            </div>
          }
        />
      </div>

      {/* Couple Info */}
      {wedding.couple && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="text-[10px] font-semibold text-rose-400 uppercase tracking-wider mb-1">
                Bride
              </div>
              <div className="text-base font-bold text-gray-900">
                {wedding.couple.brideFullName}
              </div>
              {wedding.couple.brideCity && (
                <div className="text-xs text-gray-400 mt-0.5">
                  {wedding.couple.brideCity}
                </div>
              )}
            </div>
            <div>
              <div className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider mb-1">
                Groom
              </div>
              <div className="text-base font-bold text-gray-900">
                {wedding.couple.groomFullName}
              </div>
              {wedding.couple.groomCity && (
                <div className="text-xs text-gray-400 mt-0.5">
                  {wedding.couple.groomCity}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
          <CalendarDays size={18} className="text-amber-400 mx-auto mb-1" />
          <div className="text-xl font-bold text-gray-900">{wedding._count.events}</div>
          <div className="text-[10px] text-gray-400 uppercase tracking-wider">Events</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
          <Users size={18} className="text-amber-400 mx-auto mb-1" />
          <div className="text-xl font-bold text-gray-900">{confirmedGuests} / {wedding.estimatedGuestCount || 0}</div>
          <div className="text-[10px] text-gray-400 uppercase tracking-wider">Guests</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
          <CheckSquare size={18} className="text-amber-400 mx-auto mb-1" />
          <div className="text-xl font-bold text-gray-900">{wedding._count.checklistItems}</div>
          <div className="text-[10px] text-gray-400 uppercase tracking-wider">Checklist</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
          <Store size={18} className="text-amber-400 mx-auto mb-1" />
          <div className="text-xl font-bold text-gray-900">{wedding._count.vendorAssignments}</div>
          <div className="text-[10px] text-gray-400 uppercase tracking-wider">Vendors</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
          <IndianRupee size={18} className="text-amber-400 mx-auto mb-1" />
          <div className="text-xl font-bold text-gray-900 font-display">
            {wedding.contractValue ? formatCurrency(Number(wedding.contractValue)) : "—"}
          </div>
          <div className="text-[10px] text-gray-400 uppercase tracking-wider">Contract</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
          <Users size={18} className="text-rose-400 mx-auto mb-1" />
          <div className="text-xl font-bold text-gray-900">{vipGuests}</div>
          <div className="text-[10px] text-gray-400 uppercase tracking-wider">VIP Guests</div>
        </div>
      </div>

      {/* Events List */}
      <CardSection
        title="Events"
        subtitle={`${wedding._count.events} events`}
        action={
          <Link href="/events" className="text-[11px] text-amber-600 font-semibold hover:underline">
            Manage events
          </Link>
        }
      >
        <div className="divide-y divide-gray-50">
          {wedding.events.map((evt: any) => (
            <div key={evt.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-gray-50/50 transition">
              <div className="w-8 text-center">
                <div className="text-xs font-bold text-gray-300">#{evt.sequence}</div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">{evt.name}</span>
                  <StatusBadge status={evt.status} />
                  {evt.side !== "SHARED" && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-50 text-gray-400 font-medium">
                      {evt.side}
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {evt.date ? formatDate(evt.date) : "TBD"}
                  {evt.startTime && ` • ${evt.startTime}`}
                  {evt.venue && ` • ${evt.venue}`}
                </div>
              </div>
            </div>
          ))}
          {wedding.events.length === 0 && (
            <div className="px-5 py-8 text-center text-sm text-gray-300">
              No events planned yet
            </div>
          )}
        </div>
      </CardSection>

      {/* Open Tasks */}
      {wedding.tasks.length > 0 && (
        <CardSection title="Open Tasks" subtitle={`${wedding._count.tasks} total`}>
          <div className="divide-y divide-gray-50">
            {wedding.tasks.map((task: any) => (
              <div key={task.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-gray-800">{task.title}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{task.category} • Due: {task.dueDate ? formatDate(task.dueDate) : "—"}</div>
                </div>
                <StatusBadge status={task.priority} />
              </div>
            ))}
          </div>
        </CardSection>
      )}

      {/* Dates & Planner */}
      <div className="grid md:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="text-sm font-bold text-gray-800 mb-3">Dates</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Start</span>
              <span className="text-gray-700 font-medium">{wedding.startDate ? formatDate(wedding.startDate) : "TBD"}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">End</span>
              <span className="text-gray-700 font-medium">{wedding.endDate ? formatDate(wedding.endDate) : "TBD"}</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="text-sm font-bold text-gray-800 mb-3">Team</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Lead Planner</span>
              <span className="text-gray-700 font-medium">{wedding.leadPlanner?.name || "Unassigned"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {(wedding.specialNotes || wedding.riskNotes || wedding.familySensitivityNotes) && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="text-sm font-bold text-gray-800 mb-3">Notes</h3>
          <div className="space-y-3">
            {wedding.specialNotes && (
              <div>
                <div className="text-[10px] font-semibold text-gray-400 uppercase mb-1">Special Notes</div>
                <div className="text-xs text-gray-600">{wedding.specialNotes}</div>
              </div>
            )}
            {wedding.riskNotes && (
              <div>
                <div className="text-[10px] font-semibold text-red-400 uppercase mb-1">Risk Notes</div>
                <div className="text-xs text-gray-600">{wedding.riskNotes}</div>
              </div>
            )}
            {wedding.familySensitivityNotes && (
              <div>
                <div className="text-[10px] font-semibold text-amber-400 uppercase mb-1">Family Sensitivity</div>
                <div className="text-xs text-gray-600">{wedding.familySensitivityNotes}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
