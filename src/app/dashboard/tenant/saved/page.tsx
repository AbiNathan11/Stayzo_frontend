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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col group">
              {/* Top Side: Image */}
              <div className="h-[220px] w-full bg-gray-50 relative shrink-0">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
                <button 
                  onClick={() => handleRemoveFromWishlist(item.id)} 
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white text-[#1A1A1A] p-2.5 rounded-full shadow-sm transition"
                  title="Remove from saved"
                >
                  <Heart className="w-4 h-4 fill-[#1A1A1A] text-[#1A1A1A]" />
                </button>
              </div>
              
              {/* Bottom Side: Details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-[#1A1A1A] leading-tight">{item.title}</h3>
                  </div>
                  <p className="text-gray-500 text-xs font-medium mb-4">{item.address}</p>
                </div>

                <div className="flex items-center space-x-4 text-xs font-semibold text-gray-700 mb-4">
                  <span className="flex items-center gap-1.5"><BedDouble className="w-3.5 h-3.5 text-[#1A1A1A]" />{item.beds}</span>
                  <span className="flex items-center gap-1.5"><Bath className="w-3.5 h-3.5 text-[#1A1A1A]" />{item.baths}</span>
                  <span className="flex items-center gap-1.5"><Maximize2 className="w-3.5 h-3.5 text-[#1A1A1A]" />{item.sqft}</span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <span className="text-lg font-extrabold text-[#1A1A1A]">{item.price}</span>
                    <span className="text-[10px] text-gray-400 font-semibold uppercase ml-1">/mo</span>
                  </div>
                  <Link href="/search" className="bg-[#1A1A1A] hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm">
                    View
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
