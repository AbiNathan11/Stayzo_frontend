'use client';

import React, { useState } from 'react';
import {
    CheckCircle2,
    X,
    AlertTriangle,
    Search,
    Building2,
    EyeOff,
    Check
} from 'lucide-react';

// Mock data representing approved property listings
const initialListings = [
    {
        id: 'PROP-9021',
        title: 'Luxury Apex Studio Apartment',
        owner: 'Nimal Bandara',
        ownerEmail: 'nimal@example.com',
        location: 'Colombo 03, Sri Lanka',
        price: 'Rs 150,000/mo',
        fraudScore: 12,
        status: 'Active',
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80',
        reason: 'Regular verified account activity'
    },
    {
        id: 'PROP-4402',
        title: 'Downtown Co-living Shared Room',
        owner: 'Malith Perera',
        ownerEmail: 'malith@example.com',
        location: 'Kandy Central, Sri Lanka',
        price: 'Rs 25,000/mo',
        fraudScore: 8,
        status: 'Active',
        image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=400&q=80',
        reason: 'Owner identity checked and approved'
    },
    {
        id: 'PROP-1104',
        title: 'Serene Beachfront Oasis Villa',
        owner: 'Jane Doe',
        ownerEmail: 'jane@example.com',
        location: 'Hikkaduwa Coastal, Sri Lanka',
        price: 'Rs 450,000/mo',
        fraudScore: 15,
        status: 'Active',
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80',
        reason: 'Ownership deed verified'
    },
    {
        id: 'PROP-5509',
        title: 'Modern Highrise Penthouse Suite',
        owner: 'Aberam Krish',
        ownerEmail: 'aberam@example.com',
        location: 'Colombo 05, Sri Lanka',
        price: 'Rs 280,000/mo',
        fraudScore: 22,
        status: 'Disabled',
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=400&q=80',
        reason: 'Temporarily hidden by administrator request'
    }
];

export default function ListingInteractionsPage() {
    const [listings, setListings] = useState(initialListings);
    const [searchQuery, setSearchQuery] = useState('');

    const toggleStatus = (id: string) => {
        setListings(listings.map((item) => {
            if (item.id === id) {
                const newStatus = item.status === 'Active' ? 'Disabled' : 'Active';
                return { ...item, status: newStatus };
            }
            return item;
        }));
    };

    const filteredListings = listings.filter((item) => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.id.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-300">

            {/* Metric Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex justify-between items-start">
                    <div className="space-y-1">
                        <span className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Active Approved Properties</span>
                        <div className="text-3xl font-black text-gray-900">
                            {listings.filter(l => l.status === 'Active').length}
                        </div>
                        <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-2">Live on Marketplace</span>
                    </div>
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                        <Building2 className="w-5 h-5" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex justify-between items-start">
                    <div className="space-y-1">
                        <span className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Disabled Properties</span>
                        <div className="text-3xl font-black text-red-600">
                            {listings.filter(l => l.status === 'Disabled').length}
                        </div>
                        <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-md inline-block mt-2">Hidden from Search</span>
                    </div>
                    <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
                        <EyeOff className="w-5 h-5" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex justify-between items-start">
                    <div className="space-y-1">
                        <span className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">AI High-Risk Flags</span>
                        <div className="text-3xl font-black text-gray-900">
                            {listings.filter(l => l.fraudScore > 20).length}
                        </div>
                        <span className="text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md inline-block mt-2">Requires Auditing</span>
                    </div>
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                        <AlertTriangle className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Main Filter & Work Area Workspace */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    {/* Leftside Search Wrapper */}
                    <div className="relative w-full sm:w-80">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                            <Search className="w-4 h-4" />
                        </span>
                        <input
                            type="text"
                            placeholder="Search approved properties by title, owner, ID..."
                            className="w-full bg-[#F8FAFC] pl-10 pr-4 py-2.5 rounded-xl text-xs font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 transition"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div>
                        <span className="text-xs text-gray-400 font-extrabold uppercase tracking-wider">Moderation Level: Full</span>
                    </div>
                </div>

                {/* Listings Queue Display */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {filteredListings.map((listing) => (
                        <div
                            key={listing.id}
                            className={`border rounded-2xl p-4 flex flex-col sm:flex-row gap-4 hover:shadow-md transition duration-200 bg-white ${
                                listing.status === 'Disabled' ? 'border-red-100 bg-red-50/5' : 'border-gray-100'
                            }`}
                        >

                            {/* Product Thumbnail Imagery container */}
                            <div className="w-full sm:w-44 h-32 rounded-xl overflow-hidden relative bg-gray-100 shrink-0">
                                <img
                                    src={listing.image}
                                    alt={listing.title}
                                    className="w-full h-full object-cover"
                                />
                                <span className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-white px-2 py-0.5 rounded-md text-[10px] font-black tracking-wider">
                                    {listing.id}
                                </span>
                                <span className={`absolute bottom-2 right-2 px-2 py-0.5 rounded-md text-[9px] font-black tracking-wider ${
                                    listing.status === 'Active' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                                }`}>
                                    {listing.status}
                                </span>
                            </div>

                            {/* Functional details column */}
                            <div className="flex-1 flex flex-col justify-between space-y-2">
                                <div>
                                    <div className="flex justify-between items-start gap-2">
                                        <h3 className="text-sm font-black text-gray-900 line-clamp-1">{listing.title}</h3>
                                        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shrink-0 ${
                                            listing.fraudScore > 20
                                                ? 'bg-amber-50 text-amber-600'
                                                : 'bg-emerald-50 text-emerald-600'
                                        }`}>
                                            Risk: {listing.fraudScore}%
                                        </span>
                                    </div>

                                    <p className="text-xs font-medium text-gray-400 mt-0.5">{listing.location}</p>

                                    <div className="mt-2 text-xs">
                                        <span className="font-extrabold text-gray-900">{listing.owner}</span>
                                        <span className="text-gray-400 font-medium"> ({listing.ownerEmail})</span>
                                    </div>
                                </div>

                                {/* Verification Reason message box */}
                                <div className="bg-[#F8FAFC] p-2 rounded-xl text-[11px] font-semibold text-gray-500 flex items-center gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
                                    <span className="line-clamp-1">{listing.reason}</span>
                                </div>

                                {/* Interactive Workflow Trigger Actions */}
                                <div className="flex items-center justify-between pt-1">
                                    <span className="text-sm font-black text-gray-900">{listing.price}</span>

                                    <div className="flex space-x-2">
                                        {listing.status === 'Active' ? (
                                            <button 
                                                onClick={() => toggleStatus(listing.id)}
                                                className="flex items-center space-x-1 px-3 py-1.5 border border-red-200 text-red-600 rounded-xl text-xs font-black hover:bg-red-50 transition cursor-pointer"
                                            >
                                                <EyeOff className="w-3.5 h-3.5" />
                                                <span>Disable Property</span>
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => toggleStatus(listing.id)}
                                                className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-500 text-white rounded-xl text-xs font-black hover:bg-emerald-600 transition shadow-sm cursor-pointer"
                                            >
                                                <Check className="w-3.5 h-3.5" />
                                                <span>Enable Property</span>
                                            </button>
                                        )}
                                    </div>
                                </div>

                            </div>

                        </div>
                    ))}

                    {filteredListings.length === 0 && (
                        <div className="col-span-full py-12 text-center text-xs font-bold text-gray-400 bg-[#F8FAFC] rounded-2xl border border-dashed border-gray-200">
                            No properties match your search queries.
                        </div>
                    )}
                </div>

            </div>

        </div>
    );
}