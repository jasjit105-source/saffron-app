import { Shirt, Plus } from "lucide-react";
import { PageHeader, ActionButton, EmptyState } from "@/components/shared";

export default function WardrobePage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Wardrobe, Jewelry & Gifts"
        subtitle="Track outfits, accessories, gift trays, and shagun."
        actions={<ActionButton icon={Plus}>Create New</ActionButton>}
      />
      <EmptyState
        icon={Shirt}
        title="Wardrobe, Jewelry & Gifts"
        description="This module is ready for data. Connect your database and start adding records."
        actionLabel="Create New"
      />
    </div>
  );
}
