import { PrismaClient } from "@prisma/client";
import vendorData from "./data/vendors-mexico.json";

const prisma = new PrismaClient();

// ── Category icons & sort order ──
const CATEGORY_META: Record<string, { icon: string; sort: number }> = {
  "Venues":                     { icon: "🏛️", sort: 1 },
  "Food & Catering":            { icon: "🍽️", sort: 2 },
  "Decor & Design":             { icon: "🌺", sort: 3 },
  "Photography & Video":        { icon: "📸", sort: 4 },
  "Entertainment":              { icon: "🎵", sort: 5 },
  "Beauty & Culture":           { icon: "✨", sort: 6 },
  "Production & Infrastructure":{ icon: "🎪", sort: 7 },
  "Logistics & Hospitality":    { icon: "🏨", sort: 8 },
  "Rentals":                    { icon: "🪑", sort: 9 },
  "Wedding Planner":            { icon: "📋", sort: 10 },
};

function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function cleanString(val: string | null | undefined): string | null {
  if (!val) return null;
  const trimmed = val.trim();
  if (trimmed === "" || trimmed === "Not available" || trimmed === "N/A") return null;
  return trimmed;
}

async function main() {
  console.log("🌺 Seeding Marketplace vendors from JSON...\n");

  const vendors = (vendorData as any).vendors as Array<{
    name: string;
    category: string;
    city: string;
    phone: string;
    email: string;
    website: string;
    instagram: string;
    priceRange: string;
    description: string;
    rating: string;
    suitableForIndianWedding: string;
    notes: string;
    top3: boolean;
  }>;

  // ── 1. Collect unique cities and categories ──
  const uniqueCities = [...new Set(vendors.map((v) => v.city.trim()))];
  const uniqueCategories = [...new Set(vendors.map((v) => v.category.trim()))];

  // ── 2. Upsert cities ──
  const cityMap: Record<string, string> = {};
  for (const cityName of uniqueCities) {
    const slug = slugify(cityName);
    const city = await prisma.city.upsert({
      where: { slug },
      update: { name: cityName },
      create: { name: cityName, slug },
    });
    cityMap[cityName] = city.id;
  }
  console.log(`✅ ${uniqueCities.length} cities upserted: ${uniqueCities.join(", ")}`);

  // ── 3. Upsert categories ──
  const categoryMap: Record<string, string> = {};
  for (const catName of uniqueCategories) {
    const slug = slugify(catName);
    const meta = CATEGORY_META[catName] || { icon: "📦", sort: 99 };
    const cat = await prisma.marketplaceCategory.upsert({
      where: { slug },
      update: { name: catName, icon: meta.icon, sortOrder: meta.sort },
      create: { name: catName, slug, icon: meta.icon, sortOrder: meta.sort },
    });
    categoryMap[catName] = cat.id;
  }
  console.log(`✅ ${uniqueCategories.length} categories upserted: ${uniqueCategories.join(", ")}`);

  // ── 4. Upsert vendors ──
  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const v of vendors) {
    const name = v.name.trim();
    const cityName = v.city.trim();
    const catName = v.category.trim();
    const cityId = cityMap[cityName];
    const categoryId = categoryMap[catName];

    if (!cityId || !categoryId) {
      console.warn(`⚠️  Skipping "${name}" — missing city/category mapping`);
      skipped++;
      continue;
    }

    const data = {
      name,
      cityId,
      categoryId,
      phone: cleanString(v.phone),
      email: cleanString(v.email),
      website: cleanString(v.website),
      instagram: cleanString(v.instagram),
      priceRange: cleanString(v.priceRange),
      description: cleanString(v.description),
      rating: cleanString(v.rating),
      suitableForIndianWedding: v.suitableForIndianWedding === "Yes",
      notes: cleanString(v.notes),
      top3: v.top3 === true,
    };

    try {
      await prisma.marketplaceVendor.upsert({
        where: {
          name_cityId_categoryId: {
            name: data.name,
            cityId: data.cityId,
            categoryId: data.categoryId,
          },
        },
        update: data,
        create: data,
      });
      // Check if it was an update or create by checking updatedAt
      created++;
    } catch (err: any) {
      console.error(`❌ Error with "${name}": ${err.message}`);
      skipped++;
    }
  }

  console.log(`\n🎉 Marketplace seed complete!`);
  console.log(`   Total in JSON: ${vendors.length}`);
  console.log(`   Processed: ${created}`);
  console.log(`   Skipped: ${skipped}`);

  // ── 5. Print summary stats ──
  const totalVendors = await prisma.marketplaceVendor.count();
  const top3Count = await prisma.marketplaceVendor.count({ where: { top3: true } });
  const suitableCount = await prisma.marketplaceVendor.count({ where: { suitableForIndianWedding: true } });

  console.log(`\n📊 Database totals:`);
  console.log(`   Vendors: ${totalVendors}`);
  console.log(`   Top 3 picks: ${top3Count}`);
  console.log(`   Suitable for Indian weddings: ${suitableCount}`);

  const cityStats = await prisma.marketplaceVendor.groupBy({
    by: ["cityId"],
    _count: true,
  });
  const cities = await prisma.city.findMany();
  console.log(`\n🏙️  Vendors by city:`);
  for (const stat of cityStats) {
    const city = cities.find((c) => c.id === stat.cityId);
    console.log(`   ${city?.name}: ${stat._count}`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
