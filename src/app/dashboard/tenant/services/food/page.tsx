"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import { Phone, MapPin, ChefHat, Star, CheckCircle2 } from 'lucide-react';

const FOOD_SERVICES = [
  {
    id: 1,
    name: "Amma's Homely Meals",
    owner: "Mrs. Shanthi Fernando",
    area: "Colombo 03, Colombo 04",
    phone: "+94 77 123 4567",
    image: "https://images.unsplash.com/photo-1543362906-acfc16c67564?w=600&q=80",
    rating: 4.9,
    reviews: 128,
    specialty: "Authentic Sri Lankan Rice & Curry",
    verified: true
  },
  {
    id: 2,
    name: "Spice Route Catering",
    owner: "Kamal Perera",
    area: "Dehiwala, Mount Lavinia",
    phone: "+94 71 987 6543",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80",
    rating: 4.7,
    reviews: 84,
    specialty: "Biryani & Indian Cuisine",
    verified: true
  },
  {
    id: 3,
    name: "Green Leaf Organics",
    owner: "Nethmi Silva",
    area: "Rajagiriya, Battaramulla",
    phone: "+94 70 456 7890",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
    rating: 4.8,
    reviews: 215,
    specialty: "Healthy Salads & Vegan Bowls",
    verified: false
  },
  {
    id: 4,
    name: "Taste of Jaffna",
    owner: "Rajesh Kumar",
    area: "Wellawatte, Bambalapitiya",
    phone: "+94 76 234 5678",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93cb0?w=600&q=80",
    rating: 4.9,
    reviews: 342,
    specialty: "Traditional Northern Cuisine",
    verified: true
  },
  {
    id: 5,
    name: "Sunrise Breakfast Hub",
    owner: "Nuwan & Sanduni",
    area: "Nugegoda, Maharagama",
    phone: "+94 77 345 6789",
    image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=600&q=80",
    rating: 4.6,
    reviews: 95,
    specialty: "Hoppers, String Hoppers & Roti",
    verified: false
  },
  {
    id: 6,
    name: "Ocean Catch Kitchen",
    owner: "Dinesh Mendis",
    area: "Negombo, Wattala",
    phone: "+94 71 567 8901",
    image: "https://images.unsplash.com/photo-1599084924201-1e96a23e597c?w=600&q=80",
    rating: 4.8,
    reviews: 176,
    specialty: "Fresh Seafood & Devilled Dishes",
    verified: true
  }
];

export default function FoodServicesPage() {
  return (
    <div className="min-h-screen pt-[68px] bg-[#F5F7F8] text-[#2D2D2D] font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-[1600px] mx-auto flex flex-col p-6 lg:p-10 pb-20">
        
        {/* Header Section */}
        <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-[#1A1A1A] mb-3 tracking-tight">
            Food Accommodation Services
          </h1>
          <p className="text-gray-500 font-medium text-sm lg:text-base max-w-2xl leading-relaxed">
            Discover verified home cooks and premium catering services near your location. Enjoy healthy, delicious meals delivered right to your doorstep.
          </p>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {FOOD_SERVICES.map((service, idx) => (
            <div 
              key={service.id} 
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 group flex flex-col animate-in fade-in slide-in-from-bottom-6"
              style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'both' }}
            >
              {/* Image Container */}
              <div className="w-full aspect-[4/3] relative overflow-hidden bg-gray-100">
                <img 
                  src={service.image} 
                  alt={service.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {service.verified && (
                  <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-[10px] font-black text-gray-900 uppercase tracking-wide">
                      Verified Partner
                    </span>
                  </div>
                )}
                
                <div className="absolute bottom-3 right-3 z-10 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-black text-gray-900">{service.rating}</span>
                  <span className="text-[10px] text-gray-500 font-semibold ml-0.5">({service.reviews})</span>
                </div>
              </div>

              {/* Content Container */}
              <div className="p-5 flex-1 flex flex-col bg-white">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-extrabold text-[#1A1A1A] text-lg leading-tight group-hover:text-[#4F46E5] transition-colors">
                    {service.name}
                  </h3>
                </div>

                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                    <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                      <ChefHat className="w-4 h-4 text-orange-500" />
                    </div>
                    <span className="truncate">By {service.owner}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-emerald-500" />
                    </div>
                    <span className="line-clamp-2 leading-tight">{service.area}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4 text-[#4F46E5]" />
                    </div>
                    <span className="font-bold text-[#4F46E5] tracking-wide">{service.phone}</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-100">
                  <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">
                    Specialty
                  </p>
                  <p className="text-sm font-bold text-gray-800 line-clamp-1">
                    {service.specialty}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
