"use client";

import React, { useState, useEffect } from 'react';
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
  const [listings, setListings] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', price: '', address: '', city: '', 
    type: 'Apartment', bedrooms: '', bathrooms: '', sqft: '', 
    panoramaImage: '', waterBillImage: '', image: ''
  });

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/properties');
        if (res.ok) {
          const data = await res.json();
          // For owner dashboard, we'd normally filter by ownerId, but for now we'll show all or mock it
          setListings(data);
        }
      } catch (err) {
        console.error('Error fetching listings:', err);
      }
    };
    fetchListings();
  }, []);

  const totalPages = Math.ceil(listings.length / 4) || 1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Use a dummy ownerId for now since auth might not be fully linked here
        body: JSON.stringify({ 
          ...formData, 
          ownerId: 'owner-123',
          images: formData.image ? [formData.image] : []
        })
      });
      if (res.ok) {
        const newProp = await res.json();
        setListings([newProp, ...listings]);
        setIsModalOpen(false);
        setFormData({ title: '', description: '', price: '', address: '', city: '', type: 'Apartment', bedrooms: '', bathrooms: '', sqft: '', panoramaImage: '', waterBillImage: '', image: '' });
      }
    } catch (err) {
      console.error('Error creating property:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">

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

        {/* Page Title & Action */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-[32px] md:text-[40px] font-black text-[#1A1A1A] uppercase tracking-tight leading-none">
              Property Listings
            </h1>
            <div className="w-8 h-[3px] bg-[#1A1A1A] mt-2" />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#1A1A1A] text-white px-5 py-2.5 text-[11px] font-black tracking-widest uppercase hover:bg-black transition-colors"
          >
            + Create New Listing
          </button>
        </div>

        {/* ── Regular Listing Cards ── */}
        <div className="flex flex-col gap-4">
          {listings.length === 0 ? (
            <div className="py-10 text-center text-gray-500 font-semibold text-[13px]">
              No properties found. Create your first listing above!
            </div>
          ) : (
            listings.slice((currentPage - 1) * 4, currentPage * 4).map((listing) => (
              <div
                key={listing.id}
                className="border border-gray-200 rounded-sm overflow-hidden flex flex-col sm:flex-row hover:border-gray-400 transition-colors"
              >
                {/* Image */}
                <div className="sm:w-[220px] flex-shrink-0 bg-gray-100">
                  <img
                    src={listing.images?.[0] || 'https://images.unsplash.com/photo-1464082354059-27db6ce50048?w=400&h=240&fit=crop&q=80'}
                    alt={listing.title}
                    className="w-full h-[140px] sm:h-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 p-5 flex flex-col justify-between">
                  {/* Top */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-[16px] font-black text-[#1A1A1A] uppercase tracking-wide">
                        {listing.title}
                      </h3>
                      <p className="text-[13px] text-gray-500 font-bold mt-1">${listing.price} / month</p>
                    </div>
                    {listing.panoramaImage && (
                      <span className="bg-purple-100 text-purple-700 text-[9px] font-black uppercase px-2 py-1 rounded">360° View Ready</span>
                    )}
                  </div>

                  {/* Meta */}
                  <div className="flex gap-10 mt-4">
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Location</p>
                      <p className="text-[12px] font-bold text-[#1A1A1A]">{listing.city || 'Anytown'}, {listing.state || 'ST'}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Specs</p>
                      <p className="text-[12px] font-bold text-[#1A1A1A]">{listing.bedrooms} Bed • {listing.bathrooms} Bath</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4 mt-5">
                    <Link
                      href={`/properties/${listing.id}`}
                      className="border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white text-[10px] font-extrabold tracking-widest uppercase px-4 py-2 transition-colors"
                    >
                      View Details
                    </Link>
                    <button
                      className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 hover:text-[#1A1A1A] transition-colors"
                    >
                      <Pencil className="w-3 h-3" />
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── Pagination ── */}
        {listings.length > 0 && (
          <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-100">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Showing {(currentPage - 1) * 4 + 1}-{Math.min(currentPage * 4, listings.length)} of {listings.length} assets
            </p>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
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
            </div>
          </div>
        )}
      </main>

      {/* ── Create Listing Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center border-b pb-4 mb-6">
                <h2 className="text-[20px] font-black uppercase text-[#1A1A1A]">Create New Listing</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-black">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Property Title *</label>
                    <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border border-gray-200 p-2.5 text-[13px] outline-none focus:border-black" placeholder="e.g. Skyline Pavilion Penthouse" />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Monthly Rent ($) *</label>
                    <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full border border-gray-200 p-2.5 text-[13px] outline-none focus:border-black" placeholder="e.g. 2500" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Property Type</label>
                    <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full border border-gray-200 p-2.5 text-[13px] outline-none focus:border-black">
                      <option>Apartment</option>
                      <option>House</option>
                      <option>Condo</option>
                      <option>Studio</option>
                    </select>
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Address</label>
                    <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full border border-gray-200 p-2.5 text-[13px] outline-none focus:border-black" placeholder="Street Address" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">City</label>
                    <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full border border-gray-200 p-2.5 text-[13px] outline-none focus:border-black" placeholder="City" />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Beds</label>
                      <input type="number" value={formData.bedrooms} onChange={e => setFormData({...formData, bedrooms: e.target.value})} className="w-full border border-gray-200 p-2.5 text-[13px] outline-none focus:border-black" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Baths</label>
                      <input type="number" step="0.5" value={formData.bathrooms} onChange={e => setFormData({...formData, bathrooms: e.target.value})} className="w-full border border-gray-200 p-2.5 text-[13px] outline-none focus:border-black" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Sqft</label>
                      <input type="number" value={formData.sqft} onChange={e => setFormData({...formData, sqft: e.target.value})} className="w-full border border-gray-200 p-2.5 text-[13px] outline-none focus:border-black" />
                    </div>
                  </div>

                  <div className="space-y-1 md:col-span-2 bg-blue-50 p-4 border border-blue-100 rounded">
                    <label className="text-[10px] font-black uppercase tracking-widest text-blue-700 flex items-center gap-1.5">
                      360° Panorama Image URL
                    </label>
                    <input type="url" value={formData.panoramaImage} onChange={e => setFormData({...formData, panoramaImage: e.target.value})} className="w-full border border-blue-200 p-2.5 text-[13px] outline-none focus:border-blue-400 bg-white mt-1" placeholder="https://example.com/panorama.jpg" />
                    <p className="text-[10px] text-blue-600 mt-1">Provide a high-resolution equirectangular panorama image URL to automatically enable the 360° Virtual Tour for this listing.</p>
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Property Main Image URL</label>
                    <input type="url" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full border border-gray-200 p-2.5 text-[13px] outline-none focus:border-black" placeholder="https://example.com/property.jpg" />
                  </div>

                  <div className="space-y-1 md:col-span-2 bg-emerald-50 p-4 border border-emerald-100 rounded">
                    <label className="text-[10px] font-black uppercase tracking-widest text-emerald-700 flex items-center gap-1.5">
                      Water Bill Image URL (Verification)
                    </label>
                    <input type="url" value={formData.waterBillImage} onChange={e => setFormData({...formData, waterBillImage: e.target.value})} className="w-full border border-emerald-200 p-2.5 text-[13px] outline-none focus:border-emerald-400 bg-white mt-1" placeholder="https://example.com/waterbill.jpg" />
                    <p className="text-[10px] text-emerald-600 mt-1">Upload a recent water bill for address verification by the Admin.</p>
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Description</label>
                    <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border border-gray-200 p-2.5 text-[13px] outline-none focus:border-black" placeholder="Describe the property..." />
                  </div>
                </div>

                <div className="border-t pt-5 flex justify-end gap-3 mt-8">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-[11px] font-bold text-gray-500 hover:text-black uppercase tracking-widest">Cancel</button>
                  <button type="submit" className="px-6 py-2.5 bg-[#1A1A1A] hover:bg-black text-white text-[11px] font-black uppercase tracking-widest transition-colors">Publish Listing</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
