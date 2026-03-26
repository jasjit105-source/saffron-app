import { db } from "@/lib/db";
import { Store, Plus, Star, Phone, MapPin } from "lucide-react";
import { PageHeader, ActionButton, StatusBadge } from "@/components/shared";

export const dynamic = "force-dynamic";

export default async function VendorsPage() {
  const vendors = await db.vendor.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-5">
      <PageHeader title="Vendor Management" subtitle={`${vendors.length} vendors registered`} actions={<ActionButton icon={Plus}>Add Vendor</ActionButton>} />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vendors.map((v: any) => (
          <div key={v.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:border-gray-200 transition cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-gray-900">{v.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{v.category?.replace(/_/g, " ")}</p>
              </div>
              {v.internalRating > 0 && (
                <div className="flex items-center gap-1 text-amber-500">
                  <Star size={12} fill="currentColor" />
                  <span className="text-xs font-bold">{v.internalRating}</span>
                </div>
              )}
            </div>
            <div className="space-y-1.5">
              {v.contactPerson && <div className="text-xs text-gray-500">{v.contactPerson}</div>}
              {v.phone && <div className="flex items-center gap-1.5 text-xs text-gray-500"><Phone size={11} className="text-gray-300" />{v.phone}</div>}
              {v.city && <div className="flex items-center gap-1.5 text-xs text-gray-500"><MapPin size={11} className="text-gray-300" />{v.city}</div>}
            </div>
          </div>
        ))}
      </div>
      {vendors.length === 0 && <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center"><Store size={28} className="text-amber-400 mx-auto mb-3" /><h3 className="text-lg font-bold text-gray-800 mb-2">No Vendors Yet</h3><p className="text-sm text-gray-400">Add your first vendor to the system.</p></div>}
    </div>
  );
}
