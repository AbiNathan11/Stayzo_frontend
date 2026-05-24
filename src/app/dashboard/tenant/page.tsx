"use client";

import React, { useState, useEffect } from 'react';
import { Home, CalendarClock, Bell, MessageSquare, FileSignature, ShieldCheck, Download, UploadCloud, Edit3, Camera, Star } from 'lucide-react';
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
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-[#1A1A1A]">Dashboard Overview</h2>
      </div>

      {/* Bento Grid Layout (Strictly Black & White Theme) */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
        
        {/* 1. Profile Details & Photo (Spans 2 columns) */}
        <div className="col-span-1 md:col-span-2 bg-white border border-gray-200 rounded-3xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-sm hover:shadow-md transition">
          {/* Profile Photo Area */}
          <div className="relative group shrink-0">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-100 text-[#1A1A1A] border-4 border-white shadow-sm flex items-center justify-center text-4xl sm:text-5xl font-bold overflow-hidden">
              {userInitial}
            </div>
            <button className="absolute bottom-0 right-0 sm:bottom-2 sm:right-2 bg-[#1A1A1A] hover:bg-black text-white p-2 rounded-full shadow-md transition">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          
          {/* Profile Details Area */}
          <div className="flex-1 w-full text-center sm:text-left space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-[#1A1A1A] leading-tight">
                {user?.firstName} {user?.lastName}
              </h3>
              <p className="text-gray-500 text-sm font-semibold mt-1">{user?.email}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="flex-1 flex items-center justify-center space-x-2 text-sm font-bold text-white bg-[#1A1A1A] hover:bg-black rounded-xl px-4 py-2.5 transition">
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
              <button className="flex-1 flex items-center justify-center space-x-2 text-sm font-bold text-[#1A1A1A] bg-gray-50 border border-gray-200 hover:bg-gray-100 rounded-xl px-4 py-2.5 transition">
                <ShieldCheck className="w-4 h-4" />
                <span>Verify Identity</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. My Reviews (Spans 1 or 2 columns) */}
        <div className="col-span-1 md:col-span-1 xl:col-span-2 bg-[#1A1A1A] text-white rounded-3xl p-6 flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 fill-white text-white" />
              <h3 className="text-lg font-bold">My Reviews</h3>
            </div>
            <p className="text-gray-400 text-xs font-semibold leading-relaxed">
              Read what landlords and property managers have said about you, and manage reviews you've written.
            </p>
          </div>
          
          <div className="mt-6 flex gap-3">
            <button className="flex-1 bg-white text-[#1A1A1A] hover:bg-gray-100 rounded-xl py-2.5 text-xs font-bold transition shadow-sm">
              View All
            </button>
          </div>
        </div>

        {/* 3. Analytics Cards (Span 1 column each) */}
        <div className="col-span-1 bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-6">
            <Home className="w-6 h-6 text-[#1A1A1A]" />
          </div>
          <div>
            <h3 className="text-4xl font-black text-[#1A1A1A] mb-1">1</h3>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Booking</p>
          </div>
        </div>

        <div className="col-span-1 bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-6">
            <CalendarClock className="w-6 h-6 text-[#1A1A1A]" />
          </div>
          <div>
            <h3 className="text-4xl font-black text-[#1A1A1A] mb-1">2</h3>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pending Visits</p>
          </div>
        </div>

        <div className="col-span-1 bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-6">
            <Bell className="w-6 h-6 text-[#1A1A1A]" />
          </div>
          <div>
            <h3 className="text-4xl font-black text-[#1A1A1A] mb-1">3</h3>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Unread Messages</p>
          </div>
        </div>

        {/* 4. Digital Document Vault (Spans full width) */}
        <div className="col-span-1 md:col-span-3 xl:col-span-4 bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h4 className="text-xl font-bold text-[#1A1A1A]">Digital Document Vault</h4>
              <p className="text-gray-500 text-sm mt-1">Manage legal agreements and verified KYC documents.</p>
            </div>
            <button className="bg-[#1A1A1A] text-white hover:bg-black px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-2">
              <UploadCloud className="w-4 h-4" /> Upload Document
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Signed Agreements */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 hover:shadow-sm transition">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                  <FileSignature className="w-4 h-4 text-[#1A1A1A]" />
                </div>
                <h3 className="text-sm font-bold text-[#1A1A1A]">Signed Agreements</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition cursor-pointer">
                  <div>
                    <h4 className="text-xs font-bold text-[#1A1A1A]">Villa Tropical Cana Lease</h4>
                    <p className="text-[10px] text-gray-500 mt-0.5 font-medium">Oct 1, 2026</p>
                  </div>
                  <Download className="w-4 h-4 text-[#1A1A1A] hover:text-gray-600" />
                </div>
                <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition cursor-pointer">
                  <div>
                    <h4 className="text-xs font-bold text-[#1A1A1A]">Colombo Heights Agreement</h4>
                    <p className="text-[10px] text-gray-500 mt-0.5 font-medium">Jan 15, 2024</p>
                  </div>
                  <Download className="w-4 h-4 text-[#1A1A1A] hover:text-gray-600" />
                </div>
              </div>
            </div>

            {/* Verified KYC */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 hover:shadow-sm transition">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                  <ShieldCheck className="w-4 h-4 text-[#1A1A1A]" />
                </div>
                <h3 className="text-sm font-bold text-[#1A1A1A]">Verified KYC</h3>
              </div>
              <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#1A1A1A]" />
                  <div>
                    <h4 className="text-xs font-bold text-[#1A1A1A]">National ID Card (NIC)</h4>
                    <p className="text-[10px] text-gray-500 mt-0.5">Verified & Secure</p>
                  </div>
                </div>
                <span className="bg-[#1A1A1A] text-white px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider shadow-sm">Verified</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
