"use client";

import React, { useState, useEffect } from 'react';
import { Home, CalendarClock, Bell, AlertCircle, ArrowRight } from 'lucide-react';
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

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Welcome Header */}
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Welcome back, {user?.firstName}
        </h2>
        <p className="text-gray-500 text-xs font-semibold mt-1">
          Here is what's happening with your stays and requests today.
        </p>
      </div>

      {/* Next Action Reminder (Alert) */}
      <div className="bg-[#FFF8F3] border border-[#F26B27]/30 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-[#F26B27] shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-extrabold text-[#1A1A1A]">Next Action Reminder</h4>
            <p className="text-xs font-semibold text-[#F26B27]">Ungaloda adutha physical visit naalaiku 10 AM-ku irukku (Kandy Lakeview Villa).</p>
          </div>
        </div>
        <Link href="/dashboard/tenant/visits" className="bg-[#F26B27] hover:bg-[#D95A1E] text-white px-4 py-2 rounded-xl text-xs font-extrabold shadow-sm transition shrink-0 whitespace-nowrap">
          View Details
        </Link>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-4 border border-gray-100">
            <Home className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider font-extrabold text-gray-400">Active Bookings</p>
            <h3 className="text-3xl font-black text-gray-900 mt-1">1</h3>
          </div>
        </div>

        <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-4 border border-gray-100">
            <CalendarClock className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider font-extrabold text-gray-400">Pending Visits</p>
            <h3 className="text-3xl font-black text-gray-900 mt-1">2</h3>
          </div>
        </div>

        <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-4 border border-gray-100">
            <Bell className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider font-extrabold text-gray-400">Unread Messages</p>
            <h3 className="text-3xl font-black text-gray-900 mt-1">3</h3>
          </div>
        </div>

      </div>

      {/* Recent Activity or Quick Links */}
      <div className="bg-gray-50 rounded-3xl p-8 border border-gray-150 mt-8">
        <h3 className="text-lg font-extrabold text-gray-900 mb-4">Quick Links</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/dashboard/tenant/services" className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition group">
            <div>
              <h4 className="font-bold text-sm text-gray-900">Order Boarding Food</h4>
              <p className="text-xs text-gray-500 font-medium">Subscribe to daily tiffin services</p>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#1A1A1A] transition-colors" />
          </Link>
          <Link href="/dashboard/tenant/documents" className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition group">
            <div>
              <h4 className="font-bold text-sm text-gray-900">Sign Agreements</h4>
              <p className="text-xs text-gray-500 font-medium">Review pending legal documents</p>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#1A1A1A] transition-colors" />
          </Link>
        </div>
      </div>

    </div>
  );
}
