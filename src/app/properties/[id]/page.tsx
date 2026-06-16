"use client";

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Heart, BedDouble, Bath, Maximize2,
  ChevronLeft, ChevronRight, Share2, HelpCircle,
  CheckCircle, Calendar, MapPin, Sparkles, Star,
  Play, Compass, ArrowLeft, X, Check, ExternalLink, MessageCircle
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { useNearbyAmenities } from '@/hooks/useNearbyAmenities';
import type { AmenityCategory } from '@/services/google/places';

// Dynamically import map component to avoid SSR issues
const PropertyMap      = dynamic(() => import('@/components/maps/PropertyMap'),      { ssr: false, loading: () => <div className="w-full h-[320px] rounded-3xl bg-gray-100 animate-pulse" /> });
const NearbyAmenities  = dynamic(() => import('@/components/maps/NearbyAmenities'),  { ssr: false });
const NoiseAnalysisCard = dynamic(() => import('@/components/maps/NoiseAnalysisCard'), { ssr: false });

// ── DB-aligned interface ──────────────────────────────────────────────────────
interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  address: string;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  type: string;
  status: string;
  images: string[];
  panoramaImage: string | null;
  waterBillImage: string | null;
  amenities: string[];
  createdAt: string;
  owner: {
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
  latitude: number | null;
  longitude: number | null;
  noisePrediction?: {
    noiseLevelScore: number;
    label: 'Low' | 'Medium' | 'High';
    color: 'green' | 'yellow' | 'red';
    explanation: string;
    factors: { name: string; contribution: number; description: string }[];
  } | null;
}

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80';

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [showMoreAbout, setShowMoreAbout]   = useState(false);
  const [planType, setPlanType]             = useState<'month' | 'dates'>('dates');
  const [checkInDate, setCheckInDate]       = useState('2026-06-10');
  const [checkOutDate, setCheckOutDate]     = useState('2026-07-16');
  const [activeModal, setActiveModal]       = useState<'photos' | 'video' | 'tour' | null>(null);
  const [toastMessage, setToastMessage]     = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked]     = useState(false);
  const [mapActiveCategories, setMapActiveCategories] = useState<AmenityCategory[]>([]);

  // ── Fetch property by ID ────────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    const fetchProperty = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3001/api/properties/${id}`);
        if (!res.ok) throw new Error(res.status === 404 ? 'Property not found.' : 'Failed to load property.');
        const data: Property = await res.json();
        setProperty(data);
      } catch (err: any) {
        setError(err.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleBookmarkToggle = () => {
    setIsBookmarked(!isBookmarked);
    triggerToast(isBookmarked ? 'Removed from wishlist.' : 'Saved to your wishlist!');
  };

  const ownerName = property
    ? `${property.owner?.firstName ?? ''} ${property.owner?.lastName ?? ''}`.trim() || property.owner?.email
    : '';

  const handleChatWithOwner = async () => {
    const token = sessionStorage.getItem('stayzo_token');
    if (!token) {
      triggerToast('Please sign in to chat with the owner.');
      setTimeout(() => {
        router.push(`/auth?redirect=/properties/${id}`);
      }, 1500);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const tenantId = payload.id;

      if (!tenantId) {
        throw new Error('Invalid session');
      }

      triggerToast(`Starting chat with ${ownerName}...`);
      
      const res = await fetch('http://localhost:3001/api/chat/thread', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId, propertyId: id })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to initialize chat');
      }

      const data = await res.json();
      router.push(`/dashboard/tenant/chat?threadId=${data.thread.id}`);
    } catch (error: any) {
      triggerToast(error.message || 'Failed to start chat.');
    }
  };

  const images = property?.images?.length ? property.images : [FALLBACK_IMG];
  const prev   = () => setActiveImgIndex(i => (i === 0 ? images.length - 1 : i - 1));
  const next   = () => setActiveImgIndex(i => (i === images.length - 1 ? 0 : i + 1));

  const fullAddress = property
    ? [property.address, property.city, property.state, property.zipCode].filter(Boolean).join(', ')
    : '';

  // ── Nearby amenities via Google Maps APIs ───────────────────────────────────
  const { coords, amenities, loading: amenitiesLoading, error: amenitiesError } =
    useNearbyAmenities(fullAddress || null, property?.latitude, property?.longitude, 3000);

  // ── Loading / Error states ──────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-white text-[#1A1A1A] font-sans flex flex-col relative animate-pulse">
      <div className="flex-1 max-w-[1200px] w-full mx-auto px-6 sm:px-10 py-8 lg:py-12">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
          <div className="h-4 w-32 bg-gray-200 rounded-lg" />
          <div className="h-4 w-28 bg-gray-200 rounded-lg" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Main Image Slider Skeleton */}
            <div>
              <div className="h-[420px] w-full bg-gray-100 rounded-[32px]" />
              {/* Thumbnails Skeleton */}
              <div className="grid grid-cols-6 gap-3 mt-4">
                {[...Array(5)].map((_, idx) => (
                  <div key={idx} className="h-16 md:h-20 rounded-2xl bg-gray-100" />
                ))}
                <div className="h-16 md:h-20 rounded-2xl bg-gray-100" />
              </div>
            </div>

            {/* Title & Address Skeleton */}
            <div className="space-y-3">
              <div className="h-9 w-3/4 bg-gray-200 rounded-xl" />
              <div className="h-4 w-1/2 bg-gray-100 rounded-lg" />
            </div>

            {/* Amenities Skeleton */}
            <div className="space-y-3">
              <div className="h-4 w-20 bg-gray-200 rounded-md" />
              <div className="flex flex-wrap gap-2.5">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-9 w-24 bg-gray-100 rounded-xl" />
                ))}
              </div>
            </div>

            {/* Description Skeleton */}
            <div className="border-t border-gray-100 pt-6 space-y-3">
              <div className="h-4 w-32 bg-gray-200 rounded-md" />
              <div className="h-3 w-full bg-gray-100 rounded-md" />
              <div className="h-3 w-5/6 bg-gray-100 rounded-md" />
              <div className="h-3 w-2/3 bg-gray-100 rounded-md" />
            </div>

            {/* Highlights Grid Skeleton */}
            <div className="border-t border-gray-100 pt-6 space-y-4">
              <div className="h-4 w-24 bg-gray-200 rounded-md" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm shrink-0 border border-gray-100" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 w-12 bg-gray-200 rounded" />
                      <div className="h-4 w-8 bg-gray-300 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Owner Card Skeleton */}
            <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gray-200 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded-md" />
                <div className="h-3.5 w-16 bg-gray-200 rounded-md" />
              </div>
            </div>

            {/* Pricing & Booking Card Skeleton */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col space-y-6">
              <div className="space-y-2">
                <div className="h-3 w-10 bg-gray-200 rounded" />
                <div className="h-8 w-36 bg-gray-300 rounded-md" />
              </div>
              <div className="h-4 w-full bg-gray-100 rounded-md" />
              
              {/* Date Planner Skeleton */}
              <div className="border-t border-gray-100 pt-4 space-y-3">
                <div className="h-3.5 w-24 bg-[#1A1A1A]/10 rounded" />
                <div className="h-9 w-full bg-gray-100 rounded-xl" />
                <div className="h-11 w-full bg-gray-100 rounded-xl" />
              </div>

              <div className="space-y-3">
                <div className="h-11 w-full bg-gray-300 rounded-xl" />
                <div className="h-11 w-full bg-gray-200 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (error || !property) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center space-y-4 max-w-sm px-6">
        <p className="text-2xl font-black text-[#1A1A1A]">Property Not Found</p>
        <p className="text-sm text-gray-500">{error ?? 'This listing may have been removed.'}</p>
        <Link href="/search" className="inline-block mt-4 bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-full">
          Back to Search
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] font-sans selection:bg-[#1A1A1A] selection:text-white flex flex-col relative">

      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 bg-[#1A1A1A] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      <div className="flex-1 max-w-[1200px] w-full mx-auto px-6 sm:px-10 py-8 lg:py-12">

        {/* Breadcrumb */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
          <Link href="/search" className="group flex items-center space-x-2 text-xs font-bold text-gray-500 hover:text-[#1A1A1A] transition">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Search Results</span>
          </Link>
          <button onClick={handleBookmarkToggle} className="flex items-center space-x-1.5 text-xs font-bold text-gray-600 hover:text-[#1A1A1A] transition">
            <Heart className={`w-4 h-4 transition-colors ${isBookmarked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
            <span>{isBookmarked ? 'Saved in Wishlist' : 'Save to Wishlist'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">

            {/* Main Image Slider */}
            <div>
              <div className="h-[420px] w-full bg-gray-100 rounded-[32px] overflow-hidden relative shadow-sm group">
                <img
                  src={images[activeImgIndex]}
                  alt={`${property.title} — view ${activeImgIndex + 1}`}
                  className="w-full h-full object-cover transition-all duration-500"
                />
                <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-md flex items-center justify-center transition active:scale-95 z-10">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-md flex items-center justify-center transition active:scale-95 z-10">
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute top-4 left-4 flex gap-2 z-10">
                  <div className="bg-white/90 text-gray-800 text-[11px] font-bold px-3.5 py-1.5 rounded-full shadow-sm flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5 text-gray-500" /><span>Premium Stay?</span>
                  </div>
                  <div className="bg-[#1A1A1A] text-white text-[11px] font-bold px-3.5 py-1.5 rounded-full shadow-sm flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /><span>Confirmed</span>
                  </div>
                </div>
                <button onClick={() => triggerToast('Property link copied!')} className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2.5 rounded-full shadow-md transition z-10">
                  <Share2 className="w-4 h-4" />
                </button>
                {/* Image counter */}
                <div className="absolute bottom-4 right-4 bg-black/60 text-white text-[10px] font-bold px-3 py-1.5 rounded-full z-10">
                  {activeImgIndex + 1} / {images.length}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-6 gap-3 mt-4">
                {images.slice(0, 4).map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveImgIndex(idx)}
                    className={`h-16 md:h-20 rounded-2xl overflow-hidden cursor-pointer border-2 transition duration-200 ${activeImgIndex === idx ? 'border-[#1A1A1A] scale-[0.98]' : 'border-transparent hover:border-gray-300'}`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </div>
                ))}

                {/* All Photos */}
                <div onClick={() => setActiveModal('photos')} className="h-16 md:h-20 rounded-2xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-gray-300 transition relative">
                  <img src={images[images.length > 1 ? 1 : 0]} alt="all photos" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-[10px] font-bold text-center">{images.length}+ photos</div>
                </div>

                {/* 360 Tour — only if panoramaImage exists */}
                {property.panoramaImage ? (
                  <div onClick={() => setActiveModal('tour')} className="h-16 md:h-20 rounded-2xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-gray-300 transition relative">
                    <img src={property.panoramaImage} alt="360 tour" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white text-[10px] font-bold">
                      <Compass className="w-4 h-4 mb-0.5" />360°
                    </div>
                  </div>
                ) : (
                  <div className="h-16 md:h-20 rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300">
                    <Compass className="w-5 h-5" />
                  </div>
                )}
              </div>
            </div>

            {/* Title & Address */}
            <div>
              <h1 className="text-3xl font-black text-[#1A1A1A] tracking-tight">{property.title}</h1>
              <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-gray-500 mt-2.5">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />{fullAddress || 'Location not specified'}
                </span>
                <span className="text-gray-300">•</span>
                <span className="flex items-center gap-1 text-[#1A1A1A]">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />{property.type}
                </span>
                <span className="capitalize text-emerald-600 font-bold">{property.status}</span>
              </div>
            </div>

            {/* Amenities */}
            {property.amenities?.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Amenities</h4>
                <div className="flex flex-wrap gap-2.5">
                  {property.amenities.map((a, i) => (
                    <div key={i} className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-[#1A1A1A] flex items-center gap-1.5 shadow-sm hover:border-gray-300 transition">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {property.description && (
              <div className="border-t border-gray-100 pt-6">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">About this residence</h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rotate-45 shrink-0 mt-1.5" />
                    <p className="text-xs font-semibold text-gray-700 leading-relaxed">
                      {showMoreAbout ? property.description : property.description.slice(0, 200) + (property.description.length > 200 ? '…' : '')}
                    </p>
                  </div>
                  {property.description.length > 200 && (
                    <button onClick={() => setShowMoreAbout(!showMoreAbout)} className="text-xs font-black text-[#1A1A1A] hover:underline block pt-2">
                      {showMoreAbout ? 'Show less' : 'Show more'}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Highlights grid */}
            <div className="border-t border-gray-100 pt-6">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Property Specs</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Bedrooms', val: property.bedrooms, Icon: BedDouble },
                  { label: 'Bathrooms', val: property.bathrooms, Icon: Bath },
                  { label: 'Size (sqft)', val: property.sqft, Icon: Maximize2 },
                ].map(({ label, val, Icon }) => (
                  <div key={label} className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center border border-gray-100 shrink-0">
                      <Icon className="w-5 h-5 text-[#1A1A1A]" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{label}</p>
                      <p className="text-sm font-black text-[#1A1A1A] mt-0.5">{val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Google Map Section ────────────────────────────────────────── */}
            <div className="border-t border-gray-100 pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Location &amp; Neighbourhood</h4>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[10px] font-extrabold text-[#1A1A1A] hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />Open in Google Maps
                </a>
              </div>

              {/* Address pill */}
              {fullAddress && (
                <div className="inline-flex items-center gap-1.5 bg-[#1A1A1A] text-white text-[10px] font-bold px-3 py-1.5 rounded-full">
                  <MapPin className="w-3 h-3" />{fullAddress}
                </div>
              )}

              {/* Interactive Google Map */}
              {coords ? (
                <PropertyMap
                  coords={coords}
                  amenities={amenities}
                  propertyTitle={property.title}
                  propertyImage={images[0]}
                  activeCategories={mapActiveCategories}
                  className="h-[320px]"
                />
              ) : (
                <div className="w-full h-[320px] bg-gray-100 rounded-3xl flex items-center justify-center">
                  {amenitiesLoading
                    ? <div className="animate-pulse flex flex-col items-center gap-2"><div className="w-8 h-8 rounded-full bg-gray-300" /><div className="h-3 w-24 bg-gray-200 rounded" /></div>
                    : <p className="text-xs text-gray-400 font-semibold">Map unavailable for this address.</p>}
                </div>
              )}
            </div>

            {/* ── Nearby Amenities Section ──────────────────────────────────────── */}
            <div className="border-t border-gray-100 pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nearby Amenities</h4>
                {!amenitiesLoading && (
                  <span className="text-[10px] font-extrabold text-gray-400 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
                    within 3 km
                  </span>
                )}
              </div>
              <NearbyAmenities
                amenities={amenities}
                loading={amenitiesLoading}
                error={amenitiesError}
                onCategoryChange={setMapActiveCategories}
              />
            </div>

            {/* ── Noise Level Analysis Section ─────────────────────────────────── */}
            <div className="border-t border-gray-100 pt-6">
              <NoiseAnalysisCard noisePrediction={property.noisePrediction} />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6 lg:sticky lg:top-24">

            {/* Owner Card */}
            <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-400 to-gray-700 flex items-center justify-center text-white font-black text-lg shrink-0">
                {ownerName.charAt(0).toUpperCase() || 'O'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-extrabold text-base text-[#1A1A1A] truncate">{ownerName}</div>
                <div className="flex items-center text-xs font-bold text-gray-500 mt-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 mr-1" />
                  <span>Property Owner</span>
                </div>
                <div className="flex gap-2 mt-2">
                  <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 flex items-center gap-0.5">
                    <Check className="w-2.5 h-2.5" /> Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Pricing & Booking Card */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">From</span>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-black tracking-tight text-[#1A1A1A]">
                      Rs. {property.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-400 font-bold ml-1">/mo</span>
                  </div>
                </div>
                <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-extrabold px-3 py-1 rounded-lg shrink-0">
                  Get up to 8% off
                </span>
              </div>

              <p className="text-xs text-gray-500 font-semibold leading-relaxed border-t border-gray-100 pt-4">
                {property.bedrooms} bedroom{property.bedrooms !== 1 ? 's' : ''}, {property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}, {property.sqft} sqft — {property.type}.
              </p>

              {/* Date planner */}
              <div className="border-t border-gray-100 pt-4 space-y-4">
                <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Plan your move</h5>
                <div className="grid grid-cols-2 bg-gray-50 p-1 border border-gray-150 rounded-xl">
                  {(['month', 'dates'] as const).map(t => (
                    <button key={t} onClick={() => setPlanType(t)}
                      className={`text-xs font-bold py-2 rounded-lg transition ${planType === t ? 'bg-[#1A1A1A] text-white' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                      {t === 'month' ? 'By month' : 'Exact dates'}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-3 hover:border-gray-400 transition">
                  <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                  <div className="flex-1 flex gap-2 items-center text-xs font-bold text-gray-700">
                    <input type="date" value={checkInDate} onChange={e => setCheckInDate(e.target.value)} className="bg-transparent border-none p-0 outline-none w-full text-center" />
                    <span className="text-gray-300">to</span>
                    <input type="date" value={checkOutDate} onChange={e => setCheckOutDate(e.target.value)} className="bg-transparent border-none p-0 outline-none w-full text-center" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => triggerToast(`Booking request sent to ${ownerName}! They'll reply within 24 hours.`)}
                  className="w-full bg-[#1A1A1A] hover:bg-black text-white py-3.5 rounded-xl text-xs font-extrabold transition shadow-sm uppercase tracking-wider active:scale-[0.98]"
                >
                  Request Booking / Visit
                </button>
                <button
                  onClick={handleChatWithOwner}
                  className="w-full bg-white border-2 border-gray-200 hover:border-[#1A1A1A] text-[#1A1A1A] py-3.5 rounded-xl text-xs font-extrabold transition shadow-sm uppercase tracking-wider active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat with owner
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modals ─────────────────────────────────────────────────────────────── */}

      {/* Photo Gallery Modal */}
      {activeModal === 'photos' && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8 z-[999] animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[85vh] overflow-y-auto p-6 md:p-8 relative shadow-2xl space-y-6">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition">
              <X className="w-5 h-5" />
            </button>
            <div>
              <h3 className="text-xl font-black text-[#1A1A1A]">{property.title} — Photo Gallery</h3>
              <p className="text-xs text-gray-500 mt-1 font-semibold">{images.length} photos from this listing.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {images.map((img, i) => (
                <div key={i} className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
                  <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition duration-300" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 360° Tour Modal */}
      {activeModal === 'tour' && property.panoramaImage && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-[999] animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden relative shadow-2xl">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 bg-white/95 p-2 rounded-full shadow-md transition z-10">
              <X className="w-5 h-5" />
            </button>
            <div className="relative h-[450px] w-full bg-slate-900 overflow-hidden flex items-center justify-center">
              <img src={property.panoramaImage} alt="360 Panorama" className="absolute inset-0 w-full h-full object-cover opacity-80 brightness-75" />
              <div className="absolute inset-0 bg-black/30" />
              <div className="relative z-10 text-center space-y-4 max-w-sm px-6">
                <div className="w-20 h-20 rounded-full border-2 border-white/55 flex items-center justify-center mx-auto" style={{ animation: 'spin 12s linear infinite' }}>
                  <Compass className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-lg font-black text-white">360° Virtual Tour</h4>
                <p className="text-xs text-gray-300 font-semibold">Drag to explore the panoramic view of this property.</p>
                <button
                  onClick={() => window.open(property.panoramaImage!, '_blank')}
                  className="bg-white text-[#1A1A1A] hover:bg-gray-100 px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 mx-auto"
                >
                  Open Full View <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
