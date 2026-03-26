import { Clock, Plus } from "lucide-react";
import { PageHeader, ActionButton, EmptyState } from "@/components/shared";

export default function TimelinePage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Timeline & Run Sheets"
        subtitle="Minute-by-minute event schedules and vendor call sheets."
        actions={<ActionButton icon={Plus}>Create New</ActionButton>}
      />
      <EmptyState
        icon={Clock}
        title="Timeline & Run Sheets"
        description="This module is ready for data. Connect your database and start adding records."
        actionLabel="Create New"
      />
    </div>
  );
}
