import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  UtensilsCrossed,
  Leaf,
  Flame,
  DollarSign,
  Check,
  X,
  HelpCircle,
  Star,
  Globe,
  StickyNote,
  ChefHat,
  Package,
  ChevronDown,
  Sparkles,
  CircleDot,
  Users,
  MapPin,
} from "lucide-react";

export const dynamic = "force-dynamic";

// ── Helpers ──────────────────────────────────────

/** "welcomeDrinks" -> "Welcome Drinks", "chaatAndStreetFood" -> "Chaat & Street Food" */
function formatSectionKey(key: string): string {
  const SPECIAL: Record<string, string> = {
    welcomeDrinks: "Welcome Drinks",
    chaatAndStreetFood: "Chaat & Street Food",
    lightSnacks: "Light Snacks",
    paneerDishes: "Paneer Dishes",
    vegetableDishes: "Vegetable Dishes",
    liveStations: "Live Stations",
    mainCourse: "Main Course",
    riceAndBiryani: "Rice & Biryani",
    breadsAndNaan: "Breads & Naan",
    daalAndLentils: "Daal & Lentils",
    southIndian: "South Indian",
    indianChinese: "Indian Chinese",
    tandooriStarters: "Tandoori Starters",
    soupAndSalad: "Soup & Salad",
    iceCreamAndKulfi: "Ice Cream & Kulfi",
    paanAndMukhwas: "Paan & Mukhwas",
    mithai: "Mithai (Indian Sweets)",
  };
  if (SPECIAL[key]) return SPECIAL[key];
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

function DietBadge({ diet }: { diet?: string }) {
  if (!diet) return null;
  const d = diet.toLowerCase();
  if (d.includes("jain")) {
    return (
      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-purple-700 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-full uppercase tracking-wide">
        <CircleDot size={8} />
        Jain
      </span>
    );
  }
  if (d.includes("non-veg") || d.includes("nonveg") || d.includes("non veg")) {
    return (
      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-red-700 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full uppercase tracking-wide">
        <Flame size={8} />
        Non-Veg
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wide">
      <Leaf size={8} />
      Veg
    </span>
  );
}

function PopularityStars({ level }: { level?: string }) {
  if (!level) return <span className="text-[10px] text-gray-300">--</span>;
  const l = level.toLowerCase();
  const stars = l.includes("high") ? 3 : l.includes("medium") ? 2 : 1;
  return (
    <span className="flex items-center gap-0.5" title={`${level} popularity`}>
      {Array.from({ length: 3 }).map((_, i) => (
        <Star
          key={i}
          size={11}
          className={i < stars ? "text-amber-400 drop-shadow-sm" : "text-gray-200"}
          fill={i < stars ? "currentColor" : "none"}
        />
      ))}
    </span>
  );
}

function SourcingBadge({ easy }: { easy?: boolean | string }) {
  if (easy === true || easy === "Yes" || easy === "yes") {
    return (
      <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
        <Check size={10} strokeWidth={3} />
        <span className="text-[9px] font-bold">MX Ready</span>
      </span>
    );
  }
  if (easy === false || easy === "No" || easy === "no") {
    return (
      <span className="inline-flex items-center gap-1 text-red-500 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
        <X size={10} strokeWidth={3} />
        <span className="text-[9px] font-bold">Hard</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-amber-500 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
      <HelpCircle size={10} />
      <span className="text-[9px] font-bold">Maybe</span>
    </span>
  );
}

const INTENSITY_CONFIG: Record<string, { dot: string; bg: string; label: string; icon: typeof Flame }> = {
  light:    { dot: "bg-emerald-400", bg: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "Light",    icon: Leaf },
  moderate: { dot: "bg-amber-400",   bg: "bg-amber-50 text-amber-700 border-amber-200",     label: "Moderate", icon: Flame },
  full:     { dot: "bg-orange-500",  bg: "bg-orange-50 text-orange-700 border-orange-200",   label: "Full",     icon: Flame },
};

const SECTION_ICONS: Record<string, string> = {
  starters: "🥗",
  mains: "🍛",
  mainCourse: "🍛",
  desserts: "🍮",
  welcomeDrinks: "🥂",
  chaatAndStreetFood: "🌮",
  lightSnacks: "🥜",
  breads: "🫓",
  breadsAndNaan: "🫓",
  riceAndBiryani: "🍚",
  daalAndLentils: "🫘",
  tandooriStarters: "🔥",
  soupAndSalad: "🥣",
  paneerDishes: "🧀",
  vegetableDishes: "🥦",
  liveStations: "👨‍🍳",
  southIndian: "🫔",
  indianChinese: "🥡",
  iceCreamAndKulfi: "🍨",
  paanAndMukhwas: "🍃",
  mithai: "🍬",
  beverages: "☕",
  drinks: "🍹",
};

// ── Page ─────────────────────────────────────────

interface MenuDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function MenuDetailPage(props: MenuDetailPageProps) {
  const { id } = await props.params;

  const template = await db.menuTemplate.findUnique({ where: { id } });
  if (!template) notFound();

  const sections = (template.menuSections || {}) as Record<string, any[]>;
  const intensity =
    INTENSITY_CONFIG[(template.mealIntensity || "").toLowerCase()] ||
    INTENSITY_CONFIG.moderate;
  const IntensityIcon = intensity.icon;

  const activeSections = Object.entries(sections).filter(
    ([, items]) => Array.isArray(items) && items.length > 0
  );

  const totalItems = activeSections.reduce((s, [, items]) => s + items.length, 0);

  // Count diet breakdown
  const dietCounts = { veg: 0, nonVeg: 0, jain: 0 };
  activeSections.forEach(([, items]) => {
    items.forEach((item: any) => {
      const d = (item.vegNonVegJain || "").toLowerCase();
      if (d.includes("jain")) dietCounts.jain++;
      else if (d.includes("non")) dietCounts.nonVeg++;
      else dietCounts.veg++;
    });
  });

  // Package data
  const standardPkg = template.standardPackage as Record<string, any> | any[] | null;
  const premiumPkg = template.premiumPackage as Record<string, any> | any[] | null;
  const lightPkg = template.lightPackage as Record<string, any> | any[] | null;
  const hasPackages = standardPkg || premiumPkg || lightPkg;

  return (
    <div className="space-y-6 pb-12">
      {/* ── Back Link ─────────────────────────────── */}
      <Link
        href="/catering"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-600 transition group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
        Back to Menu & Catering
      </Link>

      {/* ── Hero Section ──────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="relative bg-gradient-to-br from-[#1a1814] via-[#2d2a24] to-[#3d3428] px-8 py-8 overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute top-4 right-8 w-64 h-64 rounded-full bg-amber-300 blur-3xl" />
            <div className="absolute bottom-0 left-12 w-48 h-48 rounded-full bg-orange-400 blur-3xl" />
          </div>

          <div className="relative flex items-start gap-5">
            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 backdrop-blur-sm border border-white/10 flex items-center justify-center flex-shrink-0">
              <UtensilsCrossed size={28} className="text-amber-300" />
            </div>

            <div className="flex-1 min-w-0">
              {/* Event type */}
              <h1 className="text-2xl font-bold text-white font-display tracking-tight">
                {template.eventType}
              </h1>

              {/* Badges row */}
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                {template.eventStyle && (
                  <span className="text-[10px] font-semibold text-gray-300 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/5">
                    {template.eventStyle}
                  </span>
                )}
                {template.recommendedServiceStyle && (
                  <span className="text-[10px] font-semibold text-gray-300 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/5">
                    {template.recommendedServiceStyle}
                  </span>
                )}
                <span
                  className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 border ${intensity.bg}`}
                >
                  <IntensityIcon size={10} />
                  {intensity.label} Meal
                </span>
              </div>

              {/* Quick stats */}
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <ChefHat size={14} className="text-amber-300" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white leading-none">{totalItems}</div>
                    <div className="text-[10px] text-gray-500 font-medium">Items</div>
                  </div>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <Package size={14} className="text-amber-300" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white leading-none">{activeSections.length}</div>
                    <div className="text-[10px] text-gray-500 font-medium">Sections</div>
                  </div>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    {dietCounts.veg} veg
                  </span>
                  {dietCounts.nonVeg > 0 && (
                    <span className="flex items-center gap-1 ml-2">
                      <span className="w-2 h-2 rounded-full bg-red-400" />
                      {dietCounts.nonVeg} non-veg
                    </span>
                  )}
                  {dietCounts.jain > 0 && (
                    <span className="flex items-center gap-1 ml-2">
                      <span className="w-2 h-2 rounded-full bg-purple-400" />
                      {dietCounts.jain} jain
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Cuisine & Notes ───────────────────────── */}
      {(template.idealCuisineApproach || template.notes) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {template.idealCuisineApproach && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
                  <Globe size={14} className="text-amber-500" />
                </div>
                <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Cuisine Approach
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {template.idealCuisineApproach}
              </p>
            </div>
          )}

          {template.notes && (
            <div className="bg-gradient-to-br from-amber-50/80 to-orange-50/40 rounded-2xl border border-amber-200/60 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100/80 flex items-center justify-center">
                  <StickyNote size={14} className="text-amber-600" />
                </div>
                <div className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider">
                  Notes
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {template.notes}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Menu Sections ─────────────────────────── */}
      {activeSections.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-800 tracking-tight flex items-center gap-2">
              <span className="w-1 h-4 bg-gradient-to-b from-amber-400 to-orange-500 rounded-full" />
              Full Menu Breakdown
            </h2>
            <span className="text-[10px] font-semibold text-gray-400 tracking-wider uppercase">
              {totalItems} items across {activeSections.length} sections
            </span>
          </div>

          {activeSections.map(([sectionKey, items], sectionIdx) => {
            const emoji = SECTION_ICONS[sectionKey] || "🍽️";
            return (
              <details
                key={sectionKey}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                open={sectionIdx < 3}
              >
                {/* Section header (clickable) */}
                <summary className="px-5 py-4 flex items-center justify-between cursor-pointer select-none hover:bg-gray-50/50 transition-colors list-none [&::-webkit-details-marker]:hidden">
                  <div className="flex items-center gap-3">
                    <span className="text-lg" role="img" aria-label={sectionKey}>
                      {emoji}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-gray-800 tracking-tight">
                        {formatSectionKey(sectionKey)}
                      </h3>
                      <span className="text-[10px] text-gray-400 font-medium">
                        {items.length} item{items.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                  <ChevronDown
                    size={16}
                    className="text-gray-300 group-open:rotate-180 transition-transform duration-200"
                  />
                </summary>

                {/* Items table */}
                <div className="border-t border-gray-50 overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-gray-50/50">
                        <th className="px-5 py-2.5 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider w-[30%]">
                          Item
                        </th>
                        <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                          Diet
                        </th>
                        <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                          Cuisine
                        </th>
                        <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                          Popularity
                        </th>
                        <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                          <span className="flex items-center gap-1">
                            <MapPin size={9} />
                            Mexico
                          </span>
                        </th>
                        <th className="px-3 py-2.5 text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                          <span className="flex items-center gap-1 justify-end">
                            <DollarSign size={9} />
                            Price/PP
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {items.map((item: any, idx: number) => (
                        <tr
                          key={idx}
                          className="hover:bg-amber-50/30 transition-colors"
                        >
                          <td className="px-5 py-3">
                            <div className="font-semibold text-gray-800">
                              {item.itemName || item.name || "Unnamed"}
                            </div>
                            {item.notes && (
                              <div className="text-[10px] text-gray-400 mt-0.5 line-clamp-2 max-w-xs">
                                {item.notes}
                              </div>
                            )}
                          </td>
                          <td className="px-3 py-3">
                            <DietBadge diet={item.vegNonVegJain} />
                          </td>
                          <td className="px-3 py-3 text-gray-500">
                            {item.cuisineStyle || (
                              <span className="text-gray-300">--</span>
                            )}
                          </td>
                          <td className="px-3 py-3">
                            <PopularityStars level={item.popularityLevel} />
                          </td>
                          <td className="px-3 py-3">
                            <SourcingBadge easy={item.easyToSourceInMexico} />
                          </td>
                          <td className="px-3 py-3 text-right">
                            {item.estimatedPricePerPersonUSD != null ? (
                              <span className="font-semibold text-gray-700 bg-gray-50 px-2 py-0.5 rounded-md">
                                ${Number(item.estimatedPricePerPersonUSD).toFixed(2)}
                              </span>
                            ) : (
                              <span className="text-gray-300">--</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            );
          })}
        </div>
      )}

      {/* ── Package Comparison ────────────────────── */}
      {hasPackages && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-gray-800 tracking-tight flex items-center gap-2">
            <span className="w-1 h-4 bg-gradient-to-b from-amber-400 to-orange-500 rounded-full" />
            Package Comparison
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <PackageCard
              title="Standard"
              subtitle="Recommended"
              data={standardPkg}
              accent="emerald"
              icon={<Package size={18} className="text-emerald-500" />}
              headerGradient="from-emerald-50 to-emerald-100/50"
              borderColor="border-emerald-200"
            />
            <PackageCard
              title="Premium"
              subtitle="Upgraded"
              data={premiumPkg}
              accent="amber"
              icon={<Sparkles size={18} className="text-amber-500" />}
              headerGradient="from-amber-50 to-amber-100/50"
              borderColor="border-amber-200"
              featured
            />
            <PackageCard
              title="Light"
              subtitle="Minimal"
              data={lightPkg}
              accent="blue"
              icon={<Leaf size={18} className="text-blue-500" />}
              headerGradient="from-blue-50 to-blue-100/50"
              borderColor="border-blue-200"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ── Package Card ─────────────────────────────────

function PackageCard({
  title,
  subtitle,
  data,
  accent,
  icon,
  headerGradient,
  borderColor,
  featured,
}: {
  title: string;
  subtitle: string;
  data: Record<string, any> | any[] | null;
  accent: "emerald" | "amber" | "blue";
  icon: React.ReactNode;
  headerGradient: string;
  borderColor: string;
  featured?: boolean;
}) {
  const checkColor =
    accent === "emerald"
      ? "text-emerald-400"
      : accent === "amber"
      ? "text-amber-400"
      : "text-blue-400";

  const countItems = (d: any): number => {
    if (!d) return 0;
    if (Array.isArray(d)) return d.length;
    if (typeof d === "object") {
      return Object.values(d).reduce((sum: number, val) => {
        if (Array.isArray(val)) return sum + val.length;
        return sum;
      }, 0);
    }
    return 0;
  };

  const itemCount = countItems(data);

  return (
    <div
      className={`bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-md transition-all ${
        featured ? `${borderColor} ring-1 ring-amber-200/50` : "border-gray-100"
      }`}
    >
      {/* Header */}
      <div className={`bg-gradient-to-r ${headerGradient} px-5 py-4 border-b ${borderColor}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/80 shadow-sm flex items-center justify-center">
              {icon}
            </div>
            <div>
              <div className="text-sm font-bold text-gray-800">{title}</div>
              <div className="text-[10px] text-gray-500 font-medium">{subtitle}</div>
            </div>
          </div>
          {data && (
            <span className="text-[10px] font-bold text-gray-400 bg-white/60 px-2 py-1 rounded-full">
              {itemCount} items
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {!data ? (
          <div className="text-center py-8">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mx-auto mb-2">
              <Package size={16} className="text-gray-300" />
            </div>
            <p className="text-xs text-gray-400 italic">Not configured</p>
          </div>
        ) : Array.isArray(data) ? (
          /* Flat array of items */
          <ul className="space-y-2">
            {data.map((item: any, i: number) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-gray-600">
                <Check size={12} className={`mt-0.5 flex-shrink-0 ${checkColor}`} strokeWidth={2.5} />
                <span>{typeof item === "string" ? item : item.itemName || item.name || JSON.stringify(item)}</span>
              </li>
            ))}
          </ul>
        ) : (
          /* Object with section keys */
          (() => {
            const packageSections = Object.entries(data).filter(
              ([, val]) => Array.isArray(val) && val.length > 0
            );

            if (packageSections.length > 0) {
              return (
                <div className="space-y-4">
                  {packageSections.map(([section, items]) => (
                    <div key={section}>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <span className="w-4 h-px bg-gray-200" />
                        {formatSectionKey(section)}
                        <span className="text-gray-300">({(items as any[]).length})</span>
                      </div>
                      <ul className="space-y-1.5 ml-2">
                        {(items as any[]).map((item: any, i: number) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-xs text-gray-600"
                          >
                            <Check size={11} className={`mt-0.5 flex-shrink-0 ${checkColor}`} strokeWidth={2.5} />
                            <span>
                              {typeof item === "string"
                                ? item
                                : item.itemName || item.name || JSON.stringify(item)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              );
            }

            /* Fallback: key-value pairs */
            return (
              <div className="space-y-2">
                {Object.entries(data).map(([key, val]) => (
                  <div key={key} className="flex items-start gap-2 text-xs text-gray-600">
                    <Check size={11} className={`mt-0.5 flex-shrink-0 ${checkColor}`} strokeWidth={2.5} />
                    <span>
                      <span className="font-semibold text-gray-700">
                        {formatSectionKey(key)}:
                      </span>{" "}
                      {typeof val === "string" ? val : JSON.stringify(val)}
                    </span>
                  </div>
                ))}
              </div>
            );
          })()
        )}
      </div>
    </div>
  );
}
