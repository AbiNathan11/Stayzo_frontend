"use client";

import React, { useState } from 'react';
import { FileText, FileBarChart2, Users, Globe, TrendingUp, TrendingDown, Search, Trash2 } from 'lucide-react';

interface Listing {
  id: number;
  name: string;
  ownerName: string;
  ownerEmail: string;
  price: number;
  category: 'Rent' | 'Selling';
  date: string;
  status: 'Active' | 'Deactivated' | 'Sold' | 'Rented';
}

export default function OverviewPage() {
  const [listingSearch, setListingSearch] = useState('');
  const [listingFilter, setListingFilter] = useState<'All' | 'Rent' | 'Selling'>('All');
  const [listingPage, setListingPage] = useState(1);

  const [listings, setListings] = useState<Listing[]>([
    { id: 1, name: "46 Haunting St, Somerville", ownerName: "Zia Siddiki", ownerEmail: "siddikia11@gmail.com", price: 505899, category: "Selling", date: "Jan 04 2025", status: "Active" },
    { id: 2, name: "3940 N 16th St", ownerName: "Flores, Juanita", ownerEmail: "nevaeh@gmail.com", price: 3999, category: "Rent", date: "Jan 03 2025", status: "Deactivated" },
    { id: 3, name: "6141 Irving St", ownerName: "Miles, Esther", ownerEmail: "jackson@gmail.com", price: 200500, category: "Selling", date: "Jan 02 2025", status: "Sold" },
    { id: 4, name: "221 E Ontario St", ownerName: "Nguyen, Shane", ownerEmail: "georgia@gmail.com", price: 2430, category: "Rent", date: "Jan 01 2025", status: "Rented" },
    { id: 5, name: "Ahlers & Ogletree Villa", ownerName: "Aberam Perera", ownerEmail: "aberam@stayzo.com", price: 2695, category: "Rent", date: "Dec 28 2024", status: "Active" },
    { id: 6, name: "Villa Tropical Cana", ownerName: "Abiramy Selva", ownerEmail: "abiramy@stayzo.com", price: 3300, category: "Rent", date: "Dec 25 2024", status: "Active" },
    { id: 7, name: "Kandy Lakeview Mansion", ownerName: "Anura Bandara", ownerEmail: "anura@lakeview.com", price: 850000, category: "Selling", date: "Dec 20 2024", status: "Active" },
    { id: 8, name: "Colombo Heights Suite", ownerName: "Nimal Siri", ownerEmail: "nimal@colombo.com", price: 4200, category: "Rent", date: "Dec 18 2024", status: "Rented" },
  ]);

  const handleRemoveListing = (id: number) => {
    setListings(listings.filter(l => l.id !== id));
  };

  const filteredListings = listings.filter(l => {
    const matchesSearch =
      l.name.toLowerCase().includes(listingSearch.toLowerCase()) ||
      l.ownerName.toLowerCase().includes(listingSearch.toLowerCase()) ||
      l.ownerEmail.toLowerCase().includes(listingSearch.toLowerCase());
    const matchesCategory = listingFilter === 'All' || l.category === listingFilter;
    return matchesSearch && matchesCategory;
  });

  const PAGINATION_LIMIT = 4;
  const paginatedListings = filteredListings.slice((listingPage - 1) * PAGINATION_LIMIT, listingPage * PAGINATION_LIMIT);
  const totalPages = Math.ceil(filteredListings.length / PAGINATION_LIMIT);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* 1. Total Revenue */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition duration-300 flex items-start justify-between">
          <div className="space-y-3">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Total Revenue</span>
            <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">$124,500</h3>
            <div className="flex items-center text-emerald-600 text-xs font-bold space-x-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+12.43%</span>
              <span className="text-gray-400 font-semibold text-[10px] ml-1">vs last month</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
            <Globe className="w-5 h-5" />
          </div>
        </div>

        {/* 2. Properties for Rent */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition duration-300 flex items-start justify-between">
          <div className="space-y-3">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Properties for Rent</span>
            <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">{listings.filter(l => l.category === 'Rent').length}</h3>
            <div className="flex items-center text-red-500 text-xs font-bold space-x-1">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>-2.43%</span>
              <span className="text-gray-400 font-semibold text-[10px] ml-1">vs last month</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        {/* 3. Properties for Sale */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition duration-300 flex items-start justify-between">
          <div className="space-y-3">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Properties for Sale</span>
            <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">{listings.filter(l => l.category === 'Selling').length}</h3>
            <div className="flex items-center text-emerald-600 text-xs font-bold space-x-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+10.23%</span>
              <span className="text-gray-400 font-semibold text-[10px] ml-1">vs last month</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <FileBarChart2 className="w-5 h-5" />
          </div>
        </div>

        {/* 4. Available Properties */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition duration-300 flex items-start justify-between">
          <div className="space-y-3">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Available Properties</span>
            <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">{listings.filter(l => l.status === 'Active').length}</h3>
            <div className="flex items-center text-emerald-600 text-xs font-bold space-x-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+5.34%</span>
              <span className="text-gray-400 font-semibold text-[10px] ml-1">vs last month</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
            <Users className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Revenue Chart - Full Width */}
      <div className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-gray-50">
          <div>
            <h4 className="font-extrabold text-sm text-gray-900">Revenue Analytics</h4>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Dynamic monthly sales &amp; rentals</p>
          </div>
          <select className="bg-gray-50 text-[10px] font-extrabold uppercase px-3 py-1.5 border-none rounded-xl outline-none focus:ring-1 focus:ring-[#1A1A1A] cursor-pointer text-gray-600">
            <option>Last 12 Months</option>
            <option>Last 30 Days</option>
          </select>
        </div>

        <div className="relative w-full h-[240px]">
          <svg viewBox="0 0 700 240" className="w-full h-full">
            <line x1="40" y1="30" x2="680" y2="30" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="40" y1="80" x2="680" y2="80" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="40" y1="130" x2="680" y2="130" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="40" y1="180" x2="680" y2="180" stroke="#F1F5F9" strokeWidth="1" />
            <text x="30" y="35" textAnchor="end" fontSize="9" fill="#94a3b8">100%</text>
            <text x="30" y="85" textAnchor="end" fontSize="9" fill="#94a3b8">75%</text>
            <text x="30" y="135" textAnchor="end" fontSize="9" fill="#94a3b8">50%</text>
            <text x="30" y="185" textAnchor="end" fontSize="9" fill="#94a3b8">25%</text>
            <defs>
              <pattern id="diagonalHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="8" stroke="#0F9F90" strokeWidth="2.5" opacity="0.35" />
              </pattern>
            </defs>
            <rect x="60" y="100" width="30" height="80" fill="url(#diagonalHatch)" rx="2" stroke="#0F9F90" strokeWidth="1.5" />
            <text x="75" y="202" textAnchor="middle" fontSize="9" fill="#94a3b8">Apr</text>
            <rect x="110" y="65" width="30" height="115" fill="url(#diagonalHatch)" rx="2" stroke="#0F9F90" strokeWidth="1.5" />
            <text x="125" y="202" textAnchor="middle" fontSize="9" fill="#94a3b8">May</text>
            <rect x="160" y="120" width="30" height="60" fill="url(#diagonalHatch)" rx="2" stroke="#0F9F90" strokeWidth="1.5" />
            <text x="175" y="202" textAnchor="middle" fontSize="9" fill="#94a3b8">Jun</text>
            <rect x="210" y="130" width="30" height="50" fill="url(#diagonalHatch)" rx="2" stroke="#0F9F90" strokeWidth="1.5" />
            <text x="225" y="202" textAnchor="middle" fontSize="9" fill="#94a3b8">Jul</text>
            <rect x="260" y="105" width="30" height="75" fill="url(#diagonalHatch)" rx="2" stroke="#0F9F90" strokeWidth="1.5" />
            <text x="275" y="202" textAnchor="middle" fontSize="9" fill="#94a3b8">Aug</text>
            <rect x="310" y="115" width="30" height="65" fill="url(#diagonalHatch)" rx="2" stroke="#0F9F90" strokeWidth="1.5" />
            <text x="325" y="202" textAnchor="middle" fontSize="9" fill="#94a3b8">Sep</text>
            <rect x="360" y="70" width="30" height="110" fill="url(#diagonalHatch)" rx="2" stroke="#0F9F90" strokeWidth="1.5" />
            <text x="375" y="202" textAnchor="middle" fontSize="9" fill="#94a3b8">Oct</text>
            <rect x="410" y="35" width="30" height="145" fill="#0F9F90" rx="3" stroke="#0D8A7D" strokeWidth="1" />
            <text x="425" y="202" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1a1a1a">Nov</text>
            <rect x="460" y="140" width="30" height="40" fill="url(#diagonalHatch)" rx="2" stroke="#0F9F90" strokeWidth="1.5" />
            <text x="475" y="202" textAnchor="middle" fontSize="9" fill="#94a3b8">Dec</text>
            <rect x="510" y="110" width="30" height="70" fill="url(#diagonalHatch)" rx="2" stroke="#0F9F90" strokeWidth="1.5" />
            <text x="525" y="202" textAnchor="middle" fontSize="9" fill="#94a3b8">Jan</text>
            <rect x="560" y="75" width="30" height="105" fill="url(#diagonalHatch)" rx="2" stroke="#0F9F90" strokeWidth="1.5" />
            <text x="575" y="202" textAnchor="middle" fontSize="9" fill="#94a3b8">Feb</text>
            <rect x="610" y="90" width="30" height="90" fill="url(#diagonalHatch)" rx="2" stroke="#0F9F90" strokeWidth="1.5" />
            <text x="625" y="202" textAnchor="middle" fontSize="9" fill="#94a3b8">Mar</text>
          </svg>
        </div>
      </div>

      {/* Property Listings Table */}
      <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm space-y-6 p-6">

        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gray-50 pb-5">
          <div>
            <h4 className="font-extrabold text-sm text-gray-900">Property Listings Queue</h4>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Search and manage platform properties</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search properties..."
                value={listingSearch}
                onChange={(e) => { setListingSearch(e.target.value); setListingPage(1); }}
                className="bg-[#F8FAFB] text-xs font-bold text-gray-700 pl-9 pr-4 py-2 w-48 rounded-xl outline-none focus:ring-1 focus:ring-[#1A1A1A] border-none"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3.5 top-2.5" />
            </div>
            <div className="bg-[#F8FAFB] p-1 rounded-xl flex items-center space-x-1 text-[10px] font-extrabold uppercase select-none">
              {(['All', 'Rent', 'Selling'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => { setListingFilter(f); setListingPage(1); }}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${listingFilter === f ? 'bg-[#1A1A1A] text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-bold">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-widest text-[9px]">
                <th className="py-4 px-4">Name</th>
                <th className="py-4 px-4">Owner Info</th>
                <th className="py-4 px-4">Property Price</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Listed Date</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedListings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400 font-semibold">
                    No listings found matching the criteria.
                  </td>
                </tr>
              ) : (
                paginatedListings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-[#F8FAFB]/40 transition group">
                    <td className="py-4 px-4">
                      <p className="text-gray-950 font-extrabold text-sm">{listing.name}</p>
                      <p className="text-gray-400 text-[9px] font-semibold mt-0.5">ID: #{1547830 + listing.id}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-gray-800 font-bold">{listing.ownerName}</p>
                      <p className="text-gray-400 font-semibold text-[10px] mt-0.5">{listing.ownerEmail}</p>
                    </td>
                    <td className="py-4 px-4 font-extrabold text-gray-950 text-sm">
                      {listing.category === 'Rent' ? `$${listing.price.toLocaleString()}/mo` : `$${listing.price.toLocaleString()}`}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase ${listing.category === 'Rent' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                        {listing.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-400 font-semibold">{listing.date}</td>
                    <td className="py-4 px-4">
                      <span className={`flex items-center space-x-1.5 text-[10px] font-bold ${listing.status === 'Active' ? 'text-emerald-600' : listing.status === 'Deactivated' ? 'text-gray-400' : listing.status === 'Sold' ? 'text-blue-500' : 'text-amber-500'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${listing.status === 'Active' ? 'bg-emerald-500' : listing.status === 'Deactivated' ? 'bg-gray-400' : listing.status === 'Sold' ? 'bg-blue-500' : 'bg-amber-500'}`}></span>
                        <span>{listing.status}</span>
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => handleRemoveListing(listing.id)}
                        className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-xl transition cursor-pointer"
                        title="Remove Listing"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center pt-4 border-t border-gray-50 text-xs select-none">
            <button
              onClick={() => setListingPage(p => Math.max(1, p - 1))}
              disabled={listingPage === 1}
              className="border border-gray-200 rounded-xl px-4 py-2 hover:bg-[#F8FAFB] transition text-gray-500 disabled:opacity-40 disabled:hover:bg-transparent font-extrabold cursor-pointer"
            >
              &larr; Prev
            </button>
            <span className="text-gray-400 font-semibold">
              Page <span className="font-extrabold text-gray-900">{listingPage}</span> of <span className="font-extrabold text-gray-900">{totalPages}</span>
            </span>
            <button
              onClick={() => setListingPage(p => Math.min(totalPages, p + 1))}
              disabled={listingPage === totalPages}
              className="border border-gray-200 rounded-xl px-4 py-2 hover:bg-[#F8FAFB] transition text-gray-500 disabled:opacity-40 disabled:hover:bg-transparent font-extrabold cursor-pointer"
            >
              Next &rarr;
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
