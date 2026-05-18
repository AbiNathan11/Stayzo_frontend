"use client";

import React from 'react';
import Link from 'next/link';
import { 
  Search, MapPin, Home, Menu, 
  Facebook, Twitter, Instagram, 
  CheckSquare, Star
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FDF8F3] text-[#2D2D2D] font-sans selection:bg-[#F26B27] selection:text-white pb-10">
      
      {/* Navbar */}
      <nav className="w-full bg-[#FDF8F3] py-6 relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="text-4xl font-serif italic font-extrabold text-[#1A1A1A] cursor-pointer hover:opacity-80 transition">
            Stayzo.
          </div>
          
          <div className="hidden md:flex items-center space-x-8 text-[13px] font-bold tracking-widest uppercase text-gray-700">
            <Link href="#" className="text-[#F26B27]">Home</Link>
            <Link href="#" className="hover:text-[#F26B27] transition">Tenants</Link>
            <Link href="#" className="hover:text-[#F26B27] transition">Owners</Link>
            <Link href="#" className="hover:text-[#F26B27] transition">Pages</Link>
            <Link href="#" className="hover:text-[#F26B27] transition">Contacts</Link>
          </div>

          <div className="hidden md:flex items-center space-x-5 text-gray-800">
            <Facebook className="w-4 h-4 hover:text-[#F26B27] cursor-pointer transition" />
            <Twitter className="w-4 h-4 hover:text-[#F26B27] cursor-pointer transition" />
            <Instagram className="w-4 h-4 hover:text-[#F26B27] cursor-pointer transition" />
            <div className="w-px h-4 bg-gray-300 mx-2"></div>
            <Search className="w-4 h-4 hover:text-[#F26B27] cursor-pointer transition" />
          </div>

          <div className="md:hidden">
            <Menu className="w-7 h-7 text-[#1A1A1A]" />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-32 flex flex-col lg:flex-row items-center relative z-10">
        {/* Left Content */}
        <div className="lg:w-1/2 pr-0 lg:pr-12 z-10 text-center lg:text-left mt-8 lg:mt-0">
          <span className="font-extrabold tracking-widest text-xs uppercase text-gray-900 mb-6 block">Secure & Smart Housing</span>
          <h1 className="text-5xl md:text-6xl lg:text-[70px] font-extrabold text-[#1A1A1A] leading-[1.1] mb-8 font-serif">
            Find Your <br className="hidden lg:block"/> Perfect Stay <br className="hidden lg:block"/> Today
          </h1>
          <p className="text-gray-700 text-lg mb-12 max-w-md mx-auto lg:mx-0 leading-relaxed font-medium">
            Book premium rooms, studios, and apartments entirely online. Smart, secure, and completely hassle-free.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-6">
            <button className="bg-[#F26B27] hover:bg-[#E05A16] text-white px-8 py-4 font-bold transition text-sm tracking-widest uppercase shadow-lg shadow-[#F26B27]/20 w-full sm:w-auto">
              Search Properties
            </button>
            <button className="text-gray-900 hover:text-[#F26B27] font-bold transition text-sm tracking-widest uppercase w-full sm:w-auto">
              List Property
            </button>
          </div>
        </div>

        {/* Right Image & Floating Card */}
        <div className="lg:w-1/2 mt-16 lg:mt-0 relative w-full">
          <div className="bg-white p-4 shadow-xl inline-block w-full max-w-[600px] mx-auto relative z-0">
            <img 
              src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
              alt="Hero Apartment" 
              className="w-full object-cover h-[400px] md:h-[550px]"
            />
          </div>
          
          {/* Floating Search Card */}
          <div className="bg-white p-8 shadow-2xl absolute -bottom-16 left-1/2 transform -translate-x-1/2 lg:translate-x-0 lg:-bottom-20 lg:-left-24 w-[90%] sm:w-[400px] z-20">
            <h3 className="text-2xl font-bold mb-2 text-[#1A1A1A]">Quick Search</h3>
            <p className="text-gray-500 text-[13px] mb-8 leading-relaxed">
              Find your next home in our premium listings instantly.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center border-b border-gray-200 pb-3 group">
                <MapPin className="w-6 h-6 text-[#F26B27] mr-4 shrink-0 group-hover:scale-110 transition-transform" />
                <input type="text" placeholder="Location (e.g. Colombo)" className="w-full outline-none text-[15px] bg-transparent font-medium text-gray-800 placeholder-gray-400" />
              </div>
              <div className="flex items-center border-b border-gray-200 pb-3 group">
                <Home className="w-6 h-6 text-[#F26B27] mr-4 shrink-0 group-hover:scale-110 transition-transform" />
                <select className="w-full outline-none text-[15px] bg-transparent font-medium text-gray-500 cursor-pointer appearance-none">
                  <option>Property Type</option>
                  <option>Apartment</option>
                  <option>Studio</option>
                  <option>Private Room</option>
                </select>
              </div>
              <button className="w-full bg-[#F26B27] hover:bg-[#E05A16] text-white py-4 font-bold transition text-[13px] tracking-widest uppercase mt-4 flex items-center justify-center">
                <Search className="w-4 h-4 mr-2"/> Find Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Overlapping Image & Text */}
      <section className="bg-[#F2E8DF] py-24 mt-32 lg:mt-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center">
          
          {/* Image & Stats Card */}
          <div className="lg:w-1/2 relative mb-24 lg:mb-0 w-full flex justify-center lg:justify-start">
             <div className="bg-white p-4 shadow-xl inline-block relative z-0">
                <img 
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Meeting" 
                  className="w-full max-w-[450px] object-cover h-[500px]"
                />
             </div>
             {/* Stats overlapping */}
             <div className="absolute -bottom-12 right-4 md:right-10 lg:-right-4 bg-white shadow-2xl flex items-center py-8 px-6 sm:px-10 divide-x divide-gray-200 z-10 w-[90%] sm:w-auto">
                <div className="px-4 sm:px-8 text-center flex-1">
                  <h4 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A]">10k+</h4>
                  <p className="text-[11px] uppercase tracking-widest text-gray-500 font-bold mt-2">Properties</p>
                </div>
                <div className="px-4 sm:px-8 text-center flex-1">
                  <h4 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A]">24/7</h4>
                  <p className="text-[11px] uppercase tracking-widest text-gray-500 font-bold mt-2">Support</p>
                </div>
                <div className="px-4 sm:px-8 text-center flex-1 hidden sm:block">
                  <h4 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A]">50+</h4>
                  <p className="text-[11px] uppercase tracking-widest text-gray-500 font-bold mt-2">Cities</p>
                </div>
             </div>
          </div>

          {/* Text Content */}
          <div className="lg:w-1/2 lg:pl-20 text-center lg:text-left mt-8 lg:mt-0">
            <span className="font-extrabold tracking-widest text-xs uppercase text-gray-900 block mb-6">Premium Living</span>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-[#1A1A1A] leading-tight mb-8 font-serif">
              Transform Your Stay & <br className="hidden lg:block"/> Live Your Dream
            </h2>
            <p className="text-gray-700 mb-10 leading-relaxed font-medium text-[17px] max-w-lg mx-auto lg:mx-0">
              Experience a next-generation renting platform built for absolute peace of mind. Our 360° virtual tours and AI smart agreements ensure a seamless and fully protected transition.
            </p>
            <button className="bg-[#F26B27] hover:bg-[#E05A16] text-white px-8 py-4 font-bold transition text-sm tracking-widest uppercase shadow-lg shadow-[#F26B27]/20">
              Read More
            </button>
          </div>

        </div>
      </section>

      {/* Section 3: Offerings (Cities) */}
      <section className="py-32 bg-[#FDF8F3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="font-extrabold tracking-widest text-xs uppercase text-gray-900 block mb-4">Destinations</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#1A1A1A] mb-6 font-serif">Explore Top Cities</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-20 text-lg font-medium leading-relaxed">
            Discover prime real estate in the most vibrant neighborhoods. We've curated the best spaces tailored precisely for your lifestyle.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
            {/* City Card 1 */}
            <div className="group cursor-pointer flex flex-col">
              <div className="bg-white p-5 shadow-lg mb-8 inline-block w-full transition-transform duration-300 group-hover:-translate-y-2">
                <img 
                  src="https://images.unsplash.com/photo-1588096232532-6a953e5e43a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                  alt="Colombo" 
                  className="w-full h-64 object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-[#1A1A1A] mb-3">Colombo</h3>
              <p className="text-gray-600 text-[15px] mb-8 leading-relaxed font-medium flex-grow">
                1,245 premium properties available. Experience vibrant city life with top-tier amenities.
              </p>
              <button className="bg-[#F26B27] hover:bg-[#E05A16] text-white px-7 py-3.5 font-bold transition text-xs tracking-widest uppercase w-max shadow-md shadow-[#F26B27]/20">
                More Info
              </button>
            </div>

            {/* City Card 2 */}
            <div className="group cursor-pointer flex flex-col">
              <div className="bg-white p-5 shadow-lg mb-8 inline-block w-full transition-transform duration-300 group-hover:-translate-y-2">
                <img 
                  src="https://images.unsplash.com/photo-1625723048995-175514f772e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                  alt="Kandy" 
                  className="w-full h-64 object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-[#1A1A1A] mb-3">Kandy</h3>
              <p className="text-gray-600 text-[15px] mb-8 leading-relaxed font-medium flex-grow">
                832 serene properties available. Enjoy the peaceful hill country and rich cultural heritage.
              </p>
              <button className="bg-[#F26B27] hover:bg-[#E05A16] text-white px-7 py-3.5 font-bold transition text-xs tracking-widest uppercase w-max shadow-md shadow-[#F26B27]/20">
                More Info
              </button>
            </div>

            {/* City Card 3 */}
            <div className="group cursor-pointer flex flex-col">
              <div className="bg-white p-5 shadow-lg mb-8 inline-block w-full transition-transform duration-300 group-hover:-translate-y-2">
                <img 
                  src="https://images.unsplash.com/photo-1620054708796-0153f31f94d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                  alt="Galle" 
                  className="w-full h-64 object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-[#1A1A1A] mb-3">Galle</h3>
              <p className="text-gray-600 text-[15px] mb-8 leading-relaxed font-medium flex-grow">
                590 coastal properties available. Where historic colonial charm meets modern beachfront luxury.
              </p>
              <button className="bg-[#F26B27] hover:bg-[#E05A16] text-white px-7 py-3.5 font-bold transition text-xs tracking-widest uppercase w-max shadow-md shadow-[#F26B27]/20">
                More Info
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Features & Testimonial */}
      <section className="bg-[#F2E8DF] py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center">
          
          {/* Left Text & Features */}
          <div className="lg:w-1/2 lg:pr-20 mb-20 lg:mb-0 text-center lg:text-left">
            <span className="font-extrabold tracking-widest text-xs uppercase text-gray-900 block mb-6">Innovation</span>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-[#1A1A1A] leading-tight mb-8 font-serif">
              Smart Features For <br className="hidden lg:block"/> A Better Lifestyle
            </h2>
            <p className="text-gray-700 mb-12 leading-relaxed font-medium text-[17px] max-w-lg mx-auto lg:mx-0">
              We leverage cutting edge technology to bring you an unparalleled renting experience. From predictive sound ratings to bilingual legal protection.
            </p>
            
            <div className="space-y-8 text-left max-w-md mx-auto lg:mx-0">
              <div className="flex items-start group cursor-pointer">
                <div className="bg-[#F26B27] rounded text-white p-1.5 mt-1 mr-5 shrink-0 group-hover:scale-110 transition-transform">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1A1A1A] text-xl mb-1">AI Smart Agreements</h4>
                  <p className="text-[15px] text-gray-600 font-medium">Instant, bilingual legal protection generated intelligently.</p>
                </div>
              </div>
              
              <div className="flex items-start group cursor-pointer">
                <div className="bg-[#F26B27] rounded text-white p-1.5 mt-1 mr-5 shrink-0 group-hover:scale-110 transition-transform">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1A1A1A] text-xl mb-1">Noise Intelligence</h4>
                  <p className="text-[15px] text-gray-600 font-medium">Predictive sound ratings for every neighborhood.</p>
                </div>
              </div>

              <div className="flex items-start group cursor-pointer">
                <div className="bg-[#F26B27] rounded text-white p-1.5 mt-1 mr-5 shrink-0 group-hover:scale-110 transition-transform">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1A1A1A] text-xl mb-1">Relocation Ecosystem</h4>
                  <p className="text-[15px] text-gray-600 font-medium">Integrated access to local food and part-time jobs.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image & Floating Quote */}
          <div className="lg:w-1/2 relative w-full flex justify-center">
             <div className="bg-white p-4 shadow-xl inline-block relative z-0 w-full max-w-[500px]">
                <img 
                   src="https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                   alt="Room" 
                   className="w-full object-cover h-[500px]"
                />
             </div>
             
             <div className="bg-white p-8 md:p-10 shadow-2xl absolute -bottom-16 right-0 lg:-left-20 lg:right-auto w-[90%] sm:w-[450px] border-l-4 border-[#F26B27] z-10 mx-auto left-0 sm:mx-0">
                <div className="flex text-[#F26B27] mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current mr-1" />)}
                </div>
                <p className="text-[#1A1A1A] font-serif text-[19px] leading-relaxed italic mb-8">
                  "The neighborhood noise rating feature was a lifesaver. I found an incredibly quiet studio right in the middle of a bustling district thanks to Stayzo."
                </p>
                <div className="flex items-center">
                  <h4 className="font-extrabold text-[#1A1A1A] uppercase tracking-widest text-xs">Amaya Perera</h4>
                  <span className="text-gray-300 text-sm mx-3">|</span>
                  <span className="text-[#F26B27] text-xs font-bold uppercase tracking-widest">Verified Tenant</span>
                </div>
             </div>
          </div>

        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-[#FDF8F3] pt-32 pb-10 border-t border-[#E8D4C0] mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
             <div className="md:col-span-1">
               <h3 className="text-4xl font-serif italic font-extrabold text-[#1A1A1A] mb-6">Stayzo.</h3>
               <p className="text-gray-600 text-[15px] leading-relaxed font-medium">
                 The most secure way to book mid to long-term accommodation worldwide. Modern living redefined.
               </p>
             </div>
             <div className="md:pl-10">
               <h4 className="font-extrabold text-[#1A1A1A] mb-6 tracking-widest uppercase text-sm">Tenants</h4>
               <ul className="text-[15px] text-gray-600 space-y-4 font-medium">
                 <li><a href="#" className="hover:text-[#F26B27] transition">How it works</a></li>
                 <li><a href="#" className="hover:text-[#F26B27] transition">Search properties</a></li>
                 <li><a href="#" className="hover:text-[#F26B27] transition">Help Center</a></li>
               </ul>
             </div>
             <div>
               <h4 className="font-extrabold text-[#1A1A1A] mb-6 tracking-widest uppercase text-sm">Owners</h4>
               <ul className="text-[15px] text-gray-600 space-y-4 font-medium">
                 <li><a href="#" className="hover:text-[#F26B27] transition">List your property</a></li>
                 <li><a href="#" className="hover:text-[#F26B27] transition">AI Agreements</a></li>
                 <li><a href="#" className="hover:text-[#F26B27] transition">Pricing & Fees</a></li>
               </ul>
             </div>
             <div>
               <h4 className="font-extrabold text-[#1A1A1A] mb-6 tracking-widest uppercase text-sm">Company</h4>
               <ul className="text-[15px] text-gray-600 space-y-4 font-medium">
                 <li><a href="#" className="hover:text-[#F26B27] transition">About Stayzo</a></li>
                 <li><a href="#" className="hover:text-[#F26B27] transition">Careers</a></li>
                 <li><a href="#" className="hover:text-[#F26B27] transition">Privacy Policy</a></li>
               </ul>
             </div>
           </div>
           
           <div className="border-t border-[#E8D4C0] pt-10 flex flex-col md:flex-row justify-between items-center">
             <p className="text-[13px] text-gray-500 font-medium mb-6 md:mb-0">&copy; {new Date().getFullYear()} Stayzo Inc. All rights reserved.</p>
             <div className="flex space-x-6 text-gray-700">
                <Facebook className="w-5 h-5 hover:text-[#F26B27] cursor-pointer transition" />
                <Twitter className="w-5 h-5 hover:text-[#F26B27] cursor-pointer transition" />
                <Instagram className="w-5 h-5 hover:text-[#F26B27] cursor-pointer transition" />
             </div>
           </div>
        </div>
      </footer>
    </div>
  );
}
