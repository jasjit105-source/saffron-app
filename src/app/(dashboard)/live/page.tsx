import { Video, Plus } from "lucide-react";
import { PageHeader, ActionButton, EmptyState } from "@/components/shared";

export default function LivePage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Live Dashboard"
        subtitle="Real-time wedding-day execution monitoring."
        actions={<ActionButton icon={Plus}>Create New</ActionButton>}
      />
      <EmptyState
        icon={Video}
        title="Live Dashboard"
        description="This module is ready for data. Connect your database and start adding records."
        actionLabel="Create New"
      />
    </div>
  );
}
