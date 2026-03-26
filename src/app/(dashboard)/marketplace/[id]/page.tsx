import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Globe,
  Instagram,
  Phone,
  Mail,
  MapPin,
  Star,
  Crown,
  CheckCircle2,
  ExternalLink,
  StickyNote,
} from "lucide-react";
import { PageHeader } from "@/components/shared";
import { VendorCard } from "@/components/marketplace/VendorCard";

export const dynamic = "force-dynamic";

interface VendorDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function VendorDetailPage(props: VendorDetailPageProps) {
  const { id } = await props.params;

  const vendor = await db.marketplaceVendor.findUnique({
    where: { id },
    include: {
      city: true,
      category: true,
    },
  });

  if (!vendor) notFound();

  // Get similar vendors (same city + category, excluding current)
  const similarVendors = await db.marketplaceVendor.findMany({
    where: {
      cityId: vendor.cityId,
      categoryId: vendor.categoryId,
      id: { not: vendor.id },
    },
    include: { city: true, category: true },
    orderBy: [{ top3: "desc" }, { name: "asc" }],
    take: 3,
  });

  // Get other vendors in same city (different category)
  const otherCityVendors = await db.marketplaceVendor.findMany({
    where: {
      cityId: vendor.cityId,
      categoryId: { not: vendor.categoryId },
      top3: true,
    },
    include: { city: true, category: true },
    orderBy: { name: "asc" },
    take: 6,
  });

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        href="/marketplace"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-600 transition"
      >
        <ArrowLeft size={14} />
        Back to Marketplace
      </Link>

      {/* Main vendor card */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Header bar */}
        <div className="bg-gradient-to-r from-[#2d2a24] to-[#4a3f2f] px-6 py-5">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center text-2xl flex-shrink-0">
              {vendor.category.icon || "📦"}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-white font-display">
                  {vendor.name}
                </h1>
                {vendor.top3 && (
                  <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Crown size={10} />
                    TOP PICK
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-gray-400">
                  {vendor.category.name}
                </span>
                <span className="text-gray-600">·</span>
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <MapPin size={10} />
                  {vendor.city.name}
                </span>
                {vendor.rating && vendor.rating !== "Not available" && (
                  <>
                    <span className="text-gray-600">·</span>
                    <span className="flex items-center gap-1 text-xs text-amber-400">
                      <Star size={10} fill="currentColor" />
                      {vendor.rating}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Badges row */}
          <div className="flex gap-2 flex-wrap">
            {vendor.suitableForIndianWedding && (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg">
                <CheckCircle2 size={13} />
                Suitable for Indian Weddings
              </span>
            )}
            {vendor.priceRange && (
              <span className="text-xs font-semibold text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                💰 {vendor.priceRange}
              </span>
            )}
          </div>

          {/* Description */}
          {vendor.description && (
            <div>
              <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                About
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {vendor.description}
              </p>
            </div>
          )}

          {/* Notes */}
          {vendor.notes && (
            <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-100">
              <div className="flex items-center gap-1.5 mb-2">
                <StickyNote size={13} className="text-amber-500" />
                <h3 className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider">
                  Notes
                </h3>
              </div>
              <p className="text-sm text-gray-600">{vendor.notes}</p>
            </div>
          )}

          {/* Contact info */}
          <div>
            <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Contact & Links
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {vendor.phone && (
                <a
                  href={`tel:${vendor.phone}`}
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition"
                >
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <Phone size={15} className="text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-wider">
                      Phone
                    </div>
                    <div className="text-xs font-semibold text-gray-700">
                      {vendor.phone}
                    </div>
                  </div>
                </a>
              )}
              {vendor.email && (
                <a
                  href={`mailto:${vendor.email}`}
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition"
                >
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Mail size={15} className="text-blue-600" />
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-wider">
                      Email
                    </div>
                    <div className="text-xs font-semibold text-gray-700">
                      {vendor.email}
                    </div>
                  </div>
                </a>
              )}
              {vendor.website && (
                <a
                  href={vendor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-amber-200 hover:bg-amber-50/30 transition"
                >
                  <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
                    <Globe size={15} className="text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-gray-400 uppercase tracking-wider">
                      Website
                    </div>
                    <div className="text-xs font-semibold text-gray-700 truncate flex items-center gap-1">
                      {vendor.website.replace(/https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                      <ExternalLink size={10} className="text-gray-300 flex-shrink-0" />
                    </div>
                  </div>
                </a>
              )}
              {vendor.instagram && (
                <a
                  href={
                    vendor.instagram.startsWith("http")
                      ? vendor.instagram
                      : `https://instagram.com/${vendor.instagram.replace("@", "")}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-pink-200 hover:bg-pink-50/30 transition"
                >
                  <div className="w-9 h-9 rounded-lg bg-pink-50 flex items-center justify-center">
                    <Instagram size={15} className="text-pink-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-gray-400 uppercase tracking-wider">
                      Instagram
                    </div>
                    <div className="text-xs font-semibold text-gray-700 truncate">
                      {vendor.instagram.startsWith("http")
                        ? vendor.instagram.split("/").filter(Boolean).pop()
                        : vendor.instagram}
                    </div>
                  </div>
                </a>
              )}
            </div>
            {!vendor.phone &&
              !vendor.email &&
              !vendor.website &&
              !vendor.instagram && (
                <p className="text-xs text-gray-400 italic">
                  No contact information available yet.
                </p>
              )}
          </div>
        </div>
      </div>

      {/* Similar vendors */}
      {similarVendors.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-gray-800 mb-3">
            Similar {vendor.category.name} in {vendor.city.name}
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {similarVendors.map((v) => (
              <VendorCard key={v.id} vendor={v} />
            ))}
          </div>
        </div>
      )}

      {/* Other top vendors in city */}
      {otherCityVendors.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-gray-800 mb-3">
            More Top Vendors in {vendor.city.name}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherCityVendors.map((v) => (
              <VendorCard key={v.id} vendor={v} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
