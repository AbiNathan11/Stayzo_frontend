"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, Users, Activity, FileBarChart2, ShieldAlert, 
  FileText, MessageSquare, Check, X, Search, Filter, LogOut, 
  Trash2, AlertTriangle, TrendingUp, TrendingDown, Globe, 
  CheckCircle2, AlertCircle, ShieldCheck, Mail, Calendar, Info
} from 'lucide-react';

// Custom type definitions
interface Listing {
  id: number;
  name: string;
  ownerName: string;
  ownerEmail: string;
  price: number;
  category: 'Rent' | 'Selling';
  date: string;
  status: 'Active' | 'Deactivated' | 'Sold' | 'Rented';
}

interface UserAccount {
  id: number;
  name: string;
  email: string;
  role: 'Tenant' | 'Landlord';
  status: 'Active' | 'Suspended';
  verified: boolean;
  joinedDate: string;
}

interface ActivityLog {
  id: number;
  message: string;
  type: 'Info' | 'Success' | 'Warning' | 'Alert';
  user: string;
  time: string;
}

interface FlaggedListing {
  id: number;
  title: string;
  landlord: string;
  reason: string;
  reporter: string;
  severity: 'High' | 'Medium' | 'Low';
}

interface Dispute {
  id: number;
  title: string;
  propertyName: string;
  tenantName: string;
  landlordName: string;
  claimAmount: number;
  status: 'Open' | 'Resolved (Tenant)' | 'Resolved (Landlord)';
}

interface Review {
  id: number;
  user: string;
  rating: number;
  content: string;
  flagReason: string;
  status: 'Flagged' | 'Approved' | 'Deleted';
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'activities' | 'reports' | 'fraud' | 'agreements' | 'reviews'>('overview');
  const [adminUser, setAdminUser] = useState<{ firstName: string; lastName: string; email: string } | null>(null);

  // Search & Filter States
  const [listingSearch, setListingSearch] = useState('');
  const [listingFilter, setListingFilter] = useState<'All' | 'Rent' | 'Selling'>('All');
  const [listingPage, setListingPage] = useState(1);

  const [userSearch, setUserSearch] = useState('');
  const [userFilter, setUserFilter] = useState<'All' | 'Tenant' | 'Landlord'>('All');

  const [activityFilter, setActivityFilter] = useState<'All' | 'Info' | 'Success' | 'Warning' | 'Alert'>('All');

  // --- DYNAMIC STATE FOR INTERACTION ---
  
  // 1. Listings State (Boston Listings)
  const [listings, setListings] = useState<Listing[]>([
    { id: 1, name: "46 Haunting St, Somerville", ownerName: "Zia Siddiki", ownerEmail: "siddikia11@gmail.com", price: 505899, category: "Selling", date: "Jan 04 2025", status: "Active" },
    { id: 2, name: "3940 N 16th St", ownerName: "Flores, Juanita", ownerEmail: "nevaeh@gmail.com", price: 3999, category: "Rent", date: "Jan 03 2025", status: "Deactivated" },
    { id: 3, name: "6141 Irving St", ownerName: "Miles, Esther", ownerEmail: "jackson@gmail.com", price: 200500, category: "Selling", date: "Jan 02 2025", status: "Sold" },
    { id: 4, name: "221 E Ontario St", ownerName: "Nguyen, Shane", ownerEmail: "georgia@gmail.com", price: 2430, category: "Rent", date: "Jan 01 2025", status: "Rented" },
    { id: 5, name: "Ahlers & Ogletree Villa", ownerName: "Aberam Perera", ownerEmail: "aberam@stayzo.com", price: 2695, category: "Rent", date: "Dec 28 2024", status: "Active" },
    { id: 6, name: "Villa Tropical Cana", ownerName: "Abiramy Selva", ownerEmail: "abiramy@stayzo.com", price: 3300, category: "Rent", date: "Dec 25 2024", status: "Active" },
    { id: 7, name: "Kandy Lakeview Mansion", ownerName: "Anura Bandara", ownerEmail: "anura@lakeview.com", price: 850000, category: "Selling", date: "Dec 20 2024", status: "Active" },
    { id: 8, name: "Colombo Heights Suite", ownerName: "Nimal Siri", ownerEmail: "nimal@colombo.com", price: 4200, category: "Rent", date: "Dec 18 2024", status: "Rented" }
  ]);

  // 2. User Accounts State
  const [users, setUsers] = useState<UserAccount[]>([
    { id: 1, name: "Abiramy Selva", email: "abiramy@example.com", role: "Tenant", status: "Active", verified: true, joinedDate: "Sep 12 2024" },
    { id: 2, name: "Nimal Bandara", email: "nimal@example.com", role: "Landlord", status: "Active", verified: true, joinedDate: "Oct 01 2024" },
    { id: 3, name: "Anura Perera", email: "anura@example.com", role: "Landlord", status: "Active", verified: false, joinedDate: "Nov 15 2024" },
    { id: 4, name: "Jane Doe", email: "jane@example.com", role: "Tenant", status: "Active", verified: true, joinedDate: "Jan 10 2025" },
    { id: 5, name: "John Smith", email: "john@example.com", role: "Tenant", status: "Suspended", verified: false, joinedDate: "Feb 22 2025" },
    { id: 6, name: "Aberam Krish", email: "aberam@example.com", role: "Landlord", status: "Active", verified: true, joinedDate: "Mar 05 2025" },
    { id: 7, name: "Vishnnu Dev", email: "vishnnu@example.com", role: "Landlord", status: "Active", verified: false, joinedDate: "Apr 18 2025" }
  ]);

  // 3. System Activities State
  const [activities, setActivities] = useState<ActivityLog[]>([
    { id: 1, message: "New tenant registered successfully: jane@example.com", type: "Info", user: "System", time: "2 mins ago" },
    { id: 2, message: "Security Warning: 5 failed login attempts for account landlord@stayzo.com", type: "Warning", user: "AuthGate", time: "15 mins ago" },
    { id: 3, message: "Platform Alert: Flagged listing 'Luxury Penthouse in Colombo' was reported", type: "Alert", user: "ModeratorBot", time: "42 mins ago" },
    { id: 4, message: "New property listed: 'Kandy Lakeview Mansion' ($850,000)", type: "Success", user: "Anura Bandara", time: "1 hour ago" },
    { id: 5, message: "Digital rental lease agreement signed between Nimal Bandara and Abiramy Selva", type: "Success", user: "AgreementService", time: "3 hours ago" },
    { id: 6, message: "User dispute registered for listing 'Colombo Heights Suite'", type: "Alert", user: "DisputeCenter", time: "5 hours ago" },
    { id: 7, message: "Scheduled database synchronization completed successfully", type: "Success", user: "CronJobManager", time: "8 hours ago" },
    { id: 8, message: "Review deleted: Spam rating by user 'troll_99'", type: "Info", user: "Admin", time: "1 day ago" }
  ]);

  // 4. Flagged Listings State (Fraud Prevention)
  const [flaggedListings, setFlaggedListings] = useState<FlaggedListing[]>([
    { id: 1, title: "Luxury Penthouse in Colombo", landlord: "Fake Owner Inc", reason: "Uses plagiarized stock pictures from an overseas hotel.", reporter: "nimal@example.com", severity: "High" },
    { id: 2, title: "Beachfront Bungalow Hikkaduwa", landlord: "Scam Lord", reason: "Landlord demanding $2,000 direct bank transfer before any physical viewing.", reporter: "priya@example.com", severity: "High" },
    { id: 3, title: "Cozy Studio near University", landlord: "Quick Rents Ltd", reason: "Inaccurate location coordinates. Property is actually 5km away.", reporter: "student_98@gmail.com", severity: "Medium" }
  ]);

  // 5. Disputes State
  const [disputes, setDisputes] = useState<Dispute[]>([
    { id: 1, title: "Security Deposit Refund Dispute", propertyName: "Colombo Heights Suite", tenantName: "Abiramy Selva", landlordName: "Nimal Bandara", claimAmount: 1200, status: "Open" },
    { id: 2, title: "Undisclosed Maintenance Damages Claim", propertyName: "Kandy Lakeview Villa", tenantName: "Jane Doe", landlordName: "Anura Perera", claimAmount: 850, status: "Open" },
    { id: 3, title: "Key Access Handover Delays", propertyName: "Ahlers & Ogletree Villa", tenantName: "Sarah M.", landlordName: "Aberam Perera", claimAmount: 350, status: "Resolved (Tenant)" }
  ]);

  // 6. Ratings & Reviews State
  const [reviews, setReviews] = useState<Review[]>([
    { id: 1, user: "troll_99", rating: 1, content: "THIS PLACE IS A SCAM!! The landlord stole my money and my wallet. DO NOT RENT!!!", flagReason: "Libelous/Abusive Language", status: "Flagged" },
    { id: 2, user: "crypto_spammer", rating: 5, content: "Earn $500/day working from home! Click this secure link: bit.ly/spam-crypto-stayzo", flagReason: "Commercial Spam Link", status: "Flagged" },
    { id: 3, user: "jane_doe", rating: 3, content: "Average stay. The hot water unit was broken for the first three days, but the host eventually resolved it.", flagReason: "Inappropriate review (Flagged by owner)", status: "Flagged" }
  ]);

  useEffect(() => {
    const token = localStorage.getItem('stayzo_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setAdminUser({
          firstName: payload.firstName || 'Administrator',
          lastName: payload.lastName || '',
          email: payload.email || 'admin@stayzo.com'
        });
      } catch (e) {
        console.error('Failed to parse admin token', e);
        setAdminUser({ firstName: 'Admin', lastName: '', email: 'admin@stayzo.com' });
      }
    } else {
      setAdminUser({ firstName: 'Admin', lastName: 'User', email: 'admin@stayzo.com' });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('stayzo_token');
    window.location.href = '/';
  };

  // --- ACTIONS ---

  // User Actions
  const toggleVerifyUser = (id: number) => {
    setUsers(users.map(u => u.id === id ? { ...u, verified: !u.verified } : u));
  };

  const toggleSuspendUser = (id: number) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u));
  };

  // Fraud / Listing Actions
  const handleApproveListing = (id: number) => {
    setFlaggedListings(flaggedListings.filter(f => f.id !== id));
  };

  const handleTakedownListing = (id: number, title: string) => {
    setFlaggedListings(flaggedListings.filter(f => f.id !== id));
    // Remove from the master listings as well
    setListings(listings.filter(l => l.name !== title));
    // Log activity
    setActivities([
      { id: Date.now(), message: `Admin deleted and took down flagged fraudulent listing: "${title}"`, type: "Alert", user: "Admin", time: "Just now" },
      ...activities
    ]);
  };

  // Dispute Actions
  const handleResolveDispute = (id: number, outcome: 'Tenant' | 'Landlord') => {
    setDisputes(disputes.map(d => d.id === id ? { ...d, status: outcome === 'Tenant' ? 'Resolved (Tenant)' : 'Resolved (Landlord)' } : d));
  };

  // Review Actions
  const handleApproveReview = (id: number) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, status: 'Approved' } : r));
  };

  const handleDeleteReview = (id: number) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, status: 'Deleted' } : r));
  };

  // --- FILTERED COMPUTATIONS ---

  // Filter listings
  const filteredListings = listings.filter(l => {
    const matchesSearch = l.name.toLowerCase().includes(listingSearch.toLowerCase()) || 
                          l.ownerName.toLowerCase().includes(listingSearch.toLowerCase()) ||
                          l.ownerEmail.toLowerCase().includes(listingSearch.toLowerCase());
    const matchesCategory = listingFilter === 'All' || l.category === listingFilter;
    return matchesSearch && matchesCategory;
  });

  const PAGINATION_LIMIT = 4;
  const paginatedListings = filteredListings.slice((listingPage - 1) * PAGINATION_LIMIT, listingPage * PAGINATION_LIMIT);
  const totalPages = Math.ceil(filteredListings.length / PAGINATION_LIMIT);

  // Filter users
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
                          u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userFilter === 'All' || u.role === userFilter;
    return matchesSearch && matchesRole;
  });

  // Filter activities
  const filteredActivities = activities.filter(a => {
    return activityFilter === 'All' || a.type === activityFilter;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFB] text-[#1A1A1A] font-sans selection:bg-[#1A1A1A] selection:text-white flex">
      
      {/* SIDEBAR: Premium layout matching DashIQ & Boston mockups */}
      <aside className="w-[280px] bg-white border-r border-gray-100 flex flex-col shrink-0">
        
        {/* Brand Header */}
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="flex items-end space-x-1 h-5">
              <div className="w-[3px] h-3 bg-[#1A1A1A] rounded-full"></div>
              <div className="w-[3px] h-5 bg-[#1A1A1A] rounded-full"></div>
              <div className="w-[3px] h-4 bg-[#1A1A1A] rounded-full"></div>
              <div className="w-[3px] h-2.5 bg-[#1A1A1A] rounded-full"></div>
            </div>
            <span className="text-xl font-bold tracking-tight text-[#1A1A1A]">Stayzo</span>
            <span className="bg-[#1A1A1A] text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ml-1 tracking-wider">Admin</span>
          </Link>
        </div>

        {/* Menu Sections */}
        <div className="flex-1 px-4 py-8 overflow-y-auto space-y-8 select-none">
          <div>
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest px-4 block mb-4">Core Panel</span>
            <nav className="space-y-1">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-2xl text-xs font-extrabold transition text-left cursor-pointer ${
                  activeTab === 'overview' ? 'bg-[#1A1A1A] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                <span>Overview Dashboard</span>
              </button>

              <button 
                onClick={() => setActiveTab('users')}
                className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-2xl text-xs font-extrabold transition text-left cursor-pointer ${
                  activeTab === 'users' ? 'bg-[#1A1A1A] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Users className="w-4 h-4 shrink-0" />
                <span>User Accounts</span>
              </button>
            </nav>
          </div>

          <div>
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest px-4 block mb-4">Security & Quality</span>
            <nav className="space-y-1">
              <button 
                onClick={() => setActiveTab('activities')}
                className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-2xl text-xs font-extrabold transition text-left cursor-pointer ${
                  activeTab === 'activities' ? 'bg-[#1A1A1A] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Activity className="w-4 h-4 shrink-0" />
                <span>Activity Monitor</span>
              </button>

              <button 
                onClick={() => setActiveTab('fraud')}
                className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-2xl text-xs font-extrabold transition text-left cursor-pointer ${
                  activeTab === 'fraud' ? 'bg-[#1A1A1A] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>Fraud & Moderation</span>
                {flaggedListings.length > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                    {flaggedListings.length}
                  </span>
                )}
              </button>

              <button 
                onClick={() => setActiveTab('reviews')}
                className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-2xl text-xs font-extrabold transition text-left cursor-pointer ${
                  activeTab === 'reviews' ? 'bg-[#1A1A1A] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span>Ratings & Reviews</span>
                {reviews.filter(r => r.status === 'Flagged').length > 0 && (
                  <span className="ml-auto bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                    {reviews.filter(r => r.status === 'Flagged').length}
                  </span>
                )}
              </button>
            </nav>
          </div>

          <div>
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest px-4 block mb-4">Operations & Data</span>
            <nav className="space-y-1">
              <button 
                onClick={() => setActiveTab('agreements')}
                className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-2xl text-xs font-extrabold transition text-left cursor-pointer ${
                  activeTab === 'agreements' ? 'bg-[#1A1A1A] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <FileText className="w-4 h-4 shrink-0" />
                <span>Agreements & Disputes</span>
                {disputes.filter(d => d.status === 'Open').length > 0 && (
                  <span className="ml-auto bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                    {disputes.filter(d => d.status === 'Open').length}
                  </span>
                )}
              </button>

              <button 
                onClick={() => setActiveTab('reports')}
                className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-2xl text-xs font-extrabold transition text-left cursor-pointer ${
                  activeTab === 'reports' ? 'bg-[#1A1A1A] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <FileBarChart2 className="w-4 h-4 shrink-0" />
                <span>Demand & Analytics</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Sidebar Footer with Logout */}
        <div className="p-6 border-t border-gray-50">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3.5 px-4 py-3 rounded-2xl text-xs font-extrabold text-red-500 hover:bg-red-50 transition text-left cursor-pointer select-none"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Logout Administrator</span>
          </button>
        </div>

      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* HEADER: Clean bar matching the DashIQ mockup */}
        <header className="h-20 bg-white border-b border-gray-100 px-8 flex justify-between items-center z-45 shrink-0 select-none">
          
          {/* Breadcrumbs / Page Title */}
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-gray-900 capitalize">
              {activeTab === 'overview' ? 'Platform Overview' : `${activeTab} Management`}
            </h1>
            <p className="text-gray-400 text-[10px] font-extrabold uppercase tracking-wider mt-0.5">
              Stayzo Control Terminal &bull; Live Status
            </p>
          </div>

          {/* Profile & Notifications */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-xs font-extrabold text-gray-900">{adminUser?.firstName} {adminUser?.lastName}</p>
                <p className="text-[10px] font-bold text-gray-400">{adminUser?.email}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#1A1A1A] text-white border border-gray-100 shadow-sm flex items-center justify-center font-extrabold text-sm select-none">
                {adminUser?.firstName?.charAt(0).toUpperCase() || 'A'}
              </div>
            </div>
          </div>

        </header>

        {/* WORKSPACE AREA */}
        <main className="flex-1 overflow-y-auto p-8 max-w-7xl w-full mx-auto space-y-8">
          
          {/* TAB 1: OVERVIEW (Combined Boston Theme layout) */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              {/* Metric Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* 1. Total Revenue */}
                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition duration-300 flex items-start justify-between">
                  <div className="space-y-3">
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Total Revenue</span>
                    <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">$124,500</h3>
                    <div className="flex items-center text-emerald-600 text-xs font-bold space-x-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>+12.43%</span>
                      <span className="text-gray-400 font-semibold text-[10px] ml-1">vs last month</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
                    <Globe className="w-5 h-5" />
                  </div>
                </div>

                {/* 2. Property Rent */}
                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition duration-300 flex items-start justify-between">
                  <div className="space-y-3">
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Properties for Rent</span>
                    <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">{listings.filter(l => l.category === 'Rent').length}</h3>
                    <div className="flex items-center text-red-500 text-xs font-bold space-x-1">
                      <TrendingDown className="w-3.5 h-3.5" />
                      <span>-2.43%</span>
                      <span className="text-gray-400 font-semibold text-[10px] ml-1">vs last month</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                    <FileText className="w-5 h-5" />
                  </div>
                </div>

                {/* 3. Property Sale */}
                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition duration-300 flex items-start justify-between">
                  <div className="space-y-3">
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Properties for Sale</span>
                    <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">{listings.filter(l => l.category === 'Selling').length}</h3>
                    <div className="flex items-center text-emerald-600 text-xs font-bold space-x-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>+10.23%</span>
                      <span className="text-gray-400 font-semibold text-[10px] ml-1">vs last month</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                    <FileBarChart2 className="w-5 h-5" />
                  </div>
                </div>

                {/* 4. Available Properties */}
                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition duration-300 flex items-start justify-between">
                  <div className="space-y-3">
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Available Properties</span>
                    <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">{listings.filter(l => l.status === 'Active').length}</h3>
                    <div className="flex items-center text-emerald-600 text-xs font-bold space-x-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>+5.34%</span>
                      <span className="text-gray-400 font-semibold text-[10px] ml-1">vs last month</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                    <Users className="w-5 h-5" />
                  </div>
                </div>

              </div>

              {/* Graphics Row: Revenue Dynamic SVGs + Worldwide Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Revenue SVG Chart Card */}
                <div className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm lg:col-span-2 space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                    <div>
                      <h4 className="font-extrabold text-sm text-gray-900">Revenue Analytics</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Dynamic monthly sales & rentals</p>
                    </div>
                    <select className="bg-gray-50 text-[10px] font-extrabold uppercase px-3 py-1.5 border-none rounded-xl outline-none focus:ring-1 focus:ring-[#1A1A1A] cursor-pointer text-gray-600">
                      <option>Last 12 Months</option>
                      <option>Last 30 Days</option>
                    </select>
                  </div>

                  {/* SVG Vertical Bar Chart representation of Boston Dashboard mockup */}
                  <div className="relative w-full h-[240px]">
                    <svg viewBox="0 0 700 240" className="w-full h-full">
                      {/* Grid Lines */}
                      <line x1="40" y1="30" x2="680" y2="30" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="40" y1="80" x2="680" y2="80" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="40" y1="130" x2="680" y2="130" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="40" y1="180" x2="680" y2="180" stroke="#F1F5F9" strokeWidth="1" />

                      {/* Y-Axis Labels */}
                      <text x="30" y="35" textAnchor="end" className="text-[10px] font-extrabold fill-gray-400">100%</text>
                      <text x="30" y="85" textAnchor="end" className="text-[10px] font-extrabold fill-gray-400">75%</text>
                      <text x="30" y="135" textAnchor="end" className="text-[10px] font-extrabold fill-gray-400">50%</text>
                      <text x="30" y="185" textAnchor="end" className="text-[10px] font-extrabold fill-gray-400">25%</text>

                      {/* Diagonal Fill definition for standard bars (Boston style) */}
                      <defs>
                        <pattern id="diagonalHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                          <line x1="0" y1="0" x2="0" y2="8" stroke="#0F9F90" strokeWidth="2.5" opacity="0.35" />
                        </pattern>
                      </defs>

                      {/* Bar groups (Months: Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec, Jan, Feb, Mar) */}
                      {/* Apr */}
                      <rect x="60" y="100" width="30" height="80" fill="url(#diagonalHatch)" rx="2" stroke="#0F9F90" strokeWidth="1.5" />
                      <text x="75" y="202" textAnchor="middle" className="text-[9px] font-extrabold fill-gray-400">Apr</text>

                      {/* May */}
                      <rect x="110" y="65" width="30" height="115" fill="url(#diagonalHatch)" rx="2" stroke="#0F9F90" strokeWidth="1.5" />
                      <text x="125" y="202" textAnchor="middle" className="text-[9px] font-extrabold fill-gray-400">May</text>

                      {/* Jun */}
                      <rect x="160" y="120" width="30" height="60" fill="url(#diagonalHatch)" rx="2" stroke="#0F9F90" strokeWidth="1.5" />
                      <text x="175" y="202" textAnchor="middle" className="text-[9px] font-extrabold fill-gray-400">Jun</text>

                      {/* Jul */}
                      <rect x="210" y="130" width="30" height="50" fill="url(#diagonalHatch)" rx="2" stroke="#0F9F90" strokeWidth="1.5" />
                      <text x="225" y="202" textAnchor="middle" className="text-[9px] font-extrabold fill-gray-400">Jul</text>

                      {/* Aug */}
                      <rect x="260" y="105" width="30" height="75" fill="url(#diagonalHatch)" rx="2" stroke="#0F9F90" strokeWidth="1.5" />
                      <text x="275" y="202" textAnchor="middle" className="text-[9px] font-extrabold fill-gray-400">Aug</text>

                      {/* Sep */}
                      <rect x="310" y="115" width="30" height="65" fill="url(#diagonalHatch)" rx="2" stroke="#0F9F90" strokeWidth="1.5" />
                      <text x="325" y="202" textAnchor="middle" className="text-[9px] font-extrabold fill-gray-400">Sep</text>

                      {/* Oct */}
                      <rect x="360" y="70" width="30" height="110" fill="url(#diagonalHatch)" rx="2" stroke="#0F9F90" strokeWidth="1.5" />
                      <text x="375" y="202" textAnchor="middle" className="text-[9px] font-extrabold fill-gray-400">Oct</text>

                      {/* Nov - HIGHLIGHTED MONTH (Boston Theme Style: Solid Fill) */}
                      <rect x="410" y="35" width="30" height="145" fill="#0F9F90" rx="3" stroke="#0D8A7D" strokeWidth="1" />
                      <text x="425" y="202" textAnchor="middle" className="text-[9px] font-extrabold fill-gray-900">Nov</text>

                      {/* Dec */}
                      <rect x="460" y="140" width="30" height="40" fill="url(#diagonalHatch)" rx="2" stroke="#0F9F90" strokeWidth="1.5" />
                      <text x="475" y="202" textAnchor="middle" className="text-[9px] font-extrabold fill-gray-400">Dec</text>

                      {/* Jan */}
                      <rect x="510" y="110" width="30" height="70" fill="url(#diagonalHatch)" rx="2" stroke="#0F9F90" strokeWidth="1.5" />
                      <text x="525" y="202" textAnchor="middle" className="text-[9px] font-extrabold fill-gray-400">Jan</text>

                      {/* Feb */}
                      <rect x="560" y="75" width="30" height="105" fill="url(#diagonalHatch)" rx="2" stroke="#0F9F90" strokeWidth="1.5" />
                      <text x="575" y="202" textAnchor="middle" className="text-[9px] font-extrabold fill-gray-400">Feb</text>

                      {/* Mar */}
                      <rect x="610" y="90" width="30" height="90" fill="url(#diagonalHatch)" rx="2" stroke="#0F9F90" strokeWidth="1.5" />
                      <text x="625" y="202" textAnchor="middle" className="text-[9px] font-extrabold fill-gray-400">Mar</text>
                    </svg>
                  </div>
                </div>

                {/* Worldwide Customers Card */}
                <div className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm space-y-5 flex flex-col justify-between">
                  <div className="pb-2 border-b border-gray-50 shrink-0">
                    <h4 className="font-extrabold text-sm text-gray-900">Geographic Traffic</h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Top visitor markets</p>
                  </div>

                  {/* Clean SVG Abstract Map Representation */}
                  <div className="flex-1 flex items-center justify-center p-2 min-h-[140px]">
                    <svg viewBox="0 0 200 100" className="w-full max-w-[180px] h-auto opacity-75">
                      {/* Continent blobs (abstract shapes) */}
                      <path d="M20,30 Q40,20 60,35 Q80,25 70,50 Q60,70 30,65 Q10,50 20,30 Z" fill="#E2E8F0" />
                      <path d="M100,20 Q130,10 160,25 Q180,45 150,60 Q120,70 95,50 Q85,30 100,20 Z" fill="#CBD5E1" />
                      <path d="M110,65 Q125,55 140,65 Q150,85 130,90 Q110,85 110,65 Z" fill="#94A3B8" />
                      
                      {/* Interactive pins */}
                      <circle cx="50" cy="35" r="4.5" fill="#0F9F90" className="animate-pulse" />
                      <circle cx="130" cy="35" r="4.5" fill="#E05A16" className="animate-pulse" />
                      <circle cx="125" cy="70" r="4.5" fill="#F59E0B" className="animate-pulse" />
                    </svg>
                  </div>

                  {/* Legend list matching the Boston layout */}
                  <div className="space-y-2 shrink-0">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 bg-[#0F9F90] rounded-full"></span>
                        <span className="text-gray-500">United States</span>
                      </div>
                      <span className="text-gray-900">45% <span className="text-emerald-500 font-bold ml-1 text-[10px]">&uarr;</span></span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-bold">
                      <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 bg-[#E05A16] rounded-full"></span>
                        <span className="text-gray-500">Europe</span>
                      </div>
                      <span className="text-gray-900">35% <span className="text-red-500 font-bold ml-1 text-[10px]">&darr;</span></span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-bold">
                      <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 bg-[#F59E0B] rounded-full"></span>
                        <span className="text-gray-500">Asia & Others</span>
                      </div>
                      <span className="text-gray-900">20% <span className="text-emerald-500 font-bold ml-1 text-[10px]">&uarr;</span></span>
                    </div>
                  </div>

                </div>

              </div>

              {/* Boston Listings Table Section */}
              <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm space-y-6 p-6">
                
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gray-50 pb-5">
                  <div>
                    <h4 className="font-extrabold text-sm text-gray-900">Property Listings Queue</h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Search and manage platform properties</p>
                  </div>

                  {/* Controls */}
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Search Input */}
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Search properties..." 
                        value={listingSearch}
                        onChange={(e) => { setListingSearch(e.target.value); setListingPage(1); }}
                        className="bg-[#F8FAFB] text-xs font-bold text-gray-700 pl-9 pr-4 py-2 w-48 rounded-xl outline-none focus:ring-1 focus:ring-[#1A1A1A] border-none"
                      />
                      <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3.5 top-2.5" />
                    </div>

                    {/* Filter Tabs */}
                    <div className="bg-[#F8FAFB] p-1 rounded-xl flex items-center space-x-1 border-none text-[10px] font-extrabold uppercase select-none">
                      <button 
                        onClick={() => { setListingFilter('All'); setListingPage(1); }}
                        className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                          listingFilter === 'All' ? 'bg-[#1A1A1A] text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
                        }`}
                      >
                        All
                      </button>
                      <button 
                        onClick={() => { setListingFilter('Rent'); setListingPage(1); }}
                        className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                          listingFilter === 'Rent' ? 'bg-[#1A1A1A] text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
                        }`}
                      >
                        Rent
                      </button>
                      <button 
                        onClick={() => { setListingFilter('Selling'); setListingPage(1); }}
                        className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                          listingFilter === 'Selling' ? 'bg-[#1A1A1A] text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
                        }`}
                      >
                        Selling
                      </button>
                    </div>
                  </div>
                </div>

                {/* Table Layout */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs font-bold">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-widest text-[9px]">
                        <th className="py-4 px-4">Name</th>
                        <th className="py-4 px-4">Owner Info</th>
                        <th className="py-4 px-4">Property Price</th>
                        <th className="py-4 px-4">Category</th>
                        <th className="py-4 px-4">Listed Date</th>
                        <th className="py-4 px-4">Status</th>
                        <th className="py-4 px-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {paginatedListings.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-12 text-gray-400 font-semibold">
                            No listings found matching the criteria.
                          </td>
                        </tr>
                      ) : (
                        paginatedListings.map((listing) => (
                          <tr key={listing.id} className="hover:bg-[#F8FAFB]/40 transition group">
                            {/* Name */}
                            <td className="py-4 px-4">
                              <p className="text-gray-950 font-extrabold text-sm">{listing.name}</p>
                              <p className="text-gray-400 text-[9px] font-semibold mt-0.5">ID: #{1547830 + listing.id}</p>
                            </td>

                            {/* Owner Info */}
                            <td className="py-4 px-4">
                              <p className="text-gray-800 font-bold">{listing.ownerName}</p>
                              <p className="text-gray-400 font-semibold text-[10px] mt-0.5">{listing.ownerEmail}</p>
                            </td>

                            {/* Price */}
                            <td className="py-4 px-4 font-extrabold text-gray-950 text-sm">
                              {listing.category === 'Rent' 
                                ? `$${listing.price.toLocaleString()}/mo` 
                                : `$${listing.price.toLocaleString()}`}
                            </td>

                            {/* Category */}
                            <td className="py-4 px-4">
                              <span className={`px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase ${
                                listing.category === 'Rent'
                                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                  : 'bg-blue-50 text-blue-600 border border-blue-100'
                              }`}>
                                {listing.category}
                              </span>
                            </td>

                            {/* Date */}
                            <td className="py-4 px-4 text-gray-400 font-semibold">
                              {listing.date}
                            </td>

                            {/* Status */}
                            <td className="py-4 px-4">
                              <span className={`flex items-center space-x-1.5 text-[10px] font-bold ${
                                listing.status === 'Active' ? 'text-emerald-600' :
                                listing.status === 'Deactivated' ? 'text-gray-400' :
                                listing.status === 'Sold' ? 'text-blue-500' : 'text-amber-500'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  listing.status === 'Active' ? 'bg-emerald-500' :
                                  listing.status === 'Deactivated' ? 'bg-gray-400' :
                                  listing.status === 'Sold' ? 'bg-blue-500' : 'bg-amber-500'
                                }`}></span>
                                <span>{listing.status}</span>
                              </span>
                            </td>

                            {/* Action to delete */}
                            <td className="py-4 px-4 text-center">
                              <button 
                                onClick={() => handleTakedownListing(listing.id, listing.name)}
                                className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-xl transition cursor-pointer"
                                title="Remove Listing"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>

                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-between items-center pt-4 border-t border-gray-50 text-xs select-none">
                    <button 
                      onClick={() => setListingPage(p => Math.max(1, p - 1))}
                      disabled={listingPage === 1}
                      className="border border-gray-200 rounded-xl px-4 py-2 hover:bg-[#F8FAFB] transition text-gray-500 disabled:opacity-40 disabled:hover:bg-transparent font-extrabold cursor-pointer"
                    >
                      &larr; Prev
                    </button>
                    <span className="text-gray-400 font-semibold">
                      Page <span className="font-extrabold text-gray-900">{listingPage}</span> of <span className="font-extrabold text-gray-900">{totalPages}</span>
                    </span>
                    <button 
                      onClick={() => setListingPage(p => Math.min(totalPages, p + 1))}
                      disabled={listingPage === totalPages}
                      className="border border-gray-200 rounded-xl px-4 py-2 hover:bg-[#F8FAFB] transition text-gray-500 disabled:opacity-40 disabled:hover:bg-transparent font-extrabold cursor-pointer"
                    >
                      Next &rarr;
                    </button>
                  </div>
                )}

              </div>

            </div>
          )}

          {/* TAB 2: USER ACCOUNTS (Role 1: Manage and verify users) */}
          {activeTab === 'users' && (
            <div className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm space-y-6 animate-in fade-in duration-300">
              
              {/* Header and Controls */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gray-50 pb-5">
                <div>
                  <h3 className="font-extrabold text-base text-gray-900">User Directory</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Verify, suspend, and audit platform accounts</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Search */}
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Search users..." 
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="bg-[#F8FAFB] text-xs font-bold text-gray-700 pl-9 pr-4 py-2 w-48 rounded-xl outline-none focus:ring-1 focus:ring-[#1A1A1A] border-none"
                    />
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3.5 top-2.5" />
                  </div>

                  {/* Filter by Role */}
                  <div className="bg-[#F8FAFB] p-1 rounded-xl flex items-center space-x-1 border-none text-[10px] font-extrabold uppercase select-none">
                    <button 
                      onClick={() => setUserFilter('All')}
                      className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                        userFilter === 'All' ? 'bg-[#1A1A1A] text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      All Roles
                    </button>
                    <button 
                      onClick={() => setUserFilter('Tenant')}
                      className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                        userFilter === 'Tenant' ? 'bg-[#1A1A1A] text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      Tenants
                    </button>
                    <button 
                      onClick={() => setUserFilter('Landlord')}
                      className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                        userFilter === 'Landlord' ? 'bg-[#1A1A1A] text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      Landlords
                    </button>
                  </div>
                </div>
              </div>

              {/* Users Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredUsers.length === 0 ? (
                  <div className="col-span-full text-center py-12 text-gray-400 font-semibold">
                    No user accounts found matching your search.
                  </div>
                ) : (
                  filteredUsers.map((account) => (
                    <div 
                      key={account.id} 
                      className={`border rounded-3xl p-6 transition flex flex-col justify-between space-y-4 hover:shadow-md ${
                        account.status === 'Suspended' 
                          ? 'bg-red-50/20 border-red-100' 
                          : 'bg-white border-gray-100'
                      }`}
                    >
                      {/* Top Info */}
                      <div className="space-y-3.5">
                        <div className="flex justify-between items-start">
                          <div className="w-10 h-10 rounded-2xl bg-[#1A1A1A]/5 border border-gray-100 flex items-center justify-center font-extrabold text-sm select-none">
                            {account.name.charAt(0)}
                          </div>
                          <div className="flex space-x-1.5">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                              account.role === 'Landlord' 
                                ? 'bg-purple-50 text-purple-600 border border-purple-100' 
                                : 'bg-blue-50 text-blue-600 border border-blue-100'
                            }`}>
                              {account.role}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                              account.status === 'Active' 
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                                : 'bg-red-50 text-red-600 border border-red-100'
                            }`}>
                              {account.status}
                            </span>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center space-x-1.5">
                            <h4 className="font-extrabold text-base text-gray-900 truncate leading-tight">{account.name}</h4>
                            {account.verified && (
                              <span title="Verified Professional">
                                <ShieldCheck className="w-4 h-4 text-emerald-500 fill-emerald-500/10 shrink-0" />
                              </span>
                            )}
                          </div>
                          <p className="text-gray-400 font-semibold text-xs mt-1 flex items-center space-x-1">
                            <Mail className="w-3.5 h-3.5 text-gray-300" />
                            <span className="truncate">{account.email}</span>
                          </p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-2 flex items-center space-x-1">
                            <Calendar className="w-3.5 h-3.5 text-gray-300" />
                            <span>Joined: {account.joinedDate}</span>
                          </p>
                        </div>
                      </div>

                      {/* Interactive Controls */}
                      <div className="pt-4 border-t border-gray-50 flex items-center justify-between gap-3 text-xs select-none">
                        {/* Verify Button */}
                        <button 
                          onClick={() => toggleVerifyUser(account.id)}
                          className={`flex-1 py-2 px-3.5 rounded-xl font-extrabold transition cursor-pointer border flex items-center justify-center space-x-1.5 ${
                            account.verified 
                              ? 'bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100' 
                              : 'bg-white border-gray-250 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>{account.verified ? 'Verified' : 'Verify Account'}</span>
                        </button>

                        {/* Suspend Button */}
                        <button 
                          onClick={() => toggleSuspendUser(account.id)}
                          className={`py-2 px-3.5 rounded-xl font-extrabold transition cursor-pointer border ${
                            account.status === 'Suspended' 
                              ? 'bg-red-500 border-red-500 text-white hover:bg-red-600' 
                              : 'bg-white border-red-200 text-red-500 hover:bg-red-50'
                          }`}
                        >
                          {account.status === 'Suspended' ? 'Unsuspend' : 'Suspend'}
                        </button>
                      </div>

                    </div>
                  ))
                )}
              </div>

            </div>
          )}

          {/* TAB 3: PLATFORM SECURITY EVENT LOGS (Role 2: Monitor system activities) */}
          {activeTab === 'activities' && (
            <div className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm space-y-6 animate-in fade-in duration-300">
              
              {/* Header and Controls */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gray-50 pb-5">
                <div>
                  <h3 className="font-extrabold text-base text-gray-900">System Activity Monitor</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Real-time platform operations security log</p>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mr-1">Priority:</span>
                  <div className="bg-[#F8FAFB] p-1 rounded-xl flex items-center space-x-1 border-none text-[10px] font-extrabold uppercase select-none">
                    {['All', 'Info', 'Success', 'Warning', 'Alert'].map((lvl) => (
                      <button 
                        key={lvl}
                        onClick={() => setActivityFilter(lvl as any)}
                        className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                          activityFilter === lvl ? 'bg-[#1A1A1A] text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Logs Feed */}
              <div className="divide-y divide-gray-50">
                {filteredActivities.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 font-semibold">
                    No matching activity logs in queue.
                  </div>
                ) : (
                  filteredActivities.map((log) => (
                    <div 
                      key={log.id} 
                      className={`py-4 flex items-start gap-4 transition-colors ${
                        log.type === 'Alert' ? 'bg-red-50/10' : 
                        log.type === 'Warning' ? 'bg-amber-50/10' : ''
                      }`}
                    >
                      {/* Icon */}
                      <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center ${
                        log.type === 'Info' ? 'bg-blue-50 text-blue-500' :
                        log.type === 'Success' ? 'bg-emerald-50 text-emerald-500' :
                        log.type === 'Warning' ? 'bg-amber-50 text-amber-500' : 'bg-red-50 text-red-500'
                      }`}>
                        {log.type === 'Info' && <Info className="w-4 h-4" />}
                        {log.type === 'Success' && <CheckCircle2 className="w-4 h-4" />}
                        {log.type === 'Warning' && <AlertTriangle className="w-4 h-4" />}
                        {log.type === 'Alert' && <AlertCircle className="w-4 h-4" />}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <p className="text-sm text-gray-800 font-bold leading-normal">{log.message}</p>
                          <span className="text-[10px] text-gray-400 font-semibold shrink-0">{log.time}</span>
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">
                          Source: <span className="text-gray-900 font-extrabold">{log.user}</span> &bull; Status: <span className={`font-extrabold ${
                            log.type === 'Info' ? 'text-blue-500' :
                            log.type === 'Success' ? 'text-emerald-500' :
                            log.type === 'Warning' ? 'text-amber-500' : 'text-red-500'
                          }`}>{log.type}</span>
                        </p>
                      </div>

                    </div>
                  ))
                )}
              </div>

            </div>
          )}

          {/* TAB 4: DEMAND & ANALYTICS (Role 3: Analyze reports, visit bookings, and system usage) */}
          {activeTab === 'reports' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              {/* Top Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                  <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-2">Total Visit Bookings</span>
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="text-3xl font-extrabold text-gray-900 leading-tight">2,504</h3>
                      <p className="text-emerald-500 text-xs font-bold flex items-center space-x-0.5 mt-1.5">
                        <span>&uarr; 15.6%</span>
                        <span className="text-gray-400 font-semibold text-[9px] ml-1">vs last quarter</span>
                      </p>
                    </div>
                    <span className="bg-emerald-50 text-emerald-600 rounded-xl p-3 text-sm font-extrabold">&bull; Active</span>
                  </div>
                </div>

                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                  <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-2">Average Response Latency</span>
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="text-3xl font-extrabold text-gray-900 leading-tight">1.2 hours</h3>
                      <p className="text-emerald-500 text-xs font-bold flex items-center space-x-0.5 mt-1.5">
                        <span>&uarr; 20.4% faster</span>
                        <span className="text-gray-400 font-semibold text-[9px] ml-1">vs last quarter</span>
                      </p>
                    </div>
                    <span className="bg-blue-50 text-blue-600 rounded-xl p-3 text-sm font-extrabold">&bull; Optimized</span>
                  </div>
                </div>

                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                  <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-2">Platform Agreement Rate</span>
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="text-3xl font-extrabold text-gray-900 leading-tight">88.4%</h3>
                      <p className="text-emerald-500 text-xs font-bold flex items-center space-x-0.5 mt-1.5">
                        <span>&uarr; +4.2%</span>
                        <span className="text-gray-400 font-semibold text-[9px] ml-1">conversion boost</span>
                      </p>
                    </div>
                    <span className="bg-purple-50 text-purple-600 rounded-xl p-3 text-sm font-extrabold">&bull; Premium</span>
                  </div>
                </div>

              </div>

              {/* Rich Analytics graphics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* 1. Property Demand by Region */}
                <div className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm space-y-4">
                  <div className="pb-2 border-b border-gray-50">
                    <h4 className="font-extrabold text-sm text-gray-900">Regional Property Demand</h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Search demand index by city area</p>
                  </div>

                  <div className="h-[220px] flex items-end justify-between px-2 pt-6">
                    {[
                      { city: "Colombo", percentage: 85, color: "#1A1A1A" },
                      { city: "Kandy", percentage: 65, color: "#0F9F90" },
                      { city: "Galle", percentage: 48, color: "#E05A16" },
                      { city: "Hikkaduwa", percentage: 55, color: "#F59E0B" },
                      { city: "Negombo", percentage: 38, color: "#8B5CF6" }
                    ].map((item, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-3 flex-1">
                        <span className="text-[10px] font-extrabold text-gray-800">{item.percentage}%</span>
                        <div 
                          className="w-8 rounded-t-xl transition-all duration-500 hover:brightness-90"
                          style={{ height: `${item.percentage * 1.5}px`, backgroundColor: item.color }}
                        ></div>
                        <span className="text-[10px] font-bold text-gray-400 truncate w-full text-center">{item.city}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Platform Visits Bookings Tracker */}
                <div className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm space-y-4">
                  <div className="pb-2 border-b border-gray-50">
                    <h4 className="font-extrabold text-sm text-gray-900">Visit Bookings Conversion</h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Bookings made vs completion rates</p>
                  </div>

                  <div className="h-[220px] relative flex items-center justify-center p-4">
                    {/* SVG Line Chart simulation */}
                    <svg viewBox="0 0 400 180" className="w-full h-full">
                      {/* Grid lines */}
                      <line x1="20" y1="20" x2="380" y2="20" stroke="#F8FAFB" strokeWidth="1.5" />
                      <line x1="20" y1="70" x2="380" y2="70" stroke="#F8FAFB" strokeWidth="1.5" />
                      <line x1="20" y1="120" x2="380" y2="120" stroke="#F8FAFB" strokeWidth="1.5" />
                      <line x1="20" y1="170" x2="380" y2="170" stroke="#E2E8F0" strokeWidth="1.5" />

                      {/* Line paths */}
                      <path 
                        d="M20,130 Q80,70 140,90 T260,40 T380,60" 
                        fill="none" 
                        stroke="#1A1A1A" 
                        strokeWidth="3.5" 
                        strokeLinecap="round"
                      />
                      <path 
                        d="M20,150 Q80,110 140,120 T260,80 T380,95" 
                        fill="none" 
                        stroke="#0F9F90" 
                        strokeWidth="3" 
                        strokeLinecap="round"
                        strokeDasharray="4 4"
                      />

                      {/* Dots on line */}
                      <circle cx="140" cy="90" r="4.5" fill="#1A1A1A" />
                      <circle cx="260" cy="40" r="4.5" fill="#1A1A1A" />
                      <circle cx="380" cy="60" r="4.5" fill="#1A1A1A" />
                    </svg>
                  </div>

                  <div className="flex justify-center space-x-6 text-[10px] font-extrabold uppercase select-none text-gray-400 pb-2">
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 bg-[#1A1A1A] rounded-full"></span>
                      <span className="text-gray-900 font-extrabold">Bookings Requested</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 bg-[#0F9F90] rounded-full"></span>
                      <span className="text-[#0F9F90] font-extrabold">Bookings Signed</span>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* TAB 5: FRAUD & LISTING MODERATION (Role 4: Fraudulent listings prevention) */}
          {activeTab === 'fraud' && (
            <div className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm space-y-6 animate-in fade-in duration-300">
              
              <div>
                <h3 className="font-extrabold text-base text-gray-900">Fraud & Flagged Listings Queue</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Moderate flagged property posts and prevent fraudulent activity</p>
              </div>

              <div className="space-y-4">
                {flaggedListings.length === 0 ? (
                  <div className="bg-[#F8FAFB] border border-gray-100 rounded-3xl p-12 text-center space-y-4 max-w-xl mx-auto">
                    <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto" />
                    <h3 className="text-base font-extrabold text-gray-900">No flags in moderation queue</h3>
                    <p className="text-gray-400 text-xs font-semibold leading-relaxed">
                      Excellent work! There are no flagged or reported properties currently awaiting review. All current platform listings are fully verified.
                    </p>
                  </div>
                ) : (
                  flaggedListings.map((flag) => (
                    <div 
                      key={flag.id} 
                      className="border border-red-100 bg-red-50/10 rounded-[24px] p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition"
                    >
                      <div className="space-y-2 max-w-xl">
                        <div className="flex items-center space-x-2.5">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                            flag.severity === 'High' 
                              ? 'bg-red-500 text-white' 
                              : 'bg-amber-100 text-amber-600'
                          }`}>
                            {flag.severity} Priority
                          </span>
                          <h4 className="font-extrabold text-sm text-gray-950">{flag.title}</h4>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                          <strong className="text-gray-800">Reported Issue:</strong> {flag.reason}
                        </p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                          Owner: <span className="text-gray-700 font-extrabold">{flag.landlord}</span> &bull; Flagged by: <span className="text-gray-700 font-extrabold">{flag.reporter}</span>
                        </p>
                      </div>

                      {/* Admin Controls */}
                      <div className="flex items-center gap-2 text-xs select-none shrink-0 self-start md:self-center">
                        {/* Keep/Approve Button */}
                        <button 
                          onClick={() => handleApproveListing(flag.id)}
                          className="py-2.5 px-4 bg-white border border-gray-250 hover:bg-gray-50 text-gray-700 rounded-xl font-extrabold transition cursor-pointer"
                        >
                          Dismiss / Keep Post
                        </button>
                        
                        {/* Take Down Button */}
                        <button 
                          onClick={() => handleTakedownListing(flag.id, flag.title)}
                          className="py-2.5 px-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-extrabold transition shadow-sm cursor-pointer flex items-center space-x-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete & Take Down</span>
                        </button>
                      </div>

                    </div>
                  ))
                )}
              </div>

            </div>
          )}

          {/* TAB 6: AGREEMENTS & DISPUTES (Role 5: Digital agreements and disputes resolving) */}
          {activeTab === 'agreements' && (
            <div className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm space-y-6 animate-in fade-in duration-300">
              
              <div>
                <h3 className="font-extrabold text-base text-gray-900">Lease Agreements & Disputes Resolver</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Oversee binding lease contracts and resolve landlord-tenant disputes</p>
              </div>

              {/* Disputes List */}
              <div className="space-y-4">
                {disputes.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 font-semibold">
                    No active disputes found.
                  </div>
                ) : (
                  disputes.map((dispute) => (
                    <div 
                      key={dispute.id} 
                      className={`border rounded-[24px] p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition ${
                        dispute.status === 'Open' 
                          ? 'border-amber-100 bg-amber-50/10' 
                          : 'border-gray-100 bg-white'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2.5">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                            dispute.status === 'Open' 
                              ? 'bg-amber-500 text-white' 
                              : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          }`}>
                            {dispute.status}
                          </span>
                          <h4 className="font-extrabold text-sm text-gray-950">{dispute.title}</h4>
                        </div>
                        <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                          Property: <span className="text-gray-800 font-extrabold">{dispute.propertyName}</span> &bull; Claim Dispute Value: <span className="text-red-500 font-extrabold">${dispute.claimAmount.toLocaleString()}</span>
                        </p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                          Tenant: <span className="text-gray-700 font-extrabold">{dispute.tenantName}</span> &bull; Landlord: <span className="text-gray-700 font-extrabold">{dispute.landlordName}</span>
                        </p>
                      </div>

                      {/* Dispute controls */}
                      <div className="flex flex-wrap items-center gap-2 text-xs select-none shrink-0 self-start md:self-center">
                        {dispute.status === 'Open' ? (
                          <>
                            <button 
                              onClick={() => handleResolveDispute(dispute.id, 'Tenant')}
                              className="py-2 px-3 bg-white border border-[#1A1A1A] hover:bg-gray-50 text-[#1A1A1A] rounded-xl font-extrabold transition cursor-pointer"
                            >
                              Resolve for Tenant
                            </button>
                            <button 
                              onClick={() => handleResolveDispute(dispute.id, 'Landlord')}
                              className="py-2 px-3 bg-white border border-[#1A1A1A] hover:bg-gray-50 text-[#1A1A1A] rounded-xl font-extrabold transition cursor-pointer"
                            >
                              Resolve for Landlord
                            </button>
                            <button 
                              onClick={() => handleResolveDispute(dispute.id, 'Tenant')}
                              className="py-2 px-3 bg-[#1A1A1A] hover:bg-black text-white rounded-xl font-extrabold transition cursor-pointer"
                            >
                              Close Dispute
                            </button>
                          </>
                        ) : (
                          <div className="flex items-center text-emerald-600 font-extrabold text-xs space-x-1 py-2 px-4 rounded-xl bg-emerald-50 border border-emerald-100">
                            <Check className="w-4 h-4 shrink-0" />
                            <span>Resolved Case</span>
                          </div>
                        )}
                      </div>

                    </div>
                  ))
                )}
              </div>

            </div>
          )}

          {/* TAB 7: RATINGS & REVIEWS (Role 6: Moderate ratings and reviews for spam or abuse) */}
          {activeTab === 'reviews' && (
            <div className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm space-y-6 animate-in fade-in duration-300">
              
              <div>
                <h3 className="font-extrabold text-base text-gray-900">Ratings & Reviews Moderator</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Moderate platform user feedback and filter abusive or spam reviews</p>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 font-semibold">
                    No active user reviews to moderate.
                  </div>
                ) : (
                  reviews.map((review) => (
                    <div 
                      key={review.id} 
                      className={`border rounded-[24px] p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition ${
                        review.status === 'Deleted' ? 'opacity-40 bg-gray-50/50 border-gray-100' :
                        review.status === 'Flagged' ? 'border-amber-100 bg-amber-50/10' : 'bg-white border-gray-100'
                      }`}
                    >
                      <div className="space-y-2 flex-1 max-w-xl">
                        <div className="flex items-center space-x-2.5">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                            review.status === 'Flagged' ? 'bg-amber-500 text-white' :
                            review.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-500 text-white'
                          }`}>
                            {review.status}
                          </span>
                          
                          {/* Rating Stars */}
                          <div className="flex items-center text-amber-500 text-sm select-none">
                            {Array.from({ length: 5 }).map((_, starIdx) => (
                              <span key={starIdx} className="leading-none">
                                {starIdx < review.rating ? '★' : '☆'}
                              </span>
                            ))}
                          </div>

                          <span className="text-[10px] text-gray-400 font-extrabold uppercase">User: {review.user}</span>
                        </div>

                        {/* Review Content */}
                        <p className="text-sm font-semibold text-gray-700 italic leading-relaxed">
                          "{review.content}"
                        </p>

                        {review.status === 'Flagged' && (
                          <p className="text-[10px] text-red-500 font-extrabold flex items-center space-x-1 bg-red-50 border border-red-100/50 rounded-lg px-2.5 py-1.5 w-max">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Flag reason: {review.flagReason}</span>
                          </p>
                        )}
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-2 text-xs select-none shrink-0 self-start md:self-center">
                        {review.status === 'Flagged' ? (
                          <>
                            <button 
                              onClick={() => handleApproveReview(review.id)}
                              className="py-2.5 px-4 bg-white border border-gray-250 hover:bg-gray-50 text-gray-700 rounded-xl font-extrabold transition cursor-pointer"
                            >
                              Approve / Keep Review
                            </button>
                            <button 
                              onClick={() => handleDeleteReview(review.id)}
                              className="py-2.5 px-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-extrabold transition shadow-sm cursor-pointer flex items-center space-x-1.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete Review</span>
                            </button>
                          </>
                        ) : (
                          <div className={`flex items-center font-extrabold text-xs space-x-1 py-2 px-4 rounded-xl border ${
                            review.status === 'Approved' 
                              ? 'bg-emerald-50 border-emerald-100 text-emerald-600' 
                              : 'bg-red-50 border-red-100 text-red-600'
                          }`}>
                            {review.status === 'Approved' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <X className="w-4 h-4 shrink-0" />}
                            <span>{review.status === 'Approved' ? 'Approved & Visible' : 'Deleted from Platform'}</span>
                          </div>
                        )}
                      </div>

                    </div>
                  ))
                )}
              </div>

            </div>
          )}

        </main>
      </div>

    </div>
  );
}
