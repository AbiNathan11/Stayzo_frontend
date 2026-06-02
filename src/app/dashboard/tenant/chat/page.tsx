"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Search,
  MoreVertical,
  Paperclip,
  Send,
  Calendar,
  FileText,
} from "lucide-react";

// ─── Conversation List ───────────────────────────────────────────────────────
const conversations = [
  {
    id: 1,
    name: "Nimal Bandara",
    time: "10:12 AM",
    preview: "Yes, the apartment is av...",
    active: true,
    avatar: "NB",
  },
  {
    id: 2,
    name: "Saman Perera",
    time: "YESTERDAY",
    preview: "Thank you for the paymen...",
    active: false,
    avatar: "SP",
  },
  {
    id: 3,
    name: "Lakeview Management",
    time: "OCT 24",
    preview: "Your maintenance request...",
    active: false,
    avatar: "LM",
  },
  {
    id: 4,
    name: "Elena Rodriguez",
    time: "OCT 22",
    preview: "Please find the updated...",
    active: false,
    avatar: "ER",
  },
];

// ─── Messages ────────────────────────────────────────────────────────────────
type Message = {
  id: number;
  from: "them" | "me";
  text: string;
  time: string;
  status?: string;
};

const initialMessages: Message[] = [
  {
    id: 1,
    from: "them",
    text: "Hello Abiramy! Thanks for inquiring about Colombo Heights Apartment.",
    time: "10:40 AM",
    status: "DELIVERED",
  },
  {
    id: 2,
    from: "me",
    text: "Hi Nimal! Is the property available for a physical walkthrough this week?",
    time: "10:42 AM",
    status: "READ",
  },
  {
    id: 3,
    from: "them",
    text: "Yes, the apartment is available for viewing tomorrow at 10:00 AM. Does that work for you?",
    time: "10:45 AM",
    status: undefined,
  },
];

// ─── Shared Documents ────────────────────────────────────────────────────────
const sharedDocs = ["TENANCY_AGREEMENT.PDF", "HOUSE_RULES_V2.PDF"];

// ─── Page Component ──────────────────────────────────────────────────────────
export default function ChatPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-sm font-bold text-gray-500">Loading chat...</div>}>
      <ChatPageContent />
    </React.Suspense>
  );
}

function ChatPageContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const threadId = searchParams.get('threadId');

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("Eng");
  const [threadDetails, setThreadDetails] = useState<any>(null);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (threadId) {
      fetch(`http://localhost:3001/api/chat/thread/${threadId}`)
        .then(res => res.json())
        .then(data => {
          if (data.thread) {
            setThreadDetails(data.thread);
          }
        })
        .catch(err => console.error("Failed to fetch thread:", err));
    }
  }, [threadId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        from: "me",
        text,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "DELIVERED",
      },
    ]);
    setInput("");
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div
      className="flex w-full max-w-[1200px] mx-auto bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm"
      style={{ height: "600px" }}
    >
      {/* ── Left Sidebar: Conversation List ── */}
      <aside className="w-[200px] min-w-[200px] bg-white border-r border-gray-100 flex flex-col overflow-hidden h-full">
        {/* Title + Search */}
        <div className="px-4 pt-5 pb-3 flex-shrink-0">
          <h2 className="text-[15px] font-black text-[#1A1A1A] tracking-tight mb-3">
            Messages
          </h2>
          <div className="flex items-center gap-2 border border-gray-200 rounded-full px-3 py-1.5 bg-white">
            <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <input
              id="chat-search-inbox"
              type="text"
              placeholder="SEARCH INBOX"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-[10px] font-bold tracking-widest text-gray-400 placeholder-gray-400 bg-transparent outline-none w-full"
            />
          </div>
        </div>

        {/* Scrollable: Conversation Items */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          {conversations
            .filter((c) =>
              c.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((convo) => (
              <button
                key={convo.id}
                id={`chat-convo-${convo.id}`}
                className={`w-full text-left px-4 py-3 border-b border-gray-50 transition-colors ${
                  convo.active
                    ? "bg-white border-l-[3px] border-l-[#1A1A1A]"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[12px] font-bold truncate text-[#1A1A1A]">
                    {convo.name}
                  </span>
                  <span className="text-[9px] text-gray-400 font-medium ml-1 whitespace-nowrap">
                    {convo.time}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 truncate leading-tight">
                  {convo.preview}
                </p>
                {convo.active && (
                  <div className="mt-1.5 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A]" />
                    <span className="text-[9px] font-bold tracking-widest text-[#1A1A1A] uppercase">
                      Active Thread
                    </span>
                  </div>
                )}
              </button>
            ))}
        </div>
      </aside>

      {/* ── Center: Chat Area ── */}
      <section className="flex-1 flex flex-col bg-white overflow-hidden min-w-0 h-full">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-[11px] font-bold">
                {threadDetails?.owner?.firstName?.charAt(0).toUpperCase() || "O"}
              </span>
            </div>
            <div>
              <h3 className="text-[14px] font-black text-[#1A1A1A] leading-tight">
                {threadDetails?.owner?.firstName ? `${threadDetails.owner.firstName} ${threadDetails.owner.lastName || ''}` : "Owner"}
              </h3>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-[10px] font-bold tracking-widest text-green-600 uppercase">
                  Available Now
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="text-[11px] font-bold text-[#1A1A1A] bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <option value="Eng">English</option>
              <option value="Sin">Sinhala</option>
              <option value="Tam">Tamil</option>
            </select>
            <button
              id="chat-more-options-btn"
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              aria-label="More options"
            >
              <MoreVertical className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Scrollable: Message Bubbles */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-5 space-y-4">
          {/* Date Divider */}
          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase whitespace-nowrap">
              October 28, 2024
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Message Bubbles */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.from === "me" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-[68%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed font-medium ${
                  msg.from === "me"
                    ? "bg-[#1A1A1A] text-white rounded-br-sm"
                    : "bg-gray-100 text-[#1A1A1A] rounded-bl-sm"
                }`}
              >
                {msg.text}
              </div>
              <div className="mt-1 flex items-center gap-1">
                <span className="text-[10px] text-gray-400">{msg.time}</span>
                {msg.status && (
                  <>
                    <span className="text-[10px] text-gray-300">•</span>
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                      {msg.status}
                    </span>
                  </>
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Message Input */}
        <div className="px-4 py-3 border-t border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3 border border-gray-200 rounded-full px-4 py-2.5 bg-white focus-within:border-gray-400 transition-colors">
            <button
              id="chat-attach-btn"
              className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Attach file"
            >
              <Paperclip className="w-4 h-4 text-gray-400" />
            </button>
            <input
              id="chat-message-input"
              type="text"
              placeholder="TYPE YOUR MESSAGE..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              className="flex-1 text-[12px] font-bold tracking-widest text-[#1A1A1A] placeholder-gray-300 bg-transparent outline-none"
            />
            <button
              id="chat-send-btn"
              onClick={sendMessage}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-[#1A1A1A] hover:bg-black rounded-full transition-colors shadow-md"
              aria-label="Send message"
            >
              <Send className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>
      </section>

      {/* ── Right Sidebar: Subject Context ── */}
      <aside className="w-[180px] min-w-[180px] bg-[#F0EEF8] border-l border-gray-100 flex flex-col overflow-y-auto px-3 py-4 gap-4">
        <h3 className="text-[9px] font-black tracking-widest text-gray-500 uppercase">
          Subject Context
        </h3>

        {/* Project Card */}
        <div className="bg-white rounded-xl overflow-hidden shadow-sm">
          <div
            className="relative w-full h-[80px] bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center"
          >
            {threadDetails?.property?.images?.[0] ? (
              <img src={threadDetails.property.images[0]} alt="Property" className="absolute inset-0 w-full h-full object-cover opacity-50" />
            ) : (
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)",
                  backgroundSize: "8px 8px",
                }}
              />
            )}
            <span className="relative text-[9px] font-black tracking-widest text-white uppercase bg-black/40 px-2 py-1 rounded z-10">
              Interested Property
            </span>
          </div>
          <div className="p-2.5">
            <p className="text-[12px] font-black text-[#1A1A1A] leading-tight truncate" title={threadDetails?.property?.title || "Select a property"}>
              {threadDetails?.property?.title || "Colombo Heights"}
            </p>
            <p className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mt-0.5 truncate">
              {threadDetails?.property?.address ? `${threadDetails.property.address} • ${threadDetails.property.type}` : "Apt 12B • Residential"}
            </p>
            {threadDetails?.property?.price && (
              <p className="text-[11px] font-extrabold text-emerald-600 mt-1">
                Rs. {threadDetails.property.price.toLocaleString()}/mo
              </p>
            )}
          </div>
        </div>

        {/* Next Visit */}
        <div>
          <p className="text-[9px] font-black tracking-widest text-gray-400 uppercase mb-1.5">
            Next Visit
          </p>
          <div className="flex items-center gap-2">
            <Calendar className="w-3 h-3 text-gray-500 flex-shrink-0" />
            <span className="text-[11px] font-bold text-[#1A1A1A]">
              OCT 29, 2024
            </span>
          </div>
        </div>

        {/* Status */}
        <div>
          <p className="text-[9px] font-black tracking-widest text-gray-400 uppercase mb-1.5">
            Status
          </p>
          <div className="flex items-center gap-2">
            <FileText className="w-3 h-3 text-gray-500 flex-shrink-0" />
            <span className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-wide">
              Pending Visit
            </span>
          </div>
        </div>

        {/* Shared Documents */}
        <div>
          <p className="text-[9px] font-black tracking-widest text-gray-400 uppercase mb-1.5">
            Shared Documents (2)
          </p>
          <div className="flex flex-col gap-1.5">
            {sharedDocs.map((doc) => (
              <button
                key={doc}
                id={`chat-doc-${doc.replace(/\./g, "-").toLowerCase()}`}
                className="flex items-center gap-2 bg-white rounded-lg px-2.5 py-1.5 shadow-sm hover:shadow-md transition-shadow text-left w-full"
              >
                <FileText className="w-3 h-3 text-gray-500 flex-shrink-0" />
                <span className="text-[9px] font-bold text-[#1A1A1A] tracking-wide truncate">
                  {doc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Reschedule Visit */}
        <button
          id="chat-reschedule-visit-btn"
          className="w-full border-2 border-[#1A1A1A] text-[#1A1A1A] text-[9px] font-black tracking-widest uppercase py-2.5 rounded-lg hover:bg-[#1A1A1A] hover:text-white transition-colors"
        >
          Reschedule Visit
        </button>
      </aside>
    </div>
  );
}
