"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon, Clock, MapPin, CheckCircle2,
  XCircle, Clock4, ChevronLeft, ChevronRight, Plus,
  AlertCircle, MessageSquare, RefreshCw, X
} from "lucide-react";
import {
  useTenantBookings, usePropertySlots,
  bookSlot, cancelBookingApi, rescheduleBookingApi,
  Booking, Slot
} from "@/hooks/useBookings";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function formatDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function formatTime12(t: string) {
  const [h, m] = t.split(":").map(Number);
  const ampm = h < 12 ? "AM" : "PM";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

const statusConfig = {
  PENDING:   { label: "Awaiting Owner",  icon: Clock4,        color: "bg-amber-50 text-amber-600 border-amber-200",   bar: "bg-amber-400" },
  CONFIRMED: { label: "Confirmed",       icon: CheckCircle2,  color: "bg-emerald-50 text-emerald-600 border-emerald-200", bar: "bg-emerald-500" },
  CANCELLED: { label: "Cancelled",       icon: XCircle,       color: "bg-red-50 text-red-500 border-red-200",         bar: "bg-red-400" },
  COMPLETED: { label: "Completed",       icon: CheckCircle2,  color: "bg-gray-100 text-gray-500 border-gray-200",     bar: "bg-gray-400" },
};

type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
type TabType = "upcoming" | "pending" | "cancelled";

export default function VisitsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("upcoming");
  const [calYear, setCalYear]     = useState(new Date().getFullYear());
  const [calMonth, setCalMonth]   = useState(new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState<string>(formatDate(new Date()));
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Book-a-slot modal state
  const [showBookModal, setShowBookModal]     = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [selectedSlot, setSelectedSlot]       = useState<Slot | null>(null);
  const [note, setNote]                       = useState("");
  const [bookingLoading, setBookingLoading]   = useState(false);
  const [toast, setToast]                     = useState("");

  // Reschedule modal
  const [rescheduleBooking, setRescheduleBooking] = useState<Booking | null>(null);
  const [newSlot, setNewSlot]                     = useState<Slot | null>(null);

  // Cancel confirm
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);

  // User's properties list (to pick which property to book)
  const [properties, setProperties] = useState<{ id: string; title: string; address: string }[]>([]);

  const { bookings, loading, error, refresh } = useTenantBookings();
  const { slots: availableSlots, loading: slotsLoading, refresh: refreshSlots } = usePropertySlots(selectedPropertyId);

  // Load properties list
  useEffect(() => {
    fetch("http://localhost:3001/api/properties")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProperties(data.map((p: any) => ({ id: p.id, title: p.title, address: p.address })));
          if (data.length > 0) setSelectedPropertyId(data[0].id);
        }
      })
      .catch(() => {});
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  // Calendar helpers
  const firstDay    = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

  const bookingsOnDate = (dateStr: string) =>
    bookings.filter(b => b.slot?.date?.startsWith(dateStr));
  const slotsOnDate = (dateStr: string) =>
    availableSlots.filter(s => !s.isBlocked && s.date.startsWith(dateStr));
  const blockedOnDate = (dateStr: string) =>
    availableSlots.some(s => s.isBlocked && s.date.startsWith(dateStr));

  const slotsForSelectedDate = slotsOnDate(selectedDate).filter(s => {
    const alreadyBooked = s.bookings?.filter(b => ["PENDING", "CONFIRMED"].includes(b.status)).length || 0;
    return alreadyBooked < s.maxBookings;
  });

  // Tab filtering
  const filteredBookings = bookings.filter(b => {
    if (activeTab === "upcoming")   return ["CONFIRMED", "COMPLETED"].includes(b.status);
    if (activeTab === "pending")    return b.status === "PENDING";
    if (activeTab === "cancelled")  return b.status === "CANCELLED";
    return true;
  });

  const pendingCount   = bookings.filter(b => b.status === "PENDING").length;
  const confirmedCount = bookings.filter(b => b.status === "CONFIRMED").length;

  // ── Actions ──
  const handleBook = async () => {
    if (!selectedSlot) return;
    setBookingLoading(true);
    try {
      await bookSlot(selectedSlot.id, note);
      setSuccessMessage("Booking request sent successfully!");
      refresh();
      setShowBookModal(false);
      setSelectedSlot(null);
      setNote("");
    } catch (e: any) {
      showToast(`❌ ${e.message}`);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleCancel = async (bookingId: string) => {
    try {
      await cancelBookingApi(bookingId);
      setSuccessMessage("Booking cancelled successfully.");
      refresh();
    } catch (e: any) {
      showToast(`❌ ${e.message}`);
    } finally {
      setCancelTarget(null);
    }
  };

  const handleReschedule = async () => {
    if (!rescheduleBooking || !newSlot) return;
    try {
      await rescheduleBookingApi(rescheduleBooking.id, newSlot.id);
      setSuccessMessage("Visit rescheduled successfully!");
      refresh();
      setRescheduleBooking(null);
      setNewSlot(null);
    } catch (e: any) {
      showToast(`❌ ${e.message}`);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-[#1A1A1A] text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold animate-in slide-in-from-top-2 duration-300">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Visit Scheduler</h2>
          <p className="text-gray-500 text-xs font-semibold mt-1">
            Browse available slots and book property viewings.
          </p>
        </div>
        <button
          onClick={() => setShowBookModal(true)}
          className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-black text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition"
        >
          <Plus className="w-4 h-4" /> Request New Visit
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Confirmed",  value: confirmedCount, color: "text-emerald-600 bg-emerald-50" },
          { label: "Pending",    value: pendingCount,   color: "text-amber-600 bg-amber-50" },
          { label: "Total",      value: bookings.length, color: "text-[#1A1A1A] bg-gray-50" },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-2xl p-4 text-center shadow-sm">
            <p className={`text-2xl font-black ${s.color.split(" ")[0]}`}>{s.value}</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── Calendar ── */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-[#1A1A1A]">{MONTHS[calMonth]} {calYear}</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); }}
                className="p-2 border border-gray-200 hover:bg-gray-50 rounded-xl transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); }}
                className="p-2 border border-gray-200 hover:bg-gray-50 rounded-xl transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Property selector */}
          <div className="mb-5">
            <select
              value={selectedPropertyId}
              onChange={e => setSelectedPropertyId(e.target.value)}
              className="text-xs font-semibold text-gray-600 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-[#1A1A1A] w-full sm:w-auto"
            >
              <option value="">All properties</option>
              {properties.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mb-4 text-[10px] font-semibold text-gray-500">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" />Available</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#1A1A1A]" />Your Booking</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-300" />Blocked</span>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2">
            {DAYS.map(day => (
              <div key={day} className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider">{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2 md:gap-4">
            {Array(firstDay).fill(null).map((_, i) => <div key={`e${i}`} className="aspect-square" />)}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const isSelected   = selectedDate === dateStr;
              const isToday      = dateStr === formatDate(new Date());
              const myBookings   = bookingsOnDate(dateStr);
              const freeSlots    = slotsOnDate(dateStr);
              const isBlocked    = blockedOnDate(dateStr);
              const hasConfirmed = myBookings.some(b => b.status === "CONFIRMED");
              const hasPending   = myBookings.some(b => b.status === "PENDING");

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`aspect-square flex flex-col items-center justify-center rounded-2xl border transition cursor-pointer ${
                    isSelected
                      ? "bg-[#1A1A1A] border-[#1A1A1A] text-white"
                      : isBlocked
                      ? "bg-red-50 border-red-100 text-red-300"
                      : "border-transparent hover:bg-gray-50 text-gray-700 font-semibold"
                  } ${isToday && !isSelected ? "border-2 border-[#1A1A1A]" : ""}`}
                >
                  <span className="text-sm font-bold">{day}</span>
                  <div className="flex gap-0.5 mt-0.5">
                    {freeSlots.length > 0 && <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white" : "bg-emerald-400"}`} />}
                    {(hasConfirmed || hasPending) && <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white" : "bg-[#1A1A1A]"}`} />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Available Slots for selected date */}
          {selectedPropertyId && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h4 className="text-sm font-bold text-[#1A1A1A] mb-3">
                Available Slots — {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
              </h4>
              {slotsLoading ? (
                <p className="text-xs text-gray-400">Loading slots…</p>
              ) : blockedOnDate(selectedDate) ? (
                <div className="flex items-center gap-2 text-xs text-red-400 font-semibold p-3 bg-red-50 rounded-xl">
                  <AlertCircle className="w-4 h-4" /> This date is not available
                </div>
              ) : slotsForSelectedDate.length === 0 ? (
                <p className="text-xs text-gray-400 font-semibold">No available slots on this date</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {slotsForSelectedDate.map(slot => (
                    <button
                      key={slot.id}
                      onClick={() => { setSelectedSlot(slot); setShowBookModal(true); }}
                      className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-bold transition"
                    >
                      <Clock className="w-3 h-3" />
                      {formatTime12(slot.startTime)} – {formatTime12(slot.endTime)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Bookings Sidebar ── */}
        <div className="lg:col-span-1 space-y-4">
          {/* Tabs */}
          <div className="flex items-center gap-1 border-b border-gray-200 pb-2">
            {([
              { key: "upcoming",  label: "Upcoming",  count: confirmedCount },
              { key: "pending",   label: "Pending",   count: pendingCount },
              { key: "cancelled", label: "Cancelled", count: 0 },
            ] as const).map(t => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 ${
                  activeTab === t.key ? "bg-[#1A1A1A] text-white" : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {t.label}
                {t.count > 0 && (
                  <span className={`w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-black ${activeTab === t.key ? "bg-white text-[#1A1A1A]" : "bg-gray-200 text-gray-600"}`}>
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Booking Cards */}
          {loading ? (
            <div className="text-xs text-gray-400 text-center py-8">Loading your bookings…</div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <CalendarIcon className="w-10 h-10 mx-auto mb-3 text-gray-200" />
              <p className="text-xs font-semibold">No {activeTab} bookings</p>
            </div>
          ) : (
            filteredBookings.map(booking => {
              const cfg = statusConfig[booking.status as BookingStatus] || statusConfig.PENDING;
              const StatusIcon = cfg.icon;
              const slotDate = booking.slot?.date
                ? new Date(booking.slot.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
                : "—";

              return (
                <div key={booking.id} className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm relative overflow-hidden group">
                  <div className={`absolute top-0 left-0 w-1.5 h-full ${cfg.bar}`} />

                  <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider border px-2.5 py-1 rounded-lg w-fit mb-3 ${cfg.color}`}>
                    <StatusIcon className="w-3 h-3" /> {cfg.label}
                  </span>

                  <h3 className="text-sm font-bold text-[#1A1A1A] mb-3 leading-tight">
                    {booking.property?.title || "Property"}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2.5 text-xs font-semibold text-gray-600">
                      <CalendarIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{slotDate}</span>
                    </div>
                    {booking.slot && (
                      <div className="flex items-center gap-2.5 text-xs font-semibold text-gray-600">
                        <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span>{formatTime12(booking.slot.startTime)} – {formatTime12(booking.slot.endTime)}</span>
                      </div>
                    )}
                    {booking.property?.address && (
                      <div className="flex items-center gap-2.5 text-xs font-semibold text-gray-600">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="truncate">{booking.property.address}</span>
                      </div>
                    )}
                    {booking.note && (
                      <div className="flex items-start gap-2.5 text-xs text-gray-400 italic">
                        <MessageSquare className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>"{booking.note}"</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    {booking.status === "PENDING" && (
                      <button
                        onClick={() => { setRescheduleBooking(booking); setSelectedPropertyId(booking.propertyId); }}
                        className="w-full flex items-center justify-center gap-1.5 bg-[#1A1A1A] hover:bg-black text-white py-2.5 rounded-xl text-xs font-bold shadow-sm transition"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Reschedule
                      </button>
                    )}
                    {["CONFIRMED", "PENDING"].includes(booking.status) && (
                      <button
                        onClick={() => setCancelTarget(booking.id)}
                        className="w-full flex items-center justify-center gap-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 py-2.5 rounded-xl text-xs font-bold transition"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Cancel
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Book Modal ── */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-[#1A1A1A] text-lg">Book a Visit</h3>
              <button onClick={() => { setShowBookModal(false); setSelectedSlot(null); }} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Property picker */}
            <div className="mb-4">
              <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Property</label>
              <select
                value={selectedPropertyId}
                onChange={e => { setSelectedPropertyId(e.target.value); setSelectedSlot(null); refreshSlots(); }}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#1A1A1A]"
              >
                <option value="">Select a property…</option>
                {properties.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
            </div>

            {/* Date picker */}
            <div className="mb-4">
              <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Date</label>
              <input
                type="date"
                value={selectedDate}
                min={formatDate(new Date())}
                onChange={e => { setSelectedDate(e.target.value); setSelectedSlot(null); }}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#1A1A1A]"
              />
            </div>

            {/* Time slot picker */}
            <div className="mb-4">
              <label className="text-[10px] uppercase font-bold text-gray-400 block mb-2">Available Slots</label>
              {slotsLoading ? (
                <p className="text-xs text-gray-400">Loading…</p>
              ) : slotsForSelectedDate.length === 0 ? (
                <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-400 font-semibold text-center">
                  No slots available on this date
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {slotsForSelectedDate.map(slot => (
                    <button
                      key={slot.id}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2.5 rounded-xl text-xs font-bold border transition ${
                        selectedSlot?.id === slot.id
                          ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                          : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      {formatTime12(slot.startTime)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Note */}
            <div className="mb-5">
              <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Note to Owner (optional)</label>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                rows={2}
                placeholder="Any special requests or questions…"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none outline-none focus:border-[#1A1A1A]"
              />
            </div>

            {selectedSlot && (
              <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs font-semibold text-emerald-700 mb-4">
                <CheckCircle2 className="w-4 h-4" />
                Selected: {formatTime12(selectedSlot.startTime)} – {formatTime12(selectedSlot.endTime)} · {selectedSlot.slotDuration} min
              </div>
            )}

            <div className="flex gap-2">
              <button onClick={() => { setShowBookModal(false); setSelectedSlot(null); }}
                className="flex-1 py-3 border border-gray-200 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50 transition">
                Cancel
              </button>
              <button
                onClick={handleBook}
                disabled={!selectedSlot || bookingLoading}
                className="flex-1 py-3 bg-[#1A1A1A] text-white rounded-xl text-xs font-bold hover:bg-black transition disabled:opacity-40"
              >
                {bookingLoading ? "Sending…" : "Confirm Booking"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Reschedule Modal ── */}
      {rescheduleBooking && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-[#1A1A1A] text-lg">Reschedule Visit</h3>
              <button onClick={() => { setRescheduleBooking(null); setNewSlot(null); }}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-500 mb-4">
              Rescheduling: <span className="font-bold text-[#1A1A1A]">{rescheduleBooking.property?.title}</span>
            </p>

            <div className="mb-4">
              <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">New Date</label>
              <input
                type="date"
                value={selectedDate}
                min={formatDate(new Date())}
                onChange={e => { setSelectedDate(e.target.value); setNewSlot(null); }}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#1A1A1A]"
              />
            </div>

            <div className="mb-5">
              <label className="text-[10px] uppercase font-bold text-gray-400 block mb-2">Available Slots</label>
              {slotsLoading ? (
                <p className="text-xs text-gray-400">Loading…</p>
              ) : slotsForSelectedDate.length === 0 ? (
                <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-400 text-center font-semibold">
                  No slots available on this date
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {slotsForSelectedDate.map(slot => (
                    <button key={slot.id} onClick={() => setNewSlot(slot)}
                      className={`py-2.5 rounded-xl text-xs font-bold border transition ${
                        newSlot?.id === slot.id
                          ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                          : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                      }`}>
                      {formatTime12(slot.startTime)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button onClick={() => { setRescheduleBooking(null); setNewSlot(null); }}
                className="flex-1 py-3 border border-gray-200 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50 transition">
                Go Back
              </button>
              <button onClick={handleReschedule} disabled={!newSlot}
                className="flex-1 py-3 bg-[#1A1A1A] text-white rounded-xl text-xs font-bold hover:bg-black transition disabled:opacity-40">
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Cancel Confirm Dialog ── */}
      {cancelTarget && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center">
            <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="font-bold text-[#1A1A1A] text-lg mb-2">Cancel this visit?</h3>
            <p className="text-xs text-gray-500 mb-6">This action cannot be undone. The owner will be notified.</p>
            <div className="flex gap-2">
              <button onClick={() => setCancelTarget(null)}
                className="flex-1 py-3 border border-gray-200 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50 transition">
                Keep it
              </button>
              <button onClick={() => handleCancel(cancelTarget)}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition">
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SUCCESS POPUP ── */}
      {successMessage && (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center transform transition-all animate-in zoom-in-95">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="font-extrabold text-[#1A1A1A] text-xl mb-2">Success!</h3>
            <p className="text-sm text-gray-500 font-medium mb-8">{successMessage}</p>
            <button
              onClick={() => setSuccessMessage(null)}
              className="w-full py-3.5 bg-[#1A1A1A] text-white rounded-xl text-sm font-bold hover:bg-black transition shadow-md"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
