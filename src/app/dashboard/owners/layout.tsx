"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import OwnerNavbar from '@/components/OwnerNavbar';

export default function OwnerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    if (pathname.includes('/broker')) {
      setIsAuthenticated(true);
      return;
    }

    const token = Cookies.get('stayzo_token');
    if (!token) {
      window.location.href = '/auth?role=landlord';
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const email = payload.email || '';
      if (!email) {
        Cookies.remove('stayzo_token');
        Cookies.remove('stayzo_refresh_token');
        window.location.href = '/auth?role=landlord';
        return;
      }

      fetch(`http://localhost:3001/api/auth/profile/${email}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => {
          if (res.status === 401 || res.status === 404) {
            Cookies.remove('stayzo_token');
            Cookies.remove('stayzo_refresh_token');
            window.location.href = '/auth?role=landlord';
            throw new Error('Invalid session');
          }
          return res.json();
        })
        .then(data => {
          if (data.user) {
            setIsAuthenticated(true);
          } else {
            Cookies.remove('stayzo_token');
            Cookies.remove('stayzo_refresh_token');
            window.location.href = '/auth?role=landlord';
          }
        })
        .catch(() => {
          // Fallback if offline/DB issue, trust client-parsed token
          setIsAuthenticated(true);
        });
    } catch (e) {
      Cookies.remove('stayzo_token');
      Cookies.remove('stayzo_refresh_token');
      window.location.href = '/auth?role=landlord';
    }
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      if (pathname.includes('/broker')) return;
      const token = Cookies.get('stayzo_token');
      if (!token) {
        window.location.replace('/auth?role=landlord');
      }
    };

    checkAuth();

    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        checkAuth();
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    return () => {
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <p className="text-xs font-bold text-gray-400 mt-4 uppercase tracking-widest animate-pulse">Verifying Session...</p>
      </div>
    );
  }

  if (pathname.includes('/start_listing') || pathname.includes('/broker')) {
    return <>{children}</>;
  }

  const isChat = pathname.includes('/chat');
  const isLearnMore = pathname.includes('/learn_more');

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] font-sans selection:bg-[#1A1A1A] selection:text-white flex flex-col animate-in fade-in duration-300">
      
      {/* Top Header with Navigation */}
      <OwnerNavbar hideLinks={isLearnMore} />

      {/* Main Content Area */}
      <div className={`flex-1 w-full mx-auto flex flex-col ${isChat ? 'max-w-none px-4 py-4' : 'max-w-[1200px] px-6 sm:px-10 py-10'}`}>
        <main className="w-full min-w-0 flex-1 min-h-0 flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
}

