"use client";
import Cookies from 'js-cookie';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu, X, User, ArrowRight, Search, Bookmark, Bell
} from 'lucide-react';

interface NavbarProps {
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
}

export default function Navbar({ searchQuery = '', setSearchQuery }: NavbarProps) {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userInitial, setUserInitial] = useState('U');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeHash, setActiveHash] = useState('');
  const [localQuery, setLocalQuery] = useState(searchQuery);

  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (setSearchQuery) {
        setSearchQuery(localQuery);
      } else {
        window.location.href = `/search?q=${encodeURIComponent(localQuery)}`;
      }
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleHashChange = () => {
      setActiveHash(window.location.hash);
    };

    const handleScroll = () => {
      const sections = ['features', 'how-it-works', 'testimonials', 'contact'];
      let currentSection = '';

      if (window.scrollY < 200) {
        setActiveHash('');
        return;
      }

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 250 && rect.bottom >= 200) {
            currentSection = `#${section}`;
            break;
          }
        }
      }

      if (currentSection) {
        setActiveHash(currentSection);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('scroll', handleScroll);
    
    handleHashChange();
    handleScroll();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = Cookies.get('stayzo_token');
      setIsLoggedIn(!!token);
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const email = payload.email || '';
          setUserEmail(email);
          setIsOwner(!!payload.isOwner);
          setIsAdmin(!!payload.isAdmin);
          if (payload.firstName) {
            setUserInitial(payload.firstName.charAt(0).toUpperCase());
          } else if (payload.email) {
            setUserInitial(payload.email.charAt(0).toUpperCase());
          }

          // Live fetch profile image
          if (email) {
            fetch(`http://localhost:3001/api/auth/profile/${email}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            })
              .then(res => {
                if (res.status === 401 || res.status === 404) {
                  Cookies.remove('stayzo_token');
                  Cookies.remove('stayzo_refresh_token');
                  setIsLoggedIn(false);
                  setUserEmail('');
                  setUserInitial('U');
                  setProfileImage(null);
                  setIsOwner(false);
                  setIsAdmin(false);
                  throw new Error('Session invalid, logged out');
                }
                return res.json();
              })
              .then(data => {
                if (data.user) {
                  if (data.user.profileImage) {
                    setProfileImage(data.user.profileImage);
                  }
                } else if (data.error) {
                  Cookies.remove('stayzo_token');
                  Cookies.remove('stayzo_refresh_token');
                  setIsLoggedIn(false);
                  setUserEmail('');
                  setUserInitial('U');
                  setProfileImage(null);
                  setIsOwner(false);
                  setIsAdmin(false);
                }
              })
              .catch(err => console.warn("Landing navbar profile fetch issue:", err));
          }
        } catch (e) {
          console.error('Failed to parse token', e);
        }
      }
    }
  }, []);

  const getDashboardLink = () => {
    if (isAdmin) {
      return 'http://localhost:3005';
    }
    if (isOwner) {
      return '/dashboard/owners';
    }
    return '/dashboard/tenant';
  };

  const isSearchPage = pathname === '/search' || pathname.includes('/services/food') || pathname.includes('/services/job');

  return (
    <div className={`fixed left-0 right-0 z-50 flex justify-center pointer-events-none ${isSearchPage ? 'top-0' : 'top-6 px-4 md:px-6'}`}>
      <nav className={`w-full flex justify-between items-center pointer-events-auto transition-all ${isSearchPage
          ? 'bg-white/95 backdrop-blur-sm relative border-b border-gray-100 py-3 md:py-3.5 px-4 sm:px-6 lg:px-8'
          : 'max-w-6xl bg-white/95 backdrop-blur-sm shadow-lg py-2.5 px-6 md:px-8 rounded-full'
        }`}>

        {/* Logo with custom nested house SVG */}
        <Link href="/" className="flex items-center space-x-2 group shrink-0">
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
          <div className="hidden lg:flex items-center space-x-8 text-xs font-bold uppercase tracking-wide">
            <Link href="/" className={`${pathname === '/' && activeHash === '' ? 'text-[#1A1A1A] font-extrabold px-4 py-2' : 'text-gray-500 hover:text-[#1A1A1A] px-4 py-2 transition'}`}>Home</Link>
            <a href="/#features" className={`${activeHash === '#features' ? 'text-[#1A1A1A] font-extrabold px-4 py-2' : 'text-gray-500 hover:text-[#1A1A1A] px-4 py-2 transition'}`}>Features</a>
            <a href="/#how-it-works" className={`${activeHash === '#how-it-works' ? 'text-[#1A1A1A] font-extrabold px-4 py-2' : 'text-gray-500 hover:text-[#1A1A1A] px-4 py-2 transition'}`}>Process</a>
            <a href="/#testimonials" className={`${activeHash === '#testimonials' ? 'text-[#1A1A1A] font-extrabold px-4 py-2' : 'text-gray-500 hover:text-[#1A1A1A] px-4 py-2 transition'}`}>Testimonials</a>
            <a href="/#contact" className={`${activeHash === '#contact' ? 'text-[#1A1A1A] font-extrabold px-4 py-2' : 'text-gray-500 hover:text-[#1A1A1A] px-4 py-2 transition'}`}>Contact</a>
          </div>
        ) : (
          <div className="flex items-center absolute left-1/2 -translate-x-1/2 w-full max-w-[130px] sm:max-w-[240px] md:max-w-[280px]">
            <div className="relative w-full">
              <input
                type="text"
                value={localQuery}
                onChange={(e) => {
                  setLocalQuery(e.target.value);
                  if (setSearchQuery) {
                    setSearchQuery(e.target.value);
                  }
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search properties..."
                className="w-full bg-[#F5F7F8] border border-gray-150 text-[10px] sm:text-xs font-semibold text-gray-700 pl-7 sm:pl-8 pr-2 sm:pr-3 py-1.5 sm:py-2 rounded-full outline-none focus:ring-1 focus:ring-[#1A1A1A] transition shadow-inner"
              />
              <Search className="w-3 h-3 text-gray-400 absolute left-2.5 top-[9px] sm:top-[10px]" />
            </div>
          </div>
        )}

        {/* Right Actions */}
        {isSearchPage ? (
          isLoggedIn ? (
            <div className="flex items-center space-x-5 shrink-0">
              <a 
                href={getDashboardLink()} 
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = getDashboardLink();
                }}
                className="relative transition flex items-center group/profile" 
                title="Go to Dashboard"
              >
                <div className="relative">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="User Profile"
                      className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-md ring-2 ring-[#4F46E5]/10 group-hover/profile:ring-[#4F46E5]/40 transition-all duration-300 transform group-hover/profile:scale-105"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-md ring-2 ring-[#4F46E5]/10 group-hover/profile:ring-[#4F46E5]/40 transition-all duration-300 transform group-hover/profile:scale-105 shrink-0">
                      {userInitial}
                    </div>
                  )}
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                </div>
              </a>
            </div>
          ) : (
            <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
              <Link 
                href="/auth?role=landlord" 
                className="text-[10px] sm:text-xs font-extrabold text-gray-700 hover:text-[#1A1A1A] transition uppercase tracking-wide px-1.5 sm:px-3 py-1.5"
              >
                Login
              </Link>
              <Link
                href="/auth?role=landlord"
                className="bg-[#1A1A1A] hover:bg-black text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-extrabold tracking-wider uppercase transition flex items-center shadow-md"
              >
                <span className="hidden sm:inline">I'm Landlord</span>
                <span className="inline sm:hidden">Landlord</span>
                <ArrowRight className="w-3 h-3 ml-1 sm:ml-2" />
              </Link>
            </div>
          )
        ) : (
          <div className="hidden md:flex items-center space-x-5">
            {isLoggedIn ? (
              <Link href="/dashboard/tenant" className="relative transition flex items-center group/profile" title="Go to Dashboard">
                <div className="relative">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="User Profile"
                      className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-md ring-2 ring-[#4F46E5]/10 group-hover/profile:ring-[#4F46E5]/40 transition-all duration-300 transform group-hover/profile:scale-105"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-md ring-2 ring-[#4F46E5]/10 group-hover/profile:ring-[#4F46E5]/40 transition-all duration-300 transform group-hover/profile:scale-105 shrink-0">
                      {userInitial}
                    </div>
                  )}
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                </div>
              </Link>
            ) : (
              <Link href="/auth" className="text-xs font-extrabold text-gray-700 hover:text-[#1A1A1A] transition uppercase tracking-wide">Login</Link>
            )}
            <Link
              href={isLoggedIn && isOwner ? '/dashboard/owners' : '/auth?role=landlord'}
              className="bg-[#1A1A1A] hover:bg-black text-white px-5 py-2.5 rounded-full text-xs font-extrabold tracking-wider uppercase transition flex items-center shadow-md"
            >
              I am a landlord <ArrowRight className="w-3.5 h-3.5 ml-2" />
            </Link>
          </div>
        )}

        {/* Mobile Menu Toggle */}
        {!isSearchPage && (
          <div className="lg:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1 focus:outline-none cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-[#1A1A1A]" />
              ) : (
                <Menu className="w-6 h-6 text-[#1A1A1A]" />
              )}
            </button>
          </div>
        )}
      </nav>

      {/* Mobile Drawer Overlay */}
      {(!isSearchPage && isMobileMenuOpen) && (
        <div className="fixed inset-x-4 top-[84px] bg-white/95 backdrop-blur-md z-45 flex flex-col p-6 animate-in fade-in slide-in-from-top-5 duration-300 pointer-events-auto border border-gray-100 rounded-3xl shadow-xl lg:hidden">
          <div className="flex flex-col space-y-5 text-xs font-bold uppercase tracking-wider">
            <Link 
              href="/" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`${pathname === '/' && activeHash === '' ? 'text-[#4F46E5] font-black' : 'text-gray-500 hover:text-[#1A1A1A]'} transition-colors py-1.5`}
            >
              Home
            </Link>
            <a 
              href="/#features" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`${activeHash === '#features' ? 'text-[#4F46E5] font-black' : 'text-gray-500 hover:text-[#1A1A1A]'} transition-colors py-1.5`}
            >
              Features
            </a>
            <a 
              href="/#how-it-works" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`${activeHash === '#how-it-works' ? 'text-[#4F46E5] font-black' : 'text-gray-500 hover:text-[#1A1A1A]'} transition-colors py-1.5`}
            >
              Process
            </a>
            <a 
              href="/#testimonials" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`${activeHash === '#testimonials' ? 'text-[#4F46E5] font-black' : 'text-gray-500 hover:text-[#1A1A1A]'} transition-colors py-1.5`}
            >
              Testimonials
            </a>
            <a 
              href="/#contact" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`${activeHash === '#contact' ? 'text-[#4F46E5] font-black' : 'text-gray-500 hover:text-[#1A1A1A]'} transition-colors py-1.5`}
            >
              Contact
            </a>
            
            <div className="h-px bg-gray-100 my-1"></div>
            
            {isLoggedIn ? (
              <div className="flex flex-col space-y-4 pt-1">
                <Link 
                  href="/dashboard/tenant" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 text-[#1A1A1A] py-1.5"
                >
                  <div className="relative shrink-0">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="User Profile"
                        className="w-8 h-8 rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center text-[10px] font-bold">
                        {userInitial}
                      </div>
                    )}
                  </div>
                  <span className="text-xs uppercase font-extrabold tracking-wider">Dashboard</span>
                </Link>
                <Link 
                  href={isOwner ? '/dashboard/owners' : '/auth?role=landlord'}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="bg-[#1A1A1A] text-white px-5 py-3 rounded-full text-xs font-extrabold tracking-wider uppercase text-center transition hover:bg-black"
                >
                  I am a landlord
                </Link>
              </div>
            ) : (
              <div className="flex flex-col space-y-4 pt-1">
                <Link 
                  href="/auth?role=landlord" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-500 hover:text-[#1A1A1A] transition-colors py-1.5"
                >
                  Login
                </Link>
                <Link 
                  href="/auth?role=landlord" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="bg-[#1A1A1A] text-white px-5 py-3 rounded-full text-xs font-extrabold tracking-wider uppercase text-center transition hover:bg-black"
                >
                  I am a landlord
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}