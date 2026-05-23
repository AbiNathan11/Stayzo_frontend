"use client";

import React, { useState } from 'react';
import {
  Activity,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Search,
  Filter,
  Database,
  AlertTriangle,
  CheckCircle2,
  UserCheck,
  Info,
  X,
  TrendingUp,
  Cpu,
  Layers,
  Terminal
} from 'lucide-react';

interface FinancialTransaction {
  id: string;
  type: 'Payout' | 'Deposit' | 'Escrow Hold' | 'Refund';
  amount: number;
  user: string;
  email: string;
  targetListing: string;
  status: 'Cleared' | 'Pending' | 'On Hold' | 'Failed';
  date: string;
  time: string;
  reference: string;
  paymentMethod: string;
  ipAddress: string;
}

interface SystemLog {
  id: string;
  type: 'Security' | 'Operations' | 'Listing Update' | 'User Activity';
  level: 'Info' | 'Warning' | 'Critical';
  message: string;
  actor: string;
  role: string;
  date: string;
  time: string;
  systemModule: string;
  details: string;
  ipAddress: string;
}

export default function ActivitiesPage() {
  const [activeTab, setActiveTab] = useState<'financial' | 'system'>('financial');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [filterLevel, setFilterLevel] = useState<string>('All');

  // Drawer Panel State for viewing full log detail
  const [selectedFinancial, setSelectedFinancial] = useState<FinancialTransaction | null>(null);
  const [selectedSystem, setSelectedSystem] = useState<SystemLog | null>(null);

  // Mock data for Financial Transactions
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([
    {
      id: "TXN-884920",
      type: "Deposit",
      amount: 4500.00,
      user: "Abiramy Selva",
      email: "abiramy@example.com",
      targetListing: "Villa Tropical Cana",
      status: "Cleared",
      date: "May 23, 2026",
      time: "10:14 PM",
      reference: "ch_3Mv8sLFkzoI9xY901u87b",
      paymentMethod: "Visa ending in 4242",
      ipAddress: "192.168.1.115"
    },
    {
      id: "TXN-884921",
      type: "Payout",
      amount: 3950.00,
      user: "Nimal Bandara",
      email: "nimal@example.com",
      targetListing: "3940 N 16th St",
      status: "Cleared",
      date: "May 23, 2026",
      time: "08:42 PM",
      reference: "po_1Mv7uVFkzoI9xY827f8a9",
      paymentMethod: "Bank Account (Sri Lanka Bank ****8820)",
      ipAddress: "203.94.75.18"
    },
    {
      id: "TXN-884922",
      type: "Escrow Hold",
      amount: 1500.00,
      user: "Jane Doe",
      email: "jane@example.com",
      targetListing: "221 E Ontario St",
      status: "On Hold",
      date: "May 22, 2026",
      time: "03:15 PM",
      reference: "esc_5Nz8xLLkzoI7aY008d13e",
      paymentMethod: "Security Deposit Hold - Stayzo Escrow",
      ipAddress: "102.164.22.90"
    },
    {
      id: "TXN-884923",
      type: "Refund",
      amount: 850.00,
      user: "John Smith",
      email: "john@example.com",
      targetListing: "46 Haunting St, Somerville",
      status: "Cleared",
      date: "May 22, 2026",
      time: "11:05 AM",
      reference: "re_8Jx3fMFkzoI0pY442h99a",
      paymentMethod: "Mastercard ending in 1092",
      ipAddress: "198.51.100.4"
    },
    {
      id: "TXN-884924",
      type: "Deposit",
      amount: 2800.00,
      user: "Michael Scott",
      email: "michael@dundermifflin.com",
      targetListing: "Scranton Business Park",
      status: "Pending",
      date: "May 21, 2026",
      time: "09:30 AM",
      reference: "ch_2Nv9aZFkzoI4xY552k11x",
      paymentMethod: "American Express ending in 2004",
      ipAddress: "172.56.21.8"
    },
    {
      id: "TXN-884925",
      type: "Payout",
      amount: 5200.00,
      user: "Anura Perera",
      email: "anura@example.com",
      targetListing: "Kandy Lakeview Mansion",
      status: "Failed",
      date: "May 20, 2026",
      time: "04:12 PM",
      reference: "po_9Kz4wYFkzoI3eY711s99w",
      paymentMethod: "Bank Account (Sri Lanka Bank ****4431)",
      ipAddress: "220.247.234.112"
    }
  ]);

  // Mock data for System Event Logs
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([
    {
      id: "SYS-00109",
      type: "Security",
      level: "Critical",
      message: "Multiple failed administrator login attempts from unauthorized IP block",
      actor: "System Sentinel",
      role: "Platform Agent",
      date: "May 23, 2026",
      time: "11:24 PM",
      systemModule: "Authentication Service",
      details: "Client attempted to login with username 'root_admin' 15 times within 60 seconds. Client blocked for 24 hours.",
      ipAddress: "45.143.203.18"
    },
    {
      id: "SYS-00110",
      type: "Listing Update",
      level: "Info",
      message: "Property listing 'Villa Tropical Cana' status changed to active by moderator approval",
      actor: "Aberam Krish",
      role: "Landlord / Moderator",
      date: "May 23, 2026",
      time: "10:15 PM",
      systemModule: "Listing Engine",
      details: "Moderator manually approved compliance documents and published the listing to global search nodes.",
      ipAddress: "192.168.1.115"
    },
    {
      id: "SYS-00111",
      type: "User Activity",
      level: "Warning",
      message: "User password reset requested and successfully completed via SMS verification OTP",
      actor: "Jane Doe",
      role: "Tenant",
      date: "May 23, 2026",
      time: "07:11 PM",
      systemModule: "Account Recovery Manager",
      details: "SMS request triggered using recovery code sequence 448-921. Device fingerprints matched registered user parameters.",
      ipAddress: "102.164.22.90"
    },
    {
      id: "SYS-00112",
      type: "Operations",
      level: "Info",
      message: "Automated midnight database backup and database vacuum execution completed",
      actor: "Cron Agent",
      role: "System Daemon",
      date: "May 23, 2026",
      time: "00:01 AM",
      systemModule: "Database Ops Node",
      details: "Full binary snapshot (14.2 GB) securely written and encrypted inside Stayzo cloud buckets. Indexes reorganized successfully.",
      ipAddress: "127.0.0.1 (Localhost)"
    },
    {
      id: "SYS-00113",
      type: "Security",
      level: "Warning",
      message: "High-value transaction ($5,200.00) flagged for verification audit",
      actor: "Audit Engine",
      role: "Compliance Daemon",
      date: "May 20, 2026",
      time: "04:12 PM",
      systemModule: "Anti-Fraud Controller",
      details: "Payout transaction TXN-884925 failed structural compliance rules due to destination country route mismatch.",
      ipAddress: "220.247.234.112"
    }
  ]);

  // Filtering Logic
  const filteredTransactions = transactions.filter(t => {
    const matchesSearch =
      t.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.targetListing.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.reference.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === 'All' || t.type === filterType;
    return matchesSearch && matchesType;
  });

  const filteredSystemLogs = systemLogs.filter(s => {
    const matchesSearch =
      s.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.systemModule.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLevel = filterLevel === 'All' || s.level === filterLevel;
    const matchesType = filterType === 'All' || s.type === filterType;
    return matchesSearch && matchesLevel && matchesType;
  });

  // Calculate quick stats from actual transaction and log states
  const totalEscrow = transactions
    .filter(t => t.type === 'Escrow Hold' && t.status === 'On Hold')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingPayouts = transactions
    .filter(t => t.type === 'Payout' && t.status === 'Pending')
    .reduce((sum, t) => sum + t.amount, 0) + 12410.50; // Dynamic component combined with active processing baseline

  return (
    <div className="space-y-8 animate-in fade-in duration-300 relative">

      {/* METRIC CARD WIDGETS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Total Escrow */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition duration-300 flex items-start justify-between">
          <div className="space-y-3">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Total Escrow holds</span>
            <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">${(totalEscrow + 41350).toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
            <div className="flex items-center text-emerald-600 text-xs font-bold space-x-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+8.4%</span>
              <span className="text-gray-400 font-semibold text-[10px] ml-1">increase this week</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* Processing Payouts */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition duration-300 flex items-start justify-between">
          <div className="space-y-3">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Processing Payouts</span>
            <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">${pendingPayouts.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
            <div className="flex items-center text-gray-400 text-xs font-bold space-x-1">
              <Clock className="w-3.5 h-3.5 text-gray-300" />
              <span>6 Trans. Pending</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>

        {/* Operational Efficiency */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition duration-300 flex items-start justify-between">
          <div className="space-y-3">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Active Operations Rate</span>
            <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">94.2%</h3>
            <div className="flex items-center text-emerald-600 text-xs font-bold space-x-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+1.2%</span>
              <span className="text-gray-400 font-semibold text-[10px] ml-1">optimizations online</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Cpu className="w-5 h-5" />
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition duration-300 flex items-start justify-between">
          <div className="space-y-3">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Cluster Node Health</span>
            <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">99.98%</h3>
            <div className="flex items-center text-emerald-600 text-xs font-bold space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>All systems operational</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
            <Layers className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* CORE MONITOR SECTION */}
      <div className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm space-y-6">

        {/* Header Controls */}
        <div className="flex flex-col xl:flex-row justify-between xl:items-center gap-6 border-b border-gray-50 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div>
              <h4 className="font-extrabold text-base text-gray-900">Activity Live Monitor</h4>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Audit transactions, escrow accounts &amp; platform security events</p>
            </div>

            {/* Live Toggling tabs */}
            <div className="bg-[#F8FAFB] p-1 rounded-2xl flex items-center space-x-1 text-[10px] font-extrabold uppercase select-none border border-gray-100 sm:ml-4">
              <button
                onClick={() => { setActiveTab('financial'); setFilterType('All'); setSearchQuery(''); }}
                className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center space-x-1.5 ${activeTab === 'financial' ? 'bg-[#1A1A1A] text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              >
                <DollarSign className="w-3 h-3 shrink-0" />
                <span>Financial &amp; Balance Logs</span>
              </button>
              <button
                onClick={() => { setActiveTab('system'); setFilterType('All'); setFilterLevel('All'); setSearchQuery(''); }}
                className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center space-x-1.5 ${activeTab === 'system' ? 'bg-[#1A1A1A] text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              >
                <Terminal className="w-3 h-3 shrink-0" />
                <span>System Operations</span>
              </button>
            </div>
          </div>

          {/* Filtering and Query Toolbar */}
          <div className="flex flex-wrap items-center gap-3">

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder={activeTab === 'financial' ? "Search transactions..." : "Search console logs..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#F8FAFB] text-xs font-bold text-gray-700 pl-9 pr-4 py-2.5 w-52 rounded-xl outline-none focus:ring-1 focus:ring-[#1A1A1A] border-none"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3.5 top-3" />
            </div>

            {/* Financial Specific Filters */}
            {activeTab === 'financial' && (
              <div className="bg-[#F8FAFB] p-1 rounded-xl flex items-center space-x-1 text-[9px] font-extrabold uppercase select-none border border-gray-50">
                {['All', 'Deposit', 'Payout', 'Escrow Hold', 'Refund'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer ${filterType === type ? 'bg-white text-gray-900 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-700'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}

            {/* System Specific Filters */}
            {activeTab === 'system' && (
              <>
                <div className="bg-[#F8FAFB] p-1 rounded-xl flex items-center space-x-1 text-[9px] font-extrabold uppercase select-none border border-gray-50">
                  {['All', 'Security', 'Listing Update', 'User Activity', 'Operations'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer ${filterType === type ? 'bg-white text-gray-900 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-700'}`}
                    >
                      {type.replace('Listing Update', 'Listings').replace('User Activity', 'Users')}
                    </button>
                  ))}
                </div>

                <div className="bg-[#F8FAFB] p-1 rounded-xl flex items-center space-x-1 text-[9px] font-extrabold uppercase select-none border border-gray-50">
                  {['All', 'Info', 'Warning', 'Critical'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setFilterLevel(level)}
                      className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer ${filterLevel === level
                        ? level === 'Critical' ? 'bg-red-500 text-white shadow-sm' : level === 'Warning' ? 'bg-amber-400 text-gray-950 shadow-sm' : 'bg-white text-gray-900 shadow-sm border border-gray-100'
                        : 'text-gray-400 hover:text-gray-700'
                        }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </>
            )}

          </div>
        </div>

        {/* LOG CONTENTS TABLE / LIST */}
        <div className="overflow-x-auto">
          {activeTab === 'financial' ? (
            <table className="w-full text-left border-collapse text-xs font-bold">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-widest text-[9px]">
                  <th className="py-4 px-4">Transaction ID</th>
                  <th className="py-4 px-4">Target Listing</th>
                  <th className="py-4 px-4">Authorized By</th>
                  <th className="py-4 px-4">Timestamp</th>
                  <th className="py-4 px-4">Amount</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4 text-center">Diagnostics</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-400 font-semibold">
                      No financial logs found matching your request.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx) => (
                    <tr
                      key={tx.id}
                      onClick={() => setSelectedFinancial(tx)}
                      className="hover:bg-[#F8FAFB]/70 transition group cursor-pointer"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <span className={`w-8 h-8 rounded-xl flex items-center justify-center border ${tx.type === 'Deposit' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                            tx.type === 'Payout' ? 'bg-blue-50 border-blue-100 text-blue-600' :
                              tx.type === 'Escrow Hold' ? 'bg-purple-50 border-purple-100 text-purple-600' :
                                'bg-red-50 border-red-100 text-red-600'
                            }`}>
                            {tx.type === 'Deposit' && <ArrowDownLeft className="w-3.5 h-3.5" />}
                            {tx.type === 'Payout' && <ArrowUpRight className="w-3.5 h-3.5" />}
                            {tx.type === 'Escrow Hold' && <Clock className="w-3.5 h-3.5" />}
                            {tx.type === 'Refund' && <ArrowUpRight className="w-3.5 h-3.5 rotate-90" />}
                          </span>
                          <div>
                            <p className="text-gray-950 font-extrabold">{tx.id}</p>
                            <p className="text-gray-400 text-[8px] font-bold uppercase tracking-widest">{tx.type}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-800 font-bold max-w-[180px] truncate">{tx.targetListing}</p>
                        <p className="text-gray-400 font-semibold text-[9px]">Ref: {tx.reference.substring(0, 12)}...</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-800 font-bold">{tx.user}</p>
                        <p className="text-gray-400 font-semibold text-[10px] mt-0.5">{tx.email}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-700 font-bold">{tx.date}</p>
                        <p className="text-gray-400 font-semibold text-[9px] mt-0.5">{tx.time}</p>
                      </td>
                      <td className="py-4 px-4 text-sm font-extrabold text-gray-950">
                        {tx.type === 'Payout' || tx.type === 'Refund' ? '-' : '+'}${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase border ${tx.status === 'Cleared' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                          tx.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                            tx.status === 'On Hold' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                              'bg-red-50 text-red-600 border-red-100'
                          }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedFinancial(tx); }}
                          className="bg-gray-50 text-gray-500 hover:bg-[#1A1A1A] hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-extrabold transition uppercase"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            // SYSTEM LOGS SHELL VIEW
            <div className="space-y-4">
              <div className="flex items-center space-x-2 bg-gray-950/5 text-gray-400 px-4 py-2.5 rounded-xl border border-gray-100 text-[10px] font-extrabold uppercase tracking-wider select-none">
                <Database className="w-3.5 h-3.5 text-gray-600" />
                <span>Stayzo Platform Console &bull; Live Security &amp; Daemon Logs</span>
              </div>
              <div className="border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-50">
                {filteredSystemLogs.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 font-semibold">
                    No operating logs matching active queries.
                  </div>
                ) : (
                  filteredSystemLogs.map((log) => (
                    <div
                      key={log.id}
                      onClick={() => setSelectedSystem(log)}
                      className="p-4 hover:bg-[#F8FAFB]/70 transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                    >
                      <div className="flex items-start space-x-3.5">
                        <div className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border ${log.level === 'Critical' ? 'bg-red-50 border-red-100 text-red-500' :
                          log.level === 'Warning' ? 'bg-amber-50 border-amber-100 text-amber-500' :
                            'bg-blue-50 border-blue-100 text-blue-500'
                          }`}>
                          {log.level === 'Critical' && <AlertTriangle className="w-3.5 h-3.5" />}
                          {log.level === 'Warning' && <Info className="w-3.5 h-3.5" />}
                          {log.level === 'Info' && <UserCheck className="w-3.5 h-3.5" />}
                        </div>
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wide">{log.id}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wide border ${log.level === 'Critical' ? 'bg-red-50 text-red-600 border-red-100' :
                              log.level === 'Warning' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                'bg-blue-50 text-blue-600 border-blue-100'
                              }`}>{log.level}</span>
                            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">{log.systemModule}</span>
                          </div>
                          <p className="text-gray-950 font-extrabold text-xs group-hover:text-[#1A1A1A] transition">{log.message}</p>
                          <p className="text-gray-400 font-semibold text-[10px]">Triggered by {log.actor} ({log.role}) &bull; IP: {log.ipAddress}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-4 shrink-0">
                        <div className="text-right text-[10px] font-bold text-gray-400">
                          <p className="text-gray-700 font-extrabold">{log.date}</p>
                          <p className="mt-0.5 font-semibold">{log.time}</p>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedSystem(log); }}
                          className="bg-gray-50 text-gray-500 hover:bg-[#1A1A1A] hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-extrabold transition uppercase"
                        >
                          Analyze
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* DETAILED DIAGNOSTICS DRAWER (FINANCIALS) */}
      {selectedFinancial && (
        <div className="fixed inset-0 bg-black/25 backdrop-blur-xs flex justify-end z-50 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[500px] h-full shadow-2xl p-8 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="space-y-8">

              {/* Header */}
              <div className="flex justify-between items-start border-b border-gray-50 pb-5">
                <div>
                  <span className="bg-[#1A1A1A] text-white text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider">Stayzo Ledger Audit</span>
                  <h3 className="font-extrabold text-xl text-gray-900 mt-2">Audit: {selectedFinancial.id}</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Secure Transaction Diagnostics</p>
                </div>
                <button
                  onClick={() => setSelectedFinancial(null)}
                  className="bg-gray-50 hover:bg-gray-100 p-2 rounded-full text-gray-400 hover:text-gray-900 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Status & Amount Highlight */}
              <div className="bg-gray-50 rounded-3xl p-6 flex justify-between items-center border border-gray-100">
                <div>
                  <p className="text-[9px] font-extrabold text-gray-400 uppercase tracking-widest">Transaction Sum</p>
                  <h4 className="text-3xl font-extrabold text-gray-950 mt-1">${selectedFinancial.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h4>
                </div>
                <span className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold uppercase border ${selectedFinancial.status === 'Cleared' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                  selectedFinancial.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                    selectedFinancial.status === 'On Hold' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                      'bg-red-50 text-red-600 border-red-100'
                  }`}>
                  {selectedFinancial.status}
                </span>
              </div>

              {/* Transaction Parameters */}
              <div className="space-y-4">
                <h5 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Metadata Parameters</h5>

                <div className="grid grid-cols-2 gap-4 text-xs font-bold">
                  <div className="border border-gray-50 rounded-2xl p-3 bg-white">
                    <p className="text-[9px] text-gray-400 uppercase">Transaction Type</p>
                    <p className="text-gray-800 font-extrabold mt-1">{selectedFinancial.type}</p>
                  </div>
                  <div className="border border-gray-50 rounded-2xl p-3 bg-white">
                    <p className="text-[9px] text-gray-400 uppercase">Payment Channel</p>
                    <p className="text-gray-800 font-extrabold mt-1 truncate">{selectedFinancial.paymentMethod}</p>
                  </div>
                  <div className="border border-gray-50 rounded-2xl p-3 bg-white">
                    <p className="text-[9px] text-gray-400 uppercase">Platform Reference</p>
                    <p className="text-gray-800 font-extrabold mt-1 truncate select-all">{selectedFinancial.reference}</p>
                  </div>
                  <div className="border border-gray-50 rounded-2xl p-3 bg-white">
                    <p className="text-[9px] text-gray-400 uppercase">Source IP Host</p>
                    <p className="text-gray-800 font-extrabold mt-1">{selectedFinancial.ipAddress}</p>
                  </div>
                </div>
              </div>

              {/* User Identity Info */}
              <div className="space-y-4">
                <h5 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Origin/Destination Entity</h5>
                <div className="border border-gray-100 rounded-3xl p-5 flex items-center space-x-4 bg-white">
                  <div className="w-12 h-12 bg-gray-950 text-white rounded-2xl flex items-center justify-center font-extrabold text-base select-none">
                    {selectedFinancial.user.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-gray-900">{selectedFinancial.user}</p>
                    <p className="text-xs font-semibold text-gray-400">{selectedFinancial.email}</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mt-1">Authorized for: {selectedFinancial.targetListing}</p>
                  </div>
                </div>
              </div>

            </div>

            <div className="pt-6 border-t border-gray-50 flex items-center gap-3">
              <button
                onClick={() => setSelectedFinancial(null)}
                className="w-full bg-[#1A1A1A] hover:bg-black text-white py-3 rounded-2xl text-xs font-extrabold uppercase transition"
              >
                Close Audit Record
              </button>
            </div>

          </div>
        </div>
      )}

      {/* DETAILED DIAGNOSTICS DRAWER (SYSTEM OPERATIONS) */}
      {selectedSystem && (
        <div className="fixed inset-0 bg-black/25 backdrop-blur-xs flex justify-end z-50 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[500px] h-full shadow-2xl p-8 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="space-y-8">

              {/* Header */}
              <div className="flex justify-between items-start border-b border-gray-50 pb-5">
                <div>
                  <span className="bg-[#1A1A1A] text-white text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider">Stayzo Kernel Console</span>
                  <h3 className="font-extrabold text-xl text-gray-900 mt-2">Log ID: {selectedSystem.id}</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Operating Node Inspection</p>
                </div>
                <button
                  onClick={() => setSelectedSystem(null)}
                  className="bg-gray-50 hover:bg-gray-100 p-2 rounded-full text-gray-400 hover:text-gray-900 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Status & Level Highlight */}
              <div className="bg-gray-50 rounded-3xl p-6 flex justify-between items-center border border-gray-100">
                <div>
                  <p className="text-[9px] font-extrabold text-gray-400 uppercase tracking-widest">Logging Severity</p>
                  <h4 className="text-xl font-extrabold text-gray-950 mt-1">{selectedSystem.level} Alert</h4>
                </div>
                <span className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold uppercase border ${selectedSystem.level === 'Critical' ? 'bg-red-500 text-white border-red-500 shadow-sm' :
                  selectedSystem.level === 'Warning' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                    'bg-blue-50 text-blue-600 border-blue-100'
                  }`}>
                  {selectedSystem.level}
                </span>
              </div>

              {/* Alert message body */}
              <div className="space-y-3">
                <h5 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Log Event Payload</h5>
                <p className="text-xs font-bold text-gray-800 bg-gray-50/50 p-4 border border-gray-100 rounded-2xl leading-relaxed">
                  {selectedSystem.message}
                </p>
              </div>

              {/* Diagnostic Parameters */}
              <div className="space-y-4">
                <h5 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Log Context Metadata</h5>

                <div className="grid grid-cols-2 gap-4 text-xs font-bold">
                  <div className="border border-gray-50 rounded-2xl p-3 bg-white">
                    <p className="text-[9px] text-gray-400 uppercase">Process Node</p>
                    <p className="text-gray-800 font-extrabold mt-1">{selectedSystem.systemModule}</p>
                  </div>
                  <div className="border border-gray-50 rounded-2xl p-3 bg-white">
                    <p className="text-[9px] text-gray-400 uppercase">Network Origin IP</p>
                    <p className="text-gray-800 font-extrabold mt-1">{selectedSystem.ipAddress}</p>
                  </div>
                  <div className="border border-gray-50 rounded-2xl p-3 bg-white">
                    <p className="text-[9px] text-gray-400 uppercase">Trigger Time</p>
                    <p className="text-gray-800 font-extrabold mt-1">{selectedSystem.time}</p>
                  </div>
                  <div className="border border-gray-50 rounded-2xl p-3 bg-white">
                    <p className="text-[9px] text-gray-400 uppercase">System Actor</p>
                    <p className="text-gray-800 font-extrabold mt-1 truncate">{selectedSystem.actor}</p>
                  </div>
                </div>
              </div>

              {/* Full Hex Dump / JSON Payload */}
              <div className="space-y-4">
                <h5 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Complete Analytical Details</h5>
                <div className="border border-gray-950 bg-gray-950 p-4 rounded-3xl text-[10px] font-mono text-emerald-400 select-all leading-normal max-h-[140px] overflow-y-auto">
                  <span className="text-gray-500">// Raw stack trace telemetry</span><br />
                  MODULE: {selectedSystem.systemModule.toUpperCase().replace(/ /g, '_')}<br />
                  SEVERITY: {selectedSystem.level.toUpperCase()}<br />
                  TIMESTAMP: {selectedSystem.date} &bull; {selectedSystem.time}<br />
                  ACTOR_REF: {selectedSystem.actor} [{selectedSystem.role}]<br />
                  LOG_DATA: {selectedSystem.details}
                </div>
              </div>

            </div>

            <div className="pt-6 border-t border-gray-50 flex items-center gap-3">
              <button
                onClick={() => setSelectedSystem(null)}
                className="w-full bg-[#1A1A1A] hover:bg-black text-white py-3 rounded-2xl text-xs font-extrabold uppercase transition"
              >
                Clear Analyst View
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
