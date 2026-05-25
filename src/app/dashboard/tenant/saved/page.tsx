"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, BedDouble, Bath, Maximize2 } from 'lucide-react';

interface WishlistItem {
  id: number;
  title: string;
  address: string;
  beds: number;
  baths: number;
  sqft: number;
  price: string;
  image: string;
}

export default function SavedPropertiesPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([
    {
      id: 1,
      title: "Villa in Galle",
      address: "Galle, Sri Lanka",
      beds: 3,
      baths: 2,
      sqft: 1800,
      price: "Rs. 17,827",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 3,
      title: "Villa in Hapugala",
      address: "Hapugala, Sri Lanka",
      beds: 2,
      baths: 2,
      sqft: 1400,
      price: "Rs. 49,071",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 11,
      title: "Kandy Mountain Haven",
      address: "Kandy, Sri Lanka",
      beds: 4,
      baths: 4,
      sqft: 2800,
      price: "Rs. 95,000",
      image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 12,
      title: "Colombo Sky Villa",
      address: "Colombo, Sri Lanka",
      beds: 3,
      baths: 3,
      sqft: 2200,
      price: "Rs. 210,000",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    }
  ]);

  const handleRemove = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#1A1A1A]">Saved Properties</h2>
          <p className="text-gray-500 text-xs font-semibold mt-1">
            {wishlist.length} {wishlist.length === 1 ? 'property' : 'properties'} saved to your wishlist.
          </p>
        </div>
        <Link
          href="/search"
          className="shrink-0 text-xs font-bold text-[#1A1A1A] border border-gray-200 hover:bg-gray-50 px-5 py-2.5 rounded-xl transition shadow-xs"
        >
          Browse more properties
        </Link>
      </div>

      {/* Empty State */}
      {wishlist.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-[32px] p-16 shadow-sm text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto">
            <Heart className="w-7 h-7 text-gray-300" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-[#1A1A1A]">Your wishlist is empty</h3>
            <p className="text-gray-400 text-xs font-semibold mt-1.5 max-w-xs mx-auto">
              Browse premium properties and save your favourites here to compare later.
            </p>
          </div>
          <Link
            href="/search"
            className="inline-block bg-[#1A1A1A] hover:bg-black text-white px-6 py-2.5 rounded-xl text-xs font-extrabold shadow-sm transition"
          >
            Browse Properties
          </Link>
        </div>
      ) : (
        /* Property Cards Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 hover:border-gray-400 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition duration-300 flex flex-col group"
            >
              {/* Property Image */}
              <div className="h-[220px] w-full bg-gray-50 relative shrink-0 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                />

                {/* Remove from wishlist button */}
                <button
                  onClick={(e) => handleRemove(item.id, e)}
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white text-[#1A1A1A] p-2.5 rounded-full shadow-sm transition z-10"
                  title="Remove from saved"
                >
                  <Heart className="w-4 h-4 fill-[#1A1A1A] text-[#1A1A1A]" />
                </button>
              </div>

              {/* Property Details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-base text-[#1A1A1A] leading-tight group-hover:text-black transition-colors mb-1">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-xs font-medium mb-4">{item.address}</p>
                </div>

                {/* Specs row */}
                <div className="flex items-center gap-4 text-xs font-semibold text-gray-600 mb-4">
                  <span className="flex items-center gap-1.5">
                    <BedDouble className="w-3.5 h-3.5 text-[#1A1A1A]" />
                    {item.beds} Beds
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Bath className="w-3.5 h-3.5 text-[#1A1A1A]" />
                    {item.baths} Baths
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Maximize2 className="w-3.5 h-3.5 text-[#1A1A1A]" />
                    {item.sqft.toLocaleString()} sqft
                  </span>
                </div>

                {/* Price + View Button */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <span className="text-base font-extrabold text-[#1A1A1A]">{item.price}</span>
                    <span className="text-[10px] text-gray-400 font-semibold uppercase ml-1">/mo</span>
                  </div>

                  {/* ✅ View navigates to the same detailed page as search results */}
                  <Link
                    href={`/properties/${item.id}`}
                    className="bg-[#1A1A1A] hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm"
                  >
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
