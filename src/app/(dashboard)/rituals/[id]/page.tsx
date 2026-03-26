import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Users,
  Music,
  UtensilsCrossed,
  Palette,
  Star,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Shirt,
  BookOpen,
  StickyNote,
  Ban,
  ChevronDown,
  Package,
} from "lucide-react";

export const dynamic = "force-dynamic";

// ── Helpers ───────────────────────────────────

const RELIGION_COLORS: Record<string, { dot: string; bg: string; text: string; badge: string }> = {
  SIKH: {
    dot: "bg-amber-500",
    bg: "from-amber-600 to-amber-800",
    text: "text-amber-100",
    badge: "bg-amber-500/20 text-amber-200",
  },
  HINDU: {
    dot: "bg-orange-500",
    bg: "from-orange-600 to-orange-800",
    text: "text-orange-100",
    badge: "bg-orange-500/20 text-orange-200",
  },
  JAIN: {
    dot: "bg-emerald-500",
    bg: "from-emerald-600 to-emerald-800",
    text: "text-emerald-100",
    badge: "bg-emerald-500/20 text-emerald-200",
  },
  CUSTOM: {
    dot: "bg-emerald-500",
    bg: "from-emerald-600 to-emerald-800",
    text: "text-emerald-100",
    badge: "bg-emerald-500/20 text-emerald-200",
  },
  PUNJABI: {
    dot: "bg-amber-400",
    bg: "from-amber-500 to-amber-700",
    text: "text-amber-100",
    badge: "bg-amber-500/20 text-amber-200",
  },
};

const DEFAULT_RELIGION_STYLE = {
  dot: "bg-gray-400",
  bg: "from-gray-600 to-gray-800",
  text: "text-gray-100",
  badge: "bg-gray-500/20 text-gray-200",
};

const PHASE_STYLE: Record<string, string> = {
  "pre-wedding": "bg-violet-500/20 text-violet-200",
  "wedding-day": "bg-rose-500/20 text-rose-200",
  "post-wedding": "bg-sky-500/20 text-sky-200",
};

function ImportanceBar({
  label,
  level,
  icon: Icon,
}: {
  label: string;
  level: string | null;
  icon: React.ElementType;
}) {
  if (!level) return null;
  const normalized = level.toLowerCase();
  let bars = 1;
  let color = "bg-gray-300";

  if (normalized === "high" || normalized === "full service") {
    bars = 3;
    color = "bg-amber-400";
  } else if (normalized === "moderate") {
    bars = 2;
    color = "bg-amber-300";
  } else if (normalized === "light refreshments") {
    bars = 1;
    color = "bg-amber-200";
  } else if (normalized === "minimal") {
    bars = 1;
    color = "bg-gray-300";
  } else if (normalized === "none") {
    bars = 0;
    color = "bg-gray-200";
  }

  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/80">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
          <Icon size={15} className="text-gray-500" />
        </div>
        <div>
          <div className="text-xs font-semibold text-gray-700">{label}</div>
          <div className="text-[10px] text-gray-400 capitalize">{level}</div>
        </div>
      </div>
      <div className="flex gap-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-6 h-2 rounded-full ${i <= bars ? color : "bg-gray-200"}`}
          />
        ))}
      </div>
    </div>
  );
}

function VendorBadge({
  name,
  variant,
}: {
  name: string;
  variant: "essential" | "suggested" | "optional";
}) {
  const styles = {
    essential: "bg-red-50 text-red-700 border-red-100",
    suggested: "bg-amber-50 text-amber-700 border-amber-100",
    optional: "bg-gray-50 text-gray-600 border-gray-100",
  };
  return (
    <span
      className={`text-[10px] font-semibold px-2 py-1 rounded-lg border ${styles[variant]}`}
    >
      {name}
    </span>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
        <Icon size={14} className="text-gray-400" />
      </div>
      <div>
        <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
          {label}
        </div>
        <div className="text-sm text-gray-700">{value}</div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────

interface RitualDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function RitualDetailPage(props: RitualDetailPageProps) {
  const { id } = await props.params;

  const ritual = await db.ritualTemplate.findUnique({ where: { id } });

  if (!ritual) notFound();

  const religionStyle = RELIGION_COLORS[ritual.religionType] || DEFAULT_RELIGION_STYLE;
  const phaseStyle = PHASE_STYLE[ritual.eventPhase || ""] || "bg-gray-500/20 text-gray-200";

  // Parse checklist data if it exists
  let checklistSections: { title: string; items: string[] }[] = [];
  if (ritual.checklistData) {
    try {
      const data = ritual.checklistData as any;
      if (Array.isArray(data)) {
        checklistSections = data;
      } else if (typeof data === "object" && data.sections) {
        checklistSections = data.sections;
      }
    } catch {
      // Ignore parse errors
    }
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        href="/rituals"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-600 transition"
      >
        <ArrowLeft size={14} />
        Back to Ritual Engine
      </Link>

      {/* Hero Section */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className={`bg-gradient-to-r ${religionStyle.bg} px-6 py-6`}>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center text-2xl flex-shrink-0">
              <Sparkles size={24} className="text-white/80" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-xl font-bold text-white font-display">{ritual.name}</h1>
              </div>
              {ritual.alternateNames && ritual.alternateNames.length > 0 && (
                <p className={`text-xs ${religionStyle.text} mb-2`}>
                  Also known as: {ritual.alternateNames.join(", ")}
                </p>
              )}
              <div className="flex items-center gap-2 flex-wrap mt-2">
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${religionStyle.badge}`}
                >
                  {ritual.religionType.replace(/_/g, " ")}
                </span>
                {ritual.eventPhase && (
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${phaseStyle}`}
                  >
                    {ritual.eventPhase.replace(/-/g, " ")}
                  </span>
                )}
                {ritual.mandatoryOrOptional && (
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                      ritual.mandatoryOrOptional.toLowerCase() === "mandatory"
                        ? "bg-white/20 text-white"
                        : "bg-white/10 text-white/70"
                    }`}
                  >
                    {ritual.mandatoryOrOptional}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick stats bar */}
        <div className="px-6 py-3 bg-gray-50/50 border-b border-gray-100 flex flex-wrap gap-4 text-xs text-gray-500">
          {ritual.expectedDurationMinutes && (
            <div className="flex items-center gap-1.5">
              <Clock size={12} className="text-gray-400" />
              {ritual.expectedDurationMinutes} minutes
            </div>
          )}
          {ritual.typicalTimeOfDay && (
            <div className="flex items-center gap-1.5">
              <Sparkles size={12} className="text-gray-400" />
              {ritual.typicalTimeOfDay}
            </div>
          )}
          {ritual.typicalLocationType && (
            <div className="flex items-center gap-1.5">
              <MapPin size={12} className="text-gray-400" />
              {ritual.typicalLocationType}
            </div>
          )}
          {ritual.performedBy && (
            <div className="flex items-center gap-1.5">
              <Users size={12} className="text-gray-400" />
              {ritual.performedBy}
            </div>
          )}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Overview Card */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <h2 className="text-sm font-bold text-gray-800 tracking-tight flex items-center gap-2">
              <BookOpen size={14} className="text-amber-500" />
              Overview
            </h2>
          </div>
          <div className="p-5 space-y-4">
            {ritual.description && (
              <div>
                <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Description
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{ritual.description}</p>
              </div>
            )}
            {ritual.culturalMeaning && (
              <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-100/50">
                <div className="text-[10px] font-semibold text-amber-600 uppercase tracking-wider mb-1.5">
                  Cultural Meaning
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{ritual.culturalMeaning}</p>
              </div>
            )}
            {ritual.religiousNotes && (
              <div>
                <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Religious Notes
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{ritual.religiousNotes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Planning Details Card */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <h2 className="text-sm font-bold text-gray-800 tracking-tight flex items-center gap-2">
              <Star size={14} className="text-amber-500" />
              Planning Details
            </h2>
          </div>
          <div className="p-5 space-y-1 divide-y divide-gray-50">
            {ritual.expectedDurationMinutes && (
              <InfoRow icon={Clock} label="Expected Duration" value={`${ritual.expectedDurationMinutes} minutes`} />
            )}
            {ritual.typicalTimeOfDay && (
              <InfoRow icon={Sparkles} label="Time of Day" value={ritual.typicalTimeOfDay} />
            )}
            {ritual.typicalLocationType && (
              <InfoRow icon={MapPin} label="Location Type" value={ritual.typicalLocationType} />
            )}
            {ritual.recommendedDressCode && (
              <InfoRow icon={Shirt} label="Dress Code" value={ritual.recommendedDressCode} />
            )}
            {ritual.mandatoryOrOptional && (
              <InfoRow
                icon={ShieldCheck}
                label="Mandatory / Optional"
                value={ritual.mandatoryOrOptional.charAt(0).toUpperCase() + ritual.mandatoryOrOptional.slice(1)}
              />
            )}
            {ritual.familyOnlyOrGuest && (
              <InfoRow
                icon={Users}
                label="Audience"
                value={ritual.familyOnlyOrGuest === "family-only" ? "Family Only" : "Guest-Facing"}
              />
            )}
            {ritual.performedBy && (
              <InfoRow icon={Users} label="Performed By" value={ritual.performedBy} />
            )}
            {ritual.brideSideInvolvement && (
              <InfoRow icon={Users} label="Bride Side" value={ritual.brideSideInvolvement} />
            )}
            {ritual.groomSideInvolvement && (
              <InfoRow icon={Users} label="Groom Side" value={ritual.groomSideInvolvement} />
            )}
            {ritual.arrangedByTypical && (
              <InfoRow icon={Users} label="Arranged By" value={ritual.arrangedByTypical} />
            )}
            {ritual.paidByTypical && (
              <InfoRow icon={Package} label="Paid By" value={ritual.paidByTypical} />
            )}
          </div>
        </div>

        {/* Required & Optional Items Card */}
        {(ritual.requiredItems.length > 0 || ritual.optionalItems.length > 0) && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50">
              <h2 className="text-sm font-bold text-gray-800 tracking-tight flex items-center gap-2">
                <Package size={14} className="text-amber-500" />
                Items & Materials
              </h2>
            </div>
            <div className="p-5 space-y-4">
              {ritual.requiredItems.length > 0 && (
                <div>
                  <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Required Items
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {ritual.requiredItems.map((item, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-semibold px-2 py-1 bg-red-50 text-red-700 rounded-lg border border-red-100"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {ritual.optionalItems.length > 0 && (
                <div>
                  <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Optional Items
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {ritual.optionalItems.map((item, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-semibold px-2 py-1 bg-gray-50 text-gray-600 rounded-lg border border-gray-100"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Vendor Requirements Card */}
        {(ritual.essentialVendors.length > 0 ||
          ritual.suggestedVendors.length > 0 ||
          ritual.optionalVendors.length > 0) && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50">
              <h2 className="text-sm font-bold text-gray-800 tracking-tight flex items-center gap-2">
                <Users size={14} className="text-amber-500" />
                Vendor Requirements
              </h2>
            </div>
            <div className="p-5 space-y-4">
              {ritual.essentialVendors.length > 0 && (
                <div>
                  <div className="text-[10px] font-semibold text-red-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <AlertTriangle size={10} />
                    Essential Vendors
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {ritual.essentialVendors.map((v, i) => (
                      <VendorBadge key={i} name={v} variant="essential" />
                    ))}
                  </div>
                </div>
              )}
              {ritual.suggestedVendors.length > 0 && (
                <div>
                  <div className="text-[10px] font-semibold text-amber-600 uppercase tracking-wider mb-2">
                    Suggested Vendors
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {ritual.suggestedVendors.map((v, i) => (
                      <VendorBadge key={i} name={v} variant="suggested" />
                    ))}
                  </div>
                </div>
              )}
              {ritual.optionalVendors.length > 0 && (
                <div>
                  <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Optional Vendors
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {ritual.optionalVendors.map((v, i) => (
                      <VendorBadge key={i} name={v} variant="optional" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Music / Food / Decor Card */}
        {(ritual.commonMusicLevel || ritual.foodImportance || ritual.decorImportance) && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50">
              <h2 className="text-sm font-bold text-gray-800 tracking-tight flex items-center gap-2">
                <Palette size={14} className="text-amber-500" />
                Atmosphere & Ambiance
              </h2>
            </div>
            <div className="p-5 space-y-2">
              <ImportanceBar label="Music" level={ritual.commonMusicLevel} icon={Music} />
              <ImportanceBar label="Food" level={ritual.foodImportance} icon={UtensilsCrossed} />
              <ImportanceBar label="Decor" level={ritual.decorImportance} icon={Palette} />
            </div>
          </div>
        )}

        {/* Planner Notes Card */}
        {ritual.plannerNotes && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50">
              <h2 className="text-sm font-bold text-gray-800 tracking-tight flex items-center gap-2">
                <StickyNote size={14} className="text-amber-500" />
                Planner Notes
              </h2>
            </div>
            <div className="p-5">
              <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-100/50">
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {ritual.plannerNotes}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Restrictions Card */}
        {ritual.restrictions && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50">
              <h2 className="text-sm font-bold text-gray-800 tracking-tight flex items-center gap-2">
                <Ban size={14} className="text-red-500" />
                Restrictions
              </h2>
            </div>
            <div className="p-5">
              <div className="bg-red-50/50 rounded-xl p-4 border border-red-100/50">
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {ritual.restrictions}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Checklist Section (full width) */}
      {checklistSections.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <h2 className="text-sm font-bold text-gray-800 tracking-tight flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-500" />
              Planner Checklist
            </h2>
          </div>
          <div className="p-5">
            <div className="grid md:grid-cols-2 gap-4">
              {checklistSections.map((section, si) => (
                <div
                  key={si}
                  className="rounded-xl border border-gray-100 overflow-hidden"
                >
                  <div className="px-4 py-3 bg-gray-50/80 border-b border-gray-100">
                    <h3 className="text-xs font-bold text-gray-700">{section.title}</h3>
                  </div>
                  <div className="p-4 space-y-2">
                    {(section.items || []).map((item, ii) => (
                      <div key={ii} className="flex items-start gap-2.5">
                        <div className="w-4 h-4 rounded border border-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-1.5 h-1.5 rounded-sm bg-gray-200" />
                        </div>
                        <span className="text-xs text-gray-600">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
