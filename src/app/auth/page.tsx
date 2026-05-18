"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function TenantAuth() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [step, setStep] = useState<'form' | 'otp'>('form');
  
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:3001/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName, lastName, mode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP');
      setStep('otp');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:3001/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid OTP');
      
      if (data.token) localStorage.setItem('stayzo_token', data.token);
      window.location.href = '/'; 
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F3] text-[#2D2D2D] font-sans selection:bg-[#F26B27] selection:text-white flex flex-col">
      
      {/* Simple Header */}
      <nav className="w-full py-6 px-4 sm:px-6 lg:px-8 absolute top-0">
        <Link href="/" className="text-3xl font-serif italic font-extrabold text-[#1A1A1A] cursor-pointer hover:opacity-80 transition inline-block">
          Stayzo.
        </Link>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 pt-24 pb-12">
        <div className="w-full max-w-[480px]">
          
          {step === 'form' ? (
            <div className="bg-white p-10 sm:p-14 shadow-2xl relative z-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-4xl font-serif font-extrabold text-[#1A1A1A] mb-4">
                {mode === 'login' ? 'Welcome back' : 'Create an account'}
              </h2>
              <p className="text-gray-500 text-[15px] font-medium mb-8 leading-relaxed">
                {mode === 'login' 
                  ? "Enter your email to log in to your tenant account. No password required, we'll send you a secure code."
                  : "Join Stayzo today to find your perfect stay. No password required, we'll verify you via email."}
              </p>

              <form onSubmit={handleSendCode} className="space-y-6">
                
                {mode === 'signup' && (
                  <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="space-y-2">
                      <label className="text-[11px] uppercase tracking-widest text-gray-500 font-bold block">First Name</label>
                      <input 
                        type="text" 
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full bg-[#FDF8F3] border border-[#E8D4C0] px-4 py-3.5 outline-none focus:border-[#F26B27] transition text-[15px] text-gray-800" 
                        placeholder="Jane"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] uppercase tracking-widest text-gray-500 font-bold block">Last Name</label>
                      <input 
                        type="text" 
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full bg-[#FDF8F3] border border-[#E8D4C0] px-4 py-3.5 outline-none focus:border-[#F26B27] transition text-[15px] text-gray-800" 
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                )}

                {error && <p className="text-red-500 text-sm font-medium mb-4">{error}</p>}

                <div className="space-y-2">
                  <label className="text-[11px] uppercase tracking-widest text-gray-500 font-bold block">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#FDF8F3] border border-[#E8D4C0] px-4 py-3.5 outline-none focus:border-[#F26B27] transition text-[15px] text-gray-800" 
                    placeholder="jane@example.com"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-[#F26B27] hover:bg-[#E05A16] disabled:opacity-50 text-white py-4 font-bold transition text-[13px] tracking-widest uppercase shadow-md shadow-[#F26B27]/20 mt-4"
                >
                  {loading ? 'Processing...' : (mode === 'login' ? 'Send Login Code' : 'Send Verification Code')}
                </button>
              </form>

              <div className="mt-8 pt-8 border-t border-gray-100 text-center">
                <p className="text-sm text-gray-500 font-medium">
                  {mode === 'login' ? "Don't have an account?" : "Already have an account?"}{" "}
                  <button 
                    onClick={() => {
                      setMode(mode === 'login' ? 'signup' : 'login');
                      setFirstName('');
                      setLastName('');
                      setError('');
                    }}
                    className="text-[#F26B27] hover:underline font-bold"
                  >
                    {mode === 'login' ? 'Sign up' : 'Log in'}
                  </button>
                </p>
              </div>

            </div>
          ) : (
            <div className="bg-white p-10 sm:p-14 shadow-2xl relative z-10 w-full animate-in fade-in slide-in-from-right-8 duration-500">
              <button 
                onClick={() => { setStep('form'); setError(''); setOtp(''); }}
                className="flex items-center text-gray-400 hover:text-[#F26B27] transition text-sm font-bold tracking-widest uppercase mb-8"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </button>

              <h2 className="text-4xl font-serif font-extrabold text-[#1A1A1A] mb-4">Check your email</h2>
              <div className="flex items-center space-x-2 text-[#F26B27] mb-8">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <p className="text-[15px] font-medium text-gray-600">
                  We've sent a 6-digit code to <span className="font-bold text-gray-900 break-all">{email || 'your email'}</span>
                </p>
              </div>

              <form onSubmit={handleVerify} className="space-y-6">
                {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                
                <div className="space-y-2">
                  <label className="text-[11px] uppercase tracking-widest text-gray-500 font-bold block">Secure Login Code</label>
                  <input 
                    type="text" 
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    className="w-full bg-[#FDF8F3] border border-[#E8D4C0] px-4 py-4 outline-none focus:border-[#F26B27] transition text-2xl tracking-[0.5em] text-center text-gray-800 font-bold" 
                    placeholder="••••••"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-[#1A1A1A] hover:bg-black disabled:opacity-50 text-white py-4 font-bold transition text-[13px] tracking-widest uppercase shadow-md shadow-black/20 mt-4"
                >
                  {loading ? 'Verifying...' : 'Verify & Continue'}
                </button>
              </form>

              <p className="text-center text-sm text-gray-500 font-medium mt-8">
                Didn't receive it? <button className="text-[#F26B27] hover:underline font-bold">Resend code</button>
              </p>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
