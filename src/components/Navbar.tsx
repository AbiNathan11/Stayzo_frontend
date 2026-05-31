"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu, User, ArrowRight, Search, Bookmark, Bell
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('stayzo_token');
      setIsLoggedIn(!!token);
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setUserEmail(payload.email || '');
        } catch (e) {
          console.error('Failed to parse token', e);
        }
      }
    }
  }, []);

  const getDashboardLink = () => {
    const lowerEmail = userEmail.toLowerCase();
    if (lowerEmail.startsWith('admin@')) {
      return '/dashboard/admin';
    }
    if (lowerEmail.includes('owner') || lowerEmail.includes('landlord')) {
      return '/dashboard/owners';
    }
    return '/dashboard/tenant';
  };

  const isSearchPage = pathname === '/search';

  return (
    <div className={`fixed left-0 right-0 z-50 flex justify-center pointer-events-none ${isSearchPage ? 'top-0' : 'top-6 px-4 md:px-6'}`}>
      <nav className={`w-full flex justify-between items-center pointer-events-auto transition-all ${isSearchPage
          ? 'bg-white/95 backdrop-blur-sm relative border-b border-gray-100 py-3 md:py-3.5 px-6 lg:px-8'
          : 'max-w-6xl bg-white/95 backdrop-blur-sm shadow-lg py-2.5 px-6 md:px-8 rounded-full'
        }`}>

        {/* Logo with custom nested house SVG */}
        <Link href="/" className="flex items-center space-x-2.5 group">
          <svg 
            viewBox="0 0 100 100" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="5.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="w-6 h-6 text-[#1A1A1A] shrink-0 transition-transform group-hover:scale-105"
          >
            {/* Outer gable */}
            <path d="M 20,90 L 20,40 L 50,15 L 80,40 L 80,90" />
            {/* Middle gable */}
            <path d="M 30,90 L 30,46 L 50,28 L 70,46 L 70,90" />
            {/* High peak */}
            <path d="M 40,90 L 40,24 L 50,15" />
            {/* Inner gable */}
            <path d="M 42,90 L 42,54 L 50,46 L 58,54 L 58,90" />
            {/* Central Door */}
            <rect x="46" y="72" width="8" height="18" />
          </svg>
          <span className="text-xl font-bold tracking-tight text-[#1A1A1A]">Stayzo</span>
        </Link>

        {/* Center Links or Search Bar */}
        {!isSearchPage ? (
          <div className="hidden lg:flex items-center space-x-8 text-xs font-bold uppercase tracking-wide">
            <Link href="/" className={`${pathname === '/' ? 'text-[#1A1A1A] font-extrabold px-4 py-2' : 'text-gray-500 hover:text-[#1A1A1A] px-4 py-2 transition'}`}>Home</Link>
            <a href="/#features" className="text-gray-500 hover:text-[#1A1A1A] px-4 py-2 transition">Features</a>
            <a href="/#how-it-works" className="text-gray-500 hover:text-[#1A1A1A] px-4 py-2 transition">Process</a>
            <a href="/#testimonials" className="text-gray-500 hover:text-[#1A1A1A] px-4 py-2 transition">Testimonials</a>
            <a href="/#contact" className="text-gray-500 hover:text-[#1A1A1A] px-4 py-2 transition">Contact</a>
          </div>
        ) : (
          <div className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2 w-full max-w-[280px]">
            <div className="relative w-full">
              <input
                type="text"
                className="w-full bg-[#F5F7F8] border border-gray-150 text-xs font-semibold text-gray-700 pl-8 pr-3 py-2 rounded-full outline-none focus:ring-1 focus:ring-[#1A1A1A] transition shadow-inner"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-[10px]" />
            </div>
          </div>
        )}

        {/* Right Actions */}
        {(isSearchPage && isLoggedIn) ? (
          <div className="flex items-center space-x-5">

            <Bookmark className="w-4 h-4 text-gray-600 hover:text-[#1A1A1A] cursor-pointer transition" />
            <Bell className="w-4 h-4 text-gray-600 hover:text-[#1A1A1A] cursor-pointer transition" />

            <div className="w-px h-5 bg-gray-200"></div>

            <div className="flex items-center cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border border-gray-100 shadow-sm"
              />
            </div>
          </div>
        ) : (
          <div className="hidden md:flex items-center space-x-5">
            {isLoggedIn ? (
              <Link href={getDashboardLink()} className="text-[#1A1A1A] hover:text-gray-600 transition flex items-center" title="Go to Dashboard">
                <User className="w-5 h-5" />
              </Link>
            ) : (
              <Link href="/auth" className="text-xs font-extrabold text-gray-700 hover:text-[#1A1A1A] transition uppercase tracking-wide">Login</Link>
            )}
            <Link
              href={isLoggedIn ? '/dashboard/owners' : '/auth'}
              className="bg-[#1A1A1A] hover:bg-black text-white px-5 py-2.5 rounded-full text-xs font-extrabold tracking-wider uppercase transition flex items-center shadow-md"
            >
              I am a landlord <ArrowRight className="w-3.5 h-3.5 ml-2" />
            </Link>
          </div>
        )}

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden">
          <Menu className="w-6 h-6 text-[#1A1A1A]" />
        </div>
      </nav>
    </div>
  );
}