"use client";

import React, { useState } from 'react';
import { Send, Languages, Info } from 'lucide-react';

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
    <div className="bg-white border border-gray-150 rounded-3xl shadow-sm flex flex-col h-[650px] overflow-hidden animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white p-5 border-b border-gray-150 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1A1A1A]/5 text-[#1A1A1A] flex items-center justify-center font-extrabold text-sm border border-gray-100">
            N
          </div>
          <div>
            <h3 className="font-extrabold text-gray-900 text-sm">Nimal Bandara</h3>
            <p className="text-[10px] font-bold text-[#1A1A1A]">Colombo Heights Apartment</p>
          </div>
        </div>
        <button 
          onClick={() => setTranslateOn(!translateOn)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold transition ${
            translateOn ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-gray-50 text-gray-500 border border-gray-100 hover:bg-gray-100'
          }`}
          title="Bilingual Translation"
        >
          <Languages className="w-3.5 h-3.5" />
          {translateOn ? 'Sinhala/Tamil On' : 'Translate'}
        </button>
      </div>

      {/* Translation Alert */}
      {translateOn && (
        <div className="bg-blue-50/50 border-b border-blue-100 px-5 py-2 flex items-center gap-2 text-[10px] font-bold text-blue-700">
          <Info className="w-3 h-3" />
          Incoming messages will be translated automatically to your preferred language.
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#F8FAFB]/40">
        {messages.map((message) => (
          <div key={message.id} className={`flex flex-col ${message.sender === 'tenant' ? 'items-end' : 'items-start'}`}>
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

      {/* Input */}
      <form onSubmit={handleSend} className="bg-white p-4 border-t border-gray-150 flex items-center gap-3 shrink-0">
        <input 
          type="text" 
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 bg-[#F8FAFB] border border-gray-100 text-xs font-semibold px-4 py-3 rounded-xl outline-none focus:ring-1 focus:ring-[#1A1A1A] text-gray-800 placeholder-gray-400"
        />
        <button 
          type="submit" 
          className="bg-[#1A1A1A] hover:bg-black text-white p-3.5 rounded-xl shadow-sm transition active:scale-95 shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
}
