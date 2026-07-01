"use client";
import Cookies from 'js-cookie';

import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Loader2, Camera } from 'lucide-react';

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string | null;
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onSuccess: (updatedUser: UserProfile) => void;
}

export default function EditProfileModal({ isOpen, onClose, user, onSuccess }: EditProfileModalProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profileImageBase64, setProfileImageBase64] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user && isOpen) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setPreviewImage(user.profileImage || null);
      setProfileImageBase64(null);
      setError(null);
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setProfileImageBase64(base64);
      setPreviewImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = Cookies.get('stayzo_token');
      if (!token) throw new Error('Not authenticated');

      const payload = {
        email: user.email,
        firstName,
        lastName,
        ...(profileImageBase64 ? { profileImage: profileImageBase64 } : {})
      };

      const res = await fetch('http://localhost:3001/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      // If the backend returns the updated user, we use it. 
      // Otherwise, we construct it from our payload.
      const updatedUser = {
        ...user,
        firstName,
        lastName,
        profileImage: data.user?.profileImage || previewImage
      };
      
      onSuccess(updatedUser);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={!loading ? onClose : undefined} />
      
      <div className="relative w-full max-w-md bg-white rounded-[24px] shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-extrabold text-[#1A1A1A]">Edit Profile</h2>
          <button 
            onClick={onClose}
            disabled={loading}
            className="p-2 hover:bg-gray-100 rounded-full transition disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-sm font-semibold rounded-xl">
              {error}
            </div>
          )}

          {/* Avatar Section */}
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              {previewImage ? (
                <img 
                  src={previewImage} 
                  alt="Profile Preview" 
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center text-3xl font-black shadow-lg border-4 border-white">
                  {firstName.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="mt-3 text-xs font-bold text-indigo-600 cursor-pointer hover:underline" onClick={() => fileInputRef.current?.click()}>
              Change Picture
            </p>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">First Name</label>
              <input 
                type="text" 
                value={firstName} 
                onChange={e => setFirstName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                placeholder="Enter your first name"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Last Name</label>
              <input 
                type="text" 
                value={lastName} 
                onChange={e => setLastName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                placeholder="Enter your last name"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email Address</label>
              <input 
                type="email" 
                value={user.email} 
                disabled
                className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-sm font-semibold text-gray-400 cursor-not-allowed"
              />
              <p className="mt-1 text-[11px] text-gray-400 font-medium">Email addresses cannot be changed.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-50 bg-gray-50 flex justify-end space-x-3">
          <button 
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 rounded-full text-sm font-bold text-gray-600 hover:bg-gray-200 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={loading || !firstName.trim()}
            className="px-6 py-2.5 rounded-full text-sm font-bold bg-[#1A1A1A] text-white hover:bg-black transition disabled:opacity-50 flex items-center space-x-2 shadow-md hover:shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
