"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, ArrowRight } from 'lucide-react';
import Footer from '@/components/Footer';

const navLinks = [
  { label: 'Home', href: '/dashboard/owners' },
  { label: 'Listings', href: '/dashboard/owners/listings' },
  { label: 'Appointments', href: '/dashboard/owners/appointments' },
  { label: 'Chat', href: '/dashboard/owners/chat' },
  { label: 'Profile', href: '/dashboard/owners/profile' },
];

export default function OwnerDashboard() {
  const pathname = usePathname();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    try {
      const token = localStorage.getItem('stayzo_token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserName(payload.firstName || '');
      }
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F0EEF8' }}>

      {/* ── Navbar ── */}
      <header className="w-full bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-[60px] flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="flex items-end space-x-[3px] h-5">
              <div className="w-[3px] h-3 bg-[#1A1A1A] rounded-full" />
              <div className="w-[3px] h-5 bg-[#1A1A1A] rounded-full" />
              <div className="w-[3px] h-4 bg-[#1A1A1A] rounded-full" />
              <div className="w-[3px] h-2.5 bg-[#1A1A1A] rounded-full" />
            </div>
            <span className="text-[15px] font-black tracking-tight text-[#1A1A1A] uppercase">
              Stayzo
            </span>
          </Link>

          {/* Center Nav */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-4 py-2 text-[13px] font-semibold rounded-full transition-colors ${
                    isActive
                      ? 'text-[#1A1A1A] bg-gray-100'
                      : 'text-gray-500 hover:text-[#1A1A1A] hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="flex items-center space-x-1.5 bg-[#1A1A1A] hover:bg-black text-white text-[12px] font-extrabold tracking-wider uppercase px-5 py-2.5 rounded-full transition-colors shadow-md"
            >
              <span>I am a Tenant</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              id="owner-notifications-btn"
              className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-[#1A1A1A]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#1A1A1A] rounded-full" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <main className="flex-1 flex items-center justify-center px-6 text-center min-h-[calc(100vh-60px)]">
        <div className="max-w-2xl">
          <h1
            className="text-[56px] md:text-[72px] font-black text-[#1A1A1A] leading-none tracking-tight mb-6"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            START YOUR LISTING
          </h1>
          <p className="text-[16px] text-gray-500 font-medium leading-relaxed mb-10 max-w-lg mx-auto">
            Join thousands of hosts worldwide and turn your property into a successful stay with Stayzo&apos;s premium management tools.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              id="owner-get-started-btn"
              href="/dashboard/owners/listings/new"
              className="flex items-center space-x-2 bg-[#1A1A1A] hover:bg-black text-white text-[13px] font-extrabold tracking-widest uppercase px-8 py-4 rounded-full transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>GET STARTED</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              id="owner-learn-more-btn"
              className="bg-white hover:bg-gray-50 text-[#1A1A1A] text-[13px] font-extrabold tracking-widest uppercase px-8 py-4 rounded-full border border-gray-200 transition-all shadow hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
            >
              LEARN MORE
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}