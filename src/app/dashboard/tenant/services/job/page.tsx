"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Phone, MapPin, Building2, Search, Loader2 } from 'lucide-react';

interface JobOpportunity {
  id: string | number;
  company: string;
  position: string;
  location: string;
  phone: string;
  isFromDb: boolean;
}

export default function JobServicesPage() {
  const [filterLocation, setFilterLocation] = useState('');
  const [jobs, setJobs] = useState<JobOpportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/api/properties')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data: any[]) => {
        // Extract jobs added by landlords in listing section
        const dbJobs = data
          .filter((p: any) => p.jobName && p.jobName.trim() !== '')
          .map((p: any) => ({
            id: p.id,
            company: p.title || 'Landlord Listing',
            position: p.jobName,
            location: p.address || p.city || 'Sri Lanka',
            phone: p.jobPhone || '0771234567',
            isFromDb: true
          }));

        // Fallback default jobs in neighborhood
        const mockJobs = [
          { id: 'mock-1', company: "Keells Supermarket", position: "Cashier (Evening Shift)", location: "Union Place, Colombo 02", phone: "+94 11 234 5678", isFromDb: false },
          { id: 'mock-2', company: "Java Lounge", position: "Barista Trainee", location: "Jawatte Road, Colombo 05", phone: "+94 77 987 6543", isFromDb: false },
          { id: 'mock-3', company: "TechWorld Electronics", position: "Sales Assistant", location: "Liberty Plaza, Colombo 03", phone: "+94 71 456 7890", isFromDb: false },
          { id: 'mock-4', company: "Burger King", position: "Service Crew", location: "Mount Lavinia", phone: "+94 76 234 5678", isFromDb: false },
          { id: 'mock-5', company: "City Bookshop", position: "Inventory Assistant", location: "Nugegoda, Colombo", phone: "+94 70 345 6789", isFromDb: false },
          { id: 'mock-6', company: "FitLife Gym", position: "Front Desk Receptionist", location: "Battaramulla, Colombo", phone: "+94 71 567 8901", isFromDb: false }
        ];

        setJobs([...dbJobs, ...mockJobs]);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load listings', err);
        // Load fallback jobs on network/API failure so app remains functional
        const mockJobs = [
          { id: 'mock-1', company: "Keells Supermarket", position: "Cashier (Evening Shift)", location: "Union Place, Colombo 02", phone: "+94 11 234 5678", isFromDb: false },
          { id: 'mock-2', company: "Java Lounge", position: "Barista Trainee", location: "Jawatte Road, Colombo 05", phone: "+94 77 987 6543", isFromDb: false },
          { id: 'mock-3', company: "TechWorld Electronics", position: "Sales Assistant", location: "Liberty Plaza, Colombo 03", phone: "+94 71 456 7890", isFromDb: false },
          { id: 'mock-4', company: "Burger King", position: "Service Crew", location: "Mount Lavinia", phone: "+94 76 234 5678", isFromDb: false },
          { id: 'mock-5', company: "City Bookshop", position: "Inventory Assistant", location: "Nugegoda, Colombo", phone: "+94 70 345 6789", isFromDb: false },
          { id: 'mock-6', company: "FitLife Gym", position: "Front Desk Receptionist", location: "Battaramulla, Colombo", phone: "+94 71 567 8901", isFromDb: false }
        ];
        setJobs(mockJobs);
        setLoading(false);
      });
  }, []);

  const filteredJobs = jobs.filter(job => 
    job.location.toLowerCase().includes(filterLocation.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-[68px] bg-[#F5F7F8] text-[#2D2D2D] font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-[1600px] mx-auto flex flex-col p-6 lg:p-10 pb-20">
        
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-[#1A1A1A] mb-3 tracking-tight">
              Part-time Job Opportunities
            </h1>
            <p className="text-gray-500 font-semibold text-xs lg:text-sm max-w-2xl leading-relaxed">
              Explore part-time vacancies and flexible jobs added by landlords in your area.
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
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Vacancies...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 bg-white border border-gray-150 rounded-3xl p-6 text-center">
            <p className="text-sm font-bold text-gray-400 mb-1">No vacancies found for your search</p>
            <p className="text-xs text-gray-400">Try searching for a different district or location.</p>
          </div>
        ) : (
          /* Listings Grid (Clean Text-Only Cards) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredJobs.map((job, idx) => (
              <div 
                key={job.id} 
                className="bg-white rounded-3xl p-6 shadow-xs hover:shadow-md border border-gray-150 transition-all duration-300 flex flex-col justify-between group animate-in fade-in slide-in-from-bottom-6"
                style={{ animationDelay: `${idx * 50}ms`, animationFillMode: 'both' }}
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
      </main>
    </div>
  );
}
