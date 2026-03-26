import { BarChart3, Plus } from "lucide-react";
import { PageHeader, ActionButton, EmptyState } from "@/components/shared";

export default function ReportsPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Reports & Analytics"
        subtitle="Wedding profitability, lead conversion, budget analysis."
        actions={<ActionButton icon={Plus}>Create New</ActionButton>}
      />
      <EmptyState
        icon={BarChart3}
        title="Reports & Analytics"
        description="This module is ready for data. Connect your database and start adding records."
        actionLabel="Create New"
      />
    </div>
  );
}
