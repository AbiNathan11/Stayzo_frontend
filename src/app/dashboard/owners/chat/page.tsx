"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  ArrowRight,
  Search,
  MoreVertical,
  Paperclip,
  Send,
  Calendar,
  FileText,
} from "lucide-react";

// ─── Nav Links ──────────────────────────────────────────────────────────────
const navLinks = [
  { label: "Home", href: "/dashboard/owners" },
  { label: "Listings", href: "/dashboard/owners/listings" },
  { label: "Appointments", href: "/dashboard/owners/appointments" },
  { label: "Chat", href: "/dashboard/owners/chat" },
  { label: "Profile", href: "/dashboard/owners/profile" },
];

// ─── Conversation List ───────────────────────────────────────────────────────
const conversations = [
  {
    id: 1,
    name: "Julianne Voss",
    time: "10:42 AM",
    preview: "The structural report for...",
    active: true,
    avatar: "JV",
  },
  {
    id: 2,
    name: "Marcus Thorne",
    time: "YESTERDAY",
    preview: "Are we still on for the sit...",
    active: false,
    avatar: "MT",
  },
  {
    id: 3,
    name: "Architectural Board",
    time: "OCT 24",
    preview: "Submission confirmed fo...",
    active: false,
    avatar: "AB",
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
    text: "Hello! I've just uploaded the revised floor plans for the Chelsea project. Could you take a look at the balcony dimensions in Zone 4?",
    time: "10:40 AM",
    status: "DELIVERED",
  },
  {
    id: 2,
    from: "me",
    text: "On it now. The previous constraints from the zoning department were a bit tight. I'll see if the 2.5m extension holds up against the structural calc.",
    time: "10:42 AM",
    status: "READ",
  },
  {
    id: 3,
    from: "them",
    text: "Exactly my concern. Also, the structural report for the Chelsea penthouse is ready for your review. It's high-signal data, might need a deep dive this afternoon.",
    time: "10:45 AM",
    status: undefined,
  },
];

// ─── Shared Documents ────────────────────────────────────────────────────────
const sharedDocs = ["FLOOR_PLANS_V2.PDF", "STRUCT_REPORT_01.PDF"];

// ─── Page Component ──────────────────────────────────────────────────────────
export default function ChatPage() {
  const pathname = usePathname();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
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
    <div className="h-screen flex flex-col bg-[#F0EEF8] overflow-hidden">
      {/* ── Navbar ── */}
      <header className="w-full bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-[60px] flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="flex items-end space-x-[3px] h-5">
              <div className="w-[3px] h-3 bg-[#1A1A1A] rounded-full" />
              <div className="w-[3px] h-5 bg-[#1A1A1A] rounded-full" />
              <div className="w-[3px] h-4 bg-[#1A1A1A] rounded-full" />
              <div className="w-[3px] h-2.5 bg-[#1A1A1A] rounded-full" />
            </div>
            <span className="text-[15px] font-black tracking-tight text-[#1A1A1A] uppercase">
              Stayzo
            </span>
          </Link>

          {/* Center Nav */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-4 py-2 text-[13px] font-semibold rounded-full transition-colors ${
                    isActive
                      ? "text-[#1A1A1A] border-b-2 border-[#1A1A1A] rounded-none pb-1"
                      : "text-gray-500 hover:text-[#1A1A1A] hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="flex items-center space-x-1.5 bg-[#1A1A1A] hover:bg-black text-white text-[12px] font-extrabold tracking-wider uppercase px-5 py-2.5 rounded-full transition-colors shadow-md"
            >
              <span>I am a Tenant</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              id="chat-notifications-btn"
              className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-[#1A1A1A]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#1A1A1A] rounded-full" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Body: 3-Column Layout ── */}
      <main className="flex flex-1 overflow-hidden w-full">
        {/* ── Left Sidebar: Conversation List ── */}
        <aside className="w-[210px] min-w-[210px] bg-white border-r border-gray-100 flex flex-col overflow-hidden">
          <div className="px-4 pt-5 pb-3">
            <h2 className="text-[15px] font-black text-[#1A1A1A] tracking-tight mb-3">
              Messages
            </h2>
            {/* Search */}
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

          {/* Conversation Items */}
          <div className="flex-1 overflow-y-auto">
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
                    <span
                      className={`text-[12px] font-bold truncate ${
                        convo.active ? "text-[#1A1A1A]" : "text-[#1A1A1A]"
                      }`}
                    >
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
        <section className="flex-1 flex flex-col bg-white overflow-hidden min-w-0">
          {/* Chat Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0">
                <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                  <span className="text-white text-[12px] font-bold">JV</span>
                </div>
              </div>
              <div>
                <h3 className="text-[15px] font-black text-[#1A1A1A]">
                  Julianne Voss
                </h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-[10px] font-bold tracking-widest text-green-600 uppercase">
                    Available Now
                  </span>
                </div>
              </div>
            </div>
            <button
              id="chat-more-options-btn"
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              aria-label="More options"
            >
              <MoreVertical className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-x-auto overflow-y-auto px-6 py-6 space-y-4">
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
                  className={`max-w-[65%] px-5 py-3.5 rounded-3xl text-[13px] leading-relaxed font-medium ${
                    msg.from === "me"
                      ? "bg-[#1A1A1A] text-white rounded-br-lg"
                      : "bg-gray-100 text-[#1A1A1A] rounded-bl-lg"
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
          <div className="px-6 py-4 border-t border-gray-100">
            <div className="flex items-center gap-3 border-2 border-gray-200 rounded-2xl px-4 py-3 bg-white focus-within:border-gray-400 transition-colors">
              <button
                id="chat-attach-btn"
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
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
                className="flex-shrink-0 w-9 h-9 flex items-center justify-center bg-[#1A1A1A] hover:bg-black rounded-full transition-colors shadow-md"
                aria-label="Send message"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </section>

        {/* ── Right Sidebar: Subject Context ── */}
        <aside className="w-[210px] min-w-[210px] bg-[#F0EEF8] border-l border-gray-100 flex flex-col overflow-y-auto px-4 py-5 gap-5">
          <h3 className="text-[10px] font-black tracking-widest text-gray-500 uppercase">
            Subject Context
          </h3>

          {/* Project Card */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            {/* Project Image Placeholder */}
            <div className="relative w-full h-[90px] bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
              <div className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)",
                  backgroundSize: "8px 8px",
                }}
              />
              <span className="relative text-[10px] font-black tracking-widest text-white uppercase bg-black/40 px-3 py-1 rounded">
                Project Alpha
              </span>
            </div>
            <div className="p-3">
              <p className="text-[13px] font-black text-[#1A1A1A] leading-tight">
                Chelsea Penthouse B
              </p>
              <p className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mt-0.5">
                Zone 4 • Residential
              </p>
            </div>
          </div>

          {/* Last Inspection */}
          <div>
            <p className="text-[9px] font-black tracking-widest text-gray-400 uppercase mb-2">
              Last Inspection
            </p>
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
              <span className="text-[11px] font-bold text-[#1A1A1A]">
                OCT 24, 2024
              </span>
            </div>
          </div>

          {/* Status */}
          <div>
            <p className="text-[9px] font-black tracking-widest text-gray-400 uppercase mb-2">
              Status
            </p>
            <div className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
              <span className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-wide">
                Structural Review
              </span>
            </div>
          </div>

          {/* Shared Documents */}
          <div>
            <p className="text-[9px] font-black tracking-widest text-gray-400 uppercase mb-2">
              Shared Documents (4)
            </p>
            <div className="flex flex-col gap-2">
              {sharedDocs.map((doc) => (
                <button
                  key={doc}
                  id={`chat-doc-${doc.replace(/\./g, "-").toLowerCase()}`}
                  className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-sm hover:shadow-md transition-shadow text-left w-full"
                >
                  <FileText className="w-3 h-3 text-gray-500 flex-shrink-0" />
                  <span className="text-[9px] font-bold text-[#1A1A1A] tracking-wide truncate">
                    {doc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Schedule Site Visit */}
          <button
            id="chat-schedule-visit-btn"
            className="w-full border-2 border-[#1A1A1A] text-[#1A1A1A] text-[10px] font-black tracking-widest uppercase py-3 rounded-lg hover:bg-[#1A1A1A] hover:text-white transition-colors"
          >
            Schedule Site Visit
          </button>
        </aside>
      </main>


    </div>
  );
}
