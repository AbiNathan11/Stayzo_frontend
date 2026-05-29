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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Form State ---
  const [formData, setFormData] = useState({
    houseNo: "",
    street: "",
    streetLine2: "",
    city: "",
    district: "",
    postalCode: "",
    propertyCategory: "" as PropertyCategory,
    kitchens: 1,
    bedrooms: 1,
    beds: 1,
    attachedBathrooms: 0,
    separateBathrooms: 1,
    rentPerMonth: "",
    advanceMoney: "",
    advanceDetails: "",
    expectedTenants: 1,
    foodFacilities: "",
    partTimeJobs: "",
    ownershipType: "Owner",
    realOwnerName: "",
    realOwnerEmail: "",
    images: ["", "", "", "", ""],
    panoramaImage: "",
    waterBillImage: "",
  });

  // Example handlers for counters
  const updateCounter = (field: keyof typeof formData, delta: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: Math.max(0, (prev[field] as number) + delta),
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, [fieldName]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => {
          const updatedImages = [...prev.images];
          updatedImages[index] = reader.result as string;
          return { ...prev, images: updatedImages };
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => {
      const updatedImages = [...prev.images];
      updatedImages[index] = '';
      return { ...prev, images: updatedImages };
    });
  };

  const handleNext = async () => {
    // Validation for Step 1: Address Fields
    if (currentStep === 1) {
      if (!formData.street.trim() || !formData.city.trim() || !formData.postalCode.trim()) {
        alert("Please provide at least a Street Name, City, and Postal Code to continue.");
        return;
      }
    }

    // Validation for Step 2: Broker Fields & KYC Upload
    if (currentStep === 2) {
      if (formData.ownershipType === "Broker") {
        if (!formData.realOwnerName.trim() || !formData.realOwnerEmail.trim()) {
          alert("Please provide the property owner's full name and email address.");
          return;
        }
      }
      if (!formData.waterBillImage) {
        alert("Please upload an electrical or water bill for property verification.");
        return;
      }
    }

    // Validation for Step 4: Category
    if (currentStep === 4 && !formData.propertyCategory) {
      alert("Please select a property category that best describes your place.");
      return;
    }

    // Validation for Step 5: Rent
    if (currentStep === 5 && !formData.rentPerMonth) {
      alert("Please specify a monthly rent amount.");
      return;
    }

    // Validation for Step 6: Cover Photo
    if (currentStep === 6 && !formData.images[0]) {
      alert("Please upload at least a Cover Photo for your property listing.");
      return;
    }

    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Submit logic
      setIsSubmitting(true);
      try {
        let ownerId = "owner-123";
        const token = localStorage.getItem("stayzo_token");
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            if (payload.id) ownerId = payload.id;
          } catch {
            // ignore
          }
        }

        const title = `${formData.propertyCategory || "Property"} at ${formData.street}`;
        const description = `Beautiful ${formData.propertyCategory} located in ${formData.city}. Features ${formData.bedrooms} bedrooms, ${formData.kitchens} kitchens, and expected occupancy of ${formData.expectedTenants} tenants. Nearby food options: ${formData.foodFacilities || 'Not specified'}. Part-time job options: ${formData.partTimeJobs || 'Not specified'}.`;
        const address = `${formData.houseNo ? formData.houseNo + ', ' : ''}${formData.street}${formData.streetLine2 ? ', ' : ''}${formData.streetLine2}`;
        const price = formData.rentPerMonth ? parseFloat(formData.rentPerMonth) : 0;
        
        // Filter out empty strings from images array
        const filteredImages = formData.images.filter((img) => img !== "");

        const body = {
          ownerId,
          title,
          description,
          price,
          address,
          city: formData.city,
          state: formData.district || "Western Province",
          zipCode: formData.postalCode,
          bedrooms: formData.bedrooms.toString(),
          bathrooms: (formData.attachedBathrooms + formData.separateBathrooms).toString(),
          sqft: 1200, // Number or String matching DB requirement
          type: formData.propertyCategory || "Apartment",
          images: filteredImages,
          panoramaImage: formData.panoramaImage || null,
          waterBillImage: formData.waterBillImage || null,
          amenities: ["Kitchen", "Bathroom", "Water facilities"]
        };

        const res = await fetch("http://localhost:3001/api/properties", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (res.ok) {
          alert("Listing submitted successfully! Images have been saved to Cloudinary.");
          router.push("/dashboard/owners/listings");
        } else {
          const errData = await res.json();
          alert("Failed to submit listing: " + (errData.error || "Unknown error"));
        }
      } catch (err) {
        console.error("Error submitting listing:", err);
        alert("An error occurred while submitting. Please check your network and try again.");
      } finally {
        setIsSubmitting(false);
      }
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
      {/* ── Global Header ── */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 flex items-center justify-between px-6 lg:px-10">
        <div className="flex items-center space-x-2.5">
          <div className="flex items-end space-x-[3px] h-5">
            <div className="w-[3px] h-3 bg-[#1A1A1A] rounded-full" />
            <div className="w-[3px] h-5 bg-[#1A1A1A] rounded-full" />
            <div className="w-[3px] h-4 bg-[#1A1A1A] rounded-full" />
            <div className="w-[3px] h-2.5 bg-[#1A1A1A] rounded-full" />
          </div>
          <span className="text-[15px] font-black tracking-tight text-[#1A1A1A] uppercase">Stayzo</span>
        </div>
        <Link href="/dashboard/owners" className="text-sm font-semibold text-gray-800 hover:text-black hover:underline underline-offset-4 transition-all">
          Exit to Dashboard
        </Link>
      </header>

      {/* ── Main Content Area ── */}
      <main className="flex-1 overflow-y-auto pt-16 pb-32">
        <div className="max-w-3xl mx-auto px-6 pt-8 pb-12 md:pt-12 md:pb-20">
          
          {/* Sub-header Step Indicator */}
          <div className="mb-6">
            <span className="text-xs font-bold text-gray-800 tracking-widest uppercase">
              Step {currentStep} of {TOTAL_STEPS}
            </span>
          </div>
          
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
                    Street Name (Line 1) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
                    placeholder="e.g. Main Street"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Name (Line 2)
                  </label>
                  <input
                    type="text"
                    value={formData.streetLine2}
                    onChange={(e) => setFormData({ ...formData, streetLine2: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
                    placeholder="e.g. Area, Building name (Optional)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
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

              {/* Document Upload Zone */}
              <label className="mb-10 border-2 border-dashed border-gray-300 rounded-2xl p-12 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative overflow-hidden group">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, 'waterBillImage')}
                />
                {formData.waterBillImage ? (
                  <div className="flex flex-col items-center animate-in fade-in duration-300">
                    <div className="w-32 h-32 rounded-xl bg-white border shadow-sm overflow-hidden mb-3 relative group/preview">
                      <img src={formData.waterBillImage} alt="Bill Preview" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-sm font-bold text-green-600 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Document Attached Successfully
                    </span>
                    <p className="text-xs text-gray-400 mt-1">Click to replace or select another document</p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setFormData(prev => ({ ...prev, waterBillImage: '' }));
                      }}
                      className="mt-4 bg-white border border-gray-200 hover:bg-red-50 text-gray-600 hover:text-red-600 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
                    >
                      Remove Document
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-105 transition-transform">
                      <UploadCloud className="w-8 h-8 text-gray-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500 mt-2">SVG, PNG, JPG or PDF (max. 5MB)</p>
                  </>
                )}
              </label>

              {/* Ownership Type Section */}
              <div className="mb-10">
                <label className="block text-base font-semibold text-gray-900 mb-4">
                  What is your relationship to this property?
                </label>
                <div className="flex gap-4">
                  {["Owner", "Broker"].map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setFormData({ ...formData, ownershipType: role })}
                      className={`flex-1 py-4 px-6 rounded-xl border-2 font-medium text-sm transition-all ${
                        formData.ownershipType === role
                          ? "border-black bg-gray-50 text-black"
                          : "border-gray-200 text-gray-600 hover:border-gray-900"
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Conditional Broker Form */}
              {formData.ownershipType === "Broker" && (
                <div className="space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Owner&apos;s Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.realOwnerName}
                      onChange={(e) => setFormData({ ...formData, realOwnerName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
                      placeholder="Enter the property owner's name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Owner&apos;s Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.realOwnerEmail}
                      onChange={(e) => setFormData({ ...formData, realOwnerEmail: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
                      placeholder="Enter the property owner's email"
                    />
                  </div>
                </div>
              )}
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
                    type="button"
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
                  { label: "Attached Bathrooms", field: "attachedBathrooms" },
                  { label: "Separate Bathrooms", field: "separateBathrooms" },
                ].map((item) => (
                  <div key={item.field} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
                    <span className="text-lg text-gray-800">{item.label}</span>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => updateCounter(item.field as any, -1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-gray-800 hover:text-gray-800 transition-colors disabled:opacity-30"
                        disabled={(formData as any)[item.field] === 0}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-6 text-center text-lg">{String((formData as any)[item.field])}</span>
                      <button
                        type="button"
                        onClick={() => updateCounter(item.field as any, 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-gray-800 hover:text-gray-800 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

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
                    Rent per month (LKR) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">Rs.</span>
                    <input
                      type="number"
                      required
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
                      type="button"
                      onClick={() => updateCounter("expectedTenants", -1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-gray-800 hover:text-gray-800 transition-colors disabled:opacity-30"
                      disabled={formData.expectedTenants === 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-6 text-center text-lg">{formData.expectedTenants}</span>
                    <button
                      type="button"
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
                You will need a cover photo to get started. You can add up to 5 photos.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                {/* Cover Photo Slot (index 0) */}
                <label className="col-span-2 row-span-2 aspect-[4/3] border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative overflow-hidden group">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageChange(e, 0)}
                  />
                  {formData.images[0] ? (
                    <>
                      <img src={formData.images[0]} alt="Cover" className="w-full h-full object-cover animate-in fade-in duration-300" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs font-semibold bg-black/60 px-3 py-1.5 rounded-full">Change Cover Photo</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRemoveImage(0);
                        }}
                        className="absolute top-3 right-3 bg-white/90 hover:bg-white text-gray-800 p-1.5 rounded-full shadow-sm hover:scale-105 transition-all z-10"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-8 h-8 text-gray-400 mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium text-gray-600">Cover Photo</span>
                    </>
                  )}
                </label>

                {/* Additional 4 Photos */}
                {[1, 2, 3, 4].map((i) => (
                  <label key={i} className="aspect-[4/3] border border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative overflow-hidden group">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageChange(e, i)}
                    />
                    {formData.images[i] ? (
                      <>
                        <img src={formData.images[i]} alt={`Photo ${i}`} className="w-full h-full object-cover animate-in fade-in duration-300" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-[10px] font-semibold bg-black/60 px-2 py-1 rounded-full">Change Photo</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleRemoveImage(i);
                          }}
                          className="absolute top-2 right-2 bg-white/90 hover:bg-white text-gray-800 p-1 rounded-full shadow-sm hover:scale-105 transition-all z-10"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <Plus className="w-6 h-6 text-gray-400 group-hover:scale-110 transition-transform" />
                      </>
                    )}
                  </label>
                ))}
              </div>

              {/* Panorama Upload (Optional) */}
              <div className="mt-8 pt-8 border-t border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Add a 360° Panorama (Optional)</h3>
                <p className="text-sm text-gray-500 mb-4">Allow tenants to take a virtual tour of your property.</p>
                <label className="border border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center bg-white hover:bg-gray-50 transition-colors cursor-pointer relative overflow-hidden group">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, 'panoramaImage')}
                  />
                  {formData.panoramaImage ? (
                    <div className="w-full flex items-center justify-between animate-in fade-in duration-300">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded bg-gray-100 border overflow-hidden">
                          <img src={formData.panoramaImage} alt="Panorama Preview" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <span className="text-sm font-bold text-green-600">✓ 360° Panorama Attached</span>
                          <p className="text-[11px] text-gray-400">Click to replace the image</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setFormData(prev => ({ ...prev, panoramaImage: '' }));
                        }}
                        className="bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-600 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <UploadCloud className="w-5 h-5 text-gray-500 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium text-gray-700">Upload Panorama Image</span>
                    </div>
                  )}
                </label>
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

        <div className="w-full px-6 lg:px-10 h-20 flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            disabled={isSubmitting}
            className="text-sm font-semibold text-gray-900 underline underline-offset-4 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            Back
          </button>
          
          <button
            type="button"
            onClick={handleNext}
            disabled={isSubmitting}
            className="bg-[#222222] hover:bg-black text-white px-8 py-3.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Uploading...</span>
              </>
            ) : (
              currentStep === TOTAL_STEPS ? "Submit Listing" : "Next"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
