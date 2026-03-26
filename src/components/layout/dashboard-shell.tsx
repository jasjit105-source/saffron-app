"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import type { UserRole } from "@/types";

interface DashboardShellProps {
  children: React.ReactNode;
  userName: string;
  userRole: UserRole;
}

export function DashboardShell({
  children,
  userName,
  userRole,
}: DashboardShellProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#faf9f7] font-body">
      <Sidebar
        userRole={userRole}
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />
      <Topbar
        userName={userName}
        userRole={userRole}
        sidebarCollapsed={collapsed}
        onMenuToggle={() => setCollapsed(!collapsed)}
      />
      <main
        className="pt-16 transition-all duration-300 min-h-screen"
        style={{ marginLeft: collapsed ? 68 : 260 }}
      >
        <div className="p-6 max-w-[1400px] mx-auto">{children}</div>
      </main>
    </div>
  );
}
