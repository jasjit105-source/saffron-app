import { IndianRupee, Plus } from "lucide-react";
import { PageHeader, ActionButton, EmptyState } from "@/components/shared";

export default function FinancePage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Finance & Payments"
        subtitle="Quotations, payment tracking, vendor payables, and P&L."
        actions={<ActionButton icon={Plus}>Create New</ActionButton>}
      />
      <EmptyState
        icon={IndianRupee}
        title="Finance & Payments"
        description="This module is ready for data. Connect your database and start adding records."
        actionLabel="Create New"
      />
    </div>
  );
}
