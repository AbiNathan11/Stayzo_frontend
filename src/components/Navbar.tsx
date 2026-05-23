"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Menu, User, ArrowRight, Search, Bookmark, Bell
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('stayzo_token');
      setIsLoggedIn(!!token);
    }
  }, []);

  const handleLandlordClick = () => {
    const token = localStorage.getItem('stayzo_token');
    if (token) {
      router.push('/dashboard/owners');
    } else {
      router.push('/auth');
    }
  };

  const isSearchPage = pathname === '/search';

  return (
    <nav className="w-full bg-white border-b border-gray-100 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-between items-center">
        
        {/* Logo with clean vertical bars representing building/bricks */}
        <Link href="/" className="flex items-center space-x-2.5 group">
          <div className="flex items-end space-x-1 h-5">
            <div className="w-[3px] h-3 bg-[#1A1A1A] rounded-full group-hover:bg-[#F26B27] transition-colors"></div>
            <div className="w-[3px] h-5 bg-[#1A1A1A] rounded-full group-hover:bg-[#F26B27] transition-colors"></div>
            <div className="w-[3px] h-4 bg-[#1A1A1A] rounded-full group-hover:bg-[#F26B27] transition-colors"></div>
            <div className="w-[3px] h-2.5 bg-[#1A1A1A] rounded-full group-hover:bg-[#F26B27] transition-colors"></div>
          </div>
          <span className="text-xl font-bold tracking-tight text-[#1A1A1A]">Stayzo</span>
        </Link>
        
        {/* Center Links */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-gray-500">
          <Link href="/" className={`${pathname === '/' ? 'text-[#1A1A1A] border-b-2 border-[#1A1A1A] pb-1 font-bold' : 'hover:text-[#1A1A1A] transition'}`}>Home</Link>
          <Link href="/search" className={`${pathname === '/search' ? 'text-[#1A1A1A] border-b-2 border-[#1A1A1A] pb-1 font-bold' : 'hover:text-[#1A1A1A] transition'}`}>Properties</Link>
          <Link href="#" className="hover:text-[#1A1A1A] transition">About</Link>
          <Link href="#" className="hover:text-[#1A1A1A] transition">Contact</Link>
        </div>

        {/* Right Actions */}
        {isSearchPage ? (
          <div className="flex items-center space-x-6">
            <div className="relative hidden lg:block">
              <input 
                type="text" 
                placeholder="Search" 
                className="bg-[#F5F7F8] text-sm text-gray-700 pl-10 pr-4 py-2 w-64 rounded-lg outline-none focus:ring-1 focus:ring-[#1A1A1A] transition"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>

            <Bookmark className="w-5 h-5 text-gray-600 hover:text-[#F26B27] cursor-pointer transition" />
            <Bell className="w-5 h-5 text-gray-600 hover:text-[#F26B27] cursor-pointer transition" />
            
            <div className="w-px h-6 bg-gray-200"></div>

            <div className="flex items-center space-x-3 cursor-pointer">
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
              <Link href="/dashboard/tenant" className="text-[#1A1A1A] hover:text-[#F26B27] transition flex items-center">
                <User className="w-5 h-5" />
              </Link>
            ) : (
              <Link href="/auth" className="text-sm font-bold text-gray-700 hover:text-[#1A1A1A] transition">Login</Link>
            )}
            <button
              onClick={handleLandlordClick}
              className="bg-[#1A1A1A] hover:bg-black text-white px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition flex items-center shadow-sm cursor-pointer"
            >
              I am a landlord <ArrowRight className="w-3 h-3 ml-2" />
            </button>
          </div>
        )}

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <Menu className="w-6 h-6 text-[#1A1A1A]" />
        </div>
      </div>
    </nav>
  );
}
