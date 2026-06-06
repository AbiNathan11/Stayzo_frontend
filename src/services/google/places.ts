/**
 * Stayzo – Places Service
 * Fetches nearby amenities using Google Places API (Nearby Search).
 * NOTE: This is called client-side from a hook; the API key must be NEXT_PUBLIC_.
 */

import type { LatLng } from './geocode';

export type AmenityCategory =
  | 'hospital'
  | 'supermarket'
  | 'bus_station'
  | 'school'
  | 'university'
  | 'restaurant'
  | 'pharmacy';

export interface Amenity {
  id: string;
  name: string;
  category: AmenityCategory;
  lat: number;
  lng: number;
  rating?: number;
  distance?: number; // metres – calculated after fetch
  vicinity?: string;
}

// Label & emoji per category
export const CATEGORY_META: Record<
  AmenityCategory,
  { label: string; emoji: string; color: string; markerColor: string }
> = {
  hospital: { label: 'Hospital', emoji: '🏥', color: 'bg-red-100 text-red-700', markerColor: '#ef4444' },
  supermarket: { label: 'Supermarket', emoji: '🛒', color: 'bg-green-100 text-green-700', markerColor: '#22c55e' },
  bus_station: { label: 'Bus Stop', emoji: '🚌', color: 'bg-blue-100 text-blue-700', markerColor: '#3b82f6' },
  school: { label: 'School', emoji: '🏫', color: 'bg-yellow-100 text-yellow-700', markerColor: '#eab308' },
  university: { label: 'University', emoji: '🎓', color: 'bg-purple-100 text-purple-700', markerColor: '#a855f7' },
  restaurant: { label: 'Restaurant', emoji: '🍽️', color: 'bg-orange-100 text-orange-700', markerColor: '#f97316' },
  pharmacy: { label: 'Pharmacy', emoji: '💊', color: 'bg-pink-100 text-pink-700', markerColor: '#ec4899' },
};

export const AMENITY_CATEGORIES: AmenityCategory[] = [
  'hospital',
  'supermarket',
  'bus_station',
  'school',
  'university',
  'restaurant',
  'pharmacy',
];

/** Haversine distance in metres between two lat/lng points */
function haversineDistance(a: LatLng, b: LatLng): number {
  const R = 6371000;
  const φ1 = (a.lat * Math.PI) / 180;
  const φ2 = (b.lat * Math.PI) / 180;
  const Δφ = ((b.lat - a.lat) * Math.PI) / 180;
  const Δλ = ((b.lng - a.lng) * Math.PI) / 180;
  const x =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

/** Fetch nearby places for one category from Google Places Nearby Search */
async function fetchCategory(
  origin: LatLng,
  category: AmenityCategory,
  radiusMetres: number,
  apiKey: string
): Promise<Amenity[]> {
  // bus_station maps to 'transit_station' in Places API
  const placeType = category === 'bus_station' ? 'transit_station' : category;

  const url =
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json` +
    `?location=${origin.lat},${origin.lng}` +
    `&radius=${radiusMetres}` +
    `&type=${placeType}` +
    `&key=${apiKey}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Places API HTTP error: ${res.status}`);
  const data = await res.json();

  if (!['OK', 'ZERO_RESULTS'].includes(data.status)) {
    console.warn('[placesService] Unexpected status:', data.status, 'for type:', placeType);
    return [];
  }

  return (data.results ?? []).slice(0, 5).map((place: any) => ({
    id: place.place_id,
    name: place.name,
    category,
    lat: place.geometry.location.lat,
    lng: place.geometry.location.lng,
    rating: place.rating,
    vicinity: place.vicinity,
    distance: Math.round(haversineDistance(origin, {
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
    })),
  }));
}

/** Fetch all amenity categories in parallel */
export async function fetchNearbyAmenities(
  origin: LatLng,
  radiusMetres = 3000
): Promise<Amenity[]> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    console.error('[fetchNearbyAmenities] NEXT_PUBLIC_GOOGLE_PLACES_API_KEY is not set.');
    return [];
  }

  const results = await Promise.allSettled(
    AMENITY_CATEGORIES.map((cat) => fetchCategory(origin, cat, radiusMetres, apiKey))
  );

  return results
    .filter((r): r is PromiseFulfilledResult<Amenity[]> => r.status === 'fulfilled')
    .flatMap((r) => r.value)
    .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
}

export function formatDistance(metres?: number): string {
  if (metres === undefined) return '—';
  if (metres < 1000) return `${metres} m`;
  return `${(metres / 1000).toFixed(1)} km`;
}
