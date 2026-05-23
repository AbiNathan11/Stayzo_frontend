"use client";

import React, { useState } from 'react';
import {
  FileText,
  AlertTriangle,
  DollarSign,
  Clock,
  Search,
  ArrowRight,
  CheckCircle2,
  Scale,
  X,
  FileCheck,
  FileX,
  ShieldAlert,
  ChevronRight,
  Send,
  User,
  ExternalLink
} from 'lucide-react';

interface LeaseAgreement {
  id: string;
  tenantName: string;
  tenantEmail: string;
  landlordName: string;
  landlordEmail: string;
  monthlyRent: number;
  securityDeposit: number;
  termLength: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Pending Signatures' | 'Expired';
  listingName: string;
}

interface DisputeCase {
  id: string;
  agreementId: string;
  claimant: 'Tenant' | 'Landlord';
  claimantName: string;
  defendantName: string;
  category: 'Security Deposit' | 'Property Damage' | 'Lease Violation' | 'Unpaid Rent';
  disputedAmount: number;
  description: string;
  status: 'Under Review' | 'Mediation In Progress' | 'Resolved';
  dateFiled: string;
  conversationHistory: { sender: string; message: string; time: string }[];
}

export default function AgreementsPage() {
  const [activeTab, setActiveTab] = useState<'contracts' | 'disputes'>('contracts');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Mediate Panel State
  const [selectedDispute, setSelectedDispute] = useState<DisputeCase | null>(null);
  const [mediationText, setMediationText] = useState('');

  // Active Lease Agreements
  const [agreements, setAgreements] = useState<LeaseAgreement[]>([
    {
      id: "CON-78401",
      tenantName: "Jane Doe",
      tenantEmail: "jane@example.com",
      landlordName: "Nimal Bandara",
      landlordEmail: "nimal@example.com",
      monthlyRent: 3999.00,
      securityDeposit: 4500.00,
      termLength: "12 Months",
      startDate: "Jan 10, 2025",
      endDate: "Jan 09, 2026",
      status: "Active",
      listingName: "3940 N 16th St"
    },
    {
      id: "CON-78402",
      tenantName: "Abiramy Selva",
      tenantEmail: "abiramy@example.com",
      landlordName: "Aberam Krish",
      landlordEmail: "aberam@example.com",
      monthlyRent: 3300.00,
      securityDeposit: 3300.00,
      termLength: "6 Months",
      startDate: "Dec 25, 2024",
      endDate: "Jun 24, 2025",
      status: "Active",
      listingName: "Villa Tropical Cana"
    },
    {
      id: "CON-78403",
      tenantName: "John Smith",
      tenantEmail: "john@example.com",
      landlordName: "Zia Siddiki",
      landlordEmail: "siddikia11@gmail.com",
      monthlyRent: 2800.00,
      securityDeposit: 2800.00,
      termLength: "12 Months",
      startDate: "May 01, 2026",
      endDate: "Apr 30, 2027",
      status: "Pending Signatures",
      listingName: "46 Haunting St, Somerville"
    },
    {
      id: "CON-78404",
      tenantName: "Elena Rostova",
      tenantEmail: "elena@rostov.io",
      landlordName: "Nimal Siri",
      landlordEmail: "nimal@colombo.com",
      monthlyRent: 4200.00,
      securityDeposit: 4200.00,
      termLength: "3 Months",
      startDate: "Oct 15, 2024",
      endDate: "Jan 14, 2025",
      status: "Expired",
      listingName: "Colombo Heights Suite"
    }
  ]);

  // Disputes & Meditations data
  const [disputes, setDisputes] = useState<DisputeCase[]>([
    {
      id: "DIS-302",
      agreementId: "CON-78401",
      claimant: "Tenant",
      claimantName: "Jane Doe",
      defendantName: "Nimal Bandara",
      category: "Security Deposit",
      disputedAmount: 1500.00,
      description: "Landlord is attempting to withhold $1,500 of the security deposit for alleged scuff marks on the master bedroom wall. Tenant claims these were noted in the move-in inspection report as general wear and tear.",
      status: "Mediation In Progress",
      dateFiled: "May 22, 2026",
      conversationHistory: [
        { sender: "Jane Doe (Tenant)", message: "I submitted photos from the first day proving those marks were already there. You cannot charge me $1,500 for painting a clean wall.", time: "May 22, 02:14 PM" },
        { sender: "Nimal Bandara (Landlord)", message: "The marks are far larger than regular wear and tear. I had to hire a contractor to patch and paint the entire section.", time: "May 22, 04:30 PM" }
      ]
    },
    {
      id: "DIS-303",
      agreementId: "CON-78402",
      claimant: "Landlord",
      claimantName: "Aberam Krish",
      defendantName: "Abiramy Selva",
      category: "Property Damage",
      disputedAmount: 3200.00,
      description: "Landlord states that the kitchen marble countertop has a deep crack from impact damage and requires complete slab replacement. Tenant asserts the crack occurred due to thermal stress and structural shifting.",
      status: "Under Review",
      dateFiled: "May 20, 2026",
      conversationHistory: [
        { sender: "Aberam Krish (Landlord)", message: "The marble was intact before check-in. The crack is clearly from dropping a heavy cast iron pan.", time: "May 20, 11:05 AM" }
      ]
    },
    {
      id: "DIS-304",
      agreementId: "CON-78404",
      claimant: "Tenant",
      claimantName: "Elena Rostova",
      defendantName: "Nimal Siri",
      category: "Lease Violation",
      disputedAmount: 4200.00,
      description: "Tenant files dispute requesting a partial refund of rent because the apartment swimming pool and gym amenities were completely shut down by management during the entire 3-month tenure.",
      status: "Resolved",
      dateFiled: "May 10, 2026",
      conversationHistory: [
        { sender: "Elena Rostova (Tenant)", message: "I signed the contract specifically to have pool access. Charging full price is unfair.", time: "May 10, 09:12 AM" },
        { sender: "Stayzo Admin Mediation", message: "Resolved: Escrow released. Refunded $1,260.00 (30% discount on original rent) to Tenant. Remainder released to Landlord.", time: "May 12, 10:14 AM" }
      ]
    }
  ]);

  const handleResolution = (disputeId: string, releasedTo: 'Tenant' | 'Landlord' | 'Split') => {
    // Complete mediation process
    setDisputes(disputes.map(d => {
      if (d.id === disputeId) {
        const adminMsg = {
          sender: "Stayzo Admin Mediation",
          message: `Arbitration Complete: Platform admin resolved dispute. Released full disputed amount of $${d.disputedAmount} to ${releasedTo}. Case files archived.`,
          time: "Just now"
        };

        const updatedDispute: DisputeCase = {
          ...d,
          status: 'Resolved',
          conversationHistory: [...d.conversationHistory, adminMsg]
        };

        if (selectedDispute && selectedDispute.id === d.id) {
          setSelectedDispute(updatedDispute);
        }

        return updatedDispute;
      }
      return d;
    }));
  };

  const handleSendMediationMessage = () => {
    if (!selectedDispute || !mediationText.trim()) return;

    const newMsg = {
      sender: "Stayzo Admin Mediation",
      message: mediationText,
      time: "Just now"
    };

    const updatedDispute: DisputeCase = {
      ...selectedDispute,
      status: 'Mediation In Progress',
      conversationHistory: [...selectedDispute.conversationHistory, newMsg]
    };

    setSelectedDispute(updatedDispute);
    setDisputes(disputes.map(d => d.id === selectedDispute.id ? updatedDispute : d));
    setMediationText('');
  };

  // Filter Logic
  const filteredAgreements = agreements.filter(c => {
    const matchesSearch =
      c.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.landlordName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.listingName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredDisputes = disputes.filter(d => {
    const matchesSearch =
      d.claimantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.defendantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const disputedEscrowTotal = disputes
    .filter(d => d.status !== 'Resolved')
    .reduce((sum, d) => sum + d.disputedAmount, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 relative">

      {/* QUICK STATUS METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Active Agreements */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition duration-300 flex items-start justify-between">
          <div className="space-y-3">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Active Agreements</span>
            <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">{agreements.filter(c => c.status === 'Active').length}</h3>
            <div className="flex items-center text-emerald-600 text-xs font-bold space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100% Legally Binding</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
            <FileCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Active Disputes */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition duration-300 flex items-start justify-between">
          <div className="space-y-3">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Ongoing Disputes</span>
            <h3 className="text-3xl font-extrabold text-red-500 tracking-tight">{disputes.filter(d => d.status !== 'Resolved').length}</h3>
            <div className="flex items-center text-red-500 text-xs font-bold space-x-1">
              <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
              <span>Requires attention</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-500">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        {/* Escrow Under Disputes */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition duration-300 flex items-start justify-between">
          <div className="space-y-3">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Disputed Escrows</span>
            <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">${disputedEscrowTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
            <div className="flex items-center text-gray-400 text-xs font-bold space-x-1">
              <Clock className="w-3.5 h-3.5 text-gray-300" />
              <span>Held in Secure Node</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* SLA Time */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition duration-300 flex items-start justify-between">
          <div className="space-y-3">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Mediation Speed SLA</span>
            <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">24.2 hrs</h3>
            <div className="flex items-center text-emerald-600 text-xs font-bold space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Within standard limit</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Scale className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* CORE WORKSPACE PANEL */}
      <div className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm space-y-6">

        {/* Toolbars & Section Switching */}
        <div className="flex flex-col xl:flex-row justify-between xl:items-center gap-6 border-b border-gray-50 pb-5">

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div>
              <h4 className="font-extrabold text-base text-gray-900">Contracts &amp; Mediation Console</h4>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Review rent lease agreements or settle secure deposit disputes</p>
            </div>

            {/* Tab controls */}
            <div className="bg-[#F8FAFB] p-1 rounded-2xl flex items-center space-x-1 text-[10px] font-extrabold uppercase select-none border border-gray-100 sm:ml-4">
              <button
                onClick={() => { setActiveTab('contracts'); setStatusFilter('All'); setSearchQuery(''); }}
                className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center space-x-1.5 ${activeTab === 'contracts' ? 'bg-[#1A1A1A] text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              >
                <FileText className="w-3 h-3 shrink-0" />
                <span>Lease Contracts</span>
              </button>
              <button
                onClick={() => { setActiveTab('disputes'); setStatusFilter('All'); setSearchQuery(''); }}
                className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center space-x-1.5 ${activeTab === 'disputes' ? 'bg-[#1A1A1A] text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              >
                <Scale className="w-3 h-3 shrink-0" />
                <span>Dispute Meditations</span>
              </button>
            </div>
          </div>

          {/* Filtering tools */}
          <div className="flex flex-wrap items-center gap-3">

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder={activeTab === 'contracts' ? "Search leases..." : "Search dispute cases..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#F8FAFB] text-xs font-bold text-gray-700 pl-9 pr-4 py-2.5 w-48 rounded-xl outline-none focus:ring-1 focus:ring-[#1A1A1A] border-none"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3.5 top-3" />
            </div>

            {/* Status Filter Dropdown or Button Bar */}
            <div className="bg-[#F8FAFB] p-1 rounded-xl flex items-center space-x-1 text-[9px] font-extrabold uppercase select-none border border-gray-50">
              {activeTab === 'contracts' ? (
                ['All', 'Active', 'Pending Signatures', 'Expired'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer ${statusFilter === st ? 'bg-white text-gray-900 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-700'}`}
                  >
                    {st === 'Pending Signatures' ? 'Pending' : st}
                  </button>
                ))
              ) : (
                ['All', 'Under Review', 'Mediation In Progress', 'Resolved'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer ${statusFilter === st ? 'bg-white text-gray-900 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-700'}`}
                  >
                    {st === 'Mediation In Progress' ? 'Mediation' : st}
                  </button>
                ))
              )}
            </div>

          </div>
        </div>

        {/* GRID AND TABLE LISTINGS */}
        <div className="overflow-x-auto">
          {activeTab === 'contracts' ? (
            <table className="w-full text-left border-collapse text-xs font-bold">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-widest text-[9px]">
                  <th className="py-4 px-4">Lease ID</th>
                  <th className="py-4 px-4">Property</th>
                  <th className="py-4 px-4">Tenant Entity</th>
                  <th className="py-4 px-4">Landlord Entity</th>
                  <th className="py-4 px-4">Terms</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredAgreements.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-400 font-semibold">
                      No active lease contracts located.
                    </td>
                  </tr>
                ) : (
                  filteredAgreements.map((con) => (
                    <tr key={con.id} className="hover:bg-[#F8FAFB]/40 transition">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-gray-400 shrink-0" />
                          <span className="text-gray-950 font-extrabold">{con.id}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-800 font-bold max-w-[180px] truncate">{con.listingName}</p>
                        <p className="text-gray-400 text-[9px]">Cycle: {con.startDate} - {con.endDate}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-850 font-bold">{con.tenantName}</p>
                        <p className="text-gray-400 font-semibold text-[9px] mt-0.5">{con.tenantEmail}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-850 font-bold">{con.landlordName}</p>
                        <p className="text-gray-400 font-semibold text-[9px] mt-0.5">{con.landlordEmail}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-950 font-extrabold">${con.monthlyRent}/mo</p>
                        <p className="text-gray-400 text-[9px]">Deposit: ${con.securityDeposit}</p>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase border ${con.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                            con.status === 'Pending Signatures' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                              'bg-gray-100 text-gray-500 border-gray-200'
                          }`}>
                          {con.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          className="bg-gray-50 text-gray-500 hover:bg-[#1A1A1A] hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-extrabold transition uppercase flex items-center space-x-1 mx-auto"
                          onClick={() => alert(`Showing electronic lease payload:\nLease ID: ${con.id}\nListing: ${con.listingName}\nSecurity Deposit: $${con.securityDeposit}\nSignatures Verified: True`)}
                        >
                          <span>Review Doc</span>
                          <ExternalLink className="w-3 h-3 ml-0.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            // DISPUTES CONSOLE BOARD
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

              {/* Left Column: Dispute list */}
              <div className="xl:col-span-2 space-y-4 border-r border-gray-50 pr-0 xl:pr-6">
                <div className="flex items-center space-x-2 bg-red-50/20 text-red-500 px-4 py-2.5 rounded-xl border border-red-100/50 text-[10px] font-extrabold uppercase tracking-wider select-none">
                  <Scale className="w-3.5 h-3.5 text-red-400" />
                  <span>Stayzo Compliance Escalation Board &bull; Mediate Active filings</span>
                </div>

                <div className="space-y-4">
                  {filteredDisputes.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 font-semibold">
                      No dispute escalations logged.
                    </div>
                  ) : (
                    filteredDisputes.map((dispute) => (
                      <div
                        key={dispute.id}
                        onClick={() => setSelectedDispute(dispute)}
                        className={`p-5 rounded-3xl border transition cursor-pointer flex flex-col justify-between space-y-4 hover:shadow-sm ${selectedDispute?.id === dispute.id
                            ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white'
                            : dispute.status === 'Resolved'
                              ? 'bg-emerald-50/10 border-emerald-100/70 hover:bg-emerald-50/20'
                              : 'bg-white border-gray-100 hover:bg-[#F8FAFB]/30'
                          }`}
                      >
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className={`text-[8px] font-extrabold uppercase px-2 py-0.5 rounded ${selectedDispute?.id === dispute.id
                                  ? 'bg-white/20 text-white'
                                  : 'bg-gray-100 text-gray-500'
                                }`}>{dispute.id}</span>
                              <span className={`ml-2 text-[8px] font-extrabold uppercase px-2 py-0.5 rounded border ${dispute.status === 'Resolved'
                                  ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                  : dispute.status === 'Mediation In Progress'
                                    ? 'bg-amber-50 text-amber-600 border-amber-100'
                                    : 'bg-red-50 text-red-600 border-red-100'
                                }`}>{dispute.status}</span>
                            </div>
                            <span className={`text-sm font-extrabold ${selectedDispute?.id === dispute.id ? 'text-white' : 'text-gray-950'}`}>
                              ${dispute.disputedAmount.toLocaleString()} in Dispute
                            </span>
                          </div>

                          <div>
                            <h4 className={`text-xs font-extrabold ${selectedDispute?.id === dispute.id ? 'text-white' : 'text-gray-900'}`}>
                              Category: {dispute.category}
                            </h4>
                            <p className={`text-[10px] mt-1 select-none line-clamp-2 ${selectedDispute?.id === dispute.id ? 'text-gray-300' : 'text-gray-400 font-semibold'}`}>
                              {dispute.description}
                            </p>
                          </div>
                        </div>

                        <div className={`pt-4 border-t flex items-center justify-between text-[10px] font-bold ${selectedDispute?.id === dispute.id ? 'border-white/10 text-gray-400' : 'border-gray-50 text-gray-400'
                          }`}>
                          <div>
                            <span className="font-extrabold">Claimant:</span> {dispute.claimantName} ({dispute.claimant})
                          </div>
                          <div className="flex items-center space-x-1">
                            <span>Mediate case</span>
                            <ChevronRight className="w-3 h-3" />
                          </div>
                        </div>

                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Right Column: Detailed Mediation/Arbitration Screen */}
              <div className="xl:col-span-1 bg-[#F8FAFB] rounded-[32px] p-6 border border-gray-100 h-fit space-y-6">
                {selectedDispute ? (
                  <div className="space-y-6 animate-in fade-in duration-300">

                    {/* Header */}
                    <div className="border-b border-gray-200/50 pb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[8px] font-extrabold uppercase bg-red-100 text-red-600 px-2 py-0.5 rounded select-none">Mediation Active</span>
                          <h4 className="font-extrabold text-base text-gray-900 mt-1">Mediate: {selectedDispute.id}</h4>
                        </div>
                        <button
                          onClick={() => setSelectedDispute(null)}
                          className="bg-gray-200 hover:bg-gray-300 p-1.5 rounded-full text-gray-500 transition"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase">Contract Reference: {selectedDispute.agreementId}</p>
                    </div>

                    {/* Dispute Info Detail */}
                    <div className="space-y-3 bg-white p-4 rounded-2xl border border-gray-100 text-xs">
                      <div>
                        <span className="text-[8px] text-gray-400 font-extrabold uppercase tracking-wider block">Escrow Amount</span>
                        <span className="font-extrabold text-base text-red-500">${selectedDispute.disputedAmount.toLocaleString()} held in escrow</span>
                      </div>
                      <div>
                        <span className="text-[8px] text-gray-400 font-extrabold uppercase tracking-wider block">Description of Case</span>
                        <p className="text-[10px] font-semibold text-gray-600 leading-relaxed mt-1 select-text">
                          {selectedDispute.description}
                        </p>
                      </div>
                    </div>

                    {/* Interactive chat logs */}
                    <div className="space-y-3">
                      <span className="text-[8px] font-extrabold text-gray-400 uppercase tracking-widest block">Escalation Chat Logs</span>
                      <div className="max-h-[160px] overflow-y-auto space-y-2.5 border border-gray-200/50 bg-white p-3 rounded-2xl text-[9px] font-semibold">
                        {selectedDispute.conversationHistory.map((chat, idx) => (
                          <div
                            key={idx}
                            className={`p-2 rounded-xl leading-normal ${chat.sender.startsWith('Stayzo Admin')
                                ? 'bg-blue-50 text-blue-700 border border-blue-100/50'
                                : chat.sender.includes('Tenant')
                                  ? 'bg-gray-50 text-gray-700 border border-gray-100'
                                  : 'bg-purple-50/50 text-purple-700 border border-purple-100/50'
                              }`}
                          >
                            <div className="flex justify-between font-extrabold text-[8px] mb-0.5 opacity-90">
                              <span>{chat.sender}</span>
                              <span>{chat.time}</span>
                            </div>
                            <p className="select-text font-bold">{chat.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions panel */}
                    {selectedDispute.status !== 'Resolved' ? (
                      <div className="space-y-4 pt-4 border-t border-gray-200/50 select-none">

                        {/* Response Input */}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Message parties as Stayzo Admin..."
                            value={mediationText}
                            onChange={(e) => setMediationText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMediationMessage()}
                            className="bg-white text-xs font-bold text-gray-700 px-3.5 py-2 w-full rounded-xl outline-none focus:ring-1 focus:ring-[#1A1A1A] border border-gray-200"
                          />
                          <button
                            onClick={handleSendMediationMessage}
                            className="bg-[#1A1A1A] hover:bg-black text-white p-2.5 rounded-xl transition flex items-center justify-center cursor-pointer shrink-0"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Arbiter Verdict Action Buttons */}
                        <div className="space-y-2">
                          <span className="text-[8px] font-extrabold text-gray-400 uppercase tracking-widest block">Issue Arbiter Verdict</span>
                          <div className="grid grid-cols-2 gap-2 text-[9px] font-extrabold uppercase">
                            <button
                              onClick={() => handleResolution(selectedDispute.id, 'Tenant')}
                              className="bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-xl transition cursor-pointer flex items-center justify-center space-x-1"
                            >
                              <span>Payout to Tenant</span>
                            </button>
                            <button
                              onClick={() => handleResolution(selectedDispute.id, 'Landlord')}
                              className="bg-[#1A1A1A] hover:bg-black text-white py-2 rounded-xl transition cursor-pointer flex items-center justify-center space-x-1"
                            >
                              <span>Payout to Landlord</span>
                            </button>
                          </div>
                        </div>

                      </div>
                    ) : (
                      <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-2xl p-4 flex items-center space-x-2 text-[10px] font-extrabold uppercase select-none">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>This case is legally closed and resolved.</span>
                      </div>
                    )}

                  </div>
                ) : (
                  <div className="text-center py-20 text-gray-400 font-semibold select-none">
                    <Scale className="w-10 h-10 mx-auto text-gray-300 stroke-1 mb-3" />
                    <p className="text-xs font-extrabold text-gray-700 uppercase">Arbiter Panel Ready</p>
                    <p className="text-[10px] mt-1">Select any active dispute case to initiate arbitration mediation, post warnings, or resolve held escrows.</p>
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

      </div>

    </div>
  );
}
