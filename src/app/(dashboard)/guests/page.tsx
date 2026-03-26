import { UserCheck, Plus } from "lucide-react";
import { PageHeader, ActionButton, EmptyState } from "@/components/shared";

export default function GuestsPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Guests & Hospitality"
        subtitle="RSVP tracking, rooming, transport, and VIP management."
        actions={<ActionButton icon={Plus}>Create New</ActionButton>}
      />
      <EmptyState
        icon={UserCheck}
        title="Guests & Hospitality"
        description="This module is ready for data. Connect your database and start adding records."
        actionLabel="Create New"
      />
    </div>
  );
}
