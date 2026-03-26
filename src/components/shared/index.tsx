import { cn } from "@/lib/utils";
import { type LucideIcon, Plus } from "lucide-react";

// ── Summary Card ───────────────────────────────

interface SummaryCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
  alert?: boolean;
}

export function SummaryCard({ label, value, sub, accent, alert }: SummaryCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-4 border transition-all hover:shadow-md",
        alert
          ? "border-red-200 bg-gradient-to-br from-red-50 to-white"
          : accent
          ? "border-amber-200 bg-gradient-to-br from-amber-50/60 to-white"
          : "border-gray-100 bg-white"
      )}
    >
      <div
        className={cn(
          "text-[11px] font-semibold uppercase tracking-wider mb-2",
          alert ? "text-red-400" : accent ? "text-amber-500" : "text-gray-400"
        )}
      >
        {label}
      </div>
      <div
        className={cn("text-2xl font-bold font-display", alert ? "text-red-600" : "text-gray-900")}
      >
        {value}
      </div>
      {sub && <div className="text-[11px] text-gray-400 mt-1">{sub}</div>}
    </div>
  );
}

// ── Page Header ────────────────────────────────

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-display">{title}</h1>
        {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}

// ── Primary Button ─────────────────────────────

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: LucideIcon;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md";
}

export function ActionButton({
  children,
  icon: Icon,
  variant = "primary",
  size = "md",
  className,
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      className={cn(
        "font-semibold rounded-xl flex items-center gap-1.5 transition",
        size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2.5 text-xs",
        variant === "primary" &&
          "text-white shadow-sm bg-gradient-to-r from-[#C8553D] to-[#E8913A] hover:opacity-90",
        variant === "outline" &&
          "border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300",
        variant === "ghost" && "text-gray-500 hover:bg-gray-100",
        className
      )}
      {...props}
    >
      {Icon && <Icon size={size === "sm" ? 13 : 14} />}
      {children}
    </button>
  );
}

// ── Status Badge ───────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  // Wedding
  INQUIRY: "bg-gray-100 text-gray-700",
  PROPOSAL: "bg-amber-50 text-amber-700",
  CONFIRMED: "bg-emerald-50 text-emerald-700",
  PLANNING_IN_PROGRESS: "bg-blue-50 text-blue-700",
  FINAL_PREP: "bg-orange-50 text-orange-700",
  LIVE_EXECUTION: "bg-red-50 text-red-700",
  COMPLETED: "bg-green-50 text-green-800",
  ARCHIVED: "bg-gray-50 text-gray-500",
  CANCELLED: "bg-gray-100 text-gray-400",
  // Lead
  NEW: "bg-blue-50 text-blue-700",
  CONTACTED: "bg-cyan-50 text-cyan-700",
  MEETING_SCHEDULED: "bg-violet-50 text-violet-700",
  PROPOSAL_SENT: "bg-amber-50 text-amber-700",
  NEGOTIATION: "bg-orange-50 text-orange-700",
  LOST: "bg-red-50 text-red-600",
  ON_HOLD: "bg-gray-100 text-gray-600",
  // Task
  TODO: "bg-gray-100 text-gray-600",
  IN_PROGRESS: "bg-blue-50 text-blue-700",
  BLOCKED: "bg-red-50 text-red-600",
  REVIEW: "bg-violet-50 text-violet-700",
  DONE: "bg-emerald-50 text-emerald-700",
  // Event
  DRAFT: "bg-gray-100 text-gray-600",
  POSTPONED: "bg-yellow-50 text-yellow-700",
  // Live
  ON_TIME: "bg-emerald-50 text-emerald-700",
  AT_RISK: "bg-amber-50 text-amber-700",
  DELAYED: "bg-red-50 text-red-700",
  READY: "bg-blue-50 text-blue-700",
  // Payment
  OVERDUE: "bg-red-100 text-red-700",
  DUE_TODAY: "bg-amber-100 text-amber-700",
  UPCOMING: "bg-gray-50 text-gray-500",
  PAID: "bg-emerald-50 text-emerald-700",
  // Priority
  URGENT: "bg-red-100 text-red-700",
  HIGH: "bg-orange-100 text-orange-700",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  LOW: "bg-gray-100 text-gray-600",
  // RSVP
  PENDING: "bg-gray-100 text-gray-600",
  DECLINED: "bg-red-50 text-red-600",
  TENTATIVE: "bg-yellow-50 text-yellow-700",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const color = STATUS_COLORS[status] || "bg-gray-100 text-gray-600";
  return (
    <span
      className={cn(
        "text-[9px] font-bold px-2 py-1 rounded-lg uppercase tracking-wide",
        color,
        className
      )}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}

// ── Priority Dot ───────────────────────────────

const PRIORITY_DOT: Record<string, string> = {
  URGENT: "bg-red-500",
  HIGH: "bg-orange-500",
  MEDIUM: "bg-yellow-500",
  LOW: "bg-gray-400",
};

export function PriorityDot({ priority }: { priority: string }) {
  return (
    <span
      className={cn("w-1.5 h-1.5 rounded-full inline-block", PRIORITY_DOT[priority] || "bg-gray-400")}
    />
  );
}

// ── Empty State ────────────────────────────────

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
      <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-4">
        <Icon size={28} className="text-amber-400" />
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-400 max-w-md mx-auto">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-6 px-5 py-2.5 text-xs font-semibold rounded-xl text-white shadow-sm bg-gradient-to-r from-[#C8553D] to-[#E8913A] hover:opacity-90 transition inline-flex items-center gap-2"
        >
          <Plus size={14} />
          {actionLabel}
        </button>
      )}
    </div>
  );
}

// ── Card Section ───────────────────────────────

interface CardSectionProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function CardSection({ title, subtitle, action, children, className }: CardSectionProps) {
  return (
    <div className={cn("bg-white rounded-2xl border border-gray-100 overflow-hidden", className)}>
      <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-800 tracking-tight">{title}</h2>
        {subtitle && (
          <span className="text-[10px] font-semibold text-gray-400 tracking-wider uppercase">
            {subtitle}
          </span>
        )}
        {action}
      </div>
      {children}
    </div>
  );
}

// ── Progress Bar ───────────────────────────────

interface ProgressBarProps {
  value: number;
  className?: string;
  size?: "sm" | "md";
}

export function ProgressBar({ value, className, size = "sm" }: ProgressBarProps) {
  const barColor =
    value >= 90 ? "bg-emerald-400" : value >= 70 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className={cn("bg-gray-100 rounded-full overflow-hidden", size === "sm" ? "h-1.5" : "h-2", className)}>
      <div
        className={cn("h-full rounded-full transition-all", barColor)}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  );
}
