"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  MessageSquare, Heart, LogOut, Edit2, 
  Send, BedDouble, Bath, Maximize2, Trash2, CheckCircle2,
  Briefcase, Users, Shield, Settings, Archive
} from 'lucide-react';

interface WishlistItem {
  id: number;
  title: string;
  address: string;
  beds: number;
  baths: number;
  sqft: number;
  price: string;
  image: string;
}

interface Message {
  id: number;
  sender: 'tenant' | 'landlord';
  text: string;
  time: string;
}

interface Chat {
  id: number;
  landlordName: string;
  propertyName: string;
  avatar: string;
  lastMessage: string;
  messages: Message[];
}

export default function TenantDashboard() {
  const [activeTab, setActiveTab] = useState<'profile' | 'messages' | 'wishlist'>('profile');
  const [user, setUser] = useState<{ firstName: string; lastName: string; email: string } | null>(null);
  
  // Wishlist state
  const [wishlist, setWishlist] = useState<WishlistItem[]>([
    {
      id: 1,
      title: "Ahlers & Ogletree Villa",
      address: "132 Northbrooke Trce, Woodstock, GA",
      beds: 6,
      baths: 4,
      sqft: 2797,
      price: "$2,695",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 3,
      title: "Villa Tropical Cana",
      address: "540 Belle Gate Pl, Cary, NC",
      beds: 8,
      baths: 5,
      sqft: 3875,
      price: "$3,300",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    }
  ]);

  // Chats State
  const [chats, setChats] = useState<Chat[]>([
    {
      id: 1,
      landlordName: "Nimal Bandara",
      propertyName: "Colombo Heights Apartment",
      avatar: "N",
      lastMessage: "The apartment is available for viewing tomorrow.",
      messages: [
        { id: 1, sender: 'landlord', text: "Hello Abiramy! Thanks for inquiring about Colombo Heights Apartment.", time: "Yesterday, 3:15 PM" },
        { id: 2, sender: 'tenant', text: "Hi Nimal! Is the property available for a physical walkthrough this week?", time: "Yesterday, 3:45 PM" },
        { id: 3, sender: 'landlord', text: "Yes, the apartment is available for viewing tomorrow at 10:00 AM. Does that work for you?", time: "Today, 10:12 AM" }
      ]
    },
    {
      id: 2,
      landlordName: "Anura Perera",
      propertyName: "Kandy Lakeview Villa",
      avatar: "A",
      lastMessage: "Sounds good, I will send the agreement draft.",
      messages: [
        { id: 1, sender: 'tenant', text: "Hello Anura, I have reviewed the rental price. Is it negotiable?", time: "2 days ago" },
        { id: 2, sender: 'landlord', text: "We can do $3,200/month if we sign a 12-month lease agreement.", time: "Yesterday, 9:00 AM" },
        { id: 3, sender: 'tenant', text: "That works for me! Thank you.", time: "Yesterday, 11:30 AM" },
        { id: 4, sender: 'landlord', text: "Sounds good, I will send the agreement draft.", time: "Yesterday, 12:00 PM" }
      ]
    }
  ]);

  const [activeChatId, setActiveChatId] = useState<number>(1);
  const [newMessageText, setNewMessageText] = useState('');

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
        console.error('Failed to parse token', e);
        setUser({ firstName: 'Abiramy', lastName: '', email: 'abiramy@example.com' });
      }
    } else {
      setUser({ firstName: 'Abiramy', lastName: '', email: 'abiramy@example.com' });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('stayzo_token');
    window.location.href = '/';
  };

  const handleRemoveFromWishlist = (id: number) => {
    setWishlist(wishlist.filter(item => item.id !== id));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;

    setChats(chats.map(chat => {
      if (chat.id === activeChatId) {
        return {
          ...chat,
          lastMessage: newMessageText,
          messages: [
            ...chat.messages,
            {
              id: Date.now(),
              sender: 'tenant',
              text: newMessageText,
              time: 'Just now'
            }
          ]
        };
      }
      return chat;
    }));

    setNewMessageText('');
  };

  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];
  const userInitial = user?.firstName?.charAt(0).toUpperCase() || 'A';

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] font-sans selection:bg-[#1A1A1A] selection:text-white flex flex-col">
      
      {/* Top Header matching the Airbnb style layout */}
      <header className="w-full bg-white border-b border-gray-150 py-5 px-6 sm:px-12 flex justify-between items-center z-50 shrink-0 select-none">
        
        {/* Left Brand Logo */}
        <Link href="/" className="flex items-center space-x-2.5 group">
          <div className="flex items-end space-x-1 h-5">
            <div className="w-[3px] h-3 bg-[#1A1A1A] rounded-full group-hover:bg-[#1A1A1A] transition-colors"></div>
            <div className="w-[3px] h-5 bg-[#1A1A1A] rounded-full group-hover:bg-[#1A1A1A] transition-colors"></div>
            <div className="w-[3px] h-4 bg-[#1A1A1A] rounded-full group-hover:bg-[#1A1A1A] transition-colors"></div>
            <div className="w-[3px] h-2.5 bg-[#1A1A1A] rounded-full group-hover:bg-[#1A1A1A] transition-colors"></div>
          </div>
          <span className="text-xl font-bold tracking-tight text-[#1A1A1A]">Stayzo</span>
        </Link>

        {/* Center Navigation Links (Matching Image Position) */}
        <nav className="flex items-center space-x-8 text-xs font-bold text-gray-500">
          <button 
            onClick={() => setActiveTab('profile')} 
            className={`hover:text-gray-900 transition uppercase tracking-wider cursor-pointer ${
              activeTab === 'profile' ? 'text-gray-900 font-extrabold border-b-2 border-gray-900 pb-1.5' : ''
            }`}
          >
            About me
          </button>
          <button 
            onClick={() => setActiveTab('messages')} 
            className={`hover:text-gray-900 transition uppercase tracking-wider cursor-pointer ${
              activeTab === 'messages' ? 'text-gray-900 font-extrabold border-b-2 border-gray-900 pb-1.5' : ''
            }`}
          >
            Messages
          </button>
          <button 
            onClick={() => setActiveTab('wishlist')} 
            className={`hover:text-gray-900 transition uppercase tracking-wider cursor-pointer ${
              activeTab === 'wishlist' ? 'text-gray-900 font-extrabold border-b-2 border-gray-900 pb-1.5' : ''
            }`}
          >
            Wishlist
          </button>
        </nav>

        {/* Right utility options */}
        <div className="flex items-center space-x-6">
          <button 
            onClick={handleLogout} 
            className="flex items-center space-x-1.5 text-xs font-extrabold text-red-500 hover:text-red-600 transition uppercase tracking-wider cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log out</span>
          </button>
        </div>
      </header>

      {/* Main Layout Grid */}
      <div className="flex-1 flex flex-col md:flex-row max-w-6xl w-full mx-auto px-6 sm:px-12 py-16 gap-12">
        
        {/* Left Column: Sidebar Tab Navigation based on Active Section */}
        <aside className="w-full md:w-[260px] shrink-0">
          <div className="space-y-6">
            
            {activeTab === 'profile' && (
              <>
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Profile</h1>
                <nav className="flex flex-col space-y-1.5">
                  <button className="flex items-center space-x-3.5 w-full px-4 py-3 rounded-2xl text-xs font-extrabold transition text-left bg-gray-100 text-gray-900 select-none">
                    <div className="w-5 h-5 rounded-full bg-[#1A1A1A]/10 text-[#1A1A1A] flex items-center justify-center text-[10px] font-extrabold shrink-0 border border-[#1A1A1A]/10">
                      {userInitial}
                    </div>
                    <span>About me</span>
                  </button>
                  
                  <button className="flex items-center space-x-3.5 w-full px-4 py-3 rounded-2xl text-xs font-bold transition text-left text-gray-500 hover:bg-gray-50 hover:text-gray-900 cursor-not-allowed select-none">
                    <Briefcase className="w-4 h-4 text-gray-400 shrink-0" />
                    <span>Past trips</span>
                  </button>
                  
                  <button className="flex items-center space-x-3.5 w-full px-4 py-3 rounded-2xl text-xs font-bold transition text-left text-gray-500 hover:bg-gray-50 hover:text-gray-900 cursor-not-allowed select-none">
                    <Users className="w-4 h-4 text-gray-400 shrink-0" />
                    <span>Connections</span>
                  </button>
                </nav>
              </>
            )}

            {activeTab === 'messages' && (
              <>
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Inbox</h1>
                
                {/* Conversations List inside Sidebar */}
                <div className="flex flex-col space-y-1.5">
                  {chats.map(chat => (
                    <button 
                      key={chat.id}
                      onClick={() => setActiveChatId(chat.id)}
                      className={`w-full flex items-start space-x-3 p-3.5 rounded-2xl text-left cursor-pointer transition select-none ${
                        activeChatId === chat.id 
                          ? 'bg-gray-100/70 text-gray-900' 
                          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-full bg-[#1A1A1A]/5 text-[#1A1A1A] flex items-center justify-center font-bold text-xs border border-gray-100 shrink-0">
                        {chat.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-extrabold text-xs text-gray-900 truncate mb-0.5">{chat.landlordName}</h4>
                        <p className="text-[9px] font-bold text-[#1A1A1A] truncate mb-0.5">{chat.propertyName}</p>
                        <p className="text-[10px] font-semibold text-gray-400 truncate">{chat.lastMessage}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'wishlist' && (
              <>
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Wishlist</h1>
                <nav className="flex flex-col space-y-1.5">
                  <button className="flex items-center space-x-3.5 w-full px-4 py-3 rounded-2xl text-xs font-extrabold transition text-left bg-gray-100 text-gray-900 select-none">
                    <Heart className="w-4 h-4 text-gray-400 shrink-0" />
                    <span>Saved Stays</span>
                  </button>
                  
                  <button className="flex items-center space-x-3.5 w-full px-4 py-3 rounded-2xl text-xs font-bold transition text-left text-gray-500 hover:bg-gray-50 hover:text-gray-900 cursor-not-allowed select-none">
                    <Settings className="w-4 h-4 text-gray-400 shrink-0" />
                    <span>Preferences</span>
                  </button>

                  <button className="flex items-center space-x-3.5 w-full px-4 py-3 rounded-2xl text-xs font-bold transition text-left text-gray-500 hover:bg-gray-50 hover:text-gray-900 cursor-not-allowed select-none">
                    <Archive className="w-4 h-4 text-gray-400 shrink-0" />
                    <span>Archived</span>
                  </button>
                </nav>
              </>
            )}

          </div>
        </aside>

        {/* Vertical divider line */}
        <div className="hidden md:block w-px bg-gray-100 self-stretch"></div>

        {/* Right Column: Displaying Active Content */}
        <main className="flex-1 min-w-0">

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              {/* Profile Header Row with Edit Button */}
              <div className="flex items-center space-x-3">
                <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">About me</h2>
                <button className="text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-1.5 cursor-pointer transition select-none">
                  Edit
                </button>
              </div>

              {/* Central card and onboarding section layout */}
              <div className="flex flex-col lg:flex-row items-stretch gap-8">
                
                {/* Center Card: Big initials Avatar Card */}
                <div className="w-full lg:w-[280px] bg-white border border-gray-200 rounded-3xl p-8 shadow-sm flex flex-col items-center justify-center text-center shrink-0">
                  <div className="w-24 h-24 rounded-full bg-[#1A1A1A]/10 border border-[#1A1A1A]/20 flex items-center justify-center text-4xl font-extrabold text-[#1A1A1A] mb-4">
                    {userInitial}
                  </div>
                  <h3 className="text-2xl font-extrabold text-gray-900 leading-tight">
                    {user?.firstName} {user?.lastName}
                  </h3>
                  <p className="text-gray-400 text-xs font-bold mt-1">Tenant</p>
                </div>

                {/* Right Area: Profile Onboarding Card */}
                <div className="flex-1 flex flex-col justify-between py-2 space-y-6">
                  <div className="space-y-3">
                    <h4 className="text-xl font-bold text-gray-900">Complete your profile</h4>
                    <p className="text-gray-500 text-xs font-semibold leading-relaxed max-w-md">
                      Your Stayzo profile is an important part of every reservation. Complete yours to help landlords and other guests get to know you.
                    </p>
                  </div>
                  
                  <div>
                    <button className="bg-[#1A1A1A] hover:bg-black text-white px-6 py-3 rounded-xl text-xs font-extrabold shadow-sm transition active:scale-95 cursor-pointer select-none">
                      Get started
                    </button>
                  </div>
                </div>

              </div>

              {/* Reviews Button Link Card */}
              <div className="pt-4">
                <button className="flex items-center space-x-2 text-xs font-extrabold text-gray-700 bg-white border border-gray-250 rounded-xl px-4 py-3 shadow-sm hover:bg-gray-50 transition cursor-pointer select-none">
                  <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                  <span>Reviews I've written</span>
                </button>
              </div>

            </div>
          )}

          {/* MESSAGES TAB */}
          {activeTab === 'messages' && (
            <div className="bg-white border border-gray-150 rounded-3xl shadow-sm flex flex-col h-[550px] overflow-hidden animate-in fade-in duration-300">
              
              {/* Chat Thread Panel */}
              <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFB]/40">
                
                {/* Active Chat Header */}
                <div className="bg-white p-5 border-b border-gray-150 flex items-center justify-between shrink-0">
                  <div>
                    <h3 className="font-extrabold text-gray-900 text-sm">{activeChat.landlordName}</h3>
                    <p className="text-[10px] font-bold text-[#1A1A1A]">{activeChat.propertyName}</p>
                  </div>
                </div>

                {/* Messages Lists */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {activeChat.messages.map((message) => (
                    <div 
                      key={message.id}
                      className={`flex flex-col ${
                        message.sender === 'tenant' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-xs font-semibold leading-relaxed ${
                        message.sender === 'tenant'
                          ? 'bg-[#1A1A1A] text-white rounded-tr-none'
                          : 'bg-white text-gray-800 border border-gray-150 rounded-tl-none shadow-sm'
                      }`}>
                        {message.text}
                      </div>
                      <span className="text-[8px] font-bold text-gray-400 mt-1.5 px-1">{message.time}</span>
                    </div>
                  ))}
                </div>

                {/* Bottom Send Input Bar */}
                <form onSubmit={handleSendMessage} className="bg-white p-3.5 border-t border-gray-150 flex items-center gap-3 shrink-0">
                  <input 
                    type="text" 
                    placeholder="Type a message..."
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    className="flex-1 bg-[#F8FAFB] border-none text-xs font-semibold px-4 py-3 rounded-xl outline-none focus:ring-1 focus:ring-[#1A1A1A] text-gray-800 placeholder-gray-400"
                  />
                  <button 
                    type="submit" 
                    className="bg-[#1A1A1A] hover:bg-black text-white p-3 rounded-xl shadow-sm transition active:scale-95 cursor-pointer shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>

              </div>

            </div>
          )}

          {/* WISHLIST TAB */}
          {activeTab === 'wishlist' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Saved Wishlist</h2>
                <p className="text-gray-400 text-xs font-semibold mt-1">Your saved premium rental properties</p>
              </div>

              {wishlist.length === 0 ? (
                <div className="bg-white border border-gray-150 rounded-[32px] p-12 shadow-sm text-center space-y-4">
                  <Heart className="w-10 h-10 text-gray-300 mx-auto" />
                  <h3 className="text-lg font-extrabold text-gray-900">Your wishlist is empty</h3>
                  <p className="text-gray-400 text-xs font-semibold max-w-sm mx-auto leading-relaxed">
                    You haven't bookmarked any listings yet. Explore our properties search engine to build your perfect stays index.
                  </p>
                  <Link 
                    href="/search" 
                    className="inline-block bg-[#1A1A1A] hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-extrabold shadow-sm transition cursor-pointer select-none"
                  >
                    Browse properties
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {wishlist.map((item) => (
                    <div 
                      key={item.id}
                      className="bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
                    >
                      {/* Image header */}
                      <div className="h-[180px] w-full bg-gray-50 relative shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover"
                        />
                        <button 
                          onClick={() => handleRemoveFromWishlist(item.id)}
                          className="absolute top-3.5 right-3.5 bg-white hover:bg-red-50 text-gray-600 hover:text-red-500 p-2.5 rounded-xl shadow-md border border-gray-150 transition cursor-pointer"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Info details */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-3.5">
                        <div className="space-y-1">
                          <h3 className="font-extrabold text-base text-gray-900 leading-tight">{item.title}</h3>
                          <p className="text-gray-400 text-[10px] font-bold truncate">{item.address}</p>
                        </div>

                        {/* Specs grid */}
                        <div className="flex items-center space-x-4 text-xs font-bold text-gray-500">
                          <span className="flex items-center">
                            <BedDouble className="w-3.5 h-3.5 text-gray-400 mr-1.5" />
                            {item.beds}
                          </span>
                          <span className="flex items-center">
                            <Bath className="w-3.5 h-3.5 text-gray-400 mr-1.5" />
                            {item.baths}
                          </span>
                          <span className="flex items-center">
                            <Maximize2 className="w-3.5 h-3.5 text-gray-400 mr-1.5" />
                            {item.sqft.toLocaleString()} sqft
                          </span>
                        </div>

                        <div className="pt-1 flex items-center justify-between">
                          <div className="text-[#1A1A1A] font-extrabold text-base">
                            {item.price}<span className="text-xs text-gray-400 font-semibold">/month</span>
                          </div>
                          <Link 
                            href="/search"
                            className="bg-[#1A1A1A] hover:bg-black text-white px-3.5 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer select-none"
                          >
                            View
                          </Link>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

        </main>

      </div>
    </div>
  );
}

