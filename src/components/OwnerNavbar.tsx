"use client";
import Cookies from 'js-cookie';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, ArrowRight, CheckCheck, CalendarCheck, X } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import EditProfileModal, { UserProfile } from './EditProfileModal';

const navLinks = [
  { label: 'Home', href: '/dashboard/owners' },
  { label: 'Profile', href: '/dashboard/owners/profile' },
  { label: 'Listings', href: '/dashboard/owners/listings' },
  { label: 'Appointments', href: '/dashboard/owners/appointments' },
  { label: 'Chat', href: '/dashboard/owners/chat' },
  { label: 'Agreement', href: '/dashboard/owners/agreement' },
];

export default function OwnerNavbar({ hideLinks = false }: { hideLinks?: boolean }) {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, markAllRead, markOneRead } = useNotifications();

  useEffect(() => {
    const token = Cookies.get('stayzo_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({
          firstName: payload.firstName || '',
          lastName: payload.lastName || '',
          email: payload.email || '',
          profileImage: payload.profileImage || null
        });
      } catch (e) {
        console.error('Failed to parse token', e);
      }
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifTypeIcon = (type: string) => {
    if (type === 'booking_confirmed') return '✅';
    if (type === 'booking_cancelled') return '❌';
    if (type === 'booking_request')   return '📅';
    if (type === 'booking_reminder')  return '⏰';
    return '🔔';
  };

  const handleLogout = () => {
    Cookies.remove('stayzo_token'); Cookies.remove('stayzo_refresh_token');
    window.location.replace('/auth?role=landlord');
  };

  const handleProfileSuccess = (updatedUser: UserProfile) => {
    setUser(updatedUser);
  };

  return (
    <>
    <header className="w-full bg-white border-b border-gray-200 py-4 px-6 sm:px-10 flex items-center justify-between z-50 shrink-0 select-none sticky top-0">

        {/* Left Brand Logo */}
        <div className="flex-1 flex justify-start">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="flex items-end space-x-1 h-5">
              <div className="w-[3px] h-3 bg-[#1A1A1A] rounded-full group-hover:bg-[#1A1A1A] transition-colors"></div>
              <div className="w-[3px] h-5 bg-[#1A1A1A] rounded-full group-hover:bg-[#1A1A1A] transition-colors"></div>
              <div className="w-[3px] h-4 bg-[#1A1A1A] rounded-full group-hover:bg-[#1A1A1A] transition-colors"></div>
              <div className="w-[3px] h-2.5 bg-[#1A1A1A] rounded-full group-hover:bg-[#1A1A1A] transition-colors"></div>
            </div>
            <span className="text-xl font-bold tracking-tight text-[#1A1A1A]">Stayzo</span>
          </Link>
        </div>

        {/* Center Nav */}
        {!hideLinks && (
          <nav className="hidden lg:flex items-center space-x-1 flex-none">
            {navLinks.map((link) => {
              const finalIsActive = link.href === '/dashboard/owners' ? pathname === link.href : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-4 py-2 text-[13px] font-semibold rounded-full transition-colors ${
                    finalIsActive
                      ? 'bg-[#1A1A1A] text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Right side */}
        <div className="flex-1 flex justify-end items-center space-x-4">
          {!hideLinks && (
            <Link
              href="/dashboard/tenant"
              className="hidden sm:inline text-sm font-semibold text-gray-900 hover:bg-[#EEF2FF] hover:text-[#4F46E5] active:bg-[#E0E7FF] px-4 py-2 rounded-full transition duration-200"
            >
              Switch to tenant
            </Link>
          )}
          <div className="relative" ref={notifRef}>
            <button
              id="owner-notifications-btn"
              onClick={() => setShowNotifications(v => !v)}
              className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#EEF2FF] transition-colors group"
              aria-label="Notifications"
              suppressHydrationWarning={true}
            >
              <Bell className="w-5 h-5 text-[#1A1A1A] group-hover:text-[#4F46E5] transition-colors" />
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
                        className="flex items-center gap-1 text-[10px] font-bold text-[#4F46E5] hover:text-[#4338CA] transition"
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
                  className="block text-center text-[10px] font-bold text-[#4F46E5] hover:text-[#4338CA] py-3 border-t border-gray-100 transition"
                >
                  View Appointments →
                </Link>
              </div>
            )}
          </div>

          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileMenu(v => !v)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1A1A1A] text-white text-xs font-bold uppercase hover:scale-105 active:scale-95 transition-all shrink-0"
              suppressHydrationWarning={true}
            >
              {user?.profileImage ? (
                <img src={user.profileImage} alt="Profile" className="w-8 h-8 rounded-full object-cover shrink-0" />
              ) : (
                user ? user.firstName.charAt(0) : 'U'
              )}
            </button>
            {showProfileMenu && user && (
              <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
                <div className="px-4 py-2 border-b border-gray-50">
                  <p className="text-xs font-bold text-gray-900 truncate">{user.firstName} {user.lastName}</p>
                  <p className="text-[10px] text-gray-400 font-semibold truncate mt-0.5">{user.email}</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setShowEditModal(true);
                    }}
                    className="flex w-full px-4 py-2.5 text-left text-xs font-bold text-[#4F46E5] hover:bg-[#EEF2FF] transition duration-150"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      handleLogout();
                    }}
                    className="flex w-full px-4 py-2.5 text-left text-xs font-bold text-red-600 hover:bg-red-50 transition duration-150"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
    </header>
    <EditProfileModal 
      isOpen={showEditModal} 
      onClose={() => setShowEditModal(false)} 
      user={user} 
      onSuccess={handleProfileSuccess} 
    />
    </>
  );
}
