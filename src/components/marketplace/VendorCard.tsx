import { Star, MapPin, ExternalLink, Globe, Instagram, Phone, Mail, Crown } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface VendorCardProps {
  vendor: {
    id: string;
    name: string;
    description: string | null;
    priceRange: string | null;
    rating: string | null;
    suitableForIndianWedding: boolean;
    top3: boolean;
    website: string | null;
    instagram: string | null;
    phone: string | null;
    notes: string | null;
    city: { name: string; slug: string };
    category: { name: string; icon: string | null };
  };
}

export function VendorCard({ vendor }: VendorCardProps) {
  return (
    <Link href={`/marketplace/${vendor.id}`}>
      <div
        className={cn(
          "bg-white rounded-2xl border p-5 hover:shadow-lg transition-all cursor-pointer group relative",
          vendor.top3
            ? "border-amber-200 hover:border-amber-300"
            : "border-gray-100 hover:border-gray-200"
        )}
      >
        {/* Top 3 badge */}
        {vendor.top3 && (
          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
            <Crown size={10} />
            TOP PICK
          </div>
        )}

        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-lg flex-shrink-0">
            {vendor.category.icon || "📦"}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-gray-900 group-hover:text-amber-700 transition truncate">
              {vendor.name}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                {vendor.category.name}
              </span>
              <span className="text-gray-200">·</span>
              <span className="flex items-center gap-0.5 text-[10px] text-gray-400">
                <MapPin size={9} />
                {vendor.city.name}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        {vendor.description && (
          <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">
            {vendor.description}
          </p>
        )}

        {/* Meta row */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            {vendor.rating && vendor.rating !== "Not available" && (
              <span className="flex items-center gap-1 text-xs text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-lg">
                <Star size={11} fill="currentColor" />
                {vendor.rating}
              </span>
            )}
            {vendor.suitableForIndianWedding && (
              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg uppercase tracking-wide">
                Indian Wedding ✓
              </span>
            )}
          </div>
          {vendor.priceRange && (
            <span className="text-[11px] font-semibold text-gray-600">
              {vendor.priceRange}
            </span>
          )}
        </div>

        {/* Quick links */}
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-50">
          {vendor.website && (
            <span className="text-gray-300 hover:text-amber-500 transition">
              <Globe size={13} />
            </span>
          )}
          {vendor.instagram && (
            <span className="text-gray-300 hover:text-pink-500 transition">
              <Instagram size={13} />
            </span>
          )}
          {vendor.phone && (
            <span className="text-gray-300 hover:text-emerald-500 transition">
              <Phone size={13} />
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
