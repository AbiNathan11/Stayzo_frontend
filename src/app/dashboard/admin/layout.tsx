"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Activity, FileText, MessageSquare, LogOut } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [adminUser, setAdminUser] = useState<{ firstName: string; lastName: string; email: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('stayzo_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setAdminUser({
          firstName: payload.firstName || 'Administrator',
          lastName: payload.lastName || '',
          email: payload.email || 'admin@stayzo.com',
        });
      } catch (e) {
        console.error('Failed to parse admin token', e);
        setAdminUser({ firstName: 'Admin', lastName: '', email: 'admin@stayzo.com' });
      }
    } else {
      setAdminUser({ firstName: 'Admin', lastName: 'User', email: 'admin@stayzo.com' });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('stayzo_token');
    window.location.href = '/';
  };

  const getPageTitle = () => {
    if (pathname === '/dashboard/admin') return 'Platform Overview';
    if (pathname?.startsWith('/dashboard/admin/users')) return 'Users Management';
    if (pathname?.startsWith('/dashboard/admin/activities')) return 'Activities Management';
    if (pathname?.startsWith('/dashboard/admin/reviews')) return 'Reviews Management';
    if (pathname?.startsWith('/dashboard/admin/agreements')) return 'Agreements Management';
    return 'Dashboard';
  };

  const navSections = [
    {
      label: '',
      items: [
        { href: '/dashboard/admin', label: 'Overview Dashboard', icon: LayoutDashboard },
        { href: '/dashboard/admin/users', label: 'User Accounts', icon: Users },
      ],
    },
    {
      label: '',
      items: [
        { href: '/dashboard/admin/activities', label: 'Activity Monitor', icon: Activity },
        { href: '/dashboard/admin/reviews', label: 'Ratings & Reviews', icon: MessageSquare },
      ],
    },
    {
      label: '',
      items: [
        { href: '/dashboard/admin/agreements', label: 'Agreements & Disputes', icon: FileText },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFB] text-[#1A1A1A] font-sans selection:bg-[#1A1A1A] selection:text-white flex">

      {/* SIDEBAR */}
      <aside className="w-[280px] bg-white border-r border-gray-100 flex flex-col shrink-0">

        {/* Brand Header */}
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="flex items-end space-x-1 h-5">
              <div className="w-[3px] h-3 bg-[#1A1A1A] rounded-full"></div>
              <div className="w-[3px] h-5 bg-[#1A1A1A] rounded-full"></div>
              <div className="w-[3px] h-4 bg-[#1A1A1A] rounded-full"></div>
              <div className="w-[3px] h-2.5 bg-[#1A1A1A] rounded-full"></div>
            </div>
            <span className="text-xl font-bold tracking-tight text-[#1A1A1A]">Stayzo</span>
            <span className="bg-[#1A1A1A] text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ml-1 tracking-wider">Admin</span>
          </Link>
        </div>

        {/* Menu Sections */}
        <div className="flex-1 px-4 py-8 overflow-y-auto space-y-8 select-none">
          {navSections.map((section, idx) => (
            <div key={idx}>
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest px-4 block mb-4">
                {section.label}
              </span>
              <nav className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-2xl text-xs font-extrabold transition text-left cursor-pointer ${isActive
                        ? 'bg-[#1A1A1A] text-white shadow-sm'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* Sidebar Footer with Logout */}
        <div className="p-6 border-t border-gray-50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3.5 px-4 py-3 rounded-2xl text-xs font-extrabold text-red-500 hover:bg-red-50 transition text-left cursor-pointer select-none"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Logout Administrator</span>
          </button>
        </div>

      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* HEADER */}
        <header className="h-20 bg-white border-b border-gray-100 px-8 flex justify-between items-center z-45 shrink-0 select-none">
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-gray-900 capitalize">
              {getPageTitle()}
            </h1>
            <p className="text-gray-400 text-[10px] font-extrabold uppercase tracking-wider mt-0.5">
              Stayzo Control Terminal &bull; Live Status
            </p>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-xs font-extrabold text-gray-900">{adminUser?.firstName} {adminUser?.lastName}</p>
                <p className="text-[10px] font-bold text-gray-400">{adminUser?.email}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#1A1A1A] text-white border border-gray-100 shadow-sm flex items-center justify-center font-extrabold text-sm select-none">
                {adminUser?.firstName?.charAt(0).toUpperCase() || 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-8 max-w-7xl w-full mx-auto space-y-8">
          {children}
        </main>

      </div>
    </div>
  );
}
