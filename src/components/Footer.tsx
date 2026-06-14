"use client";

import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Linkedin, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#F8FAFB] px-6 pb-6 pt-12 select-none">
      <div className="max-w-7xl mx-auto bg-[#1A1A1A] text-white rounded-[32px] p-10 md:p-20 shadow-xl overflow-hidden relative">
        
        {/* Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 pb-12">
          
          {/* Column 1: Info and Socials */}
          <div className="space-y-6">
            <p className="text-gray-400 text-xs font-semibold leading-relaxed max-w-xs">
              We offer a wide range of premium rental properties and smart lease agreements to fit your lifestyle. Discover verified, high-fidelity listings in Sri Lanka.
            </p>
            <div className="flex items-center space-x-3.5 pt-2">
              <a href="#" className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black hover:bg-[#1A1A1A] hover:text-white transition shadow-sm">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black hover:bg-[#1A1A1A] hover:text-white transition shadow-sm">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black hover:bg-[#1A1A1A] hover:text-white transition shadow-sm">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black hover:bg-[#1A1A1A] hover:text-white transition shadow-sm">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-white">Navigation</h4>
            <ul className="space-y-2.5 text-xs font-semibold text-gray-400">
              <li><Link href="/" className="hover:text-white transition">Home</Link></li>
              <li><Link href="/#features" className="hover:text-white transition">Features</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-white transition">Process</Link></li>
              <li><Link href="/#testimonials" className="hover:text-white transition">Testimonials</Link></li>
              <li><Link href="/#contact" className="hover:text-white transition">Contact</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-white">Contact</h4>
            <ul className="space-y-2.5 text-xs font-semibold text-gray-400">
              <li>620/06 H.T.P Road, Liyanagemull Seeduwa, Katunayake</li>
              <li><a href="mailto:stayzorentalplatform@gmail.com" className="hover:text-white transition">stayzorentalplatform@gmail.com</a></li>
              <li><a href="tel:0112258215" className="hover:text-white transition">0112258215</a></li>
            </ul>
          </div>

        </div>

      </div>
    </footer>
  );
}


