"use client";

import { useState, useCallback } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { CityCards } from "./CityCards";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface CategoryData {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  _count: { vendors: number };
}

interface CityData {
  id: string;
  name: string;
  slug: string;
  _count: { vendors: number };
}

interface VendorFiltersProps {
  categories: CategoryData[];
  cities: CityData[];
}

export function VendorFilters({ categories, cities }: VendorFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCity = searchParams.get("city");
  const currentCategory = searchParams.get("category");
  const currentSearch = searchParams.get("q") || "";
  const currentTop3 = searchParams.get("top3") === "true";
  const currentIndian = searchParams.get("indian") === "true";

  const [search, setSearch] = useState(currentSearch);

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ q: search || null });
  };

  const activeFilters =
    (currentCity ? 1 : 0) +
    (currentCategory ? 1 : 0) +
    (currentSearch ? 1 : 0) +
    (currentTop3 ? 1 : 0) +
    (currentIndian ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* City cards */}
      <CityCards
        cities={cities}
        selectedCity={currentCity}
        onSelect={(slug) => updateParams({ city: slug })}
      />

      {/* Search + toggles */}
      <div className="flex gap-3 flex-wrap items-center">
        <form onSubmit={handleSearch} className="flex-1 min-w-[200px] relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search vendors..."
            className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition"
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                updateParams({ q: null });
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
            >
              <X size={13} />
            </button>
          )}
        </form>

        <button
          onClick={() => updateParams({ top3: currentTop3 ? null : "true" })}
          className={cn(
            "px-3 py-2 text-xs font-semibold rounded-xl border transition",
            currentTop3
              ? "bg-amber-50 border-amber-300 text-amber-700"
              : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
          )}
        >
          ⭐ Top Picks
        </button>

        <button
          onClick={() => updateParams({ indian: currentIndian ? null : "true" })}
          className={cn(
            "px-3 py-2 text-xs font-semibold rounded-xl border transition",
            currentIndian
              ? "bg-emerald-50 border-emerald-300 text-emerald-700"
              : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
          )}
        >
          🪷 Indian Wedding
        </button>

        {activeFilters > 0 && (
          <button
            onClick={() =>
              updateParams({
                city: null,
                category: null,
                q: null,
                top3: null,
                indian: null,
              })
            }
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition"
          >
            Clear all ({activeFilters})
          </button>
        )}
      </div>

      {/* Category filter bar */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => updateParams({ category: null })}
          className={cn(
            "flex-shrink-0 px-3 py-1.5 text-xs font-semibold rounded-lg border transition",
            !currentCategory
              ? "bg-gradient-to-r from-[#C8553D] to-[#E8913A] text-white border-transparent"
              : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
          )}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() =>
              updateParams({
                category: currentCategory === cat.slug ? null : cat.slug,
              })
            }
            className={cn(
              "flex-shrink-0 px-3 py-1.5 text-xs font-semibold rounded-lg border transition whitespace-nowrap",
              currentCategory === cat.slug
                ? "bg-gradient-to-r from-[#C8553D] to-[#E8913A] text-white border-transparent"
                : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
            )}
          >
            {cat.icon} {cat.name} ({cat._count.vendors})
          </button>
        ))}
      </div>
    </div>
  );
}
