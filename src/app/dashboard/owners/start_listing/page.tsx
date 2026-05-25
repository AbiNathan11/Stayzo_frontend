"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  UploadCloud,
  MapPin,
  Home,
  Building,
  Tent,
  Hotel,
  Key,
  Plus,
  Minus,
  CheckCircle2,
} from "lucide-react";

// --- Types & Constants ---
type PropertyCategory =
  | "Individual House"
  | "Apartment/Flat"
  | "Bungalow"
  | "Villa/Mansion"
  | "Townhouse/Duplex"
  | "Studio Apartment"
  | "Private Room (Ensuite)"
  | "Private Room (Non-Ensuite)"
  | "Shared Room/Bedspace"
  | "Bedsit"
  | "Annex"
  | "";

const PROPERTY_CATEGORIES = [
  { label: "Individual House", icon: Home },
  { label: "Apartment/Flat", icon: Building },
  { label: "Bungalow", icon: Tent },
  { label: "Villa/Mansion", icon: Hotel },
  { label: "Townhouse/Duplex", icon: Building },
  { label: "Studio Apartment", icon: Building },
  { label: "Private Room (Ensuite)", icon: Key },
  { label: "Private Room (Non-Ensuite)", icon: Key },
  { label: "Shared Room/Bedspace", icon: Key },
  { label: "Bedsit", icon: Key },
  { label: "Annex", icon: Home },
];

const TOTAL_STEPS = 7;

export default function StartListingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  // --- Form State ---
  const [formData, setFormData] = useState({
    houseNo: "",
    street: "",
    city: "",
    district: "",
    postalCode: "",
    propertyCategory: "" as PropertyCategory,
    kitchens: 1,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    bathroomType: "Attached",
    rentPerMonth: "",
    advanceMoney: "",
    advanceDetails: "",
    expectedTenants: 1,
    foodFacilities: "",
    partTimeJobs: "",
  });

  // Example handlers for counters
  const updateCounter = (field: keyof typeof formData, delta: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: Math.max(0, (prev[field] as number) + delta),
    }));
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Submit logic
      alert("Listing submitted successfully!");
      router.push("/dashboard/owners/listings");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    } else {
      router.push("/dashboard/owners");
    }
  };

  const progressPercentage = ((currentStep - 1) / (TOTAL_STEPS - 1)) * 100;

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* ── Main Content Area ── */}
      <main className="flex-1 overflow-y-auto pb-32">
        <div className="max-w-3xl mx-auto px-6 py-12 md:py-20">
          
          {/* STEP 1: ADDRESS */}
          {currentStep === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-3xl font-semibold text-gray-900 mb-8">
                Confirm your address
              </h1>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    House / Apartment Number
                  </label>
                  <input
                    type="text"
                    value={formData.houseNo}
                    onChange={(e) => setFormData({ ...formData, houseNo: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
                    placeholder="e.g. 12B"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Name
                  </label>
                  <input
                    type="text"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
                    placeholder="e.g. Main Street"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                    <input
                      type="text"
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: VERIFICATION DOCUMENT */}
          {currentStep === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-3xl font-semibold text-gray-900 mb-4">
                Verify your property
              </h1>
              <p className="text-gray-500 mb-8">
                Please upload a recent electrical or water bill to verify your address.
              </p>
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-105 transition-transform">
                  <UploadCloud className="w-8 h-8 text-gray-600" />
                </div>
                <p className="text-sm font-medium text-gray-900">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500 mt-2">SVG, PNG, JPG or PDF (max. 5MB)</p>
              </div>
            </div>
          )}

          {/* STEP 3: MAP LOCATION */}
          {currentStep === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
              <h1 className="text-3xl font-semibold text-gray-900 mb-4">
                Is the pin in the right spot?
              </h1>
              <p className="text-gray-500 mb-8">
                Your address is only shared with guests after they&apos;ve made a reservation.
              </p>
              <div className="w-full h-[400px] bg-gray-200 rounded-2xl flex items-center justify-center relative overflow-hidden">
                {/* Map Placeholder */}
                <div className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: "repeating-linear-gradient(45deg, #ccc 0, #ccc 1px, transparent 0, transparent 50%)",
                    backgroundSize: "20px 20px"
                  }}
                />
                <div className="relative flex flex-col items-center">
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center shadow-lg animate-bounce">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div className="w-4 h-1 bg-black/20 rounded-full mt-2 blur-sm" />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: PROPERTY INFO */}
          {currentStep === 4 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                Which of these best describes your place?
              </h1>
              <p className="text-gray-500 mb-8">Share some basics about your property.</p>
              
              {/* Categories */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-12">
                {PROPERTY_CATEGORIES.map((cat) => (
                  <button
                    key={cat.label}
                    onClick={() => setFormData({ ...formData, propertyCategory: cat.label as PropertyCategory })}
                    className={`flex flex-col items-start p-4 border rounded-xl transition-all ${
                      formData.propertyCategory === cat.label
                        ? "border-black bg-gray-50 ring-1 ring-black"
                        : "border-gray-200 hover:border-gray-900"
                    }`}
                  >
                    <cat.icon className="w-7 h-7 mb-3 text-gray-700" strokeWidth={1.5} />
                    <span className="text-sm font-medium text-gray-900 text-left">{cat.label}</span>
                  </button>
                ))}
              </div>

              {/* Counters */}
              <div className="space-y-6 max-w-lg">
                {[
                  { label: "Kitchens", field: "kitchens" },
                  { label: "Bedrooms", field: "bedrooms" },
                  { label: "Beds", field: "beds" },
                  { label: "Bathrooms", field: "bathrooms" },
                ].map((item) => (
                  <div key={item.field} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
                    <span className="text-lg text-gray-800">{item.label}</span>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => updateCounter(item.field as any, -1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-gray-800 hover:text-gray-800 transition-colors disabled:opacity-30"
                        disabled={(formData as any)[item.field] === 0}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-6 text-center text-lg">{String((formData as any)[item.field])}</span>
                      <button
                        onClick={() => updateCounter(item.field as any, 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-gray-800 hover:text-gray-800 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Bathroom Type Toggle */}
                <div className="py-4 mt-4">
                  <span className="text-lg text-gray-800 block mb-4">Bathroom Type</span>
                  <div className="flex gap-4">
                    {["Attached", "Not Attached"].map((type) => (
                      <button
                        key={type}
                        onClick={() => setFormData({ ...formData, bathroomType: type })}
                        className={`flex-1 py-3 px-4 rounded-xl border font-medium text-sm transition-all ${
                          formData.bathroomType === type
                            ? "border-black bg-gray-50 ring-1 ring-black text-black"
                            : "border-gray-200 text-gray-600 hover:border-gray-900"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: PRICING & TENANTS */}
          {currentStep === 5 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-3xl font-semibold text-gray-900 mb-8">
                Now, set your price
              </h1>
              <div className="space-y-8 max-w-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rent per month (LKR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">Rs.</span>
                    <input
                      type="number"
                      value={formData.rentPerMonth}
                      onChange={(e) => setFormData({ ...formData, rentPerMonth: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 text-xl font-medium border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Advance money amount (LKR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">Rs.</span>
                    <input
                      type="number"
                      value={formData.advanceMoney}
                      onChange={(e) => setFormData({ ...formData, advanceMoney: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 text-xl font-medium border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Advance Details (Optional)
                  </label>
                  <textarea
                    value={formData.advanceDetails}
                    onChange={(e) => setFormData({ ...formData, advanceDetails: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all resize-none"
                    placeholder="e.g. 6 months advance required..."
                  />
                </div>

                <div className="flex items-center justify-between py-4 border-t border-gray-100">
                  <span className="text-lg text-gray-800">Expected Tenants</span>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => updateCounter("expectedTenants", -1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-gray-800 hover:text-gray-800 transition-colors disabled:opacity-30"
                      disabled={formData.expectedTenants === 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-6 text-center text-lg">{formData.expectedTenants}</span>
                    <button
                      onClick={() => updateCounter("expectedTenants", 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-gray-800 hover:text-gray-800 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: MEDIA UPLOAD */}
          {currentStep === 6 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-3xl font-semibold text-gray-900 mb-4">
                Add some photos of your place
              </h1>
              <p className="text-gray-500 mb-8">
                You'll need 5 photos to get started. You can add more or make changes later.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                <div className="col-span-2 row-span-2 aspect-[4/3] border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                   <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                   <span className="text-sm font-medium text-gray-600">Cover Photo</span>
                </div>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-[4/3] border border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                    <Plus className="w-6 h-6 text-gray-400" />
                  </div>
                ))}
              </div>

              {/* Panorama Upload (Optional) */}
              <div className="mt-8 pt-8 border-t border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Add a 360° Panorama (Optional)</h3>
                <p className="text-sm text-gray-500 mb-4">Allow tenants to take a virtual tour of your property.</p>
                <div className="border border-dashed border-gray-300 rounded-xl p-6 flex items-center justify-center bg-white hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <UploadCloud className="w-5 h-5 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Upload Panorama Image</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: NEARBY FACILITIES */}
          {currentStep === 7 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
                <span className="text-sm font-bold text-green-600 uppercase tracking-wider">Final Step</span>
              </div>
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                Highlight the neighborhood
              </h1>
              <p className="text-gray-500 mb-8">
                This information is optional but helps attract tenants looking for convenience.
              </p>

              <div className="space-y-8 max-w-xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nearby Food & Dining
                  </label>
                  <p className="text-xs text-gray-500 mb-3">Mention popular restaurants, grocery stores, or cafes.</p>
                  <textarea
                    value={formData.foodFacilities}
                    onChange={(e) => setFormData({ ...formData, foodFacilities: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all resize-none"
                    placeholder="e.g. 5 mins walk to Supermarket, numerous local cafes nearby..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Part-time Job Opportunities
                  </label>
                  <p className="text-xs text-gray-500 mb-3">Great for students! Mention nearby retail centers or hubs.</p>
                  <textarea
                    value={formData.partTimeJobs}
                    onChange={(e) => setFormData({ ...formData, partTimeJobs: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all resize-none"
                    placeholder="e.g. Shopping mall 2km away often hiring part-time staff..."
                  />
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ── Sticky Bottom Navigation ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        {/* Progress Bar */}
        <div className="h-1 w-full bg-gray-200 absolute top-0 left-0">
          <div 
            className="h-full bg-black transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className="max-w-3xl mx-auto px-6 h-20 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="text-sm font-semibold text-gray-900 underline underline-offset-4 hover:text-gray-600 transition-colors"
          >
            Back
          </button>
          
          <button
            onClick={handleNext}
            className="bg-[#222222] hover:bg-black text-white px-8 py-3.5 rounded-lg text-sm font-semibold transition-colors"
          >
            {currentStep === TOTAL_STEPS ? "Submit Listing" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
