"use client";

import React from 'react';
import { FileSignature, ShieldCheck, Download, UploadCloud } from 'lucide-react';

export default function DocumentsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Digital Document Vault</h2>
        <p className="text-gray-500 text-xs font-semibold mt-1">Securely manage your legal agreements and verified KYC identity documents.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Signed Agreements */}
        <section className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
              <FileSignature className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-gray-900">My Signed Agreements</h3>
              <p className="text-[10px] font-bold text-gray-400">E-signed rental contracts</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-150">
              <div>
                <h4 className="text-xs font-extrabold text-gray-900">Villa Tropical Cana Lease</h4>
                <p className="text-[10px] font-bold text-gray-500 mt-0.5">Signed on Oct 1, 2026</p>
              </div>
              <button className="text-blue-600 hover:text-blue-800 transition p-2 bg-white rounded-lg shadow-sm border border-gray-200">
                <Download className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-150">
              <div>
                <h4 className="text-xs font-extrabold text-gray-900">Colombo Heights Agreement</h4>
                <p className="text-[10px] font-bold text-gray-500 mt-0.5">Signed on Jan 15, 2024</p>
              </div>
              <button className="text-blue-600 hover:text-blue-800 transition p-2 bg-white rounded-lg shadow-sm border border-gray-200">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Verified KYC */}
        <section className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center border border-green-100">
              <ShieldCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-gray-900">Verified KYC</h3>
              <p className="text-[10px] font-bold text-gray-400">Identity verification status</p>
            </div>
          </div>

          <div className="bg-[#F8FAFB] border border-[#1A1A1A]/10 rounded-2xl p-5 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-green-500" />
              <div>
                <h4 className="text-xs font-extrabold text-gray-900">National ID Card (NIC)</h4>
                <p className="text-[10px] font-bold text-gray-500 mt-0.5">Verified & Watermarked securely</p>
              </div>
            </div>
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-[9px] font-extrabold uppercase">Verified</span>
          </div>

          <button className="w-full border-2 border-dashed border-gray-200 hover:border-[#1A1A1A] hover:bg-gray-50 transition rounded-2xl p-4 flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-gray-900">
            <UploadCloud className="w-6 h-6" />
            <span className="text-xs font-extrabold">Upload New Document</span>
            <span className="text-[9px] font-bold text-gray-400">JPG, PNG or PDF (Max 5MB)</span>
          </button>
        </section>

      </div>
    </div>
  );
}
