"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  PageHeader,
  ActionButton,
  StatusBadge,
  ProgressBar,
} from "@/components/shared";

const WEDDING_TYPE_LABELS: Record<string, string> = {
  SIKH: "Sikh",
  HINDU: "Hindu",
  SIKH_HINDU_MIXED: "Sikh + Hindu",
  PUNJABI: "Punjabi",
  NORTH_INDIAN: "North Indian",
  GUJARATI: "Gujarati",
  SOUTH_INDIAN: "South Indian",
  CUSTOM: "Custom",
};

interface WeddingsClientProps {
  weddings: any[];
}

export function WeddingsClient({ weddings }: WeddingsClientProps) {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Wedding Master"
        subtitle={`${weddings.length} weddings in portfolio`}
        actions={
          <Link href="/weddings/new">
            <ActionButton icon={Plus}>New Wedding</ActionButton>
          </Link>
        }
      />

      <div className="space-y-4">
        {weddings.map((w: any) => {
          const budgetPct =
            w.budgetCap > 0
              ? Math.round(((w.contractValue || 0) / w.budgetCap) * 100)
              : 0;

          return (
            <Link
              key={w.id}
              href={`/weddings/${w.id}`}
              className="block bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:border-gray-200 transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-bold text-gray-900">
                      {w.title}
                    </h3>
                    <StatusBadge status={w.status} />
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    {w.couple && (
                      <>
                        <span className="text-xs text-gray-500">
                          {w.couple.brideFullName} & {w.couple.groomFullName}
                        </span>
                        <span className="text-gray-200">|</span>
                      </>
                    )}
                    <span className="text-xs text-gray-400">
                      {w.primaryCity}
                    </span>
                    <span className="text-gray-200">|</span>
                    <span className="text-xs text-gray-400">
                      {WEDDING_TYPE_LABELS[w.weddingType] || w.weddingType}
                    </span>
                    {w.startDate && (
                      <>
                        <span className="text-gray-200">|</span>
                        <span className="text-xs text-gray-400">
                          {formatDate(w.startDate)}
                          {w.endDate && ` → ${formatDate(w.endDate)}`}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                {w.contractValue > 0 && (
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900 font-display">
                      {formatCurrency(Number(w.contractValue))}
                    </div>
                    <div className="text-[10px] text-gray-400">
                      contract value
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Events
                  </div>
                  <div className="text-sm font-bold text-gray-800">
                    {w._count?.events || 0}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Guests
                  </div>
                  <div className="text-sm font-bold text-gray-800">
                    {w.confirmedGuestCount || 0} / {w.estimatedGuestCount || 0}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Tasks
                  </div>
                  <div className="text-sm font-bold text-gray-800">
                    {w._count?.tasks || 0}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Lead Planner
                  </div>
                  <div className="text-sm text-gray-700">
                    {w.leadPlanner?.name || "Unassigned"}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Scope
                  </div>
                  <div className="text-sm text-gray-700">
                    {w.planningScope?.replace(/_/g, " ") || "—"}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
        {weddings.length === 0 && (
          <div className="text-center py-16 text-sm text-gray-300">
            No weddings yet — create your first wedding
          </div>
        )}
      </div>
    </div>
  );
}
