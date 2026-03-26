import {
  LayoutDashboard,
  Users,
  Heart,
  UserCircle,
  CalendarDays,
  Globe2,
  CheckSquare,
  Store,
  UtensilsCrossed,
  UserCheck,
  Shirt,
  ListTodo,
  IndianRupee,
  Clock,
  FileText,
  BarChart3,
  Video,
  Settings,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";
import { type Module } from "@/types";

export interface NavItem {
  key: Module;
  label: string;
  icon: LucideIcon;
  href: string;
  badge?: string;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export const NAV_CONFIG: NavSection[] = [
  {
    label: "COMMAND CENTER",
    items: [
      { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/" },
      { key: "live", label: "Live Dashboard", icon: Video, href: "/live", badge: "LIVE" },
    ],
  },
  {
    label: "PIPELINE",
    items: [
      { key: "leads", label: "Leads & Inquiries", icon: Users, href: "/leads" },
      { key: "weddings", label: "Wedding Master", icon: Heart, href: "/weddings" },
    ],
  },
  {
    label: "WEDDING OPS",
    items: [
      { key: "couples", label: "Couple & Family", icon: UserCircle, href: "/couples" },
      { key: "events", label: "Events & Ceremonies", icon: CalendarDays, href: "/events" },
      { key: "rituals", label: "Ritual Engine", icon: Globe2, href: "/rituals" },
      { key: "checklists", label: "Checklists", icon: CheckSquare, href: "/checklists" },
      { key: "timeline", label: "Run Sheets", icon: Clock, href: "/timeline" },
    ],
  },
  {
    label: "MARKETPLACE",
    items: [
      { key: "marketplace", label: "Vendor Marketplace", icon: ShoppingBag, href: "/marketplace" },
    ],
  },
  {
    label: "SERVICES",
    items: [
      { key: "vendors", label: "Vendors", icon: Store, href: "/vendors" },
      { key: "catering", label: "Menu & Catering", icon: UtensilsCrossed, href: "/catering" },
      { key: "guests", label: "Guests & Hospitality", icon: UserCheck, href: "/guests" },
      { key: "wardrobe", label: "Wardrobe & Gifts", icon: Shirt, href: "/wardrobe" },
    ],
  },
  {
    label: "OPERATIONS",
    items: [
      { key: "tasks", label: "Tasks & Approvals", icon: ListTodo, href: "/tasks" },
      { key: "finance", label: "Finance & Payments", icon: IndianRupee, href: "/finance" },
      { key: "documents", label: "Documents", icon: FileText, href: "/documents" },
      { key: "reports", label: "Reports", icon: BarChart3, href: "/reports" },
    ],
  },
  {
    label: "ADMIN",
    items: [
      { key: "settings", label: "Settings & Templates", icon: Settings, href: "/settings" },
    ],
  },
];
