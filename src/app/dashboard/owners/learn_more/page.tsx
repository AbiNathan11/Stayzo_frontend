"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  FileCheck,
  Map,
  Home,
  DollarSign,
  Camera,
  Coffee,
  Building,
  Tent,
  Hotel,
  Key,
  ChevronDown,
} from "lucide-react";

const STEPS = [
  {
    title: "Step 1: Property Address",
    icon: MapPin,
    whatToDo: "Provide the exact location details including building number, two street lines, city, district, and postal code.",
    whyItMatters: "Ensures accurate listing details for potential tenants and forms the foundational data for location searches."
  },
  {
    title: "Step 2: Ownership Verification & Documents",
    icon: FileCheck,
    whatToDo: "Upload a copy of an electrical or water utility bill. Select whether you are the direct Owner or a Broker (Brokers must supply the owner's contact name and email).",
    whyItMatters: "Protects the platform's security and integrity by verifying valid proof of ownership and legal authorization to prevent fraudulent listings."
  },
  {
    title: "Step 3: Exact Map Pinpoint",
    icon: Map,
    whatToDo: "Verify and manually adjust a digital map marker pin over the property building.",
    whyItMatters: "Feeds exact coordinates into the user routing system so incoming tenants can easily navigate to the property without confusion."
  },
  {
    title: "Step 4: Detailed Property Configuration & Unit Types",
    icon: Home,
    whatToDo: "Specify the precise configuration of your rental unit (number of bedrooms, beds, kitchens, and individual counters for attached vs. separate bathrooms). Owners must select a specific Property Category.",
    whyItMatters: "Filters your property into the exact search criteria matching tenant preferences.",
    isStep4: true
  },
  {
    title: "Step 5: Pricing, Deposit & Expected Tenants",
    icon: DollarSign,
    whatToDo: "Input monthly rental rates, security advance/deposit amounts, explicit advance terms, and the ideal tenant capacity limit.",
    whyItMatters: "Keeps expectations completely transparent to filter out unqualified leads and secure financial agreements early."
  },
  {
    title: "Step 6: Visual Media & 360-Degree Views",
    icon: Camera,
    whatToDo: "Upload standard layout photos of rooms. Optionally, provide a Panorama image to unlock a fully interactive 360-degree virtual interior tour.",
    whyItMatters: "High-quality visual assets drastically increase listing conversion rates. 360-degree virtual views allow remote tenants to securely tour spaces digitally."
  },
  {
    title: "Step 7: Nearby Amenities & Opportunities",
    icon: Coffee,
    whatToDo: "Note nearby food services, mess halls, catering alternatives, and close proximity to local part-time job opportunities.",
    whyItMatters: "Essential high-value data for student or working-class tenants looking for lifestyle convenience alongside housing."
  }
];

const PROPERTY_TYPES = [
  {
    category: "Entire Property Options",
    items: [
      { name: "Individual House", desc: "A standalone, private detached residential building.", icon: Home },
      { name: "Apartment/Flat", desc: "A self-contained unit inside a larger multi-unit residential building.", icon: Building },
      { name: "Bungalow", desc: "A classic single-story or split-level home with a spacious front veranda.", icon: Tent },
      { name: "Villa/Mansion", desc: "A luxurious, premium standalone estate with extensive private grounds.", icon: Hotel },
      { name: "Townhouse/Duplex", desc: "A multi-floor home sharing a wall with neighbors but featuring a private entry.", icon: Building },
      { name: "Studio Apartment", desc: "An efficient, open-concept unit combining living, bed, and kitchen into one space.", icon: Building },
    ]
  },
  {
    category: "Room Rental Options",
    items: [
      { name: "Private Room (Ensuite)", desc: "A private bedroom featuring its own private, attached bathroom inside a shared home.", icon: Key },
      { name: "Private Room (Non-Ensuite)", desc: "A private bedroom where utilities and bathrooms are shared with other residents.", icon: Key },
      { name: "Shared Room/Bedspace", desc: "A cost-effective setup where the physical bedroom space and beds are shared with roommates.", icon: Key },
      { name: "Bedsit", desc: "A personal room containing minor cooking facilities, with main restrooms located down the hallway.", icon: Key },
      { name: "Annex", desc: "A semi-independent dwelling attached to or on the same lot as a primary residence.", icon: Home },
    ]
  }
];

export default function LearnMorePage() {
  const [openStep, setOpenStep] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* ── Minimalist Header ── */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 flex items-center justify-between px-6 lg:px-10">
        <Link href="/dashboard/owners" className="flex items-center space-x-2.5">
          <div className="flex items-end space-x-[3px] h-5">
            <div className="w-[3px] h-3 bg-[#1A1A1A] rounded-full" />
            <div className="w-[3px] h-5 bg-[#1A1A1A] rounded-full" />
            <div className="w-[3px] h-4 bg-[#1A1A1A] rounded-full" />
            <div className="w-[3px] h-2.5 bg-[#1A1A1A] rounded-full" />
          </div>
          <span className="text-[15px] font-black tracking-tight text-[#1A1A1A] uppercase">Stayzo</span>
        </Link>
      </header>

      {/* ── Main Content Area ── */}
      <main className="flex-1 overflow-y-auto pt-24 pb-32 px-6">
        <div className="max-w-3xl mx-auto">
          
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              List Your Property with Confidence
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Our streamlined 7-step wizard ensures your listing is detailed, secure, and perfectly tailored to attract the right tenants. Explore the steps below to know exactly what to expect.
            </p>
          </div>

          {/* ── Steps Accordion ── */}
          <div className="space-y-4">
            {STEPS.map((step, index) => {
              const isOpen = openStep === index;
              const Icon = step.icon;

              return (
                <div 
                  key={index} 
                  className={`bg-white rounded-2xl border transition-all duration-300 ${isOpen ? 'border-gray-900 shadow-lg' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <button
                    onClick={() => setOpenStep(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left outline-none"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <h2 className={`text-xl md:text-2xl font-semibold ${isOpen ? 'text-gray-900' : 'text-gray-700'}`}>
                        {step.title}
                      </h2>
                    </div>
                    <ChevronDown className={`w-6 h-6 text-gray-400 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <div className="p-6 pt-0 md:pl-[5.5rem]">
                      <div className="space-y-8">
                        <div>
                          <h3 className="text-sm font-bold tracking-widest text-gray-900 uppercase mb-2">What to do</h3>
                          <p className="text-gray-600 leading-relaxed">{step.whatToDo}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-bold tracking-widest text-gray-900 uppercase mb-2">Why it matters</h3>
                          <p className="text-gray-600 leading-relaxed">{step.whyItMatters}</p>
                        </div>

                        {/* Step 4: Glossary */}
                        {step.isStep4 && (
                          <div className="mt-8 border-t border-gray-100 pt-8">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Property Categories Glossary</h3>
                            <div className="space-y-10">
                              {PROPERTY_TYPES.map((typeGroup) => (
                                <div key={typeGroup.category}>
                                  <h4 className="text-md font-semibold text-gray-800 mb-4">{typeGroup.category}</h4>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {typeGroup.items.map((item) => (
                                      <div key={item.name} className="p-4 rounded-xl border border-gray-100 bg-gray-50 flex gap-4 hover:border-gray-300 transition-colors">
                                        <item.icon className="w-6 h-6 text-gray-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                          <p className="font-semibold text-gray-900 text-sm mb-1">{item.name}</p>
                                          <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </main>

      {/* ── Sticky Bottom CTA ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-bold text-gray-900">Ready to list your property?</h3>
            <p className="text-sm text-gray-500">It only takes a few minutes to get started.</p>
          </div>
          <Link
            href="/dashboard/owners/start_listing"
            className="w-full sm:w-auto bg-[#1A1A1A] hover:bg-black text-white text-[13px] font-extrabold tracking-widest uppercase px-8 py-3.5 rounded-full transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] text-center"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
