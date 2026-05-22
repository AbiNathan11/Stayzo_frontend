"use client";

import React, { useState } from 'react';
import Link from 'next/link'; // Use simple link or button to redirect
import Navbar from '../../components/Navbar';
import { 
  Home, Building2, Landmark, Map, HelpCircle, 
  Search, Bookmark, Bell, ChevronDown, 
  Plus, Minus, BedDouble, Bath, Maximize2, MapPin,
  SlidersHorizontal
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
}

export default function SearchResultsPage() {
  // Panel Visibility States
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(false);

  // Filter States
  const [propertyType, setPropertyType] = useState<'house' | 'apartment' | 'commercial' | 'land'>('house');
  const [rentalPeriod, setRentalPeriod] = useState({ all: false, letly: true, innly: false });
  const [minPrice, setMinPrice] = useState(500);
  const [maxPrice, setMaxPrice] = useState(8000);
  const [bedrooms, setBedrooms] = useState(6);
  const [bathrooms, setBathrooms] = useState(4);
  const [minArea, setMinArea] = useState(1000);
  const [maxArea, setMaxArea] = useState(4000);
  const [conveniences, setConveniences] = useState({ parking: true, pet: true, furnished: false });
  
  // Active/Hovered Card for Map Sync
  const [activePropertyId, setActivePropertyId] = useState<number>(1);
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([1, 3]);

  const listings: Listing[] = [
    {
      id: 1,
      title: "Ahlers & Ogletree",
      address: "132 Northbrooke Trce, Woodstock, GA",
      beds: 6,
      baths: 4,
      sqft: 2797,
      price: "$2,695",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      lat: 160,
      lng: 150
    },
    {
      id: 2,
      title: "Hillary Gross",
      address: "177 Osprey Hammock Trl, Sanford, FL",
      beds: 8,
      baths: 5,
      sqft: 4932,
      price: "$5,495",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      lat: 280,
      lng: 190
    },
    {
      id: 3,
      title: "Villa Tropical Cana",
      address: "540 Belle Gate Pl, Cary, NC",
      beds: 8,
      baths: 5,
      sqft: 3875,
      price: "$3,300",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      lat: 220,
      lng: 310
    },
    {
      id: 4,
      title: "Sabina Apartments",
      address: "201 Grand Key Loop E, Destin, FL",
      beds: 8,
      baths: 5,
      sqft: 3250,
      price: "$3,975",
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      lat: 100,
      lat: 100,
      lng: 260
    },
    {
      id: 5,
      title: "Oceanview Retreat",
      address: "100 Beachfront Ave, Miami, FL",
      beds: 3,
      baths: 2,
      sqft: 1850,
      price: "$4,200",
      image: "https://images.unsplash.com/photo-1494526585095-c41746248156?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      lat: 120,
      lng: 280
    },
    {
      id: 6,
      title: "The Glass House",
      address: "555 Summit Way, Aspen, CO",
      beds: 5,
      baths: 6,
      sqft: 5200,
      price: "$9,500",
      image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      lat: 140,
      lng: 300
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
  const openPanelsCount = (showFilters ? 1 : 0) + (showMap ? 1 : 0);
  let gridColsClass = "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"; // 0 panels open
  if (openPanelsCount === 1) gridColsClass = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"; // 1 panel open
  if (openPanelsCount === 2) gridColsClass = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2"; // 2 panels open

  return (
    <div className="h-screen overflow-hidden pt-[68px] bg-[#F5F7F8] text-[#2D2D2D] font-sans flex flex-col">
      
      {/* Top Navbar Component */}
      <Navbar />

      {/* Main Content Layout */}
      <div className="flex-1 w-full max-w-[1600px] mx-auto flex flex-col lg:flex-row overflow-hidden shadow-sm">
        
        {/* Column 1: Filters (Left) */}
        <aside className={`bg-white border-r border-gray-100 overflow-y-auto shrink-0 select-none transition-all duration-300 ${
          showFilters ? 'w-full lg:w-[260px] p-6 opacity-100' : 'w-0 p-0 opacity-0 border-r-0 pointer-events-none'
        }`}>
          <h2 className="text-xl font-bold text-[#1A1A1A] mb-6">Filters</h2>

          {/* Property Type Grid */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Property type</h3>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => setPropertyType('house')}
                className={`flex flex-col items-center justify-center p-3 border rounded-xl transition ${
                  propertyType === 'house' 
                    ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white' 
                    : 'border-gray-150 hover:bg-gray-50 text-gray-600 bg-white'
                }`}
              >
                <Home className="w-5 h-5 mb-1.5" />
                <span className="text-[11px] font-bold">House</span>
              </button>
              <button 
                onClick={() => setPropertyType('apartment')}
                className={`flex flex-col items-center justify-center p-3 border rounded-xl transition ${
                  propertyType === 'apartment' 
                    ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white' 
                    : 'border-gray-150 hover:bg-gray-50 text-gray-600 bg-white'
                }`}
              >
                <Building2 className="w-5 h-5 mb-1.5" />
                <span className="text-[11px] font-bold">Apartment</span>
              </button>
              <button 
                onClick={() => setPropertyType('commercial')}
                className={`flex flex-col items-center justify-center p-3 border rounded-xl transition ${
                  propertyType === 'commercial' 
                    ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white' 
                    : 'border-gray-150 hover:bg-gray-50 text-gray-600 bg-white'
                }`}
              >
                <Landmark className="w-5 h-5 mb-1.5" />
                <span className="text-[11px] font-bold">Commercial</span>
              </button>
              <button 
                onClick={() => setPropertyType('land')}
                className={`flex flex-col items-center justify-center p-3 border rounded-xl transition ${
                  propertyType === 'land' 
                    ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white' 
                    : 'border-gray-150 hover:bg-gray-50 text-gray-600 bg-white'
                }`}
              >
                <Map className="w-5 h-5 mb-1.5" />
                <span className="text-[11px] font-bold">Land plot</span>
              </button>
            </div>
          </div>

          {/* Rental Period */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Rental period</h3>
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-600 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={rentalPeriod.all} 
                  onChange={(e) => setRentalPeriod({ ...rentalPeriod, all: e.target.checked })}
                  className="accent-[#1A1A1A] rounded mr-2.5 w-4 h-4 cursor-pointer"
                />
                All
              </label>
              <label className="flex items-center text-sm font-semibold text-gray-600 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={rentalPeriod.letly} 
                  onChange={(e) => setRentalPeriod({ ...rentalPeriod, letly: e.target.checked })}
                  className="accent-[#1A1A1A] rounded mr-2.5 w-4 h-4 cursor-pointer"
                />
                Letly
              </label>
              <label className="flex items-center text-sm font-semibold text-gray-600 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={rentalPeriod.innly} 
                  onChange={(e) => setRentalPeriod({ ...rentalPeriod, innly: e.target.checked })}
                  className="accent-[#1A1A1A] rounded mr-2.5 w-4 h-4 cursor-pointer"
                />
                Innly
              </label>
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Price range</h3>
            <div className="h-1 bg-gray-100 rounded-lg relative mb-4">
              <div className="absolute left-[15%] right-[25%] top-0 bottom-0 bg-[#1A1A1A] rounded-lg"></div>
              <div className="absolute w-3.5 h-3.5 bg-white border border-[#1A1A1A] rounded-full left-[15%] top-1/2 transform -translate-y-1/2 cursor-pointer shadow-sm"></div>
              <div className="absolute w-3.5 h-3.5 bg-white border border-[#1A1A1A] rounded-full right-[25%] top-1/2 transform -translate-y-1/2 cursor-pointer shadow-sm"></div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <span className="absolute left-2.5 top-2.5 text-xs text-gray-400">$</span>
                <input 
                  type="number" 
                  value={minPrice} 
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-100 rounded-lg pl-6 pr-2 py-2 text-xs font-bold outline-none text-gray-700 focus:border-[#1A1A1A]"
                />
              </div>
              <div className="relative flex-1">
                <span className="absolute left-2.5 top-2.5 text-xs text-gray-400">$</span>
                <input 
                  type="number" 
                  value={maxPrice} 
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-100 rounded-lg pl-6 pr-2 py-2 text-xs font-bold outline-none text-gray-700 focus:border-[#1A1A1A]"
                />
              </div>
              <button className="bg-[#1A1A1A] hover:bg-black text-white px-3.5 py-2 rounded-lg text-xs font-bold transition">Ok</button>
            </div>
          </div>

          {/* Bedroom & Bathroom Counters */}
          <div className="mb-6 flex space-x-4">
            <div className="flex-1">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Bedroom</h3>
              <div className="flex items-center justify-between border border-gray-150 rounded-xl px-2.5 py-1.5">
                <button onClick={() => setBedrooms(Math.max(1, bedrooms - 1))} className="p-1 text-gray-400 hover:text-gray-600 transition">
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-extrabold text-[#1A1A1A]">{bedrooms}</span>
                <button onClick={() => setBedrooms(bedrooms + 1)} className="p-1 text-gray-400 hover:text-gray-600 transition">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Bathroom</h3>
              <div className="flex items-center justify-between border border-gray-150 rounded-xl px-2.5 py-1.5">
                <button onClick={() => setBathrooms(Math.max(1, bathrooms - 1))} className="p-1 text-gray-400 hover:text-gray-600 transition">
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-extrabold text-[#1A1A1A]">{bathrooms}</span>
                <button onClick={() => setBathrooms(bathrooms + 1)} className="p-1 text-gray-400 hover:text-gray-600 transition">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Property Area Range */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Property area range</h3>
            <div className="h-1 bg-gray-100 rounded-lg relative mb-4">
              <div className="absolute left-[20%] right-[30%] top-0 bottom-0 bg-[#1A1A1A] rounded-lg"></div>
              <div className="absolute w-3.5 h-3.5 bg-white border border-[#1A1A1A] rounded-full left-[20%] top-1/2 transform -translate-y-1/2 cursor-pointer shadow-sm"></div>
              <div className="absolute w-3.5 h-3.5 bg-white border border-[#1A1A1A] rounded-full right-[30%] top-1/2 transform -translate-y-1/2 cursor-pointer shadow-sm"></div>
            </div>
            <div className="flex items-center space-x-2">
              <input 
                type="text" 
                value={`${minArea} sqft`} 
                onChange={(e) => setMinArea(Number(e.target.value.replace(/\D/g, '')))}
                className="w-full bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-2 text-xs font-bold outline-none text-gray-700 focus:border-[#1A1A1A]"
              />
              <input 
                type="text" 
                value={`${maxArea} sqft`} 
                onChange={(e) => setMaxArea(Number(e.target.value.replace(/\D/g, '')))}
                className="w-full bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-2 text-xs font-bold outline-none text-gray-700 focus:border-[#1A1A1A]"
              />
              <button className="bg-[#1A1A1A] hover:bg-black text-white px-3.5 py-2 rounded-lg text-xs font-bold transition">Ok</button>
            </div>
          </div>

          {/* Additional Conveniences */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Additional conveniences</h3>
            <div className="space-y-2.5">
              <label className="flex items-center text-sm font-semibold text-gray-600 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={conveniences.parking} 
                  onChange={(e) => setConveniences({ ...conveniences, parking: e.target.checked })}
                  className="accent-[#1A1A1A] rounded mr-2.5 w-4 h-4 cursor-pointer"
                />
                Parking slot
              </label>
              <label className="flex items-center text-sm font-semibold text-gray-600 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={conveniences.pet} 
                  onChange={(e) => setConveniences({ ...conveniences, pet: e.target.checked })}
                  className="accent-[#1A1A1A] rounded mr-2.5 w-4 h-4 cursor-pointer"
                />
                Pet allowed
              </label>
              <label className="flex items-center text-sm font-semibold text-gray-600 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={conveniences.furnished} 
                  onChange={(e) => setConveniences({ ...conveniences, furnished: e.target.checked })}
                  className="accent-[#1A1A1A] rounded mr-2.5 w-4 h-4 cursor-pointer"
                />
                Furnished
              </label>
            </div>
          </div>
        </aside>

        {/* Column 2: Listings results (Center) */}
        <main className="flex-1 bg-[#F8FAFB] p-6 overflow-y-auto">
          {/* Search Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h1 className="text-xl font-bold text-gray-900">
              Search results <span className="font-extrabold text-[#1A1A1A]">547</span>
            </h1>
            <div className="flex items-center flex-wrap gap-2.5">
              {/* Toggle Filters Button */}
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 text-xs font-extrabold px-3.5 py-2.5 rounded-xl border transition shadow-sm cursor-pointer select-none ${
                  showFilters 
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] hover:bg-black' 
                    : 'bg-white text-gray-600 border-gray-150 hover:bg-gray-50'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{showFilters ? 'Hide Filters' : 'Filters'}</span>
              </button>

              {/* Toggle Map Button */}
              <button 
                onClick={() => setShowMap(!showMap)}
                className={`flex items-center space-x-2 text-xs font-extrabold px-3.5 py-2.5 rounded-xl border transition shadow-sm cursor-pointer select-none ${
                  showMap 
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] hover:bg-black' 
                    : 'bg-white text-gray-600 border-gray-150 hover:bg-gray-50'
                }`}
              >
                <Map className="w-3.5 h-3.5" />
                <span>Map</span>
              </button>

              {/* Sort selector dropdown */}
              <div className="flex items-center space-x-2 text-xs font-extrabold text-gray-500 bg-white border border-gray-150 rounded-xl px-3.5 py-2.5 cursor-pointer shadow-sm hover:bg-gray-50 transition">
                <span>Added today</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Cards Grid (Square shape) */}
          <div className={`grid ${gridColsClass} gap-6`}>
            {listings.map((listing) => (
              <div 
                key={listing.id}
                onClick={() => setActivePropertyId(listing.id)}
                className="bg-white p-4 rounded-3xl flex flex-col border border-gray-100 hover:shadow-md transition-all cursor-pointer"
              >
                {/* Image */}
                <div className="w-full h-[220px] rounded-2xl overflow-hidden shrink-0 relative bg-gray-100 mb-4">
                  <img 
                    src={listing.image} 
                    alt={listing.title} 
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg text-gray-900 leading-tight">{listing.title}</h3>
                      <button 
                        onClick={(e) => handleBookmarkToggle(listing.id, e)}
                        className={`p-2 rounded-xl border transition shrink-0 ml-3 ${
                          bookmarkedIds.includes(listing.id) 
                            ? 'bg-[#1A1A1A]/10 border-transparent text-[#1A1A1A]' 
                            : 'bg-white border-gray-150 text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        <Bookmark className={`w-4 h-4 ${bookmarkedIds.includes(listing.id) ? 'fill-[#1A1A1A]' : ''}`} />
                      </button>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm mb-4">
                      <MapPin className="w-4 h-4 text-gray-400 mr-1.5 shrink-0" />
                      {listing.address}
                    </div>
                  </div>

                  {/* Specs & Price */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                    <div className="flex items-center space-x-4 text-gray-500 text-xs font-medium">
                      <span className="flex items-center">
                        <BedDouble className="w-4 h-4 text-gray-400 mr-1.5" />
                        {listing.beds}
                      </span>
                      <span className="flex items-center">
                        <Bath className="w-4 h-4 text-gray-400 mr-1.5" />
                        {listing.baths}
                      </span>
                      <span className="flex items-center">
                        <Maximize2 className="w-4 h-4 text-gray-400 mr-1.5" />
                        {listing.sqft.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-[#1A1A1A] font-bold text-lg">
                      {listing.price}<span className="text-xs text-gray-400 font-normal">/mo</span>
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

