import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function OwnerDashboard() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#F0EEF8" }}
    >
      {/* ── Hero Section ── */}
      <main className="flex-1 flex flex-col items-center justify-center text-center py-10 lg:py-20 min-h-[60vh]">
        <div className="max-w-2xl mx-auto">
          <h1
            className="text-[56px] md:text-[72px] font-black text-[#1A1A1A] leading-none tracking-tight mb-6"
            style={{ fontFamily: "Inter, system-ui, sans-serif" }}
          >
            START YOUR LISTING
          </h1>
          <p className="text-[16px] text-gray-500 font-medium leading-relaxed mb-10 max-w-lg mx-auto">
            Join thousands of hosts worldwide and turn your property into a successful stay with Stayzo&apos;s premium management tools.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              id="owner-get-started-btn"
              href="/dashboard/owners/start_listing"
              className="flex items-center space-x-2 bg-[#1A1A1A] hover:bg-black text-white text-[13px] font-extrabold tracking-widest uppercase px-8 py-4 rounded-full transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>GET STARTED</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              id="owner-learn-more-btn"
              href="/dashboard/owners/learn_more"
              className="bg-white hover:bg-gray-50 text-[#1A1A1A] text-[13px] font-extrabold tracking-widest uppercase px-8 py-4 rounded-full border border-gray-200 transition-all shadow hover:shadow-md hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
            >
              LEARN MORE
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}