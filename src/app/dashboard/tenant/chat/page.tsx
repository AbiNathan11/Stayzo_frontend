"use client";

import React, { useState } from 'react';
import { Send, Languages, Info, Search, MoreVertical, Phone, Video } from 'lucide-react';

interface Message {
  id: number;
  sender: 'tenant' | 'landlord';
  text: string;
  time: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'landlord', text: "Hello Abiramy! Thanks for inquiring about Colombo Heights Apartment.", time: "Yesterday, 3:15 PM" },
    { id: 2, sender: 'tenant', text: "Hi Nimal! Is the property available for a physical walkthrough this week?", time: "Yesterday, 3:45 PM" },
    { id: 3, sender: 'landlord', text: "Yes, the apartment is available for viewing tomorrow at 10:00 AM. Does that work for you?", time: "Today, 10:12 AM" }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [translateOn, setTranslateOn] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setMessages([...messages, { id: Date.now(), sender: 'tenant', text: newMessage, time: 'Just now' }]);
    setNewMessage('');
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-2xl flex h-[700px] overflow-hidden animate-in fade-in duration-300">

      {/* Left Sidebar - Contacts List */}
      <div className="w-1/3 min-w-[280px] border-r border-gray-200 flex flex-col bg-[#F8FAFB]">
        <div className="p-4 border-b border-gray-200 bg-white">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Messages</h2>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full bg-gray-100 text-sm pl-9 pr-4 py-2.5 rounded-xl outline-none focus:ring-1 focus:ring-gray-300 transition"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Active Contact */}
          <div className="flex items-center gap-3 p-4 bg-white border-l-4 border-[#1A1A1A] cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center font-bold text-lg shrink-0">
              N
                </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-bold text-[#1A1A1A] truncate">Nimal Bandara</h3>
                <span className="text-[10px] text-gray-400 font-semibold shrink-0">10:12 AM</span>
                  </div>
              <p className="text-xs text-gray-500 truncate">Yes, the apartment is available...</p>
            </div>
          </div>

          {/* Other Contact */}
          <div className="flex items-center gap-3 p-4 hover:bg-gray-50 border-l-4 border-transparent cursor-pointer transition">
            <div className="w-12 h-12 rounded-full bg-gray-100 text-[#1A1A1A] border border-gray-200 flex items-center justify-center font-bold text-lg shrink-0">
              S
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-bold text-[#1A1A1A] truncate">Saman Perera</h3>
                <span className="text-[10px] text-gray-400 font-semibold shrink-0">Oct 12</span>
              </div>
              <p className="text-xs text-gray-500 truncate">Thank you for the payment.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Area - Active Chat */}
      <div className="flex-1 flex flex-col bg-white">

        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center font-bold text-sm shrink-0">
              N
            </div>
            <div>
              <h3 className="font-bold text-[#1A1A1A]">Nimal Bandara</h3>
              <p className="text-xs text-gray-500 font-medium">Colombo Heights Apartment</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[#1A1A1A]">
            <button
              onClick={() => setTranslateOn(!translateOn)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${translateOn ? 'bg-[#1A1A1A] text-white' : 'hover:bg-gray-100 text-[#1A1A1A]'
              }`}
              title="Bilingual Translation"
            >
              <Languages className="w-4 h-4" />
              <span className="hidden sm:inline">{translateOn ? 'Translate On' : 'Translate'}</span>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition"><Phone className="w-4 h-4" /></button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition"><Video className="w-4 h-4" /></button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition"><MoreVertical className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Translation Alert */}
        {translateOn && (
          <div className="bg-gray-100 border-b border-gray-200 px-6 py-2 flex items-center gap-2 text-xs font-semibold text-[#1A1A1A] shrink-0">
            <Info className="w-4 h-4" />
            Incoming messages are automatically translated to your preferred language.
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
          {messages.map((message) => (
            <div key={message.id} className={`flex flex-col ${message.sender === 'tenant' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[70%] px-5 py-3 rounded-2xl text-sm font-medium shadow-sm ${message.sender === 'tenant'
                  ? 'bg-[#1A1A1A] text-white rounded-tr-sm'
                  : 'bg-white text-gray-800 border border-gray-200 rounded-tl-sm'
                }`}>
                {message.text}
              </div>
              <span className="text-[10px] font-semibold text-gray-400 mt-2 mx-1">{message.time}</span>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-white border-t border-gray-200 shrink-0">
          <form onSubmit={handleSend} className="flex items-center gap-3">
            <div className="flex-1 bg-gray-100 rounded-full flex items-center px-4 py-2 border border-transparent focus-within:border-gray-300 focus-within:bg-white transition">
            <input
              type="text"
                placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 bg-transparent text-sm py-2 outline-none text-gray-800 placeholder-gray-400"
            />
            </div>
            <button
              type="submit"
              className="bg-[#1A1A1A] hover:bg-black text-white p-3.5 rounded-full shadow-sm transition active:scale-95 shrink-0"
            >
              <Send className="w-5 h-5 ml-0.5" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
