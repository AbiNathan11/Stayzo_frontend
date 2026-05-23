"use client";

import React from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const handleLogout = () => {
    localStorage.removeItem('stayzo_token');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white font-sans selection:bg-[#1A1A1A] selection:text-white p-8">
      <div className="max-w-7xl mx-auto pt-4">
        <div className="flex justify-between items-center mb-16 border-b border-gray-800 pb-6">
          <Link href="/" className="text-4xl font-serif italic font-extrabold text-white hover:text-[#1A1A1A] transition">
            Stayzo. Admin
          </Link>
          <div className="flex space-x-6 items-center">
            <button onClick={handleLogout} className="text-gray-400 hover:text-white font-bold text-sm tracking-widest uppercase transition">
              Logout
            </button>
          </div>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-serif font-extrabold mb-10">Platform Overview</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 border border-gray-800 p-8 rounded-sm">
            <h3 className="text-gray-500 text-xs font-bold tracking-widest uppercase mb-2">Total Tenants</h3>
            <p className="text-4xl font-extrabold text-[#1A1A1A]">1,204</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 p-8 rounded-sm">
            <h3 className="text-gray-500 text-xs font-bold tracking-widest uppercase mb-2">Total Owners</h3>
            <p className="text-4xl font-extrabold text-[#1A1A1A]">342</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 p-8 rounded-sm">
            <h3 className="text-gray-500 text-xs font-bold tracking-widest uppercase mb-2">Active Listings</h3>
            <p className="text-4xl font-extrabold text-[#1A1A1A]">890</p>
          </div>
        </div>
      </div>
    </div>
  );
}

