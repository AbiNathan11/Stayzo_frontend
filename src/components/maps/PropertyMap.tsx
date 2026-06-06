'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import type { LatLng } from '@/services/google/geocode';
import { type Amenity, CATEGORY_META, type AmenityCategory } from '@/services/google/places';
import { MapPin } from 'lucide-react';

declare global {
  interface Window {
    google: typeof google;
    initGoogleMap?: () => void;
    _googleMapsLoaded?: boolean;
  }
}

interface PropertyMapProps {
  coords: LatLng;
  amenities?: Amenity[];
  propertyTitle?: string;
  propertyImage?: string;
  /** Filter which amenity categories to show markers for. Defaults to all. */
  activeCategories?: AmenityCategory[];
  className?: string;
}

/** Dynamically loads the Maps JS API script only once per page lifecycle */
function loadGoogleMapsScript(apiKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window._googleMapsLoaded) { resolve(); return; }
    if (document.getElementById('google-maps-script')) {
      // already injected – wait for it
      const poll = setInterval(() => {
        if (window.google?.maps) { clearInterval(poll); window._googleMapsLoaded = true; resolve(); }
      }, 100);
      return;
    }
    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => { window._googleMapsLoaded = true; resolve(); };
    script.onerror = () => reject(new Error('Failed to load Google Maps script'));
    document.head.appendChild(script);
  });
}

/**
 * Helper to generate a custom pin marker image containing the property image on a canvas.
 * Falls back to a default house/dot icon if the image fails to load or violates CORS.
 */
function createCustomMarkerIcon(imageUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 50;
        canvas.height = 60;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(getFallbackMarkerDataUri());
          return;
        }

        // Draw a subtle shadow under the tip
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.ellipse(25, 57, 6, 2, 0, 0, Math.PI * 2);
        ctx.fill();

        // Draw pin background
        ctx.fillStyle = '#1A1A1A';
        ctx.beginPath();
        ctx.arc(25, 22, 22, 0, Math.PI, true);
        ctx.lineTo(25, 56);
        ctx.lineTo(47, 22);
        ctx.closePath();
        ctx.fill();

        // Draw white inner border
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(25, 22, 17, 0, Math.PI * 2);
        ctx.fill();

        // Clip the image into a circle
        ctx.save();
        ctx.beginPath();
        ctx.arc(25, 22, 15, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, 10, 7, 30, 30);
        ctx.restore();

        resolve(canvas.toDataURL());
      } catch (e) {
        resolve(getFallbackMarkerDataUri());
      }
    };
    img.onerror = () => {
      resolve(getFallbackMarkerDataUri());
    };
  });
}

function getFallbackMarkerDataUri(): string {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 50;
    canvas.height = 60;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // Draw shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.ellipse(25, 57, 6, 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Draw pin background
    ctx.fillStyle = '#1A1A1A';
    ctx.beginPath();
    ctx.arc(25, 22, 22, 0, Math.PI, true);
    ctx.lineTo(25, 56);
    ctx.lineTo(47, 22);
    ctx.closePath();
    ctx.fill();

    // Draw white inner circle
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(25, 22, 17, 0, Math.PI * 2);
    ctx.fill();

    // Draw a black dot in the center
    ctx.fillStyle = '#1A1A1A';
    ctx.beginPath();
    ctx.arc(25, 22, 8, 0, Math.PI * 2);
    ctx.fill();

    return canvas.toDataURL();
  } catch (e) {
    return '';
  }
}

/**
 * Stayzo – PropertyMap Component
 * Renders an interactive Google Map centred on the property with amenity markers.
 */
export default function PropertyMap({
  coords,
  amenities = [],
  propertyTitle = 'Property',
  propertyImage,
  activeCategories,
  className = '',
}: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markers = useRef<google.maps.Marker[]>([]);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

  // Initialise map
  const initMap = useCallback(async () => {
    if (!mapRef.current || !apiKey) return;
    try {
      await loadGoogleMapsScript(apiKey);
      if (mapInstance.current) return; // already initialised

      const map = new window.google.maps.Map(mapRef.current, {
        center: coords,
        zoom: 15,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
        styles: [
          { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
          { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9d8ea' }] },
          { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
          { featureType: 'road', elementType: 'labels', stylers: [{ visibility: 'off' }] },
          { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#e8e8e8' }] },
          { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#d9e8d4' }] },
        ],
      });
      mapInstance.current = map;

      // Generate custom marker icon (pin with property image or fallback)
      let markerIcon: google.maps.Icon | undefined = undefined;
      try {
        const markerIconUrl = propertyImage 
          ? await createCustomMarkerIcon(propertyImage) 
          : getFallbackMarkerDataUri();

        if (markerIconUrl) {
          markerIcon = {
            url: markerIconUrl,
            scaledSize: new window.google.maps.Size(40, 48), // scaled down for map layout
            anchor: new window.google.maps.Point(20, 45), // point of the pin
          };
        }
      } catch (iconErr) {
        console.error('Failed to create custom marker icon:', iconErr);
      }

      // Property marker
      new window.google.maps.Marker({
        position: coords,
        map,
        title: propertyTitle,
        icon: markerIcon || {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 14,
          fillColor: '#1A1A1A',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 3,
        },
        zIndex: 10,
      });

      setMapReady(true);
    } catch (err: any) {
      setMapError(err.message ?? 'Failed to load map');
    }
  }, [apiKey, coords, propertyTitle, propertyImage]);

  useEffect(() => { initMap(); }, [initMap]);

  // Add/update amenity markers when amenities or active filter changes
  useEffect(() => {
    if (!mapInstance.current || !mapReady) return;

    // Clear old markers
    markers.current.forEach(m => m.setMap(null));
    markers.current = [];

    const filtered = activeCategories?.length
      ? amenities.filter(a => activeCategories.includes(a.category))
      : amenities;

    filtered.forEach(amenity => {
      const meta = CATEGORY_META[amenity.category];
      const marker = new window.google.maps.Marker({
        position: { lat: amenity.lat, lng: amenity.lng },
        map: mapInstance.current!,
        title: amenity.name,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 9,
          fillColor: meta.markerColor,
          fillOpacity: 0.9,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="font-family:sans-serif;font-size:12px;min-width:140px;padding:4px 2px">
            <div style="font-weight:700;margin-bottom:2px">${meta.emoji} ${amenity.name}</div>
            <div style="color:#555">${meta.label}</div>
            ${amenity.rating ? `<div style="color:#f59e0b;margin-top:2px">⭐ ${amenity.rating}</div>` : ''}
          </div>
        `,
      });

      marker.addListener('click', () => {
        infoWindow.open(mapInstance.current, marker);
      });

      markers.current.push(marker);
    });
  }, [amenities, activeCategories, mapReady]);

  if (!apiKey) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-3xl text-gray-500 text-sm font-semibold ${className}`}>
        Google Maps API key is missing.
      </div>
    );
  }

  if (mapError) {
    return (
      <div className={`flex flex-col items-center justify-center bg-red-50 border border-red-100 rounded-3xl text-red-600 text-sm font-semibold gap-2 ${className}`}>
        <MapPin className="w-6 h-6" />
        <span>{mapError}</span>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      className={`w-full rounded-3xl overflow-hidden border border-gray-200 shadow-sm ${className}`}
      style={{ minHeight: 320 }}
    />
  );
}
