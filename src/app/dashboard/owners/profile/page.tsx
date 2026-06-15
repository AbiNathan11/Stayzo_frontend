"use client";

import React, { useState, useEffect } from 'react';
import { Home, CalendarClock, Bell, ShieldCheck, UploadCloud, Edit3, Star, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function OwnerProfilePage() {
  const [user, setUser] = useState<{ firstName: string; lastName: string; email: string } | null>({
    firstName: 'Vish',
    lastName: '',
    email: 'vish@example.com'
  });

  const [activeReviewTab, setActiveReviewTab] = useState<'pending' | 'submitted'>('pending');
  const [pendingReviews, setPendingReviews] = useState([
    {
      id: 1,
      propertyTitle: "Colombo Heights Apartment",
      landlordName: "Nimal Bandara",
      stayDates: "Stayed Jan 2024",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 2,
      propertyTitle: "Villa in Galle",
      landlordName: "Saman Perera",
      stayDates: "Stayed Oct 2026",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    }
  ]);
  
  const [submittedReviews, setSubmittedReviews] = useState([
    {
      id: 101,
      propertyTitle: "Villa in Hapugala",
      landlordName: "Saman Perera",
      rating: 5,
      comment: "Absolutely magnificent property and incredibly helpful hosting from Saman.",
      date: "Reviewed May 15, 2026",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    }
  ]);

  useEffect(() => {
    const token = sessionStorage.getItem('stayzo_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({
          firstName: payload.firstName || 'Vish',
          lastName: payload.lastName || '',
          email: payload.email || 'vish@example.com'
        });
      } catch (e) {
        // Fallback
      }
    }
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Dashboard Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <h2 className="text-3xl font-extrabold tracking-tight text-[#1A1A1A]">Welcome back, {user?.firstName}</h2>
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tenant Portal</span>
      </div>

      {/* Activity Stats Redesign - Full Width Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: Active Listings */}
        <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-xs hover:shadow-md hover:translate-y-[-2px] transition-all duration-300 flex items-center justify-between group cursor-pointer relative overflow-hidden">
          <div className="absolute top-0 right-0 w-22 h-22 bg-[#EEF2FF] opacity-35 rounded-full blur-xl transform translate-x-4 -translate-y-4 transition-transform group-hover:scale-125"></div>
          <div className="flex items-center gap-4.5">
            <div className="w-[50px] h-[50px] rounded-2xl bg-[#EEF2FF] flex items-center justify-center text-[#4F46E5] group-hover:scale-110 transition duration-300 shrink-0">
              <Home className="w-[22px] h-[22px]" />
            </div>
            <div className="ml-4">
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Active Listings</p>
              <h3 className="text-2xl font-black text-gray-900 mt-0.5 leading-none">1</h3>
            </div>
          </div>
          <ArrowRight className="w-4.5 h-4.5 text-gray-300 group-hover:text-[#4F46E5] transition-all duration-300 transform group-hover:translate-x-1" />
        </div>

        {/* Card 2: Pending Visits */}
        <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-xs hover:shadow-md hover:translate-y-[-2px] transition-all duration-300 flex items-center justify-between group cursor-pointer relative overflow-hidden">
          <div className="absolute top-0 right-0 w-22 h-22 bg-[#ECFDF5] opacity-45 rounded-full blur-xl transform translate-x-4 -translate-y-4 transition-transform group-hover:scale-125"></div>
          <div className="flex items-center gap-4.5">
            <div className="w-[50px] h-[50px] rounded-2xl bg-[#ECFDF5] flex items-center justify-center text-[#10B981] group-hover:scale-110 transition duration-300 shrink-0">
              <CalendarClock className="w-[22px] h-[22px]" />
            </div>
            <div className="ml-4">
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Pending Visits</p>
              <h3 className="text-2xl font-black text-gray-900 mt-0.5 leading-none">2</h3>
            </div>
          </div>
          <ArrowRight className="w-4.5 h-4.5 text-gray-300 group-hover:text-[#10B981] transition-all duration-300 transform group-hover:translate-x-1" />
        </div>

        {/* Card 3: Unread Messages */}
        <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-xs hover:shadow-md hover:translate-y-[-2px] transition-all duration-300 flex items-center justify-between group cursor-pointer relative overflow-hidden">
          <div className="absolute top-0 right-0 w-22 h-22 bg-[#FFFBEB] opacity-55 rounded-full blur-xl transform translate-x-4 -translate-y-4 transition-transform group-hover:scale-125"></div>
          <div className="flex items-center gap-4.5">
            <div className="w-[50px] h-[50px] rounded-2xl bg-[#FFFBEB] flex items-center justify-center text-[#F59E0B] group-hover:scale-110 transition duration-300 shrink-0">
              <Bell className="w-[22px] h-[22px]" />
            </div>
            <div className="ml-4">
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Unread Msg</p>
              <h3 className="text-2xl font-black text-gray-900 mt-0.5 leading-none">3</h3>
            </div>
          </div>
          <ArrowRight className="w-4.5 h-4.5 text-gray-300 group-hover:text-[#F59E0B] transition-all duration-300 transform group-hover:translate-x-1" />
        </div>

      </div>

      {/* Main Grid Layout - split equally for Document Vault and My Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Digital Document Vault */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 border-b border-gray-100 pb-6">
              <div>
                <h4 className="text-xl font-black text-[#1A1A1A] flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6" /> Digital Document Vault
                </h4>
                <p className="text-gray-500 text-xs mt-1 font-semibold">Securely manage your agreements and KYC files.</p>
              </div>
              <button className="bg-[#EEF2FF] text-[#4F46E5] hover:bg-[#E0E7FF] px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition duration-200 flex items-center gap-2 shrink-0">
                <UploadCloud className="w-4 h-4" /> Upload New
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {/* Signed Agreements */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Agreements</h3>
                </div>
                <div className="space-y-3">
                  <p className="text-xs text-gray-400 font-semibold italic">No tenancy agreements assigned to your email.</p>
                </div>
              </div>

              {/* Verified KYC */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Identity (KYC)</h3>
                </div>
                <div className="flex items-center justify-between p-5 bg-[#EEF2FF] text-[#1A1A1A] rounded-2xl border border-indigo-100/70 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#4F46E5]/5 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-full bg-[#4F46E5]/10 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-6 h-6 text-[#4F46E5]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-[#1A1A1A]">National ID Card (NIC)</h4>
                      <p className="text-xs text-gray-500 mt-1 font-semibold">Verified & Secure</p>
                    </div>
                  </div>
                  <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white text-[#4F46E5] border border-indigo-100 shadow-sm hover:scale-105 transition cursor-pointer">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* My Reviews */}
        <div className="bg-[#F8FAFB] border border-gray-200 rounded-3xl p-6 md:p-8 flex flex-col justify-between gap-6 shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-xs">
                  <Star className="w-5 h-5 text-[#1A1A1A]" />
                </div>
                <h3 className="text-lg font-black text-[#1A1A1A]">My Reviews</h3>
              </div>

              {/* Mini Tab Switcher */}
              <div className="flex bg-[#EEF2FF] p-0.5 rounded-lg shrink-0">
                <button
                  onClick={() => setActiveReviewTab('pending')}
                  className={`px-3 py-1.5 rounded-md text-[10px] font-extrabold transition ${
                    activeReviewTab === 'pending'
                      ? 'bg-white text-[#4F46E5] shadow-xs'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Pending ({pendingReviews.length})
                </button>
                <button
                  onClick={() => setActiveReviewTab('submitted')}
                  className={`px-3 py-1.5 rounded-md text-[10px] font-extrabold transition ${
                    activeReviewTab === 'submitted'
                      ? 'bg-white text-[#4F46E5] shadow-xs'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Submitted ({submittedReviews.length})
                </button>
              </div>
            </div>

            {/* Tab content */}
            <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
              {activeReviewTab === 'pending' ? (
                pendingReviews.map((item) => (
                  <div key={item.id} className="bg-white border border-gray-200/80 rounded-2xl p-4 flex gap-4 hover:border-gray-300 transition duration-200">
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gray-50">
                      <img src={item.image} alt={item.propertyTitle} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-extrabold text-xs text-[#1A1A1A] truncate">{item.propertyTitle}</h4>
                        <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Host: {item.landlordName}</p>
                      </div>
                      <button
                        className="w-max bg-[#EEF2FF] text-[#4F46E5] hover:bg-[#E0E7FF] px-3 py-1.5 rounded-lg text-[10px] font-extrabold transition flex items-center gap-1 shadow-xs"
                      >
                        <Edit3 className="w-3 h-3" /> Write Review
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                submittedReviews.map((item) => (
                  <div key={item.id} className="bg-white border border-gray-200/80 rounded-2xl p-4 space-y-3 hover:border-gray-300 transition duration-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                         <img src={item.image} alt={item.propertyTitle} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-xs text-[#1A1A1A] truncate">{item.propertyTitle}</h4>
                        <div className="flex items-center gap-0.5 mt-0.5">
                          {Array.from({ length: 5 }, (_, idx) => (
                            <Star 
                              key={idx} 
                              className={`w-3 h-3 ${
                                idx < item.rating 
                                  ? "fill-amber-400 text-amber-400" 
                                  : "text-gray-300"
                                }`} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-[11px] font-semibold text-gray-600 italic bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                      "{item.comment}"
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
