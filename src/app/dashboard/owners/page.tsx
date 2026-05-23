"use client";

import React from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';

export default function OwnerDashboard() {
  return (
    <div className="min-h-screen bg-[#F0EFFA] flex flex-col font-sans">
      
      {/* ── Navbar ── */}
      <header className="w-full bg-[#F0EFFA] py-4 px-8 flex items-center justify-between border-b border-[#E0DFEF]">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          {/* Equalizer-style bars */}
          <div className="flex items-end space-x-[3px] h-5">
            <div className="w-[3px] h-3 bg-[#1A1A1A] rounded-full" />
            <div className="w-[3px] h-5 bg-[#1A1A1A] rounded-full" />
            <div className="w-[3px] h-4 bg-[#1A1A1A] rounded-full" />
            <div className="w-[3px] h-2.5 bg-[#1A1A1A] rounded-full" />
          </div>
          <span className="text-[#1A1A1A] font-bold text-lg tracking-tight uppercase">STAYZO</span>
        </Link>

        {/* Center Navigation */}
        <nav className="flex items-center space-x-8 text-sm font-normal text-[#1A1A1A]">
          <Link href="/" className="hover:opacity-70 transition-opacity">Home</Link>
          <Link href="/search" className="hover:opacity-70 transition-opacity">Listings</Link>
          <Link href="#" className="hover:opacity-70 transition-opacity">Appointments</Link>
          <Link href="#" className="hover:opacity-70 transition-opacity">Chat</Link>
          <Link href="#" className="hover:opacity-70 transition-opacity">Profile</Link>
        </nav>

        {/* Right Side — CTA + Bell */}
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/tenant"
            className="flex items-center space-x-2 bg-[#1A1A1A] text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-black transition-colors"
          >
            <span>I AM A TENANT</span>
            <span className="text-base">→</span>
          </Link>
          <button
            className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#E0DFEF] transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-[#1A1A1A]" />
          </button>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-5xl md:text-6xl font-bold text-[#1A1A1A] tracking-tight mb-5 uppercase">
          START YOUR LISTING
        </h1>

        <p className="text-[#4A4A6A] text-base md:text-lg max-w-md leading-relaxed mb-10">
          Join thousands of hosts worldwide and turn your property into a successful stay with Stayzo&apos;s
          premium management tools.
        </p>

        <div className="flex items-center space-x-4">
          {/* Primary CTA */}
          <button className="flex items-center space-x-2 bg-[#1A1A1A] text-white font-semibold text-sm px-8 py-3.5 rounded-full hover:bg-black transition-colors">
            <span>GET STARTED</span>
            <span className="text-base">→</span>
          </button>

          {/* Secondary CTA */}
          <button className="flex items-center justify-center border border-[#1A1A1A] text-[#1A1A1A] font-semibold text-sm px-8 py-3.5 rounded-full bg-transparent hover:bg-[#E0DFEF] transition-colors">
            LEARN MORE
          </button>
        </div>
      </main>

    </div>
  );
}
