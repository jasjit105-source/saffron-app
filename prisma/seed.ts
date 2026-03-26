import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Saffron Wedding Planner database...");

  // ── Create Users ──
  const passwordHash = await bcrypt.hash("saffron2026", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@saffronweddings.com" },
    update: {},
    create: {
      email: "admin@saffronweddings.com",
      name: "Ravi Oberoi",
      phone: "+91 98000 10001",
      passwordHash,
      role: "OWNER",
      isActive: true,
    },
  });

  const priya = await prisma.user.upsert({
    where: { email: "priya@saffronweddings.com" },
    update: {},
    create: {
      email: "priya@saffronweddings.com",
      name: "Priya Malhotra",
      phone: "+91 98000 10002",
      passwordHash,
      role: "LEAD_PLANNER",
      isActive: true,
    },
  });

  const ankit = await prisma.user.upsert({
    where: { email: "ankit@saffronweddings.com" },
    update: {},
    create: {
      email: "ankit@saffronweddings.com",
      name: "Ankit Sharma",
      phone: "+91 98000 10003",
      passwordHash,
      role: "WEDDING_PLANNER",
      isActive: true,
    },
  });

  const meera = await prisma.user.upsert({
    where: { email: "meera@saffronweddings.com" },
    update: {},
    create: {
      email: "meera@saffronweddings.com",
      name: "Meera Kapoor",
      phone: "+91 98000 10004",
      passwordHash,
      role: "FINANCE_MANAGER",
      isActive: true,
    },
  });

  const simran = await prisma.user.upsert({
    where: { email: "simran@saffronweddings.com" },
    update: {},
    create: {
      email: "simran@saffronweddings.com",
      name: "Simran Kaur",
      phone: "+91 98000 10005",
      passwordHash,
      role: "HOSPITALITY_MANAGER",
      isActive: true,
    },
  });

  const deepak = await prisma.user.upsert({
    where: { email: "deepak@saffronweddings.com" },
    update: {},
    create: {
      email: "deepak@saffronweddings.com",
      name: "Deepak Arora",
      phone: "+91 98000 10006",
      passwordHash,
      role: "VENDOR_COORDINATOR",
      isActive: true,
    },
  });

  console.log("✅ Users seeded");

  // ── Create Sample Leads ──
  const leads = [
    {
      brideName: "Anika Malhotra",
      groomName: "Sahil Dhawan",
      city: "Mumbai",
      status: "PROPOSAL_SENT",
      source: "INSTAGRAM",
      phone: "+91 98765 43210",
      expectedBudgetRange: "₹50-80 Lakh",
      weddingDateOrMonth: "May 2026",
      assignedPlannerId: priya.id,
    },
    {
      brideName: "Tanya Chopra",
      groomName: "Nikhil Batra",
      city: "Delhi",
      status: "NEW",
      source: "REFERRAL",
      phone: "+91 87654 32109",
      expectedBudgetRange: "₹30-50 Lakh",
      weddingDateOrMonth: "Nov 2026",
      assignedPlannerId: ankit.id,
    },
    {
      brideName: "Kavya Reddy",
      groomName: "Varun Nair",
      city: "Hyderabad",
      status: "MEETING_SCHEDULED",
      source: "WEBSITE",
      phone: "+91 76543 21098",
      expectedBudgetRange: "₹80 Lakh+",
      weddingDateOrMonth: "Feb 2027",
      assignedPlannerId: priya.id,
    },
    {
      brideName: "Sonia Bajaj",
      groomName: "Kartik Rao",
      city: "Bangalore",
      status: "NEGOTIATION",
      source: "WEDDING_PORTAL",
      phone: "+91 65432 10987",
      expectedBudgetRange: "₹40-60 Lakh",
      weddingDateOrMonth: "Dec 2026",
      assignedPlannerId: ankit.id,
    },
  ];

  for (const lead of leads) {
    await prisma.lead.create({ data: lead as any });
  }
  console.log("✅ Leads seeded");

  // ── Create Sample Weddings ──
  const w1 = await prisma.wedding.create({
    data: {
      title: "Khanna–Sethi Royal Wedding",
      status: "PLANNING_IN_PROGRESS",
      weddingType: "SIKH",
      planningScope: "FULL_SERVICE",
      primaryCity: "Delhi",
      startDate: new Date("2026-04-12"),
      endDate: new Date("2026-04-15"),
      estimatedGuestCount: 850,
      confirmedGuestCount: 620,
      contractValue: 5200000,
      budgetCap: 4500000,
      leadPlannerId: priya.id,
    },
  });

  await prisma.couple.create({
    data: {
      weddingId: w1.id,
      brideFullName: "Jasleen Khanna",
      groomFullName: "Arjun Sethi",
      brideCity: "Delhi",
      groomCity: "Chandigarh",
      bridePhone: "+91 98765 11111",
      groomPhone: "+91 98765 22222",
    },
  });

  const w2 = await prisma.wedding.create({
    data: {
      title: "Mehta–Patel Destination Wedding",
      status: "FINAL_PREP",
      weddingType: "HINDU",
      planningScope: "FULL_SERVICE",
      primaryCity: "Udaipur",
      startDate: new Date("2026-03-28"),
      endDate: new Date("2026-03-30"),
      estimatedGuestCount: 400,
      confirmedGuestCount: 380,
      contractValue: 9800000,
      budgetCap: 8500000,
      leadPlannerId: ankit.id,
    },
  });

  await prisma.couple.create({
    data: {
      weddingId: w2.id,
      brideFullName: "Riya Mehta",
      groomFullName: "Karan Patel",
      brideCity: "Mumbai",
      groomCity: "Ahmedabad",
    },
  });

  const w3 = await prisma.wedding.create({
    data: {
      title: "Singh–Ahuja Celebration",
      status: "CONFIRMED",
      weddingType: "SIKH_HINDU_MIXED",
      planningScope: "BOTH_SIDES",
      primaryCity: "Chandigarh",
      startDate: new Date("2026-05-20"),
      endDate: new Date("2026-05-23"),
      estimatedGuestCount: 1200,
      confirmedGuestCount: 450,
      contractValue: 7200000,
      budgetCap: 6000000,
      leadPlannerId: priya.id,
    },
  });

  await prisma.couple.create({
    data: {
      weddingId: w3.id,
      brideFullName: "Manpreet Singh",
      groomFullName: "Rahul Ahuja",
      brideCity: "Chandigarh",
      groomCity: "Delhi",
    },
  });

  console.log("✅ Weddings seeded");

  // ── Create Sample Events ──
  const events = [
    { weddingId: w1.id, name: "Roka Ceremony", eventType: "Roka", side: "SHARED", sequence: 1, date: new Date("2026-04-12"), startTime: "10:00", endTime: "13:00", venue: "Khanna Residence", status: "CONFIRMED" },
    { weddingId: w1.id, name: "Mehndi Night", eventType: "Mehndi", side: "BRIDE", sequence: 2, date: new Date("2026-04-13"), startTime: "17:00", endTime: "23:00", venue: "Taj Palace Lawns", status: "CONFIRMED" },
    { weddingId: w1.id, name: "Anand Karaj", eventType: "Anand Karaj", side: "SHARED", sequence: 3, date: new Date("2026-04-14"), startTime: "09:00", endTime: "13:00", venue: "Bangla Sahib Gurdwara", status: "CONFIRMED" },
    { weddingId: w1.id, name: "Reception", eventType: "Reception", side: "SHARED", sequence: 4, date: new Date("2026-04-15"), startTime: "19:00", endTime: "00:00", venue: "The Imperial Ballroom", status: "DRAFT" },
    { weddingId: w2.id, name: "Mehndi & Sangeet", eventType: "Sangeet", side: "SHARED", sequence: 1, date: new Date("2026-03-28"), startTime: "17:00", endTime: "23:00", venue: "Lake Palace Lawns", status: "CONFIRMED" },
    { weddingId: w2.id, name: "Mandap Ceremony", eventType: "Mandap Ceremony", side: "SHARED", sequence: 2, date: new Date("2026-03-29"), startTime: "10:00", endTime: "14:00", venue: "Jagmandir Island", status: "CONFIRMED" },
    { weddingId: w2.id, name: "Reception", eventType: "Reception", side: "SHARED", sequence: 3, date: new Date("2026-03-30"), startTime: "19:00", endTime: "01:00", venue: "City Palace Courtyard", status: "CONFIRMED" },
  ];

  for (const evt of events) {
    await prisma.event.create({ data: evt as any });
  }
  console.log("✅ Events seeded");

  // ── Create Sample Tasks ──
  const tasks = [
    { weddingId: w1.id, title: "Confirm baraat horse vendor", category: "VENDOR", priority: "URGENT", status: "TODO", assignedToId: deepak.id, dueDate: new Date("2026-03-25") },
    { weddingId: w2.id, title: "Final menu tasting sign-off", category: "MENU", priority: "HIGH", status: "IN_PROGRESS", assignedToId: ankit.id, dueDate: new Date("2026-03-24") },
    { weddingId: w3.id, title: "Collect chooda from jeweller", category: "WARDROBE", priority: "MEDIUM", status: "TODO", assignedToId: simran.id, dueDate: new Date("2026-03-28") },
    { weddingId: w1.id, title: "Submit venue layout to decorator", category: "DECOR", priority: "HIGH", status: "BLOCKED", assignedToId: priya.id, dueDate: new Date("2026-03-25") },
    { weddingId: w2.id, title: "Airport pickup schedule finalization", category: "TRANSPORT", priority: "URGENT", status: "IN_PROGRESS", assignedToId: simran.id, dueDate: new Date("2026-03-23") },
  ];

  for (const task of tasks) {
    await prisma.task.create({ data: task as any });
  }
  console.log("✅ Tasks seeded");

  // ── Create Sample Vendors ──
  const vendors = [
    { name: "Royal Florist", category: "FLORIST", contactPerson: "Rajesh Kumar", phone: "+91 98765 50001", city: "Delhi", internalRating: 4 },
    { name: "Lake Palace Venue", category: "VENUE", contactPerson: "Vikram Singh", phone: "+91 98765 50002", city: "Udaipur", internalRating: 5 },
    { name: "Rajasthani Caterers", category: "CATERER", contactPerson: "Suresh Patel", phone: "+91 98765 50003", city: "Udaipur", internalRating: 4 },
    { name: "Maharaja Tent & Decor", category: "DECORATOR", contactPerson: "Amit Chauhan", phone: "+91 98765 50004", city: "Chandigarh", internalRating: 3 },
    { name: "DJ Groove Delhi", category: "DJ", contactPerson: "Sunny Arora", phone: "+91 98765 50005", city: "Delhi", internalRating: 4 },
  ];

  for (const vendor of vendors) {
    await prisma.vendor.create({ data: vendor as any });
  }
  console.log("✅ Vendors seeded");

  // ── Seed Ritual Templates ──
  const rituals = [
    { name: "Anand Karaj", religionType: "SIKH", description: "The Sikh wedding ceremony performed in the presence of Guru Granth Sahib", performedBy: "Granthi", requiredItems: ["Rumala Sahib", "Palkis", "Lavan (4 rounds)", "Kirtan group", "Ardas items"], expectedDurationMinutes: 120 },
    { name: "Pheras", religionType: "HINDU", description: "The seven rounds around the sacred fire", performedBy: "Pandit", requiredItems: ["Sacred fire pit", "Ghee", "Samagri", "Mangalsutra", "Sindoor"], expectedDurationMinutes: 60 },
    { name: "Milni", religionType: "SIKH", description: "Formal meeting of family members from both sides", performedBy: "Families", requiredItems: ["Garlands", "Gifts for milni"], expectedDurationMinutes: 30 },
    { name: "Mehndi", religionType: "HINDU", description: "Henna application ceremony", performedBy: "Mehndi artist", requiredItems: ["Mehndi cones", "Cushions", "Tray decoration", "Bangles"], expectedDurationMinutes: 180 },
    { name: "Haldi", religionType: "HINDU", description: "Turmeric paste application", performedBy: "Family", requiredItems: ["Haldi paste", "Rose water", "Trays", "Yellow cloth"], expectedDurationMinutes: 60 },
    { name: "Chooda", religionType: "SIKH", description: "Red and white bangles ceremony", performedBy: "Mama (maternal uncle)", requiredItems: ["Chooda set", "Coconut", "Red cloth", "Sweets"], expectedDurationMinutes: 45 },
    { name: "Baraat", religionType: "SIKH", description: "Groom's wedding procession", performedBy: "Groom's family", requiredItems: ["Ghodi (horse)", "Band", "Dhol", "Fireworks", "Sehra"], expectedDurationMinutes: 60 },
  ];

  for (const ritual of rituals) {
    await prisma.ritualTemplate.create({ data: ritual as any });
  }
  console.log("✅ Ritual templates seeded");

  console.log("\n🎉 Seed complete! Login with:");
  console.log("   Email: admin@saffronweddings.com");
  console.log("   Password: saffron2026");
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
