"use client";

import React from 'react';
import Link from 'next/link';
import { Coffee, Briefcase, ChevronRight } from 'lucide-react';

export default function ServicesPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Post-Relocation Services</h2>
        <p className="text-gray-500 text-xs font-semibold mt-1">Exclusive Stayzo value-add ecosystem tailored to your new neighborhood.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Boarding Food Tiffin */}
        <Link href="/dashboard/tenant/services/food" className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between group hover:shadow-md transition cursor-pointer no-underline">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center border border-gray-200 mb-5">
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
        </Link>

        {/* Nearby Part-time Jobs */}
        <section className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between group hover:shadow-md transition cursor-pointer">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center border border-gray-200 mb-5">
              <Briefcase className="w-6 h-6 text-[#1A1A1A]" />
            </div>
            <h3 className="text-xl font-extrabold text-[#1A1A1A] mb-2">Nearby Part-time Jobs</h3>
            <p className="text-xs font-semibold text-gray-500 leading-relaxed mb-6">
              Explore student jobs and part-time vacancies specifically filtered for your geographic location and schedule.
            </p>
          </div>
          
          <div className="flex items-center justify-between border-t border-gray-150 pt-4 mt-auto">
            <span className="text-xs font-extrabold text-[#1A1A1A]">Browse Vacancies</span>
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#1A1A1A] group-hover:text-white transition">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
