"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, Key, CalendarClock, ShieldCheck, 
  Home, Star, DollarSign, PlusCircle 
} from 'lucide-react';

export default function OwnerDashboard() {
  const [user, setUser] = useState<{ firstName: string; lastName: string; email: string } | null>(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem('stayzo_token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({
          firstName: payload.firstName || 'Abiramy',
          lastName: payload.lastName || '',
          email: payload.email || 'abiramy@example.com'
        });
      } else {
        setUser({ firstName: 'Abiramy', lastName: '', email: 'abiramy@example.com' });
      }
    } catch {
      setUser({ firstName: 'Abiramy', lastName: '', email: 'abiramy@example.com' });
    }
  }, []);

  const userInitial = user?.firstName?.charAt(0).toUpperCase() || 'A';

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Dashboard Welcome Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <h2 className="text-3xl font-extrabold tracking-tight text-[#1A1A1A]">
          Welcome back, {user?.firstName}
        </h2>
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Owner Portal
        </span>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Profile / Host Status Card */}
        <div className="col-span-1 md:col-span-1 bg-white text-[#1A1A1A] border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 opacity-50 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="flex flex-col items-center text-center space-y-4 relative z-10">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-100 text-[#1A1A1A] flex items-center justify-center text-4xl font-black shadow-sm">
                {userInitial}
              </div>
              <span className="absolute bottom-0 right-0 bg-[#1A1A1A] text-white p-1 rounded-full shadow-md text-[10px] font-bold px-2">
                HOST
              </span>
            </div>
            
            <div>
              <h3 className="text-xl font-bold leading-tight">
                {user?.firstName} {user?.lastName}
              </h3>
              <p className="text-gray-500 text-xs font-semibold mt-1">{user?.email}</p>
            </div>

            <div className="w-full flex flex-col gap-2 mt-4">
              <Link 
                href="/dashboard/owners/start_listing"
                className="w-full flex items-center justify-center space-x-2 text-xs font-bold text-white bg-[#1A1A1A] hover:bg-black rounded-xl px-4 py-2.5 transition shadow-sm"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Create Listing</span>
              </Link>
              <button className="w-full flex items-center justify-center space-x-2 text-xs font-bold text-[#1A1A1A] bg-gray-50 border border-gray-200 hover:bg-gray-100 rounded-xl px-4 py-2.5 transition">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verify Credentials</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="col-span-1 md:col-span-3 bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-center">
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">Portfolio Performance</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
            
            {/* Stat 1 */}
            <div className="flex items-center gap-5 sm:px-4 first:px-0 pt-4 sm:pt-0 first:pt-0 group cursor-pointer">
              <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center group-hover:scale-110 transition duration-300">
                <Home className="w-6 h-6 text-[#1A1A1A]" />
              </div>
              <div>
                <h3 className="text-4xl font-black text-[#1A1A1A] leading-none mb-1">3</h3>
                <p className="text-xs font-bold text-gray-500 uppercase">Active Properties</p>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="flex items-center gap-5 sm:px-6 pt-4 sm:pt-0 group cursor-pointer">
              <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center group-hover:scale-110 transition duration-300">
                <CalendarClock className="w-6 h-6 text-[#1A1A1A]" />
              </div>
              <div>
                <h3 className="text-4xl font-black text-[#1A1A1A] leading-none mb-1">5</h3>
                <p className="text-xs font-bold text-gray-500 uppercase">Booked Visits</p>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex items-center gap-5 sm:px-6 pt-4 sm:pt-0 group cursor-pointer">
              <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center group-hover:scale-110 transition duration-300">
                <DollarSign className="w-6 h-6 text-[#1A1A1A]" />
              </div>
              <div>
                <h3 className="text-[26px] font-black text-[#1A1A1A] leading-none mb-1">Rs. 240K</h3>
                <p className="text-xs font-bold text-gray-500 uppercase">Est. Monthly Revenue</p>
              </div>
            </div>

          </div>
        </div>

        {/* Quick Launchpad section */}
        <div className="col-span-1 md:col-span-4 bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 border-b border-gray-100 pb-6">
            <div>
              <h4 className="text-xl font-black text-[#1A1A1A] flex items-center gap-2">
                <Key className="w-6 h-6" /> Host Management Suite
              </h4>
              <p className="text-gray-500 text-sm mt-1 font-medium">Easily deploy listings, verify tenant documentations, and coordinate visits.</p>
            </div>
            <Link 
              href="/dashboard/owners/start_listing"
              className="bg-[#1A1A1A] text-white hover:bg-black px-6 py-3 rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-2 shrink-0 self-start sm:self-auto"
            >
              <PlusCircle className="w-4 h-4" /> Start Listing Wizard
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            {/* Quick Actions / Agreements */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Active Agreements</h3>
              </div>
              <div className="space-y-3">
                <div className="group flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-gray-100 transition cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
                      <Key className="w-4 h-4 text-[#1A1A1A]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#1A1A1A]">Skyline Pavilion Penthouse</h4>
                      <p className="text-xs text-gray-500 mt-0.5 font-medium">Tenant: John Doe • Active Lease</p>
                    </div>
                  </div>
                  <Link 
                    href="/dashboard/owners/agreement"
                    className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="group flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-gray-100 transition cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
                      <Key className="w-4 h-4 text-[#1A1A1A]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#1A1A1A]">Sunset Apartments Suite</h4>
                      <p className="text-xs text-gray-500 mt-0.5 font-medium">Tenant: Jane Smith • Processing</p>
                    </div>
                  </div>
                  <Link 
                    href="/dashboard/owners/agreement"
                    className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Verification Badge */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">KYC & Owner Status</h3>
              </div>
              <div className="flex items-center justify-between p-5 bg-[#1A1A1A] text-white rounded-2xl shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">Verified Stayzo Host</h4>
                    <p className="text-xs text-gray-400 mt-1">Credentials & Deeds Approved</p>
                  </div>
                </div>
                <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white text-[#1A1A1A] shadow-sm">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback / Host Rating */}
        <div className="col-span-1 md:col-span-4 bg-gray-50 border border-gray-200 rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row justify-between items-center gap-6 shadow-sm group">
          <div className="flex items-center gap-5 w-full sm:w-auto">
            <div className="w-14 h-14 rounded-2xl bg-white border border-gray-200 flex items-center justify-center shadow-sm shrink-0 group-hover:scale-105 transition">
              <Star className="w-6 h-6 text-[#1A1A1A]" />
            </div>
            <div>
              <h3 className="text-xl font-black text-[#1A1A1A]">Host Reputation</h3>
              <p className="text-gray-500 text-sm font-medium mt-1 max-w-lg">
                View reviews left by tenants, respond to property feedback, and maintain your premium host rating.
              </p>
            </div>
          </div>
          
          <Link 
            href="/dashboard/owners/listings"
            className="w-full sm:w-auto bg-white border border-gray-200 text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white rounded-xl px-8 py-3 text-sm font-bold transition shadow-sm text-center shrink-0"
          >
            Manage Reviews
          </Link>
        </div>

      </div>
    </div>
  );
}