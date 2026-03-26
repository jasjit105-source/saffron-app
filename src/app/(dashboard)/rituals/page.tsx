import { db } from "@/lib/db";
import Link from "next/link";
import {
  Globe2,
  Clock,
  MapPin,
  Users,
  Music,
  UtensilsCrossed,
  Palette,
  Star,
  ChevronRight,
  Sparkles,
  Filter,
} from "lucide-react";
import { PageHeader, SummaryCard } from "@/components/shared";

export const dynamic = "force-dynamic";

// ── Helpers ───────────────────────────────────

const RELIGION_COLORS: Record<string, string> = {
  SIKH: "bg-amber-500",
  HINDU: "bg-orange-500",
  JAIN: "bg-emerald-500",
  CUSTOM: "bg-emerald-500",
  PUNJABI: "bg-amber-400",
  NORTH_INDIAN: "bg-orange-400",
  GUJARATI: "bg-teal-500",
  SOUTH_INDIAN: "bg-rose-500",
};

const RELIGION_BG: Record<string, string> = {
  SIKH: "from-amber-50/80 to-white",
  HINDU: "from-orange-50/80 to-white",
  JAIN: "from-emerald-50/80 to-white",
  CUSTOM: "from-emerald-50/80 to-white",
};

const PHASE_STYLE: Record<string, string> = {
  "pre-wedding": "bg-violet-50 text-violet-700",
  "wedding-day": "bg-rose-50 text-rose-700",
  "post-wedding": "bg-sky-50 text-sky-700",
};

const IMPORTANCE_LEVELS: Record<string, { bars: number; color: string }> = {
  high: { bars: 3, color: "bg-amber-400" },
  moderate: { bars: 2, color: "bg-amber-300" },
  "full service": { bars: 3, color: "bg-amber-400" },
  "light refreshments": { bars: 1, color: "bg-amber-200" },
  minimal: { bars: 1, color: "bg-gray-300" },
  none: { bars: 0, color: "bg-gray-200" },
};

function ImportanceDots({ level, icon: Icon }: { level: string | null; icon: React.ElementType }) {
  if (!level) return null;
  const config = IMPORTANCE_LEVELS[level.toLowerCase()] || { bars: 1, color: "bg-gray-300" };
  return (
    <div className="flex items-center gap-1.5">
      <Icon size={11} className="text-gray-400" />
      <div className="flex gap-0.5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full ${i <= config.bars ? config.color : "bg-gray-200"}`}
          />
        ))}
      </div>
      <span className="text-[10px] text-gray-400 capitalize">{level}</span>
    </div>
  );
}

// ── Page ──────────────────────────────────────

interface RitualsPageProps {
  searchParams: Promise<{ religion?: string; phase?: string }>;
}

export default async function RitualsPage(props: RitualsPageProps) {
  const searchParams = await props.searchParams;
  const rawReligion = searchParams.religion?.toUpperCase() || null;
  const filterReligion = rawReligion === "JAIN" ? "CUSTOM" : rawReligion;
  const filterPhase = searchParams.phase?.toLowerCase() || null;

  // Build where clause
  const where: any = { isActive: true };
  if (filterReligion) where.religionType = filterReligion;
  if (filterPhase) where.eventPhase = filterPhase;

  const allRituals = await db.ritualTemplate.findMany({
    where: { isActive: true },
    orderBy: [{ eventPhase: "asc" }, { name: "asc" }],
  });

  const rituals = await db.ritualTemplate.findMany({
    where,
    orderBy: [{ eventPhase: "asc" }, { name: "asc" }],
  });

  // Compute summary counts from all rituals
  const sikhCount = allRituals.filter((r) => r.religionType === "SIKH").length;
  const hinduCount = allRituals.filter((r) => r.religionType === "HINDU").length;
  const jainCount = allRituals.filter(
    (r) => r.religionType === "CUSTOM"
  ).length;
  const preWeddingCount = allRituals.filter((r) => r.eventPhase === "pre-wedding").length;
  const weddingDayCount = allRituals.filter((r) => r.eventPhase === "wedding-day").length;
  const postWeddingCount = allRituals.filter((r) => r.eventPhase === "post-wedding").length;

  // Group filtered rituals by religion then phase
  const grouped: Record<string, Record<string, typeof rituals>> = {};
  for (const r of rituals) {
    const religion = r.religionType || "OTHER";
    const phase = r.eventPhase || "unspecified";
    if (!grouped[religion]) grouped[religion] = {};
    if (!grouped[religion][phase]) grouped[religion][phase] = [];
    grouped[religion][phase].push(r);
  }

  const activeReligion = filterReligion?.toLowerCase() || "all";
  const activePhase = filterPhase || "all";

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Ritual Intelligence Engine"
        subtitle={`${allRituals.length} ritual templates across ${new Set(allRituals.map((r) => r.religionType)).size} traditions`}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        <SummaryCard label="Total Rituals" value={allRituals.length} accent />
        <SummaryCard label="Sikh" value={sikhCount} sub={`${Math.round((sikhCount / (allRituals.length || 1)) * 100)}%`} />
        <SummaryCard label="Hindu" value={hinduCount} sub={`${Math.round((hinduCount / (allRituals.length || 1)) * 100)}%`} />
        <SummaryCard label="Jain" value={jainCount} sub={`${Math.round((jainCount / (allRituals.length || 1)) * 100)}%`} />
        <SummaryCard label="Pre-Wedding" value={preWeddingCount} />
        <SummaryCard label="Wedding Day" value={weddingDayCount} />
        <SummaryCard label="Post-Wedding" value={postWeddingCount} />
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-1 mr-2">
          <Filter size={13} className="text-gray-400" />
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
            Religion
          </span>
        </div>
        {[
          { label: "All", value: "all" },
          { label: "Sikh", value: "sikh" },
          { label: "Hindu", value: "hindu" },
          { label: "Jain", value: "jain" },
        ].map((tab) => {
          const isActive = activeReligion === tab.value;
          const href =
            tab.value === "all"
              ? filterPhase
                ? `/rituals?phase=${filterPhase}`
                : "/rituals"
              : filterPhase
              ? `/rituals?religion=${tab.value}&phase=${filterPhase}`
              : `/rituals?religion=${tab.value}`;
          return (
            <Link
              key={tab.value}
              href={href}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                isActive
                  ? "bg-gradient-to-r from-[#C8553D] to-[#E8913A] text-white shadow-sm"
                  : "bg-white border border-gray-100 text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}

        <div className="w-px bg-gray-200 mx-1" />

        <div className="flex items-center gap-1 mr-2">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
            Phase
          </span>
        </div>
        {[
          { label: "All", value: "all" },
          { label: "Pre-Wedding", value: "pre-wedding" },
          { label: "Wedding Day", value: "wedding-day" },
          { label: "Post-Wedding", value: "post-wedding" },
        ].map((tab) => {
          const isActive = activePhase === tab.value;
          const href =
            tab.value === "all"
              ? filterReligion
                ? `/rituals?religion=${filterReligion.toLowerCase()}`
                : "/rituals"
              : filterReligion
              ? `/rituals?religion=${filterReligion.toLowerCase()}&phase=${tab.value}`
              : `/rituals?phase=${tab.value}`;
          return (
            <Link
              key={tab.value}
              href={href}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                isActive
                  ? "bg-gradient-to-r from-[#C8553D] to-[#E8913A] text-white shadow-sm"
                  : "bg-white border border-gray-100 text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Results */}
      {rituals.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-4">
            <Globe2 size={28} className="text-amber-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">No Rituals Found</h3>
          <p className="text-sm text-gray-400 max-w-md mx-auto">
            {filterReligion || filterPhase
              ? "No rituals match the current filters. Try adjusting your selection."
              : "Run the seed to load ritual templates."}
          </p>
          {(filterReligion || filterPhase) && (
            <Link
              href="/rituals"
              className="mt-4 inline-block text-xs font-semibold text-amber-600 hover:text-amber-700"
            >
              Clear all filters
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([religion, phases]) => (
            <div key={religion}>
              {/* Religion section header */}
              <div className="flex items-center gap-2.5 mb-4">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${RELIGION_COLORS[religion] || "bg-gray-400"}`}
                />
                <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                  {religion.replace(/_/g, " ")}
                </h2>
                <span className="text-[10px] text-gray-400 font-medium">
                  {Object.values(phases).flat().length} rituals
                </span>
              </div>

              {/* Phase sub-sections */}
              {Object.entries(phases).map(([phase, phaseRituals]) => (
                <div key={phase} className="mb-6">
                  <div className="flex items-center gap-2 mb-3 ml-5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide ${
                        PHASE_STYLE[phase] || "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {phase.replace(/-/g, " ")}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {phaseRituals.length} ritual{phaseRituals.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 ml-5">
                    {phaseRituals.map((r) => (
                      <Link
                        key={r.id}
                        href={`/rituals/${r.id}`}
                        className={`group bg-gradient-to-br ${
                          RELIGION_BG[religion] || "from-gray-50/50 to-white"
                        } rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:border-gray-200 transition-all`}
                      >
                        {/* Card header */}
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                  RELIGION_COLORS[religion] || "bg-gray-400"
                                }`}
                              />
                              <h3 className="text-sm font-bold text-gray-900 truncate">
                                {r.name}
                              </h3>
                            </div>
                            {r.alternateNames && r.alternateNames.length > 0 && (
                              <p className="text-[10px] text-gray-400 ml-3.5 mt-0.5 truncate">
                                Also: {r.alternateNames.join(", ")}
                              </p>
                            )}
                          </div>
                          <ChevronRight
                            size={14}
                            className="text-gray-300 group-hover:text-amber-500 transition flex-shrink-0 mt-0.5"
                          />
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {r.mandatoryOrOptional && (
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                r.mandatoryOrOptional.toLowerCase() === "mandatory"
                                  ? "bg-red-50 text-red-600"
                                  : "bg-gray-100 text-gray-500"
                              }`}
                            >
                              {r.mandatoryOrOptional.toUpperCase()}
                            </span>
                          )}
                          {r.familyOnlyOrGuest && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-600">
                              {r.familyOnlyOrGuest === "family-only" ? "FAMILY ONLY" : "GUEST-FACING"}
                            </span>
                          )}
                        </div>

                        {/* Description */}
                        {r.description && (
                          <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">
                            {r.description}
                          </p>
                        )}

                        {/* Meta row */}
                        <div className="space-y-1.5 mb-3">
                          {r.expectedDurationMinutes && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                              <Clock size={11} className="text-gray-300" />
                              {r.expectedDurationMinutes} min
                            </div>
                          )}
                          {r.typicalTimeOfDay && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                              <Sparkles size={11} className="text-gray-300" />
                              {r.typicalTimeOfDay}
                            </div>
                          )}
                          {r.typicalLocationType && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                              <MapPin size={11} className="text-gray-300" />
                              {r.typicalLocationType}
                            </div>
                          )}
                        </div>

                        {/* Importance indicators */}
                        {(r.commonMusicLevel || r.foodImportance || r.decorImportance) && (
                          <div className="pt-2.5 border-t border-gray-100/80 space-y-1">
                            <ImportanceDots level={r.commonMusicLevel} icon={Music} />
                            <ImportanceDots level={r.foodImportance} icon={UtensilsCrossed} />
                            <ImportanceDots level={r.decorImportance} icon={Palette} />
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
