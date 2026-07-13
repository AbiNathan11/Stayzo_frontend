/**
 * Stayzo – Places Service
 * Fetches nearby amenities using Google Places API (Nearby Search).
 * NOTE: This is called client-side from a hook; the API key must be NEXT_PUBLIC_.
 */

import type { LatLng } from './geocode';

export type AmenityCategory =
  | 'hospital'
  | 'supermarket'
  | 'fish_market'
  | 'fuel_station'
  | 'atm'
  | 'bank'
  | 'pharmacy'
  | 'school';

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
  supermarket: { label: 'Super market', emoji: '🛒', color: 'bg-green-100 text-green-700', markerColor: '#22c55e' },
  fish_market: { label: 'Fish Market', emoji: '🐟', color: 'bg-blue-100 text-blue-700', markerColor: '#3b82f6' },
  fuel_station: { label: 'Fuel Station', emoji: '⛽', color: 'bg-yellow-100 text-yellow-700', markerColor: '#eab308' },
  atm: { label: 'ATM', emoji: '🏧', color: 'bg-slate-100 text-slate-700', markerColor: '#64748b' },
  bank: { label: 'Bank', emoji: '🏦', color: 'bg-indigo-100 text-indigo-700', markerColor: '#4f46e5' },
  pharmacy: { label: 'Pharmacy', emoji: '💊', color: 'bg-pink-100 text-pink-700', markerColor: '#ec4899' },
  school: { label: 'School', emoji: '🏫', color: 'bg-yellow-100 text-yellow-700', markerColor: '#eab308' },
};

export const AMENITY_CATEGORIES: AmenityCategory[] = [
  'hospital',
  'supermarket',
  'fish_market',
  'fuel_station',
  'atm',
  'bank',
  'pharmacy',
  'school',
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
  const fetchSingle = async (type?: string, keyword?: string) => {
    const url = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json');
    url.searchParams.append('location', `${origin.lat},${origin.lng}`);
    url.searchParams.append('radius', radiusMetres.toString());
    url.searchParams.append('key', apiKey);
    if (type) url.searchParams.append('type', type);
    if (keyword) url.searchParams.append('keyword', keyword);

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`Places API HTTP error: ${res.status}`);
    const data = await res.json();
    if (!['OK', 'ZERO_RESULTS'].includes(data.status)) {
      console.warn('[placesService] Unexpected status:', data.status, 'for:', type || keyword);
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
  };

  if (category === 'fish_market') {
    return fetchSingle(undefined, 'fish market');
  } else if (category === 'fuel_station') {
    return fetchSingle('gas_station');
  } else {
    return fetchSingle(category);
  }
}

/** Fetch all amenity categories in parallel */
export async function fetchNearbyAmenities(
  origin: LatLng,
  radiusMetres = 10000
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
