import { db } from "@/lib/db";
import Link from "next/link";
import {
  UtensilsCrossed,
  Leaf,
  ChefHat,
  Flame,
  Package,
  ArrowRight,
  Globe,
} from "lucide-react";
import { PageHeader, SummaryCard } from "@/components/shared";

export const dynamic = "force-dynamic";

// ── Helpers ──────────────────────────────────────

function countAllItems(menuSections: Record<string, any[]>): number {
  if (!menuSections || typeof menuSections !== "object") return 0;
  return Object.values(menuSections).reduce(
    (sum, items) => sum + (Array.isArray(items) ? items.length : 0),
    0
  );
}

function countItemsWithProperty(
  menuSections: Record<string, any[]>,
  key: string,
  match: (val: any) => boolean
): number {
  if (!menuSections || typeof menuSections !== "object") return 0;
  return Object.values(menuSections).reduce((sum, items) => {
    if (!Array.isArray(items)) return sum;
    return sum + items.filter((item) => match(item[key])).length;
  }, 0);
}

const INTENSITY_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  light: { color: "bg-emerald-400", bg: "bg-emerald-50 text-emerald-700", label: "Light" },
  moderate: { color: "bg-amber-400", bg: "bg-amber-50 text-amber-700", label: "Moderate" },
  full: { color: "bg-orange-500", bg: "bg-orange-50 text-orange-700", label: "Full" },
};

// ── Page ─────────────────────────────────────────

export default async function CateringPage() {
  const templates = await db.menuTemplate.findMany({
    where: { isActive: true },
    orderBy: { eventType: "asc" },
  });

  // Aggregate stats
  const totalItems = templates.reduce(
    (sum, t) => sum + countAllItems(t.menuSections as Record<string, any[]>),
    0
  );
  const jainCount = templates.reduce(
    (sum, t) =>
      sum +
      countItemsWithProperty(
        t.menuSections as Record<string, any[]>,
        "vegNonVegJain",
        (v) => typeof v === "string" && v.toLowerCase().includes("jain")
      ),
    0
  );
  const easySourceCount = templates.reduce(
    (sum, t) =>
      sum +
      countItemsWithProperty(
        t.menuSections as Record<string, any[]>,
        "easyToSourceInMexico",
        (v) => v === true || v === "Yes" || v === "yes"
      ),
    0
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <PageHeader
        title="Menu & Catering Intelligence"
        subtitle="Curated menu templates, dietary insights, and sourcing intelligence for every event."
      />

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <SummaryCard
          label="Event Templates"
          value={templates.length}
          accent
          sub="Active menus"
        />
        <SummaryCard
          label="Total Menu Items"
          value={totalItems}
          sub="Across all events"
        />
        <SummaryCard
          label="Jain-Friendly"
          value={jainCount}
          sub="Diet compliant"
        />
        <SummaryCard
          label="Easy to Source"
          value={easySourceCount}
          sub="Available in Mexico"
        />
      </div>

      {/* Event cards grid */}
      {templates.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => {
            const sections = template.menuSections as Record<string, any[]>;
            const itemCount = countAllItems(sections);
            const intensity = INTENSITY_CONFIG[
              (template.mealIntensity || "").toLowerCase()
            ] || INTENSITY_CONFIG.moderate;
            const hasStandard = template.standardPackage != null;
            const hasPremium = template.premiumPackage != null;
            const hasLight = template.lightPackage != null;

            return (
              <Link
                key={template.id}
                href={`/catering/${template.id}`}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-amber-200 transition-all duration-200"
              >
                {/* Card header gradient */}
                <div className="bg-gradient-to-r from-[#2d2a24] to-[#4a3f2f] px-5 py-4">
                  <h3 className="text-lg font-bold text-white font-display leading-tight group-hover:text-amber-200 transition-colors">
                    {template.eventType}
                  </h3>
                  {template.eventStyle && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {template.eventStyle}
                    </p>
                  )}
                </div>

                {/* Card body */}
                <div className="p-5 space-y-4">
                  {/* Service style & meal intensity */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {template.recommendedServiceStyle && (
                      <span className="text-[10px] font-semibold text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                        {template.recommendedServiceStyle}
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1.5 ${intensity.bg}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${intensity.color}`} />
                      {intensity.label}
                    </span>
                  </div>

                  {/* Cuisine approach */}
                  {template.idealCuisineApproach && (
                    <div className="flex items-start gap-2">
                      <Globe size={13} className="text-gray-300 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                        {template.idealCuisineApproach}
                      </p>
                    </div>
                  )}

                  {/* Stats row */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                    <div className="flex items-center gap-1.5">
                      <ChefHat size={13} className="text-amber-400" />
                      <span className="text-xs font-semibold text-gray-700">
                        {itemCount} items
                      </span>
                    </div>

                    {/* Package badges */}
                    <div className="flex items-center gap-1.5">
                      {hasStandard && (
                        <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                          Standard
                        </span>
                      )}
                      {hasPremium && (
                        <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                          Premium
                        </span>
                      )}
                      {hasLight && (
                        <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                          Light
                        </span>
                      )}
                    </div>
                  </div>

                  {/* View link */}
                  <div className="flex items-center gap-1 text-xs font-semibold text-amber-600 group-hover:text-amber-700 transition-colors">
                    View Full Menu
                    <ArrowRight
                      size={13}
                      className="group-hover:translate-x-0.5 transition-transform"
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-4">
            <UtensilsCrossed size={28} className="text-amber-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            No Menu Templates Yet
          </h3>
          <p className="text-sm text-gray-400 max-w-md mx-auto">
            Menu templates will appear here once they are added to the database.
          </p>
        </div>
      )}
    </div>
  );
}
