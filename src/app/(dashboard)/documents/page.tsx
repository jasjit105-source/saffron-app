import { FileText, Plus } from "lucide-react";
import { PageHeader, ActionButton, EmptyState } from "@/components/shared";

export default function DocumentsPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Documents & Files"
        subtitle="Centralized file storage organized by wedding."
        actions={<ActionButton icon={Plus}>Create New</ActionButton>}
      />
      <EmptyState
        icon={FileText}
        title="Documents & Files"
        description="This module is ready for data. Connect your database and start adding records."
        actionLabel="Create New"
      />
    </div>
  );
}
