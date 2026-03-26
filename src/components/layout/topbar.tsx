"use client";

import { Bell, Search, Menu } from "lucide-react";
import { getInitials } from "@/lib/utils";

interface TopbarProps {
  userName: string;
  userRole: string;
  sidebarCollapsed: boolean;
  onMenuToggle: () => void;
}

export function Topbar({
  userName,
  userRole,
  sidebarCollapsed,
  onMenuToggle,
}: TopbarProps) {
  return (
    <header
      className="fixed top-0 right-0 z-30 h-16 flex items-center justify-between px-6 border-b transition-all duration-300"
      style={{
        left: sidebarCollapsed ? 68 : 260,
        background: "rgba(255,255,255,0.8)",
        backdropFilter: "blur(12px)",
        borderColor: "rgba(0,0,0,0.06)",
      }}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100"
        >
          <Menu size={20} className="text-gray-500" />
        </button>
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
          />
          <input
            placeholder="Search weddings, leads, vendors..."
            className="w-80 pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:bg-white transition"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-xl hover:bg-gray-100 transition">
          <Bell size={18} className="text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div className="h-6 w-px bg-gray-200" />
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{
              background: "linear-gradient(135deg, #C8553D, #E8913A)",
            }}
          >
            {getInitials(userName)}
          </div>
          <div className="hidden md:block">
            <div className="text-xs font-semibold text-gray-800">
              {userName}
            </div>
            <div className="text-[10px] text-gray-400">
              {userRole.replace(/_/g, " ")}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
