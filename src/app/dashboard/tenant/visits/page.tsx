"use client";

import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, CheckCircle2, XCircle, Clock4, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

export default function VisitsPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'pending'>('upcoming');

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dates = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Visit Scheduler</h2>
          <p className="text-gray-500 text-xs font-semibold mt-1">Manage physical property walkthroughs and viewings with a calendar view.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-black text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition">
          <Plus className="w-4 h-4" /> Request New Visit
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Calendar View */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-[#1A1A1A]">October 2026</h3>
            <div className="flex items-center space-x-2">
              <button className="p-2 border border-gray-200 hover:bg-gray-50 rounded-xl transition"><ChevronLeft className="w-4 h-4" /></button>
              <button className="p-2 border border-gray-200 hover:bg-gray-50 rounded-xl transition"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-2 md:gap-4 mb-2">
            {days.map(day => (
              <div key={day} className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider">{day}</div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-2 md:gap-4">
            {/* Empty slots for start of month */}
            <div className="aspect-square"></div>
            <div className="aspect-square"></div>
            <div className="aspect-square"></div>
            <div className="aspect-square"></div>
            
            {dates.map((date) => {
              const hasVisit = date === 24 || date === 28;
              const isConfirmed = date === 24;
              return (
                <div key={date} className={`aspect-square flex flex-col items-center justify-center rounded-2xl border transition cursor-pointer ${
                  hasVisit 
                    ? isConfirmed ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white' : 'bg-gray-100 border-gray-300 text-[#1A1A1A]'
                    : 'border-transparent hover:bg-gray-50 text-gray-700 font-semibold'
                }`}>
                  <span className="text-sm font-bold">{date}</span>
                  {hasVisit && (
                    <div className={`w-1.5 h-1.5 rounded-full mt-1 ${isConfirmed ? 'bg-white' : 'bg-[#1A1A1A]'}`}></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Agenda & Selected Date */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex items-center space-x-2 border-b border-gray-200 pb-2">
            <button 
              onClick={() => setActiveTab('upcoming')}
              className={`text-xs font-bold px-4 py-2 rounded-xl transition ${activeTab === 'upcoming' ? 'bg-[#1A1A1A] text-white' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              Upcoming
            </button>
            <button 
              onClick={() => setActiveTab('pending')}
              className={`text-xs font-bold px-4 py-2 rounded-xl transition ${activeTab === 'pending' ? 'bg-[#1A1A1A] text-white' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              Pending
            </button>
          </div>

          {activeTab === 'upcoming' && (
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-2 h-full bg-[#1A1A1A]"></div>
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A] bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-lg w-fit mb-4">
                <CheckCircle2 className="w-3 h-3" /> Confirmed
              </span>
              <h3 className="text-base font-bold text-[#1A1A1A] mb-4 leading-tight">Colombo Heights Apartment</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-xs font-semibold text-gray-600">
                  <CalendarIcon className="w-4 h-4 text-[#1A1A1A]" />
                  <span>Tomorrow, Oct 24</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold text-gray-600">
                  <Clock className="w-4 h-4 text-[#1A1A1A]" />
                  <span>10:00 AM - 10:30 AM</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold text-gray-600">
                  <MapPin className="w-4 h-4 text-[#1A1A1A]" />
                  <span>Unit 4B, 12th Lane, Colombo 03</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button className="w-full bg-[#1A1A1A] hover:bg-black text-white py-2.5 rounded-xl text-xs font-bold shadow-sm transition">
                  Reschedule
                </button>
                <button className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 py-2.5 rounded-xl text-xs font-bold transition">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {activeTab === 'pending' && (
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-2 h-full bg-gray-300"></div>
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-600 bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-lg w-fit mb-4">
                <Clock4 className="w-3 h-3" /> Awaiting Owner
              </span>
              <h3 className="text-base font-bold text-[#1A1A1A] mb-4 leading-tight">Kandy Lakeview Villa</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-xs font-semibold text-gray-500">
                  <CalendarIcon className="w-4 h-4 text-gray-400" />
                  <span>Saturday, Oct 28</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold text-gray-500">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>2:00 PM - 3:00 PM</span>
                </div>
              </div>

              <button className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2">
                <XCircle className="w-4 h-4" /> Withdraw Request
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
