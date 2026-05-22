"use client";

import React from 'react';
import Link from 'next/link';

export default function OwnerDashboard() {
  const handleLogout = () => {
    localStorage.removeItem('stayzo_token');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-[#FDF8F3] text-[#2D2D2D] font-sans selection:bg-[#1A1A1A] selection:text-white p-8">
      <div className="max-w-7xl mx-auto pt-4">
        <div className="flex justify-between items-center mb-16">
          <Link href="/" className="text-4xl font-serif italic font-extrabold text-[#1A1A1A] hover:opacity-80 transition">
            Stayzo.
          </Link>
          <div className="flex space-x-6 items-center">
            <Link href="/" className="text-gray-500 hover:text-[#1A1A1A] font-bold text-sm tracking-widest uppercase transition">
              Home
            </Link>
            <button onClick={handleLogout} className="bg-[#1A1A1A] text-white px-6 py-2 hover:bg-black font-bold text-sm tracking-widest uppercase transition shadow-md">
              Logout
            </button>
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-serif font-extrabold text-[#1A1A1A] mb-4">Owner Dashboard</h1>
        <p className="text-gray-600 text-[17px] font-medium mb-12 max-w-lg">Manage your listings, view tenant applications, and monitor your rental income in real-time.</p>

        <div className="bg-white p-10 shadow-xl max-w-3xl">
          <h2 className="text-2xl font-extrabold text-[#1A1A1A] mb-4">You have no listings yet</h2>
          <p className="text-gray-500 font-medium leading-relaxed mb-8">List your property today and gain access to thousands of verified tenants worldwide.</p>
          <button className="bg-[#1A1A1A] text-white px-8 py-4 font-bold text-sm tracking-widest uppercase transition shadow-md shadow-[#1A1A1A]/20 hover:bg-[#E05A16]">
            Create First Listing
          </button>
        </div>
      </div>
    </div>
  );
}

