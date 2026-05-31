"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, KeyRound, MessageSquare, 
  CalendarCheck, FileSignature 
} from 'lucide-react';

export default function OwnerDashboardLayout({
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
    { name: 'Overview', href: '/dashboard/owners', icon: LayoutDashboard },
    { name: 'Properties', href: '/dashboard/owners/listings', icon: KeyRound },
    { name: 'Inquiries', href: '/dashboard/owners/appointments', icon: CalendarCheck },
    { name: 'Messages', href: '/dashboard/owners/chat', icon: MessageSquare },
    { name: 'Contracts', href: '/dashboard/owners/agreement', icon: FileSignature },
  ];

  if (pathname.includes('/start_listing')) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] font-sans selection:bg-[#1A1A1A] selection:text-white flex flex-col animate-in fade-in duration-300">
      
      {/* Top Header with Navigation */}
      <header className="w-full bg-white border-b border-gray-200 py-4 px-6 sm:px-10 flex items-center justify-between z-50 shrink-0 select-none sticky top-0">
        
        {/* Left Brand Logo */}
        <div className="flex-1 flex justify-start">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="flex items-end space-x-1 h-5">
              <div className="w-[3px] h-3 bg-[#1A1A1A] rounded-full group-hover:bg-black transition-colors"></div>
              <div className="w-[3px] h-5 bg-[#1A1A1A] rounded-full group-hover:bg-black transition-colors"></div>
              <div className="w-[3px] h-4 bg-[#1A1A1A] rounded-full group-hover:bg-black transition-colors"></div>
              <div className="w-[3px] h-2.5 bg-[#1A1A1A] rounded-full group-hover:bg-black transition-colors"></div>
            </div>
            <span className="text-xl font-bold tracking-tight text-[#1A1A1A]">Stayzo</span>
          </Link>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1 flex-none">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-semibold transition whitespace-nowrap select-none ${
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
            href="/dashboard/tenant"
            className="hidden sm:inline text-sm font-semibold text-gray-900 hover:bg-gray-50 px-4 py-2 rounded-full transition"
          >
            Switch to tenant
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
      <div className="flex-1 max-w-[1200px] w-full mx-auto px-6 sm:px-10 py-10">
        <main className="w-full min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
