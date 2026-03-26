import { UserCircle, Plus } from "lucide-react";
import { PageHeader, ActionButton, EmptyState } from "@/components/shared";

export default function CouplesPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Couple & Family Profiles"
        subtitle="Manage bride, groom, and family profiles for each wedding."
        actions={<ActionButton icon={Plus}>Create New</ActionButton>}
      />
      <EmptyState
        icon={UserCircle}
        title="Couple & Family Profiles"
        description="This module is ready for data. Connect your database and start adding records."
        actionLabel="Create New"
      />
    </div>
  );
}
