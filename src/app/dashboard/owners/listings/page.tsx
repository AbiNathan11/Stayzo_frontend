"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, ArrowRight, AlertTriangle, Pencil, ChevronRight } from 'lucide-react';
import Footer from '@/components/Footer';

// ── Types ──────────────────────────────────────────────────────────────────────
interface Listing {
  id: number;
  name: string;
  price: string;
  location: string;
  yield: string;
  image: string;
}

// ── Mock Data ──────────────────────────────────────────────────────────────────
const INCOMPLETE_ASSET = {
  id: 829,
  title: 'INCOMPLETE ASSET #829',
  description: 'Awaiting architectural schematics and tax documentation.',
  valuation: 'PENDING',
  region: 'ZONE 42',
  status: 'CRITICAL',
  image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&h=240&fit=crop&q=80',
};

const LISTINGS: Listing[] = [
  {
    id: 1,
    name: 'SKYLINE PAVILION',
    price: '$14,500',
    location: 'Central District',
    yield: '4.2%',
    image: 'https://images.unsplash.com/photo-1464082354059-27db6ce50048?w=400&h=240&fit=crop&q=80',
  },
  {
    id: 2,
    name: 'SUNSET APARTMENTS',
    price: '$8,200',
    location: 'Harbor Side',
    yield: '5.8%',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=240&fit=crop&q=80',
  },
  {
    id: 3,
    name: 'VECTOR PLAZA',
    price: '$22,000',
    location: 'Financial Hub',
    yield: '3.9%',
    image: 'https://images.unsplash.com/photo-1431576901776-e539bd916ba2?w=400&h=240&fit=crop&q=80',
  },
];

const TOTAL_ASSETS = 25;

// ── Nav Links ──────────────────────────────────────────────────────────────────
const navLinks = [
  { label: 'Home',         href: '/dashboard/owners' },
  { label: 'Listings',     href: '/dashboard/owners/listings' },
  { label: 'Appointments', href: '/dashboard/owners/appointments' },
  { label: 'Chat',         href: '/dashboard/owners/chat' },
  { label: 'Agreement',    href: '/dashboard/owners/agreement' },
  { label: 'Profile',      href: '/dashboard/owners/profile' },
];

// ── Component ──────────────────────────────────────────────────────────────────
export default function OwnerListings() {
  const pathname = usePathname();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(TOTAL_ASSETS / 4);

  return (
    <div className="min-h-screen flex flex-col bg-white">

      {/* ── Navbar ── */}
      <header className="w-full bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-[60px] flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="flex items-end space-x-[3px] h-5">
              <div className="w-[3px] h-3 bg-[#1A1A1A] rounded-full" />
              <div className="w-[3px] h-5 bg-[#1A1A1A] rounded-full" />
              <div className="w-[3px] h-4 bg-[#1A1A1A] rounded-full" />
              <div className="w-[3px] h-2.5 bg-[#1A1A1A] rounded-full" />
            </div>
            <span className="text-[15px] font-black tracking-tight text-[#1A1A1A] uppercase">Stayzo</span>
          </Link>

          {/* Center Nav */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`relative px-4 py-2 text-[13px] font-semibold transition-colors ${
                    isActive
                      ? 'text-[#1A1A1A]'
                      : 'text-gray-500 hover:text-[#1A1A1A]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-[#1A1A1A] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="flex items-center space-x-1.5 bg-[#1A1A1A] hover:bg-black text-white text-[11px] font-extrabold tracking-wider uppercase px-4 py-2 rounded-full transition-colors shadow-md"
            >
              <span>I AM A TENANT</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              id="listings-notifications-btn"
              className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-[#1A1A1A]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#1A1A1A] rounded-full" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Page Content ── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 lg:px-10 py-10">

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-[32px] md:text-[40px] font-black text-[#1A1A1A] uppercase tracking-tight leading-none">
            Property Listings
          </h1>
          <div className="w-8 h-[3px] bg-[#1A1A1A] mt-2" />
        </div>

        {/* ── Incomplete Asset Card ── */}
        <div className="border border-gray-300 rounded-sm mb-6 overflow-hidden">
          <div className="flex flex-col sm:flex-row">
            {/* Image */}
            <div className="sm:w-[200px] flex-shrink-0">
              <img
                src={INCOMPLETE_ASSET.image}
                alt="Incomplete asset"
                className="w-full h-[160px] sm:h-full object-cover grayscale"
              />
            </div>

            {/* Content */}
            <div className="flex-1 p-5 flex flex-col justify-between">
              {/* Top row */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-[15px] font-black text-[#1A1A1A] uppercase tracking-wide">
                    {INCOMPLETE_ASSET.title}
                  </h2>
                  <p className="text-[12px] text-gray-500 mt-1">{INCOMPLETE_ASSET.description}</p>
                </div>
                <span className="flex-shrink-0 flex items-center gap-1 border border-red-400 text-red-500 text-[10px] font-extrabold uppercase tracking-widest px-2 py-1 rounded-sm">
                  <AlertTriangle className="w-3 h-3" />
                  Incomplete
                </span>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100 my-4" />

              {/* Meta + Button */}
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div className="flex gap-10">
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Valuation</p>
                    <p className="text-[13px] font-black text-[#1A1A1A]">{INCOMPLETE_ASSET.valuation}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Region</p>
                    <p className="text-[13px] font-black text-[#1A1A1A]">{INCOMPLETE_ASSET.region}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                    <p className="text-[13px] font-black text-red-500">{INCOMPLETE_ASSET.status}</p>
                  </div>
                </div>
                <button
                  id="complete-listing-btn"
                  className="bg-[#1A1A1A] hover:bg-black text-white text-[10px] font-extrabold tracking-widest uppercase px-5 py-2.5 transition-colors"
                >
                  Complete Listing
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Regular Listing Cards ── */}
        <div className="flex flex-col gap-4">
          {LISTINGS.map((listing) => (
            <div
              key={listing.id}
              className="border border-gray-200 rounded-sm overflow-hidden flex flex-col sm:flex-row hover:border-gray-400 transition-colors"
            >
              {/* Image */}
              <div className="sm:w-[180px] flex-shrink-0">
                <img
                  src={listing.image}
                  alt={listing.name}
                  className="w-full h-[140px] sm:h-full object-cover grayscale"
                />
              </div>

              {/* Content */}
              <div className="flex-1 p-5 flex flex-col justify-between">
                {/* Top */}
                <div>
                  <h3 className="text-[15px] font-black text-[#1A1A1A] uppercase tracking-wide">
                    {listing.name}
                  </h3>
                  <p className="text-[12px] text-gray-500 font-semibold mt-0.5">{listing.price}</p>
                </div>

                {/* Meta */}
                <div className="flex gap-10 mt-3">
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Location</p>
                    <p className="text-[12px] font-bold text-[#1A1A1A]">{listing.location}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Yield</p>
                    <p className="text-[12px] font-bold text-[#1A1A1A]">{listing.yield}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 mt-4">
                  <button
                    id={`view-details-btn-${listing.id}`}
                    className="border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white text-[10px] font-extrabold tracking-widest uppercase px-4 py-2 transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    id={`edit-btn-${listing.id}`}
                    className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 hover:text-[#1A1A1A] transition-colors"
                  >
                    <Pencil className="w-3 h-3" />
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Pagination ── */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-100">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            Showing 1-4 of {TOTAL_ASSETS} assets
          </p>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages > 3 ? 3 : totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                id={`page-btn-${page}`}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 text-[12px] font-extrabold border transition-colors ${
                  currentPage === page
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                    : 'bg-white text-[#1A1A1A] border-gray-200 hover:border-[#1A1A1A]'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              id="pagination-next-btn"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="w-8 h-8 flex items-center justify-center border border-gray-200 hover:border-[#1A1A1A] text-[#1A1A1A] transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
