import { CheckSquare, Plus } from "lucide-react";
import { PageHeader, ActionButton, EmptyState } from "@/components/shared";

export default function ChecklistsPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Ceremony Item Checklists"
        subtitle="Track every item needed for each ceremony and ritual."
        actions={<ActionButton icon={Plus}>Create New</ActionButton>}
      />
      <EmptyState
        icon={CheckSquare}
        title="Ceremony Item Checklists"
        description="This module is ready for data. Connect your database and start adding records."
        actionLabel="Create New"
      />
    </div>
  );
}
