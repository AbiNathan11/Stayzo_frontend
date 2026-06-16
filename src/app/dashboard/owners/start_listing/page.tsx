"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import dynamic from "next/dynamic";
import { geocodeAddress } from "@/services/google/geocode";
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

// Dynamically import PropertyMap to avoid SSR issues
const PropertyMap = dynamic(() => import("@/components/maps/PropertyMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-gray-50 rounded-2xl flex flex-col items-center justify-center border border-gray-150">
      <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mb-3"></div>
      <p className="text-xs text-gray-500 font-bold tracking-widest uppercase animate-pulse">Initializing Google Maps...</p>
    </div>
  ),
});

// Canvas-based equirectangular panorama viewer
const PanoramaPreview = ({ imageUrl }: { imageUrl: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const scrollOffset = useRef(0);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      canvas.width = canvas.parentElement?.clientWidth || 600;
      canvas.height = 300;
      
      const render = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const w = img.width;
        const h = img.height;
        const canvasW = canvas.width;
        const canvasH = canvas.height;

        const offset = (scrollOffset.current % w + w) % w;

        ctx.drawImage(img, offset, 0, w - offset, h, 0, 0, canvasW * ((w - offset) / w), canvasH);
        ctx.drawImage(img, 0, 0, offset, h, canvasW * ((w - offset) / w), 0, canvasW * (offset / w), canvasH);

        if (!isDragging) {
          scrollOffset.current += 1.2;
        }
        animationFrameId.current = requestAnimationFrame(render);
      };
      render();
    };

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [imageUrl, isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startX.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - startX.current;
    scrollOffset.current -= dx * 1.5;
    startX.current = e.clientX;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-gray-200 relative group cursor-grab active:cursor-grabbing">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="w-full h-[300px] block"
      />
      <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1.5 rounded-full text-white text-xs font-semibold select-none pointer-events-none flex items-center gap-1">
        <span>🔄 Drag to look around (360° Virtual Tour)</span>
      </div>
    </div>
  );
};

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

const TOTAL_STEPS = 8;

export default function StartListingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load draft from localStorage on mount
  useEffect(() => {
    const draft = localStorage.getItem('stayzo_listing_draft');
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        if (parsed.formData) setFormData(parsed.formData);
        if (parsed.currentStep) setCurrentStep(parsed.currentStep);
      } catch (err) {
        console.error('Error loading draft:', err);
      }
    }
  }, []);

  const handleSaveAndExit = () => {
    localStorage.setItem('stayzo_listing_draft', JSON.stringify({ formData, currentStep }));
    router.push("/dashboard/owners/listings");
  };

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
    latitude: null as number | null,
    longitude: null as number | null,
    description: "",
  });

  // --- Stayzo AI document & GPS validation states ---
  const [isVerifyingBill, setIsVerifyingBill] = useState(false);
  const [billVerified, setBillVerified] = useState(false);
  const [billOcrName, setBillOcrName] = useState("");
  const [billOcrAddress, setBillOcrAddress] = useState("");
  const [billVerificationError, setBillVerificationError] = useState("");
  
  // Controls to toggle mock OCR outcomes
  const [simulateMismatchAddress, setSimulateMismatchAddress] = useState(false);
  const [simulateMismatchName, setSimulateMismatchName] = useState(false);

  // Photos Fraud Verification States
  const [isVerifyingPhotos, setIsVerifyingPhotos] = useState(false);
  const [photosVerified, setPhotosVerified] = useState(false);
  
  // Controls for testing GPS fraud scenarios: "match", "fraud", "no-gps"
  const [gpsSimulationMode, setGpsSimulationMode] = useState<"match" | "fraud" | "no-gps">("match");
  const [gpsVerificationDetails, setGpsVerificationDetails] = useState<string>("");

  // Document verification logic
  const triggerBillVerification = (imgData: string) => {
    if (!imgData) return;
    setIsVerifyingBill(true);
    setBillVerificationError("");
    setBillVerified(false);

    let landlordName = "Abiramy Nathan";
    const token = sessionStorage.getItem('stayzo_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.firstName) landlordName = `${payload.firstName} ${payload.lastName || ''}`.trim();
      } catch {}
    }

    setTimeout(() => {
      setIsVerifyingBill(false);
      
      const extractedName = simulateMismatchName ? "John Doe" : landlordName;
      const extractedAddress = simulateMismatchAddress 
        ? "No. 450, Alvis Place, Galle Road, Galle (Mismatched)" 
        : `${formData.street ? formData.street + ', ' : ''}${formData.city}`;

      setBillOcrName(extractedName);
      setBillOcrAddress(extractedAddress);

      // Verify street or city contains match
      const streetMatch = extractedAddress.toLowerCase().includes(formData.street.toLowerCase().split(' ')[0]);
      const cityMatch = extractedAddress.toLowerCase().includes(formData.city.toLowerCase());

      if (!streetMatch && !cityMatch) {
        setBillVerificationError("Address mismatch: The document address does not match your Step 1 input.");
        setBillVerified(false);
        toast.error("Address on the bill does not match the property address.", { id: "bill-verify" });
        return;
      }

      if (extractedName.toLowerCase() !== landlordName.toLowerCase()) {
        setFormData(prev => ({ ...prev, ownershipType: "Broker" }));
        setBillVerified(true);
        toast("Name mismatch detected! Property relationship set to 'Broker'. Please fill in the owner details.", { id: "bill-verify", icon: "⚠️" });
      } else {
        setBillVerified(true);
        toast.success("Document verified successfully!", { id: "bill-verify" });
      }
    }, 1800);
  };

  // Re-run bill verification if simulation toggles change
  useEffect(() => {
    if (formData.waterBillImage) {
      triggerBillVerification(formData.waterBillImage);
    }
  }, [simulateMismatchAddress, simulateMismatchName]);

  // GPS Metadata Verification logic
  const verifyImageGps = (fieldName: string) => {
    setIsVerifyingPhotos(true);
    setPhotosVerified(false);
    setGpsVerificationDetails("Reading image EXIF GPS metadata...");

    setTimeout(() => {
      setIsVerifyingPhotos(false);
      
      const propLat = formData.latitude || 6.9271;
      const propLng = formData.longitude || 79.8612;

      if (gpsSimulationMode === "fraud") {
        // Mock off-site coordinates (e.g. Kandy)
        const imageLat = 7.2906;
        const imageLng = 80.6337;
        const distanceKm = 115.4;
        
        setGpsVerificationDetails(
          `Image Coordinates: ${imageLat.toFixed(4)}° N, ${imageLng.toFixed(4)}° E. Property Coordinates: ${propLat.toFixed(4)}° N, ${propLng.toFixed(4)}° E. Distance: ${distanceKm.toFixed(1)} km. Result: BLOCKED (Fraudulent listing detected).`
        );
        setPhotosVerified(false);
        toast.error("Fraud detection triggered: Images were not taken at the property location.", { id: "gps-verify" });
      } else if (gpsSimulationMode === "no-gps") {
        setGpsVerificationDetails(
          "No GPS metadata tags found in this image file. Please upload an authentic image taken on-site with Location services active."
        );
        setPhotosVerified(false);
        toast.error("Verification failed: Missing on-site GPS metadata.", { id: "gps-verify" });
      } else {
        // Match: within 15 meters
        const imageLat = propLat + 0.0001;
        const imageLng = propLng + 0.0001;
        
        setGpsVerificationDetails(
          `Image Coordinates: ${imageLat.toFixed(4)}° N, ${imageLng.toFixed(4)}° E. Property Coordinates: ${propLat.toFixed(4)}° N, ${propLng.toFixed(4)}° E. Distance: 15.2 meters. Result: VERIFIED.`
        );
        setPhotosVerified(true);
        toast.success("Image GPS location verified!", { id: "gps-verify" });
      }
    }, 1500);
  };

  // Re-run photo verification if GPS mode changes
  useEffect(() => {
    if (formData.images[0] || formData.panoramaImage) {
      verifyImageGps("images");
    }
  }, [gpsSimulationMode]);

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
        const resultStr = reader.result as string;
        setFormData((prev) => ({ ...prev, [fieldName]: resultStr }));
        if (fieldName === 'waterBillImage') {
          triggerBillVerification(resultStr);
        }
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
        if (index === 0) {
          verifyImageGps("coverPhoto");
        }
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
        toast.error("Please provide at least a Street Name, City, and Postal Code to continue.");
        return;
      }
      
      const fullAddress = `${formData.street}, ${formData.city}, ${formData.district || ''}, ${formData.postalCode}`;
      try {
        toast.loading("Resolving property location...", { id: "geocode" });
        const coords = await geocodeAddress(fullAddress);
        if (coords) {
          setFormData(prev => ({ ...prev, latitude: coords.lat, longitude: coords.lng }));
          toast.success("Location coordinates resolved!", { id: "geocode" });
        } else {
          setFormData(prev => ({ ...prev, latitude: 6.9271, longitude: 79.8612 }));
          toast.error("Could not precisely geocode address. Please manually pin it in Step 3.", { id: "geocode" });
        }
      } catch (err) {
        setFormData(prev => ({ ...prev, latitude: 6.9271, longitude: 79.8612 }));
        toast.dismiss("geocode");
      }
    }

    // Validation for Step 2: Verification Bill
    if (currentStep === 2) {
      if (!formData.waterBillImage) {
        toast.error("Please upload an electrical or water bill for property verification.");
        return;
      }
      if (!billVerified) {
        toast.error("Document verification must succeed to continue.");
        return;
      }
      if (formData.ownershipType === "Broker") {
        if (!formData.realOwnerName.trim() || !formData.realOwnerEmail.trim()) {
          toast.error("Please provide the property owner's full name and email address.");
          return;
        }
      }
    }

    // Validation for Step 3: Map pinning coordinates
    if (currentStep === 3) {
      if (formData.latitude === null || formData.longitude === null) {
        toast.error("Please set property coordinates on the map.");
        return;
      }
    }

    // Validation for Step 4: Category
    if (currentStep === 4 && !formData.propertyCategory) {
      toast.error("Please select a property category that best describes your place.");
      return;
    }

    // Validation for Step 5: Description
    if (currentStep === 5) {
      if (!formData.description.trim()) {
        toast.error("Please enter a description for your property listing.");
        return;
      }
      if (formData.description.trim().length < 30) {
        toast.error("Description must be at least 30 characters long.");
        return;
      }
    }

    // Validation for Step 6: Rent
    if (currentStep === 6 && !formData.rentPerMonth) {
      toast.error("Please specify a monthly rent amount.");
      return;
    }

    // Validation for Step 7: Media Upload & GPS EXIF location validation
    if (currentStep === 7) {
      if (!formData.images[0]) {
        toast.error("Please upload at least a Cover Photo for your property listing.");
        return;
      }
      if (!photosVerified) {
        toast.error("Upload on-site photos and panorama matching your property coordinates.");
        return;
      }
    }

    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Submit logic
      setIsSubmitting(true);
      try {
        let ownerId = "owner-123";
        const token = sessionStorage.getItem('stayzo_token');
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            if (payload.id) ownerId = payload.id;
          } catch {
            // ignore
          }
        }

        const title = `${formData.propertyCategory || "Property"} at ${formData.street}`;
        const description = formData.description;
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
          sqft: 1200,
          type: formData.propertyCategory || "Apartment",
          images: filteredImages,
          panoramaImage: formData.panoramaImage || null,
          waterBillImage: formData.waterBillImage || null,
          latitude: formData.latitude,
          longitude: formData.longitude,
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
          localStorage.removeItem('stayzo_listing_draft');
          toast.success("Listing submitted successfully! Images have been saved to Cloudinary.");
          router.push("/dashboard/owners/listings");
        } else {
          const errData = await res.json();
          toast.error("Failed to submit listing: " + (errData.error || "Unknown error"));
        }
      } catch (err) {
        console.error("Error submitting listing:", err);
        toast.error("An error occurred while submitting. Please check your network and try again.");
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
      <Toaster position="top-right" toastOptions={{ style: { background: '#1A1A1A', color: '#fff', fontWeight: 700, fontSize: '13px', borderRadius: '12px' } }} />
      {/* ── Global Header ── */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 flex items-center justify-between px-6 lg:px-10">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="flex items-end space-x-1 h-5">
            <div className="w-[3px] h-3 bg-[#1A1A1A] rounded-full group-hover:bg-black transition-colors"></div>
            <div className="w-[3px] h-5 bg-[#1A1A1A] rounded-full group-hover:bg-black transition-colors"></div>
            <div className="w-[3px] h-4 bg-[#1A1A1A] rounded-full group-hover:bg-black transition-colors"></div>
            <div className="w-[3px] h-2.5 bg-[#1A1A1A] rounded-full group-hover:bg-black transition-colors"></div>
          </div>
          <span className="text-xl font-bold tracking-tight text-[#1A1A1A]">Stayzo</span>
        </Link>
        <button 
          onClick={handleSaveAndExit}
          className="text-xs font-bold text-gray-900 bg-white border border-gray-200 hover:shadow-sm px-4 py-2 rounded-full transition cursor-pointer"
        >
          Save and Exit
        </button>
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
                Verify your property ownership
              </h1>
              <p className="text-gray-500 mb-6">
                Please upload a recent water bill or electrical bill to verify that the property details match the owner&apos;s NIC profile.
              </p>

              {/* Document Upload Zone */}
              <label className="mb-6 border-2 border-dashed border-gray-300 rounded-2xl p-10 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative overflow-hidden group">
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
                        setBillVerified(false);
                        setBillOcrName("");
                        setBillOcrAddress("");
                        setBillVerificationError("");
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
                    <p className="text-sm font-medium text-gray-900">Click to upload water or electrical bill</p>
                    <p className="text-xs text-gray-500 mt-2">SVG, PNG, JPG or PDF (max. 5MB)</p>
                  </>
                )}
              </label>

              {/* Scanning status banner */}
              {isVerifyingBill && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-3 animate-pulse">
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs font-bold text-blue-700">Stayzo AI Scanner: Analyzing document layout and extracting text...</span>
                </div>
              )}

              {/* Simulation Testing Panel */}
              {formData.waterBillImage && !isVerifyingBill && (
                <div className="mb-8 p-5 bg-gray-50 border border-gray-200 rounded-2xl">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">AI Verification Extracted Details</h4>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500 font-semibold">NIC / Owner Name:</span>
                      <span className="font-bold text-[#1A1A1A]">{billOcrName || "Not extracted"}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500 font-semibold">Bill Service Address:</span>
                      <span className="font-bold text-[#1A1A1A]">{billOcrAddress || "Not extracted"}</span>
                    </div>
                  </div>

                  {billVerificationError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-700 text-xs font-semibold rounded-lg">
                      ⚠️ {billVerificationError}
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-3">
                    <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Test Simulation Controls (OCR Sandbox)</h5>
                    <div className="flex flex-wrap gap-4">
                      <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={simulateMismatchAddress}
                          onChange={(e) => setSimulateMismatchAddress(e.target.checked)}
                          className="rounded border-gray-300 text-black focus:ring-black"
                        />
                        Force Mismatched Address (Blocks Listing)
                      </label>
                      <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={simulateMismatchName}
                          onChange={(e) => setSimulateMismatchName(e.target.checked)}
                          className="rounded border-gray-300 text-black focus:ring-black"
                        />
                        Force Mismatched Name (Redirects to Broker)
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Ownership Type Section */}
              <div className="mb-8">
                <label className="block text-base font-semibold text-gray-900 mb-3">
                  What is your relationship to this property?
                </label>
                <div className="flex gap-4">
                  {["Owner", "Broker"].map((role) => (
                    <button
                      key={role}
                      type="button"
                      disabled={simulateMismatchName && role === "Owner"}
                      onClick={() => setFormData({ ...formData, ownershipType: role })}
                      className={`flex-1 py-4 px-6 rounded-xl border-2 font-medium text-sm transition-all ${
                        formData.ownershipType === role
                          ? "border-black bg-gray-50 text-black"
                          : "border-gray-200 text-gray-600 hover:border-gray-900"
                      } disabled:opacity-40 disabled:cursor-not-allowed`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
                {simulateMismatchName && (
                  <p className="text-[10px] text-amber-600 font-bold mt-1.5">
                    ⚠️ Mismatched Name Simulation Active: Switched to Broker to gather owner credentials.
                  </p>
                )}
              </div>

              {/* Conditional Broker Form */}
              {formData.ownershipType === "Broker" && (
                <div className="space-y-5 animate-in fade-in slide-in-from-top-2 duration-300 border-t border-gray-100 pt-6">
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
                Confirm your property coordinates
              </h1>
              <p className="text-gray-500 mb-6">
                Drag the marker to pinpoint the exact location of your property on the map.
              </p>
              
              <div className="w-full bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-4">
                <div className="w-full h-[400px] bg-gray-100 rounded-2xl overflow-hidden relative border border-gray-200">
                  <PropertyMap
                    coords={{ lat: formData.latitude || 6.9271, lng: formData.longitude || 79.8612 }}
                    draggable={true}
                    onCoordinatesChange={(coords) => {
                      setFormData(prev => ({ ...prev, latitude: coords.lat, longitude: coords.lng }));
                    }}
                    propertyTitle="Your Property Spot"
                    className="w-full h-full"
                  />
                </div>
                <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-gray-800" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Pin Coordinates</p>
                      <p className="text-sm font-black text-[#1A1A1A]">
                        {formData.latitude?.toFixed(6) ?? "6.927100"}° N, {formData.longitude?.toFixed(6) ?? "79.861200"}° E
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
                    Draggable Pin Active
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: BASICS / COUNTERS */}
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

          {/* STEP 5: PROPERTY DESCRIPTION */}
          {currentStep === 5 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                Describe your property
              </h1>
              <p className="text-gray-500 mb-8">
                Write a high-quality description listing the unique qualities, views, rules, and advantages of your property.
              </p>
              
              <div className="space-y-4 max-w-xl">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Property Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={8}
                    className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all resize-y"
                    placeholder="e.g. This beautiful studio flat features an abundance of natural light, premium amenities, a private balcony facing the harbor, and is situated just 5 minutes away from the main transit terminal..."
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-400">Minimum 30 characters</span>
                    <span className={`text-xs font-bold ${formData.description.length >= 30 ? 'text-green-600' : 'text-amber-500'}`}>
                      {formData.description.length} characters
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: PRICING & TENANTS */}
          {currentStep === 6 && (
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

          {/* STEP 7: MEDIA UPLOAD & GPS EXIF VALIDATION */}
          {currentStep === 7 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-3xl font-semibold text-gray-900 mb-4">
                Add photos and virtual tour
              </h1>
              
              {/* Location EXIF Fraud Protection Warning Notice */}
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                <h4 className="text-xs font-bold text-amber-800 flex items-center gap-2 mb-1.5">
                  ⚠️ Stayzo Location Fraud Protection
                </h4>
                <p className="text-[11px] text-amber-700 leading-relaxed">
                  Every uploaded property photo and panorama image must contain EXIF geolocation metadata corresponding to the physical location of the property. Listing submissions containing off-site or mock metadata will be automatically blocked to prevent fraud.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
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

              {/* Panorama Upload */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="text-base font-semibold text-gray-900 mb-1">360° virtual Panorama tour</h3>
                <p className="text-xs text-gray-500 mb-3">Include an equirectangular image to let prospective renters tour the rooms virtually.</p>
                <label className="border border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center bg-white hover:bg-gray-50 transition-colors cursor-pointer relative overflow-hidden group mb-4">
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

                {formData.panoramaImage && (
                  <div className="mb-6 animate-in zoom-in-95 duration-300">
                    <PanoramaPreview imageUrl={formData.panoramaImage} />
                  </div>
                )}
              </div>

              {/* GPS Metadata Scanner Overlay & Simulation Dashboard */}
              {(formData.images[0] || formData.panoramaImage) && (
                <div className="mt-6 p-5 bg-gray-50 border border-gray-200 rounded-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Metadata Geolocation validation</h4>
                    {isVerifyingPhotos ? (
                      <span className="text-[10px] bg-blue-50 border border-blue-100 text-blue-700 font-bold px-2 py-1 rounded-full flex items-center gap-1 animate-pulse">
                        ⌛ Scanning...
                      </span>
                    ) : photosVerified ? (
                      <span className="text-[10px] bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold px-2 py-1 rounded-full">
                        ✓ GPS Match Verified
                      </span>
                    ) : (
                      <span className="text-[10px] bg-rose-50 border border-rose-100 text-rose-700 font-bold px-2 py-1 rounded-full">
                        ⚠️ Fraud Detected / Missing GPS
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed font-mono bg-white border border-gray-150 p-3 rounded-lg mb-4 whitespace-pre-wrap">
                    {gpsVerificationDetails || "No photos verified yet."}
                  </p>

                  <div className="border-t border-gray-200 pt-3">
                    <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">GPS Verification Simulation Controls (EXIF Sandbox)</h5>
                    <div className="flex gap-2">
                      {[
                        { mode: "match", label: "On-Site (Match)" },
                        { mode: "fraud", label: "Off-Site (Fraud)" },
                        { mode: "no-gps", label: "No GPS tags" }
                      ].map((item) => (
                        <button
                          key={item.mode}
                          type="button"
                          onClick={() => setGpsSimulationMode(item.mode as any)}
                          className={`flex-1 py-2 px-3 border text-xs font-bold rounded-lg transition-all ${
                            gpsSimulationMode === item.mode
                              ? "bg-black border-black text-white"
                              : "bg-white border-gray-200 text-gray-600 hover:border-black"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 8: NEARBY FACILITIES */}
          {currentStep === 8 && (
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
