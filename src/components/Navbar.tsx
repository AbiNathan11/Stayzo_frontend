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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('stayzo_token');
      setIsLoggedIn(!!token);
    }
  }, []);

  const isSearchPage = pathname === '/search';

  return (
    <div className={`fixed left-0 right-0 z-50 flex justify-center pointer-events-none ${isSearchPage ? 'top-0' : 'top-6 px-4 md:px-6'}`}>
      <nav className={`w-full bg-white/95 backdrop-blur-sm flex justify-between items-center pointer-events-auto transition-all ${
        isSearchPage 
          ? 'relative border-b border-gray-100 py-3 md:py-3.5 px-6 lg:px-8' 
          : 'max-w-5xl border border-gray-100 shadow-lg shadow-gray-200/20 py-3 md:py-3.5 px-6 md:px-8 rounded-full'
      }`}>
        
        {/* Logo with optional icon */}
        <Link href="/" className="flex items-center space-x-2.5 group">
          <div className="flex items-end space-x-1 h-5">
            <div className="w-[3px] h-3 bg-[#1A1A1A] rounded-full group-hover:bg-[#1A1A1A] transition-colors"></div>
            <div className="w-[3px] h-5 bg-[#1A1A1A] rounded-full group-hover:bg-[#1A1A1A] transition-colors"></div>
            <div className="w-[3px] h-4 bg-[#1A1A1A] rounded-full group-hover:bg-[#1A1A1A] transition-colors"></div>
            <div className="w-[3px] h-2.5 bg-[#1A1A1A] rounded-full group-hover:bg-[#1A1A1A] transition-colors"></div>
          </div>
          <span className="text-xl font-bold tracking-tight text-[#1A1A1A]">Stayzo</span>
        </Link>
        
        {/* Center Links or Search Bar */}
        {!isSearchPage ? (
          <div className="hidden lg:flex items-center space-x-8 text-xs font-bold text-gray-500 uppercase tracking-wide">
            <Link href="/" className={`${pathname === '/' ? 'text-[#1A1A1A] bg-gray-100/80 px-4 py-2 rounded-full' : 'hover:text-[#1A1A1A] px-4 py-2 transition'}`}>Home</Link>
            <a href="/#features" className="hover:text-[#1A1A1A] px-4 py-2 transition">Features</a>
            <a href="/#testimonials" className="hover:text-[#1A1A1A] px-4 py-2 transition">Testimonials</a>
            <a href="/#contact" className="hover:text-[#1A1A1A] px-4 py-2 transition">Contact</a>
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
          <div className="hidden md:flex items-center space-x-6">
            {isLoggedIn ? (
              <Link href="/dashboard/tenant" className="text-[#1A1A1A] hover:text-[#1A1A1A] transition flex items-center">
                <User className="w-5 h-5" />
              </Link>
            ) : (
              <Link href="/auth" className="text-xs font-extrabold text-gray-700 hover:text-[#1A1A1A] transition uppercase tracking-wide">Login</Link>
            )}
            <Link href="/auth" className="bg-[#1A1A1A] hover:bg-black text-white px-5 py-2.5 rounded-full text-xs font-extrabold tracking-wider uppercase transition flex items-center shadow-md">
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


