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
  };
  if (SPECIAL[key]) return SPECIAL[key];
  // Generic camelCase -> Title Case
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
      <span className="text-[9px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md uppercase tracking-wide">
        Jain
      </span>
    );
  }
  if (d.includes("non-veg") || d.includes("nonveg") || d.includes("non veg")) {
    return (
      <span className="text-[9px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-md uppercase tracking-wide">
        Non-Veg
      </span>
    );
  }
  return (
    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-wide">
      Veg
    </span>
  );
}

function PopularityIndicator({ level }: { level?: string }) {
  if (!level) return null;
  const l = level.toLowerCase();
  const stars = l.includes("high") ? 3 : l.includes("medium") ? 2 : 1;
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 3 }).map((_, i) => (
        <Star
          key={i}
          size={10}
          className={i < stars ? "text-amber-400" : "text-gray-200"}
          fill={i < stars ? "currentColor" : "none"}
        />
      ))}
    </span>
  );
}

function SourcingBadge({ easy }: { easy?: boolean | string }) {
  if (easy === true || easy === "Yes" || easy === "yes") {
    return (
      <span className="flex items-center gap-0.5 text-emerald-600">
        <Check size={12} />
        <span className="text-[9px] font-semibold">Sourceable</span>
      </span>
    );
  }
  if (easy === false || easy === "No" || easy === "no") {
    return (
      <span className="flex items-center gap-0.5 text-red-500">
        <X size={12} />
        <span className="text-[9px] font-semibold">Hard</span>
      </span>
    );
  }
  return (
    <span className="flex items-center gap-0.5 text-amber-500">
      <HelpCircle size={12} />
      <span className="text-[9px] font-semibold">Maybe</span>
    </span>
  );
}

const INTENSITY_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  light: { color: "bg-emerald-400", bg: "bg-emerald-50 text-emerald-700", label: "Light" },
  moderate: { color: "bg-amber-400", bg: "bg-amber-50 text-amber-700", label: "Moderate" },
  full: { color: "bg-orange-500", bg: "bg-orange-50 text-orange-700", label: "Full" },
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

  // Determine which sections have items
  const activeSections = Object.entries(sections).filter(
    ([, items]) => Array.isArray(items) && items.length > 0
  );

  const totalItems = activeSections.reduce((s, [, items]) => s + items.length, 0);

  // Package data
  const standardPkg = template.standardPackage as Record<string, any> | null;
  const premiumPkg = template.premiumPackage as Record<string, any> | null;
  const lightPkg = template.lightPackage as Record<string, any> | null;
  const hasPackages = standardPkg || premiumPkg || lightPkg;

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/catering"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-600 transition"
      >
        <ArrowLeft size={14} />
        Back to Menu & Catering
      </Link>

      {/* Hero */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-[#2d2a24] to-[#4a3f2f] px-6 py-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center flex-shrink-0">
              <UtensilsCrossed size={24} className="text-amber-300" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-white font-display">
                {template.eventType}
              </h1>
              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                {template.eventStyle && (
                  <span className="text-xs text-gray-400">
                    {template.eventStyle}
                  </span>
                )}
                {template.recommendedServiceStyle && (
                  <>
                    <span className="text-gray-600">·</span>
                    <span className="text-xs text-gray-400">
                      {template.recommendedServiceStyle}
                    </span>
                  </>
                )}
                <span className="text-gray-600">·</span>
                <span
                  className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-lg uppercase tracking-wider flex items-center gap-1.5 ${intensity.bg}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${intensity.color}`} />
                  {intensity.label} Meal
                </span>
              </div>
              <div className="flex items-center gap-4 mt-3">
                <span className="flex items-center gap-1.5 text-xs text-gray-300">
                  <ChefHat size={13} />
                  {totalItems} items
                </span>
                <span className="flex items-center gap-1.5 text-xs text-gray-300">
                  <Package size={13} />
                  {activeSections.length} sections
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Cuisine approach & notes */}
        <div className="p-6 space-y-4">
          {template.idealCuisineApproach && (
            <div className="flex items-start gap-2.5">
              <Globe size={14} className="text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Cuisine Approach
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {template.idealCuisineApproach}
                </p>
              </div>
            </div>
          )}
          {template.notes && (
            <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-100">
              <div className="flex items-center gap-1.5 mb-2">
                <StickyNote size={13} className="text-amber-500" />
                <span className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider">
                  Notes
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {template.notes}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Menu Sections */}
      {activeSections.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-gray-800 tracking-tight">
            Full Menu Breakdown
          </h2>

          {activeSections.map(([sectionKey, items]) => (
            <div
              key={sectionKey}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
            >
              {/* Section header */}
              <div className="px-5 py-3.5 border-b border-gray-50 flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-800 tracking-tight">
                  {formatSectionKey(sectionKey)}
                </h3>
                <span className="text-[10px] font-semibold text-gray-400 tracking-wider uppercase">
                  {items.length} item{items.length !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Items table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-50 text-left">
                      <th className="px-5 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                        Item
                      </th>
                      <th className="px-3 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                        Diet
                      </th>
                      <th className="px-3 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                        Cuisine
                      </th>
                      <th className="px-3 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                        Popularity
                      </th>
                      <th className="px-3 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                        Mexico
                      </th>
                      <th className="px-3 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-right">
                        Price/PP
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
                            <div className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">
                              {item.notes}
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-3">
                          <DietBadge diet={item.vegNonVegJain} />
                        </td>
                        <td className="px-3 py-3 text-gray-500">
                          {item.cuisineStyle || "--"}
                        </td>
                        <td className="px-3 py-3">
                          <PopularityIndicator level={item.popularityLevel} />
                        </td>
                        <td className="px-3 py-3">
                          <SourcingBadge easy={item.easyToSourceInMexico} />
                        </td>
                        <td className="px-3 py-3 text-right text-gray-600 font-medium">
                          {item.estimatedPricePerPersonUSD != null
                            ? `$${Number(item.estimatedPricePerPersonUSD).toFixed(2)}`
                            : "--"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Package Comparison */}
      {hasPackages && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-gray-800 tracking-tight">
            Package Comparison
          </h2>

          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
              {/* Standard */}
              <PackageColumn
                title="Standard"
                data={standardPkg}
                accent="emerald"
                icon={<Package size={16} className="text-emerald-500" />}
              />
              {/* Premium */}
              <PackageColumn
                title="Premium"
                data={premiumPkg}
                accent="amber"
                icon={<Star size={16} className="text-amber-500" />}
              />
              {/* Light */}
              <PackageColumn
                title="Light"
                data={lightPkg}
                accent="blue"
                icon={<Leaf size={16} className="text-blue-500" />}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Package Column ───────────────────────────────

function PackageColumn({
  title,
  data,
  accent,
  icon,
}: {
  title: string;
  data: Record<string, any> | null;
  accent: "emerald" | "amber" | "blue";
  icon: React.ReactNode;
}) {
  const headerBg =
    accent === "emerald"
      ? "bg-emerald-50"
      : accent === "amber"
      ? "bg-amber-50"
      : "bg-blue-50";

  if (!data) {
    return (
      <div className="p-5">
        <div className={`flex items-center gap-2 mb-3 px-3 py-2 rounded-lg ${headerBg}`}>
          {icon}
          <span className="text-sm font-bold text-gray-700">{title}</span>
        </div>
        <p className="text-xs text-gray-400 italic text-center py-6">
          Not configured
        </p>
      </div>
    );
  }

  // Package data can be: { sectionKey: ["item1", "item2"] } or { sectionKey: [{itemName: "..."}] }
  const packageSections = Object.entries(data).filter(
    ([, val]) => Array.isArray(val) && val.length > 0
  );

  // Fallback: if data is a flat array
  const flatItems = Array.isArray(data) ? data : null;

  return (
    <div className="p-5">
      <div className={`flex items-center gap-2 mb-3 px-3 py-2 rounded-lg ${headerBg}`}>
        {icon}
        <span className="text-sm font-bold text-gray-700">{title}</span>
      </div>

      {flatItems ? (
        <ul className="space-y-1.5">
          {flatItems.map((item: any, i: number) => (
            <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
              <Check size={11} className={`mt-0.5 flex-shrink-0 text-${accent}-400`} />
              <span>{typeof item === "string" ? item : item.itemName || item.name || JSON.stringify(item)}</span>
            </li>
          ))}
        </ul>
      ) : packageSections.length > 0 ? (
        <div className="space-y-3">
          {packageSections.map(([section, items]) => (
            <div key={section}>
              <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                {formatSectionKey(section)}
              </div>
              <ul className="space-y-1">
                {(items as any[]).map((item: any, i: number) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-xs text-gray-600"
                  >
                    <Check size={11} className="mt-0.5 flex-shrink-0 text-gray-300" />
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
      ) : (
        <div className="space-y-1.5">
          {Object.entries(data).map(([key, val]) => (
            <div key={key} className="flex items-start gap-2 text-xs text-gray-600">
              <Check size={11} className="mt-0.5 flex-shrink-0 text-gray-300" />
              <span>
                <span className="font-medium text-gray-700">
                  {formatSectionKey(key)}:
                </span>{" "}
                {typeof val === "string" ? val : JSON.stringify(val)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
