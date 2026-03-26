import { db } from "@/lib/db";
import { Globe2, Plus, Clock, User } from "lucide-react";
import { PageHeader, ActionButton, StatusBadge } from "@/components/shared";

export const dynamic = "force-dynamic";

export default async function RitualsPage() {
  const rituals = await db.ritualTemplate.findMany({ where: { isActive: true }, orderBy: { name: "asc" } });

  const byReligion: Record<string, any[]> = {};
  for (const r of rituals) {
    const key = r.religionType || "OTHER";
    if (!byReligion[key]) byReligion[key] = [];
    byReligion[key].push(r);
  }

  return (
    <div className="space-y-5">
      <PageHeader title="Ritual Intelligence Engine" subtitle={`${rituals.length} ritual templates loaded`} actions={<ActionButton icon={Plus}>Add Ritual</ActionButton>} />
      {Object.entries(byReligion).map(([religion, items]) => (
        <div key={religion}>
          <div className="flex items-center gap-2 mb-3">
            <span className={`w-2 h-2 rounded-full ${religion === "SIKH" ? "bg-amber-500" : religion === "HINDU" ? "bg-orange-500" : "bg-gray-400"}`} />
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">{religion.replace(/_/g, " ")}</h2>
            <span className="text-[10px] text-gray-400">{items.length} rituals</span>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {items.map((r: any) => (
              <div key={r.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition cursor-pointer">
                <h3 className="text-sm font-bold text-gray-900 mb-1">{r.name}</h3>
                {r.description && <p className="text-xs text-gray-400 mb-3 line-clamp-2">{r.description}</p>}
                <div className="space-y-1.5">
                  {r.performedBy && <div className="flex items-center gap-1.5 text-xs text-gray-500"><User size={11} className="text-gray-300" />{r.performedBy}</div>}
                  {r.expectedDurationMinutes && <div className="flex items-center gap-1.5 text-xs text-gray-500"><Clock size={11} className="text-gray-300" />{r.expectedDurationMinutes} min</div>}
                </div>
                {r.requiredItems?.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-50">
                    <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Required Items</div>
                    <div className="flex flex-wrap gap-1">
                      {r.requiredItems.slice(0, 4).map((item: string, i: number) => (
                        <span key={i} className="text-[10px] px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded">{item}</span>
                      ))}
                      {r.requiredItems.length > 4 && <span className="text-[10px] text-gray-400">+{r.requiredItems.length - 4} more</span>}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      {rituals.length === 0 && <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center"><Globe2 size={28} className="text-amber-400 mx-auto mb-3" /><h3 className="text-lg font-bold text-gray-800 mb-2">No Ritual Templates</h3><p className="text-sm text-gray-400">Run the seed to load Sikh and Hindu ritual templates.</p></div>}
    </div>
  );
}
