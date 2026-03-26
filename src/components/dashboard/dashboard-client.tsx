"use client";

import Link from "next/link";
import {
  Heart,
  Users,
  AlertTriangle,
  IndianRupee,
  Store,
  ListTodo,
  CalendarDays,
  CheckSquare,
  Clock,
  Plus,
  ArrowRight,
  FileText,
  UtensilsCrossed,
  Shirt,
  BarChart3,
  Video,
  ShoppingBag,
  Crown,
  MapPin,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  SummaryCard,
  PageHeader,
  ActionButton,
  StatusBadge,
  PriorityDot,
  CardSection,
  ProgressBar,
} from "@/components/shared";

interface MarketplaceStats {
  totalMarketplaceVendors: number;
  topPicks: number;
  cities: Array<{ name: string; count: number }>;
  topVendorsByCity: Array<{
    id: string;
    name: string;
    cityName: string;
    categoryName: string;
    categoryIcon: string | null;
  }>;
}

interface DashboardClientProps {
  stats: {
    activeWeddings: number;
    totalWeddings: number;
    totalLeads: number;
    pendingLeads: number;
    pendingTasks: number;
    totalVendors: number;
    totalGuests: number;
    totalEvents: number;
  };
  upcomingWeddings: any[];
  recentLeads: any[];
  urgentTasks: any[];
  userName: string;
  marketplaceStats?: MarketplaceStats;
}

export function DashboardClient({
  stats,
  upcomingWeddings,
  recentLeads,
  urgentTasks,
  userName,
  marketplaceStats,
}: DashboardClientProps) {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Command Center"
        subtitle={today}
        actions={
          <>
            <ActionButton icon={Plus} variant="outline">
              <Link href="/weddings/new">Create Wedding</Link>
            </ActionButton>
            <ActionButton icon={Plus} variant="outline">
              <Link href="/leads">New Lead</Link>
            </ActionButton>
            <ActionButton icon={Plus} variant="outline">
              <Link href="/tasks">Add Task</Link>
            </ActionButton>
          </>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        <SummaryCard
          label="Active Weddings"
          value={stats.activeWeddings}
          sub={`${stats.totalWeddings} total`}
          accent
        />
        <SummaryCard
          label="Total Events"
          value={stats.totalEvents}
          sub="across all weddings"
        />
        <SummaryCard
          label="Pending Leads"
          value={stats.pendingLeads}
          sub={`${stats.totalLeads} total`}
        />
        <SummaryCard
          label="Open Tasks"
          value={stats.pendingTasks}
          alert={stats.pendingTasks > 0}
        />
        <SummaryCard
          label="Vendors"
          value={stats.totalVendors}
          sub="registered"
        />
        <SummaryCard
          label="Guests"
          value={stats.totalGuests}
          sub="across weddings"
        />
        <SummaryCard label="Total Leads" value={stats.totalLeads} />
        <SummaryCard label="Weddings" value={stats.totalWeddings} accent />
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Upcoming Weddings */}
        <CardSection
          title="Upcoming Weddings"
          className="lg:col-span-2"
          action={
            <Link
              href="/weddings"
              className="text-[11px] text-amber-600 font-semibold hover:underline"
            >
              View all
            </Link>
          }
        >
          <div className="divide-y divide-gray-50">
            {upcomingWeddings.length > 0 ? (
              upcomingWeddings.map((w: any) => (
                <Link
                  key={w.id}
                  href={`/weddings/${w.id}`}
                  className="px-5 py-3.5 flex items-center gap-4 hover:bg-gray-50/50 transition"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">
                        {w.title}
                      </span>
                      <StatusBadge status={w.status} />
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {w.primaryCity} •{" "}
                      {w.startDate ? formatDate(w.startDate) : "TBD"} •{" "}
                      {w.leadPlanner?.name || "Unassigned"}
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-gray-300" />
                </Link>
              ))
            ) : (
              <div className="px-5 py-10 text-center text-sm text-gray-300">
                No upcoming weddings in the next 30 days
              </div>
            )}
          </div>
        </CardSection>

        {/* Tasks */}
        <CardSection
          title="Tasks Requiring Action"
          action={
            <Link
              href="/tasks"
              className="text-[11px] text-amber-600 font-semibold hover:underline"
            >
              View all
            </Link>
          }
        >
          <div className="divide-y divide-gray-50">
            {urgentTasks.length > 0 ? (
              urgentTasks.slice(0, 6).map((t: any) => (
                <div
                  key={t.id}
                  className="px-5 py-3 hover:bg-gray-50/50 transition cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <PriorityDot priority={t.priority} />
                    <span className="text-xs font-semibold text-gray-800 truncate flex-1">
                      {t.title}
                    </span>
                    <StatusBadge status={t.priority} />
                  </div>
                  <div className="flex items-center gap-2 pl-3.5">
                    <span className="text-[10px] text-gray-400">
                      {t.wedding?.title || "—"}
                    </span>
                    <span className="text-gray-200">•</span>
                    <span className="text-[10px] text-gray-400">
                      {t.assignedTo?.name || "Unassigned"}
                    </span>
                    {t.dueDate && (
                      <>
                        <span className="text-gray-200">•</span>
                        <span className="text-[10px] text-gray-400">
                          {formatDate(t.dueDate)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-5 py-10 text-center text-sm text-gray-300">
                No urgent tasks right now
              </div>
            )}
          </div>
        </CardSection>
      </div>

      {/* Lead Pipeline + Recent Leads */}
      <CardSection
        title="Recent Leads"
        action={
          <Link
            href="/leads"
            className="text-[11px] text-amber-600 font-semibold hover:underline"
          >
            Manage leads
          </Link>
        }
      >
        <div className="divide-y divide-gray-50">
          {recentLeads.length > 0 ? (
            recentLeads.slice(0, 5).map((lead: any) => (
              <div
                key={lead.id}
                className="px-5 py-3 flex items-center justify-between hover:bg-gray-50/50 transition cursor-pointer"
              >
                <div>
                  <div className="text-xs font-semibold text-gray-800">
                    {lead.brideName} & {lead.groomName}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">
                    {lead.city} • {lead.source} •{" "}
                    {lead.assignedPlanner?.name || "Unassigned"}
                  </div>
                </div>
                <StatusBadge status={lead.status} />
              </div>
            ))
          ) : (
            <div className="px-5 py-10 text-center text-sm text-gray-300">
              No leads yet — create your first lead
            </div>
          )}
        </div>
      </CardSection>

      {/* Marketplace Vendors */}
      {marketplaceStats && marketplaceStats.totalMarketplaceVendors > 0 && (
        <div className="grid lg:grid-cols-3 gap-5">
          <CardSection
            title="Vendor Marketplace"
            subtitle={`${marketplaceStats.totalMarketplaceVendors} vendors`}
            className="lg:col-span-2"
            action={
              <Link
                href="/marketplace"
                className="text-[11px] text-amber-600 font-semibold hover:underline"
              >
                Browse all
              </Link>
            }
          >
            <div className="divide-y divide-gray-50">
              {marketplaceStats.topVendorsByCity.map((v) => (
                <Link
                  key={v.id}
                  href={`/marketplace/${v.id}`}
                  className="px-5 py-3 flex items-center gap-3 hover:bg-gray-50/50 transition"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-sm">
                    {v.categoryIcon || "📦"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-800 truncate">
                        {v.name}
                      </span>
                      <span className="bg-amber-100 text-amber-700 text-[8px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <Crown size={8} />
                        TOP
                      </span>
                    </div>
                    <div className="text-[10px] text-gray-400 mt-0.5">
                      {v.categoryName} · {v.cityName}
                    </div>
                  </div>
                  <ArrowRight size={12} className="text-gray-300" />
                </Link>
              ))}
            </div>
          </CardSection>

          <CardSection title="Vendors by City">
            <div className="p-4 space-y-3">
              {marketplaceStats.cities.map((city) => (
                <Link
                  key={city.name}
                  href={`/marketplace?city=${city.name.toLowerCase().replace(/\s+/g, "-")}`}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-2">
                    <MapPin size={13} className="text-amber-500" />
                    <span className="text-xs font-semibold text-gray-700">
                      {city.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-lg">
                    {city.count}
                  </span>
                </Link>
              ))}
              <div className="pt-2 border-t border-gray-50 flex justify-between items-center">
                <span className="text-[10px] text-gray-400">
                  {marketplaceStats.topPicks} top picks curated
                </span>
                <Link
                  href="/marketplace?top3=true"
                  className="text-[10px] font-semibold text-amber-600 hover:underline"
                >
                  View top picks →
                </Link>
              </div>
            </div>
          </CardSection>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="text-sm font-bold text-gray-800 tracking-tight mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
          {[
            { label: "New Wedding", icon: Heart, href: "/weddings/new" },
            { label: "New Lead", icon: Users, href: "/leads" },
            { label: "Add Event", icon: CalendarDays, href: "/events" },
            { label: "Add Checklist", icon: CheckSquare, href: "/checklists" },
            { label: "Assign Vendor", icon: Store, href: "/vendors" },
            { label: "Generate Quote", icon: IndianRupee, href: "/finance" },
            { label: "Add Task", icon: ListTodo, href: "/tasks" },
            { label: "Marketplace", icon: ShoppingBag, href: "/marketplace" },
            { label: "Run Sheet", icon: Clock, href: "/timeline" },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                href={action.href}
                className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-100 hover:border-amber-200 hover:bg-amber-50/30 transition group"
              >
                <div className="w-9 h-9 rounded-lg bg-gray-50 group-hover:bg-amber-100 flex items-center justify-center transition">
                  <Icon
                    size={16}
                    className="text-gray-400 group-hover:text-amber-600 transition"
                  />
                </div>
                <span className="text-[10px] font-semibold text-gray-500 group-hover:text-gray-700 transition">
                  {action.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
