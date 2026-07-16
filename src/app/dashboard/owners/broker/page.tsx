"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { UploadCloud, CheckCircle2 } from "lucide-react";

export default function BrokerAgreementPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const propertyId = searchParams.get("propertyId");

  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [nicImageFront, setNicImageFront] = useState<string>("");
  const [nicImageBack, setNicImageBack] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [verificationError, setVerificationError] = useState<{nicName: string, billName: string, reason: string} | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationPassed, setVerificationPassed] = useState(false);

  useEffect(() => {
    if (nicImageFront && nicImageBack && !verificationPassed && !verificationError) {
      const verifyImages = async () => {
        setIsVerifying(true);
        setVerificationError(null);
        try {
          const res = await fetch(`http://localhost:3001/api/properties/${propertyId}/verify-nic`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ownerNicFront: nicImageFront, ownerNicBack: nicImageBack }),
          });

          if (res.ok) {
            setVerificationPassed(true);
            toast.success("Identity Verified Successfully!");
          } else {
            const errData = await res.json();
            if (errData.error === 'NIC Name does not match Utility Bill Name') {
              setVerificationError({
                nicName: errData.nicName,
                billName: errData.billName,
                reason: errData.reason
              });
              toast.error("Identity Verification Failed.");
            } else {
              toast.error(errData.error || "Failed to verify images.");
            }
          }
        } catch (err) {
          toast.error("An error occurred during verification.");
        } finally {
          setIsVerifying(false);
        }
      };

      verifyImages();
    }
  }, [nicImageFront, nicImageBack, propertyId, verificationPassed, verificationError]);

  useEffect(() => {
    if (!propertyId) {
      setLoading(false);
      return;
    }

    const fetchProperty = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/properties/${propertyId}`);
        if (res.ok) {
          const data = await res.json();
          setProperty(data);
        } else {
          toast.error("Failed to load property details.");
        }
      } catch (err) {
        toast.error("An error occurred while fetching property details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  const handleFileChangeFront = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNicImageFront(reader.result as string);
        setVerificationError(null);
        setVerificationPassed(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChangeBack = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNicImageBack(reader.result as string);
        setVerificationError(null);
        setVerificationPassed(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAgree = async () => {
    if (!nicImageFront || !nicImageBack || !verificationPassed) {
      toast.error("Please upload both the front and back of your NIC to verify your identity.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`http://localhost:3001/api/properties/${propertyId}/broker-agreement`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ownerNicFront: nicImageFront, ownerNicBack: nicImageBack }),
      });

      if (res.ok) {
        toast.success("Agreement submitted successfully. The property is now listed.");
        setAgreed(true);
      } else {
        const errData = await res.json();
        toast.error(errData.error || "Failed to submit agreement.");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Property Not Found</h1>
        <p className="text-gray-500 mb-6">We couldn't find the property details. The link may be invalid or expired.</p>
      </div>
    );
  }

  const brokerName = property.owner ? `${property.owner.firstName || ''} ${property.owner.lastName || ''}`.trim() : "Broker";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Toaster position="top-right" toastOptions={{ style: { background: '#1A1A1A', color: '#fff', fontWeight: 700, fontSize: '13px', borderRadius: '12px' } }} />
      
      {/* ── Simple Header ── */}
      <header className="h-16 bg-white border-b border-gray-200 z-50 flex items-center justify-center px-6">
        <div className="flex items-center space-x-2">
          <div className="flex items-end space-x-1 h-5">
            <div className="w-[3px] h-3 bg-[#1A1A1A] rounded-full"></div>
            <div className="w-[3px] h-5 bg-[#1A1A1A] rounded-full"></div>
            <div className="w-[3px] h-4 bg-[#1A1A1A] rounded-full"></div>
            <div className="w-[3px] h-2.5 bg-[#1A1A1A] rounded-full"></div>
          </div>
          <span className="text-xl font-bold tracking-tight text-[#1A1A1A]">Stayzo</span>
        </div>
      </header>

      {/* ── Main Content Area ── */}
      <main className="flex-1 flex flex-col items-center pt-12 pb-24 px-6">
        <div className="max-w-xl w-full bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
          {agreed ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Agreement Confirmed</h2>
              <p className="text-gray-500 mb-6">Thank you. Your property is now actively listed by the broker.</p>
              <Link href="/" className="inline-block px-6 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition">
                Return to Homepage
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Broker Listing Agreement</h1>
              <p className="text-gray-600 text-sm mb-8 text-center leading-relaxed">
                A broker is requesting your permission to list your property on Stayzo. Please review the details below.
              </p>

              <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100 space-y-4">
                <div>
                  <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Property Address</span>
                  <span className="block text-gray-900 font-semibold">{property.address}, {property.city}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Rent Amount</span>
                  <span className="block text-gray-900 font-semibold">Rs. {property.price.toLocaleString()} / month</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Broker Name</span>
                  <span className="block text-gray-900 font-semibold">{brokerName}</span>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-base font-semibold text-gray-900 mb-2">Verify Your Identity</h3>
                <p className="text-xs text-gray-500 mb-4">
                  To approve this listing, please upload a clear photo of both the front and back of your National Identity Card (NIC).
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative overflow-hidden group">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChangeFront}
                    />
                    {nicImageFront ? (
                      <div className="flex flex-col items-center">
                        <div className="w-32 h-20 rounded-lg overflow-hidden mb-3 border shadow-sm">
                          <img src={nicImageFront} alt="NIC Front Preview" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xs font-bold text-green-600 flex items-center gap-1.5 mb-2">
                          <CheckCircle2 className="w-3 h-3" /> Front Attached
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setNicImageFront("");
                            setVerificationError(null);
                            setVerificationPassed(false);
                          }}
                          className="text-[10px] text-gray-500 hover:text-red-600 border border-gray-200 hover:bg-red-50 px-3 py-1.5 rounded-lg font-bold transition-colors"
                        >
                          Remove Image
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-2 group-hover:scale-105 transition-transform">
                          <UploadCloud className="w-5 h-5 text-gray-500" />
                        </div>
                        <p className="text-xs font-medium text-gray-700">Upload NIC Front</p>
                      </>
                    )}
                  </label>

                  <label className="border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative overflow-hidden group">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChangeBack}
                    />
                    {nicImageBack ? (
                      <div className="flex flex-col items-center">
                        <div className="w-32 h-20 rounded-lg overflow-hidden mb-3 border shadow-sm">
                          <img src={nicImageBack} alt="NIC Back Preview" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xs font-bold text-green-600 flex items-center gap-1.5 mb-2">
                          <CheckCircle2 className="w-3 h-3" /> Back Attached
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setNicImageBack("");
                            setVerificationError(null);
                            setVerificationPassed(false);
                          }}
                          className="text-[10px] text-gray-500 hover:text-red-600 border border-gray-200 hover:bg-red-50 px-3 py-1.5 rounded-lg font-bold transition-colors"
                        >
                          Remove Image
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-2 group-hover:scale-105 transition-transform">
                          <UploadCloud className="w-5 h-5 text-gray-500" />
                        </div>
                        <p className="text-xs font-medium text-gray-700">Upload NIC Back</p>
                      </>
                    )}
                  </label>
                </div>

                {verificationError && (
                  <div className="mt-6 bg-red-50 border-2 border-red-200 rounded-xl p-5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500"></div>
                    <h4 className="text-red-800 font-bold text-sm mb-2 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Verification Mismatch
                    </h4>
                    <p className="text-red-700 text-xs mb-3 font-medium">{verificationError.reason}</p>
                    <div className="grid grid-cols-2 gap-4 bg-white/50 p-3 rounded-lg border border-red-100">
                      <div>
                        <span className="block text-[10px] uppercase text-red-500 font-bold tracking-wider mb-1">NIC Name</span>
                        <span className="text-xs font-semibold text-gray-900">{verificationError.nicName || 'Not detected'}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase text-red-500 font-bold tracking-wider mb-1">Utility Bill Name</span>
                        <span className="text-xs font-semibold text-gray-900">{verificationError.billName || 'Not detected'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleAgree}
                disabled={isSubmitting || isVerifying || !nicImageFront || !nicImageBack || !!verificationError || !verificationPassed}
                className="w-full py-4 bg-[#4F46E5] text-white font-bold rounded-xl hover:bg-[#4338CA] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting || isVerifying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {isVerifying ? 'Verifying Identity...' : 'Processing...'}
                  </>
                ) : (
                  "I Agree to List My Property"
                )}
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
