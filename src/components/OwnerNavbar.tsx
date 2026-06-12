"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, ArrowRight, CheckCheck, CalendarCheck, X } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';

const navLinks = [
  { label: 'Home', href: '/dashboard/owners' },
  { label: 'Listings', href: '/dashboard/owners/listings' },
  { label: 'Appointments', href: '/dashboard/owners/appointments' },
  { label: 'Chat', href: '/dashboard/owners/chat' },
  { label: 'Agreement', href: '/dashboard/owners/agreement' },
  { label: 'Profile', href: '/dashboard/owners/profile' },
];

export default function OwnerNavbar() {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, markAllRead, markOneRead } = useNotifications();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifTypeIcon = (type: string) => {
    if (type === 'booking_confirmed') return '✅';
    if (type === 'booking_cancelled') return '❌';
    if (type === 'booking_request')   return '📅';
    return '🔔';
  };

  return (
    <header className="w-full bg-white border-b border-gray-100 shadow-sm shrink-0 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-[60px] flex items-center justify-between">

        {/* Logo with custom nested house SVG */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="flex items-end space-x-1 h-5">
            <div className="w-[3px] h-3 bg-[#1A1A1A] rounded-full group-hover:bg-[#1A1A1A] transition-colors"></div>
            <div className="w-[3px] h-5 bg-[#1A1A1A] rounded-full group-hover:bg-[#1A1A1A] transition-colors"></div>
            <div className="w-[3px] h-4 bg-[#1A1A1A] rounded-full group-hover:bg-[#1A1A1A] transition-colors"></div>
            <div className="w-[3px] h-2.5 bg-[#1A1A1A] rounded-full group-hover:bg-[#1A1A1A] transition-colors"></div>
          </div>
          <span className="text-[15px] font-black tracking-tight text-[#1A1A1A] uppercase">
            Stayzo
          </span>
        </Link>

        {/* Center Nav */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => {
            const finalIsActive = link.href === '/dashboard/owners' ? pathname === link.href : pathname.startsWith(link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`px-4 py-2 text-[13px] font-semibold rounded-full transition-colors ${
                  finalIsActive
                    ? 'text-[#1A1A1A] bg-gray-100'
                    : 'text-gray-500 hover:text-[#1A1A1A] hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center space-x-3">
          <Link
            href="/dashboard/tenant"
            className="flex items-center space-x-1.5 bg-[#1A1A1A] hover:bg-black text-white text-[12px] font-extrabold tracking-wider uppercase px-5 py-2.5 rounded-full transition-colors shadow-md"
          >
            <span>I am a Tenant</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <div className="relative" ref={notifRef}>
            <button
              id="owner-notifications-btn"
              onClick={() => setShowNotifications(v => !v)}
              className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-[#1A1A1A]" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center px-1">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-11 w-80 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <span className="text-xs font-black text-[#1A1A1A] uppercase tracking-wider">Notifications</span>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="flex items-center gap-1 text-[10px] font-bold text-gray-500 hover:text-[#1A1A1A] transition"
                      >
                        <CheckCheck className="w-3 h-3" /> Mark all read
                      </button>
                    )}
                    <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-gray-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center">
                      <CalendarCheck className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                      <p className="text-xs text-gray-400 font-semibold">No notifications yet</p>
                    </div>
                  ) : (
                    notifications.slice(0, 10).map(n => (
                      <button
                        key={n.id}
                        onClick={() => markOneRead(n.id)}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition flex items-start gap-3 ${
                          !n.isRead ? 'bg-blue-50/50' : ''
                        }`}
                      >
                        <span className="text-base shrink-0 mt-0.5">{notifTypeIcon(n.type)}</span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-bold truncate ${!n.isRead ? 'text-[#1A1A1A]' : 'text-gray-600'}`}>
                            {n.title}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-2 leading-relaxed">{n.message}</p>
                          <p className="text-[9px] text-gray-300 mt-1">
                            {new Date(n.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        {!n.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1" />}
                      </button>
                    ))
                  )}
                </div>

                <Link
                  href="/dashboard/owners/appointments"
                  onClick={() => setShowNotifications(false)}
                  className="block text-center text-[10px] font-bold text-gray-500 hover:text-[#1A1A1A] py-3 border-t border-gray-100 transition"
                >
                  View Appointments →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
