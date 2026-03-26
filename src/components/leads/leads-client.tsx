"use client";

import { useState } from "react";
import { Plus, Phone, IndianRupee } from "lucide-react";
import {
  PageHeader,
  ActionButton,
  StatusBadge,
} from "@/components/shared";

const LEAD_STAGES = [
  "ALL",
  "NEW",
  "CONTACTED",
  "MEETING_SCHEDULED",
  "PROPOSAL_SENT",
  "NEGOTIATION",
  "CONFIRMED",
  "LOST",
  "ON_HOLD",
];

interface LeadsClientProps {
  leads: any[];
  planners: { id: string; name: string }[];
}

export function LeadsClient({ leads, planners }: LeadsClientProps) {
  const [filter, setFilter] = useState("ALL");

  const filtered =
    filter === "ALL" ? leads : leads.filter((l: any) => l.status === filter);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Leads & Inquiries"
        subtitle={`${leads.length} total leads • ${leads.filter((l: any) => l.status === "NEW").length} new`}
        actions={
          <ActionButton icon={Plus}>New Lead</ActionButton>
        }
      />

      {/* Stage filters */}
      <div className="flex gap-2 flex-wrap">
        {LEAD_STAGES.map((stage) => (
          <button
            key={stage}
            onClick={() => setFilter(stage)}
            className={`px-3 py-1.5 text-[11px] font-semibold rounded-lg transition ${
              filter === stage
                ? "bg-gray-900 text-white"
                : "bg-gray-50 text-gray-500 hover:bg-gray-100"
            }`}
          >
            {stage.replace(/_/g, " ")}
            {stage !== "ALL" && (
              <span className="ml-1.5 opacity-60">
                {leads.filter((l: any) => l.status === stage).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Lead cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((lead: any) => (
          <div
            key={lead.id}
            className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:border-gray-200 transition cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  {lead.brideName} & {lead.groomName}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {lead.city} • {lead.weddingDateOrMonth || "TBD"}
                </p>
              </div>
              <StatusBadge status={lead.status} />
            </div>
            <div className="space-y-2 mb-3">
              {lead.phone && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Phone size={12} className="text-gray-300" />
                  {lead.phone}
                </div>
              )}
              {lead.expectedBudgetRange && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <IndianRupee size={12} className="text-gray-300" />
                  {lead.expectedBudgetRange}
                </div>
              )}
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-50">
              <div className="flex items-center gap-2">
                {lead.assignedPlanner ? (
                  <>
                    <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[8px] font-bold text-gray-600">
                      {lead.assignedPlanner.name.charAt(0)}
                    </div>
                    <span className="text-[10px] text-gray-400">
                      {lead.assignedPlanner.name}
                    </span>
                  </>
                ) : (
                  <span className="text-[10px] text-gray-300">Unassigned</span>
                )}
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-50 text-gray-400 font-medium">
                {lead.source}
              </span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-sm text-gray-300">
            No leads in this stage
          </div>
        )}
      </div>
    </div>
  );
}
