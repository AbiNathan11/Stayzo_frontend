"use client";

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import OwnerNavbar from '@/components/OwnerNavbar';

export default function OwnerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
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

  if (pathname.includes('/start_listing')) {
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

