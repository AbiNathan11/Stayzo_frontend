"use client";

import React, { useState, useEffect } from 'react';
import { Home, CalendarClock, Bell, FileSignature, ShieldCheck, Download, UploadCloud, Edit3, Camera, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function TenantOverviewPage() {
  const [user, setUser] = useState<{ firstName: string; lastName: string; email: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('stayzo_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({
          firstName: payload.firstName || 'Abiramy',
          lastName: payload.lastName || '',
          email: payload.email || 'abiramy@example.com'
        });
      } catch (e) {
        setUser({ firstName: 'Abiramy', lastName: '', email: 'abiramy@example.com' });
      }
    } else {
      setUser({ firstName: 'Abiramy', lastName: '', email: 'abiramy@example.com' });
    }
  }, []);

  const userInitial = user?.firstName?.charAt(0).toUpperCase() || 'A';

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Dashboard Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <h2 className="text-3xl font-extrabold tracking-tight text-[#1A1A1A]">Welcome back, {user?.firstName}</h2>
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tenant Portal</span>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Profile Card (Spans 1 column on desktop) */}
        <div className="col-span-1 md:col-span-1 bg-white text-[#1A1A1A] border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 opacity-50 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="flex flex-col items-center text-center space-y-4 relative z-10">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-100 text-[#1A1A1A] flex items-center justify-center text-4xl font-black shadow-sm">
                {userInitial}
              </div>
              <button className="absolute bottom-0 right-0 bg-[#1A1A1A] hover:bg-black text-white p-2 rounded-full shadow-md transition">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            
            <div>
              <h3 className="text-xl font-bold leading-tight">
                {user?.firstName} {user?.lastName}
              </h3>
              <p className="text-gray-500 text-xs font-semibold mt-1">{user?.email}</p>
            </div>

            <div className="w-full flex flex-col gap-2 mt-4">
              <button className="w-full flex items-center justify-center space-x-2 text-xs font-bold text-white bg-[#1A1A1A] hover:bg-black rounded-xl px-4 py-2.5 transition shadow-sm">
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
              <button className="w-full flex items-center justify-center space-x-2 text-xs font-bold text-[#1A1A1A] bg-gray-50 border border-gray-200 hover:bg-gray-100 rounded-xl px-4 py-2.5 transition">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verify Identity</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview (Spans 3 columns) */}
        <div className="col-span-1 md:col-span-3 bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-center">
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">Activity Overview</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
            
            {/* Stat 1 */}
            <div className="flex items-center gap-5 sm:px-4 first:px-0 pt-4 sm:pt-0 first:pt-0 group cursor-pointer">
              <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center group-hover:scale-110 transition duration-300">
                <Home className="w-6 h-6 text-[#1A1A1A]" />
              </div>
              <div>
                <h3 className="text-4xl font-black text-[#1A1A1A] leading-none mb-1">1</h3>
                <p className="text-xs font-bold text-gray-500 uppercase">Active Booking</p>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="flex items-center gap-5 sm:px-6 pt-4 sm:pt-0 group cursor-pointer">
              <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center group-hover:scale-110 transition duration-300">
                <CalendarClock className="w-6 h-6 text-[#1A1A1A]" />
              </div>
              <div>
                <h3 className="text-4xl font-black text-[#1A1A1A] leading-none mb-1">2</h3>
                <p className="text-xs font-bold text-gray-500 uppercase">Pending Visits</p>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex items-center gap-5 sm:px-6 pt-4 sm:pt-0 group cursor-pointer">
              <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center group-hover:scale-110 transition duration-300">
                <Bell className="w-6 h-6 text-[#1A1A1A]" />
              </div>
              <div>
                <h3 className="text-4xl font-black text-[#1A1A1A] leading-none mb-1">3</h3>
                <p className="text-xs font-bold text-gray-500 uppercase">Unread Msg</p>
              </div>
            </div>

          </div>
        </div>

        {/* Digital Document Vault (Spans full width - 4 cols) */}
        <div className="col-span-1 md:col-span-4 bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 border-b border-gray-100 pb-6">
            <div>
              <h4 className="text-xl font-black text-[#1A1A1A] flex items-center gap-2">
                <ShieldCheck className="w-6 h-6" /> Digital Document Vault
              </h4>
              <p className="text-gray-500 text-sm mt-1 font-medium">Securely manage your legal agreements and verified KYC files.</p>
            </div>
            <button className="bg-[#1A1A1A] text-white hover:bg-black px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-2 shrink-0">
              <UploadCloud className="w-4 h-4" /> Upload New
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            {/* Signed Agreements */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Agreements</h3>
              </div>
              <div className="space-y-3">
                <div className="group flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-gray-100 transition cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
                      <FileSignature className="w-4 h-4 text-[#1A1A1A]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#1A1A1A]">Villa Tropical Cana Lease</h4>
                      <p className="text-xs text-gray-500 mt-0.5 font-medium">Signed: Oct 1, 2026</p>
                    </div>
                  </div>
                  <button className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition">
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="group flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-gray-100 transition cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
                      <FileSignature className="w-4 h-4 text-[#1A1A1A]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#1A1A1A]">Colombo Heights Agreement</h4>
                      <p className="text-xs text-gray-500 mt-0.5 font-medium">Signed: Jan 15, 2024</p>
                    </div>
                  </div>
                  <button className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition">
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Verified KYC */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Identity (KYC)</h3>
              </div>
              <div className="flex items-center justify-between p-5 bg-[#1A1A1A] text-white rounded-2xl shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">National ID Card (NIC)</h4>
                    <p className="text-xs text-gray-400 mt-1">Verified & Secure</p>
                  </div>
                </div>
                <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white text-[#1A1A1A] shadow-sm">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* My Reviews (Spans full width - 4 cols) */}
        <div className="col-span-1 md:col-span-4 bg-gray-50 border border-gray-200 rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row justify-between items-center gap-6 shadow-sm group">
          <div className="flex items-center gap-5 w-full sm:w-auto">
            <div className="w-14 h-14 rounded-2xl bg-white border border-gray-200 flex items-center justify-center shadow-sm shrink-0 group-hover:scale-105 transition">
              <Star className="w-6 h-6 text-[#1A1A1A]" />
            </div>
            <div>
              <h3 className="text-xl font-black text-[#1A1A1A]">My Reviews</h3>
              <p className="text-gray-500 text-sm font-medium mt-1 max-w-lg">
                View feedback from landlords and property managers, and track the reviews you have left for previous stays.
              </p>
            </div>
          </div>
          
          <button className="w-full sm:w-auto bg-white border border-gray-200 text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white rounded-xl px-8 py-3 text-sm font-bold transition shadow-sm shrink-0">
            Open Reviews
          </button>
        </div>

      </div>
    </div>
  );
}
