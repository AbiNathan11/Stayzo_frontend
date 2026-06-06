"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error('Please enter a valid email address.');
      return;
    }

    if (mode === 'signup') {
      if (!firstName.trim()) {
        toast.error('First name is required.');
        return;
      }
      if (!lastName.trim()) {
        toast.error('Last name is required.');
        return;
      }
    }

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
      toast.success('Secure verification code sent!');
      setStep('otp');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.trim().length !== 6) {
      toast.error('Please enter a 6-digit verification code.');
      return;
    }
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

      if (data.token) sessionStorage.setItem('stayzo_token', data.token);
      toast.success('Successfully authenticated!');

      const lowerEmail = email.toLowerCase();
      if (lowerEmail === 'stayzoavp@gmail.com' || lowerEmail.startsWith('admin@')) {
        window.location.href = '/dashboard/admin';
      } else if (lowerEmail.includes('owner') || lowerEmail.includes('landlord')) {
        window.location.href = '/dashboard/owners';
      } else {
        window.location.href = '/';
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFB] text-[#1A1A1A] font-sans selection:bg-[#1A1A1A] selection:text-white flex flex-col">

      {/* Simple Header matching the navbar branding */}
      <header className="w-full bg-white border-b border-gray-100 py-4 px-6 sm:px-8 flex justify-between items-center z-50 shrink-0">
        <Link href="/" className="flex items-center space-x-2.5 group">
          <svg 
            viewBox="0 0 100 100" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="5.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="w-5.5 h-5.5 text-[#1A1A1A] shrink-0 transition-transform group-hover:scale-105"
          >
            {/* Outer gable */}
            <path d="M 20,90 L 20,40 L 50,15 L 80,40 L 80,90" />
            {/* Middle gable */}
            <path d="M 30,90 L 30,46 L 50,28 L 70,46 L 70,90" />
            {/* High peak */}
            <path d="M 40,90 L 40,24 L 50,15" />
            {/* Inner gable */}
            <path d="M 42,90 L 42,54 L 50,46 L 58,54 L 58,90" />
            {/* Central Door */}
            <rect x="46" y="72" width="8" height="18" />
          </svg>
          <span className="text-xl font-bold tracking-tight text-[#1A1A1A]">Stayzo</span>
        </Link>
        <Link href="/" className="text-xs font-extrabold text-gray-500 hover:text-[#1A1A1A] transition uppercase tracking-wider">
          Back to Home
        </Link>
      </header>

      {/* Main Content Container with centered card layout */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-[480px] bg-white rounded-[32px] border border-gray-100 p-8 sm:p-12 shadow-sm">

          {step === 'form' ? (
            <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-extrabold text-[#1A1A1A] mb-3 tracking-tight">
                {mode === 'login' ? 'Welcome back' : 'Create account'}
              </h2>
              <p className="text-gray-400 text-xs font-semibold mb-8 leading-relaxed">
                {mode === 'login'
                  ? "Enter your email to log in to your tenant account. We'll send you a secure login code via email."
                  : "Join Stayzo today to find your perfect stay. We'll verify you via email."}
              </p>

              <form onSubmit={handleSendCode} noValidate className="space-y-6">

                {mode === 'signup' && (
                  <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-wider text-gray-400 font-extrabold block">First Name</label>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full bg-[#F5F7F8] border border-transparent rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-[#1A1A1A] transition text-sm text-gray-800 font-semibold"
                        placeholder="Jane"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-wider text-gray-400 font-extrabold block">Last Name</label>
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full bg-[#F5F7F8] border border-transparent rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-[#1A1A1A] transition text-sm text-gray-800 font-semibold"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                )}



                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider text-gray-400 font-extrabold block">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#F5F7F8] border border-transparent rounded-xl px-4 py-3.5 outline-none focus:bg-white focus:border-[#1A1A1A] transition text-sm text-gray-800 font-semibold"
                    placeholder="jane@example.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1A1A1A] hover:bg-black disabled:opacity-50 text-white py-3.5 rounded-full text-xs font-bold tracking-wider uppercase transition shadow-sm mt-4 select-none cursor-pointer"
                >
                  {loading ? 'Processing...' : (mode === 'login' ? 'Send Login Code' : 'Send Verification Code')}
                </button>
              </form>

              <div className="mt-8 pt-8 border-t border-gray-100 text-center">
                <p className="text-xs text-gray-400 font-semibold">
                  {mode === 'login' ? "Don't have an account?" : "Already have an account?"}{" "}
                  <button
                    onClick={() => {
                      setMode(mode === 'login' ? 'signup' : 'login');
                      setFirstName('');
                      setLastName('');
                      setError('');
                    }}
                    className="text-[#1A1A1A] hover:underline font-extrabold cursor-pointer"
                  >
                    {mode === 'login' ? 'Sign up' : 'Log in'}
                  </button>
                </p>
              </div>

            </div>
          ) : (
            <div className="w-full animate-in fade-in slide-in-from-right-8 duration-500">
              <button
                onClick={() => { setStep('form'); setError(''); setOtp(''); }}
                className="flex items-center text-gray-400 hover:text-[#1A1A1A] transition text-[10px] font-extrabold tracking-wider uppercase mb-8"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-2" /> Back
              </button>

              <h2 className="text-3xl font-extrabold text-[#1A1A1A] mb-3 tracking-tight">Check your email</h2>
              <div className="flex items-center space-x-2 text-[#1A1A1A] mb-8">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <p className="text-xs font-semibold text-gray-400">
                  We've sent a 6-digit code to <span className="font-extrabold text-[#1A1A1A] break-all">{email || 'your email'}</span>
                </p>
              </div>

              <form onSubmit={handleVerify} className="space-y-6">


                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider text-gray-400 font-extrabold block">Secure Login Code</label>
                  <input
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    className="w-full bg-[#F5F7F8] border border-transparent rounded-xl px-4 py-3.5 outline-none focus:bg-white focus:border-[#1A1A1A] transition text-2xl tracking-[0.5em] text-center text-[#1A1A1A] font-extrabold"
                    placeholder="••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1A1A1A] hover:bg-black disabled:opacity-50 text-white py-3.5 rounded-full text-xs font-bold tracking-wider uppercase transition shadow-sm mt-4 select-none cursor-pointer"
                >
                  {loading ? 'Verifying...' : 'Verify & Continue'}
                </button>
              </form>

              <p className="text-center text-xs text-gray-400 font-semibold mt-8">
                Didn't receive it? <button className="text-[#1A1A1A] hover:underline font-extrabold cursor-pointer">Resend code</button>
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

