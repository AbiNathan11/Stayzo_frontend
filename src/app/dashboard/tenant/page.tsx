"use client";

import React, { useState, useEffect } from 'react';
import { Home, CalendarClock, Bell, FileSignature, ShieldCheck, Download, UploadCloud, Edit3, Camera, Star, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface PendingReview {
  id: number;
  propertyTitle: string;
  landlordName: string;
  stayDates: string;
  image: string;
}

interface SubmittedReview {
  id: number;
  propertyTitle: string;
  landlordName: string;
  rating: number;
  comment: string;
  date: string;
  image: string;
}

export default function TenantOverviewPage() {
  const [user, setUser] = useState<{ firstName: string; lastName: string; email: string } | null>(null);

  const [activeReviewTab, setActiveReviewTab] = useState<'pending' | 'submitted'>('pending');
  const [pendingReviews, setPendingReviews] = useState<PendingReview[]>([
    {
      id: 1,
      propertyTitle: "Colombo Heights Apartment",
      landlordName: "Nimal Bandara",
      stayDates: "Stayed Jan 2024",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 2,
      propertyTitle: "Villa in Galle",
      landlordName: "Saman Perera",
      stayDates: "Stayed Oct 2026",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    }
  ]);

  const [submittedReviews, setSubmittedReviews] = useState<SubmittedReview[]>([
    {
      id: 101,
      propertyTitle: "Villa in Hapugala",
      landlordName: "Saman Perera",
      rating: 5,
      comment: "Absolutely magnificent property and incredibly helpful hosting from Saman.",
      date: "Reviewed May 15, 2026",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    }
  ]);

  // Modal form states
  const [selectedPending, setSelectedPending] = useState<PendingReview | null>(null);
  const [hoverRating, setHoverRating] = useState(0);
  const [rating, setRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('stayzo_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({
          firstName: payload.firstName || 'Abiramy',
          lastName: payload.lastName || '',
          email: payload.email || 'abiramy@example.com'
        });
      } catch (e) {
        setUser({ firstName: 'Abiramy', lastName: '', email: 'abiramy@example.com' });
      }
    } else {
      setUser({ firstName: 'Abiramy', lastName: '', email: 'abiramy@example.com' });
    }
  }, []);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPending || rating === 0 || !reviewComment.trim()) return;

    const newReview: SubmittedReview = {
      id: Date.now(),
      propertyTitle: selectedPending.propertyTitle,
      landlordName: selectedPending.landlordName,
      rating,
      comment: reviewComment,
      date: "Reviewed Just now",
      image: selectedPending.image
    };

    setSubmittedReviews([newReview, ...submittedReviews]);
    setPendingReviews(pendingReviews.filter(p => p.id !== selectedPending.id));
    setShowSuccess(true);

    setTimeout(() => {
      setSelectedPending(null);
      setShowSuccess(false);
      setActiveReviewTab('submitted');
    }, 1800);
  };

  const userInitial = user?.firstName?.charAt(0).toUpperCase() || 'A';

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Dashboard Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <h2 className="text-3xl font-extrabold tracking-tight text-[#1A1A1A]">Welcome back, {user?.firstName}</h2>
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tenant Portal</span>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Profile Card (Spans 1 column on desktop) */}
        <div className="col-span-1 md:col-span-1 bg-white text-[#1A1A1A] border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 opacity-50 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="flex flex-col items-center text-center space-y-4 relative z-10">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-100 text-[#1A1A1A] flex items-center justify-center text-4xl font-black shadow-sm">
                {userInitial}
              </div>
              <button className="absolute bottom-0 right-0 bg-[#EEF2FF] text-[#4F46E5] hover:bg-[#E0E7FF] p-2 rounded-full shadow-md transition duration-200">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            
            <div>
              <h3 className="text-xl font-bold leading-tight">
                {user?.firstName} {user?.lastName}
              </h3>
              <p className="text-gray-500 text-xs font-semibold mt-1">{user?.email}</p>
            </div>

            <div className="w-full flex flex-col gap-2 mt-4">
              <button className="w-full flex items-center justify-center space-x-2 text-xs font-bold text-[#4F46E5] bg-[#EEF2FF] hover:bg-[#E0E7FF] rounded-xl px-4 py-2.5 transition duration-200 shadow-sm">
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
              <button className="w-full flex items-center justify-center space-x-2 text-xs font-bold text-[#4F46E5] bg-[#EEF2FF] hover:bg-[#E0E7FF] rounded-xl px-4 py-2.5 transition duration-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verify Identity</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview (Spans 3 columns) */}
        <div className="col-span-1 md:col-span-3 bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-center">
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">Activity Overview</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
            
            {/* Stat 1 */}
            <div className="flex items-center gap-5 sm:px-4 first:px-0 pt-4 sm:pt-0 first:pt-0 group cursor-pointer">
              <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center group-hover:scale-110 transition duration-300">
                <Home className="w-6 h-6 text-[#1A1A1A]" />
              </div>
              <div>
                <h3 className="text-4xl font-black text-[#1A1A1A] leading-none mb-1">1</h3>
                <p className="text-xs font-bold text-gray-500 uppercase">Active Booking</p>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="flex items-center gap-5 sm:px-6 pt-4 sm:pt-0 group cursor-pointer">
              <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center group-hover:scale-110 transition duration-300">
                <CalendarClock className="w-6 h-6 text-[#1A1A1A]" />
              </div>
              <div>
                <h3 className="text-4xl font-black text-[#1A1A1A] leading-none mb-1">2</h3>
                <p className="text-xs font-bold text-gray-500 uppercase">Pending Visits</p>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex items-center gap-5 sm:px-6 pt-4 sm:pt-0 group cursor-pointer">
              <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center group-hover:scale-110 transition duration-300">
                <Bell className="w-6 h-6 text-[#1A1A1A]" />
              </div>
              <div>
                <h3 className="text-4xl font-black text-[#1A1A1A] leading-none mb-1">3</h3>
                <p className="text-xs font-bold text-gray-500 uppercase">Unread Msg</p>
              </div>
            </div>

          </div>
        </div>

        {/* Digital Document Vault (Spans 2 cols on desktop) */}
        <div className="col-span-1 md:col-span-2 bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 border-b border-gray-100 pb-6">
              <div>
                <h4 className="text-xl font-black text-[#1A1A1A] flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6" /> Digital Document Vault
                </h4>
                <p className="text-gray-500 text-xs mt-1 font-semibold">Securely manage your agreements and KYC files.</p>
              </div>
              <button className="bg-[#EEF2FF] text-[#4F46E5] hover:bg-[#E0E7FF] px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition duration-200 flex items-center gap-2 shrink-0">
                <UploadCloud className="w-4 h-4" /> Upload New
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {/* Signed Agreements */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Agreements</h3>
                </div>
                <div className="space-y-3">
                  <div className="group flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-gray-100 transition cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
                        <FileSignature className="w-4 h-4 text-[#1A1A1A]" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#1A1A1A]">Villa Tropical Cana Lease</h4>
                        <p className="text-xs text-gray-500 mt-0.5 font-medium">Signed: Oct 1, 2026</p>
                      </div>
                    </div>
                    <button className="w-8 h-8 rounded-full bg-[#EEF2FF] text-[#4F46E5] hover:bg-[#E0E7FF] shadow-sm flex items-center justify-center transition duration-200">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="group flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-gray-100 transition cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
                        <FileSignature className="w-4 h-4 text-[#1A1A1A]" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#1A1A1A]">Colombo Heights Agreement</h4>
                        <p className="text-xs text-gray-500 mt-0.5 font-medium">Signed: Jan 15, 2024</p>
                      </div>
                    </div>
                    <button className="w-8 h-8 rounded-full bg-[#EEF2FF] text-[#4F46E5] hover:bg-[#E0E7FF] shadow-sm flex items-center justify-center transition duration-200">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Verified KYC */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Identity (KYC)</h3>
                </div>
                <div className="flex items-center justify-between p-5 bg-[#EEF2FF] text-[#1A1A1A] rounded-2xl border border-indigo-100/70 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#4F46E5]/5 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-full bg-[#4F46E5]/10 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-6 h-6 text-[#4F46E5]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-[#1A1A1A]">National ID Card (NIC)</h4>
                      <p className="text-xs text-gray-500 mt-1 font-semibold">Verified & Secure</p>
                    </div>
                  </div>
                  <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white text-[#4F46E5] border border-indigo-100 shadow-sm hover:scale-105 transition cursor-pointer">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* My Reviews (Spans 2 cols on desktop) */}
        <div className="col-span-1 md:col-span-2 bg-[#F8FAFB] border border-gray-200 rounded-3xl p-6 md:p-8 flex flex-col justify-between gap-6 shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-xs">
                  <Star className="w-5 h-5 text-[#1A1A1A]" />
                </div>
                <h3 className="text-lg font-black text-[#1A1A1A]">My Reviews</h3>
              </div>

              {/* Mini Tab Switcher */}
              <div className="flex bg-[#EEF2FF] p-0.5 rounded-lg shrink-0">
                <button
                  onClick={() => setActiveReviewTab('pending')}
                  className={`px-3 py-1.5 rounded-md text-[10px] font-extrabold transition ${
                    activeReviewTab === 'pending'
                      ? 'bg-white text-[#4F46E5] shadow-xs'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Pending ({pendingReviews.length})
                </button>
                <button
                  onClick={() => setActiveReviewTab('submitted')}
                  className={`px-3 py-1.5 rounded-md text-[10px] font-extrabold transition ${
                    activeReviewTab === 'submitted'
                      ? 'bg-white text-[#4F46E5] shadow-xs'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Submitted ({submittedReviews.length})
                </button>
              </div>
            </div>

            {/* Tab content */}
            <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
              {activeReviewTab === 'pending' ? (
                pendingReviews.length === 0 ? (
                  <div className="bg-[#EEF2FF] border border-indigo-100/60 rounded-2xl p-8 text-center space-y-3">
                    <CheckCircle2 className="w-6 h-6 text-[#4F46E5] mx-auto" />
                    <p className="text-xs font-bold text-[#1A1A1A]">All caught up!</p>
                  </div>
                ) : (
                  pendingReviews.map((item) => (
                    <div key={item.id} className="bg-white border border-gray-200/80 rounded-2xl p-4 flex gap-4 hover:border-gray-300 transition duration-200">
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gray-50">
                        <img src={item.image} alt={item.propertyTitle} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-extrabold text-xs text-[#1A1A1A] truncate">{item.propertyTitle}</h4>
                          <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Host: {item.landlordName}</p>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedPending(item);
                            setRating(0);
                            setReviewComment("");
                            setShowSuccess(false);
                          }}
                          className="w-max bg-[#EEF2FF] text-[#4F46E5] hover:bg-[#E0E7FF] px-3 py-1.5 rounded-lg text-[10px] font-extrabold transition flex items-center gap-1 shadow-xs"
                        >
                          <Edit3 className="w-3 h-3" /> Write Review
                        </button>
                      </div>
                    </div>
                  ))
                )
              ) : (
                submittedReviews.length === 0 ? (
                  <div className="bg-[#EEF2FF] border border-indigo-100/60 rounded-2xl p-8 text-center text-gray-400 text-xs font-semibold">
                    No submitted reviews.
                  </div>
                ) : (
                  submittedReviews.map((item) => (
                    <div key={item.id} className="bg-white border border-gray-200/80 rounded-2xl p-4 space-y-3 hover:border-gray-300 transition duration-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                          <img src={item.image} alt={item.propertyTitle} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-extrabold text-xs text-[#1A1A1A] truncate">{item.propertyTitle}</h4>
                          <div className="flex items-center gap-0.5 mt-0.5">
                            {Array.from({ length: 5 }, (_, idx) => (
                              <Star 
                                key={idx} 
                                className={`w-3 h-3 ${
                                  idx < item.rating 
                                    ? "fill-amber-400 text-amber-400" 
                                    : "text-gray-300"
                                }`} 
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-[11px] font-semibold text-gray-600 italic bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                        "{item.comment}"
                      </p>
                    </div>
                  ))
                )
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Review Modal Form overlay */}
      {selectedPending && (
        <div className="fixed inset-0 bg-[#1A1A1A]/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white border border-gray-200 rounded-[32px] w-full max-w-lg p-6 md:p-8 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="mb-6">
              <h3 className="text-xl font-extrabold text-[#1A1A1A]">Review Landlord & Property</h3>
              <p className="text-xs text-gray-500 font-semibold mt-1">
                Rate your hosting experience for {selectedPending.propertyTitle}.
              </p>
            </div>

            {showSuccess ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#EEF2FF] flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-8 h-8 text-[#4F46E5]" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#1A1A1A]">Review Submitted!</h4>
                  <p className="text-gray-500 text-xs font-semibold mt-1">
                    Your valuable feedback has been posted successfully.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-6">
                
                <div className="flex items-center gap-4 bg-[#EEF2FF] rounded-2xl p-4 border border-indigo-50/50">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                    <img src={selectedPending.image} alt={selectedPending.propertyTitle} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-[#1A1A1A]">{selectedPending.propertyTitle}</h4>
                    <p className="text-xs text-gray-500 font-semibold mt-0.5">Owner/Host: {selectedPending.landlordName}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2">
                    Select Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: 5 }, (_, idx) => {
                      const starValue = idx + 1;
                      const isActive = starValue <= (hoverRating || rating);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setRating(starValue)}
                          onMouseEnter={() => setHoverRating(starValue)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 transition-transform active:scale-90"
                        >
                          <Star 
                            className={`w-8 h-8 transition duration-150 ${
                              isActive 
                                ? "fill-amber-400 text-amber-400 scale-105" 
                                : "text-gray-300"
                            }`} 
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2">
                    Your Review & Experience
                  </label>
                  <textarea
                    rows={4}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required
                    placeholder="Write details about the property, location, hosting, and landlord..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm outline-none focus:border-gray-400 focus:bg-white transition duration-200 resize-none font-semibold text-gray-700"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPending(null)}
                    className="flex-1 border border-gray-200 text-gray-500 hover:bg-gray-50 rounded-2xl py-3 text-xs font-bold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={rating === 0 || !reviewComment.trim()}
                    className={`flex-1 rounded-2xl py-3 text-xs font-bold shadow-sm transition duration-200 ${
                      rating === 0 || !reviewComment.trim()
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-[#4F46E5] text-white hover:bg-[#4338CA] active:scale-95"
                    }`}
                  >
                    Submit Review
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
