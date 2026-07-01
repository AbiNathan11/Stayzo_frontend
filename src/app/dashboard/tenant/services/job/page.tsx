"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import { Phone, MapPin, Building2, CheckCircle2 } from 'lucide-react';

const JOB_OPPORTUNITIES = [
  {
    id: 1,
    company: "Keells Supermarket",
    position: "Cashier (Evening Shift)",
    location: "Union Place, Colombo 02",
    phone: "+94 11 234 5678",
    image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=600&q=80",
    verified: true
  },
  {
    id: 2,
    company: "Java Lounge",
    position: "Barista Trainee",
    location: "Jawatte Road, Colombo 05",
    phone: "+94 77 987 6543",
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&q=80",
    verified: true
  },
  {
    id: 3,
    company: "TechWorld Electronics",
    position: "Sales Assistant",
    location: "Liberty Plaza, Colombo 03",
    phone: "+94 71 456 7890",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&q=80",
    verified: false
  },
  {
    id: 4,
    company: "Burger King",
    position: "Service Crew",
    location: "Mount Lavinia",
    phone: "+94 76 234 5678",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&q=80",
    verified: true
  },
  {
    id: 5,
    company: "City Bookshop",
    position: "Inventory Assistant",
    location: "Nugegoda",
    phone: "+94 70 345 6789",
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&q=80",
    verified: false
  },
  {
    id: 6,
    company: "FitLife Gym",
    position: "Front Desk Receptionist",
    location: "Battaramulla",
    phone: "+94 71 567 8901",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80",
    verified: true
  }
];

export default function JobServicesPage() {
  return (
    <div className="min-h-screen pt-[68px] bg-[#F5F7F8] text-[#2D2D2D] font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-[1600px] mx-auto flex flex-col p-6 lg:p-10 pb-20">
        
        {/* Header Section */}
        <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-[#1A1A1A] mb-3 tracking-tight">
            Part-time Job Opportunities
          </h1>
          <p className="text-gray-500 font-medium text-sm lg:text-base max-w-2xl leading-relaxed">
            Find flexible work opportunities nearby. Explore part-time positions at local shops, cafes, and businesses perfect for students and tenants.
          </p>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {JOB_OPPORTUNITIES.map((job, idx) => (
            <div 
              key={job.id} 
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 group flex flex-col animate-in fade-in slide-in-from-bottom-6"
              style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'both' }}
            >
              {/* Image Container */}
              <div className="w-full aspect-[4/3] relative overflow-hidden bg-gray-100">
                <img 
                  src={job.image} 
                  alt={job.company} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {job.verified && (
                  <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-[10px] font-black text-gray-900 uppercase tracking-wide">
                      Verified Employer
                    </span>
                  </div>
                )}
              </div>

              {/* Content Container */}
              <div className="p-5 flex-1 flex flex-col bg-white">
                <div className="flex items-start justify-between mb-5">
                  <h3 className="font-extrabold text-[#1A1A1A] text-lg leading-tight group-hover:text-[#4F46E5] transition-colors line-clamp-2">
                    {job.position}
                  </h3>
                </div>

                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4 text-blue-500" />
                    </div>
                    <span className="truncate">{job.company}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-emerald-500" />
                    </div>
                    <span className="line-clamp-2 leading-tight">{job.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4 text-[#4F46E5]" />
                    </div>
                    <span className="font-bold text-[#4F46E5] tracking-wide">{job.phone}</span>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
