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
    { name: 'My Bookings', href: '/dashboard/tenant/bookings', icon: KeyRound },
    { name: 'Saved Properties', href: '/dashboard/tenant/saved', icon: Heart },
    { name: 'Visit Scheduler', href: '/dashboard/tenant/visits', icon: CalendarCheck },
    { name: 'Secure Chat', href: '/dashboard/tenant/chat', icon: MessageSquare },
    { name: 'Digital Vault', href: '/dashboard/tenant/documents', icon: FileText },
    { name: 'Relocation Services', href: '/dashboard/tenant/services', icon: Compass },
  ];

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] font-sans selection:bg-[#1A1A1A] selection:text-white flex flex-col">
      
      {/* Top Header */}
      <header className="w-full bg-white border-b border-gray-200 py-4 px-6 sm:px-10 flex justify-between items-center z-50 shrink-0 select-none">
        
        {/* Left Brand Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="flex items-end space-x-1 h-5">
            <div className="w-[3px] h-3 bg-[#1A1A1A] rounded-full group-hover:bg-[#1A1A1A] transition-colors"></div>
            <div className="w-[3px] h-5 bg-[#1A1A1A] rounded-full group-hover:bg-[#1A1A1A] transition-colors"></div>
            <div className="w-[3px] h-4 bg-[#1A1A1A] rounded-full group-hover:bg-[#1A1A1A] transition-colors"></div>
            <div className="w-[3px] h-2.5 bg-[#1A1A1A] rounded-full group-hover:bg-[#1A1A1A] transition-colors"></div>
          </div>
          <span className="text-xl font-bold tracking-tight text-[#1A1A1A]">Stayzo</span>
        </Link>

        {/* Right utility options */}
        <div className="flex items-center space-x-4">
          <span className="hidden sm:inline text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-50 px-4 py-2 rounded-full transition">
            Switch to owner
          </span>
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

      {/* Horizontal Dashboard Navigation */}
      <div className="w-full bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40 overflow-x-auto no-scrollbar">
        <nav className="max-w-[1200px] mx-auto px-6 sm:px-10 flex items-center space-x-1 sm:space-x-4 py-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition whitespace-nowrap select-none ${
                  isActive 
                    ? 'bg-[#1A1A1A] text-white' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-[1200px] w-full mx-auto px-6 sm:px-10 py-10">
        <main className="w-full min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
