"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_CONFIG } from "@/config/navigation";
import { canAccessModule, type UserRole } from "@/types";

interface SidebarProps {
  userRole: UserRole;
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ userRole, collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  // Filter nav items based on role
  const filteredSections = NAV_CONFIG.map((section) => ({
    ...section,
    items: section.items.filter((item) => canAccessModule(userRole, item.key)),
  })).filter((section) => section.items.length > 0);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 bottom-0 z-40 flex flex-col transition-all duration-300",
        collapsed ? "w-[68px]" : "w-[260px]"
      )}
      style={{
        background: "linear-gradient(180deg, #1a1118 0%, #0f0d12 100%)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-white/5 shrink-0">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{
            background: "linear-gradient(135deg, #C8553D 0%, #E8913A 100%)",
          }}
        >
          <span className="text-white font-bold text-sm">S</span>
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <div className="text-white font-semibold text-sm tracking-wide font-display">
              Saffron
            </div>
            <div className="text-white/40 text-[10px] tracking-widest uppercase">
              Wedding Planner
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav
        className="flex-1 overflow-y-auto py-3 px-2"
        style={{ scrollbarWidth: "none" }}
      >
        {filteredSections.map((section) => (
          <div key={section.label} className="mb-4">
            {!collapsed && (
              <div className="px-3 mb-1.5 text-[10px] font-semibold tracking-[0.15em] text-white/25 uppercase">
                {section.label}
              </div>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 mb-0.5",
                    isActive
                      ? "bg-white/10 text-white shadow-sm"
                      : "text-white/45 hover:text-white/70 hover:bg-white/5"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <span
                    className={cn("shrink-0", isActive && "text-amber-400")}
                  >
                    <Icon size={17} />
                  </span>
                  {!collapsed && (
                    <>
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto px-1.5 py-0.5 bg-red-500/90 text-white text-[9px] font-bold rounded tracking-wider animate-pulse">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="h-10 border-t border-white/5 flex items-center justify-center text-white/30 hover:text-white/60 transition shrink-0"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
      </button>
    </aside>
  );
}
