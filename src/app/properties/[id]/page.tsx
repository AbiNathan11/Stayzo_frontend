"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Heart, BedDouble, Bath, Maximize2, 
  ChevronLeft, ChevronRight, Share2, HelpCircle, 
  CheckCircle, Calendar, MapPin, Sparkles, Star, 
  Play, Video, Compass, ArrowLeft, X, Check, Eye, ExternalLink
} from 'lucide-react';

interface PropertyDetail {
  id: number;
  title: string;
  address: string;
  beds: number;
  baths: number;
  sqft: number;
  price: string;
  image: string;
  images: string[];
  tenantCount: number;
  rating: number;
  reviewsCount: number;
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
  mapCoords: { lat: number; lng: number; zoom: number };
}

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);

  // Core properties database matching search listings (12 items)
  const properties: PropertyDetail[] = [
    {
      id: 1,
      title: "Villa in Galle",
      address: "Galle, Sri Lanka",
      beds: 3,
      baths: 2,
      sqft: 1800,
      price: "Rs. 17,827",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      images: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      ],
      tenantCount: 94,
      rating: 4.97,
      reviewsCount: 112,
      landlord: {
        name: "Miguel",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        rating: 4.9,
        reviewsCount: 88,
        isVerified: true,
        isExcellent: true
      },
      universities: [
        { name: "University of Ruhuna (Galle)", distance: "3.5 km" },
        { name: "Advanced Technological Institute", distance: "4.8 km" },
        { name: "Galle International College", distance: "1.2 km" }
      ],
      about: [
        "Fully furnished high-end coastal villa offering panoramic views and breezy study spots.",
        "Fortnightly laundry and home linen service with common area cleaning included.",
        "PROMO FLASH SUMMER: Free high-speed 1Gbps router upgrade for student bundles.",
        "PROMO EARLY BOOKING: 10% rent discount for the first quarter of your lease."
      ],
      highlights: [
        { title: "Coastal Views", desc: "Walking distance to Galle Beach" },
        { title: "Smart Workspace", desc: "Spacious desks and fiber Wi-Fi" },
        { title: "Solar Power", desc: "24/7 backup power generator active" },
        { title: "Private Terrace", desc: "Rooftop deck perfect for relaxation" }
      ],
      places: [
        { type: "Master Suite", count: 1, size: "32 m²+" },
        { type: "Double Room", count: 2, size: "20 m²+" }
      ],
      mapCoords: { lat: 6.0535, lng: 80.2210, zoom: 15 }
    },
    {
      id: 2,
      title: "Guesthouse in Unawatuna",
      address: "Unawatuna, Sri Lanka",
      beds: 4,
      baths: 4,
      sqft: 2500,
      price: "Rs. 96,000",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      images: [
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      ],
      tenantCount: 142,
      rating: 5.0,
      reviewsCount: 175,
      landlord: {
        name: "Kamal",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        rating: 5.0,
        reviewsCount: 124,
        isVerified: true,
        isExcellent: true
      },
      universities: [
        { name: "Unawatuna Dive Academy", distance: "0.5 km" },
        { name: "University of Ruhuna (Galle)", distance: "5.5 km" },
        { name: "Sri Lanka Institute of Tourism", distance: "4.1 km" }
      ],
      about: [
        "Lush tropical garden guesthouse situated adjacent to the golden sands of Unawatuna.",
        "Weekly deep house maintenance, organic garden access, and hot water systems.",
        "PROMO FLASH SUMMER: Zero security deposit required for international students.",
        "PROMO EARLY BOOKING: Get up to 12% off by booking before September 2026."
      ],
      highlights: [
        { title: "Beachside Access", desc: "Just 2 minutes walk to the surf" },
        { title: "Lush Gardens", desc: "Equipped with hammocks and patios" },
        { title: "Ensuite Baths", desc: "All 4 bedrooms have private baths" },
        { title: "Fitted Kitchen", desc: "Oven, microwave, and double fridge" }
      ],
      places: [
        { type: "Deluxe Studio", count: 2, size: "26 m²+" },
        { type: "Single Cabin", count: 2, size: "15 m²+" }
      ],
      mapCoords: { lat: 6.0100, lng: 80.1990, zoom: 15 }
    },
    {
      id: 3,
      title: "Villa in Hapugala",
      address: "Hapugala, Sri Lanka",
      beds: 2,
      baths: 2,
      sqft: 1400,
      price: "Rs. 49,071",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      images: [
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      ],
      tenantCount: 78,
      rating: 4.92,
      reviewsCount: 65,
      landlord: {
        name: "Sophia",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        rating: 4.95,
        reviewsCount: 84,
        isVerified: true,
        isExcellent: true
      },
      universities: [
        { name: "Faculty of Engineering, Ruhuna", distance: "0.8 km" },
        { name: "Hapugala Technological Institute", distance: "1.5 km" },
        { name: "Karapitiya Medical Faculty", distance: "4.2 km" }
      ],
      about: [
        "Premium student housing setup right next to the Engineering Faculty. Ideal for academics.",
        "Fitted with high-performance backup solar energy, student study hub, and security.",
        "PROMO FLASH SUMMER: Free bike rental included for easy university commutes.",
        "PROMO EARLY BOOKING: Get 50% discount on the admin fee applied to second month."
      ],
      highlights: [
        { title: "Study Retreat", desc: "Private workspace with dual monitors" },
        { title: "Engineers Corner", desc: "Fast Wi-Fi and printing access" },
        { title: "Fortnightly Clean", desc: "Complimentary housekeeping service" },
        { title: "Gym Membership", desc: "50% off local fitness club" }
      ],
      places: [
        { type: "Private Suite", count: 1, size: "24 m²+" },
        { type: "Standard Single", count: 1, size: "14 m²+" }
      ],
      mapCoords: { lat: 6.0480, lng: 80.2050, zoom: 15 }
    },
    {
      id: 4,
      title: "Villa in Galle",
      address: "Galle, Sri Lanka",
      beds: 5,
      baths: 5,
      sqft: 3500,
      price: "Rs. 233,671",
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      images: [
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      ],
      tenantCount: 110,
      rating: 4.98,
      reviewsCount: 154,
      landlord: {
        name: "Nuwan",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        rating: 4.98,
        reviewsCount: 130,
        isVerified: true,
        isExcellent: true
      },
      universities: [
        { name: "University of Ruhuna (Galle)", distance: "4.0 km" },
        { name: "Mercantile Marine Campus", distance: "2.5 km" },
        { name: "SLIIT Center Galle", distance: "1.9 km" }
      ],
      about: [
        "Huge colonial-style villa featuring a large courtyard, swimming pool, and five luxury suites.",
        "Fully managed services including 24/7 security guard, chefs on-demand, and daily cleaner.",
        "PROMO FLASH SUMMER: Complimentary group airport transfers on arrival.",
        "PROMO EARLY BOOKING: Get up to 8% off your monthly rent with exact year leases."
      ],
      highlights: [
        { title: "Colonial Pool", desc: "Private access poolside sun beds" },
        { title: "Games Lounge", desc: "Fitted pool table & console room" },
        { title: "Air Conditioning", desc: "Individual inverter AC in all rooms" },
        { title: "Smart Security", desc: "CCTV network and digital locks" }
      ],
      places: [
        { type: "Executive Suite", count: 2, size: "36 m²+" },
        { type: "Deluxe Bedroom", count: 3, size: "22 m²+" }
      ],
      mapCoords: { lat: 6.0535, lng: 80.2210, zoom: 15 }
    }
  ];

  // Per-location map coordinates for fallback IDs 5–12
  const fallbackCoords: Record<number, { lat: number; lng: number; zoom: number }> = {
    5:  { lat: 6.0535, lng: 80.2210, zoom: 15 }, // Galle
    6:  { lat: 5.9842, lng: 80.1989, zoom: 15 }, // Talpe
    7:  { lat: 6.0535, lng: 80.2210, zoom: 15 }, // Galle
    8:  { lat: 6.1395, lng: 80.1050, zoom: 15 }, // Hikkaduwa
    9:  { lat: 5.9486, lng: 80.4502, zoom: 15 }, // Mirissa
    10: { lat: 5.9744, lng: 80.4322, zoom: 15 }, // Weligama
    11: { lat: 7.2906, lng: 80.6337, zoom: 14 }, // Kandy
    12: { lat: 6.9271, lng: 79.8612, zoom: 14 }, // Colombo
  };

  // Helper function to create dynamic properties for IDs 5 to 12
  const getPropertyDetail = (idNum: number): PropertyDetail => {
    const found = properties.find(p => p.id === idNum);
    if (found) return found;

    // Generates fallback values if the ID is 5 to 12
    const titles = [
      "", "", "", "",
      "Villa in Galle", // 5
      "Villa in Talpe", // 6
      "Condo in Galle", // 7
      "Villas by the Bay", // 8
      "Mirissa Beach House", // 9
      "Weligama Surf Lodge", // 10
      "Kandy Mountain Haven", // 11
      "Colombo Sky Villa" // 12
    ];

    const addresses = [
      "", "", "", "",
      "Galle, Sri Lanka",
      "Talpe, Sri Lanka",
      "Galle, Sri Lanka",
      "Hikkaduwa, Sri Lanka",
      "Mirissa, Sri Lanka",
      "Weligama, Sri Lanka",
      "Kandy, Sri Lanka",
      "Colombo, Sri Lanka"
    ];

    const prices = [
      "", "", "", "",
      "Rs. 151,886",
      "Rs. 456,836",
      "Rs. 100,374",
      "Rs. 115,000",
      "Rs. 75,000",
      "Rs. 130,000",
      "Rs. 95,000",
      "Rs. 210,000"
    ];

    const images = [
      "", "", "", "",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ];

    const beds = [0, 0, 0, 0, 3, 6, 2, 4, 3, 5, 4, 3];
    const baths = [0, 0, 0, 0, 3, 6, 2, 3, 2, 4, 4, 3];
    const sqfts = [0, 0, 0, 0, 2100, 4800, 1100, 2400, 1950, 3100, 2800, 2200];
    const ratings = [0, 0, 0, 0, 4.97, 5.0, 4.9, 4.88, 4.95, 4.86, 4.91, 4.94];

    const idx = idNum;
    return {
      id: idNum,
      title: titles[idx] || "Premium Stayzo Stay",
      address: addresses[idx] || "Sri Lanka",
      beds: beds[idx] || 3,
      baths: baths[idx] || 2,
      sqft: sqfts[idx] || 1500,
      price: prices[idx] || "Rs. 120,000",
      image: images[idx] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      images: [
        images[idx] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      ],
      tenantCount: 50 + idNum * 8,
      rating: ratings[idx] || 4.9,
      reviewsCount: 30 + idNum * 12,
      landlord: {
        name: idNum % 2 === 0 ? "Roshan" : "Dilshan",
        avatar: idNum % 2 === 0 
          ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          : "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        rating: 4.9,
        reviewsCount: 65,
        isVerified: true,
        isExcellent: idNum % 3 === 0
      },
      universities: idNum === 11 ? [
        { name: "University of Peradeniya", distance: "3.8 km" },
        { name: "Kandy Technical College", distance: "2.1 km" }
      ] : idNum === 12 ? [
        { name: "University of Colombo", distance: "1.9 km" },
        { name: "SLIIT Metro Campus", distance: "2.8 km" }
      ] : [
        { name: "University of Ruhuna", distance: "6.2 km" },
        { name: "Galle Vocational Academy", distance: "3.5 km" }
      ],
      about: [
        "A premium residence crafted for modern living, boasting spacious interiors and study space.",
        "Includes twice-monthly deep-cleaning and fresh linens delivered to your doorstep.",
        "PROMO FLASH SUMMER: Special discounted booking rates for Stayzo network tenants.",
        "PROMO EARLY BOOKING: Complete your deposit now to save 8% off your monthly dues."
      ],
      highlights: [
        { title: "Fiber Internet", desc: "Up to 500Mbps dedicated router connection" },
        { title: "Co-study Lounge", desc: "Quiet workspace open 24/7 for students" },
        { title: "Modern Pantry", desc: "Fully equipped with microwave & cooker" },
        { title: "Kyosera Security", desc: "Biometric access gates & guard post" }
      ],
      places: [
        { type: "Private Suite", count: 1, size: "22 m²+" },
        { type: "Standard room", count: 2, size: "14 m²+" }
      ],
      mapCoords: fallbackCoords[idNum] || { lat: 6.0535, lng: 80.2210, zoom: 15 }
    };
  };

  const property = getPropertyDetail(id);

  // States
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [showMoreAbout, setShowMoreAbout] = useState(false);
  const [planType, setPlanType] = useState<'month' | 'dates'>('dates');
  
  // Custom interactive date state
  const [checkInDate, setCheckInDate] = useState('2026-06-10');
  const [checkOutDate, setCheckOutDate] = useState('2026-07-16');

  // Media Modals States
  const [activeModal, setActiveModal] = useState<'photos' | 'video' | 'tour' | null>(null);
  
  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleBookmarkToggle = () => {
    setIsBookmarked(!isBookmarked);
    triggerToast(isBookmarked ? "Property removed from wishlist." : "Property successfully saved to your wishlist!");
  };

  const handlePrevImage = (imagesLength: number) => {
    setActiveImgIndex((prev) => (prev === 0 ? imagesLength - 1 : prev - 1));
  };

  const handleNextImage = (imagesLength: number) => {
    setActiveImgIndex((prev) => (prev === imagesLength - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] font-sans selection:bg-[#1A1A1A] selection:text-white flex flex-col relative">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 bg-[#1A1A1A] border border-gray-800 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 max-w-[1200px] w-full mx-auto px-6 sm:px-10 py-8 lg:py-12">
        
        {/* Navigation Breadcrumbs / Return Link */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
          <Link 
            href="/search"
            className="group flex items-center space-x-2 text-xs font-bold text-gray-500 hover:text-[#1A1A1A] transition"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Search Results</span>
          </Link>
          
          <button 
            onClick={handleBookmarkToggle}
            className="flex items-center space-x-1.5 text-xs font-bold text-gray-600 hover:text-[#1A1A1A] transition"
          >
            <Heart className={`w-4 h-4 transition-colors ${isBookmarked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
            <span>{isBookmarked ? "Saved in Wishlist" : "Save to Wishlist"}</span>
          </button>
        </div>

        {/* Detailed Section Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Media Gallery, Info, Highlights */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Top Premium Media Box (Screenshot 2 layout) */}
            <div>
              <div className="h-[420px] w-full bg-gray-150 rounded-[32px] overflow-hidden relative shadow-sm group">
                <img 
                  src={property.images[activeImgIndex]} 
                  alt={`${property.title} view`}
                  className="w-full h-full object-cover transition-all duration-500" 
                />

                {/* Navigation Arrows */}
                <button 
                  onClick={() => handlePrevImage(property.images.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white text-[#1A1A1A] rounded-full shadow-md flex items-center justify-center transition active:scale-95 z-10"
                  title="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleNextImage(property.images.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white text-[#1A1A1A] rounded-full shadow-md flex items-center justify-center transition active:scale-95 z-10"
                  title="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Overlaid badges */}
                <div className="absolute top-4 left-4 flex gap-2 z-10 select-none">
                  <div 
                    onClick={() => triggerToast("Stayzo Certified Premium property.")}
                    className="bg-white/90 backdrop-blur-sm text-gray-800 text-[11px] font-bold px-3.5 py-1.5 rounded-full shadow-sm flex items-center gap-1 cursor-pointer hover:bg-white transition"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-gray-500" />
                    <span>Premium Stay?</span>
                  </div>
                  <div className="bg-[#1A1A1A] text-white text-[11px] font-bold px-3.5 py-1.5 rounded-full shadow-sm flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
                    <span>Confirmed Premium</span>
                  </div>
                </div>

                {/* Share Button */}
                <button 
                  onClick={() => triggerToast("Property link copied to clipboard!")}
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white text-[#1A1A1A] p-2.5 rounded-full shadow-md transition active:scale-95 z-10"
                  title="Share property details"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Gallery Thumbnails (Screenshot 2 details) */}
              <div className="grid grid-cols-6 gap-3 mt-4">
                {property.images.slice(0, 3).map((img, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setActiveImgIndex(idx)}
                    className={`h-16 md:h-20 rounded-2xl overflow-hidden cursor-pointer border-2 transition duration-200 ${
                      activeImgIndex === idx ? 'border-[#1A1A1A] scale-[0.98]' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img src={img} alt="preview thumbnail" className="w-full h-full object-cover" />
                  </div>
                ))}

                {/* Thumbnail 4: "+18 photos" */}
                <div 
                  onClick={() => setActiveModal('photos')}
                  className="h-16 md:h-20 rounded-2xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-gray-300 transition relative"
                >
                  <img src={property.images[3]} alt="preview thumbnail" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-bold text-center">
                    18+ photos
                  </div>
                </div>

                {/* Thumbnail 5: "Videos" */}
                <div 
                  onClick={() => setActiveModal('video')}
                  className="h-16 md:h-20 rounded-2xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-gray-300 transition relative"
                >
                  <img src={property.images[1]} alt="preview thumbnail" className="w-full h-full object-cover" />
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
                  <img src={property.images[2]} alt="preview thumbnail" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white text-[10px] font-bold">
                    <Compass className="w-4 h-4 mb-0.5" />
                    3D tour
                  </div>
                </div>
              </div>
            </div>

            {/* Title & Description row */}
            <div>
              <h1 className="text-3xl font-black text-[#1A1A1A] tracking-tight">{property.title}</h1>
              
              <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-gray-500 mt-2.5">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  {property.address}
                </span>
                <span className="text-gray-300">•</span>
                <span className="flex items-center gap-1 text-[#1A1A1A]">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  {property.tenantCount} tenants have successfully called this place home
                </span>
              </div>
            </div>

            {/* Nearby Universities tags (Screenshot 1 styling) */}
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Universities nearby:</h4>
              <div className="flex flex-wrap gap-2.5">
                {property.universities.map((uni, index) => (
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

            {/* About this property content with diamond & promo bullets (Screenshot 1) */}
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
                    {property.about[2]}
                  </p>
                </div>

                {/* Point 3: Promo Star Bullet */}
                <div className="flex items-start gap-3">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5 animate-pulse" />
                  <p className="text-xs font-bold text-[#1A1A1A] leading-relaxed">
                    {property.about[3]}
                  </p>
                </div>

                {/* Expandable Section */}
                {showMoreAbout && (
                  <div className="space-y-4 pt-1 animate-in fade-in duration-300">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rotate-45 shrink-0 mt-1.5"></div>
                      <p className="text-xs font-semibold text-gray-700 leading-relaxed">
                        {property.about[0]}
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rotate-45 shrink-0 mt-1.5"></div>
                      <p className="text-xs font-semibold text-gray-700 leading-relaxed">
                        {property.about[1]}
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
                {property.highlights.map((h, idx) => (
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

            {/* ── Location Map Section ── */}
            <div className="border-t border-gray-100 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Location</h4>
                <a
                  href={`https://www.openstreetmap.org/?mlat=${property.mapCoords.lat}&mlon=${property.mapCoords.lng}#map=${property.mapCoords.zoom}/${property.mapCoords.lat}/${property.mapCoords.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[10px] font-extrabold text-[#1A1A1A] hover:underline transition"
                >
                  <ExternalLink className="w-3 h-3" />
                  Open in Maps
                </a>
              </div>

              {/* Address pill */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1.5 bg-[#1A1A1A] text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm">
                  <MapPin className="w-3 h-3" />
                  {property.address}
                </div>
                <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 text-gray-600 text-[10px] font-bold px-3 py-1.5 rounded-full">
                  <CheckCircle className="w-3 h-3 text-emerald-500" />
                  Exact location on booking
                </div>
              </div>

              {/* Map iframe container */}
              <div className="relative w-full h-[340px] rounded-3xl overflow-hidden border border-gray-200 shadow-sm">
                {/* Grayscale OpenStreetMap embed centred on the property coords */}
                <iframe
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${property.mapCoords.lng - 0.018}%2C${property.mapCoords.lat - 0.012}%2C${property.mapCoords.lng + 0.018}%2C${property.mapCoords.lat + 0.012}&layer=mapnik&marker=${property.mapCoords.lat}%2C${property.mapCoords.lng}`}
                  className="w-full h-full border-none"
                  style={{ filter: 'grayscale(100%) contrast(88%) brightness(104%)' }}
                  title={`Map of ${property.address}`}
                  loading="lazy"
                />

                {/* Floating property pin card overlay */}
                <div className="absolute bottom-4 left-4 bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3 max-w-[240px] pointer-events-none">
                  <div className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-white fill-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-extrabold text-[#1A1A1A] truncate">{property.title}</p>
                    <p className="text-[10px] text-gray-500 font-semibold truncate">{property.address}</p>
                  </div>
                </div>

                {/* Top-right zoom hint */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm border border-gray-100 text-[9px] font-bold text-gray-500 px-2.5 py-1 rounded-lg shadow-sm pointer-events-none">
                  Scroll to zoom
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Landlord Card & Pricing / Schedulers */}
          <div className="space-y-6 lg:sticky lg:top-24">
            
            {/* Landlord Profile Card */}
            <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm flex items-center gap-4 relative overflow-hidden group">
              <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 bg-gray-50 border border-gray-100 shadow-inner">
                <img 
                  src={property.landlord.avatar} 
                  alt={property.landlord.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="font-extrabold text-base text-[#1A1A1A] truncate">{property.landlord.name}</div>
                
                <div className="flex items-center text-xs font-bold text-gray-500 mt-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 mr-1" />
                  <span>{property.landlord.rating} ({property.landlord.reviewsCount})</span>
                </div>

                <div className="flex gap-2 mt-2">
                  {property.landlord.isVerified && (
                    <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 flex items-center gap-0.5 shadow-xs">
                      <Check className="w-2.5 h-2.5" /> Verified
                    </span>
                  )}
                  {property.landlord.isExcellent && (
                    <span className="text-[9px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 flex items-center gap-0.5 shadow-xs">
                      ★ Excellent Landlord
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Booking & Date Planner Card */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col space-y-6">
              
              {/* Pricing block */}
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">From</span>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-black tracking-tight text-[#1A1A1A]">{property.price}</span>
                    <span className="text-xs text-gray-400 font-bold ml-1">/mo</span>
                  </div>
                </div>
                
                <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-extrabold px-3 py-1 rounded-lg shrink-0 shadow-xs">
                  Get up to 8% off
                </span>
              </div>

              {/* Summary Description */}
              <p className="text-xs text-gray-500 font-semibold leading-relaxed border-t border-gray-100 pt-4">
                This property offers {property.beds} spacious bedrooms, {property.baths} bathrooms, and a total layout of {property.sqft} sqft, configured perfectly for high-quality stays.
              </p>

              {/* Available sub-places */}
              <div className="space-y-2 border-t border-gray-100 pt-4">
                <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Available places</h5>
                {property.places.map((place, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs font-bold text-gray-700">
                    <span>{place.type} ({place.count})</span>
                    <span className="text-gray-500 font-medium">{place.size}</span>
                  </div>
                ))}
              </div>

              {/* Date Scheduler Planner */}
              <div className="border-t border-gray-100 pt-4 space-y-4">
                <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Plan your move</h5>
                
                {/* Date mode tabs */}
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

                {/* Calendar Range Inputs */}
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

              {/* Action Button */}
              <button 
                onClick={() => triggerToast(`Booking request sent to ${property.landlord.name}! They will reply within 24 hours.`)}
                className="w-full bg-[#1A1A1A] hover:bg-black text-white py-3.5 rounded-xl text-xs font-extrabold transition shadow-sm uppercase tracking-wider active:scale-[0.98]"
              >
                Request Booking / Visit
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* -------------------- HIGH-FIDELITY MEDIA OVERLAYS -------------------- */}

      {/* Image Gallery Grid Modal */}
      {activeModal === 'photos' && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8 z-[999] animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[85vh] overflow-y-auto p-6 md:p-8 relative shadow-2xl space-y-6">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 p-2 rounded-full text-gray-600 transition"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-xl font-black text-[#1A1A1A]">{property.title} Photo Gallery</h3>
              <p className="text-xs text-gray-500 mt-1 font-semibold">Browse high definition snapshots of the luxury residence rooms and amenities.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {property.images.map((img, index) => (
                <div key={index} className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
                  <img src={img} alt={`Gallery view ${index + 1}`} className="w-full h-full object-cover hover:scale-102 transition duration-300" />
                </div>
              ))}
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
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-[999] animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden relative shadow-2xl">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 bg-white/95 hover:bg-white p-2 rounded-full text-gray-800 shadow-md transition z-10"
              title="Close video"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-[16/9] w-full bg-black flex items-center justify-center overflow-hidden">
              <img 
                src={property.images[1]} 
                alt="Video thumbnail" 
                className="absolute inset-0 w-full h-full object-cover opacity-70 filter brightness-[0.7]" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              
              <div className="relative z-10 text-center space-y-4 px-8">
                <div className="w-16 h-16 rounded-full bg-white/95 text-[#1A1A1A] flex items-center justify-center mx-auto shadow-xl cursor-pointer hover:scale-105 active:scale-95 transition">
                  <Play className="w-6 h-6 fill-[#1A1A1A] translate-x-0.5" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-white">Interactive Video Walkthrough</h4>
                  <p className="text-xs text-gray-300 font-semibold mt-1">Touring common spaces, kitchen, study areas, and bedroom suite layout.</p>
                </div>
              </div>

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

      {/* 3D Virtual Tour Gyroscope Modal */}
      {activeModal === 'tour' && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-[999] animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden relative shadow-2xl">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 bg-white/95 hover:bg-white p-2 rounded-full text-gray-800 shadow-md transition z-10"
              title="Close 3D tour"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative h-[450px] w-full bg-slate-900 overflow-hidden flex items-center justify-center">
              <img 
                src={property.images[2]} 
                alt="3D Viewport" 
                className="absolute inset-0 w-full h-full object-cover opacity-80 filter brightness-[0.8] scale-110 blur-xs animate-pulse duration-[6s]" 
              />
              <div className="absolute inset-0 bg-black/30"></div>
              
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

              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-3 py-1.5 rounded-lg">
                Bedroom Suite 1 • Hotspots Active
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
