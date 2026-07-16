"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link'; // Use simple link or button to redirect
import { useSearchParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import SearchMap from '../../components/maps/SearchMap';
import PropertyReviews from '@/components/PropertyReviews';
import { 
  Home, Building2, Landmark, Map, HelpCircle, 
  Search, Bookmark, Bell, ChevronDown, 
  Plus, Minus, BedDouble, Bath, Maximize2, MapPin,
  SlidersHorizontal, Heart, Star, Sparkles
} from 'lucide-react';

interface Listing {
  id: number;
  title: string;
  address: string;
  beds: number;
  baths: number;
  sqft: number;
  price: string;
  image: string;
  lat: number;
  lng: number;
  rating: number;
  guestFavorite?: boolean;
  isBoosted?: boolean;
}

function SearchContent() {
  // Panel Visibility States
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(false);

  // Filter States
  const [propertyType, setPropertyType] = useState<string>('');
  const [minPrice, setMinPrice] = useState(5000);
  const [maxPrice, setMaxPrice] = useState(200000);
  const [neighbourhood, setNeighbourhood] = useState({ school: false, hospital: false, transport: false, market: false, park: false, gym: false });
  const [conveniences, setConveniences] = useState({ parking: false, pet: false, furnished: false, wifi: false, ac: false, security: false });
  const [suitableFor, setSuitableFor] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Active/Hovered Card for Map Sync
  const [activePropertyId, setActivePropertyId] = useState<string | number>(1);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const q = searchParams.get('q') || '';
    setSearchQuery(q);
  }, [searchParams]);

  useEffect(() => {
    // Read params
    const district = searchParams.get('district');
    const type = searchParams.get('type');
    const budgetStr = searchParams.get('budget');
    const q = searchParams.get('q');

    // Build fetch URL
    let apiUrl = 'http://localhost:3001/api/properties/search';
    const params = new URLSearchParams();
    if (district) params.set('district', district);
    if (type) params.set('type', type);
    if (q) params.set('q', q);
    
    if (budgetStr && budgetStr !== 'Any Budget' && budgetStr !== 'Over Rs.50,0000') {
      let limit = 0;
      if (budgetStr === 'Under Rs.50,000') limit = 50000;
      else if (budgetStr === 'Rs.50,000 - Rs.100,000') limit = 100000;
      else if (budgetStr === 'Rs.100,000 - Rs.200,000') limit = 200000;
      else if (budgetStr === 'Rs.200,000 - Rs.500,000') limit = 500000;
      if (limit > 0) {
        params.set('budget', limit.toString());
      }
    }

    const queryString = params.toString();
    if (queryString) {
      apiUrl += `?${queryString}`;
    }

    setLoading(true);
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        const getCityCoords = (address: string, idx: number) => {
          const addr = (address || "").toLowerCase();
          const offsetLat = ((idx * 7) % 10) * 0.005 - 0.02;
          const offsetLng = ((idx * 9) % 10) * 0.005 - 0.02;
          if (addr.includes('jaffna') || addr.includes('vannarponnai') || addr.includes('kopay')) return { lat: 9.6615 + offsetLat, lng: 80.0125 + offsetLng };
          if (addr.includes('kandy') || addr.includes('peradeniya')) return { lat: 7.2906 + offsetLat, lng: 80.6337 + offsetLng };
          if (addr.includes('katunayake') || addr.includes('seeduwa') || addr.includes('negombo') || addr.includes('liyanagemull') || addr.includes('liyanagemulla')) return { lat: 7.1804 + offsetLat, lng: 79.8837 + offsetLng };
          if (addr.includes('galle')) return { lat: 6.0535 + offsetLat, lng: 80.2210 + offsetLng };
          return { lat: 6.9271 + offsetLat, lng: 79.8612 + offsetLng };
        };

        if (!Array.isArray(data)) {
          console.error('API Error: Expected an array of listings but received:', data);
          setListings([]);
          setLoading(false);
          return;
        }

        const mapped = data.map((item: any, index: number) => {
          const parsedLat = Number(item.latitude);
          const parsedLng = Number(item.longitude);
          const hasDbCoords = !isNaN(parsedLat) && parsedLat !== 0 && !isNaN(parsedLng) && parsedLng !== 0;
          const fallback = getCityCoords(item.address, index);
          const lat = hasDbCoords ? parsedLat : fallback.lat;
          const lng = hasDbCoords ? parsedLng : fallback.lng;
          return {
            ...item,
            lat,
            lng,
            rating: item.averageRating !== undefined && item.averageRating > 0 ? item.averageRating : 0,
            reviewCount: item.reviewCount || 0,
            guestFavorite: index % 3 === 0,
            image: item.images?.[0] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
            beds: item.bedrooms || 1,
            baths: item.bathrooms || 1,
            sqft: item.sqft || 1000,
            price: `Rs. ${Number(item.price).toLocaleString()}`,
            address: item.address || `${item.city || 'Anytown'}, ${item.state || 'ST'}`,
            isBoosted: item.isBoosted || false
          };
        });
        setListings(mapped);
        if (mapped.length > 0) setActivePropertyId(mapped[0].id);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [searchParams]);

  useEffect(() => {
    try {
      const wishlist = JSON.parse(localStorage.getItem('stayzo_wishlist') || '[]');
      const idsArray = wishlist.map((item: any) => typeof item === 'object' ? String(item.id) : String(item));
      setBookmarkedIds(idsArray);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleBookmarkToggle = (id: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      const wishlist = JSON.parse(localStorage.getItem('stayzo_wishlist') || '[]');
      const idsArray = wishlist.map((item: any) => typeof item === 'object' ? String(item.id) : String(item));
      const idStr = String(id);
      let updated;
      if (idsArray.includes(idStr)) {
        updated = idsArray.filter((bId: string) => bId !== idStr);
        setBookmarkedIds(prev => prev.filter(bId => bId !== idStr));
      } else {
        updated = [...idsArray, idStr];
        setBookmarkedIds(prev => [...prev, idStr]);
      }
      localStorage.setItem('stayzo_wishlist', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // ── Dynamic Client-side Filters ──
  const filteredListings = listings.filter(item => {
    if (searchQuery) {
      const term = searchQuery.toLowerCase();
      const matchesText = (
        (item.title || '').toLowerCase().includes(term) ||
        (item.description || '').toLowerCase().includes(term) ||
        (item.city || '').toLowerCase().includes(term) ||
        (item.address || '').toLowerCase().includes(term) ||
        (item.state || '').toLowerCase().includes(term) ||
        (item.type || '').toLowerCase().includes(term)
      );
      if (!matchesText) return false;
    }

    const priceVal = Number(String(item.price).replace(/[^0-9]/g, ''));
    if (priceVal < minPrice || priceVal > maxPrice) return false;

    if (propertyType) {
      const typeLower = (item.type || '').toLowerCase();
      let matchesType = false;
      if (propertyType === 'house') {
        matchesType = ['house', 'individual house', 'villa', 'bungalow', 'townhouse', 'duplex', 'annex'].some(t => typeLower.includes(t));
      } else if (propertyType === 'apartment') {
        matchesType = ['apartment', 'flat', 'studio', 'bedsit'].some(t => typeLower.includes(t));
      } else if (propertyType === 'shared') {
        matchesType = ['shared', 'room/bedspace', 'room'].some(t => typeLower.includes(t)) && !typeLower.includes('private');
      } else if (propertyType === 'private') {
        matchesType = ['private', 'ensuite'].some(t => typeLower.includes(t));
      }
      if (!matchesType) return false;
    }

    const amenitiesLower = (item.amenities || []).map((a: string) => a.toLowerCase());
    const matchesNeighbourhood = Object.entries(neighbourhood).every(([facility, active]) => {
      if (!active) return true;
      if (facility === 'school') return amenitiesLower.some((a: string) => a.includes('school') || a.includes('university'));
      if (facility === 'hospital') return amenitiesLower.some((a: string) => a.includes('hospital') || a.includes('medical') || a.includes('clinic'));
      if (facility === 'transport') return amenitiesLower.some((a: string) => a.includes('transport') || a.includes('bus') || a.includes('station') || a.includes('railway'));
      if (facility === 'market') return amenitiesLower.some((a: string) => a.includes('market') || a.includes('supermarket') || a.includes('grocery') || a.includes('shop'));
      if (facility === 'park') return amenitiesLower.some((a: string) => a.includes('park') || a.includes('garden'));
      if (facility === 'gym') return amenitiesLower.some((a: string) => a.includes('gym') || a.includes('fitness'));
      return true;
    });
    if (!matchesNeighbourhood) return false;

    const matchesConveniences = Object.entries(conveniences).every(([conv, active]) => {
      if (!active) return true;
      if (conv === 'parking') return amenitiesLower.some((a: string) => a.includes('parking') || a.includes('garage'));
      if (conv === 'pet') return amenitiesLower.some((a: string) => a.includes('pet') || a.includes('dog') || a.includes('cat') || a.includes('allow'));
      if (conv === 'furnished') return amenitiesLower.some((a: string) => a.includes('furnish') || a.includes('bed') || a.includes('sofa'));
      if (conv === 'wifi') return amenitiesLower.some((a: string) => a.includes('wifi') || a.includes('wi-fi') || a.includes('internet'));
      if (conv === 'ac') return amenitiesLower.some((a: string) => a.includes('ac') || a.includes('air') || a.includes('condition'));
      if (conv === 'security') return amenitiesLower.some((a: string) => a.includes('security') || a.includes('cctv') || a.includes('guard'));
      return true;
    });
    if (!matchesConveniences) return false;

    if (suitableFor && suitableFor !== 'Anyone') {
      const text = ((item.title || '') + ' ' + (item.description || '') + ' ' + (item.amenities || []).join(' ')).toLowerCase();
      if (!text.includes(suitableFor.toLowerCase())) return false;
    }

    return true;
  });

  const sortedListings = [...filteredListings].sort((a, b) => {
    if (a.isBoosted && !b.isBoosted) return -1;
    if (!a.isBoosted && b.isBoosted) return 1;
    return 0;
  });

  const selectedProperty = sortedListings.find(l => l.id === activePropertyId) || sortedListings[0];

  // Dynamically determine grid columns based on open panels
  let gridColsClass = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7"; // Both closed (max 7)
  if (showFilters && !showMap) {
    gridColsClass = "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"; // Filters only (max 5)
  } else if (!showFilters && showMap) {
    gridColsClass = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"; // Map only (max 4, keeps space for map)
  } else if (showFilters && showMap) {
    gridColsClass = "grid-cols-1 sm:grid-cols-2"; // Both open (max 2)
  }

  return (
    <div className="h-screen overflow-hidden pt-[68px] bg-[#F5F7F8] text-[#2D2D2D] font-sans flex flex-col">
      
      {/* Top Navbar Component */}
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Main Content Layout */}
      <div className="flex-1 w-full max-w-[1600px] mx-auto flex flex-col lg:flex-row overflow-hidden shadow-sm relative">
        
        {/* Column 1: Filters (Left) */}
        <aside className={`bg-white border-r border-gray-100 overflow-y-auto no-scrollbar shrink-0 select-none transition-all duration-300 ${
          showFilters 
            ? 'w-full lg:w-[260px] p-6 opacity-100 block' 
            : 'w-0 h-0 p-0 opacity-0 border-r-0 pointer-events-none hidden'
        } ${
          showFilters 
            ? 'fixed lg:relative inset-y-0 left-0 z-40 lg:z-auto lg:top-0 top-[68px] shadow-2xl lg:shadow-none' 
            : ''
        }`}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-[#1A1A1A]">Filters</h2>
            <button 
              onClick={() => setShowFilters(false)}
              className="lg:hidden px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full font-bold text-[10px] uppercase hover:bg-gray-200 transition"
            >
              Close
            </button>
          </div>

          {/* Price Range (Rs) */}
          <div className="mb-5 pb-5 border-b border-gray-100">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Price Range</h3>
            <div className="flex items-center gap-2 mb-2">
              <div className="relative flex-1">
                <span className="absolute left-2.5 top-[9px] text-[10px] text-gray-400 font-semibold">Rs</span>
                <input 
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-100 rounded-lg pl-7 pr-2 py-2 text-xs font-semibold outline-none text-gray-700 focus:border-gray-300"
                />
              </div>
              <span className="text-gray-300 text-xs">—</span>
              <div className="relative flex-1">
                <span className="absolute left-2.5 top-[9px] text-[10px] text-gray-400 font-semibold">Rs</span>
                <input 
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-100 rounded-lg pl-7 pr-2 py-2 text-xs font-semibold outline-none text-gray-700 focus:border-gray-300"
                />
              </div>
            </div>
            <p className="text-[10px] text-gray-400">Rs {minPrice.toLocaleString()} – Rs {maxPrice.toLocaleString()} / month</p>
          </div>

          {/* Property Type */}
          <div className="mb-5 pb-5 border-b border-gray-100">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Property Type</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'house', label: 'House', Icon: Home },
                { key: 'apartment', label: 'Apartment', Icon: Building2 },
                { key: 'shared', label: 'Shared Room', Icon: HelpCircle },
                { key: 'private', label: 'Private Room', Icon: Landmark },
              ].map(({ key, label, Icon }) => (
                <button
                  key={key}
                  onClick={() => setPropertyType(propertyType === key ? '' : key)}
                  className={`flex flex-col items-center justify-center py-3 px-2 border rounded-xl text-[10px] font-semibold transition ${
                    propertyType === key
                      ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white'
                      : 'border-gray-150 text-gray-500 bg-white hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4 mb-1" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Neighbourhood Facilities */}
          <div className="mb-5 pb-5 border-b border-gray-100">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Neighbourhood Facilities</h3>
            <div className="grid grid-cols-2 gap-y-2.5">
              {([
                ['school', 'School'],
                ['hospital', 'Hospital'],
                ['transport', 'Transport'],
                ['market', 'Market'],
                ['park', 'Park'],
                ['gym', 'Gym'],
              ] as [keyof typeof neighbourhood, string][]).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 text-xs font-medium text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={neighbourhood[key]}
                    onChange={(e) => setNeighbourhood({ ...neighbourhood, [key]: e.target.checked })}
                    className="accent-[#1A1A1A] w-3.5 h-3.5 cursor-pointer rounded"
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* Additional Conveniences */}
          <div className="mb-5 pb-5 border-b border-gray-100">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Additional Conveniences</h3>
            <div className="grid grid-cols-2 gap-y-2.5">
              {([
                ['parking', 'Parking'],
                ['pet', 'Pet Allowed'],
                ['furnished', 'Furnished'],
                ['wifi', 'Wi-Fi'],
                ['ac', 'Air Con'],
                ['security', 'Security'],
              ] as [keyof typeof conveniences, string][]).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 text-xs font-medium text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={conveniences[key]}
                    onChange={(e) => setConveniences({ ...conveniences, [key]: e.target.checked })}
                    className="accent-[#1A1A1A] w-3.5 h-3.5 cursor-pointer rounded"
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* Suitable For */}
          <div className="mb-4">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Suitable For</h3>
            <div className="flex flex-wrap gap-2">
              {['Anyone', 'Students', 'Professionals', 'Families'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setSuitableFor(suitableFor === opt ? '' : opt)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                    suitableFor === opt
                      ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Column 2: Listings results (Center) */}
        <main className={`flex-1 bg-white p-6 overflow-y-auto no-scrollbar ${
          showMap ? 'hidden lg:block' : 'block'
        }`}>
          {/* Search Header */}
          <div className="flex items-center flex-wrap gap-2.5 mb-6">
              {/* Toggle Filters Button */}
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 text-xs font-semibold px-4 py-2 rounded-full border transition-all cursor-pointer select-none ${
                  showFilters 
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] hover:bg-black shadow-sm' 
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 shadow-xs'
                }`}
                suppressHydrationWarning={true}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>

              {/* Toggle Map Button */}
              <button 
                onClick={() => setShowMap(!showMap)}
                className={`flex items-center space-x-2 text-xs font-semibold px-4 py-2 rounded-full border transition-all cursor-pointer select-none ${
                  showMap 
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] hover:bg-black shadow-sm' 
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 shadow-xs'
                }`}
                suppressHydrationWarning={true}
              >
                <Map className="w-3.5 h-3.5" />
                <span>Map</span>
              </button>
          </div>

          {/* Cards Grid (Square shape) */}
          <div className={`grid ${gridColsClass} gap-6`}>
            {loading ? (
              [...Array(8)].map((_, i) => (
                <div key={i} className="flex flex-col animate-pulse">
                  <div className="w-full aspect-[4/3] rounded-2xl bg-gray-200 mb-2 shrink-0" />
                  <div className="space-y-2 pt-1 flex-1">
                    <div className="h-4.5 w-3/4 bg-gray-300 rounded-md" />
                    <div className="h-3.5 w-1/2 bg-gray-250 rounded-md" />
                    <div className="h-3 w-2/3 bg-gray-205 rounded-md" />
                  </div>
                </div>
              ))
            ) : sortedListings.length === 0 ? (
              <div className="col-span-full py-12 text-center text-gray-500 font-semibold">
                No properties found matching your search.
              </div>
            ) : (
              sortedListings.map((listing) => (
                <Link 
                  key={listing.id}
                  href={`/properties/${listing.id}`}
                  onMouseEnter={() => setActivePropertyId(listing.id)}
                  className="flex flex-col group no-underline"
                >
                  {/* Image Container */}
                  <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shrink-0 relative bg-gray-100 mb-2">
                    <img 
                      src={listing.image} 
                      alt={listing.title} 
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    />
                    
                    {/* Top Left Badges */}
                    <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
                      {listing.isBoosted && (
                        <div className="bg-[#4F46E5]/95 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white shadow-sm uppercase tracking-wide flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Boosted
                        </div>
                      )}
                      {listing.guestFavorite && (
                        <div className="bg-white/95 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[10px] font-bold text-gray-900 shadow-sm uppercase tracking-wide">
                          Guest favorite
                        </div>
                      )}
                    </div>
                    
                    {/* 360 Badge */}
                    {listing.panoramaImage && (
                      <div className="absolute bottom-2.5 left-2.5 z-10 bg-purple-600/90 backdrop-blur-xs px-2 py-0.5 rounded text-[9px] font-black text-white shadow-sm uppercase tracking-wider">
                        360° Tour
                      </div>
                    )}

                    {/* Bookmark Heart Button */}
                    <button 
                      onClick={(e) => handleBookmarkToggle(listing.id, e)}
                      className="absolute top-2.5 right-2.5 z-10 p-1.5 rounded-full bg-black/10 hover:bg-black/25 backdrop-blur-xs transition"
                    >
                      <Heart className={`w-4 h-4 transition-colors ${bookmarkedIds.includes(String(listing.id)) ? 'fill-red-500 stroke-red-500' : 'fill-transparent stroke-white'}`} />
                    </button>
                  </div>

                  {/* Details (Airbnb Simple Style) */}
                  <div className="flex-1 flex flex-col justify-between pt-1">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm md:text-base leading-snug group-hover:text-black transition-colors">{listing.title}</h3>
                      
                      {listing.noisePrediction && (
                        <div className="mt-1">
                          <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${
                            listing.noisePrediction.label === 'Low'    ? 'text-emerald-700 bg-emerald-50 border-emerald-100' :
                            listing.noisePrediction.label === 'Medium' ? 'text-amber-700 bg-amber-50 border-amber-100' :
                            'text-rose-700 bg-rose-50 border-rose-100'
                          }`}>
                            🔊 {listing.noisePrediction.label} Noise
                          </span>
                        </div>
                      )}

                      <div className="flex items-center text-sm text-gray-500 mt-1 font-normal flex-wrap">
                        <span>{listing.price} <span className="text-xs text-gray-400 font-normal">/ mo</span></span>
                        <span className="mx-1.5">•</span>
                        <span className="flex items-center text-gray-700 font-medium">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 stroke-none mr-0.5 animate-pulse" />
                          {listing.rating > 0 
                            ? `${listing.rating.toFixed(1)} (${listing.reviewCount} ${listing.reviewCount === 1 ? 'Review' : 'Reviews'})` 
                            : 'No reviews'
                          }
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5 font-medium">
                        {listing.beds} beds • {listing.baths} baths • {listing.sqft.toLocaleString()} sqft
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </main>

        {/* Column 3: Google Map (Right) */}
        <section className={`bg-[#E8EEF0] relative overflow-hidden shrink-0 flex flex-col transition-all duration-300 ${
          showMap 
            ? 'w-full lg:w-[42%] min-h-[300px] lg:min-h-0 opacity-100 border-l border-gray-100 flex' 
            : 'w-0 h-0 min-h-0 opacity-0 pointer-events-none hidden'
        }`}>
          {showMap && (
            <SearchMap 
              listings={sortedListings}
              activePropertyId={activePropertyId}
              onActivePropertyChange={(id) => setActivePropertyId(id)}
            />
          )}

          {/* Overlapping Hover/Popup details card on the active listing */}
          {showMap && selectedProperty && (
            <Link 
              href={`/properties/${selectedProperty.id}`}
              className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-white rounded-2xl p-3 shadow-2xl flex items-center space-x-3 w-[280px] z-30 transition-all duration-300 border border-gray-150 hover:border-gray-300 hover:scale-[1.02] no-underline cursor-pointer"
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                <img 
                  src={selectedProperty.image} 
                  alt={selectedProperty.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 overflow-hidden">
                <h4 className="font-extrabold text-[#1A1A1A] text-xs truncate mb-1">{selectedProperty.title}</h4>
                <p className="text-[10px] font-semibold text-gray-400 mb-1.5 truncate">{selectedProperty.address}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-gray-900">{selectedProperty.price}<span className="text-[9px] text-gray-400 font-normal">/mo</span></span>
                </div>
              </div>
            </Link>
          )}
        </section>

      </div>
    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading Search...</div>}>
      <SearchContent />
    </Suspense>
  );
}

