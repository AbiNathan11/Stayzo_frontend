"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function OwnerDashboard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] text-center px-4 animate-in fade-in duration-500">
      
      <h1 className="text-[40px] md:text-[56px] font-black text-[#1A1A1A] tracking-tight mb-4 uppercase">
        Start Your Listing
      </h1>
      
      <p className="text-gray-500 font-medium text-[15px] md:text-[17px] max-w-2xl mb-10 leading-relaxed">
        Join thousands of hosts worldwide and turn your property into a successful stay with Stayzo's premium management tools.
      </p>
      
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link 
          href="/dashboard/owners/start_listing"
          className="flex items-center justify-center bg-[#1A1A1A] hover:bg-black text-white px-10 py-4 rounded-full text-xs font-bold tracking-widest uppercase transition shadow-md"
        >
          Get Started <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
        
        <Link
          href="/dashboard/owners/learn_more"
          className="flex items-center justify-center bg-transparent border border-[#1A1A1A]/20 hover:border-[#1A1A1A] text-[#1A1A1A] px-10 py-4 rounded-full text-xs font-bold tracking-widest uppercase transition"
        >
          Learn More
        </Link>
      </div>
      
    </div>
  );
}