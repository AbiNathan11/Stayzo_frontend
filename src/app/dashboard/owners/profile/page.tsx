"use client";

import React from "react";
import {
  Camera,
  Edit2,
  Shield,
  ShieldCheck,
  Home,
  Calendar,
  Bell,
  UploadCloud,
  FileText,
  Download,
  ArrowRight
} from "lucide-react";

export default function OwnerProfilePage() {
  return (
    <div className="min-h-screen bg-white font-sans pb-20 pt-12">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Top Welcome Banner */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
          <h1 className="text-[32px] md:text-[36px] font-black text-[#1A1A1A] tracking-tight">
            Welcome back, Vishnnu
          </h1>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
          
          {/* Left Column (User Profile Card) */}
          <div className="md:col-span-4 bg-white rounded-2xl border border-gray-200 p-8 flex flex-col items-center justify-center text-center shadow-sm">
            <div className="relative mb-6">
              <div className="w-28 h-28 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-4xl font-black text-[#1A1A1A]">V</span>
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#1A1A1A] rounded-full flex items-center justify-center text-white hover:bg-black transition-colors shadow-md">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-1">Vishnnu Yoharajah</h2>
            <p className="text-sm text-gray-500 mb-8">yogarajahvishnnu@gmail.com</p>
            
            <div className="w-full space-y-3">
              <button className="w-full flex items-center justify-center space-x-2 bg-[#1A1A1A] hover:bg-black text-white text-[13px] font-bold px-6 py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg">
                <Edit2 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
              <button className="w-full flex items-center justify-center space-x-2 bg-gray-50 hover:bg-gray-100 text-[#1A1A1A] text-[13px] font-bold px-6 py-3.5 rounded-xl border border-gray-200 transition-all">
                <Shield className="w-4 h-4" />
                <span>Verify Identity</span>
              </button>
            </div>
          </div>

          {/* Right Column (Activity Overview Card) */}
          <div className="md:col-span-8 bg-white rounded-2xl border border-gray-200 p-8 shadow-sm flex flex-col">
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-12">
              ACTIVITY OVERVIEW
            </h3>
            
            <div className="flex-1 flex flex-wrap items-center justify-around px-4 gap-8">
              {/* Metric 1 */}
              <div className="flex items-center space-x-5">
                <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center shadow-sm">
                  <Home className="w-5 h-5 text-gray-700" />
                </div>
                <div>
                  <div className="text-[40px] font-black text-[#1A1A1A] leading-none mb-1">1</div>
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">ACTIVE LISTINGS</div>
                </div>
              </div>

              {/* Metric 2 */}
              <div className="flex items-center space-x-5">
                <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center shadow-sm">
                  <Calendar className="w-5 h-5 text-gray-700" />
                </div>
                <div>
                  <div className="text-[40px] font-black text-[#1A1A1A] leading-none mb-1">2</div>
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">PENDING VISITS</div>
                </div>
              </div>

              {/* Metric 3 */}
              <div className="flex items-center space-x-5">
                <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center shadow-sm">
                  <Bell className="w-5 h-5 text-gray-700" />
                </div>
                <div>
                  <div className="text-[40px] font-black text-[#1A1A1A] leading-none mb-1">3</div>
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">UNREAD MSG</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section (Digital Document Vault) */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-10 gap-6">
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex w-10 h-10 rounded-full border border-gray-200 items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-[#1A1A1A]" />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#1A1A1A] flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#1A1A1A] sm:hidden" />
                  Digital Document Vault
                </h3>
                <p className="text-sm text-gray-500 mt-1">Securely manage your legal agreements and verified KYC files.</p>
              </div>
            </div>
            <button className="flex items-center justify-center space-x-2 bg-[#1A1A1A] hover:bg-black text-white text-[12px] font-bold px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg whitespace-nowrap">
              <UploadCloud className="w-4 h-4" />
              <span>Upload New</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left Column (AGREEMENTS) */}
            <div>
              <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                AGREEMENTS
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-300 hover:shadow-sm transition-all group">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center shadow-sm">
                      <FileText className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#1A1A1A]">Villa Tropical Cana Lease</p>
                      <p className="text-[11px] text-gray-500 font-medium">Signed: Oct 1, 2026</p>
                    </div>
                  </div>
                  <button className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-300 hover:shadow-sm transition-all group">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center shadow-sm">
                      <FileText className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#1A1A1A]">Colombo Heights Agreement</p>
                      <p className="text-[11px] text-gray-500 font-medium">Signed: Jan 15, 2024</p>
                    </div>
                  </div>
                  <button className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column (IDENTITY KYC) */}
            <div>
              <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                IDENTITY (KYC)
              </h4>
              <button className="w-full flex items-center justify-between p-4 rounded-xl bg-[#1A1A1A] hover:bg-black transition-colors text-left group shadow-md hover:shadow-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white group-hover:text-gray-100 transition-colors">National ID Card (NIC)</p>
                    <p className="text-[11px] text-gray-400 font-medium">Verified & Secure</p>
                  </div>
                </div>
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#1A1A1A] shadow-sm transform group-hover:scale-105 transition-transform">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
