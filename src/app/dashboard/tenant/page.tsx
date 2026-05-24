"use client";

import React, { useState, useEffect } from 'react';
import { Home, CalendarClock, Bell, MessageSquare, FileSignature, ShieldCheck, Download, UploadCloud } from 'lucide-react';
import Link from 'next/link';

export default function TenantOverviewPage() {
  const [user, setUser] = useState<{ firstName: string; lastName: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('stayzo_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({
          firstName: payload.firstName || 'Abiramy',
          lastName: payload.lastName || ''
        });
      } catch (e) {
        setUser({ firstName: 'Abiramy', lastName: '' });
      }
    } else {
      setUser({ firstName: 'Abiramy', lastName: '' });
    }
  }, []);

  const userInitial = user?.firstName?.charAt(0).toUpperCase() || 'A';

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      
      {/* Title & Edit Button */}
      <div className="flex items-center space-x-4">
        <h2 className="text-3xl font-semibold tracking-tight text-gray-900">About me</h2>
        <button className="text-sm font-semibold text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg px-4 py-1.5 transition cursor-pointer select-none">
          Edit
        </button>
      </div>

      <div className="flex flex-col lg:flex-row items-start gap-12">
        
        {/* Giant Avatar Card (Left side of content area) */}
        <div className="w-full lg:w-[320px] bg-white border border-gray-100 shadow-[0_6px_16px_rgba(0,0,0,0.12)] rounded-3xl p-10 flex flex-col items-center text-center shrink-0">
          <div className="w-[104px] h-[104px] rounded-full bg-gray-100 text-gray-800 flex items-center justify-center text-[40px] font-semibold mb-4">
            {userInitial}
          </div>
          <h3 className="text-[32px] font-semibold text-gray-900 leading-tight">
            {user?.firstName}
          </h3>
          <p className="text-gray-500 text-sm font-semibold mt-1">Tenant</p>
        </div>

        {/* Complete Profile & Stats (Right side of content area) */}
        <div className="flex-1 space-y-10">
          
          <div className="space-y-4 max-w-md">
            <h4 className="text-xl font-semibold text-gray-900">Complete your profile</h4>
            <p className="text-gray-500 text-sm leading-relaxed">
              Your Stayzo profile is an important part of every reservation. Complete yours to help landlords and other guests get to know you.
            </p>
            <button className="bg-[#1A1A1A] hover:bg-black text-white px-6 py-3.5 rounded-lg text-sm font-semibold transition active:scale-95 mt-2">
              Get started
            </button>
          </div>

          <div className="border-t border-gray-200 pt-10">
            <h4 className="text-xl font-semibold text-gray-900 mb-6">Tenant Analytics</h4>
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-4 border border-gray-100">
                  <Home className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Active Bookings</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">1</h3>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-4 border border-gray-100">
                  <CalendarClock className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Pending Visits</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">2</h3>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-4 border border-gray-100">
                  <Bell className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Unread Messages</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">3</h3>
                </div>
              </div>

            </div>
          </div>

          <div className="border-t border-gray-200 pt-10">
            <h4 className="text-xl font-semibold text-gray-900 mb-6">Digital Document Vault</h4>
            <p className="text-gray-500 text-sm mb-6">Securely manage your legal agreements and verified KYC identity documents.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Signed Agreements */}
              <section className="bg-white border border-gray-200 rounded-3xl p-6 hover:shadow-md transition">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                    <FileSignature className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">My Signed Agreements</h3>
                    <p className="text-[10px] font-bold text-gray-400">E-signed rental contracts</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-150">
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">Villa Tropical Cana Lease</h4>
                      <p className="text-[10px] font-semibold text-gray-500 mt-0.5">Signed on Oct 1, 2026</p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 transition p-2 bg-white rounded-lg shadow-sm border border-gray-200">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-150">
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">Colombo Heights Agreement</h4>
                      <p className="text-[10px] font-semibold text-gray-500 mt-0.5">Signed on Jan 15, 2024</p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 transition p-2 bg-white rounded-lg shadow-sm border border-gray-200">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </section>

              {/* Verified KYC */}
              <section className="bg-white border border-gray-200 rounded-3xl p-6 hover:shadow-md transition">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center border border-green-100">
                    <ShieldCheck className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Verified KYC</h3>
                    <p className="text-[10px] font-bold text-gray-400">Identity verification status</p>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-green-500" />
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">National ID Card (NIC)</h4>
                      <p className="text-[10px] font-semibold text-gray-500 mt-0.5">Verified & Watermarked securely</p>
                    </div>
                  </div>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-[9px] font-bold uppercase">Verified</span>
                </div>

                <button className="w-full border-2 border-dashed border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition rounded-2xl p-4 flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-gray-900">
                  <UploadCloud className="w-6 h-6" />
                  <span className="text-xs font-bold">Upload New Document</span>
                  <span className="text-[9px] font-semibold text-gray-400">JPG, PNG or PDF (Max 5MB)</span>
                </button>
              </section>
            </div>
          </div>
        </div>

      </div>

      {/* Reviews Button Link Card */}
      <div className="pt-4">
        <button className="flex items-center space-x-3 text-sm font-semibold text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-xl px-5 py-4 transition select-none">
          <MessageSquare className="w-5 h-5 text-gray-600" />
          <span>Reviews I've written</span>
        </button>
      </div>

    </div>
  );
}
