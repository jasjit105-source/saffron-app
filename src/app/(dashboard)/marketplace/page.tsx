import { db } from "@/lib/db";
import { Suspense } from "react";
import { Store, MapPin, Crown, TrendingUp } from "lucide-react";
import { PageHeader, SummaryCard } from "@/components/shared";
import { VendorCard } from "@/components/marketplace/VendorCard";
import { VendorFilters } from "@/components/marketplace/VendorFilters";

export const dynamic = "force-dynamic";

interface MarketplacePageProps {
  searchParams: Promise<{
    city?: string;
    category?: string;
    q?: string;
    top3?: string;
    indian?: string;
  }>;
}

async function MarketplaceContent({
  searchParams,
}: {
  searchParams: {
    city?: string;
    category?: string;
    q?: string;
    top3?: string;
    indian?: string;
  };
}) {
  const { city, category, q, top3, indian } = searchParams;

  // Build where clause
  const where: any = {};
  if (city) where.city = { slug: city };
  if (category) where.category = { slug: category };
  if (top3 === "true") where.top3 = true;
  if (indian === "true") where.suitableForIndianWedding = true;
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { notes: { contains: q, mode: "insensitive" } },
    ];
  }

  const [vendors, categories, cities, totalCount, top3Count, cityStats] =
    await Promise.all([
      db.marketplaceVendor.findMany({
        where,
        include: {
          city: true,
          category: true,
        },
        orderBy: [{ top3: "desc" }, { name: "asc" }],
      }),
      db.marketplaceCategory.findMany({
        orderBy: { sortOrder: "asc" },
        include: { _count: { select: { vendors: true } } },
      }),
      db.city.findMany({
        orderBy: { name: "asc" },
        include: { _count: { select: { vendors: true } } },
      }),
      db.marketplaceVendor.count(),
      db.marketplaceVendor.count({ where: { top3: true } }),
      db.city.findMany({
        include: { _count: { select: { vendors: true } } },
      }),
    ]);

  const suitableCount = await db.marketplaceVendor.count({
    where: { suitableForIndianWedding: true },
  });

  return (
    <div className="space-y-5">
      {/* Page header */}
      <PageHeader
        title="Vendor Marketplace"
        subtitle={`${totalCount} verified vendors across ${cities.length} cities in Mexico`}
      />

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <SummaryCard label="Total Vendors" value={totalCount} accent />
        <SummaryCard label="Cities" value={cities.length} />
        <SummaryCard
          label="Top Picks"
          value={top3Count}
          sub="Curated selections"
        />
        <SummaryCard
          label="Indian Wedding Ready"
          value={suitableCount}
          sub="Verified suitable"
        />
      </div>

      {/* Filters */}
      <VendorFilters categories={categories} cities={cities} />

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
          {vendors.length} vendor{vendors.length !== 1 ? "s" : ""} found
          {city && ` in ${cities.find((c) => c.slug === city)?.name || city}`}
          {category &&
            ` · ${categories.find((c) => c.slug === category)?.name || category}`}
        </p>
      </div>

      {/* Vendor grid */}
      {vendors.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vendors.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-4">
            <Store size={28} className="text-amber-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            No Vendors Found
          </h3>
          <p className="text-sm text-gray-400 max-w-md mx-auto">
            Try adjusting your filters or search query.
          </p>
        </div>
      )}
    </div>
  );
}

export default async function MarketplacePage(props: MarketplacePageProps) {
  const searchParams = await props.searchParams;
  return (
    <Suspense
      fallback={
        <div className="space-y-5">
          <PageHeader title="Vendor Marketplace" subtitle="Loading..." />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse h-48"
              />
            ))}
          </div>
        </div>
      }
    >
      <MarketplaceContent searchParams={searchParams} />
    </Suspense>
  );
}
