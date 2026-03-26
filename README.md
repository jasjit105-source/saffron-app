# 🌸 Saffron Wedding Planner

A premium Indian wedding planning & operations dashboard built with Next.js 14, TypeScript, Prisma, and PostgreSQL.

## Features

- **19 Modules**: Dashboard, Leads CRM, Wedding Master, Couple & Family, Events & Ceremonies, Ritual Engine, Checklists, Vendors, Menu & Catering, Guests & Hospitality, Wardrobe & Gifts, Tasks & Approvals, Finance & Payments, Timeline/Run Sheets, Live Dashboard, Documents, Reports, Settings
- **Role-Based Access**: 11 user roles (Super Admin → Vendor View) with module-level permissions
- **Indian Wedding Intelligence**: Sikh, Hindu, mixed ceremony support with ritual templates, ceremony checklists, and event libraries
- **New Wedding Wizard**: Multi-step onboarding that auto-generates events from wedding type templates
- **Branded UI**: Saffron/ivory/gold/maroon palette with Playfair Display + DM Sans typography

## Tech Stack

- **Framework**: Next.js 14 (App Router, Server Components, Server Actions)
- **Language**: TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js with credentials provider
- **Styling**: Tailwind CSS
- **UI**: Custom components (shadcn/ui compatible)

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up your database

Create a PostgreSQL database, then copy the env file:

```bash
cp .env.example .env
```

Edit `.env` with your database URL:

```
DATABASE_URL="postgresql://user:password@localhost:5432/saffron_wedding"
NEXTAUTH_SECRET="generate-a-random-secret-here"
```

### 3. Push schema and seed data

```bash
npx prisma db push
npm run db:seed
```

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Login

```
Email: admin@saffronweddings.com
Password: saffron2026
```

Other seeded users (all same password):
- `priya@saffronweddings.com` — Lead Planner
- `ankit@saffronweddings.com` — Wedding Planner
- `meera@saffronweddings.com` — Finance Manager
- `simran@saffronweddings.com` — Hospitality Manager
- `deepak@saffronweddings.com` — Vendor Coordinator

## Project Structure

```
src/
├── app/
│   ├── (auth)/              # Login/register pages
│   │   └── login/
│   ├── (dashboard)/         # All dashboard pages (protected)
│   │   ├── leads/
│   │   ├── weddings/
│   │   │   ├── [id]/        # Wedding detail
│   │   │   └── new/         # New wedding wizard
│   │   ├── events/
│   │   ├── vendors/
│   │   ├── finance/
│   │   ├── ... (15 more modules)
│   │   ├── layout.tsx       # Dashboard shell with sidebar
│   │   ├── page.tsx         # Main dashboard
│   │   └── actions.ts       # Server actions
│   └── api/
│       ├── auth/[...nextauth]/
│       ├── weddings/
│       └── leads/
├── components/
│   ├── layout/              # Sidebar, Topbar, DashboardShell
│   ├── dashboard/           # Dashboard panels
│   ├── leads/               # Lead cards, filters
│   ├── weddings/            # Wedding list, detail
│   ├── shared/              # SummaryCard, StatusBadge, etc.
│   └── providers/
├── config/
│   └── navigation.ts        # Nav config tied to roles
├── lib/
│   ├── auth.ts              # NextAuth config
│   ├── db.ts                # Prisma singleton
│   └── utils.ts             # Helpers (formatCurrency, etc.)
├── types/
│   └── index.ts             # Roles, permissions, enums
└── styles/
    └── globals.css
```

## Database

The Prisma schema includes 35+ models covering the full wedding lifecycle. Key models:

- **User** — 11 roles with permission matrix
- **Lead** — 8-stage CRM pipeline
- **Wedding** — 9 statuses, multi-city, multi-day
- **Couple / FamilyMember** — Bride/groom side profiles
- **Event** — 30+ ceremony types
- **RitualTemplate** — Sikh/Hindu/mixed rituals
- **ChecklistItem** — Category-based with status tracking
- **Vendor / VendorAssignment** — 30+ vendor categories
- **Quotation / Payment** — Versioned quotes, payment tracking
- **Guest** — RSVP, dietary, hospitality, transport
- **Task** — Priority, dependencies, approvals
- **TimelineItem** — Minute-by-minute run sheets

Run `npx prisma studio` to browse your data visually.

## User Roles

| Role | Access |
|------|--------|
| SUPER_ADMIN / OWNER | Everything |
| LEAD_PLANNER | All operational modules |
| WEDDING_PLANNER | Assigned weddings, events, tasks |
| FINANCE_MANAGER | Finance, vendors, reports |
| HOSPITALITY_MANAGER | Guests, catering, tasks |
| VENDOR_COORDINATOR | Vendors, tasks, timeline |
| CATERING_COORDINATOR | Catering, vendors, tasks |
| FAMILY_VIEW | Read-only: wedding, events, guests |
| COUPLE_VIEW | Read-only + wardrobe |
| VENDOR_VIEW | Assigned events, timeline, tasks |

## Deployment

### Vercel (recommended)

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Connect a PostgreSQL database (Vercel Postgres, Supabase, Neon, etc.)

### Netlify

This is a full Next.js app — use the Netlify Next.js adapter or deploy to Vercel.

---

Built with ❤️ for the Indian wedding planning industry.
