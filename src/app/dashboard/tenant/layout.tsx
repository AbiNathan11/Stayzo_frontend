"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LogOut, LayoutDashboard, KeyRound, Heart, 
  CalendarCheck, MessageSquare, FileText, Compass
} from 'lucide-react';

export default function TenantDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const [user, setUser] = useState<{ firstName: string; lastName: string; email: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('stayzo_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({
          firstName: payload.firstName || 'Abiramy',
          lastName: payload.lastName || '',
          email: payload.email || 'abiramy@example.com'
        });
      } catch (e) {
        setUser({ firstName: 'Abiramy', lastName: '', email: 'abiramy@example.com' });
      }
    } else {
      setUser({ firstName: 'Abiramy', lastName: '', email: 'abiramy@example.com' });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('stayzo_token');
    window.location.href = '/';
  };

  const userInitial = user?.firstName?.charAt(0).toUpperCase() || 'A';

  const navItems = [
    { name: 'Overview', href: '/dashboard/tenant', icon: LayoutDashboard },
    { name: 'Saved Properties', href: '/dashboard/tenant/saved', icon: Heart },
    { name: 'Visit Scheduler', href: '/dashboard/tenant/visits', icon: CalendarCheck },
    { name: 'Secure Chat', href: '/dashboard/tenant/chat', icon: MessageSquare },
    { name: 'Relocation Services', href: '/dashboard/tenant/services', icon: Compass },
  ];

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] font-sans selection:bg-[#1A1A1A] selection:text-white flex flex-col">
      
      {/* Top Header with Navigation */}
      <header className="w-full bg-white border-b border-gray-200 py-4 px-6 sm:px-10 flex items-center justify-between z-50 shrink-0 select-none sticky top-0">
        
        {/* Left Brand Logo */}
        <div className="flex-1 flex justify-start">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <svg 
              viewBox="0 0 100 100" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="5.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="w-5.5 h-5.5 text-[#1A1A1A] shrink-0 transition-transform group-hover:scale-105"
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
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1 flex-none">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link 
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 px-3 py-2 rounded-full text-xs font-semibold transition whitespace-nowrap select-none ${
                  isActive 
                    ? 'bg-[#1A1A1A] text-white' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Right utility options */}
        <div className="flex-1 flex justify-end items-center space-x-4">
          <Link 
            href="/dashboard/owners"
            className="hidden sm:inline text-sm font-semibold text-gray-900 hover:bg-gray-50 px-4 py-2 rounded-full transition"
          >
            Switch to owner
          </Link>
          <button 
            onClick={handleLogout} 
            className="flex items-center space-x-3 bg-white border border-gray-200 hover:shadow-md transition rounded-full p-2 pr-4 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center text-xs font-bold shrink-0">
              {userInitial}
            </div>
            <span className="text-sm font-semibold text-gray-700 hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className={`flex-1 w-full mx-auto ${
        pathname === '/dashboard/tenant/chat'
          ? 'max-w-none px-0 py-0'
          : 'max-w-none px-6 sm:px-10 py-10'
      }`}>
        <main className="w-full min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
