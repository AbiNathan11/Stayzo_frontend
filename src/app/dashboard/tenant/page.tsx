"use client";
import Cookies from 'js-cookie';

import React, { useState, useEffect, useRef } from 'react';
import { Home, CalendarClock, Bell, FileSignature, ShieldCheck, Download, UploadCloud, Camera, Star, ArrowRight, CheckCircle2, Smartphone, Scale } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
// @ts-ignore
import { io } from 'socket.io-client';

// ─── SUB-COMPONENT: DESKTOP DRAWING PAD ─────────────────────────────────────
function DesktopCanvasPad({ onSave }: { onSave: (dataUrl: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.strokeStyle = '#1A1A1A';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(15, canvas.height - 30);
    ctx.lineTo(canvas.width - 15, canvas.height - 30);
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.strokeStyle = '#1A1A1A';
    ctx.lineWidth = 3;
  }, []);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(15, canvas.height - 30);
    ctx.lineTo(canvas.width - 15, canvas.height - 30);
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.strokeStyle = '#1A1A1A';
    ctx.lineWidth = 3;
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    onSave(canvas.toDataURL('image/png'));
  };

  return (
    <div className="space-y-4">
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 flex flex-col items-center">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          width={360}
          height={180}
          className="bg-white cursor-crosshair border-b border-slate-100"
        />
      </div>
      <div className="flex gap-2 justify-end">
        <button
          onClick={handleClear}
          type="button"
          className="px-4 py-2 border border-slate-200 text-slate-700 hover:border-slate-400 text-[10px] font-black uppercase rounded-lg transition-colors"
        >
          Clear
        </button>
        <button
          onClick={handleSave}
          type="button"
          className="px-4 py-2 bg-[#1A1A1A] hover:bg-black text-white text-[10px] font-black uppercase rounded-lg transition-colors shadow-sm"
        >
          Apply Signature
        </button>
      </div>
    </div>
  );
}


interface SubmittedReview {
  id: string;
  propertyTitle: string;
  landlordName: string;
  rating: number;
  comment: string;
  date: string;
  image: string;
}

export default function TenantOverviewPage() {
  const [user, setUser] = useState<{ firstName: string; lastName: string; email: string; profileImage?: string | null } | null>(null);

  const [submittedReviews, setSubmittedReviews] = useState<SubmittedReview[]>([]);

  // Edit Profile States
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editImage, setEditImage] = useState<string | null>(null);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [stats, setStats] = useState<{ activeBookings: number; pendingVisits: number; unreadMessages: number } | null>(null);

  // Agreement States
  const [agreements, setAgreements] = useState<any[]>([]);

  const fetchAgreements = async (email: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/agreements?tenantEmail=${encodeURIComponent(email)}`, { cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        setAgreements(data);
      }
    } catch (err) {
      console.error("Error fetching agreements for tenant:", err);
    }
  };

  const loadTenantReviews = async (email: string) => {
    try {
      const response = await fetch('http://localhost:3001/api/reviews', { cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        // Filter reviews given by this tenant (matches email)
        const filtered = data
          .filter((item: any) => item.authorEmail?.toLowerCase() === email.toLowerCase())
          .map((item: any) => ({
            id: item.id,
            propertyTitle: item.property?.title || item.targetName || 'Property Stay',
            landlordName: item.property?.owner ? `${item.property.owner.firstName || ''} ${item.property.owner.lastName || ''}`.trim() : 'Host',
            rating: item.rating,
            comment: item.comment,
            date: `Reviewed ${new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
            image: item.property?.images?.[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300"
          }));
        setSubmittedReviews(filtered);
      }
    } catch (err) {
      console.error("Error fetching tenant reviews:", err);
    }
  };

  useEffect(() => {
    const token = Cookies.get('stayzo_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const email = payload.email || '';
        if (!email) {
          Cookies.remove('stayzo_token');
          Cookies.remove('stayzo_refresh_token');
          window.location.href = '/auth';
          return;
        }
        setUser({
          firstName: payload.firstName || 'User',
          lastName: payload.lastName || '',
          email: email,
          profileImage: payload.profileImage || null
        });
        setEditFirstName(payload.firstName || 'User');
        setEditLastName(payload.lastName || '');

        // Fetch live agreements from database
        fetchAgreements(email);
        
        // Fetch reviews and bookings dynamically
        loadTenantReviews(email);

        // Fetch live profile from DB
        fetch(`http://localhost:3001/api/auth/profile/${email}`, {
          cache: 'no-store',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
          .then(res => {
            if (res.status === 401 || res.status === 404) {
              Cookies.remove('stayzo_token');
              Cookies.remove('stayzo_refresh_token');
              window.location.href = '/auth';
              throw new Error('Session invalid, logged out');
            }
            return res.json();
          })
          .then(data => {
            if (data.user) {
              setUser(prev => ({
                ...prev!,
                firstName: data.user.firstName || prev?.firstName || 'User',
                lastName: data.user.lastName || prev?.lastName || '',
                profileImage: data.user.profileImage || null
              }));
              setEditFirstName(data.user.firstName || 'User');
              setEditLastName(data.user.lastName || '');
              setEditImage(data.user.profileImage || null);
            }
            if (data.stats && data.stats.tenant) {
              setStats(data.stats.tenant);
            }
          })
          .catch(err => {
            console.warn("Live profile fetch issue:", err);
          });
      } catch (e) {
        Cookies.remove('stayzo_token');
        Cookies.remove('stayzo_refresh_token');
        window.location.href = '/auth';
      }
    } else {
      window.location.href = '/auth';
    }

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('edit') === 'true') {
        setShowEditModal(true);
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      }
    }
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !editFirstName.trim()) return;

    const token = Cookies.get('stayzo_token');
    setUpdatingProfile(true);
    try {
      const response = await fetch('http://localhost:3001/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: user.email,
          firstName: editFirstName,
          lastName: editLastName,
          profileImage: editImage
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      if (data.user) {
        setUser(prev => ({
          ...prev!,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          profileImage: data.user.profileImage
        }));

        setProfileSuccess(true);
        setTimeout(() => {
          setShowEditModal(false);
          setProfileSuccess(false);
          window.location.reload();
        }, 1200);
      }
    } catch (err) {
      console.error("Profile update error:", err);
      toast.error("Failed to update profile in database.");
    } finally {
      setUpdatingProfile(false);
    }
  };




  const userInitial = user?.firstName?.charAt(0).toUpperCase() || 'A';

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <Toaster position="top-right" toastOptions={{ style: { background: '#1A1A1A', color: '#fff', fontWeight: 700, fontSize: '13px', borderRadius: '12px' } }} />
      
      {/* Dashboard Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <h2 className="text-3xl font-extrabold tracking-tight text-[#1A1A1A]">Welcome back, {user?.firstName}</h2>
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tenant Portal</span>
      </div>

      {/* Activity Stats Redesign - Full Width Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: Active Booking */}
        <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-xs hover:shadow-md hover:translate-y-[-2px] transition-all duration-300 flex items-center justify-between group cursor-pointer relative overflow-hidden">
          <div className="absolute top-0 right-0 w-22 h-22 bg-[#EEF2FF] opacity-35 rounded-full blur-xl transform translate-x-4 -translate-y-4 transition-transform group-hover:scale-125"></div>
          <div className="flex items-center gap-4.5">
            <div className="w-[50px] h-[50px] rounded-2xl bg-[#EEF2FF] flex items-center justify-center text-[#4F46E5] group-hover:scale-110 transition duration-300 shrink-0">
              <Home className="w-[22px] h-[22px]" />
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Active Booking</p>
              <h3 className="text-2xl font-black text-gray-900 mt-0.5 leading-none">
                {stats ? stats.activeBookings : 0}
              </h3>
            </div>
          </div>
          <ArrowRight className="w-4.5 h-4.5 text-gray-300 group-hover:text-[#4F46E5] transition-all duration-300 transform group-hover:translate-x-1" />
        </div>

        {/* Card 2: Pending Visits */}
        <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-xs hover:shadow-md hover:translate-y-[-2px] transition-all duration-300 flex items-center justify-between group cursor-pointer relative overflow-hidden">
          <div className="absolute top-0 right-0 w-22 h-22 bg-[#ECFDF5] opacity-45 rounded-full blur-xl transform translate-x-4 -translate-y-4 transition-transform group-hover:scale-125"></div>
          <div className="flex items-center gap-4.5">
            <div className="w-[50px] h-[50px] rounded-2xl bg-[#ECFDF5] flex items-center justify-center text-[#10B981] group-hover:scale-110 transition duration-300 shrink-0">
              <CalendarClock className="w-[22px] h-[22px]" />
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Pending Visits</p>
              <h3 className="text-2xl font-black text-gray-900 mt-0.5 leading-none">
                {stats ? stats.pendingVisits : 0}
              </h3>
            </div>
          </div>
          <ArrowRight className="w-4.5 h-4.5 text-gray-300 group-hover:text-[#10B981] transition-all duration-300 transform group-hover:translate-x-1" />
        </div>

        {/* Card 3: Unread Messages */}
        <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-xs hover:shadow-md hover:translate-y-[-2px] transition-all duration-300 flex items-center justify-between group cursor-pointer relative overflow-hidden">
          <div className="absolute top-0 right-0 w-22 h-22 bg-[#FFFBEB] opacity-55 rounded-full blur-xl transform translate-x-4 -translate-y-4 transition-transform group-hover:scale-125"></div>
          <div className="flex items-center gap-4.5">
            <div className="w-[50px] h-[50px] rounded-2xl bg-[#FFFBEB] flex items-center justify-center text-[#F59E0B] group-hover:scale-110 transition duration-300 shrink-0">
              <Bell className="w-[22px] h-[22px]" />
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Unread Msg</p>
              <h3 className="text-2xl font-black text-gray-900 mt-0.5 leading-none">
                {stats ? stats.unreadMessages : 0}
              </h3>
            </div>
          </div>
          <ArrowRight className="w-4.5 h-4.5 text-gray-300 group-hover:text-[#F59E0B] transition-all duration-300 transform group-hover:translate-x-1" />
        </div>

      </div>

      {/* Main Grid Layout - split equally for Document Vault and My Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Digital Document Vault */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 border-b border-gray-100 pb-6">
              <div>
                <h4 className="text-xl font-black text-[#1A1A1A] flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6" /> Digital Document Vault
                </h4>
                <p className="text-gray-500 text-xs mt-1 font-semibold">Securely manage your agreements and KYC files.</p>
              </div>

            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {/* Signed Agreements */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Agreements</h3>
                </div>
                <div className="space-y-3">
                  {agreements.filter((a: any) => a.status === 'Active').length === 0 ? (
                    <p className="text-xs text-gray-400 font-semibold italic">No signed agreements stored in your vault.</p>
                  ) : (
                    <>
                      {agreements.filter((a: any) => a.status === 'Active').slice(0, 2).map((agreement) => (
                        <div key={agreement.id} className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-gray-100 transition gap-3">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
                              <FileSignature className="w-4 h-4 text-[#1A1A1A]" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-[#1A1A1A]">{agreement.listingName}</h4>
                              <p className="text-xs text-gray-500 mt-0.5 font-medium">
                                Rent: Rs {agreement.monthlyRent?.toLocaleString()} | Status: <span className="font-bold uppercase text-[10px] text-emerald-600">Active</span>
                              </p>
                            </div>
                          </div>
                          <Link 
                            href="/dashboard/tenant/agreement"
                            className="bg-[#1A1A1A] text-white hover:bg-black text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-xl transition duration-200"
                          >
                            View
                          </Link>
                        </div>
                      ))}
                      {agreements.filter((a: any) => a.status === 'Active').length > 2 && (
                        <Link 
                          href="/dashboard/tenant/agreement"
                          className="block text-center text-[10px] font-black text-[#4F46E5] hover:underline uppercase tracking-wider pt-1"
                        >
                          View all {agreements.filter((a: any) => a.status === 'Active').length} agreements
                        </Link>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* My Reviews */}
        <div className="bg-[#F8FAFB] border border-gray-200 rounded-3xl p-6 md:p-8 flex flex-col justify-between gap-6 shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-xs">
                  <Star className="w-5 h-5 text-[#1A1A1A]" />
                </div>
                <h3 className="text-lg font-black text-[#1A1A1A]">My Reviews</h3>
              </div>
            </div>

            {/* List of Submitted Reviews */}
            <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
              {submittedReviews.length === 0 ? (
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
              )}
            </div>
          </div>
        </div>

      </div>


      {/* Edit Profile Modal Form overlay */}
      {showEditModal && (
        <div className="fixed inset-0 bg-[#1A1A1A]/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white border border-gray-200 rounded-[32px] w-full max-w-md p-6 md:p-8 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="mb-6 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-extrabold text-[#1A1A1A]">Edit Profile</h3>
                <p className="text-xs text-gray-500 font-semibold mt-1">
                  Update your username and profile picture.
                </p>
              </div>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 font-extrabold text-sm"
              >
                ✕
              </button>
            </div>

            {profileSuccess ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#EEF2FF] flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-8 h-8 text-[#4F46E5]" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#1A1A1A]">Profile Saved!</h4>
                  <p className="text-gray-500 text-xs font-semibold mt-1">
                    Your profile changes have been successfully committed.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                
                {/* Photo Upload area */}
                <div className="flex flex-col items-center space-y-3">
                  <div className="relative group">
                    {editImage ? (
                      <img src={editImage} alt="Preview" className="w-24 h-24 rounded-full object-cover border border-gray-200 shadow-sm" />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-xs font-bold border border-gray-200">
                        No Photo
                      </div>
                    )}
                    <label className="absolute bottom-0 right-0 bg-[#EEF2FF] text-[#4F46E5] hover:bg-[#E0E7FF] p-2 rounded-full shadow-md cursor-pointer transition">
                      <Camera className="w-4 h-4" />
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handlePhotoChange} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Click camera to upload</span>
                </div>

                {/* Name Inputs */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={editFirstName}
                      onChange={(e) => setEditFirstName(e.target.value)}
                      required
                      placeholder="Jane"
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-gray-400 focus:bg-white transition duration-200 font-semibold text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={editLastName}
                      onChange={(e) => setEditLastName(e.target.value)}
                      required
                      placeholder="Doe"
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-gray-400 focus:bg-white transition duration-200 font-semibold text-gray-700"
                    />
                  </div>
                </div>

                {/* Save button */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 border border-gray-200 text-gray-500 hover:bg-gray-50 rounded-2xl py-3 text-xs font-bold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updatingProfile || !editFirstName.trim() || !editLastName.trim()}
                    className={`flex-1 rounded-2xl py-3 text-xs font-bold shadow-sm transition duration-200 ${
                      updatingProfile || !editFirstName.trim() || !editLastName.trim()
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-[#4F46E5] text-white hover:bg-[#4338CA] active:scale-95"
                    }`}
                  >
                    {updatingProfile ? "Saving..." : "Save Changes"}
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
