"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Trash2, BedDouble, Bath, Maximize2, Scale } from 'lucide-react';

interface WishlistItem {
  id: number;
  title: string;
  address: string;
  beds: number;
  baths: number;
  sqft: number;
  price: string;
  image: string;
  noiseLevel: string;
}

export default function SavedPropertiesPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([
    {
      id: 1,
      title: "Ahlers & Ogletree Villa",
      address: "132 Northbrooke Trce, Woodstock, GA",
      beds: 6,
      baths: 4,
      sqft: 2797,
      price: "$2,695",
      noiseLevel: "Low (Suburban)",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 3,
      title: "Villa Tropical Cana",
      address: "540 Belle Gate Pl, Cary, NC",
      beds: 8,
      baths: 5,
      sqft: 3875,
      price: "$3,300",
      noiseLevel: "Medium (City Edge)",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    }
  ]);

  const [showCompare, setShowCompare] = useState(false);

  const handleRemoveFromWishlist = (id: number) => {
    setWishlist(wishlist.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Saved Properties</h2>
          <p className="text-gray-500 text-xs font-semibold mt-1">Your bookmarked premium stays and comparison matrix.</p>
        </div>
        <button 
          onClick={() => setShowCompare(!showCompare)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold shadow-sm transition ${
            showCompare ? 'bg-[#1A1A1A] text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Scale className="w-4 h-4" /> 
          {showCompare ? 'Hide Comparison Matrix' : 'Compare Saved'}
        </button>
      </div>

      {showCompare && wishlist.length > 1 && (
        <div className="bg-[#F8FAFB] border border-[#1A1A1A]/10 rounded-3xl p-6 shadow-sm overflow-x-auto">
          <h3 className="text-sm font-extrabold text-gray-900 mb-4 uppercase tracking-wider">Comparison Matrix</h3>
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead>
              <tr className="text-gray-400 font-extrabold uppercase tracking-wider border-b border-gray-200">
                <th className="py-3 px-4">Feature</th>
                {wishlist.map(item => (
                  <th key={item.id} className="py-3 px-4 text-gray-900">{item.title}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150 font-semibold text-gray-700">
              <tr>
                <td className="py-3 px-4 font-bold">Price</td>
                {wishlist.map(item => <td key={item.id} className="py-3 px-4 text-[#1A1A1A] font-extrabold">{item.price}</td>)}
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold">Size</td>
                {wishlist.map(item => <td key={item.id} className="py-3 px-4">{item.beds} Bed, {item.baths} Bath, {item.sqft} sqft</td>)}
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold">Noise Level</td>
                {wishlist.map(item => <td key={item.id} className="py-3 px-4">{item.noiseLevel}</td>)}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {wishlist.length === 0 ? (
        <div className="bg-white border border-gray-150 rounded-[32px] p-12 shadow-sm text-center space-y-4">
          <Heart className="w-10 h-10 text-gray-300 mx-auto" />
          <h3 className="text-lg font-extrabold text-gray-900">Your wishlist is empty</h3>
          <Link href="/search" className="inline-block bg-[#1A1A1A] hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-extrabold shadow-sm mt-2">Browse properties</Link>
        </div>
      ) : (
        <div className="flex flex-col space-y-5">
          {wishlist.map((item) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col sm:flex-row group">
              {/* Left Side: Image */}
              <div className="h-[200px] sm:h-auto sm:w-[280px] sm:min-h-[180px] bg-gray-50 relative shrink-0">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
                <button 
                  onClick={() => handleRemoveFromWishlist(item.id)} 
                  className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm hover:bg-white text-red-500 p-2.5 rounded-full shadow-sm transition"
                  title="Remove from saved"
                >
                  <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                </button>
              </div>
              
              {/* Right Side: Details */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-xl text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-gray-500 text-sm font-medium">{item.address}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-extrabold text-[#1A1A1A]">{item.price}</div>
                    <div className="text-xs text-gray-400 font-semibold uppercase tracking-wide">/month</div>
                  </div>
                </div>

                <div className="my-5 flex items-center space-x-6 text-sm font-semibold text-gray-700">
                  <span className="flex items-center gap-2"><BedDouble className="w-4 h-4 text-[#F26B27]" />{item.beds} Beds</span>
                  <span className="flex items-center gap-2"><Bath className="w-4 h-4 text-[#F26B27]" />{item.baths} Baths</span>
                  <span className="flex items-center gap-2"><Maximize2 className="w-4 h-4 text-[#F26B27]" />{item.sqft.toLocaleString()} sqft</span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-xs font-bold px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg">
                    Noise: {item.noiseLevel}
                  </div>
                  <Link href="/search" className="bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-900 px-6 py-2.5 rounded-xl text-sm font-bold transition shadow-sm">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
