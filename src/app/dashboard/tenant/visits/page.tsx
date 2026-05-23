"use client";

import React, { useState } from 'react';
import { Calendar, Clock, MapPin, CheckCircle2, XCircle, Clock4 } from 'lucide-react';

export default function VisitsPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'pending'>('upcoming');

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Visit Scheduler</h2>
        <p className="text-gray-500 text-xs font-semibold mt-1">Manage physical property walkthroughs and viewings.</p>
      </div>

      <div className="flex items-center space-x-2 border-b border-gray-150 pb-2">
        <button 
          onClick={() => setActiveTab('upcoming')}
          className={`text-xs font-extrabold px-4 py-2 rounded-lg transition ${activeTab === 'upcoming' ? 'bg-[#1A1A1A] text-white' : 'text-gray-500 hover:bg-gray-100'}`}
        >
          Upcoming Visits
        </button>
        <button 
          onClick={() => setActiveTab('pending')}
          className={`text-xs font-extrabold px-4 py-2 rounded-lg transition ${activeTab === 'pending' ? 'bg-[#1A1A1A] text-white' : 'text-gray-500 hover:bg-gray-100'}`}
        >
          Pending Approvals
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {activeTab === 'upcoming' && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-2 h-full bg-[#1A1A1A]"></div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-green-600 bg-green-50 px-2.5 py-1 rounded-lg w-fit mb-2">
                  <CheckCircle2 className="w-3 h-3" /> Confirmed
                </span>
                <h3 className="text-lg font-extrabold text-gray-900">Colombo Heights Apartment</h3>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-xs font-bold text-gray-700">
                <Calendar className="w-4 h-4 text-[#1A1A1A]" />
                <span>Tomorrow, Oct 24, 2026</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-gray-700">
                <Clock className="w-4 h-4 text-[#1A1A1A]" />
                <span>10:00 AM - 10:30 AM</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-gray-700">
                <MapPin className="w-4 h-4 text-[#1A1A1A]" />
                <span>Unit 4B, 12th Lane, Colombo 03</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 py-2.5 rounded-xl text-xs font-extrabold shadow-sm transition">
                Reschedule
              </button>
              <button className="flex-1 bg-white border border-red-100 hover:bg-red-50 text-red-600 py-2.5 rounded-xl text-xs font-extrabold shadow-sm transition">
                Cancel
              </button>
            </div>
          </div>
        )}

        {activeTab === 'pending' && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm relative overflow-hidden group opacity-80">
            <div className="absolute top-0 right-0 w-2 h-full bg-[#F26B27]"></div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#F26B27] bg-[#FFF8F3] px-2.5 py-1 rounded-lg w-fit mb-2">
                  <Clock4 className="w-3 h-3" /> Awaiting Owner
                </span>
                <h3 className="text-lg font-extrabold text-gray-900">Kandy Lakeview Villa</h3>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-xs font-bold text-gray-700">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>Saturday, Oct 28, 2026</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-gray-700">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>2:00 PM - 3:00 PM</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="w-full bg-white border border-red-100 hover:bg-red-50 text-red-600 py-2.5 rounded-xl text-xs font-extrabold shadow-sm transition flex items-center justify-center gap-2">
                <XCircle className="w-4 h-4" /> Withdraw Request
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
