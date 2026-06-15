"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MapPin } from 'lucide-react';

interface SearchMapProps {
  listings: any[];
  activePropertyId: string | number | null;
  onActivePropertyChange: (id: string | number) => void;
}

declare global {
  interface Window {
    google: any;
    _googleMapsLoaded?: boolean;
  }
}

function loadGoogleMapsScript(apiKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window._googleMapsLoaded) { resolve(); return; }
    if (document.getElementById('google-maps-script')) {
      const poll = setInterval(() => {
        if (window.google?.maps) { clearInterval(poll); window._googleMapsLoaded = true; resolve(); }
      }, 100);
      return;
    }
    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => { window._googleMapsLoaded = true; resolve(); };
    script.onerror = () => reject(new Error('Failed to load Google Maps script'));
    document.head.appendChild(script);
  });
}

export default function SearchMap({
  listings,
  activePropertyId,
  onActivePropertyChange,
}: SearchMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

  const initMap = useCallback(async () => {
    if (!mapRef.current || !apiKey) return;
    try {
      await loadGoogleMapsScript(apiKey);
      if (mapInstance.current) return;

      // Center around Colombo initially
      const defaultCenter = { lat: 6.9271, lng: 79.8612 };

      const map = new window.google.maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: 12,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
        styles: [
          { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
          { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9d8ea' }] },
          { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
          { featureType: 'road', elementType: 'labels', stylers: [{ visibility: 'on' }] },
          { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#e8e8e8' }] },
          { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#d9e8d4' }] },
        ],
      });
      mapInstance.current = map;
      setMapReady(true);
    } catch (err: any) {
      setMapError(err.message ?? 'Failed to load map');
    }
  }, [apiKey]);

  useEffect(() => {
    initMap();
  }, [initMap]);

  // Update center when active property changes
  useEffect(() => {
    if (!mapInstance.current || activePropertyId === null) return;
    const activeListing = listings.find(l => l.id === activePropertyId);
    if (activeListing && typeof activeListing.lat === 'number' && typeof activeListing.lng === 'number') {
      const coords = { lat: activeListing.lat, lng: activeListing.lng };
      mapInstance.current.panTo(coords);
      mapInstance.current.setZoom(15);
    }
  }, [activePropertyId, listings]);

  // Update markers
  useEffect(() => {
    if (!mapInstance.current || !mapReady) return;

    // Clear old markers
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    listings.forEach((listing) => {
      if (typeof listing.lat !== 'number' || typeof listing.lng !== 'number') return;
      const coords = { lat: listing.lat, lng: listing.lng };

      const isActive = activePropertyId === listing.id;

      // Define standard styling for marker
      const marker = new window.google.maps.Marker({
        position: coords,
        map: mapInstance.current,
        title: listing.title,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: isActive ? 12 : 8,
          fillColor: isActive ? '#4F46E5' : '#1A1A1A',
          fillOpacity: 1.0,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
        zIndex: isActive ? 99 : 10,
      });

      marker.addListener('click', () => {
        onActivePropertyChange(listing.id);
      });

      markersRef.current.push(marker);
    });

    // Fit map bounds to show all markers
    const validCoordsList = listings
      .filter(listing => typeof listing.lat === 'number' && typeof listing.lng === 'number')
      .map(listing => ({ lat: listing.lat, lng: listing.lng }));

    if (validCoordsList.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      validCoordsList.forEach(coords => {
        bounds.extend(coords);
      });
      mapInstance.current.fitBounds(bounds);
      
      if (validCoordsList.length === 1) {
        mapInstance.current.setZoom(14);
      }
    }
  }, [listings, mapReady, activePropertyId, onActivePropertyChange]);

  if (!apiKey) {
    return (
      <div className="flex flex-col items-center justify-center bg-gray-50 h-full w-full p-6 text-center text-gray-500 font-semibold gap-3 border border-gray-150 rounded-2xl">
        <MapPin className="w-8 h-8 text-gray-400" />
        <span>Google Maps API key is missing.</span>
      </div>
    );
  }

  if (mapError) {
    return (
      <div className="flex flex-col items-center justify-center bg-red-50 h-full w-full p-6 text-center text-red-600 font-semibold gap-3 border border-red-150 rounded-2xl">
        <MapPin className="w-8 h-8 text-red-400 animate-bounce" />
        <span>{mapError}</span>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      className="w-full h-full min-h-[350px] lg:min-h-0 relative select-none"
    />
  );
}
