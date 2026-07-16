"use client";
import Cookies from 'js-cookie';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { 
  Pencil, 
  Trash2, 
  Play, 
  Building, 
  MapPin, 
  Home, 
  BedDouble, 
  Bath, 
  Maximize, 
  AlertCircle, 
  Clock,
  CheckCircle2,
  Check,
  X
} from 'lucide-react';
import PropertyReviews from '@/components/PropertyReviews';


// ── Types ──────────────────────────────────────────────────────────────────────
interface Listing {
  id: string;
  title: string;
  price: number;
  rentPerMonth?: number;
  address: string;
  city: string;
  state: string;
  bedrooms: number;
  bathrooms: number;
  hall: number;
  images: string[];
  panoramaImage?: string;
  status: string;
  createdAt: string;
  noisePrediction?: {
    noiseLevelScore: number;
    label: 'Low' | 'Medium' | 'High';
    color: 'green' | 'yellow' | 'red';
    explanation: string;
    factors: any[];
  } | null;
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

const LISTINGS: any[] = [
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
// ── Helper: decode JWT payload without a library ─────────────────────────────
function decodeToken(token: string): Record<string, any> | null {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export default function OwnerListings() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'active' | 'processing' | 'booking_request'>(
    tabParam === 'booking_request' ? 'booking_request' : 'active'
  );
  const [bookingRequests, setBookingRequests] = useState<any[]>([]);
  const [declineConfirmId, setDeclineConfirmId] = useState<string | null>(null);
  const [draft, setDraft] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', price: '', address: '', city: '', 
    type: 'Apartment', bedrooms: '', bathrooms: '', hall: '', 
    panoramaImage: '', waterBillImage: '', image: ''
  });

  // Load draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('stayzo_listing_draft');
    if (savedDraft) {
      try {
        setDraft(JSON.parse(savedDraft));
      } catch (e) {
        console.error('Error loading draft:', e);
      }
    }
  }, []);

  const handleDeleteDraft = () => {
    if (window.confirm("Are you sure you want to discard this in-progress listing draft?")) {
      localStorage.removeItem('stayzo_listing_draft');
      setDraft(null);
    }
  };

  // Decode JWT once on mount to get the real owner ID
  useEffect(() => {
    const token = Cookies.get('stayzo_token');
    if (token) {
      const payload = decodeToken(token);
      if (payload?.id) setOwnerId(payload.id);
    }
  }, []);

  useEffect(() => {
    if (tabParam === 'booking_request') {
      setActiveTab('booking_request');
    }
  }, [tabParam]);

  // Fetch only this owner's properties whenever ownerId is resolved
  useEffect(() => {
    if (!ownerId) return;
    const fetchData = async () => {
      if (listings.length === 0) setLoading(true);
      try {
        const token = Cookies.get('stayzo_token');
        
        // Fetch properties
        if (listings.length === 0) {
          const res = await fetch(`http://localhost:3001/api/properties/owner/${ownerId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data: Listing[] = await res.json();
            setListings(data);
          } else {
            console.error('Failed to fetch owner listings:', res.status);
          }
        }

        // Fetch bookings
        const bookingsRes = await fetch(`http://localhost:3001/api/bookings/owner`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json();
          // Only show direct property bookings (PropertyBooking) which have no slot
          setBookingRequests(bookingsData.filter((b: any) => b.status === 'PENDING' && b.slot === null));
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [ownerId, activeTab]);

  const handleApproveBooking = async (id: string) => {
    try {
      const token = Cookies.get('stayzo_token');
      const res = await fetch(`http://localhost:3001/api/bookings/${id}/approve`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success('Booking approved successfully');
        setBookingRequests(prev => prev.filter(b => b.id !== id));
      } else {
        toast.error('Failed to approve booking');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred');
    }
  };

  const handleDeclineBooking = async (id: string) => {
    try {
      const token = Cookies.get('stayzo_token');
      const res = await fetch(`http://localhost:3001/api/bookings/${id}/reject`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success('Booking declined');
        setBookingRequests(prev => prev.filter(b => b.id !== id));
        setDeclineConfirmId(null);
      } else {
        toast.error('Failed to decline booking');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred');
    }
  };

  const totalPages = Math.ceil(listings.length / 6) || 1;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, [fieldName]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerId) return toast.error('Could not identify your account. Please log in again.');
    try {
      const res = await fetch('http://localhost:3001/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData, 
          ownerId,                                    // real owner ID from JWT
          images: formData.image ? [formData.image] : []
        })
      });
      if (res.ok) {
        const newProp: Listing = await res.json();
        setListings([newProp, ...listings]);
        setIsModalOpen(false);
        setFormData({ title: '', description: '', price: '', address: '', city: '', type: 'Apartment', bedrooms: '', bathrooms: '', hall: '', panoramaImage: '', waterBillImage: '', image: '' });
      }
    } catch (err) {
      console.error('Error creating property:', err);
    }
  };

  return (
    <div className="animate-in fade-in duration-300">
      <Toaster position="top-right" toastOptions={{ style: { background: '#1A1A1A', color: '#fff', fontWeight: 700, fontSize: '13px', borderRadius: '12px' } }} />

      {/* ── Page Content ── */}
      <div className="w-full">

        {/* Page Title & Action */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Property Listings
            </h2>
            <p className="text-gray-500 text-xs font-semibold mt-1">
              Manage your active properties and view incomplete drafts.
            </p>
          </div>
          <Link 
            href="/dashboard/owners/start_listing"
            className="shrink-0 text-xs font-bold text-[#4F46E5] bg-[#EEF2FF] hover:bg-[#E0E7FF] px-5 py-2.5 rounded-xl transition duration-200 shadow-xs cursor-pointer"
          >
            + Create New Listing
          </Link>
        </div>

        <div className="flex border-b border-gray-200 mb-8 select-none">
          <button 
            onClick={() => setActiveTab('active')}
            className={`mr-8 pb-4 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${
              activeTab === 'active' 
                ? 'border-[#4F46E5] text-[#4F46E5]' 
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Active Listings ({listings.length})
          </button>
          <button 
            onClick={() => setActiveTab('processing')}
            className={`mr-8 pb-4 text-xs font-black uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'processing' 
                ? 'border-[#4F46E5] text-[#4F46E5]' 
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            In Progress & Drafts ({draft ? 1 : 0})
            {draft && <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />}
          </button>
          <button 
            onClick={() => setActiveTab('booking_request')}
            className={`pb-4 text-xs font-black uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'booking_request' 
                ? 'border-[#4F46E5] text-[#4F46E5]' 
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Booking Request
          </button>
        </div>

        {/* ── Active Listings Tab ── */}
        {activeTab === 'active' && loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i}
                className="bg-white border border-gray-200 rounded-3xl overflow-hidden flex flex-col h-[380px]"
              >
                {/* Image Area Skeleton */}
                <div className="h-[180px] bg-gray-100 shrink-0" />
                {/* Card Content Skeleton */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="h-5 w-3/4 bg-gray-200 rounded-md" />
                    <div className="h-3.5 w-1/2 bg-gray-100 rounded-md mt-2" />
                    <div className="h-6 w-1/3 bg-gray-200 rounded-md mt-4" />
                  </div>
                  {/* Specs Skeleton */}
                  <div className="grid grid-cols-3 gap-2 border-t border-b border-gray-100 py-3 my-4">
                    {[...Array(3)].map((_, idx) => (
                      <div key={idx} className="text-center space-y-1">
                        <div className="h-2 w-10 bg-gray-100 rounded mx-auto" />
                        <div className="h-3.5 w-8 bg-gray-200 rounded mx-auto" />
                      </div>
                    ))}
                  </div>
                  {/* Action buttons Skeleton */}
                  <div className="flex gap-2">
                    <div className="flex-1 h-9 bg-gray-100 rounded-xl" />
                    <div className="w-10 h-9 bg-gray-100 rounded-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'active' && !loading && (
          <div>
            {listings.length === 0 ? (
              <div className="py-20 text-center border border-dashed border-gray-200 rounded-3xl bg-gray-50/55">
                <Building className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-[13px] font-bold text-gray-500 uppercase tracking-wide">No Active Properties Found</p>
                <p className="text-[11px] text-gray-400 mt-1 max-w-xs mx-auto">Deploy a high-fidelity property listing today to start receiving lease applications.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.slice((currentPage - 1) * 6, currentPage * 6).map((listing) => (
                  <div 
                    key={listing.id}
                    className="group bg-white border border-gray-200 rounded-3xl overflow-hidden hover:border-gray-400 hover:shadow-md transition-all duration-300 flex flex-col"
                  >
                    {/* Image Area */}
                    <div className="h-[180px] bg-gray-100 relative overflow-hidden shrink-0">
                      <img 
                        src={listing.images?.[0] || 'https://images.unsplash.com/photo-1464082354059-27db6ce50048?w=400&h=240&fit=crop&q=80'} 
                        alt={listing.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="bg-black text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-md">
                          Active
                        </span>
                        {listing.noisePrediction && (
                          <span className={`text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-md border ${
                            listing.noisePrediction.label === 'Low'    ? 'bg-emerald-600 border-emerald-500' :
                            listing.noisePrediction.label === 'Medium' ? 'bg-amber-500 border-amber-400' :
                            'bg-rose-600 border-rose-500'
                          }`}>
                            🔊 {listing.noisePrediction.label} Noise
                          </span>
                        )}
                      </div>
                      {listing.panoramaImage && (
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-purple-700 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-md">
                          360° Tour
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-base font-black text-[#1A1A1A] uppercase tracking-wide truncate">
                          {listing.title}
                        </h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 mt-1.5">
                          <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                          {listing.city || 'Colombo'}, {listing.state || 'Western'}
                        </p>
                        
                        <p className="text-xl font-black text-[#1A1A1A] mt-4 leading-none">
                          Rs. {Number(listing.price || listing.rentPerMonth || 0).toLocaleString()}
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">/ mo</span>
                        </p>
                      </div>

                      {/* Specs */}
                      <div className="grid grid-cols-3 gap-2 border-t border-b border-gray-100 py-3 my-4">
                        <div className="text-center">
                          <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Bedrooms</p>
                          <p className="text-xs font-black text-[#1A1A1A] mt-1 flex items-center justify-center gap-1">
                            <BedDouble className="w-3 h-3 text-gray-500" />
                            {listing.bedrooms || 1}
                          </p>
                        </div>
                        <div className="text-center border-x border-gray-100">
                          <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Baths</p>
                          <p className="text-xs font-black text-[#1A1A1A] mt-1 flex items-center justify-center gap-1">
                            <Bath className="w-3 h-3 text-gray-500" />
                            {listing.bathrooms || 1}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Halls</p>
                          <p className="text-xs font-black text-[#1A1A1A] mt-1 flex items-center justify-center gap-1">
                            <Maximize className="w-3 h-3 text-gray-500" />
                            {listing.hall || 1}
                          </p>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2">
                        <Link 
                          href={`/properties/${listing.id}`}
                          className="flex-1 text-center bg-gray-50 hover:bg-gray-100 text-[#1A1A1A] border border-gray-200 text-[10px] font-black tracking-widest uppercase py-2.5 rounded-xl transition"
                        >
                          View Details
                        </Link>
                        <button 
                          className="px-3 border border-gray-200 hover:border-blue-600 hover:text-blue-600 rounded-xl text-[#1A1A1A] transition flex items-center justify-center"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Processing / Drafts Tab ── */}
        {activeTab === 'processing' && (
          <div className="space-y-6">
            {!draft ? (
              <div className="py-20 text-center border border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
                <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-[13px] font-bold text-gray-500 uppercase tracking-wide">No In-Progress Drafts Found</p>
                <p className="text-[11px] text-gray-400 mt-1 max-w-xs mx-auto">When you exit the property creation wizard mid-way using "Save and Exit", your progress will appear here.</p>
              </div>
            ) : (
              <div className="max-w-xl bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:border-gray-400 transition relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 opacity-50 rounded-full blur-xl transform translate-x-1/3 -translate-y-1/3"></div>
                
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <span className="bg-amber-100 text-amber-800 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
                      In-Progress Draft
                    </span>
                    <h3 className="text-[18px] font-black text-[#1A1A1A] uppercase tracking-wide mt-3">
                      {draft.formData?.houseNo && draft.formData?.street 
                        ? `${draft.formData.houseNo} ${draft.formData.street}` 
                        : "Untitled Draft Property"
                      }
                    </h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                      {draft.formData?.city || "City Not Set"}
                    </p>
                  </div>
                  <button 
                    onClick={handleDeleteDraft}
                    className="p-2.5 text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-xl transition"
                    title="Delete Draft"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress Indicators */}
                <div className="mt-6 pt-5 border-t border-gray-100 relative z-10">
                  <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                    <span>Draft Completeness</span>
                    <span className="text-amber-700 font-extrabold">Step {draft.currentStep} of 7</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-500 rounded-full transition-all duration-500" 
                      style={{ width: `${((draft.currentStep - 1) / 6) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Quick Resume info */}
                <p className="text-[11px] text-gray-400 mt-4 leading-relaxed relative z-10">
                  Category: <strong className="text-gray-700">{draft.formData?.propertyCategory || "None Specified"}</strong> • 
                  Price Draft: <strong className="text-gray-700">Rs. {draft.formData?.rentPerMonth ? parseInt(draft.formData.rentPerMonth).toLocaleString() : "0"}</strong>
                </p>

                {/* Continue Actions */}
                <div className="mt-6 flex gap-3 relative z-10">
                  <Link 
                    href="/dashboard/owners/start_listing"
                    className="flex-1 flex items-center justify-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-[11px] font-black uppercase tracking-widest py-3 rounded-xl shadow-sm transition"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Continue Wizard</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Booking Request Tab ── */}
        {activeTab === 'booking_request' && (
          <div className="space-y-6">
            {bookingRequests.length === 0 ? (
              <div className="py-20 text-center border border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
                <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-[13px] font-bold text-gray-500 uppercase tracking-wide">No Booking Requests Found</p>
                <p className="text-[11px] text-gray-400 mt-1 max-w-xs mx-auto">Any booking requests from potential tenants will appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookingRequests.map((request) => (
                  <div key={request.id} className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition">
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <span className="bg-blue-100 text-blue-800 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
                          New Request
                        </span>
                        <p className="text-[10px] font-bold text-gray-400">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <h3 className="text-base font-black text-[#1A1A1A] uppercase tracking-wide truncate">
                        {request.property?.title}
                      </h3>
                      
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 mt-1.5 mb-4">
                        <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                        {request.property?.address}
                      </p>

                      <div className="bg-gray-50 rounded-xl p-3 mb-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Rent Amount</span>
                          <span className="text-xs font-black text-[#1A1A1A]">Rs. {request.property?.price?.toLocaleString() || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Tenant</span>
                          <span className="text-xs font-black text-[#1A1A1A]">{request.tenant?.firstName} {request.tenant?.lastName}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleApproveBooking(request.id)}
                          className="flex-1 flex justify-center items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-[10px] font-black tracking-widest uppercase py-2.5 rounded-xl transition"
                        >
                          <Check className="w-3.5 h-3.5" /> Accept
                        </button>
                        <button 
                          onClick={() => setDeclineConfirmId(request.id)}
                          className="flex-1 flex justify-center items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 hover:border-red-300 text-[10px] font-black tracking-widest uppercase py-2.5 rounded-xl transition"
                        >
                          <X className="w-3.5 h-3.5" /> Decline
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Pagination ── */}
        {activeTab === 'active' && listings.length > 0 && (
          <div className="flex items-center justify-between mt-12 pt-6 border-t border-gray-100">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Showing {(currentPage - 1) * 6 + 1}-{Math.min(currentPage * 6, listings.length)} of {listings.length} assets
            </p>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 text-[12px] font-extrabold border transition-colors rounded-lg ${
                    currentPage === page
                      ? 'bg-[#4F46E5] text-white border-[#4F46E5]'
                      : 'bg-white text-[#1A1A1A] border-gray-200 hover:border-[#4F46E5]'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

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
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Halls</label>
                      <input type="number" value={formData.hall} onChange={e => setFormData({...formData, hall: e.target.value})} className="w-full border border-gray-200 p-2.5 text-[13px] outline-none focus:border-black" />
                    </div>
                  </div>

                  {/* 360 Panorama */}
                  <div className="space-y-1 md:col-span-2 bg-blue-50/50 p-4 border border-blue-200 rounded-xl">
                    <label className="text-[10px] font-black uppercase tracking-widest text-blue-700 flex items-center gap-1.5 mb-2">
                      360° Panorama Image Upload
                    </label>
                    <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'panoramaImage')} className="w-full text-[13px] text-blue-800 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer" />
                    <p className="text-[10px] text-blue-600 mt-2">Upload a high-resolution equirectangular panorama image to automatically enable the 360° Virtual Tour for this listing.</p>
                    {formData.panoramaImage && (
                      <p className="text-[11px] text-green-600 font-black mt-2 bg-green-50 p-2 rounded inline-block">✓ Panorama Attached Successfully</p>
                    )}
                  </div>

                  {/* Main Image */}
                  <div className="space-y-1 md:col-span-2 bg-gray-50/50 p-4 border border-gray-200 rounded-xl">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-700 flex items-center gap-1.5 mb-2">
                      Property Main Image Upload
                    </label>
                    <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'image')} className="w-full text-[13px] text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-gray-800 file:text-white hover:file:bg-black cursor-pointer" />
                    {formData.image && (
                      <p className="text-[11px] text-green-600 font-black mt-2 bg-green-50 p-2 rounded inline-block">✓ Main Image Attached Successfully</p>
                    )}
                  </div>

                  {/* Water Bill */}
                  <div className="space-y-1 md:col-span-2 bg-emerald-50/50 p-4 border border-emerald-200 rounded-xl">
                    <label className="text-[10px] font-black uppercase tracking-widest text-emerald-700 flex items-center gap-1.5 mb-2">
                      Water Bill Image (Verification)
                    </label>
                    <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'waterBillImage')} className="w-full text-[13px] text-emerald-800 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 cursor-pointer" />
                    <p className="text-[10px] text-emerald-600 mt-2">Upload a recent water bill for address verification by the Admin.</p>
                    {formData.waterBillImage && (
                      <p className="text-[11px] text-green-600 font-black mt-2 bg-green-50 p-2 rounded inline-block">✓ Water Bill Attached Successfully</p>
                    )}
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Description</label>
                    <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border border-gray-200 p-2.5 text-[13px] outline-none focus:border-black" placeholder="Describe the property..." />
                  </div>
                </div>

                <div className="border-t pt-5 flex justify-end gap-3 mt-8">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-[11px] font-bold text-gray-500 hover:text-black uppercase tracking-widest">Cancel</button>
                  <button type="submit" className="px-6 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-colors shadow-sm">Publish Listing</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ── Decline Confirmation Modal ── */}
      {declineConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <X className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#1A1A1A]">Decline Request</h3>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                  Are you sure you want to decline this booking request? The tenant will be notified, and this action cannot be undone.
                </p>
              </div>
              <div className="flex gap-3 w-full mt-4">
                <button 
                  onClick={() => setDeclineConfirmId(null)}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-bold uppercase tracking-widest rounded-xl transition"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleDeclineBooking(declineConfirmId)}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold uppercase tracking-widest rounded-xl shadow-md active:scale-95 transition"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
