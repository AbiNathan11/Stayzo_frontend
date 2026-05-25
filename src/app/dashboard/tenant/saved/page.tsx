"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Heart, Trash2, BedDouble, Bath, Maximize2, Scale,
  ChevronLeft, ChevronRight, Share2, HelpCircle, 
  CheckCircle, Calendar, MapPin, Sparkles, Star, 
  Play, Video, Compass, ArrowLeft, X, Check, Eye, ExternalLink
} from 'lucide-react';

interface WishlistItem {
  id: number;
  title: string;
  address: string;
  beds: number;
  baths: number;
  sqft: number;
  price: string;
  image: string;
  noiseLevel: string;
  tenantCount: number;
  rating: number;
  reviewsCount: number;
  images: string[];
  landlord: {
    name: string;
    avatar: string;
    rating: number;
    reviewsCount: number;
    isVerified: boolean;
    isExcellent: boolean;
  };
  universities: { name: string; distance: string }[];
  about: string[];
  highlights: { title: string; desc: string }[];
  places: { type: string; count: number; size: string }[];
}

export default function SavedPropertiesPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([
    {
      id: 1,
      title: "Ahlers & Ogletree Villa",
      address: "132 Northbrooke Trce, Woodstock, GA",
      beds: 6,
      baths: 4,
      sqft: 2797,
      price: "$2,695",
      noiseLevel: "Low (Suburban)",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      images: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      ],
      tenantCount: 85,
      rating: 4.89,
      reviewsCount: 142,
      landlord: {
        name: "Miguel",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        rating: 4.9,
        reviewsCount: 118,
        isVerified: true,
        isExcellent: true
      },
      universities: [
        { name: "Kennesaw State University", distance: "4.5 km" },
        { name: "Chattahoochee Technical College", distance: "6.2 km" },
        { name: "Woodstock Campus", distance: "2.1 km" }
      ],
      about: [
        "Fully furnished luxury bedrooms with large study desk and high-speed fiber internet.",
        "Weekly deep cleaning of common spaces, kitchen, and bathrooms included in rent.",
        "PROMO FLASH SUMMER: No booking fee for moves before August 2026.",
        "PROMO EARLY BOOKING: Get 10% off the first three months of rent."
      ],
      highlights: [
        { title: "High-speed Wi-Fi", desc: "Up to 1 Gbps fiber optics" },
        { title: "Chef's Kitchen", desc: "Equipped with modern appliances" },
        { title: "In-unit Laundry", desc: "Washer, dryer, and iron facilities" },
        { title: "Private Garden", desc: "Backyard garden & outdoor patio" }
      ],
      places: [
        { type: "Studio", count: 1, size: "28 m²+" },
        { type: "Private room", count: 4, size: "18 m²+" }
      ]
    },
    {
      id: 3,
      title: "Villa Tropical Cana",
      address: "540 Belle Gate Pl, Cary, NC",
      beds: 8,
      baths: 5,
      sqft: 3875,
      price: "$3,300",
      noiseLevel: "Medium (City Edge)",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      images: [
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      ],
      tenantCount: 124,
      rating: 4.95,
      reviewsCount: 215,
      landlord: {
        name: "Sophia",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        rating: 4.95,
        reviewsCount: 184,
        isVerified: true,
        isExcellent: true
      },
      universities: [
        { name: "North Carolina State University", distance: "8.1 km" },
        { name: "Wake Technical Community College", distance: "5.0 km" },
        { name: "Duke University (Cary Transit)", distance: "12 km" }
      ],
      about: [
        "Resort-style accommodation with tropical private garden and swimming pool.",
        "Complimentary fortnightly room clean and fresh bed linen service.",
        "PROMO EXCLUSIVE: 15% off rent for bookings extending beyond 12 months.",
        "No administration or key deposits required for verified students."
      ],
      highlights: [
        { title: "Swimming Pool", desc: "Private access poolside sun beds" },
        { title: "Games Lounge", desc: "Indoors games room & pool table" },
        { title: "On-site Gym", desc: "Equipped fitness and yoga studio" },
        { title: "Smart Security", desc: "24/7 keyless secure smart entry" }
      ],
      places: [
        { type: "Studio", count: 2, size: "32 m²+" },
        { type: "Private room", count: 6, size: "22 m²+" }
      ]
    }
  ]);

  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
  
  // Interactive detail views states
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [showMoreAbout, setShowMoreAbout] = useState(false);
  const [planType, setPlanType] = useState<'month' | 'dates'>('dates');
  
  // Custom interactive date state
  const [checkInDate, setCheckInDate] = useState('2026-06-10');
  const [checkOutDate, setCheckOutDate] = useState('2026-07-16');

  // Media Modals States
  const [activeModal, setActiveModal] = useState<'photos' | 'video' | 'tour' | null>(null);
  
  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleRemoveFromWishlist = (id: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setWishlist(wishlist.filter(item => item.id !== id));
    if (selectedPropertyId === id) {
      setSelectedPropertyId(null);
    }
    triggerToast("Property removed from saved wishlist.");
  };

  const handlePrevImage = (imagesLength: number) => {
    setActiveImgIndex((prev) => (prev === 0 ? imagesLength - 1 : prev - 1));
  };

  const handleNextImage = (imagesLength: number) => {
    setActiveImgIndex((prev) => (prev === imagesLength - 1 ? 0 : prev + 1));
  };

  const selectedProperty = wishlist.find(item => item.id === selectedPropertyId);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 relative">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#1A1A1A] border border-gray-800 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* -------------------- MAIN LISTINGS VIEW -------------------- */}
      {!selectedProperty ? (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Saved Properties</h2>
              <p className="text-gray-500 text-xs font-semibold mt-1">Your bookmarked premium stays and comparison matrix.</p>
            </div>
          </div>

          {wishlist.length === 0 ? (
            <div className="bg-white border border-gray-150 rounded-[32px] p-12 shadow-sm text-center space-y-4">
              <Heart className="w-10 h-10 text-gray-300 mx-auto" />
              <h3 className="text-lg font-extrabold text-gray-900">Your wishlist is empty</h3>
              <Link href="/search" className="inline-block bg-[#1A1A1A] hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-extrabold shadow-sm mt-2">
                Browse properties
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlist.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => {
                    setSelectedPropertyId(item.id);
                    setActiveImgIndex(0);
                  }}
                  className="bg-white border border-gray-200 hover:border-gray-400 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition duration-300 flex flex-col group cursor-pointer"
                >
                  {/* Top Side: Image */}
                  <div className="h-[220px] w-full bg-gray-50 relative shrink-0 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-105" 
                    />
                    <button 
                      onClick={(e) => handleRemoveFromWishlist(item.id, e)} 
                      className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white text-[#1A1A1A] p-2.5 rounded-full shadow-sm transition z-10"
                      title="Remove from saved"
                    >
                      <Heart className="w-4 h-4 fill-[#1A1A1A] text-[#1A1A1A]" />
                    </button>
                  </div>
                  
                  {/* Bottom Side: Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-[#1A1A1A] leading-tight group-hover:text-black transition-colors">{item.title}</h3>
                      </div>
                      <p className="text-gray-500 text-xs font-medium mb-4">{item.address}</p>
                    </div>

                    <div className="flex items-center space-x-4 text-xs font-semibold text-gray-700 mb-4">
                      <span className="flex items-center gap-1.5"><BedDouble className="w-3.5 h-3.5 text-[#1A1A1A]" />{item.beds} Beds</span>
                      <span className="flex items-center gap-1.5"><Bath className="w-3.5 h-3.5 text-[#1A1A1A]" />{item.baths} Baths</span>
                      <span className="flex items-center gap-1.5"><Maximize2 className="w-3.5 h-3.5 text-[#1A1A1A]" />{item.sqft} sqft</span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        <span className="text-lg font-extrabold text-[#1A1A1A]">{item.price}</span>
                        <span className="text-[10px] text-gray-400 font-semibold uppercase ml-1">/mo</span>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPropertyId(item.id);
                          setActiveImgIndex(0);
                        }}
                        className="bg-[#1A1A1A] hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        // -------------------- DETAILED PROPERTY VIEW --------------------
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Header Actions Row */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <button 
              onClick={() => setSelectedPropertyId(null)}
              className="group flex items-center space-x-2 text-xs font-bold text-gray-500 hover:text-[#1A1A1A] transition"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Saved Properties</span>
            </button>
            
            <button 
              onClick={(e) => handleRemoveFromWishlist(selectedProperty.id, e)}
              className="flex items-center space-x-1.5 text-xs font-bold text-red-500 hover:text-red-600 transition"
            >
              <Trash2 className="w-4 h-4" />
              <span>Remove from Wishlist</span>
            </button>
          </div>

          {/* Core Grid System: Left Details (2/3), Right Booking Sidebar (1/3) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left Side: Media Gallery, Info, Highlights */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Top Premium Media Box */}
              <div>
                <div className="h-[420px] w-full bg-gray-150 rounded-[32px] overflow-hidden relative shadow-sm group">
                  {/* Main Active Gallery Image */}
                  <img 
                    src={selectedProperty.images[activeImgIndex]} 
                    alt={`${selectedProperty.title} view ${activeImgIndex + 1}`}
                    className="w-full h-full object-cover transition-all duration-500" 
                  />

                  {/* Left & Right Navigation Arrows */}
                  <button 
                    onClick={() => handlePrevImage(selectedProperty.images.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white text-[#1A1A1A] rounded-full shadow-md flex items-center justify-center transition active:scale-95 z-10"
                    title="Previous photo"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleNextImage(selectedProperty.images.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white text-[#1A1A1A] rounded-full shadow-md flex items-center justify-center transition active:scale-95 z-10"
                    title="Next photo"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Top Overlay Badges */}
                  <div className="absolute top-4 left-4 flex gap-2 z-10 select-none">
                    <div 
                      onClick={() => triggerToast("Stayzo Certified Premium property.")}
                      className="bg-white/90 backdrop-blur-sm text-gray-800 text-[11px] font-bold px-3.5 py-1.5 rounded-full shadow-sm flex items-center gap-1 cursor-pointer hover:bg-white transition"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-gray-500" />
                      <span>Premium Residence?</span>
                    </div>
                    <div className="bg-[#1A1A1A] text-white text-[11px] font-bold px-3.5 py-1.5 rounded-full shadow-sm flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
                      <span>Confirmed Stayzo</span>
                    </div>
                  </div>

                  {/* Top Right Action Button: Share */}
                  <button 
                    onClick={() => triggerToast("Property link copied to clipboard!")}
                    className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white text-[#1A1A1A] p-2.5 rounded-full shadow-md transition active:scale-95 z-10"
                    title="Share property details"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Bottom Gallery Thumbnails (Screenshot 2 style) */}
                <div className="grid grid-cols-6 gap-3 mt-4">
                  {selectedProperty.images.slice(0, 3).map((img, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setActiveImgIndex(idx)}
                      className={`h-16 md:h-20 rounded-2xl overflow-hidden cursor-pointer border-2 transition duration-200 relative ${
                        activeImgIndex === idx ? 'border-[#1A1A1A] scale-[0.98]' : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img src={img} alt="preview thumbnail" className="w-full h-full object-cover" />
                    </div>
                  ))}

                  {/* Thumbnail 4: "+18 more photos" */}
                  <div 
                    onClick={() => setActiveModal('photos')}
                    className="h-16 md:h-20 rounded-2xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-gray-300 transition relative"
                  >
                    <img src={selectedProperty.images[3]} alt="preview thumbnail" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-bold text-center">
                      18+ photos
                    </div>
                  </div>

                  {/* Thumbnail 5: "Videos" */}
                  <div 
                    onClick={() => setActiveModal('video')}
                    className="h-16 md:h-20 rounded-2xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-gray-300 transition relative"
                  >
                    <img src={selectedProperty.images[1]} alt="preview thumbnail" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white text-[10px] font-bold">
                      <Play className="w-4 h-4 mb-0.5 fill-white" />
                      Videos
                    </div>
                  </div>

                  {/* Thumbnail 6: "3D Tour" */}
                  <div 
                    onClick={() => setActiveModal('tour')}
                    className="h-16 md:h-20 rounded-2xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-gray-300 transition relative"
                  >
                    <img src={selectedProperty.images[2]} alt="preview thumbnail" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white text-[10px] font-bold">
                      <Compass className="w-4 h-4 mb-0.5" />
                      3D tour
                    </div>
                  </div>
                </div>
              </div>

              {/* Title & Core Subtitle Row */}
              <div>
                <h1 className="text-3xl font-black text-[#1A1A1A] tracking-tight">{selectedProperty.title}</h1>
                
                <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-gray-500 mt-2.5">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    {selectedProperty.address}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="flex items-center gap-1 text-[#1A1A1A]">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    {selectedProperty.tenantCount} tenants have successfully called this place home
                  </span>
                </div>
              </div>

              {/* Universities Nearby Tags (Screenshot 1 style) */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Universities nearby:</h4>
                <div className="flex flex-wrap gap-2.5">
                  {selectedProperty.universities.map((uni, index) => (
                    <div 
                      key={index}
                      className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-[#1A1A1A] flex items-center gap-1.5 shadow-xs hover:border-gray-300 transition"
                    >
                      <MapPin className="w-3.5 h-3.5 text-red-500 fill-red-500/10 shrink-0" />
                      <span>{uni.name} • {uni.distance}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* About Section with promo points (Screenshot 1 style) */}
              <div className="border-t border-gray-100 pt-6">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">About this residence</h4>
                
                <div className="space-y-4">
                  {/* Point 1: Diamond Bullet */}
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rotate-45 shrink-0 mt-1.5"></div>
                    <p className="text-xs font-semibold text-gray-700 leading-relaxed">
                      Cleaning room, change of sheets and towel included in the price. It is fortnightly.
                    </p>
                  </div>

                  {/* Point 2: Promo Star Bullet */}
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5 animate-pulse" />
                    <p className="text-xs font-bold text-[#1A1A1A] leading-relaxed">
                      {selectedProperty.about[2]}
                    </p>
                  </div>

                  {/* Point 3: Promo Star Bullet */}
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5 animate-pulse" />
                    <p className="text-xs font-bold text-[#1A1A1A] leading-relaxed">
                      {selectedProperty.about[3]}
                    </p>
                  </div>

                  {/* Expandable Section */}
                  {showMoreAbout && (
                    <div className="space-y-4 pt-1 animate-in fade-in duration-300">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-orange-500 rotate-45 shrink-0 mt-1.5"></div>
                        <p className="text-xs font-semibold text-gray-700 leading-relaxed">
                          {selectedProperty.about[0]}
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-orange-500 rotate-45 shrink-0 mt-1.5"></div>
                        <p className="text-xs font-semibold text-gray-700 leading-relaxed">
                          {selectedProperty.about[1]}
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-orange-500 rotate-45 shrink-0 mt-1.5"></div>
                        <p className="text-xs font-semibold text-gray-700 leading-relaxed">
                          Secure lease term agreements managed digitally with KYC verified vault data.
                        </p>
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={() => setShowMoreAbout(!showMoreAbout)}
                    className="text-xs font-black text-[#1A1A1A] hover:underline block pt-2 cursor-pointer"
                  >
                    {showMoreAbout ? "Show less" : "Show more"}
                  </button>
                </div>
              </div>

              {/* Highlights List */}
              <div className="border-t border-gray-100 pt-6">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Highlights</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedProperty.highlights.map((h, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-150 rounded-2xl"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#1A1A1A] shrink-0 font-bold border border-gray-100">
                        {idx === 0 && <Compass className="w-5 h-5" />}
                        {idx === 1 && <Maximize2 className="w-5 h-5" />}
                        {idx === 2 && <BedDouble className="w-5 h-5" />}
                        {idx === 3 && <Sparkles className="w-5 h-5" />}
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-[#1A1A1A]">{h.title}</h5>
                        <p className="text-[10px] text-gray-500 font-semibold mt-0.5">{h.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Side Sticky Sidebar: Landlord & Pricing/Booking */}
            <div className="space-y-6 lg:sticky lg:top-24">
              
              {/* Landlord Profile Card */}
              <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm flex items-center gap-4 relative overflow-hidden group">
                <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 bg-gray-50 border border-gray-100 shadow-inner">
                  <img 
                    src={selectedProperty.landlord.avatar} 
                    alt={selectedProperty.landlord.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="font-extrabold text-base text-[#1A1A1A] truncate">{selectedProperty.landlord.name}</div>
                  
                  <div className="flex items-center text-xs font-bold text-gray-500 mt-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 mr-1" />
                    <span>{selectedProperty.landlord.rating} ({selectedProperty.landlord.reviewsCount})</span>
                  </div>

                  <div className="flex gap-2 mt-2">
                    {selectedProperty.landlord.isVerified && (
                      <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 flex items-center gap-0.5 shadow-xs">
                        <Check className="w-2.5 h-2.5" /> Verified
                      </span>
                    )}
                    {selectedProperty.landlord.isExcellent && (
                      <span className="text-[9px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 flex items-center gap-0.5 shadow-xs">
                        ★ Excellent Landlord
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Booking and Price Card */}
              <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col space-y-6">
                
                {/* Price block */}
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">From</span>
                    <div className="flex items-baseline">
                      <span className="text-3xl font-black tracking-tight text-[#1A1A1A]">{selectedProperty.price}</span>
                      <span className="text-xs text-gray-400 font-bold ml-1">/month</span>
                    </div>
                  </div>
                  
                  <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-extrabold px-3 py-1 rounded-lg shrink-0 shadow-xs">
                    Get up to 8% off
                  </span>
                </div>

                {/* Summary Info */}
                <p className="text-xs text-gray-500 font-semibold leading-relaxed border-t border-gray-100 pt-4">
                  The residence offers a range of fully furnished private suites and shared rooms, ranging from 15 m² to 35 m², along with premium common amenities.
                </p>

                {/* Available places lists */}
                <div className="space-y-2 border-t border-gray-100 pt-4">
                  <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Available places</h5>
                  {selectedProperty.places.map((place, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs font-bold text-gray-700">
                      <span>{place.type} ({place.count})</span>
                      <span className="text-gray-500 font-medium">{place.size}</span>
                    </div>
                  ))}
                </div>

                {/* Plan your move dates (Screenshot 1 styled date block) */}
                <div className="border-t border-gray-100 pt-4 space-y-4">
                  <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Plan your move</h5>
                  
                  {/* Mode Selector Tabs */}
                  <div className="grid grid-cols-2 bg-gray-50 p-1 border border-gray-150 rounded-xl select-none">
                    <button 
                      onClick={() => setPlanType('month')}
                      className={`text-xs font-bold py-2 rounded-lg text-center transition ${
                        planType === 'month' ? 'bg-[#1A1A1A] text-white shadow-xs' : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      By month
                    </button>
                    <button 
                      onClick={() => setPlanType('dates')}
                      className={`text-xs font-bold py-2 rounded-lg text-center transition ${
                        planType === 'dates' ? 'bg-[#1A1A1A] text-white shadow-xs' : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      Exact dates
                    </button>
                  </div>

                  {/* Dates input boxes */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-3 shadow-xs hover:border-gray-400 transition cursor-pointer">
                      <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                      <div className="flex-1 flex gap-2 items-center text-xs font-bold text-gray-700">
                        <input 
                          type="date" 
                          value={checkInDate}
                          onChange={(e) => setCheckInDate(e.target.value)}
                          className="bg-transparent border-none p-0 focus:ring-0 outline-none w-full text-center cursor-pointer"
                        />
                        <span className="text-gray-300 font-normal">to</span>
                        <input 
                          type="date" 
                          value={checkOutDate}
                          onChange={(e) => setCheckOutDate(e.target.value)}
                          className="bg-transparent border-none p-0 focus:ring-0 outline-none w-full text-center cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Primary Booking Call-To-Action Button */}
                <button 
                  onClick={() => triggerToast(`Booking request sent to ${selectedProperty.landlord.name}! They will reply within 24 hours.`)}
                  className="w-full bg-[#1A1A1A] hover:bg-black text-white py-3.5 rounded-xl text-xs font-extrabold transition shadow-sm uppercase tracking-wider active:scale-[0.98]"
                >
                  Show available places
                </button>

              </div>

            </div>

          </div>

          {/* -------------------- HIGH-FIDELITY OVERLAY MODALS -------------------- */}

          {/* Image Gallery Viewer Modal */}
          {activeModal === 'photos' && (
            <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200">
              <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[85vh] overflow-y-auto p-6 md:p-8 relative shadow-2xl space-y-6">
                <button 
                  onClick={() => setActiveModal(null)}
                  className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 p-2 rounded-full text-gray-600 transition"
                  title="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>

                <div>
                  <h3 className="text-xl font-black text-[#1A1A1A]">{selectedProperty.title} Photo Gallery</h3>
                  <p className="text-xs text-gray-500 mt-1 font-semibold">Browse high definition snapshots of the luxury residence rooms and amenities.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedProperty.images.map((img, index) => (
                    <div key={index} className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
                      <img src={img} alt={`Gallery view ${index + 1}`} className="w-full h-full object-cover hover:scale-102 transition duration-300" />
                    </div>
                  ))}
                  {/* Mock additional image cards to fulfill "18+ photos" */}
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-150 border border-gray-100 flex items-center justify-center text-center p-6">
                    <div className="space-y-2">
                      <Sparkles className="w-6 h-6 mx-auto text-[#1A1A1A]" />
                      <h4 className="text-sm font-bold text-gray-700">14 More Private Rooms Images</h4>
                      <p className="text-[10px] text-gray-400 font-semibold leading-relaxed">Images will be unlocked upon completing landlord identity pre-verification.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Video Player Modal */}
          {activeModal === 'video' && (
            <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
              <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden relative shadow-2xl">
                <button 
                  onClick={() => setActiveModal(null)}
                  className="absolute top-4 right-4 bg-white/95 hover:bg-white p-2 rounded-full text-gray-800 shadow-md transition z-10"
                  title="Close video"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Video screen container */}
                <div className="relative aspect-[16/9] w-full bg-black flex items-center justify-center overflow-hidden">
                  <img 
                    src={selectedProperty.images[1]} 
                    alt="Video thumbnail" 
                    className="absolute inset-0 w-full h-full object-cover opacity-70 filter brightness-[0.7]" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  
                  {/* Play video overlay UI */}
                  <div className="relative z-10 text-center space-y-4 px-8">
                    <div className="w-16 h-16 rounded-full bg-white/95 text-[#1A1A1A] flex items-center justify-center mx-auto shadow-xl cursor-pointer hover:scale-105 active:scale-95 transition">
                      <Play className="w-6 h-6 fill-[#1A1A1A] translate-x-0.5" />
                    </div>
                    <div>
                      <h4 className="text-base font-extrabold text-white">Interactive Video Walkthrough</h4>
                      <p className="text-xs text-gray-300 font-semibold mt-1">Touring common spaces, kitchen, study areas, and bedroom suite layout.</p>
                    </div>
                  </div>

                  {/* Video player controls bar mockup */}
                  <div className="absolute bottom-0 inset-x-0 p-4 flex items-center justify-between text-white text-[10px] font-bold z-10">
                    <div className="flex items-center gap-2">
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>0:00 / 2:45</span>
                    </div>
                    <div className="flex-1 mx-4 h-1 bg-white/30 rounded-full relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1/4 bg-[#1A1A1A]"></div>
                    </div>
                    <span>1080p HD</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3D Virtual Tour Modal */}
          {activeModal === 'tour' && (
            <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
              <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden relative shadow-2xl">
                <button 
                  onClick={() => setActiveModal(null)}
                  className="absolute top-4 right-4 bg-white/95 hover:bg-white p-2 rounded-full text-gray-800 shadow-md transition z-10"
                  title="Close 3D tour"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* 3D panoramic viewer mockup */}
                <div className="relative h-[450px] w-full bg-slate-900 overflow-hidden flex items-center justify-center">
                  <img 
                    src={selectedProperty.images[2]} 
                    alt="3D Viewport" 
                    className="absolute inset-0 w-full h-full object-cover opacity-80 filter brightness-[0.8] scale-110 blur-xs animate-pulse duration-[6s]" 
                  />
                  <div className="absolute inset-0 bg-black/30"></div>
                  
                  {/* Virtual sphere overlay */}
                  <div className="relative z-10 text-center space-y-4 max-w-sm px-6">
                    <div className="w-20 h-20 rounded-full border-2 border-white/55 flex items-center justify-center mx-auto" style={{ animation: 'spin 12s linear infinite' }}>
                      <Compass className="w-8 h-8 text-white" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-lg font-black text-white tracking-wide">3D Virtual Space Tour</h4>
                      <p className="text-xs text-gray-300 font-semibold leading-relaxed">
                        Drag to explore the room in full 360-degree panoramic perspective. Select hotspots to move through doors.
                      </p>
                      <button 
                        onClick={() => triggerToast("Loading high-definition panoramic render...")}
                        className="bg-white text-[#1A1A1A] hover:bg-gray-100 px-5 py-2.5 rounded-xl text-xs font-bold mt-4 shadow-sm transition active:scale-95 flex items-center gap-1.5 mx-auto"
                      >
                        Enter Virtual Tour <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* UI Navigation Overlay */}
                  <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-3 py-1.5 rounded-lg">
                    Bedroom Suite 1 • Hotspots Active
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
