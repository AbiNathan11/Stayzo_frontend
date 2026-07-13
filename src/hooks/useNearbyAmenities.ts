'use client';

import { useState, useEffect } from 'react';
import { type LatLng } from '@/services/google/geocode';
import { type Amenity } from '@/services/google/places';

interface UseNearbyAmenitiesResult {
  coords: LatLng | null;
  amenities: Amenity[];
  loading: boolean;
  error: string | null;
}

/**
 * Stayzo – useNearbyAmenities hook
 * Given a property address string, fetches both resolved coordinates and
 * nearby amenities from the server-side API proxy to avoid CORS issues.
 */
export function useNearbyAmenities(
  address: string | null | undefined,
  lat?: number | null,
  lng?: number | null,
  radiusMetres = 10000
): UseNearbyAmenitiesResult {
  const [coords, setCoords] = useState<LatLng | null>(null);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let query = '';
    if (lat !== undefined && lat !== null && lng !== undefined && lng !== null) {
      query = `lat=${lat}&lng=${lng}`;
    } else if (address?.trim()) {
      query = `address=${encodeURIComponent(address)}`;
    } else {
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    setAmenities([]);
    setCoords(null);

    (async () => {
      try {
        const url = `http://localhost:3001/api/properties/amenities?${query}&radius=${radiusMetres}`;
        const res = await fetch(url);
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error ?? `Server error: ${res.status}`);
        }
        
        const data = await res.json();
        if (cancelled) return;

        setCoords(data.coords);
        setAmenities(data.amenities);
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message ?? 'Failed to load nearby amenities.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [address, lat, lng, radiusMetres]);

  return { coords, amenities, loading, error };
}
