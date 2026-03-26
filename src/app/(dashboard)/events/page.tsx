import { db } from "@/lib/db";
import { CalendarDays, Plus } from "lucide-react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { PageHeader, ActionButton, StatusBadge, CardSection } from "@/components/shared";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await db.event.findMany({
    include: { wedding: { select: { id: true, title: true } } },
    orderBy: [{ date: "asc" }, { sequence: "asc" }],
  });

  const byWedding: Record<string, { title: string; events: any[] }> = {};
  for (const evt of events) {
    if (!byWedding[evt.weddingId]) byWedding[evt.weddingId] = { title: evt.wedding.title, events: [] };
    byWedding[evt.weddingId].events.push(evt);
  }

  return (
    <div className="space-y-5">
      <PageHeader title="Events & Ceremonies" subtitle={`${events.length} events across ${Object.keys(byWedding).length} weddings`} actions={<ActionButton icon={Plus}>Add Event</ActionButton>} />
      {Object.entries(byWedding).map(([wId, { title, events: wEvents }]) => (
        <CardSection key={wId} title={title} subtitle={`${wEvents.length} events`} action={<Link href={`/weddings/${wId}`} className="text-[11px] text-amber-600 font-semibold hover:underline">View wedding</Link>}>
          <div className="divide-y divide-gray-50">
            {wEvents.map((evt: any) => (
              <div key={evt.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-gray-50/50 transition">
                <div className="w-8 text-center shrink-0"><div className="text-xs font-bold text-gray-300">#{evt.sequence}</div></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">{evt.name}</span>
                    <StatusBadge status={evt.status} />
                    {evt.side !== "SHARED" && <span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-50 text-gray-400 font-medium">{evt.side}</span>}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">{evt.date ? formatDate(evt.date) : "Date TBD"}{evt.startTime && ` • ${evt.startTime}`}{evt.venue && ` • ${evt.venue}`}</div>
                </div>
              </div>
            ))}
          </div>
        </CardSection>
      ))}
      {events.length === 0 && <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center"><CalendarDays size={28} className="text-amber-400 mx-auto mb-3" /><h3 className="text-lg font-bold text-gray-800 mb-2">No Events Yet</h3><p className="text-sm text-gray-400">Create a wedding first, then add events.</p></div>}
    </div>
  );
}
