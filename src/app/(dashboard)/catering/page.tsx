import { UtensilsCrossed, Plus } from "lucide-react";
import { PageHeader, ActionButton, EmptyState } from "@/components/shared";

export default function CateringPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Menu & Catering"
        subtitle="Plan menus, manage dietary requirements, and track tasting approvals."
        actions={<ActionButton icon={Plus}>Create New</ActionButton>}
      />
      <EmptyState
        icon={UtensilsCrossed}
        title="Menu & Catering"
        description="This module is ready for data. Connect your database and start adding records."
        actionLabel="Create New"
      />
    </div>
  );
}
