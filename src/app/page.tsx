"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Search, MapPin, Home, Building2, Menu, 
  ArrowRight, ShieldCheck, Sparkles, Check, User, ChevronDown,
  Facebook, Twitter, Linkedin, Youtube
} from 'lucide-react';

const LOCATIONS = ['All Locations', 'Colombo', 'Kandy', 'Galle', 'Negombo', 'Jaffna', 'Matara'];
const PROPERTY_TYPES = ['All Types', 'Apartment', 'House', 'Villa', 'Studio', 'Room', 'Commercial'];
const BUDGETS = ['Any Budget', 'Under Rs.50,000', 'Rs.50,000 - Rs.100,000', 'Rs.100,000 - Rs.200,000', 'Rs.200,000 - Rs.500,000', 'Over Rs.500,000'];

export default function LandingPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [location, setLocation] = useState('All Locations');
  const [propertyType, setPropertyType] = useState('All Types');
  const [budget, setBudget] = useState('Any Budget');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [worksTab, setWorksTab] = useState<'tenant' | 'landlord'>('tenant');
  const searchRef = useRef<HTMLDivElement>(null);
  
  const [contactForm, setContactForm] = useState({ fullName: '', email: '', subject: '', message: '' });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.fullName || !contactForm.email || !contactForm.message) {
      alert("Please fill in all required fields (Full name, Email, and Message).");
      return;
    }
    const existing = localStorage.getItem('stayzo_contact_messages');
    const messages = existing ? JSON.parse(existing) : [];
    const newMsg = {
      id: `MSG-${Date.now()}`,
      fullName: contactForm.fullName,
      email: contactForm.email,
      subject: contactForm.subject || 'General Inquiry',
      message: contactForm.message,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      status: 'Unread'
    };
    messages.unshift(newMsg); // Newest messages at top
    localStorage.setItem('stayzo_contact_messages', JSON.stringify(messages));
    alert("Thank you! Your message has been sent successfully.");
    setContactForm({ fullName: '', email: '', subject: '', message: '' });
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('stayzo_token');
      setIsLoggedIn(!!token);
    }
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Butter-smooth Scroll Observer entry animations
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in-visible");
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(".fade-in-section");
    animatedElements.forEach((el) => observer.observe(el));

    return () => {
      animatedElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location !== 'All Locations') params.set('location', location);
    if (propertyType !== 'All Types') params.set('type', propertyType);
    if (budget !== 'Any Budget') params.set('budget', budget);
    router.push(`/search?${params.toString()}`);
  };

  const tenantSteps = [
    {
      title: "Search property",
      desc: "Browse premium, verified listings tailored to your style by filtering locations, budgets, and custom home parameters.",
      circleStyle: "border-2 border-[#4F46E5] bg-[#EEF2FF]/45 text-[#4F46E5] shadow-xs",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#4F46E5]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      )
    },
    {
      title: "Message to landlord",
      desc: "Connect instantly with property owners through Stayzo’s secure real-time encrypted messaging channel.",
      circleStyle: "border-2 border-dashed border-gray-300 bg-gray-50 text-gray-500",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      )
    },
    {
      title: "Apply and move in",
      desc: "Submit your profile digitally and unlock your fully vetted, high-fidelity dream space with absolute peace of mind.",
      circleStyle: "border-2 border-gray-100 bg-[#4F46E5] text-white shadow-md shadow-indigo-500/10",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      )
    }
  ];

  const landlordSteps = [
    {
      title: "Manage listing",
      desc: "Upload rich photos, 360° virtual tours, and easily update property availabilities on your owner panel in real-time.",
      circleStyle: "border-2 border-[#4F46E5] bg-[#EEF2FF]/45 text-[#4F46E5] shadow-xs",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#4F46E5]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      )
    },
    {
      title: "Communicate with tenants",
      desc: "Review verified background matches and instantly coordinate move-in dates with prospective tenants directly.",
      circleStyle: "border-2 border-dashed border-gray-300 bg-gray-50 text-gray-500",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 8h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2v4l-4-4H9a1.9 1.9 0 0 1-2-2" />
          <path d="M3 13.5V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7l-4 4" />
        </svg>
      )
    },
    {
      title: "Secure rental with digital agreement",
      desc: "Draft legally compliant residential agreements and cryptographically sign them online, safely stored in cloud vault.",
      circleStyle: "border-2 border-gray-100 bg-[#1A1A1A] text-white shadow-md shadow-black/10",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] font-sans selection:bg-[#4F46E5] selection:text-white">
      <style>{`
        .fade-in-section {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 1.1s cubic-bezier(0.16, 1, 0.3, 1), transform 1.1s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity, transform;
        }
        .fade-in-section.fade-in-visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
      
      {/* Navbar Component */}
      <Navbar />

      {/* Hero Section with Map Background and Floating Card */}
      <section className="relative w-full bg-gradient-to-b from-[#EEF2FF] via-[#F3F7FF] to-white pt-36 pb-36 z-40">
        
        {/* Static Map Background Photo (styled with gradient mask for legibility) */}
        <div className="absolute inset-0 z-0 select-none">
          <img 
            src="/map.png"
            alt="Sri Lanka Regional Map Background"
            className="w-full h-full object-cover opacity-[0.9] filter contrast-[1.08] brightness-[0.98] transition-opacity duration-500"
          />
          {/* Dotted Grid Pattern Overlay exactly like reference image */}
          <div className="absolute inset-0 opacity-[0.55] mix-blend-overlay" style={{
            backgroundImage: 'radial-gradient(#FFFFFF 1.8px, transparent 1.8px)',
            backgroundSize: '24px 24px'
          }}></div>

          {/* Glowing blue transparent layers to match reference mockup */}
          <div className="absolute -top-40 left-10 w-[650px] h-[650px] bg-[#818CF8] opacity-[0.68] rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute -top-40 right-10 w-[750px] h-[750px] bg-[#A5B4FC] opacity-[0.72] rounded-full blur-[120px] pointer-events-none"></div>

          {/* Gradient mask: Fades out in the center for clear text readability, but keeps the left and right sides completely clear and vibrant! */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#EEF2FF] to-transparent pointer-events-none"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(238,242,255,0.92)_0%,_rgba(238,242,255,0.6)_35%,_transparent_75%)] pointer-events-none"></div>
        </div>

        {/* Scattered Map Pins representing properties */}
        <div className="absolute inset-0 z-10 pointer-events-none hidden lg:block">
          {/* Left Side Pins */}
          <div className="absolute top-[22%] left-[6%]" style={{animation: 'floatPin 3s ease-in-out infinite'}}>
            <div className="relative w-12 h-12 flex items-center justify-center">
              <MapPin className="w-12 h-12 text-[#1A1A1A] fill-[#1A1A1A] filter drop-shadow-md" />
              <div className="absolute top-[5px] w-[22px] h-[22px] rounded-full overflow-hidden bg-white">
                <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&q=80" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
          
          <div className="absolute top-[48%] left-[12%]" style={{animation: 'floatPin 3.6s ease-in-out infinite 0.5s'}}>
            <div className="relative w-12 h-12 flex items-center justify-center">
              <MapPin className="w-12 h-12 text-[#1A1A1A] fill-[#1A1A1A] filter drop-shadow-md" />
              <div className="absolute top-[5px] w-[22px] h-[22px] rounded-full overflow-hidden bg-white">
                <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&q=80" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          <div className="absolute top-[72%] left-[8%]" style={{animation: 'floatPin 4s ease-in-out infinite 1s'}}>
            <div className="relative w-12 h-12 flex items-center justify-center">
              <MapPin className="w-12 h-12 text-[#1A1A1A] fill-[#1A1A1A] filter drop-shadow-md" />
              <div className="absolute top-[5px] w-[22px] h-[22px] rounded-full overflow-hidden bg-white">
                <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&q=80" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          {/* Right Side Pins */}
          <div className="absolute top-[26%] right-[8%]" style={{animation: 'floatPin 3.3s ease-in-out infinite 0.8s'}}>
            <div className="relative w-12 h-12 flex items-center justify-center">
              <MapPin className="w-12 h-12 text-[#1A1A1A] fill-[#1A1A1A] filter drop-shadow-md" />
              <div className="absolute top-[5px] w-[22px] h-[22px] rounded-full overflow-hidden bg-white">
                <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&q=80" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          <div className="absolute top-[62%] right-[10%]" style={{animation: 'floatPin 3.8s ease-in-out infinite 1.3s'}}>
            <div className="relative w-12 h-12 flex items-center justify-center">
              <MapPin className="w-12 h-12 text-[#1A1A1A] fill-[#1A1A1A] filter drop-shadow-md" />
              <div className="absolute top-[5px] w-[22px] h-[22px] rounded-full overflow-hidden bg-white">
                <img src="https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&q=80" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-50 flex flex-col items-center text-center">
          

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] max-w-4xl text-[#1A1A1A] mb-3 font-sans">
            Easily Rent Premium Properties <br className="hidden sm:block"/>
            to Secure Your Future
          </h1>

          {/* Subtext */}
          <p className="text-gray-500 font-medium text-base md:text-[17px] mb-12 max-w-xl leading-relaxed">
            Take control of your housing journey by renting secure, premium, and high-yield real estate properties.
          </p>

          {/* Functional Search Bar */}
          <div ref={searchRef} className="w-full max-w-3xl relative mb-10 z-50">
            <div className="bg-white border border-gray-200 rounded-full p-2.5 shadow-xl flex flex-col sm:flex-row items-center gap-3 sm:gap-0 relative z-50">

              {/* Location Dropdown */}
              <div className="relative flex-1 w-full">
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'location' ? null : 'location')}
                  className="w-full px-6 py-2 border-r border-transparent sm:border-gray-100 flex flex-col items-start focus:outline-none"
                >
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Location</span>
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm font-extrabold text-[#1A1A1A]">{location}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 ml-2 transition-transform ${openDropdown === 'location' ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                {openDropdown === 'location' && (
                  <div className="absolute top-full left-0 mt-3 w-52 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden">
                    {LOCATIONS.map(l => (
                      <button key={l} onClick={() => { setLocation(l); setOpenDropdown(null); }}
                        className={`w-full text-left px-5 py-3 text-sm font-semibold hover:bg-gray-50 transition ${location === l ? 'text-[#4F46E5] font-extrabold bg-indigo-50/40' : 'text-gray-600'}`}>
                        {l}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Property Type Dropdown */}
              <div className="relative flex-1 w-full">
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'type' ? null : 'type')}
                  className="w-full px-6 py-2 border-r border-transparent sm:border-gray-100 flex flex-col items-start focus:outline-none"
                >
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Property Type</span>
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm font-extrabold text-[#1A1A1A]">{propertyType}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 ml-2 transition-transform ${openDropdown === 'type' ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                {openDropdown === 'type' && (
                  <div className="absolute top-full left-0 mt-3 w-52 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden">
                    {PROPERTY_TYPES.map(t => (
                      <button key={t} onClick={() => { setPropertyType(t); setOpenDropdown(null); }}
                        className={`w-full text-left px-5 py-3 text-sm font-semibold hover:bg-gray-50 transition ${propertyType === t ? 'text-[#4F46E5] font-extrabold bg-indigo-50/40' : 'text-gray-600'}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Budget Dropdown */}
              <div className="relative flex-1 w-full">
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'budget' ? null : 'budget')}
                  className="w-full px-6 py-2 flex flex-col items-start focus:outline-none"
                >
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Budget</span>
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm font-extrabold text-[#1A1A1A]">{budget}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 ml-2 transition-transform ${openDropdown === 'budget' ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                {openDropdown === 'budget' && (
                  <div className="absolute top-full left-0 mt-3 w-52 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden">
                    {BUDGETS.map(b => (
                      <button key={b} onClick={() => { setBudget(b); setOpenDropdown(null); }}
                        className={`w-full text-left px-5 py-3 text-sm font-semibold hover:bg-gray-50 transition ${budget === b ? 'text-[#4F46E5] font-extrabold bg-indigo-50/40' : 'text-gray-600'}`}>
                        {b}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="bg-[#4F46E5] hover:bg-[#4338CA] w-14 h-14 rounded-full flex items-center justify-center text-white shadow-md transition shrink-0 active:scale-95"
              >
                <Search className="w-5 h-5" />
              </button>

            </div>
          </div>

          {/* Removed floating card */}

        </div>
      </section>


      {/* Why Stayzo — 3-Column Horizontal Features Layout */}
      <section id="features" className="bg-white pt-36 pb-16 fade-in-section">
        <div className="max-w-[90rem] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-16 items-start">

            {/* Left Column: Label + Heading + Description + CTA */}
            <div className="flex flex-col items-start">
              <span className="text-xs font-extrabold text-[#4F46E5] uppercase tracking-[0.2em] mb-6 border-b-2 border-[#4F46E5] pb-1">Features</span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-[#1A1A1A] leading-tight mb-3 tracking-tight">
                Why People <span className="text-[#4F46E5]">Choose</span> Us?
              </h2>
              <p className="text-gray-500 font-medium text-base leading-relaxed mb-10">
                We handle the heavy lifting — from in-depth property verification to seamless digital lease agreements — so you can focus on finding your dream home.
              </p>
              <Link href="/search" className="border-2 border-[#4F46E5] hover:bg-[#4F46E5] hover:text-white text-[#4F46E5] px-8 py-3.5 rounded-full text-xs font-extrabold tracking-[0.15em] uppercase transition">
                Find a Property
              </Link>
            </div>

            {/* Middle Column: 2 Feature Items */}
            <div className="flex flex-col divide-y divide-gray-200">
              {[
                {
                  icon: <ShieldCheck className="w-6 h-6 text-[#4F46E5]" />,
                  title: "Verified Landlords",
                  desc: "Every landlord and property goes through a rigorous vetting process before listing on our platform."
                },
                {
                  icon: <Sparkles className="w-6 h-6 text-[#4F46E5]" />,
                  title: "Smart Lease Agreements",
                  desc: "Sign legally binding digital agreements from anywhere. Fast, secure, and hassle-free."
                }
              ].map((f, i) => (
                <div key={i} className="flex items-start space-x-5 py-10 first:pt-0 last:pb-0">
                  <div className="w-14 h-14 border border-gray-200 rounded-2xl flex items-center justify-center shrink-0 bg-white shadow-sm">
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-[#1A1A1A] text-base mb-2">{f.title}</h3>
                    <p className="text-gray-500 text-sm font-medium leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: 2 Feature Items */}
            <div className="flex flex-col divide-y divide-gray-200">
              {[
                {
                  icon: <Building2 className="w-6 h-6 text-[#4F46E5]" />,
                  title: "Premium Properties",
                  desc: "Access high-quality, modern properties in prime locations across Sri Lanka at competitive prices."
                },
                {
                  icon: <Home className="w-6 h-6 text-[#4F46E5]" />,
                  title: "End-to-End Support",
                  desc: "From search to move-in, our team is with you every step — maintenance, payments, and beyond."
                }
              ].map((f, i) => (
                <div key={i} className="flex items-start space-x-5 py-10 first:pt-0 last:pb-0">
                  <div className="w-14 h-14 border border-gray-200 rounded-2xl flex items-center justify-center shrink-0 bg-white shadow-sm">
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-[#1A1A1A] text-base mb-2">{f.title}</h3>
                    <p className="text-gray-500 text-sm font-medium leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-white border-t border-gray-100 py-16 select-none fade-in-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Header (Matching Features Heading style exactly) */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold text-[#4F46E5] uppercase tracking-[0.2em] mb-6 border-b-2 border-[#4F46E5] pb-1 inline-block">How It Works</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#1A1A1A] leading-tight mb-3 tracking-tight mt-4">
              Simplifying rentals and driving home <span className="text-[#4F46E5]">growth</span>
            </h2>
            
            <p className="text-gray-500 font-medium text-base leading-relaxed max-w-2xl mx-auto">
              Benefit from consistent, high-quality matches to help secure your space or manage your properties effortlessly.
            </p>
          </div>

          {/* Custom Pill Toggle Switch (Borderless!) */}
          <div className="flex justify-center mb-20">
            <div className="bg-[#F8FAFB] p-1.5 rounded-full flex items-center space-x-1">
              <button
                onClick={() => setWorksTab('tenant')}
                className={`px-6 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all duration-300 ${
                  worksTab === 'tenant'
                    ? 'bg-[#4F46E5] text-white shadow-md shadow-indigo-500/10'
                    : 'text-gray-400 hover:text-[#1A1A1A]'
                }`}
              >
                For Tenants
              </button>
              <button
                onClick={() => setWorksTab('landlord')}
                className={`px-6 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all duration-300 ${
                  worksTab === 'landlord'
                    ? 'bg-[#1A1A1A] text-white shadow-md'
                    : 'text-gray-400 hover:text-[#1A1A1A]'
                }`}
              >
                For Landlords
              </button>
            </div>
          </div>

          {/* Horizontal Steps Columns Layout (1:1 mockup match) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-12 lg:gap-16 relative z-10">
            {(worksTab === 'tenant' ? tenantSteps : landlordSteps).map((s, idx) => {
              return (
                <div key={idx} className="relative flex items-start space-x-5 group min-h-[220px]">
                  
                  {/* Left Column: Icon Circle + Fading Vertical Line */}
                  <div className="flex flex-col items-center shrink-0">
                    
                    {/* Circle Container */}
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${s.circleStyle}`}>
                      {s.icon}
                    </div>

                    {/* Gradient Fading Line */}
                    <div className="w-[1.5px] h-32 bg-gradient-to-b from-[#4F46E5]/35 to-transparent mt-3"></div>

                  </div>

                  {/* Right Column: Text Metadata */}
                  <div className="pt-2 flex-1">
                    <h3 className="font-extrabold text-base text-[#1A1A1A] mb-2 tracking-tight group-hover:text-[#4F46E5] transition-colors leading-tight">
                      {s.title}
                    </h3>
                    <p className="text-gray-400 text-xs font-semibold leading-relaxed max-w-[240px]">
                      {s.desc}
                    </p>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="bg-white border-t border-gray-100 py-16 fade-in-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-6">
          <div>
            <span className="text-xs font-extrabold text-[#4F46E5] uppercase tracking-[0.2em] mb-6 border-b-2 border-[#4F46E5] pb-1 inline-block">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#1A1A1A] leading-[1.15] tracking-tight mt-4 mb-2">
              What our tenants <br className="hidden md:block" /> are <span className="text-[#4F46E5]">saying</span>.
            </h2>
          </div>
          <p className="text-gray-500 font-medium text-sm leading-relaxed max-w-xs md:text-right">
            Real stories from real people who found their perfect home through Stayzo.
          </p>
        </div>

        {/* Infinite Auto-Scrolling Testimonials Marquee */}
        <div className="relative w-full overflow-hidden py-4">
          <style>{`
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(calc(-33.333% - 16px)); }
            }
            .animate-marquee-hover:hover {
              animation-play-state: paused !important;
            }
          `}</style>
          
          <div 
            className="flex space-x-6 w-max animate-marquee-hover"
            style={{
              animation: 'marquee 40s linear infinite',
            }}
          >
            {[
              // First Set of Reviews
              {
                quote: "Impressed by the professionalism and attention to detail. Stayzo made every step of my renting journey completely stress-free.",
                name: "Sarah M.",
                handle: "@sarahm_lk",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              },
              {
                quote: "A seamless experience from start to finish. Highly recommend! Found my perfect apartment in Colombo within three days.",
                name: "James K.",
                handle: "@jameskdy",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              },
              {
                quote: "Reliable and trustworthy. Made my life so much easier! The verified listings gave me peace of mind I never thought I'd have.",
                name: "Priya R.",
                handle: "@priyarents",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              },
              {
                quote: "From viewing to signing, everything was smooth and transparent. Best rental platform I have ever used in Sri Lanka.",
                name: "Anil P.",
                handle: "@anilp_colomob",
                avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              },
              {
                quote: "The digital lease agreement saved me so much time. I signed everything online and moved in within a week. Incredible!",
                name: "Nisha T.",
                handle: "@nisha_t",
                avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              },
              // Second Set of Reviews for Infinite Loop
              {
                quote: "Impressed by the professionalism and attention to detail. Stayzo made every step of my renting journey completely stress-free.",
                name: "Sarah M.",
                handle: "@sarahm_lk",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              },
              {
                quote: "A seamless experience from start to finish. Highly recommend! Found my perfect apartment in Colombo within three days.",
                name: "James K.",
                handle: "@jameskdy",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              },
              {
                quote: "Reliable and trustworthy. Made my life so much easier! The verified listings gave me peace of mind I never thought I'd have.",
                name: "Priya R.",
                handle: "@priyarents",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              },
              {
                quote: "From viewing to signing, everything was smooth and transparent. Best rental platform I have ever used in Sri Lanka.",
                name: "Anil P.",
                handle: "@anilp_colomob",
                avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              },
              {
                quote: "The digital lease agreement saved me so much time. I signed everything online and moved in within a week. Incredible!",
                name: "Nisha T.",
                handle: "@nisha_t",
                avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              },
              // Third Set of Reviews for Seamless Wrap
              {
                quote: "Impressed by the professionalism and attention to detail. Stayzo made every step of my renting journey completely stress-free.",
                name: "Sarah M.",
                handle: "@sarahm_lk",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              },
              {
                quote: "A seamless experience from start to finish. Highly recommend! Found my perfect apartment in Colombo within three days.",
                name: "James K.",
                handle: "@jameskdy",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              },
              {
                quote: "Reliable and trustworthy. Made my life so much easier! The verified listings gave me peace of mind I never thought I'd have.",
                name: "Priya R.",
                handle: "@priyarents",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              },
              {
                quote: "From viewing to signing, everything was smooth and transparent. Best rental platform I have ever used in Sri Lanka.",
                name: "Anil P.",
                handle: "@anilp_colomob",
                avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              },
              {
                quote: "The digital lease agreement saved me so much time. I signed everything online and moved in within a week. Incredible!",
                name: "Nisha T.",
                handle: "@nisha_t",
                avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              }
            ].map((t, i) => {
              const isBlue = i % 2 === 0;
              return (
                <div 
                  key={i} 
                  className={`rounded-3xl p-8 flex flex-col justify-between shrink-0 w-[320px] md:w-[360px] transition-all hover:shadow-md ${
                    isBlue 
                      ? 'bg-[#EEF2FF] shadow-sm text-[#1A1A1A]' 
                      : 'bg-white shadow-md shadow-gray-100/30 text-[#1A1A1A]'
                  }`}
                >
                  {/* Large quotation mark */}
                  <div>
                    <span className={`text-5xl font-extrabold leading-none select-none ${
                      isBlue ? 'text-[#4F46E5]/25' : 'text-gray-200'
                    }`}>"</span>
                    <p className="font-semibold text-[15px] leading-relaxed mt-3 mb-8 whitespace-normal">
                      {t.quote}
                    </p>
                  </div>
                  {/* Avatar + name + handle */}
                  <div className={`flex items-center space-x-3 pt-4 border-t ${
                    isBlue ? 'border-[#4F46E5]/15' : 'border-gray-100'
                  }`}>
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className={`w-10 h-10 rounded-full object-cover shrink-0 border ${
                        isBlue ? 'border-[#4F46E5]/15' : 'border-gray-150'
                      }`}
                    />
                    <div>
                      <p className="font-extrabold text-[#1A1A1A] text-sm leading-tight">{t.name}</p>
                      <p className={`text-xs font-semibold ${
                        isBlue ? 'text-[#4F46E5]/70' : 'text-gray-400'
                      }`}>{t.handle}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white pt-16 pb-16 border-t border-gray-100 fade-in-section">
        <div className="max-w-3xl mx-auto px-6">
          
          <div className="text-left mb-12">
            <span className="text-xs font-extrabold text-[#4F46E5] uppercase tracking-[0.2em] mb-6 border-b-2 border-[#4F46E5] pb-1 inline-block">FAQs</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#1A1A1A] tracking-tight mb-2 mt-4">
              Frequently asked <span className="text-[#4F46E5]">questions</span>
            </h2>
            <p className="text-gray-500 font-medium text-sm leading-relaxed max-w-sm">
              Here are some common questions about our renting services to help you understand better.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How does the AI smart matching work?",
                a: "Our advanced AI algorithm analyzes your preferences, budget, and lifestyle needs to instantly match you with premium properties that perfectly align with your criteria, saving you hours of manual searching."
              },
              {
                q: "Are the digital lease agreements legally binding?",
                a: "Yes. All Stayzo digital agreements comply strictly with local real estate laws. They are cryptographically secure, digitally signed, and safely stored on our cloud infrastructure for your peace of mind."
              },
              {
                q: "How does Stayzo verify landlords and properties?",
                a: "Trust is our priority. Every landlord and property undergoes a rigorous vetting process. We verify legal ownership, inspect the physical premises, and conduct background checks before listing any property on our platform."
              },
              {
                q: "Is it secure to process rent payments through Stayzo?",
                a: "Absolutely. We process all transactions through highly secure, bank-level encrypted gateways. Your rent payments are automated, tracked, and receipted instantly to ensure a stress-free financial experience."
              }
            ].map((faq, i) => (
              <details key={i} className="group bg-[#F8FAFB] rounded-3xl overflow-hidden cursor-pointer shadow-sm transition-all hover:shadow-md">
                <summary className="flex justify-between items-center p-6 md:p-8 select-none marker:content-none list-none outline-none">
                  <span className="text-sm font-extrabold text-[#1A1A1A] pr-4">{faq.q}</span>
                  <div className="w-8 h-8 rounded-full bg-[#4F46E5] flex items-center justify-center shrink-0 relative transition-transform">
                    {/* Horizontal minus line */}
                    <div className="w-3.5 h-[2px] bg-white absolute rounded-full"></div>
                    {/* Vertical plus line (disappears on open) */}
                    <div className="w-[2px] h-3.5 bg-white absolute rounded-full group-open:opacity-0 transition-opacity"></div>
                  </div>
                </summary>
                <div className="px-6 md:px-8 pb-8 text-gray-500 font-medium text-[13px] leading-relaxed pt-1 opacity-0 group-open:opacity-100 transition-opacity">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>

        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="bg-white border-t border-gray-100 py-16 fade-in-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* Left Column: Get In Touch Info */}
          <div>
            <span className="text-xs font-extrabold text-[#4F46E5] uppercase tracking-[0.2em] mb-6 border-b-2 border-[#4F46E5] pb-1 inline-block">Get In Touch</span>
            <h2 className="text-4xl lg:text-[46px] font-extrabold text-[#1A1A1A] leading-[1.1] mb-3 font-sans">
              We are always ready <br />
              to <span className="text-[#4F46E5]">help</span> you and <br />
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
                  <a href="#" className="hover:text-[#4F46E5] transition">
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a href="#" className="hover:text-[#4F46E5] transition">
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a href="#" className="hover:text-[#4F46E5] transition">
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a href="#" className="hover:text-[#4F46E5] transition">
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

            <form onSubmit={handleContactSubmit} className="space-y-8">
              <div>
                <input 
                  type="text" 
                  placeholder="Full name *" 
                  required
                  value={contactForm.fullName}
                  onChange={(e) => setContactForm({ ...contactForm, fullName: e.target.value })}
                  className="w-full bg-transparent border-b border-gray-200 pb-3 text-sm focus:outline-none focus:border-[#4F46E5] text-gray-800 placeholder-gray-400 font-semibold transition-colors"
                />
              </div>

              <div>
                <input 
                  type="email" 
                  placeholder="Email *" 
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full bg-transparent border-b border-gray-200 pb-3 text-sm focus:outline-none focus:border-[#4F46E5] text-gray-800 placeholder-gray-400 font-semibold transition-colors"
                />
              </div>

              <div>
                <input 
                  type="text" 
                  placeholder="Subject" 
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  className="w-full bg-transparent border-b border-gray-200 pb-3 text-sm focus:outline-none focus:border-[#4F46E5] text-gray-800 placeholder-gray-400 font-semibold transition-colors"
                />
              </div>

              <div>
                <textarea 
                  placeholder="Message *" 
                  required
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  rows={2}
                  className="w-full bg-transparent border-b border-gray-200 pb-3 text-sm focus:outline-none focus:border-[#4F46E5] text-gray-800 placeholder-gray-400 font-semibold resize-none transition-colors"
                ></textarea>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-6 py-3 rounded-full text-xs font-extrabold shadow-sm transition active:scale-95"
                >
                  Send a message
                </button>
              </div>
            </form>
          </div>

        </div>
        </div>
      </section>

      {/* Footer Component */}
      <Footer />

    </div>
  );
}


