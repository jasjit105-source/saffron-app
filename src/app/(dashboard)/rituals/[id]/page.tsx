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
  Heart,
  Sun,
  Eye,
  UserCheck,
} from "lucide-react";

export const dynamic = "force-dynamic";

// ── Helpers ───────────────────────────────────

const RELIGION_COLORS: Record<
  string,
  { dot: string; bg: string; text: string; badge: string; heroBg: string; heroAccent: string }
> = {
  SIKH: {
    dot: "bg-amber-500",
    bg: "from-amber-600 to-amber-800",
    text: "text-amber-100",
    badge: "bg-amber-500/20 text-amber-200",
    heroBg: "from-amber-600 via-amber-700 to-amber-900",
    heroAccent: "bg-amber-500/30",
  },
  HINDU: {
    dot: "bg-orange-500",
    bg: "from-orange-600 to-orange-800",
    text: "text-orange-100",
    badge: "bg-orange-500/20 text-orange-200",
    heroBg: "from-orange-600 via-orange-700 to-orange-900",
    heroAccent: "bg-orange-500/30",
  },
  JAIN: {
    dot: "bg-emerald-500",
    bg: "from-emerald-600 to-emerald-800",
    text: "text-emerald-100",
    badge: "bg-emerald-500/20 text-emerald-200",
    heroBg: "from-emerald-600 via-emerald-700 to-emerald-900",
    heroAccent: "bg-emerald-500/30",
  },
  CUSTOM: {
    dot: "bg-emerald-500",
    bg: "from-emerald-600 to-emerald-800",
    text: "text-emerald-100",
    badge: "bg-emerald-500/20 text-emerald-200",
    heroBg: "from-emerald-600 via-emerald-700 to-emerald-900",
    heroAccent: "bg-emerald-500/30",
  },
  PUNJABI: {
    dot: "bg-amber-400",
    bg: "from-amber-500 to-amber-700",
    text: "text-amber-100",
    badge: "bg-amber-500/20 text-amber-200",
    heroBg: "from-amber-500 via-amber-600 to-amber-800",
    heroAccent: "bg-amber-400/30",
  },
};

const DEFAULT_RELIGION_STYLE = {
  dot: "bg-gray-400",
  bg: "from-gray-600 to-gray-800",
  text: "text-gray-100",
  badge: "bg-gray-500/20 text-gray-200",
  heroBg: "from-gray-600 via-gray-700 to-gray-900",
  heroAccent: "bg-gray-500/30",
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
    <div className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50/80 hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shadow-sm">
          <Icon size={16} className="text-gray-500" />
        </div>
        <div>
          <div className="text-xs font-semibold text-gray-700">{label}</div>
          <div className="text-[10px] text-gray-400 capitalize">{level}</div>
        </div>
      </div>
      <div className="flex gap-1.5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-7 h-2.5 rounded-full transition-all ${i <= bars ? color : "bg-gray-200"}`}
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
    essential: "bg-red-50 text-red-700 border-red-200 shadow-red-100/50",
    suggested: "bg-amber-50 text-amber-700 border-amber-200 shadow-amber-100/50",
    optional: "bg-gray-50 text-gray-600 border-gray-200 shadow-gray-100/50",
  };
  return (
    <span
      className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border shadow-sm ${styles[variant]}`}
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

function StatPill({
  icon: Icon,
  value,
}: {
  icon: React.ElementType;
  value: string;
}) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-white/80">
      <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center">
        <Icon size={12} className="text-white/70" />
      </div>
      <span className="font-medium">{value}</span>
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

  // Parse checklist data — supports array, object-with-sections, and object-with-keys formats
  let checklistSections: { title: string; items: string[] }[] = [];
  if (ritual.checklistData) {
    try {
      const data = ritual.checklistData as any;
      if (Array.isArray(data)) {
        checklistSections = data;
      } else if (typeof data === "object" && data.sections) {
        checklistSections = data.sections;
      } else if (typeof data === "object" && !Array.isArray(data)) {
        // Object with section keys like { "Decor": ["item1", "item2"], "Food": [...] }
        checklistSections = Object.entries(data).map(([key, items]) => ({
          title: key,
          items: Array.isArray(items) ? (items as string[]) : [],
        }));
      }
    } catch {
      // Ignore parse errors
    }
  }

  const hasVendors =
    ritual.essentialVendors.length > 0 ||
    ritual.suggestedVendors.length > 0 ||
    ritual.optionalVendors.length > 0;

  const hasAtmosphere =
    ritual.commonMusicLevel || ritual.foodImportance || ritual.decorImportance;

  return (
    <div className="space-y-6">
      {/* ── Back Link ──────────────────────────── */}
      <Link
        href="/rituals"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-600 transition"
      >
        <ArrowLeft size={14} />
        Back to Rituals
      </Link>

      {/* ── A) HERO SECTION ────────────────────── */}
      <div className="rounded-2xl overflow-hidden shadow-lg">
        <div className={`bg-gradient-to-br ${religionStyle.heroBg} relative`}>
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/4" />

          <div className="relative px-8 pt-10 pb-8">
            <div className={`w-14 h-14 rounded-2xl ${religionStyle.heroAccent} backdrop-blur-sm flex items-center justify-center mb-5`}>
              <Sparkles size={26} className="text-white/90" />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white font-display tracking-tight mb-2">
              {ritual.name}
            </h1>

            {ritual.alternateNames && ritual.alternateNames.length > 0 && (
              <p className={`text-sm ${religionStyle.text} mb-4 font-medium`}>
                Also known as: {ritual.alternateNames.join(", ")}
              </p>
            )}

            <div className="flex items-center gap-2 flex-wrap mt-4">
              <span
                className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide ${religionStyle.badge}`}
              >
                {ritual.religionType.replace(/_/g, " ")}
              </span>
              {ritual.eventPhase && (
                <span
                  className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide ${phaseStyle}`}
                >
                  {ritual.eventPhase.replace(/-/g, " ")}
                </span>
              )}
              {ritual.mandatoryOrOptional && (
                <span
                  className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide ${
                    ritual.mandatoryOrOptional.toLowerCase() === "mandatory"
                      ? "bg-white/20 text-white"
                      : "bg-white/10 text-white/70"
                  }`}
                >
                  {ritual.mandatoryOrOptional}
                </span>
              )}
              {ritual.familyOnlyOrGuest && (
                <span className="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide bg-white/10 text-white/70">
                  {ritual.familyOnlyOrGuest === "family-only" ? "Family Only" : "Guest-Facing"}
                </span>
              )}
            </div>
          </div>

          {/* Quick stats bar */}
          <div className="relative border-t border-white/10 px-8 py-3.5 flex flex-wrap gap-5 bg-black/10 backdrop-blur-sm">
            {ritual.expectedDurationMinutes && (
              <StatPill icon={Clock} value={`${ritual.expectedDurationMinutes} min`} />
            )}
            {ritual.typicalTimeOfDay && (
              <StatPill icon={Sun} value={ritual.typicalTimeOfDay} />
            )}
            {ritual.typicalLocationType && (
              <StatPill icon={MapPin} value={ritual.typicalLocationType} />
            )}
            {ritual.recommendedDressCode && (
              <StatPill icon={Shirt} value={ritual.recommendedDressCode} />
            )}
            {ritual.performedBy && (
              <StatPill icon={UserCheck} value={ritual.performedBy} />
            )}
          </div>
        </div>
      </div>

      {/* ── B) TWO-COLUMN GRID ─────────────────── */}
      <div className="grid lg:grid-cols-5 gap-5">
        {/* LEFT COLUMN (3/5 width) */}
        <div className="lg:col-span-3 space-y-5">
          {/* Overview Card */}
          {ritual.description && (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50">
                <h2 className="text-sm font-bold text-gray-800 tracking-tight flex items-center gap-2">
                  <BookOpen size={14} className="text-amber-500" />
                  Overview
                </h2>
              </div>
              <div className="p-5">
                <p className="text-sm text-gray-600 leading-relaxed">{ritual.description}</p>
                {ritual.religiousNotes && (
                  <div className="mt-4 pt-4 border-t border-gray-50">
                    <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                      Religious Notes
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{ritual.religiousNotes}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Cultural Meaning Card */}
          {ritual.culturalMeaning && (
            <div className="rounded-2xl overflow-hidden border border-amber-100/70">
              <div className="bg-gradient-to-br from-amber-50 via-orange-50/50 to-amber-50/30 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Heart size={14} className="text-amber-600" />
                  </div>
                  <h2 className="text-sm font-bold text-amber-800 tracking-tight">
                    Cultural Meaning
                  </h2>
                </div>
                <p className="text-sm text-amber-900/70 leading-relaxed">
                  {ritual.culturalMeaning}
                </p>
              </div>
            </div>
          )}

          {/* Planning Details Card */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50">
              <h2 className="text-sm font-bold text-gray-800 tracking-tight flex items-center gap-2">
                <Star size={14} className="text-amber-500" />
                Planning Details
              </h2>
            </div>
            <div className="p-5 space-y-0.5 divide-y divide-gray-50">
              {ritual.expectedDurationMinutes && (
                <InfoRow icon={Clock} label="Expected Duration" value={`${ritual.expectedDurationMinutes} minutes`} />
              )}
              {ritual.typicalTimeOfDay && (
                <InfoRow icon={Sun} label="Time of Day" value={ritual.typicalTimeOfDay} />
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
                  icon={Eye}
                  label="Audience"
                  value={ritual.familyOnlyOrGuest === "family-only" ? "Family Only" : "Guest-Facing"}
                />
              )}
              {ritual.performedBy && (
                <InfoRow icon={UserCheck} label="Performed By" value={ritual.performedBy} />
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

          {/* Items & Materials Card */}
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
                          className="text-[11px] font-semibold px-2.5 py-1.5 bg-red-50 text-red-700 rounded-lg border border-red-100"
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
                          className="text-[11px] font-semibold px-2.5 py-1.5 bg-gray-50 text-gray-600 rounded-lg border border-gray-100"
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

        {/* RIGHT COLUMN (2/5 width) */}
        <div className="lg:col-span-2 space-y-5">
          {/* Vendor Requirements Card */}
          {hasVendors && (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50">
                <h2 className="text-sm font-bold text-gray-800 tracking-tight flex items-center gap-2">
                  <Users size={14} className="text-amber-500" />
                  Vendor Requirements
                </h2>
              </div>
              <div className="p-5 space-y-5">
                {ritual.essentialVendors.length > 0 && (
                  <div>
                    <div className="text-[10px] font-semibold text-red-500 uppercase tracking-wider mb-2.5 flex items-center gap-1">
                      <AlertTriangle size={10} />
                      Essential
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {ritual.essentialVendors.map((v, i) => (
                        <VendorBadge key={i} name={v} variant="essential" />
                      ))}
                    </div>
                  </div>
                )}
                {ritual.suggestedVendors.length > 0 && (
                  <div>
                    <div className="text-[10px] font-semibold text-amber-600 uppercase tracking-wider mb-2.5">
                      Suggested
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {ritual.suggestedVendors.map((v, i) => (
                        <VendorBadge key={i} name={v} variant="suggested" />
                      ))}
                    </div>
                  </div>
                )}
                {ritual.optionalVendors.length > 0 && (
                  <div>
                    <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
                      Optional
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {ritual.optionalVendors.map((v, i) => (
                        <VendorBadge key={i} name={v} variant="optional" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Atmosphere Card */}
          {hasAtmosphere && (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50">
                <h2 className="text-sm font-bold text-gray-800 tracking-tight flex items-center gap-2">
                  <Palette size={14} className="text-amber-500" />
                  Atmosphere
                </h2>
              </div>
              <div className="p-5 space-y-2.5">
                <ImportanceBar label="Music" level={ritual.commonMusicLevel} icon={Music} />
                <ImportanceBar label="Food" level={ritual.foodImportance} icon={UtensilsCrossed} />
                <ImportanceBar label="Decor" level={ritual.decorImportance} icon={Palette} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── C) FULL-WIDTH CHECKLIST ────────────── */}
      {checklistSections.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-800 tracking-tight flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-500" />
              Planner Checklist
            </h2>
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              {checklistSections.reduce((acc, s) => acc + (s.items?.length || 0), 0)} items
            </span>
          </div>
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-4">
              {checklistSections.map((section, si) => (
                <div
                  key={si}
                  className="rounded-xl border border-gray-100 overflow-hidden hover:border-gray-200 transition-colors"
                >
                  <div className="px-4 py-3 bg-gray-50/80 border-b border-gray-100">
                    <h3 className="text-xs font-bold text-gray-700 flex items-center justify-between">
                      {section.title}
                      <span className="text-[10px] font-medium text-gray-400">
                        {(section.items || []).length} items
                      </span>
                    </h3>
                  </div>
                  <div className="p-4 space-y-2.5">
                    {(section.items || []).map((item, ii) => (
                      <div key={ii} className="flex items-start gap-2.5 group">
                        <div className="w-4 h-4 rounded border-2 border-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:border-emerald-300 transition-colors">
                          <div className="w-1.5 h-1.5 rounded-sm bg-gray-200 group-hover:bg-emerald-300 transition-colors" />
                        </div>
                        <span className="text-xs text-gray-600 leading-relaxed">{item}</span>
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
