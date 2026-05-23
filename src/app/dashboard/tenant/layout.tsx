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
      <header className="w-full bg-white border-b border-gray-150 py-5 px-6 sm:px-12 flex justify-between items-center z-50 shrink-0 select-none">
        
        {/* Left Brand Logo */}
        <Link href="/" className="flex items-center space-x-2.5 group">
          <div className="flex items-end space-x-1 h-5">
            <div className="w-[3px] h-3 bg-[#1A1A1A] rounded-full group-hover:bg-[#1A1A1A] transition-colors"></div>
            <div className="w-[3px] h-5 bg-[#1A1A1A] rounded-full group-hover:bg-[#1A1A1A] transition-colors"></div>
            <div className="w-[3px] h-4 bg-[#1A1A1A] rounded-full group-hover:bg-[#1A1A1A] transition-colors"></div>
            <div className="w-[3px] h-2.5 bg-[#1A1A1A] rounded-full group-hover:bg-[#1A1A1A] transition-colors"></div>
          </div>
          <span className="text-xl font-bold tracking-tight text-[#1A1A1A]">Stayzo</span>
        </Link>

        {/* Center Navigation Links (Simplified for Layout) */}
        <nav className="hidden md:flex items-center space-x-8 text-xs font-bold text-gray-500">
          <span className="text-gray-900 font-extrabold uppercase tracking-wider">Tenant Dashboard</span>
        </nav>

        {/* Right utility options */}
        <div className="flex items-center space-x-6">
          <div className="hidden sm:flex items-center space-x-2 text-xs font-bold text-gray-600">
            <div className="w-6 h-6 rounded-full bg-[#1A1A1A]/10 text-[#1A1A1A] flex items-center justify-center text-[10px] font-extrabold shrink-0 border border-[#1A1A1A]/10">
              {userInitial}
            </div>
            <span>{user?.firstName}</span>
          </div>
          <button 
            onClick={handleLogout} 
            className="flex items-center space-x-1.5 text-xs font-extrabold text-red-500 hover:text-red-600 transition uppercase tracking-wider cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </header>

      {/* Main Layout Grid */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto px-6 sm:px-12 py-10 gap-10">
        
        {/* Left Column: Sidebar Navigation */}
        <aside className="w-full md:w-[260px] shrink-0">
          <div className="space-y-6 sticky top-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-6">Menu</h1>
            
            <nav className="flex flex-col space-y-1.5">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <Link 
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-3.5 w-full px-4 py-3 rounded-2xl text-xs font-extrabold transition text-left select-none ${
                      isActive 
                        ? 'bg-gray-100 text-gray-900' 
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#1A1A1A]' : 'text-gray-400'}`} />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        </aside>

        {/* Vertical divider line */}
        <div className="hidden md:block w-px bg-gray-100 self-stretch"></div>

        {/* Right Column: Displaying Active Page Content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>

      </div>
    </div>
  );
}
