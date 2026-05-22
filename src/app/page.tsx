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
      <section className="relative w-full bg-white overflow-hidden pt-44 pb-28">
        
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


      {/* Why Stayzo — 3-Column Horizontal Features Layout */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24 bg-white border-t border-gray-100">
        <div className="bg-[#F8FAFB] rounded-[40px] p-12 md:p-20 border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-12 items-start">

            {/* Left Column: Label + Heading + Description + CTA */}
            <div className="flex flex-col items-start">
              <span className="text-xs font-extrabold text-[#1A1A1A] uppercase tracking-[0.2em] mb-6 border-b-2 border-[#1A1A1A] pb-1">Features</span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-[#1A1A1A] leading-tight mb-7 tracking-tight">
                Why People <span className="text-[#1A1A1A]">Choose</span> Us?
              </h2>
              <p className="text-gray-500 font-medium text-base leading-relaxed mb-10">
                We handle the heavy lifting — from in-depth property verification to seamless digital lease agreements — so you can focus on finding your dream home.
              </p>
              <Link href="/search" className="border-2 border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white text-[#1A1A1A] px-8 py-3.5 rounded-full text-xs font-extrabold tracking-[0.15em] uppercase transition">
                Find a Property
              </Link>
            </div>

            {/* Middle Column: 2 Feature Items */}
            <div className="flex flex-col divide-y divide-gray-200">
              {[
                {
                  icon: <ShieldCheck className="w-6 h-6 text-[#1A1A1A]" />,
                  title: "Verified Landlords",
                  desc: "Every landlord and property goes through a rigorous vetting process before listing on our platform."
                },
                {
                  icon: <Sparkles className="w-6 h-6 text-[#1A1A1A]" />,
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
                  icon: <Building2 className="w-6 h-6 text-[#1A1A1A]" />,
                  title: "Premium Properties",
                  desc: "Access high-quality, modern properties in prime locations across Sri Lanka at competitive prices."
                },
                {
                  icon: <Home className="w-6 h-6 text-[#1A1A1A]" />,
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

      {/* Testimonials Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24 bg-white border-t border-gray-100">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6">
          <div>
            <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-4 block">— Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#1A1A1A] leading-[1.15] tracking-tight">
              What our tenants <br className="hidden md:block" /> are saying.
            </h2>
          </div>
          <p className="text-gray-500 font-medium text-sm leading-relaxed max-w-xs md:text-right">
            Real stories from real people who found their perfect home through Stayzo.
          </p>
        </div>

        {/* 3-Column Clean Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
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
            }
          ].map((t, i) => (
            <div key={i} className="bg-[#F8FAFB] rounded-3xl p-8 flex flex-col justify-between min-h-[260px] border border-gray-100/80">
              {/* Large quotation mark */}
              <div>
                <span className="text-5xl font-extrabold text-gray-200 leading-none select-none">"</span>
                <p className="text-[#1A1A1A] font-semibold text-[15px] leading-relaxed mt-3 mb-8">
                  {t.quote}
                </p>
              </div>
              {/* Avatar + name + handle */}
              <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover shrink-0"
                />
                <div>
                  <p className="font-extrabold text-[#1A1A1A] text-sm leading-tight">{t.name}</p>
                  <p className="text-gray-400 text-xs font-semibold">{t.handle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section (Floating Cards Accordion Layout) */}
      <section className="bg-[#F8FAFB] pt-24 pb-24 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-6">
          
          <div className="text-center mb-12">
            <div className="flex justify-center items-center space-x-2 mb-4">
               <span className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A]"></span>
               <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#1A1A1A]">FAQs</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1A1A] tracking-tight mb-4">
              Frequently asked <span className="relative inline-block">
                questions
                <svg className="absolute -bottom-2 left-0 w-full h-2 text-[#1A1A1A]" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path d="M0,15 Q50,5 100,15" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round"/>
                </svg>
              </span>
            </h2>
            <p className="text-gray-500 font-medium text-sm leading-relaxed max-w-sm mx-auto">
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
              <details key={i} className="group bg-white rounded-3xl overflow-hidden cursor-pointer shadow-sm transition-all border border-gray-100/50 hover:shadow-md">
                <summary className="flex justify-between items-center p-6 md:p-8 select-none marker:content-none list-none outline-none">
                  <span className="text-sm font-extrabold text-[#1A1A1A] pr-4">{faq.q}</span>
                  <div className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center shrink-0 relative transition-transform">
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
                  className="bg-[#1A1A1A] hover:bg-black text-white px-6 py-3 rounded-full text-xs font-extrabold shadow-sm transition active:scale-95"
                >
                  Send a message
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


