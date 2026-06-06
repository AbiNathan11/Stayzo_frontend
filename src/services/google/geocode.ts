/**
 * Stayzo – Geocoding Service
 * Converts a human-readable address to { lat, lng } using Google Geocoding API.
 */

export interface LatLng {
  lat: number;
  lng: number;
}

export async function geocodeAddress(address: string): Promise<LatLng | null> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY;
  if (!apiKey) {
    console.error('[geocodeAddress] NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY is not set.');
    return null;
  }
  if (!address?.trim()) return null;

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Geocoding HTTP error: ${res.status}`);

    const data = await res.json();
    if (data.status !== 'OK' || !data.results?.length) {
      console.warn('[geocodeAddress] No results for address:', address, '| status:', data.status);
      return null;
    }

    const { lat, lng } = data.results[0].geometry.location;
    return { lat, lng };
  } catch (err) {
    console.error('[geocodeAddress] Failed to geocode address:', err);
    return null;
  }
}
