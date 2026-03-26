"use client";

import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";

interface CityCardData {
  id: string;
  name: string;
  slug: string;
  _count: { vendors: number };
}

const CITY_EMOJI: Record<string, string> = {
  cancun: "🏖️",
  "los-cabos": "🌊",
  "mexico-city": "🏛️",
  "san-miguel-de-allende": "⛪",
  "puerto-vallarta": "🌅",
};

const CITY_VIBE: Record<string, string> = {
  cancun: "Beach paradise",
  "los-cabos": "Luxury coastal",
  "mexico-city": "Urban grandeur",
  "san-miguel-de-allende": "Colonial romance",
  "puerto-vallarta": "Tropical charm",
};

interface CityCardsProps {
  cities: CityCardData[];
  selectedCity: string | null;
  onSelect: (slug: string | null) => void;
}

export function CityCards({ cities, selectedCity, onSelect }: CityCardsProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      <button
        onClick={() => onSelect(null)}
        className={cn(
          "flex-shrink-0 rounded-xl border px-4 py-3 text-left transition-all hover:shadow-md min-w-[140px]",
          selectedCity === null
            ? "border-amber-400 bg-gradient-to-br from-amber-50 to-white shadow-sm"
            : "border-gray-100 bg-white hover:border-gray-200"
        )}
      >
        <div className="text-xl mb-1">🌎</div>
        <div className="text-sm font-bold text-gray-900">All Cities</div>
        <div className="text-[11px] text-gray-400 mt-0.5">
          {cities.reduce((sum, c) => sum + c._count.vendors, 0)} vendors
        </div>
      </button>
      {cities.map((city) => {
        const isSelected = selectedCity === city.slug;
        return (
          <button
            key={city.id}
            onClick={() => onSelect(isSelected ? null : city.slug)}
            className={cn(
              "flex-shrink-0 rounded-xl border px-4 py-3 text-left transition-all hover:shadow-md min-w-[140px]",
              isSelected
                ? "border-amber-400 bg-gradient-to-br from-amber-50 to-white shadow-sm"
                : "border-gray-100 bg-white hover:border-gray-200"
            )}
          >
            <div className="text-xl mb-1">{CITY_EMOJI[city.slug] || "📍"}</div>
            <div className="text-sm font-bold text-gray-900">{city.name}</div>
            <div className="text-[11px] text-gray-400 mt-0.5">
              {CITY_VIBE[city.slug] || ""} · {city._count.vendors} vendors
            </div>
          </button>
        );
      })}
    </div>
  );
}
