import { Settings, Plus } from "lucide-react";
import { PageHeader, ActionButton, EmptyState } from "@/components/shared";

export default function SettingsPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Settings & Templates"
        subtitle="Master data, event templates, ritual templates, and system config."
        actions={<ActionButton icon={Plus}>Create New</ActionButton>}
      />
      <EmptyState
        icon={Settings}
        title="Settings & Templates"
        description="This module is ready for data. Connect your database and start adding records."
        actionLabel="Create New"
      />
    </div>
  );
}
