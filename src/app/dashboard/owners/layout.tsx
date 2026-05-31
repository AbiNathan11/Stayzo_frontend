"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, KeyRound, MessageSquare, 
  CalendarCheck, FileSignature, User, Bell, ArrowRight
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
    { name: 'Home', href: '/dashboard/owners', icon: LayoutDashboard },
    { name: 'Listings', href: '/dashboard/owners/listings', icon: KeyRound },
    { name: 'Appointments', href: '/dashboard/owners/appointments', icon: CalendarCheck },
    { name: 'Chat', href: '/dashboard/owners/chat', icon: MessageSquare },
    { name: 'Agreement', href: '/dashboard/owners/agreement', icon: FileSignature },
    { name: 'Profile', href: '/dashboard/owners/profile', icon: User },
  ];

  if (pathname.includes('/start_listing')) {
    return <>{children}</>;
  }

  const isChat = pathname.includes('/chat');

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] font-sans selection:bg-[#1A1A1A] selection:text-white flex flex-col animate-in fade-in duration-300">
      
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
        <nav className="hidden lg:flex items-center space-x-8 flex-none">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href}
                className={`text-xs font-bold transition whitespace-nowrap select-none ${
                  isActive 
                    ? 'text-[#1A1A1A]' 
                    : 'text-gray-500 hover:text-[#1A1A1A]'
                }`}
              >
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Right utility options */}
        <div className="flex-1 flex justify-end items-center space-x-6">
          <Link 
            href="/dashboard/tenant"
            className="hidden sm:flex items-center space-x-2 bg-[#1A1A1A] text-white px-5 py-2.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest hover:bg-black transition shadow-sm"
          >
            <span>I am a tenant</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <div className="relative cursor-pointer hover:opacity-80 transition">
            <Bell className="w-5 h-5 text-[#1A1A1A]" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-black rounded-full border border-white"></span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className={`flex-1 w-full mx-auto flex flex-col ${isChat ? 'max-w-none px-4 py-4' : 'max-w-[1200px] px-6 sm:px-10 py-10'}`}>
        <main className="w-full min-w-0 flex-1 min-h-0 flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
}
