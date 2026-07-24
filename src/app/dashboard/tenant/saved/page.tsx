"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, BedDouble, Bath, Maximize, MapPin, Clock, X } from 'lucide-react';
import Cookies from 'js-cookie';

interface WishlistItem {
  id: string | number;
  title: string;
  address: string;
  beds: number;
  baths: number;
  halls: number;
  price: string;
  image: string;
}

export default function SavedPropertiesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'saved' | 'booking'>('booking');
  const [bookingTab, setBookingTab] = useState<'requested' | 'accepted' | 'declined'>('requested');
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [cancelConfirmId, setCancelConfirmId] = useState<string | null>(null);

  const handleCancelBooking = async (id: string) => {
    try {
      const token = Cookies.get('stayzo_token');
      if (!token) return;
      const res = await fetch(`http://localhost:3001/api/bookings/${id}/cancel`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b));
        setCancelConfirmId(null);
      } else {
        alert('Failed to cancel booking');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch Wishlist
  useEffect(() => {
    const saved = localStorage.getItem('stayzo_wishlist');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const idsArray = parsed.map((item: any) => typeof item === 'object' ? String(item.id) : String(item));
        
        const mockIds = ["1", "3", "11", "12"];
        const cleanIds = idsArray.filter((id: string) => !mockIds.includes(id));

        if (cleanIds.length === 0) {
          setWishlist([]);
          setLoading(false);
          return;
        }

        const fetchAll = async () => {
          const fetchPromises = cleanIds.map(async (id: string) => {
            try {
              const res = await fetch(`http://localhost:3001/api/properties/${id}`);
              if (!res.ok) return null;
              const data = await res.json();
              return {
                id: data.id,
                title: data.title,
                address: `${data.city || 'Colombo'}, ${data.state || 'Western'}`,
                beds: data.bedrooms || 1,
                baths: data.bathrooms || 1,
                halls: data.hall || 1,
                price: `Rs. ${Number(data.price || data.rentPerMonth || 0).toLocaleString()}`,
                image: data.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80'
              };
            } catch (err) {
              console.error(err);
              return null;
            }
          });
          const results = await Promise.all(fetchPromises);
          const validResults = results.filter(Boolean) as WishlistItem[];
          setWishlist(validResults);
          
          const validIds = validResults.map(item => String(item.id));
          localStorage.setItem('stayzo_wishlist', JSON.stringify(validIds));
          setLoading(false);
        };
        fetchAll();
      } catch (e) {
        console.error('Error parsing wishlist', e);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch Bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = Cookies.get('stayzo_token');
        if (!token) return;
        const res = await fetch('http://localhost:3001/api/bookings/tenant', {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store'
        });
        if (res.ok) {
          const data = await res.json();
          // Only show direct property bookings (PropertyBooking) which have no slot
          setBookings(Array.isArray(data) ? data.filter((b: any) => b.slot === null) : []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingBookings(false);
      }
    };
    fetchBookings();
  }, []);

  const handleRemove = (id: string | number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const updatedList = wishlist.filter(item => item.id !== id);
    setWishlist(updatedList);
    const updatedIds = updatedList.map(item => String(item.id));
    localStorage.setItem('stayzo_wishlist', JSON.stringify(updatedIds));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Properties
          </h2>
          <p className="text-gray-500 text-xs font-semibold mt-1">
            Manage your saved properties and booking requests.
          </p>
        </div>
        <Link
          href="/search"
          className="shrink-0 text-xs font-bold text-[#4F46E5] bg-[#EEF2FF] hover:bg-[#E0E7FF] px-5 py-2.5 rounded-xl transition duration-200 shadow-xs cursor-pointer"
        >
          Browse more properties
        </Link>
      </div>

      <div className="flex border-b border-gray-200 mb-8 select-none">
        <button 
          onClick={() => setActiveTab('booking')}
          className={`mr-8 pb-4 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${
            activeTab === 'booking' 
              ? 'border-[#4F46E5] text-[#4F46E5]' 
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          Booking ({bookings.length})
        </button>
        <button 
          onClick={() => setActiveTab('saved')}
          className={`pb-4 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${
            activeTab === 'saved' 
              ? 'border-[#4F46E5] text-[#4F46E5]' 
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          Saved ({wishlist.length})
        </button>
      </div>

      {activeTab === 'saved' && (
        <div className="space-y-8">
          {loading ? (
            <div className="text-center py-24 text-gray-400 font-semibold animate-pulse">
              Loading saved properties...
            </div>
          ) : wishlist.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-[32px] p-16 shadow-sm text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto">
                <Heart className="w-7 h-7 text-gray-300" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-[#1A1A1A]">Your wishlist is empty</h3>
                <p className="text-gray-400 text-xs font-semibold mt-1.5 max-w-xs mx-auto">
                  Browse premium properties and save your favourites here to compare later.
                </p>
              </div>
              <Link
                href="/search"
                className="inline-block bg-[#1A1A1A] hover:bg-black text-white px-6 py-2.5 rounded-xl text-xs font-extrabold shadow-sm transition"
              >
                Browse Properties
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {wishlist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => router.push(`/properties/${item.id}?from=saved`)}
                  className="group bg-white border border-gray-200 hover:border-gray-400 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer"
                >
                  {/* Image Area */}
                  <div className="h-[180px] bg-gray-100 relative overflow-hidden shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                    />
                    <button
                      onClick={(e) => handleRemove(item.id, e)}
                      className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white text-[#1A1A1A] p-2.5 rounded-full shadow-sm transition z-10 cursor-pointer"
                      title="Remove from saved"
                    >
                      <Heart className="w-4 h-4 fill-[#1A1A1A] text-[#1A1A1A]" />
                    </button>
                  </div>
                  
                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-black text-[#1A1A1A] uppercase tracking-wide truncate">
                        {item.title}
                      </h3>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 mt-1.5">
                        <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                        {item.address}
                      </p>
                      
                      <p className="text-xl font-black text-[#1A1A1A] mt-4 leading-none">
                        {item.price}
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">/ mo</span>
                      </p>
                    </div>

                    {/* Specs */}
                    <div className="grid grid-cols-3 gap-2 border-t border-b border-gray-100 py-3 my-4">
                      <div className="text-center">
                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Bedrooms</p>
                        <p className="text-xs font-black text-[#1A1A1A] mt-1 flex items-center justify-center gap-1">
                          <BedDouble className="w-3 h-3 text-gray-500" />
                          {item.beds}
                        </p>
                      </div>
                      <div className="text-center border-x border-gray-100">
                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Baths</p>
                        <p className="text-xs font-black text-[#1A1A1A] mt-1 flex items-center justify-center gap-1">
                          <Bath className="w-3 h-3 text-gray-500" />
                          {item.baths}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Halls</p>
                        <p className="text-xs font-black text-[#1A1A1A] mt-1 flex items-center justify-center gap-1">
                          <Maximize className="w-3 h-3 text-gray-500" />
                          {item.halls}
                        </p>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/properties/${item.id}?from=saved`);
                        }}
                        className="flex-1 py-3 bg-gray-50 hover:bg-gray-100 text-[#1A1A1A] text-[10px] font-black uppercase tracking-widest rounded-xl transition cursor-pointer"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'booking' && (
        <div className="space-y-6">
          <div className="flex gap-3 mb-6 select-none overflow-x-auto pb-2">
            <button
              onClick={() => setBookingTab('requested')}
              className={`px-4 py-2 text-[11px] font-black uppercase tracking-widest rounded-full transition-colors whitespace-nowrap ${
                bookingTab === 'requested' ? 'bg-[#1A1A1A] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-[#1A1A1A]'
              }`}
            >
              Requested ({bookings.filter(b => b.status === 'PENDING').length})
            </button>
            <button
              onClick={() => setBookingTab('accepted')}
              className={`px-4 py-2 text-[11px] font-black uppercase tracking-widest rounded-full transition-colors whitespace-nowrap ${
                bookingTab === 'accepted' ? 'bg-[#1A1A1A] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-[#1A1A1A]'
              }`}
            >
              Accepted ({bookings.filter(b => b.status === 'CONFIRMED').length})
            </button>
            <button
              onClick={() => setBookingTab('declined')}
              className={`px-4 py-2 text-[11px] font-black uppercase tracking-widest rounded-full transition-colors whitespace-nowrap ${
                bookingTab === 'declined' ? 'bg-[#1A1A1A] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-[#1A1A1A]'
              }`}
            >
              Declined ({bookings.filter(b => b.status === 'CANCELLED' || b.status === 'REJECTED').length})
            </button>
          </div>

          {loadingBookings ? (
            <div className="text-center py-24 text-gray-400 font-semibold animate-pulse">
              Loading bookings...
            </div>
          ) : (() => {
            const filtered = bookings.filter(b => {
              if (bookingTab === 'requested') return b.status === 'PENDING';
              if (bookingTab === 'accepted') return b.status === 'CONFIRMED';
              if (bookingTab === 'declined') return b.status === 'CANCELLED' || b.status === 'REJECTED';
              return false;
            });
            return filtered.length === 0 ? (
              <div className="py-20 text-center border border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
                <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-[13px] font-bold text-gray-500 uppercase tracking-wide">No Bookings Found</p>
                <p className="text-[11px] text-gray-400 mt-1 max-w-xs mx-auto">Your requested properties will appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((request) => (
                  <div key={request.id} className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition">
                  {request.property?.images?.[0] && (
                    <div className="h-40 w-full overflow-hidden shrink-0">
                      <img src={request.property.images[0]} alt={request.property.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                        request.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                        request.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {request.status}
                      </span>
                      <p className="text-[10px] font-bold text-gray-400">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <h3 className="text-base font-black text-[#1A1A1A] uppercase tracking-wide truncate">
                      {request.property?.title}
                    </h3>
                    
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 mt-1.5 mb-4 truncate">
                      <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                      {request.property?.address}
                    </p>
                    
                    <p className="text-xs text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                      {request.property?.description || "No description provided."}
                    </p>

                    <div className="bg-gray-50 rounded-xl p-3 space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Rent Amount</span>
                        <span className="text-xs font-black text-[#1A1A1A]">Rs. {request.property?.price?.toLocaleString() || 'N/A'}</span>
                      </div>
                      {request.slot && (
                        <div className="flex justify-between">
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Slot</span>
                          <span className="text-[11px] font-bold text-gray-700">{new Date(request.slot.date).toLocaleDateString()} at {request.slot.startTime}</span>
                        </div>
                      )}
                    </div>

                    {request.status === 'PENDING' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (request.property?.id) router.push(`/properties/${request.property.id}?from=booking`);
                          }}
                          className="flex-1 bg-[#1A1A1A] hover:bg-black text-white text-[11px] font-black tracking-widest uppercase py-3 rounded-xl transition shadow-sm cursor-pointer"
                        >
                          View Property
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCancelConfirmId(request.id);
                          }}
                          className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 text-[11px] font-black tracking-widest uppercase py-3 rounded-xl transition shadow-sm cursor-pointer"
                        >
                          Cancel Booking
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (request.property?.id) router.push(`/properties/${request.property.id}?from=booking`);
                        }}
                        className="w-full bg-[#1A1A1A] hover:bg-black text-white text-[11px] font-black tracking-widest uppercase py-3 rounded-xl transition shadow-sm cursor-pointer"
                      >
                        View Property
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            );
          })()}
        </div>
      )}

      {/* ── Cancel Booking Confirmation Modal ── */}
      {cancelConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <X className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#1A1A1A]">Cancel Booking Request</h3>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                  Are you sure you want to cancel this booking request? This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-3 w-full mt-4">
                <button 
                  onClick={() => setCancelConfirmId(null)}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-bold uppercase tracking-widest rounded-xl transition cursor-pointer"
                >
                  Close
                </button>
                <button 
                  onClick={() => handleCancelBooking(cancelConfirmId)}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold uppercase tracking-widest rounded-xl shadow-md active:scale-95 transition cursor-pointer"
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
