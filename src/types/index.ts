// ══════════════════════════════════════════════
// SAFFRON WEDDING PLANNER — Type Definitions
// ══════════════════════════════════════════════

export type UserRole =
  | "SUPER_ADMIN"
  | "OWNER"
  | "LEAD_PLANNER"
  | "WEDDING_PLANNER"
  | "FINANCE_MANAGER"
  | "HOSPITALITY_MANAGER"
  | "VENDOR_COORDINATOR"
  | "CATERING_COORDINATOR"
  | "FAMILY_VIEW"
  | "COUPLE_VIEW"
  | "VENDOR_VIEW";

export type WeddingStatus =
  | "INQUIRY"
  | "PROPOSAL"
  | "CONFIRMED"
  | "PLANNING_IN_PROGRESS"
  | "FINAL_PREP"
  | "LIVE_EXECUTION"
  | "COMPLETED"
  | "ARCHIVED"
  | "CANCELLED";

export type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "MEETING_SCHEDULED"
  | "PROPOSAL_SENT"
  | "NEGOTIATION"
  | "CONFIRMED"
  | "LOST"
  | "ON_HOLD";

export type Side = "BRIDE" | "GROOM" | "SHARED";

export type TaskPriority = "URGENT" | "HIGH" | "MEDIUM" | "LOW";

export type TaskStatus =
  | "TODO"
  | "IN_PROGRESS"
  | "BLOCKED"
  | "REVIEW"
  | "DONE"
  | "CANCELLED";

export type EventStatus =
  | "DRAFT"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "POSTPONED";

export type LiveStatus =
  | "ON_TIME"
  | "AT_RISK"
  | "DELAYED"
  | "READY"
  | "COMPLETED";

export type PaymentMode =
  | "CASH"
  | "BANK_TRANSFER"
  | "UPI"
  | "CHEQUE"
  | "CREDIT_CARD"
  | "WIRE"
  | "OTHER";

// ── Permission matrix ──

export type Module =
  | "dashboard"
  | "leads"
  | "weddings"
  | "couples"
  | "events"
  | "rituals"
  | "checklists"
  | "vendors"
  | "marketplace"
  | "catering"
  | "guests"
  | "wardrobe"
  | "tasks"
  | "finance"
  | "timeline"
  | "live"
  | "documents"
  | "reports"
  | "settings";

export type Permission = "view" | "create" | "edit" | "delete" | "approve";

export const ROLE_PERMISSIONS: Record<UserRole, Partial<Record<Module, Permission[]>>> = {
  SUPER_ADMIN: {
    dashboard: ["view", "create", "edit", "delete", "approve"],
    leads: ["view", "create", "edit", "delete", "approve"],
    weddings: ["view", "create", "edit", "delete", "approve"],
    couples: ["view", "create", "edit", "delete"],
    events: ["view", "create", "edit", "delete", "approve"],
    rituals: ["view", "create", "edit", "delete"],
    checklists: ["view", "create", "edit", "delete"],
    vendors: ["view", "create", "edit", "delete", "approve"],
    marketplace: ["view", "create", "edit", "delete"],
    catering: ["view", "create", "edit", "delete", "approve"],
    guests: ["view", "create", "edit", "delete"],
    wardrobe: ["view", "create", "edit", "delete"],
    tasks: ["view", "create", "edit", "delete", "approve"],
    finance: ["view", "create", "edit", "delete", "approve"],
    timeline: ["view", "create", "edit", "delete"],
    live: ["view", "edit"],
    documents: ["view", "create", "edit", "delete"],
    reports: ["view", "create"],
    settings: ["view", "create", "edit", "delete"],
  },
  OWNER: {
    dashboard: ["view", "create", "edit", "delete", "approve"],
    leads: ["view", "create", "edit", "delete", "approve"],
    weddings: ["view", "create", "edit", "delete", "approve"],
    couples: ["view", "create", "edit", "delete"],
    events: ["view", "create", "edit", "delete", "approve"],
    rituals: ["view", "create", "edit", "delete"],
    checklists: ["view", "create", "edit", "delete"],
    vendors: ["view", "create", "edit", "delete", "approve"],
    marketplace: ["view", "create", "edit", "delete"],
    catering: ["view", "create", "edit", "delete", "approve"],
    guests: ["view", "create", "edit", "delete"],
    wardrobe: ["view", "create", "edit", "delete"],
    tasks: ["view", "create", "edit", "delete", "approve"],
    finance: ["view", "create", "edit", "delete", "approve"],
    timeline: ["view", "create", "edit", "delete"],
    live: ["view", "edit"],
    documents: ["view", "create", "edit", "delete"],
    reports: ["view", "create"],
    settings: ["view", "create", "edit", "delete"],
  },
  LEAD_PLANNER: {
    dashboard: ["view"],
    leads: ["view", "create", "edit"],
    weddings: ["view", "create", "edit"],
    couples: ["view", "create", "edit"],
    events: ["view", "create", "edit", "delete"],
    rituals: ["view", "create", "edit"],
    checklists: ["view", "create", "edit"],
    vendors: ["view", "create", "edit"],
    marketplace: ["view", "create", "edit"],
    catering: ["view", "create", "edit"],
    guests: ["view", "create", "edit"],
    wardrobe: ["view", "create", "edit"],
    tasks: ["view", "create", "edit", "approve"],
    finance: ["view"],
    timeline: ["view", "create", "edit"],
    live: ["view", "edit"],
    documents: ["view", "create"],
    reports: ["view"],
  },
  WEDDING_PLANNER: {
    dashboard: ["view"],
    leads: ["view", "create", "edit"],
    weddings: ["view", "edit"],
    couples: ["view", "edit"],
    events: ["view", "create", "edit"],
    rituals: ["view"],
    checklists: ["view", "edit"],
    vendors: ["view"],
    marketplace: ["view"],
    catering: ["view"],
    guests: ["view", "edit"],
    wardrobe: ["view", "edit"],
    tasks: ["view", "create", "edit"],
    timeline: ["view", "create", "edit"],
    live: ["view", "edit"],
    documents: ["view", "create"],
  },
  FINANCE_MANAGER: {
    dashboard: ["view"],
    weddings: ["view"],
    finance: ["view", "create", "edit", "approve"],
    vendors: ["view"],
    marketplace: ["view"],
    reports: ["view", "create"],
    documents: ["view", "create"],
  },
  HOSPITALITY_MANAGER: {
    dashboard: ["view"],
    weddings: ["view"],
    guests: ["view", "create", "edit"],
    catering: ["view"],
    tasks: ["view", "create", "edit"],
    documents: ["view"],
  },
  VENDOR_COORDINATOR: {
    dashboard: ["view"],
    weddings: ["view"],
    vendors: ["view", "create", "edit"],
    marketplace: ["view", "create", "edit"],
    tasks: ["view", "create", "edit"],
    timeline: ["view"],
    documents: ["view", "create"],
  },
  CATERING_COORDINATOR: {
    dashboard: ["view"],
    weddings: ["view"],
    catering: ["view", "create", "edit"],
    vendors: ["view"],
    marketplace: ["view"],
    tasks: ["view", "create", "edit"],
  },
  FAMILY_VIEW: {
    weddings: ["view"],
    events: ["view"],
    guests: ["view"],
    checklists: ["view"],
  },
  COUPLE_VIEW: {
    weddings: ["view"],
    events: ["view"],
    guests: ["view"],
    checklists: ["view"],
    wardrobe: ["view"],
  },
  VENDOR_VIEW: {
    events: ["view"],
    timeline: ["view"],
    tasks: ["view"],
  },
};

// ── Check permission helper ──

export function hasPermission(
  role: UserRole,
  module: Module,
  permission: Permission
): boolean {
  const rolePerms = ROLE_PERMISSIONS[role];
  if (!rolePerms) return false;
  const modulePerms = rolePerms[module];
  if (!modulePerms) return false;
  return modulePerms.includes(permission);
}

export function canAccessModule(role: UserRole, module: Module): boolean {
  return hasPermission(role, module, "view");
}
