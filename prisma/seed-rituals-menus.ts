import { PrismaClient, WeddingType } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

// ── Religion string → WeddingType enum mapping ──
const RELIGION_MAP: Record<string, WeddingType> = {
  Sikh: "SIKH",
  Hindu: "HINDU",
  Jain: "CUSTOM",
  Common: "CUSTOM",
};

function loadJSON(filename: string): any {
  const filePath = path.join(
    __dirname,
    "data",
    "wedding-research",
    filename
  );
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

// ──────────────────────────────────────────────
// RITUAL SEEDING
// ──────────────────────────────────────────────

async function seedRituals() {
  console.log("🕉️  Loading ritual data...");

  const ritualsData = loadJSON("rituals_master.json");
  const vendorLinksData = loadJSON("ritual_vendor_links.json");

  const rituals = ritualsData.rituals as Array<{
    id: string;
    ritualName: string;
    alternateNames: string[];
    religion: string;
    eventPhase: string;
    mandatoryOrOptional: string;
    familyOnlyOrGuestFacing: string;
    shortDescription: string;
    culturalMeaning: string;
    typicalDurationMinutes: number;
    typicalTimeOfDay: string;
    typicalLocationType: string;
    recommendedDressCode: string;
    commonMusicLevel: string;
    foodImportance: string;
    decorImportance: string;
    notes: string;
  }>;

  const vendorLinks = vendorLinksData.ritualVendorLinks as Array<{
    ritualId: string;
    ritualName: string;
    religion: string;
    essentialVendorCategories: string[];
    suggestedVendorCategories: string[];
    optionalVendorCategories: string[];
  }>;

  // Build a lookup map by ritualId for vendor links
  const vendorLinkMap = new Map<
    string,
    {
      essential: string[];
      suggested: string[];
      optional: string[];
    }
  >();
  for (const vl of vendorLinks) {
    vendorLinkMap.set(vl.ritualId, {
      essential: vl.essentialVendorCategories,
      suggested: vl.suggestedVendorCategories,
      optional: vl.optionalVendorCategories,
    });
  }

  // Delete existing ritual templates for clean re-run
  const deletedCount = await prisma.ritualTemplate.deleteMany();
  console.log(`🗑️  Cleared ${deletedCount.count} existing RitualTemplates`);

  let created = 0;
  let skipped = 0;

  for (const r of rituals) {
    const religionType = RELIGION_MAP[r.religion];
    if (!religionType) {
      console.warn(`⚠️  Skipping "${r.ritualName}" — unknown religion: ${r.religion}`);
      skipped++;
      continue;
    }

    // Look up vendor links
    const vendors = vendorLinkMap.get(r.id);

    try {
      await prisma.ritualTemplate.create({
        data: {
          name: r.ritualName,
          religionType,
          description: r.shortDescription,
          alternateNames: r.alternateNames || [],
          eventPhase: r.eventPhase || null,
          mandatoryOrOptional: r.mandatoryOrOptional || null,
          familyOnlyOrGuest: r.familyOnlyOrGuestFacing || null,
          culturalMeaning: r.culturalMeaning || null,
          expectedDurationMinutes: r.typicalDurationMinutes || null,
          typicalTimeOfDay: r.typicalTimeOfDay || null,
          typicalLocationType: r.typicalLocationType || null,
          recommendedDressCode: r.recommendedDressCode || null,
          commonMusicLevel: r.commonMusicLevel || null,
          foodImportance: r.foodImportance || null,
          decorImportance: r.decorImportance || null,
          plannerNotes: r.notes || null,
          requiredItems: [],
          optionalItems: [],
          essentialVendors: vendors?.essential || [],
          suggestedVendors: vendors?.suggested || [],
          optionalVendors: vendors?.optional || [],
        },
      });
      created++;
    } catch (err: any) {
      console.error(`❌ Error creating ritual "${r.ritualName}": ${err.message}`);
      skipped++;
    }
  }

  console.log(`✅ Rituals seeded: ${created} created, ${skipped} skipped`);
  return created;
}

// ──────────────────────────────────────────────
// MENU TEMPLATE SEEDING
// ──────────────────────────────────────────────

async function seedMenus() {
  console.log("\n🍽️  Loading menu data...");

  const menusData = loadJSON("menus_master.json");
  const packagesData = loadJSON("menus_event_packages.json");

  const events = menusData.events as Array<{
    id: string;
    eventType: string;
    eventStyle?: string;
    recommendedServiceStyle?: string;
    mealIntensity?: string;
    idealCuisineApproach?: string;
    notes?: string;
    menuSections: Record<string, any>;
  }>;

  const packages = packagesData.eventPackages as Array<{
    eventId: string;
    eventType: string;
    standardRecommendedMenu?: Record<string, any>;
    premiumRecommendedMenu?: Record<string, any>;
    lightFunctionMenu?: Record<string, any>;
  }>;

  // Build package lookup by eventId
  const packageMap = new Map<
    string,
    {
      standard?: Record<string, any>;
      premium?: Record<string, any>;
      light?: Record<string, any>;
    }
  >();
  for (const pkg of packages) {
    packageMap.set(pkg.eventId, {
      standard: pkg.standardRecommendedMenu || undefined,
      premium: pkg.premiumRecommendedMenu || undefined,
      light: pkg.lightFunctionMenu || undefined,
    });
  }

  // Delete existing menu templates for clean re-run
  const deletedCount = await prisma.menuTemplate.deleteMany();
  console.log(`🗑️  Cleared ${deletedCount.count} existing MenuTemplates`);

  let created = 0;
  let skipped = 0;

  for (const evt of events) {
    const pkg = packageMap.get(evt.id);

    try {
      await prisma.menuTemplate.create({
        data: {
          eventType: evt.eventType,
          eventStyle: evt.eventStyle || null,
          recommendedServiceStyle: evt.recommendedServiceStyle || null,
          mealIntensity: evt.mealIntensity || null,
          idealCuisineApproach: evt.idealCuisineApproach || null,
          notes: evt.notes || null,
          menuSections: evt.menuSections,
          standardPackage: pkg?.standard ?? undefined,
          premiumPackage: pkg?.premium ?? undefined,
          lightPackage: pkg?.light ?? undefined,
        },
      });
      created++;
    } catch (err: any) {
      console.error(`❌ Error creating menu template "${evt.eventType}": ${err.message}`);
      skipped++;
    }
  }

  console.log(`✅ Menu templates seeded: ${created} created, ${skipped} skipped`);
  return created;
}

// ──────────────────────────────────────────────
// MAIN
// ──────────────────────────────────────────────

async function main() {
  console.log("🌺 Saffron Wedding Planner — Ritual & Menu Seed\n");
  console.log("━".repeat(50));

  const ritualCount = await seedRituals();

  console.log("━".repeat(50));

  const menuCount = await seedMenus();

  // ── Summary stats ──
  console.log("\n" + "━".repeat(50));
  console.log("📊 Final database counts:");

  const totalRituals = await prisma.ritualTemplate.count();
  const totalMenus = await prisma.menuTemplate.count();

  console.log(`   RitualTemplates: ${totalRituals}`);
  console.log(`   MenuTemplates:   ${totalMenus}`);

  // Breakdown by religion
  const sikhCount = await prisma.ritualTemplate.count({ where: { religionType: "SIKH" } });
  const hinduCount = await prisma.ritualTemplate.count({ where: { religionType: "HINDU" } });
  const customCount = await prisma.ritualTemplate.count({ where: { religionType: "CUSTOM" } });

  console.log(`\n🕉️  Rituals by type:`);
  console.log(`   Sikh:   ${sikhCount}`);
  console.log(`   Hindu:  ${hinduCount}`);
  console.log(`   Custom: ${customCount} (Jain + Common)`);

  console.log(`\n🎉 Seed complete!`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("💥 Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
