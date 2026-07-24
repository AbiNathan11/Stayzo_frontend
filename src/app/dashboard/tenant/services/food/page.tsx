"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Phone, MapPin, ChefHat, Search, Loader2 } from 'lucide-react';

interface FoodService {
  id: string | number;
  name: string;
  owner: string;
  area: string;
  phone: string;
  specialty: string;
  isFromDb: boolean;
}

export default function FoodServicesPage() {
  const [filterLocation, setFilterLocation] = useState('');
  const [foodServices, setFoodServices] = useState<FoodService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/api/properties')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data: any[]) => {
        const dbFood: FoodService[] = [];

        data.forEach((p: any) => {
          let parsedFacilities: any[] = [];
          if (p.foodFacilities) {
            try {
              if (typeof p.foodFacilities === 'string') {
                parsedFacilities = JSON.parse(p.foodFacilities);
              } else if (Array.isArray(p.foodFacilities)) {
                parsedFacilities = p.foodFacilities;
              }
            } catch (e) {
              // Not JSON format
            }
          }

          if (Array.isArray(parsedFacilities) && parsedFacilities.length > 0) {
            parsedFacilities.forEach((item: any, idx: number) => {
              if (item && (item.name || item.specialty || item.phone || item.area)) {
                dbFood.push({
                  id: `${p.id}-food-${idx}`,
                  name: item.name || p.foodName || 'Food Facility',
                  owner: p.title || 'Landlord Listing',
                  area: item.area || p.address || p.city || 'Sri Lanka',
                  phone: item.phone || p.foodPhone || 'No contact provided',
                  specialty: item.specialty || 'Food Accommodation Service',
                  isFromDb: true
                });
              }
            });
          } else if (p.foodFacilities && typeof p.foodFacilities === 'string' && !p.foodFacilities.startsWith('[')) {
            dbFood.push({
              id: `${p.id}-food-str`,
              name: p.foodName || 'Food Accommodation',
              owner: p.title || 'Landlord Listing',
              area: p.address || p.city || 'Sri Lanka',
              phone: p.foodPhone || 'No contact provided',
              specialty: p.foodFacilities,
              isFromDb: true
            });
          } else if (p.foodName && p.foodName.trim() !== '') {
            dbFood.push({
              id: `${p.id}-food-legacy`,
              name: p.foodName,
              owner: p.title || 'Landlord Listing',
              area: p.address || p.city || 'Sri Lanka',
              phone: p.foodPhone || 'No contact provided',
              specialty: 'Food Accommodation Service',
              isFromDb: true
            });
          }
        });

        setFoodServices(dbFood);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load listings', err);
        setFoodServices([]);
        setLoading(false);
      });
  }, []);

  const filteredFood = foodServices.filter(item => 
    item.area.toLowerCase().includes(filterLocation.toLowerCase()) ||
    item.name.toLowerCase().includes(filterLocation.toLowerCase()) ||
    item.specialty.toLowerCase().includes(filterLocation.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-[68px] bg-[#F5F7F8] text-[#2D2D2D] font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-[1600px] mx-auto flex flex-col p-6 lg:p-10 pb-20">
        
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-[#1A1A1A] mb-3 tracking-tight">
              Food Accommodation Services
            </h1>
            <p className="text-gray-500 font-semibold text-xs lg:text-sm max-w-2xl leading-relaxed">
              Explore food options, catering providers, and mess halls added by landlords in your area.
            </p>
          </div>

          {/* Location Filter Input */}
          <div className="relative w-full md:w-80 shrink-0">
            <span className="absolute left-3.5 top-[11px] text-gray-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              placeholder="Filter by location (e.g. Colombo)"
              className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold text-gray-700 outline-none focus:ring-1 focus:ring-[#1A1A1A] transition shadow-xs"
              suppressHydrationWarning={true}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400 mb-2" />
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Food Services...</p>
          </div>
        ) : filteredFood.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 bg-white border border-gray-150 rounded-3xl p-6 text-center">
            <p className="text-sm font-bold text-gray-400 mb-1">No food services found for your search</p>
            <p className="text-xs text-gray-400">Try searching for a different district or location.</p>
          </div>
        ) : (
          /* Listings Grid (Clean Text-Only Cards) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFood.map((service, idx) => (
              <div 
                key={service.id} 
                className="bg-white rounded-3xl p-6 shadow-xs hover:shadow-md border border-gray-150 transition-all duration-300 flex flex-col justify-between group animate-in fade-in slide-in-from-bottom-6"
                style={{ animationDelay: `${idx * 50}ms`, animationFillMode: 'both' }}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                      service.isFromDb 
                        ? 'bg-indigo-50 text-indigo-600 border border-indigo-100/55' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {service.isFromDb ? 'Provided by Landlord' : 'Neighborhood Catering'}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-[#1A1A1A] text-base leading-snug mb-1 group-hover:text-indigo-600 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-xs font-bold text-gray-400 mb-6 flex items-center gap-1.5">
                    <ChefHat className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    <span className="truncate">{service.specialty}</span>
                  </p>
                </div>

                <div className="space-y-3.5 pt-4 border-t border-gray-100 mt-auto">
                  {/* Location */}
                  <div className="flex items-start gap-2.5 text-xs font-semibold text-gray-600">
                    <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="leading-tight line-clamp-2">{service.area}</span>
                  </div>

                  {/* Phone */}
                  <a 
                    href={`tel:${service.phone}`}
                    className="flex items-center gap-2.5 text-xs font-bold text-[#4F46E5] hover:underline cursor-pointer"
                  >
                    <Phone className="w-4 h-4 text-[#4F46E5] shrink-0" />
                    <span>{service.phone}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
