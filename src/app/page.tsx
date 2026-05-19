"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Search, MapPin, Home, Building2, Menu, 
  ArrowRight, ShieldCheck, Sparkles, Check, User, ChevronDown,
  Facebook, Twitter, Linkedin, Youtube
} from 'lucide-react';

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('stayzo_token');
      setIsLoggedIn(!!token);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] font-sans selection:bg-[#1A1A1A] selection:text-white">
      
      {/* Navbar Component */}
      <Navbar />

      {/* Hero Section with Map Background and Floating Card */}
      <section className="relative w-full bg-white overflow-hidden py-20">
        
        {/* Static Map Background Photo (styled with gradient mask for legibility) */}
        <div className="absolute inset-0 z-0 select-none">
          <img 
            src="https://static-maps.yandex.ru/1.x/?lang=en_US&ll=80.6337,7.2906&z=9&l=map&size=650,450"
            alt="Kandy Sri Lanka Regional Map Background"
            className="w-full h-full object-cover opacity-[0.3] filter grayscale contrast-[0.9] brightness-[1.02]"
          />
          {/* Gradient mask: Fades out the map at the top for title readability, leaves it clear and sharp at the bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/35 to-transparent pointer-events-none"></div>
        </div>

        {/* Scattered Map Pins representing properties */}
        <div className="absolute inset-0 z-10 pointer-events-none hidden lg:block">
          {/* Left Side Pins */}
          <div className="absolute top-[22%] left-[6%] hover:scale-110 transition-transform duration-300">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <MapPin className="w-12 h-12 text-[#1A1A1A] fill-[#1A1A1A] filter drop-shadow-md" />
              <div className="absolute top-[5px] w-[22px] h-[22px] rounded-full overflow-hidden bg-white">
                <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&q=80" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
          
          <div className="absolute top-[48%] left-[12%] hover:scale-110 transition-transform duration-300">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <MapPin className="w-12 h-12 text-[#1A1A1A] fill-[#1A1A1A] filter drop-shadow-md" />
              <div className="absolute top-[5px] w-[22px] h-[22px] rounded-full overflow-hidden bg-white">
                <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&q=80" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          <div className="absolute top-[72%] left-[8%] hover:scale-110 transition-transform duration-300">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <MapPin className="w-12 h-12 text-[#1A1A1A] fill-[#1A1A1A] filter drop-shadow-md" />
              <div className="absolute top-[5px] w-[22px] h-[22px] rounded-full overflow-hidden bg-white">
                <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&q=80" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          {/* Right Side Pins */}
          <div className="absolute top-[26%] right-[8%] hover:scale-110 transition-transform duration-300">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <MapPin className="w-12 h-12 text-[#1A1A1A] fill-[#1A1A1A] filter drop-shadow-md" />
              <div className="absolute top-[5px] w-[22px] h-[22px] rounded-full overflow-hidden bg-white">
                <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&q=80" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          <div className="absolute top-[62%] right-[10%] hover:scale-110 transition-transform duration-300">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <MapPin className="w-12 h-12 text-[#1A1A1A] fill-[#1A1A1A] filter drop-shadow-md" />
              <div className="absolute top-[5px] w-[22px] h-[22px] rounded-full overflow-hidden bg-white">
                <img src="https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&q=80" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-20 flex flex-col items-center text-center">
          

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] max-w-4xl text-[#1A1A1A] mb-8 font-sans">
            Easily Rent Premium Properties <br className="hidden sm:block"/>
            to Secure Your Future
          </h1>

          {/* Subtext */}
          <p className="text-gray-500 font-medium text-base md:text-[17px] mb-12 max-w-xl leading-relaxed">
            Take control of your housing journey by renting secure, premium, and high-yield real estate properties.
          </p>

          {/* Search Bar Panel (exactly matching Brickwise search bar) */}
          <div className="w-full max-w-3xl bg-white border border-gray-150 rounded-full p-2.5 shadow-xl flex flex-col sm:flex-row items-center mb-10 gap-3 sm:gap-0">
            {/* Location */}
            <div className="flex-1 w-full px-6 py-2 border-r border-transparent sm:border-gray-100 flex flex-col items-start">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Location</span>
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-extrabold text-[#1A1A1A]">All Locations</span>
                <ChevronDown className="w-4 h-4 text-gray-400 ml-2" />
              </div>
            </div>

            {/* Property Type */}
            <div className="flex-1 w-full px-6 py-2 border-r border-transparent sm:border-gray-100 flex flex-col items-start">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Property Type</span>
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-extrabold text-[#1A1A1A]">All Types</span>
                <ChevronDown className="w-4 h-4 text-gray-400 ml-2" />
              </div>
            </div>

            {/* Budget */}
            <div className="flex-1 w-full px-6 py-2 flex flex-col items-start">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Budget</span>
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-extrabold text-[#1A1A1A]">$500 - $1200</span>
                <ChevronDown className="w-4 h-4 text-gray-400 ml-2" />
              </div>
            </div>

            {/* Black round search button */}
            <Link href="/search" className="bg-[#1A1A1A] hover:bg-black w-14 h-14 rounded-full flex items-center justify-center text-white shadow-md transition shrink-0">
              <Search className="w-5 h-5" />
            </Link>
          </div>

          {/* Removed floating card */}

        </div>
      </section>


      {/* Why Choose Us Section exactly matching bottom section of screenshot */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Column: Heading and Info */}
          <div className="flex flex-col items-start pt-4">
            <span className="text-xs font-bold text-[#F26B27] uppercase tracking-wider mb-4">— Reason to choose us</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#1A1A1A] leading-[1.15] mb-6 tracking-tight">
              Discover the value <br/> behind smart property <br/> rentals
            </h2>
            <p className="text-gray-500 font-medium leading-relaxed text-[15px] mb-8 max-w-md">
              We handle the heavy lifting by conducting in-depth verification, inspecting the properties, and finding high-performing homes for you.
            </p>
            <Link href="/search" className="bg-[#1A1A1A] hover:bg-black text-white px-7 py-4 rounded-full text-xs font-bold tracking-wider uppercase transition inline-flex items-center shadow-md">
              Find the best for you <ArrowRight className="w-3.5 h-3.5 ml-2" />
            </Link>
          </div>

          {/* Right Column: Grid Cards Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Card 1: Smart Suggestions */}
            <div className="bg-[#FDFDFD] border border-gray-100 p-8 rounded-3xl shadow-sm flex flex-col justify-between min-h-[220px]">
              <div className="mb-4">
                {/* Visual input bar mock */}
                <div className="bg-gray-50 rounded-full border border-gray-100 p-2 pl-4 flex items-center justify-between mb-6">
                  <span className="text-[10px] text-gray-400 font-semibold">Search with "AI"</span>
                  <div className="bg-[#1A1A1A] w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px]">✨</div>
                </div>
                <h3 className="font-extrabold text-[#1A1A1A] text-lg mb-2">Smart Suggestions</h3>
                <p className="text-gray-500 text-xs leading-relaxed font-semibold">
                  AI scans listings to find your best-fit property.
                </p>
              </div>
            </div>

            {/* Card 2: 99% Trusted Investor */}
            <div className="bg-[#FDFDFD] border border-gray-100 p-8 rounded-3xl shadow-sm flex flex-col justify-between min-h-[220px]">
              <div className="mb-4">
                <div className="w-10 h-10 rounded-full bg-[#F26B27]/10 flex items-center justify-center text-[#F26B27] mb-6">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-[#1A1A1A] text-lg mb-2">99% Trusted Tenant</h3>
                <p className="text-gray-500 text-xs leading-relaxed font-semibold">
                  Users trust our verification and return for more deals.
                </p>
              </div>
            </div>

            {/* Card 3: Invest Where It Matters (Wide) */}
            <div className="bg-[#FDFDFD] border border-gray-100 p-8 rounded-3xl shadow-sm md:col-span-2 relative overflow-hidden min-h-[240px] flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xs z-10">
                <h3 className="font-extrabold text-[#1A1A1A] text-lg mb-2">Rent Where It Matters</h3>
                <p className="text-gray-500 text-xs leading-relaxed font-semibold">
                  We pinpoint high-demand, high-growth areas backed by market data.
                </p>
              </div>

              {/* Graphic Visual Representation (Map mockup from screen) */}
              <div className="relative w-full max-w-[200px] h-[130px] bg-[#E8EEF0] rounded-2xl overflow-hidden shrink-0 border border-gray-100 shadow-sm flex items-center justify-center z-10">
                {/* SVG roads inside visual map */}
                <svg className="absolute inset-0 w-full h-full text-white/50" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M 0,20 L 100,20" />
                  <path d="M 0,60 L 100,60" />
                  <path d="M 40,0 L 40,100" />
                </svg>
                {/* Marker */}
                <div className="absolute w-5 h-5 rounded-full bg-[#F26B27] border-2 border-white shadow-md flex items-center justify-center text-[7px] text-white font-extrabold z-10 animate-bounce">📍</div>
                {/* Tiny property card representation */}
                <div className="absolute bottom-2 left-2 right-2 bg-white rounded-lg p-1.5 shadow-md flex items-center space-x-2 border border-gray-150">
                  <div className="w-8 h-8 rounded-md overflow-hidden bg-gray-50 shrink-0">
                    <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&q=80" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[7px] font-extrabold text-[#1A1A1A] truncate">Luxury Bungalow</p>
                    <p className="text-[6px] font-bold text-[#F26B27]">$20,000</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
      {/* Contact Us Section exactly matching user mockup image */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24 bg-white border-t border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* Left Column: Get In Touch Info */}
          <div>
            <span className="text-xs font-bold text-gray-400 tracking-wider mb-5 block">/ get in touch /</span>
            <h2 className="text-4xl lg:text-[46px] font-extrabold text-[#1A1A1A] leading-[1.1] mb-8 font-sans">
              We are always ready <br />
              to help you and <br />
              answer your <br />
              questions
            </h2>
            <p className="text-gray-500 font-medium text-xs leading-relaxed mb-12 max-w-sm">
              Our dedicated support team is available 24/7 to assist you with property inquiries, booking details, landlord verification, and any other housing questions.
            </p>

            {/* 2x2 Grid of details */}
            <div className="grid grid-cols-2 gap-y-10 gap-x-8 text-sm">
              <div>
                <h4 className="font-extrabold text-[#1A1A1A] text-sm mb-2.5">Call Center</h4>
                <p className="text-gray-400 font-semibold text-xs leading-relaxed space-y-1">
                  <span>800 100 975 20 34</span> <br />
                  <span>+ (123) 1800-234-5678</span>
                </p>
              </div>

              <div>
                <h4 className="font-extrabold text-[#1A1A1A] text-sm mb-2.5">Our Location</h4>
                <p className="text-gray-400 font-semibold text-xs leading-relaxed space-y-1">
                  <span>USA, New York - 1060</span> <br />
                  <span>Str. First Avenue 1</span>
                </p>
              </div>

              <div>
                <h4 className="font-extrabold text-[#1A1A1A] text-sm mb-2.5">Email</h4>
                <p className="text-gray-400 font-semibold text-xs leading-relaxed">
                  neuros@mail.co
                </p>
              </div>

              <div>
                <h4 className="font-extrabold text-[#1A1A1A] text-sm mb-2.5">Social network</h4>
                <div className="flex items-center space-x-4.5 text-gray-400 mt-2">
                  <a href="#" className="hover:text-[#1A1A1A] transition">
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a href="#" className="hover:text-[#1A1A1A] transition">
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a href="#" className="hover:text-[#1A1A1A] transition">
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a href="#" className="hover:text-[#1A1A1A] transition">
                    <Youtube className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form Container Card */}
          <div className="bg-[#F4F4F6] rounded-[32px] p-8 md:p-12 shadow-sm border border-gray-100/50">
            <h3 className="text-2xl font-extrabold text-[#1A1A1A] mb-3">Get in Touch</h3>
            <p className="text-gray-400 text-xs font-semibold leading-relaxed mb-10 max-w-sm">
              Define your goals and identify areas where Stayzo can add value to your renting experience.
            </p>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
              <div>
                <input 
                  type="text" 
                  placeholder="Full name" 
                  className="w-full bg-transparent border-b border-gray-200 pb-3 text-sm focus:outline-none focus:border-[#1A1A1A] text-gray-800 placeholder-gray-400 font-semibold transition-colors"
                />
              </div>

              <div>
                <input 
                  type="email" 
                  placeholder="Email" 
                  className="w-full bg-transparent border-b border-gray-200 pb-3 text-sm focus:outline-none focus:border-[#1A1A1A] text-gray-800 placeholder-gray-400 font-semibold transition-colors"
                />
              </div>

              <div>
                <input 
                  type="text" 
                  placeholder="Subject" 
                  className="w-full bg-transparent border-b border-gray-200 pb-3 text-sm focus:outline-none focus:border-[#1A1A1A] text-gray-800 placeholder-gray-400 font-semibold transition-colors"
                />
              </div>

              <div>
                <textarea 
                  placeholder="Message" 
                  rows={2}
                  className="w-full bg-transparent border-b border-gray-200 pb-3 text-sm focus:outline-none focus:border-[#1A1A1A] text-gray-800 placeholder-gray-400 font-semibold resize-none transition-colors"
                ></textarea>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  className="bg-[#1A1A1A] hover:bg-black text-white px-6 py-3 rounded-full flex items-center space-x-2.5 text-xs font-extrabold shadow-sm transition active:scale-95"
                >
                  <span className="text-[8px] transform translate-y-[0.5px]">▶</span>
                  <span>Send a message</span>
                </button>
              </div>
            </form>
          </div>

        </div>
      </section>

      {/* Footer Component */}
      <Footer />

    </div>
  );
}
