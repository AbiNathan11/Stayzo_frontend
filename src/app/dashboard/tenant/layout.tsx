"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LogOut, LayoutDashboard, KeyRound, Heart, 
  CalendarCheck, MessageSquare, FileText, Compass,
  Bell, CheckCheck, X
} from 'lucide-react';
import EditProfileModal, { UserProfile } from '@/components/EditProfileModal';
import { useNotifications } from '@/hooks/useNotifications';

export default function TenantDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const [user, setUser] = useState<UserProfile & { isOwner?: boolean }>({ firstName: 'Abiramy', lastName: '', email: 'abiramy@example.com' });
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { notifications, unreadCount, markAllRead, markOneRead } = useNotifications();

  useEffect(() => {
    const token = sessionStorage.getItem('stayzo_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const email = payload.email || 'abiramy@example.com';
        setUser({
          firstName: payload.firstName || 'Abiramy',
          lastName: payload.lastName || '',
          email: email,
          profileImage: payload.profileImage || null,
          isOwner: !!payload.isOwner
        });

        // Live refresh from DB
        fetch(`http://localhost:3001/api/auth/profile/${email}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
          .then(res => res.json())
          .then(data => {
            if (data.user) {
              setUser(prev => ({
                ...prev!,
                firstName: data.user.firstName || prev?.firstName || 'Abiramy',
                profileImage: data.user.profileImage || null
              }));
            }
          })
          .catch(err => console.warn("Live profile fetch issue:", err));
      } catch (e) {
        setUser({ firstName: 'Abiramy', lastName: '', email: 'abiramy@example.com', isOwner: false });
      }
    } else {
      setUser({ firstName: 'Abiramy', lastName: '', email: 'abiramy@example.com', isOwner: false });
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('stayzo_token');
    window.location.href = '/';
  };

  const userInitial = user?.firstName?.charAt(0).toUpperCase() || 'A';

  const navItems = [
    { name: 'Overview', href: '/dashboard/tenant', icon: LayoutDashboard },
    { name: 'Saved Properties', href: '/dashboard/tenant/saved', icon: Heart },
    { name: 'Visit Scheduler', href: '/dashboard/tenant/visits', icon: CalendarCheck },
    { name: 'Secure Chat', href: '/dashboard/tenant/chat', icon: MessageSquare },
    { name: 'Agreement', href: '/dashboard/tenant/agreement', icon: FileText },
    { name: 'Relocation Services', href: '/dashboard/tenant/services', icon: Compass },
  ];

  const handleProfileSuccess = (updatedUser: UserProfile) => {
    setUser(prev => ({ ...prev, ...updatedUser }));
  };

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] font-sans selection:bg-[#1A1A1A] selection:text-white flex flex-col">
      
      {/* Top Header with Navigation */}
      {!pathname.includes('/services/food') && (
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
            href={user?.isOwner ? '/dashboard/owners' : '/auth?role=landlord'}
            className="hidden sm:inline text-sm font-semibold text-gray-900 hover:bg-[#EEF2FF] hover:text-[#4F46E5] active:bg-[#E0E7FF] px-4 py-2 rounded-full transition duration-200"
          >
            Switch to owner
          </Link>

          {/* Notification Bell Dropdown */}
          <div className="relative">
            <button
              id="tenant-notifications-btn"
              onClick={() => setShowNotifications(v => !v)}
              className="relative w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors group"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-[#1A1A1A] group-hover:text-gray-900 transition-colors" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center px-1">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <>
                {/* Backdrop overlay for close-on-click */}
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
                
                <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-200">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-gray-50">
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
                          onClick={() => {
                            markOneRead(n.id);
                            setShowNotifications(false);
                          }}
                          className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition flex items-start gap-3 ${
                            !n.isRead ? 'bg-blue-50/50' : ''
                          }`}
                        >
                          <span className="text-base shrink-0 mt-0.5">
                            {n.type === 'booking_confirmed' ? '✅' : n.type === 'booking_cancelled' ? '❌' : n.type === 'booking_request' ? '📅' : '🔔'}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-bold truncate ${!n.isRead ? 'text-[#1A1A1A]' : 'text-gray-600'}`}>
                              {n.title}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-2 leading-relaxed">{n.message}</p>
                            <p className="text-[9px] text-gray-300 mt-1 font-mono">
                              {new Date(n.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          {!n.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1" />}
                        </button>
                      ))
                    )}
                  </div>

                  <Link
                    href="/dashboard/tenant/visits"
                    onClick={() => setShowNotifications(false)}
                    className="block text-center text-[10px] font-bold text-[#4F46E5] hover:text-[#4338CA] py-3 border-t border-gray-100 transition"
                  >
                    View Visits Scheduler →
                  </Link>
                </div>
              </>
            )}
          </div>

          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)} 
              className="flex items-center justify-center hover:scale-105 active:scale-95 transition-all rounded-full cursor-pointer shrink-0"
            >
              {user?.profileImage ? (
                <img src={user.profileImage} alt="User Avatar" className="w-8 h-8 rounded-full object-cover shrink-0" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {userInitial}
                </div>
              )}
            </button>

            {showDropdown && (
              <>
                {/* Backdrop overlay for close-on-click */}
                <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)}></div>
                
                <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
                  <div className="px-4 py-2 border-b border-gray-50">
                    <p className="text-xs font-bold text-gray-900 truncate">{user?.firstName} {user?.lastName}</p>
                    <p className="text-[10px] text-gray-400 font-semibold truncate mt-0.5">{user?.email}</p>
                  </div>
                  
                  
                  <button 
                    onClick={() => {
                      setShowDropdown(false);
                      setShowEditModal(true);
                    }}
                    className="flex w-full px-4 py-2.5 text-left text-xs font-bold text-[#4F46E5] hover:bg-[#EEF2FF] transition duration-150"
                  >
                    Edit Profile
                  </button>
                  
                  <button 
                    onClick={() => {
                      setShowDropdown(false);
                      handleLogout();
                    }}
                    className="flex w-full px-4 py-2.5 text-left text-xs font-bold text-red-600 hover:bg-red-50 transition duration-150 pointer-events-auto"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>
      )}

      {/* Main Content Area */}
      <div className={`flex-1 w-full mx-auto ${pathname.includes('/services/food') ? '' : 'max-w-[1400px] px-8 sm:px-16 md:px-24 py-10'}`}>
        <main className="w-full min-w-0">
          {children}
        </main>
      </div>
      
      <EditProfileModal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)} 
        user={user} 
        onSuccess={handleProfileSuccess} 
      />
    </div>
  );
}
