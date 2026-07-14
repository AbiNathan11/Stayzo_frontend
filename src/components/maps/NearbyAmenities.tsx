'use client';

import React, { useState } from 'react';
import {
  CATEGORY_META,
  AMENITY_CATEGORIES,
  formatDistance,
  type Amenity,
  type AmenityCategory,
} from '@/services/google/places';
import { Star, MapPin } from 'lucide-react';

interface NearbyAmenitiesProps {
  amenities: Amenity[];
  loading: boolean;
  error?: string | null;
  /** Controlled active categories – if you want the filter to sync with the map */
  onCategoryChange?: (cats: AmenityCategory[]) => void;
}

/** Skeleton card for loading state */
function AmenityCardSkeleton() {
  return (
    <div className="animate-pulse flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl p-3.5">
      <div className="w-10 h-10 bg-gray-200 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-3/4" />
        <div className="h-2.5 bg-gray-100 rounded w-1/2" />
      </div>
      <div className="h-3 w-14 bg-gray-200 rounded" />
    </div>
  );
}

/**
 * Stayzo – NearbyAmenities Component
 * Displays a filterable list of nearby amenity cards with distance, rating,
 * and category info. Works alongside PropertyMap.
 */
export default function NearbyAmenities({
  amenities,
  loading,
  error,
  onCategoryChange,
}: NearbyAmenitiesProps) {
  const [activeFilter, setActiveFilter] = useState<AmenityCategory | 'all'>('all');
  const [showAll, setShowAll] = useState(false);

  const handleFilter = (cat: AmenityCategory | 'all') => {
    setActiveFilter(cat);
    setShowAll(false);
    if (onCategoryChange) {
      onCategoryChange(cat === 'all' ? [] : [cat]);
    }
  };

  const filtered =
    activeFilter === 'all'
      ? amenities
      : amenities.filter(a => a.category === activeFilter);

  const countByCategory = (cat: AmenityCategory) =>
    amenities.filter(a => a.category === cat).length;

  return (
    <div className="space-y-4">

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleFilter('all')}
          className={`text-[11px] font-extrabold px-3.5 py-1.5 rounded-full border transition ${activeFilter === 'all'
            ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
            : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
            }`}
        >
          All ({amenities.length})
        </button>
        {AMENITY_CATEGORIES.map(cat => {
          const meta = CATEGORY_META[cat];
          const count = countByCategory(cat);
          if (count === 0 && !loading) return null;
          return (
            <button
              key={cat}
              onClick={() => handleFilter(cat)}
              className={`text-[11px] font-extrabold px-3.5 py-1.5 rounded-full border transition flex items-center gap-1 ${activeFilter === cat
                ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                }`}
            >
              {meta.emoji} {meta.label} {count > 0 && `(${count})`}
            </button>
          );
        })}
      </div>

      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[...Array(6)].map((_, i) => <AmenityCardSkeleton key={i} />)}
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="flex items-center gap-2 text-sm text-red-600 font-semibold bg-red-50 border border-red-100 rounded-2xl p-4">
          <MapPin className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-xl">🗺️</div>
          <p className="text-sm font-bold text-gray-500">No {activeFilter === 'all' ? '' : activeFilter.replace('_', ' ')} venues found nearby</p>
          <p className="text-xs text-gray-400">
            {activeFilter === 'all'
              ? 'This property may be in a quieter area with fewer public venues.'
              : 'Try selecting a different category to explore what\'s nearby.'}
          </p>
        </div>
      )}

      {/* Amenity Cards */}
      {!loading && filtered.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(showAll ? filtered : filtered.slice(0, 6)).map(amenity => {
              const meta = CATEGORY_META[amenity.category];
              return (
                <div
                  key={amenity.id}
                  className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl p-3.5 hover:border-gray-400 hover:shadow-sm transition group"
                >
                  {/* Icon bubble */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${meta.color}`}>
                    {meta.emoji}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-extrabold text-[#1A1A1A] truncate">{amenity.name}</p>
                    <p className="text-[10px] font-bold text-gray-400 mt-0.5">{meta.label}</p>
                    {amenity.rating !== undefined && (
                      <div className="flex items-center gap-0.5 mt-1">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-[10px] font-bold text-gray-500">{amenity.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>

                  {/* Distance badge */}
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-extrabold text-gray-400 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
                      {formatDistance(amenity.distance)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          
          {!showAll && filtered.length > 6 && (
            <button
              onClick={() => setShowAll(true)}
              className="w-full py-3 bg-white border border-gray-200 hover:bg-gray-50 text-[#1A1A1A] text-xs font-bold rounded-2xl transition shadow-sm"
            >
              View More ({filtered.length - 6} more)
            </button>
          )}
        </div>
      )}
    </div>
  );
}
