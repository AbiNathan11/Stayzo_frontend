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

          {/* Column 2: Extra Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-white">Extra links</h4>
            <ul className="space-y-2.5 text-xs font-semibold text-gray-400">
              <li><Link href="/" className="hover:text-white transition">Home</Link></li>
              <li><Link href="/search" className="hover:text-white transition">Buyers</Link></li>
              <li><Link href="/search" className="hover:text-white transition">Sellers</Link></li>
              <li><Link href="#" className="hover:text-white transition">Our team</Link></li>
              <li><Link href="#" className="hover:text-white transition">About Us</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-white">Contact</h4>
            <ul className="space-y-2.5 text-xs font-semibold text-gray-400">
              <li>123 Example Road, Colombo 03, Sri Lanka</li>
              <li><a href="mailto:email@example.com" className="hover:text-white transition">email@example.com</a></li>
              <li><a href="tel:5555555555" className="hover:text-white transition">(555) 555-5555</a></li>
            </ul>
          </div>

        </div>

      </div>
    </footer>
  );
}


