"use client";

import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Linkedin, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-12 w-full">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 pb-12 border-b border-gray-100">
          
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2.5 mb-6 group">
              <div className="flex items-end space-x-1 h-5">
                <div className="w-[3px] h-3 bg-[#1A1A1A] rounded-full group-hover:bg-[#F26B27] transition-colors"></div>
                <div className="w-[3px] h-5 bg-[#1A1A1A] rounded-full group-hover:bg-[#F26B27] transition-colors"></div>
                <div className="w-[3px] h-4 bg-[#1A1A1A] rounded-full group-hover:bg-[#F26B27] transition-colors"></div>
                <div className="w-[3px] h-2.5 bg-[#1A1A1A] rounded-full group-hover:bg-[#F26B27] transition-colors"></div>
              </div>
              <span className="text-xl font-bold tracking-tight text-[#1A1A1A]">Stayzo</span>
            </Link>
            <p className="text-gray-400 text-xs font-semibold leading-relaxed max-w-sm">
              Premium renting made simple. We connect landlords and tenants with verified high-fidelity listings, secure payment methods, and automated leasing in Sri Lanka.
            </p>
          </div>

          {/* Column 1: Explore */}
          <div>
            <h4 className="font-extrabold text-[#1A1A1A] text-xs uppercase tracking-wider mb-4">Explore</h4>
            <ul className="space-y-2.5 text-xs font-bold text-gray-400">
              <li><Link href="/search" className="hover:text-[#1A1A1A] transition">Properties</Link></li>
              <li><Link href="#" className="hover:text-[#1A1A1A] transition">For Landlords</Link></li>
              <li><Link href="#" className="hover:text-[#1A1A1A] transition">For Tenants</Link></li>
              <li><Link href="#" className="hover:text-[#1A1A1A] transition">Popular Locations</Link></li>
            </ul>
          </div>

          {/* Column 2: Company */}
          <div>
            <h4 className="font-extrabold text-[#1A1A1A] text-xs uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2.5 text-xs font-bold text-gray-400">
              <li><Link href="#" className="hover:text-[#1A1A1A] transition">About Us</Link></li>
              <li><Link href="#" className="hover:text-[#1A1A1A] transition">Careers</Link></li>
              <li><Link href="#" className="hover:text-[#1A1A1A] transition">Press</Link></li>
              <li><Link href="#" className="hover:text-[#1A1A1A] transition">Contact</Link></li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h4 className="font-extrabold text-[#1A1A1A] text-xs uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-2.5 text-xs font-bold text-gray-400">
              <li><Link href="#" className="hover:text-[#1A1A1A] transition">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-[#1A1A1A] transition">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-[#1A1A1A] transition">Cookie settings</Link></li>
              <li><Link href="#" className="hover:text-[#1A1A1A] transition">Security</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright & social icons */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-gray-400 text-[11px] font-bold">
            &copy; {new Date().getFullYear()} Stayzo Inc. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 text-gray-400">
            <a href="#" className="hover:text-[#1A1A1A] transition">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="hover:text-[#1A1A1A] transition">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="hover:text-[#1A1A1A] transition">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="#" className="hover:text-[#1A1A1A] transition">
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
