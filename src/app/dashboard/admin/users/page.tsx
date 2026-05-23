"use client";

import React, { useState } from 'react';
import { Search, ShieldCheck, CheckCircle2, Mail, Calendar } from 'lucide-react';

interface UserAccount {
  id: number;
  name: string;
  email: string;
  role: 'Tenant' | 'Landlord';
  status: 'Active' | 'Suspended';
  verified: boolean;
  joinedDate: string;
}

export default function UsersPage() {
  const [userSearch, setUserSearch] = useState('');
  const [userFilter, setUserFilter] = useState<'All' | 'Tenant' | 'Landlord'>('All');

  const [users, setUsers] = useState<UserAccount[]>([
    { id: 1, name: "Abiramy Selva", email: "abiramy@example.com", role: "Tenant", status: "Active", verified: true, joinedDate: "Sep 12 2024" },
    { id: 2, name: "Nimal Bandara", email: "nimal@example.com", role: "Landlord", status: "Active", verified: true, joinedDate: "Oct 01 2024" },
    { id: 3, name: "Anura Perera", email: "anura@example.com", role: "Landlord", status: "Active", verified: false, joinedDate: "Nov 15 2024" },
    { id: 4, name: "Jane Doe", email: "jane@example.com", role: "Tenant", status: "Active", verified: true, joinedDate: "Jan 10 2025" },
    { id: 5, name: "John Smith", email: "john@example.com", role: "Tenant", status: "Suspended", verified: false, joinedDate: "Feb 22 2025" },
    { id: 6, name: "Aberam Krish", email: "aberam@example.com", role: "Landlord", status: "Active", verified: true, joinedDate: "Mar 05 2025" },
    { id: 7, name: "Vishnnu Dev", email: "vishnnu@example.com", role: "Landlord", status: "Active", verified: false, joinedDate: "Apr 18 2025" },
  ]);

  const toggleVerifyUser = (id: number) => {
    setUsers(users.map(u => u.id === id ? { ...u, verified: !u.verified } : u));
  };

  const toggleSuspendUser = (id: number) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u));
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userFilter === 'All' || u.role === userFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm space-y-6 animate-in fade-in duration-300">

      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gray-50 pb-5">
        <div>
          <h3 className="font-extrabold text-base text-gray-900">User Directory</h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Verify, suspend, and audit platform accounts</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
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
          <div className="bg-[#F8FAFB] p-1 rounded-xl flex items-center space-x-1 text-[10px] font-extrabold uppercase select-none">
            {(['All', 'Tenant', 'Landlord'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setUserFilter(f)}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${userFilter === f ? 'bg-[#1A1A1A] text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              >
                {f === 'All' ? 'All Roles' : f === 'Tenant' ? 'Tenants' : 'Landlords'}
              </button>
            ))}
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
              className={`border rounded-3xl p-6 transition flex flex-col justify-between space-y-4 hover:shadow-md ${account.status === 'Suspended' ? 'bg-red-50/20 border-red-100' : 'bg-white border-gray-100'}`}
            >
              {/* Top Info */}
              <div className="space-y-3.5">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-2xl bg-[#1A1A1A]/5 border border-gray-100 flex items-center justify-center font-extrabold text-sm select-none">
                    {account.name.charAt(0)}
                  </div>
                  <div className="flex space-x-1.5">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${account.role === 'Landlord' ? 'bg-purple-50 text-purple-600 border border-purple-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                      {account.role}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${account.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
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

              {/* Controls */}
              <div className="pt-4 border-t border-gray-50 flex items-center justify-between gap-3 text-xs select-none">
                <button
                  onClick={() => toggleVerifyUser(account.id)}
                  className={`flex-1 py-2 px-3.5 rounded-xl font-extrabold transition cursor-pointer border flex items-center justify-center space-x-1.5 ${account.verified ? 'bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{account.verified ? 'Verified' : 'Verify Account'}</span>
                </button>
                <button
                  onClick={() => toggleSuspendUser(account.id)}
                  className={`py-2 px-3.5 rounded-xl font-extrabold transition cursor-pointer border ${account.status === 'Suspended' ? 'bg-red-500 border-red-500 text-white hover:bg-red-600' : 'bg-white border-red-200 text-red-500 hover:bg-red-50'}`}
                >
                  {account.status === 'Suspended' ? 'Unsuspend' : 'Suspend'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
