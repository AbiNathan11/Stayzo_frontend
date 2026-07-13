"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectToSignPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const search = window.location.search;
      router.replace(`/sign${search}`);
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center font-sans">
      <div className="text-center space-y-2">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest animate-pulse">Redirecting to Signature Pad...</p>
      </div>
    </div>
  );
}
