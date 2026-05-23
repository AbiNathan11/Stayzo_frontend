"use client";

import React, { useState } from 'react';
import Link from 'next/link'; // Use simple link or button to redirect
import Navbar from '../../components/Navbar';
import { 
  Home, Building2, Landmark, Map, HelpCircle, 
  Search, Bookmark, Bell, ChevronDown, 
  Plus, Minus, BedDouble, Bath, Maximize2, MapPin,
  SlidersHorizontal, Heart, Star
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
}

export default function SearchResultsPage() {
  // Panel Visibility States
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(false);

  // Filter States
  const [propertyType, setPropertyType] = useState<string>('house');
  const [minPrice, setMinPrice] = useState(5000);
  const [maxPrice, setMaxPrice] = useState(200000);
  const [neighbourhood, setNeighbourhood] = useState({ school: false, hospital: false, transport: false, market: false, park: false, gym: false });
  const [conveniences, setConveniences] = useState({ parking: false, pet: false, furnished: false, wifi: false, ac: false, security: false });
  const [suitableFor, setSuitableFor] = useState<string>('');
  
  // Active/Hovered Card for Map Sync
  const [activePropertyId, setActivePropertyId] = useState<number>(1);
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([1, 3]);

  const listings: Listing[] = [
    {
      id: 1,
      title: "Villa in Galle",
      address: "Galle, Sri Lanka",
      beds: 3,
      baths: 2,
      sqft: 1800,
      price: "Rs. 17,827",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      lat: 160,
      lng: 150,
      rating: 4.97,
      guestFavorite: true
    },
    {
      id: 2,
      title: "Guesthouse in Unawatuna",
      address: "Unawatuna, Sri Lanka",
      beds: 4,
      baths: 4,
      sqft: 2500,
      price: "Rs. 96,000",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      lat: 280,
      lng: 190,
      rating: 5.0,
      guestFavorite: true
    },
    {
      id: 3,
      title: "Villa in Hapugala",
      address: "Hapugala, Sri Lanka",
      beds: 2,
      baths: 2,
      sqft: 1400,
      price: "Rs. 49,071",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      lat: 220,
      lng: 310,
      rating: 4.92,
      guestFavorite: true
    },
    {
      id: 4,
      title: "Villa in Galle",
      address: "Galle, Sri Lanka",
      beds: 5,
      baths: 5,
      sqft: 3500,
      price: "Rs. 233,671",
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      lat: 100,
      lng: 260,
      rating: 4.98,
      guestFavorite: true
    },
    {
      id: 5,
      title: "Villa in Galle",
      address: "Galle, Sri Lanka",
      beds: 3,
      baths: 3,
      sqft: 2100,
      price: "Rs. 151,886",
      image: "https://images.unsplash.com/photo-1494526585095-c41746248156?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      lat: 120,
      lng: 280,
      rating: 4.97,
      guestFavorite: true
    },
    {
      id: 6,
      title: "Villa in Talpe",
      address: "Talpe, Sri Lanka",
      beds: 6,
      baths: 6,
      sqft: 4800,
      price: "Rs. 456,836",
      image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      lat: 140,
      lng: 300,
      rating: 5.0,
      guestFavorite: false
    },
    {
      id: 7,
      title: "Condo in Galle",
      address: "Galle, Sri Lanka",
      beds: 2,
      baths: 2,
      sqft: 1100,
      price: "Rs. 100,374",
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      lat: 150,
      lng: 290,
      rating: 4.9,
      guestFavorite: true
    },
    {
      id: 8,
      title: "Villas by the Bay",
      address: "Hikkaduwa, Sri Lanka",
      beds: 4,
      baths: 3,
      sqft: 2400,
      price: "Rs. 115,000",
      image: "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      lat: 130,
      lng: 250,
      rating: 4.88,
      guestFavorite: false
    },
    {
      id: 9,
      title: "Mirissa Beach House",
      address: "Mirissa, Sri Lanka",
      beds: 3,
      baths: 2,
      sqft: 1950,
      price: "Rs. 75,000",
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      lat: 170,
      lng: 270,
      rating: 4.95,
      guestFavorite: true
    },
    {
      id: 10,
      title: "Weligama Surf Lodge",
      address: "Weligama, Sri Lanka",
      beds: 5,
      baths: 4,
      sqft: 3100,
      price: "Rs. 130,000",
      image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      lat: 180,
      lng: 240,
      rating: 4.86,
      guestFavorite: false
    },
    {
      id: 11,
      title: "Kandy Mountain Haven",
      address: "Kandy, Sri Lanka",
      beds: 4,
      baths: 4,
      sqft: 2800,
      price: "Rs. 95,000",
      image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      lat: 200,
      lng: 220,
      rating: 4.91,
      guestFavorite: true
    },
    {
      id: 12,
      title: "Colombo Sky Villa",
      address: "Colombo, Sri Lanka",
      beds: 3,
      baths: 3,
      sqft: 2200,
      price: "Rs. 210,000",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      lat: 110,
      lng: 210,
      rating: 4.94,
      guestFavorite: true
    }
  ];

  const handleBookmarkToggle = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds(bookmarkedIds.filter(bId => bId !== id));
    } else {
      setBookmarkedIds([...bookmarkedIds, id]);
    }
  };

  const selectedProperty = listings.find(l => l.id === activePropertyId) || listings[0];

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
      <Navbar />

      {/* Main Content Layout */}
      <div className="flex-1 w-full max-w-[1600px] mx-auto flex flex-col lg:flex-row overflow-hidden shadow-sm">
        
        {/* Column 1: Filters (Left) */}
        <aside className={`bg-white border-r border-gray-100 overflow-y-auto no-scrollbar shrink-0 select-none transition-all duration-300 ${
          showFilters ? 'w-full lg:w-[260px] p-6 opacity-100' : 'w-0 p-0 opacity-0 border-r-0 pointer-events-none'
        }`}>
          <h2 className="text-lg font-bold text-[#1A1A1A] mb-5">Filters</h2>

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
                  onClick={() => setPropertyType(key)}
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
        <main className="flex-1 bg-white p-6 overflow-y-auto no-scrollbar">
          {/* Search Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h1 className="text-xl font-bold text-gray-900">
              Search results <span className="font-extrabold text-[#1A1A1A]">547</span>
            </h1>
            <div className="flex items-center flex-wrap gap-2.5">
              {/* Toggle Filters Button */}
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 text-xs font-semibold px-4 py-2 rounded-full border transition-all cursor-pointer select-none ${
                  showFilters 
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] hover:bg-black shadow-sm' 
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 shadow-xs'
                }`}
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
              >
                <Map className="w-3.5 h-3.5" />
                <span>Map</span>
              </button>
            </div>
          </div>

          {/* Cards Grid (Square shape) */}
          <div className={`grid ${gridColsClass} gap-6`}>
            {listings.map((listing) => (
              <div 
                key={listing.id}
                onClick={() => setActivePropertyId(listing.id)}
                className="flex flex-col cursor-pointer group"
              >
                {/* Image Container */}
                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shrink-0 relative bg-gray-100 mb-2">
                  <img 
                    src={listing.image} 
                    alt={listing.title} 
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  />
                  
                  {/* Guest favorite Badge */}
                  {listing.guestFavorite && (
                    <div className="absolute top-2.5 left-2.5 z-10 bg-white/95 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[10px] font-bold text-gray-900 shadow-sm uppercase tracking-wide">
                      Guest favorite
                    </div>
                  )}

                  {/* Bookmark Heart Button */}
                  <button 
                    onClick={(e) => handleBookmarkToggle(listing.id, e)}
                    className="absolute top-2.5 right-2.5 z-10 p-1.5 rounded-full bg-black/10 hover:bg-black/25 backdrop-blur-xs transition"
                  >
                    <Heart className={`w-4 h-4 transition-colors ${bookmarkedIds.includes(listing.id) ? 'fill-[#1A1A1A] stroke-white' : 'fill-transparent stroke-white'}`} />
                  </button>
                </div>

                {/* Details (Airbnb Simple Style) */}
                <div className="flex-1 flex flex-col justify-between pt-1">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm md:text-base leading-snug">{listing.title}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1 font-normal flex-wrap">
                      <span>{listing.price} <span className="text-xs text-gray-400 font-normal">/ mo</span></span>
                      <span className="mx-1.5">•</span>
                      <span className="flex items-center text-gray-700 font-medium">
                        <Star className="w-3.5 h-3.5 fill-gray-900 stroke-none mr-0.5" />
                        {listing.rating.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5 font-medium">
                      {listing.beds} beds • {listing.baths} baths • {listing.sqft.toLocaleString()} sqft
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Column 3: Styled Interactive Mock Map (Right) */}
        <section className={`bg-[#E8EEF0] relative overflow-hidden shrink-0 flex flex-col transition-all duration-300 ${
          showMap ? 'w-full lg:w-[42%] min-h-[300px] lg:min-h-0 opacity-100 border-l border-gray-100' : 'w-0 min-h-0 opacity-0 pointer-events-none'
        }`}>
          {/* Real Map representing roads and landmarks */}
          <div className="absolute inset-0 z-0">
            <iframe 
              src="https://www.openstreetmap.org/export/embed.html?bbox=80.59%2C7.26%2C80.68%2C7.32&amp;layer=mapnik" 
              className="w-full h-full border-none select-none"
              style={{ filter: 'grayscale(100%) contrast(90%) brightness(102%)' }}
              title="Real Interactive Map of Sri Lanka"
            ></iframe>
          </div>

          {/* Map Pins */}
          <div className="absolute inset-0 z-10">
            {/* Generic Pins */}
            <div className="absolute w-2 h-2 bg-[#1A1A1A] rounded-full border border-white shadow-sm" style={{ top: '80px', left: '70px' }}></div>
            <div className="absolute w-2 h-2 bg-[#1A1A1A] rounded-full border border-white shadow-sm" style={{ top: '150px', left: '320px' }}></div>
            <div className="absolute w-2 h-2 bg-[#1A1A1A] rounded-full border border-white shadow-sm" style={{ top: '90px', left: '440px' }}></div>
            <div className="absolute w-2 h-2 bg-[#1A1A1A] rounded-full border border-white shadow-sm" style={{ top: '250px', left: '50px' }}></div>
            <div className="absolute w-2 h-2 bg-[#1A1A1A] rounded-full border border-white shadow-sm" style={{ top: '350px', left: '410px' }}></div>
            <div className="absolute w-2 h-2 bg-[#1A1A1A] rounded-full border border-white shadow-sm" style={{ top: '420px', left: '260px' }}></div>

            {/* Interactive Pins corresponding to listings */}
            {listings.map((listing) => (
              <button 
                key={listing.id}
                onClick={() => setActivePropertyId(listing.id)}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                  activePropertyId === listing.id 
                    ? 'w-10 h-10 bg-[#1A1A1A]/20 border border-[#1A1A1A] rounded-full flex items-center justify-center z-20' 
                    : 'w-4 h-4 bg-[#1A1A1A] border-2 border-white rounded-full shadow-lg hover:scale-125 z-10'
                }`}
                style={{ top: `${listing.lng}px`, left: `${listing.lat}px` }}
              >
                {activePropertyId === listing.id && (
                  <span className="w-4 h-4 bg-[#1A1A1A] rounded-full border border-white shadow-md animate-ping absolute"></span>
                )}
                {activePropertyId === listing.id && (
                  <span className="w-4 h-4 bg-[#1A1A1A] rounded-full border border-white shadow-md relative z-10"></span>
                )}
              </button>
            ))}

            {/* Overlapping Hover/Popup details block from the image */}
            <div 
              className="absolute bg-white rounded-2xl p-3 shadow-2xl flex flex-col max-w-[240px] z-30 transition-all duration-500 border border-gray-100"
              style={{ top: `${selectedProperty.lng - 100}px`, left: `${selectedProperty.lat + 30}px` }}
            >
              <div className="w-full h-[100px] rounded-xl overflow-hidden mb-2 bg-gray-50">
                <img 
                  src={selectedProperty.image} 
                  alt={selectedProperty.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="font-extrabold text-[#1A1A1A] text-sm mb-0.5">{selectedProperty.price}<span className="text-[10px] text-gray-400 font-medium">/month</span></h4>
              <p className="text-[10px] font-semibold text-gray-500 line-clamp-1">{selectedProperty.address}</p>
            </div>
          </div>

          {/* Bottom Zoom Tools */}
          <div className="absolute bottom-6 right-6 z-20 bg-white shadow-xl rounded-xl flex flex-col divide-y divide-gray-100 overflow-hidden font-bold text-gray-500">
            <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition">+</button>
            <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition">-</button>
          </div>
        </section>

      </div>
    </div>
  );
}

