"use client";

import React from 'react';
import { KeyRound, Download, FileText, User } from 'lucide-react';

export default function BookingsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">My Bookings / Stays</h2>
        <p className="text-gray-500 text-xs font-semibold mt-1">
          Manage your current rental property and view past booking history.
        </p>
      </div>

      {/* Current Stay Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Current Stay</h3>
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3 h-48 bg-gray-100 rounded-2xl overflow-hidden shrink-0">
            <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Current Stay" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider">Active</span>
                <span className="text-sm font-extrabold text-gray-900">Rent Due: <span className="text-[#F26B27]">5th of Month</span></span>
              </div>
              <h4 className="text-xl font-extrabold text-gray-900 mb-1">Villa Tropical Cana</h4>
              <p className="text-xs font-semibold text-gray-500 mb-4">540 Belle Gate Pl, Cary, NC</p>
              
              <div className="flex items-center space-x-2 text-xs font-bold text-gray-700 bg-gray-50 px-3 py-2 rounded-xl w-fit">
                <User className="w-4 h-4 text-gray-400" />
                <span>Owner: Nimal Bandara (+94 77 123 4567)</span>
              </div>
            </div>
            
            <div className="mt-4 flex gap-3">
              <button className="flex-1 bg-[#1A1A1A] hover:bg-black text-white py-2.5 rounded-xl text-xs font-extrabold shadow-sm transition">
                Pay Rent
              </button>
              <button className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 py-2.5 rounded-xl text-xs font-extrabold shadow-sm transition flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" /> Contract
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Booking History */}
      <section className="space-y-4 pt-6">
        <h3 className="text-lg font-bold text-gray-900">Booking History</h3>
        <div className="bg-white border border-gray-150 rounded-3xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-150 text-xs text-gray-500 font-extrabold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Property</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Rent/Mo</th>
                <th className="px-6 py-4 text-right">Receipts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150 font-semibold text-gray-700 text-xs">
              <tr>
                <td className="px-6 py-4 font-bold text-gray-900">Colombo Heights Apt 4B</td>
                <td className="px-6 py-4">Jan 2024 - Dec 2024</td>
                <td className="px-6 py-4">$1,200</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 hover:text-blue-800 flex items-center justify-end gap-1 ml-auto">
                    <Download className="w-3.5 h-3.5" /> PDF
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}
