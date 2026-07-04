"use client";

import React, { useState, useEffect } from 'react';
import { Coffee, Briefcase, ChevronRight, Phone, MapPin, Building2, ChefHat, Search, ArrowLeft, Loader2 } from 'lucide-react';

interface FoodService {
  id: string | number;
  name: string;
  owner: string;
  area: string;
  phone: string;
  specialty: string;
  isFromDb: boolean;
}

interface JobOpportunity {
  id: string | number;
  company: string;
  position: string;
  location: string;
  phone: string;
  isFromDb: boolean;
}

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState<'menu' | 'food' | 'job'>('menu');
  const [filterLocation, setFilterLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/properties')
      .then(res => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then(data => {
        setProperties(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load listings', err);
        setLoading(false);
      });
  }, []);

  // ── 1. Food Accommodation Data Processing ──
  const getFoodServices = (): FoodService[] => {
    const dbFood: FoodService[] = [];
    
    properties.forEach((p: any) => {
      // 1. Check if multiple food facilities are stored in foodFacilities JSON string
      if (p.foodFacilities) {
        try {
          const parsed = typeof p.foodFacilities === 'string' ? JSON.parse(p.foodFacilities) : p.foodFacilities;
          if (Array.isArray(parsed)) {
            parsed.forEach((item: any, idx: number) => {
              if (item.name || item.phone) {
                dbFood.push({
                  id: `${p.id}-food-${idx}`,
                  name: item.name || 'Food Facility',
                  owner: p.title || 'Landlord Listing',
                  area: item.area || p.address || p.city || 'Sri Lanka',
                  phone: item.phone || 'N/A',
                  specialty: item.specialty || 'Available Food & Catering Option',
                  isFromDb: true
                });
              }
            });
          }
        } catch (e) {
          console.error('Failed to parse foodFacilities JSON', e);
        }
      }

      // 2. Fallback to single foodName/foodPhone if present and not already processed
      if (p.foodName && p.foodName.trim() !== '') {
        const alreadyAdded = dbFood.some((item) => item.name === p.foodName && item.phone === p.foodPhone);
        if (!alreadyAdded) {
          dbFood.push({
            id: `${p.id}-food-legacy`,
            name: p.foodName,
            owner: p.title || 'Landlord Listing',
            area: p.address || p.city || 'Sri Lanka',
            phone: p.foodPhone || '0771234567',
            specialty: 'Available Food & Catering Option',
            isFromDb: true
          });
        }
      }
    });

    const mockFood = [
      { id: 'mock-1', name: "Amma's Homely Meals", owner: "Mrs. Shanthi Fernando", area: "Union Place, Colombo 02", phone: "+94 77 123 4567", specialty: "Authentic Sri Lankan Rice & Curry", isFromDb: false },
      { id: 'mock-2', name: "Spice Route Catering", owner: "Kamal Perera", area: "Dehiwala, Mount Lavinia", phone: "+94 71 987 6543", specialty: "Biryani & Indian Cuisine", isFromDb: false },
      { id: 'mock-3', name: "Green Leaf Organics", owner: "Nethmi Silva", area: "Rajagiriya, Battaramulla", phone: "+94 70 456 7890", specialty: "Healthy Salads & Vegan Bowls", isFromDb: false },
      { id: 'mock-4', name: "Taste of Jaffna", owner: "Rajesh Kumar", area: "Wellawatte, Bambalapitiya", phone: "+94 76 234 5678", specialty: "Traditional Northern Cuisine", isFromDb: false },
      { id: 'mock-5', name: "Sunrise Breakfast Hub", owner: "Nuwan & Sanduni", area: "Nugegoda, Maharagama", phone: "+94 77 345 6789", specialty: "Hoppers, String Hoppers & Roti", isFromDb: false },
      { id: 'mock-6', name: "Ocean Catch Kitchen", owner: "Dinesh Mendis", area: "Negombo, Wattala", phone: "+94 71 567 8901", specialty: "Fresh Seafood & Devilled Dishes", isFromDb: false }
    ];

    return [...dbFood, ...mockFood];
  };

  // ── 2. Job Opportunities Data Processing ──
  const getJobOpportunities = (): JobOpportunity[] => {
    const dbJobs: JobOpportunity[] = [];

    properties.forEach((p: any) => {
      // 1. Check if multiple jobs are stored in partTimeJobs JSON string
      if (p.partTimeJobs) {
        try {
          const parsed = typeof p.partTimeJobs === 'string' ? JSON.parse(p.partTimeJobs) : p.partTimeJobs;
          if (Array.isArray(parsed)) {
            parsed.forEach((item: any, idx: number) => {
              if (item.position || item.phone) {
                dbJobs.push({
                  id: `${p.id}-job-${idx}`,
                  company: item.company || p.title || 'Landlord Listing',
                  position: item.position || 'Part-time Job',
                  location: item.location || p.address || p.city || 'Sri Lanka',
                  phone: item.phone || 'N/A',
                  isFromDb: true
                });
              }
            });
          }
        } catch (e) {
          console.error('Failed to parse partTimeJobs JSON', e);
        }
      }

      // 2. Fallback to single jobName/jobPhone if present and not already processed
      if (p.jobName && p.jobName.trim() !== '') {
        const alreadyAdded = dbJobs.some((item) => item.position === p.jobName && item.phone === p.jobPhone);
        if (!alreadyAdded) {
          dbJobs.push({
            id: `${p.id}-job-legacy`,
            company: p.title || 'Landlord Listing',
            position: p.jobName,
            location: p.address || p.city || 'Sri Lanka',
            phone: p.jobPhone || '0771234567',
            isFromDb: true
          });
        }
      }
    });

    const mockJobs = [
      { id: 'mock-1', company: "Keells Supermarket", position: "Cashier (Evening Shift)", location: "Union Place, Colombo 02", phone: "+94 11 234 5678", isFromDb: false },
      { id: 'mock-2', company: "Java Lounge", position: "Barista Trainee", location: "Jawatte Road, Colombo 05", phone: "+94 77 987 6543", isFromDb: false },
      { id: 'mock-3', company: "TechWorld Electronics", position: "Sales Assistant", location: "Liberty Plaza, Colombo 03", phone: "+94 71 456 7890", isFromDb: false },
      { id: 'mock-4', company: "Burger King", position: "Service Crew", location: "Mount Lavinia", phone: "+94 76 234 5678", isFromDb: false },
      { id: 'mock-5', company: "City Bookshop", position: "Inventory Assistant", location: "Nugegoda, Colombo", phone: "+94 70 345 6789", isFromDb: false },
      { id: 'mock-6', company: "FitLife Gym", position: "Front Desk Receptionist", location: "Battaramulla, Colombo", phone: "+94 71 567 8901", isFromDb: false }
    ];

    return [...dbJobs, ...mockJobs];
  };

  // ── Filtered Collections ──
  const filteredFood = getFoodServices().filter(item => 
    item.area.toLowerCase().includes(filterLocation.toLowerCase())
  );

  const filteredJobs = getJobOpportunities().filter(job => 
    job.location.toLowerCase().includes(filterLocation.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* ── Active view: MENU TABS ── */}
      {activeTab === 'menu' && (
        <>
          <div className="border-b border-gray-200 pb-4">
            <h2 className="text-3xl font-extrabold tracking-tight text-[#1A1A1A]">Post-Relocation Services</h2>
            <p className="text-gray-500 text-xs font-semibold mt-1">Exclusive Stayzo value-add ecosystem tailored to your new neighborhood.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Boarding Food Tiffin */}
            <div 
              onClick={() => { setActiveTab('food'); setFilterLocation(''); }} 
              className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between group hover:shadow-md transition cursor-pointer"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-150 mb-5">
                  <Coffee className="w-6 h-6 text-[#1A1A1A]" />
                </div>
                <h3 className="text-xl font-extrabold text-[#1A1A1A] mb-2">Boarding Food Tiffin</h3>
                <p className="text-xs font-semibold text-gray-500 leading-relaxed mb-6">
                  Subscribe to daily packaged meals delivered straight to your door. Explore menus from verified home cooks in your local area.
                </p>
              </div>
              
              <div className="flex items-center justify-between border-t border-gray-200 pt-4 mt-auto">
                <span className="text-xs font-extrabold text-[#1A1A1A]">View Local Menu</span>
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#1A1A1A] group-hover:text-white transition">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Nearby Part-time Jobs */}
            <div 
              onClick={() => { setActiveTab('job'); setFilterLocation(''); }} 
              className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between group hover:shadow-md transition cursor-pointer"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-150 mb-5">
                  <Briefcase className="w-6 h-6 text-[#1A1A1A]" />
                </div>
                <h3 className="text-xl font-extrabold text-[#1A1A1A] mb-2">Part-time Job Opportunities</h3>
                <p className="text-xs font-semibold text-gray-500 leading-relaxed mb-6">
                  Discover part-time vacancies and flexible jobs added by landlords in your area.
                </p>
              </div>
              
              <div className="flex items-center justify-between border-t border-gray-150 pt-4 mt-auto">
                <span className="text-xs font-extrabold text-[#1A1A1A]">Browse Vacancies</span>
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#1A1A1A] group-hover:text-white transition">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Active view: FOOD FACILITIES ── */}
      {activeTab === 'food' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <button 
            onClick={() => setActiveTab('menu')}
            className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-gray-900 transition mb-6 bg-white border border-gray-200 px-3.5 py-2 rounded-full cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Services</span>
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-gray-200 pb-4">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Food Accommodation Services</h2>
              <p className="text-xs text-gray-500 font-semibold mt-1">Discover verified home cooks and catering services provided by landlords.</p>
            </div>

            {/* Filter Input */}
            <div className="relative w-full sm:w-72 shrink-0">
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
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400 mb-2" />
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Food Services...</p>
            </div>
          ) : filteredFood.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-150 rounded-3xl p-6 text-center">
              <p className="text-sm font-bold text-gray-400 mb-1">No food services found for your location</p>
              <p className="text-xs text-gray-400">Try a different district or neighborhood query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredFood.map((service, idx) => (
                <div 
                  key={service.id} 
                  className="bg-white rounded-3xl p-6 shadow-xs hover:shadow-md border border-gray-150 transition-all duration-300 flex flex-col justify-between group"
                  style={{ animationDelay: `${idx * 40}ms`, animationFillMode: 'both' }}
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
        </div>
      )}

      {/* ── Active view: PART-TIME JOBS ── */}
      {activeTab === 'job' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <button 
            onClick={() => setActiveTab('menu')}
            className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-gray-900 transition mb-6 bg-white border border-gray-200 px-3.5 py-2 rounded-full cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Services</span>
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-gray-200 pb-4">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Part-time Job Opportunities</h2>
              <p className="text-xs text-gray-500 font-semibold mt-1">Discover part-time vacancies and flexible jobs added by landlords in your area.</p>
            </div>

            {/* Filter Input */}
            <div className="relative w-full sm:w-72 shrink-0">
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
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400 mb-2" />
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Vacancies...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-150 rounded-3xl p-6 text-center">
              <p className="text-sm font-bold text-gray-400 mb-1">No vacancies found for your location</p>
              <p className="text-xs text-gray-400">Try a different district or neighborhood query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredJobs.map((job, idx) => (
                <div 
                  key={job.id} 
                  className="bg-white rounded-3xl p-6 shadow-xs hover:shadow-md border border-gray-150 transition-all duration-300 flex flex-col justify-between group"
                  style={{ animationDelay: `${idx * 40}ms`, animationFillMode: 'both' }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        job.isFromDb 
                          ? 'bg-indigo-50 text-indigo-600 border border-indigo-100/55' 
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {job.isFromDb ? 'Added by Landlord' : 'Neighborhood Job'}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-[#1A1A1A] text-base leading-snug mb-1 group-hover:text-indigo-600 transition-colors">
                      {job.position}
                    </h3>
                    <p className="text-xs font-bold text-gray-400 mb-6 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{job.company}</span>
                    </p>
                  </div>

                  <div className="space-y-3.5 pt-4 border-t border-gray-100 mt-auto">
                    {/* Location */}
                    <div className="flex items-start gap-2.5 text-xs font-semibold text-gray-600">
                      <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="leading-tight line-clamp-2">{job.location}</span>
                    </div>

                    {/* Phone */}
                    <a 
                      href={`tel:${job.phone}`}
                      className="flex items-center gap-2.5 text-xs font-bold text-[#4F46E5] hover:underline cursor-pointer"
                    >
                      <Phone className="w-4 h-4 text-[#4F46E5] shrink-0" />
                      <span>{job.phone}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
