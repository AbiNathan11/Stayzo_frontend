"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar, Clock, Plus, Trash2, Check, X, Settings,
  RefreshCw, CalendarOff, ChevronLeft, ChevronRight,
  Bell, AlertCircle, CheckCircle2, Clock4, Filter,
  ToggleLeft, ToggleRight, User, XCircle
} from "lucide-react";
import {
  useOwnerBookings, useOwnerSlots, useOwnerSettings,
  createSlotApi, createRecurringApi, blockDatesApi,
  deleteSlotApi, approveBookingApi, rejectBookingApi, cancelBookingApi,
  Booking, Slot
} from "@/hooks/useBookings";
import OwnerNavbar from "@/components/OwnerNavbar";


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

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700 border-amber-200",
  CONFIRMED: "bg-emerald-100 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-red-100 text-red-600 border-red-200",
  COMPLETED: "bg-gray-100 text-gray-600 border-gray-200",
};

export default function OwnerAppointmentsPage() {
  const [tab, setTab] = useState<"availability" | "bookings" | "settings">("availability");
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState<string>(formatDate(new Date()));
  const [toast, setToast] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Slot creation
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createMode, setCreateMode] = useState<"single" | "recurring" | "block">("single");
  const [newSlot, setNewSlot] = useState({
    propertyId: "", date: formatDate(new Date()),
    startTime: "09:00", endTime: "17:00",
    slotDuration: 30, bufferTime: 0, maxBookings: 1,
  });
  const [recurringForm, setRecurringForm] = useState({
    propertyId: "", dayOfWeek: 6,
    startTime: "10:00", endTime: "16:00",
    slotDuration: 30, weeksAhead: 8,
  });
  const [blockForm, setBlockForm] = useState({
    propertyId: "", startDate: formatDate(new Date()), endDate: ""
  });

  // Properties from token
  const [properties, setProperties] = useState<{ id: string; title: string }[]>([]);
  const [ownerId, setOwnerId] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem('stayzo_token');
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setOwnerId(payload.id || "");
    } catch {}
    // Fetch owner's properties
    fetch("http://localhost:3001/api/properties", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          const token2 = sessionStorage.getItem('stayzo_token')!;
          const p2 = JSON.parse(atob(token2.split(".")[1]));
          const myProps = data.filter((p: any) => p.ownerId === p2.id);
          setProperties(myProps.map((p: any) => ({ id: p.id, title: p.title })));
          if (myProps.length > 0) {
            setNewSlot(f => ({ ...f, propertyId: myProps[0].id }));
            setRecurringForm(f => ({ ...f, propertyId: myProps[0].id }));
            setBlockForm(f => ({ ...f, propertyId: myProps[0].id }));
          }
        }
      })
      .catch(() => {});
  }, []);

  const { slots, loading: slotsLoading, refresh: refreshSlots } = useOwnerSlots();
  const { bookings, loading: bookingsLoading, refresh: refreshBookings } = useOwnerBookings();
  const { settings, loading: settingsLoading, updateSettings } = useOwnerSettings();

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  // Calendar helpers
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

  // Safely extract YYYY-MM-DD from a UTC ISO date string
  const slotDateStr = (isoDate: string | undefined) => (isoDate ?? "").slice(0, 10);

  const slotsForDate = (dateStr: string) =>
    slots.filter(s => !s.isBlocked && slotDateStr(s.date) === dateStr);
  const blockedOnDate = (dateStr: string) =>
    slots.some(s => s.isBlocked && slotDateStr(s.date) === dateStr);
  const hasBookingOnDate = (dateStr: string) =>
    bookings.some(b => slotDateStr(b.slot?.date) === dateStr && b.status === "CONFIRMED");

  const selectedSlots = slotsForDate(selectedDate);
  const isPastSelected = selectedDate < formatDate(new Date());

  // ── Actions ──
  const handleCreateSlot = async () => {
    if (!newSlot.propertyId) return showToast("Select a property first");

    // Prevent creating slots in the past
    const now = new Date();
    if (newSlot.date === formatDate(now)) {
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const [h, m] = newSlot.startTime.split(":").map(Number);
      if (h * 60 + m <= currentMinutes) {
        setErrorMessage("Cannot create availability in the past");
        return;
      }
    }

    setActionLoading("create");
    try {
      await createSlotApi(newSlot);
      setSuccessMessage("Slots created successfully!");
      refreshSlots();
      setShowCreateModal(false);
    } catch (e: any) { showToast(`❌ ${e.message}`); }
    finally { setActionLoading(null); }
  };

  const handleCreateRecurring = async () => {
    if (!recurringForm.propertyId) return showToast("Select a property first");
    setActionLoading("recurring");
    try {
      const res = await createRecurringApi(recurringForm);
      setSuccessMessage(res.message || "Recurring availability created successfully!");
      refreshSlots();
      setShowCreateModal(false);
    } catch (e: any) { showToast(`❌ ${e.message}`); }
    finally { setActionLoading(null); }
  };

  const handleBlockDates = async () => {
    if (!blockForm.propertyId) return showToast("Select a property first");
    setActionLoading("block");
    try {
      const res = await blockDatesApi(blockForm);
      showToast(`✅ ${res.message}`);
      refreshSlots();
      setShowCreateModal(false);
    } catch (e: any) { showToast(`❌ ${e.message}`); }
    finally { setActionLoading(null); }
  };

  const handleDeleteSlot = async (slotId: string) => {
    setActionLoading(slotId);
    try {
      await deleteSlotApi(slotId);
      showToast("✅ Slot deleted");
      refreshSlots();
    } catch (e: any) { showToast(`❌ ${e.message}`); }
    finally { setActionLoading(null); }
  };

  const handleApprove = async (bookingId: string) => {
    setActionLoading(bookingId);
    try {
      await approveBookingApi(bookingId);
      setSuccessMessage("Booking approved successfully!");
      refreshBookings();
    } catch (e: any) { showToast(`❌ ${e.message}`); }
    finally { setActionLoading(null); }
  };

  const handleReject = async (bookingId: string) => {
    setActionLoading(bookingId);
    try {
      await rejectBookingApi(bookingId);
      setSuccessMessage("Booking rejected successfully.");
      refreshBookings();
    } catch (e: any) { showToast(`❌ ${e.message}`); }
    finally { setActionLoading(null); }
  };

  const handleCancel = async (bookingId: string) => {
    setActionLoading(bookingId);
    try {
      await cancelBookingApi(bookingId);
      setSuccessMessage("Booking cancelled successfully.");
      refreshBookings();
    } catch (e: any) { showToast(`❌ ${e.message}`); }
    finally { setActionLoading(null); }
  };

  const pendingBookings = bookings.filter(b => b.status === "PENDING");
  const confirmedBookings = bookings.filter(b => b.status === "CONFIRMED");

  return (
    <div className="animate-in fade-in duration-300 space-y-6">
          {/* Toast */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-[#4F46E5] text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold animate-in slide-in-from-top-2 duration-300">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Appointments</h2>
          <p className="text-gray-500 text-xs font-semibold mt-1">
            Manage your availability, bookings and scheduling settings.
          </p>
        </div>
        <button
          onClick={() => { setShowCreateModal(true); setCreateMode("single"); }}
          className="flex items-center gap-2 bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#4F46E5] px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Availability
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Slots", value: slots.filter(s => !s.isBlocked).length, icon: Calendar, color: "bg-blue-50 text-[#4F46E5]" },
          { label: "Pending", value: pendingBookings.length, icon: Clock4, color: "bg-amber-50 text-amber-600" },
          { label: "Confirmed", value: confirmedBookings.length, icon: CheckCircle2, color: "bg-emerald-50 text-emerald-600" },
          { label: "Blocked Dates", value: slots.filter(s => s.isBlocked).length, icon: CalendarOff, color: "bg-red-50 text-red-500" },
        ].map(stat => (
          <div key={stat.label} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-[#1A1A1A]">{stat.value}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-2xl w-fit">
        {(["availability", "bookings", "settings"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition capitalize ${
              tab === t ? "bg-white text-[#4F46E5] shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t === "bookings" && pendingBookings.length > 0 ? (
              <span className="flex items-center gap-2">
                {t} <span className="bg-red-500 text-white w-4 h-4 rounded-full text-[9px] flex items-center justify-center">{pendingBookings.length}</span>
              </span>
            ) : t}
          </button>
        ))}
      </div>

      {/* ── TAB: AVAILABILITY ── */}
      {tab === "availability" && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-3 bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[#1A1A1A]">
                {MONTHS[calMonth]} {calYear}
              </h3>
              <div className="flex items-center gap-2">
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

            {/* Legend */}
            <div className="flex items-center gap-4 mb-4 text-[10px] font-semibold text-gray-500">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400"></span>Available</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#4F46E5]"></span>Booked</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-300"></span>Blocked</span>
            </div>

            <div className="grid grid-cols-7 gap-2 md:gap-4 mb-2">
              {DAYS.map(d => (
                <div key={d} className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2 md:gap-4">
              {Array(firstDay).fill(null).map((_, i) => <div key={`e${i}`} className="aspect-square" />)}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const isSelected = selectedDate === dateStr;
                const isToday = dateStr === formatDate(new Date());
                const hasSlots = slotsForDate(dateStr).length > 0;
                const isBlocked = blockedOnDate(dateStr);
                const isBooked = hasBookingOnDate(dateStr);

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`aspect-square flex flex-col items-center justify-center rounded-2xl border transition cursor-pointer ${
                      isSelected
                        ? "bg-[#4F46E5]/10 border-[#4F46E5] text-[#4F46E5]"
                        : isBlocked
                        ? "bg-red-50 border-red-100 text-red-300"
                        : "border-transparent hover:bg-gray-50 text-gray-700 font-semibold"
                    } ${isToday && !isSelected ? "border-2 border-[#4F46E5]" : ""}`}
                  >
                    <span className="text-sm font-bold">{day}</span>
                    {(hasSlots || isBooked || isBlocked) && (
                      <div className="flex gap-0.5 mt-0.5">
                        {hasSlots && <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white" : "bg-emerald-400"}`} />}
                        {isBooked && <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-[#4F46E5]" : "bg-[#4F46E5]"}`} />}
                        {isBlocked && <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white" : "bg-red-300"}`} />}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Date Slots */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-bold text-[#1A1A1A] text-sm">
                    {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                  </h4>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{selectedSlots.length} slot(s)</p>
                </div>
                <button
                  disabled={isPastSelected}
                  onClick={() => { setNewSlot(f => ({ ...f, date: selectedDate })); setShowCreateModal(true); setCreateMode("single"); }}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition cursor-pointer ${isPastSelected ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#4F46E5] text-white hover:bg-[#4338CA]'}`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {blockedOnDate(selectedDate) && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-xs font-semibold text-red-500 mb-3">
                  <CalendarOff className="w-4 h-4" /> This date is blocked
                </div>
              )}

              {selectedSlots.length === 0 && !blockedOnDate(selectedDate) ? (
                <div className="text-center py-6 text-gray-400 text-xs font-semibold">
                  No slots on this date
                </div>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {selectedSlots.map(slot => {
                    const bookedCount = slot.bookings?.filter(b => ["PENDING", "CONFIRMED"].includes(b.status)).length || 0;
                    return (
                      <div key={slot.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 group">
                        <div>
                          <p className="text-xs font-bold text-[#1A1A1A]">
                            {formatTime12(slot.startTime)} – {formatTime12(slot.endTime)}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            {slot.slotDuration}min · {bookedCount}/{slot.maxBookings} booked
                            {slot.isRecurring && " · Recurring"}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteSlot(slot.id)}
                          disabled={actionLoading === slot.id}
                          className="w-7 h-7 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-400 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <button
                disabled={isPastSelected}
                onClick={() => { setShowCreateModal(true); setCreateMode("recurring"); }}
                className={`flex items-center gap-2 w-full p-3 bg-white border border-gray-200 rounded-2xl text-xs font-bold transition cursor-pointer ${isPastSelected ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <RefreshCw className={`w-4 h-4 ${isPastSelected ? 'text-gray-300' : 'text-emerald-500'}`} /> Set Recurring Availability
              </button>
              <button
                disabled={isPastSelected}
                onClick={() => { setBlockForm(f => ({ ...f, startDate: selectedDate })); setShowCreateModal(true); setCreateMode("block"); }}
                className={`flex items-center gap-2 w-full p-3 bg-white border border-gray-200 rounded-2xl text-xs font-bold transition cursor-pointer ${isPastSelected ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <CalendarOff className={`w-4 h-4 ${isPastSelected ? 'text-gray-300' : 'text-red-400'}`} /> Block This Date
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: BOOKINGS ── */}
      {tab === "bookings" && (
        <div className="space-y-4">
          {bookingsLoading ? (
            <div className="text-center py-16 text-gray-400 text-sm">Loading bookings…</div>
          ) : bookings.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center shadow-sm">
              <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 font-semibold">No bookings yet</p>
              <p className="text-gray-300 text-xs mt-1">Create availability slots so tenants can book visits</p>
            </div>
          ) : (
            bookings.map(booking => (
              <div key={booking.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-[#1A1A1A] text-sm">
                          {booking.tenant?.firstName} {booking.tenant?.lastName}
                        </p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColors[booking.status]}`}>
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{booking.tenant?.email}</p>
                      <p className="text-xs font-semibold text-gray-700 mt-1.5">
                        📍 {booking.property.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        🗓 {booking.slot ? new Date(booking.slot.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) : "—"}
                        {" · "}
                        {booking.slot ? `${formatTime12(booking.slot.startTime)} – ${formatTime12(booking.slot.endTime)}` : ""}
                      </p>
                      {booking.note && (
                        <p className="text-xs text-gray-400 mt-1.5 italic">"{booking.note}"</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {booking.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => handleApprove(booking.id)}
                          disabled={actionLoading === booking.id}
                          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition disabled:opacity-50"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button
                          onClick={() => handleReject(booking.id)}
                          disabled={actionLoading === booking.id}
                          className="flex items-center gap-1.5 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition disabled:opacity-50"
                        >
                          <X className="w-3.5 h-3.5" /> Reject
                        </button>
                      </>
                    )}
                    {booking.status === "CONFIRMED" && (
                      <button
                        onClick={() => handleCancel(booking.id)}
                        disabled={actionLoading === booking.id}
                        className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition"
                      >
                        <X className="w-3.5 h-3.5" /> Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── TAB: SETTINGS ── */}
      {tab === "settings" && (
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm max-w-xl space-y-6">
          <h3 className="font-bold text-[#1A1A1A] text-base">Booking Preferences</h3>

          {/* Auto-approve */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div>
              <p className="font-bold text-sm text-[#1A1A1A]">Auto-approve bookings</p>
              <p className="text-xs text-gray-400 mt-0.5">Confirm bookings instantly without manual review</p>
            </div>
            <button
              onClick={() => updateSettings({ autoApprove: !settings.autoApprove })}
              className="transition"
            >
              {settings.autoApprove
                ? <ToggleRight className="w-8 h-8 text-emerald-500" />
                : <ToggleLeft className="w-8 h-8 text-gray-300" />
              }
            </button>
          </div>

          {/* Slot Duration */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Slot Duration</p>
            <div className="flex gap-2">
              {[15, 30, 60].map(d => (
                <button
                  key={d}
                  onClick={() => updateSettings({ slotDuration: d })}
                  className={`flex-1 py-3 rounded-xl text-xs font-bold border transition ${
                    settings.slotDuration === d
                      ? "bg-[#4F46E5] text-white border-[#4F46E5]"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {d} min
                </button>
              ))}
            </div>
          </div>

          {/* Buffer Time */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Buffer Between Bookings</p>
            <div className="flex gap-2">
              {[0, 15, 30].map(b => (
                <button
                  key={b}
                  onClick={() => updateSettings({ bufferTime: b })}
                  className={`flex-1 py-3 rounded-xl text-xs font-bold border transition ${
                    settings.bufferTime === b
                      ? "bg-[#4F46E5] text-white border-[#4F46E5]"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {b === 0 ? "None" : `${b} min`}
                </button>
              ))}
            </div>
          </div>

          {/* Max bookings per day */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Max Bookings Per Day</p>
            <div className="flex gap-2">
              {[1, 3, 5, 10].map(n => (
                <button
                  key={n}
                  onClick={() => updateSettings({ maxBookingsPerDay: n })}
                  className={`flex-1 py-3 rounded-xl text-xs font-bold border transition ${
                    settings.maxBookingsPerDay === n
                      ? "bg-[#4F46E5] text-white border-[#4F46E5]"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── CREATE MODAL ── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
            {/* Mode Switcher */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6">
              {(["single", "recurring", "block"] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setCreateMode(m)}
                  className={`flex-1 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wide transition capitalize ${
                    createMode === m ? "bg-white text-[#4F46E5] shadow-sm" : "text-gray-500"
                  }`}
                >
                  {m === "block" ? "Block Date" : m}
                </button>
              ))}
            </div>

            {/* Single Slot */}
            {createMode === "single" && (
              <div className="space-y-4">
                <h3 className="font-bold text-[#1A1A1A]">Create Availability Slots</h3>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Property</label>
                  <select
                    value={newSlot.propertyId}
                    onChange={e => setNewSlot(f => ({ ...f, propertyId: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-[#4F46E5]"
                  >
                    <option value="" disabled>Select a property...</option>
                    {properties.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                  </select>
                  {properties.length === 0 && (
                    <p className="text-[10px] text-red-500 font-semibold mt-1">You need to create a property first.</p>
                  )}
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Date</label>
                  <input type="date" value={newSlot.date} min={formatDate(new Date())} onChange={e => setNewSlot(f => ({ ...f, date: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#4F46E5]" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Start Time</label>
                    <input type="time" value={newSlot.startTime} onChange={e => setNewSlot(f => ({ ...f, startTime: e.target.value }))}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#4F46E5]" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">End Time</label>
                    <input type="time" value={newSlot.endTime} onChange={e => setNewSlot(f => ({ ...f, endTime: e.target.value }))}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#4F46E5]" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Duration (min)</label>
                    <select value={newSlot.slotDuration} onChange={e => setNewSlot(f => ({ ...f, slotDuration: +e.target.value }))}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#4F46E5]">
                      <option value={15}>15 min</option>
                      <option value={30}>30 min</option>
                      <option value={60}>60 min</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Buffer (min)</label>
                    <select value={newSlot.bufferTime} onChange={e => setNewSlot(f => ({ ...f, bufferTime: +e.target.value }))}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#4F46E5]">
                      <option value={0}>None</option>
                      <option value={15}>15 min</option>
                      <option value={30}>30 min</option>
                    </select>
                  </div>
                </div>
                <p className="text-[11px] text-gray-400">
                  Slots will be auto-generated from {newSlot.startTime} to {newSlot.endTime} in {newSlot.slotDuration}-min intervals.
                </p>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => setShowCreateModal(false)} className="flex-1 py-3 border border-gray-200 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50 transition">Cancel</button>
                  <button onClick={handleCreateSlot} disabled={actionLoading === "create"}
                    className="flex-1 py-3 bg-[#4F46E5] text-white rounded-xl text-xs font-bold hover:bg-[#4338CA] transition cursor-pointer disabled:opacity-50 shadow-sm">
                    {actionLoading === "create" ? "Creating…" : "Create Slots"}
                  </button>
                </div>
              </div>
            )}

            {/* Recurring */}
            {createMode === "recurring" && (
              <div className="space-y-4">
                <h3 className="font-bold text-[#1A1A1A]">Recurring Availability</h3>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Property</label>
                  <select value={recurringForm.propertyId} onChange={e => setRecurringForm(f => ({ ...f, propertyId: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#4F46E5]">
                    <option value="" disabled>Select a property...</option>
                    {properties.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                  </select>
                  {properties.length === 0 && (
                    <p className="text-[10px] text-red-500 font-semibold mt-1">You need to create a property first.</p>
                  )}
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Day of Week</label>
                  <div className="grid grid-cols-7 gap-1">
                    {DAYS.map((d, i) => (
                      <button key={d} onClick={() => setRecurringForm(f => ({ ...f, dayOfWeek: i }))}
                        className={`py-2 rounded-xl text-[10px] font-bold border transition ${recurringForm.dayOfWeek === i ? "bg-[#4F46E5] text-white border-[#4F46E5]" : "bg-white border-gray-200 text-gray-600"}`}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Start</label>
                    <input type="time" value={recurringForm.startTime} onChange={e => setRecurringForm(f => ({ ...f, startTime: e.target.value }))}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#4F46E5]" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">End</label>
                    <input type="time" value={recurringForm.endTime} onChange={e => setRecurringForm(f => ({ ...f, endTime: e.target.value }))}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#4F46E5]" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Weeks Ahead</label>
                  <select value={recurringForm.weeksAhead} onChange={e => setRecurringForm(f => ({ ...f, weeksAhead: +e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#4F46E5]">
                    {[4, 8, 12].map(n => <option key={n} value={n}>{n} weeks</option>)}
                  </select>
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => setShowCreateModal(false)} className="flex-1 py-3 border border-gray-200 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50 transition">Cancel</button>
                  <button onClick={handleCreateRecurring} disabled={actionLoading === "recurring"}
                    className="flex-1 py-3 bg-[#4F46E5] text-white rounded-xl text-xs font-bold hover:bg-[#4338CA] transition cursor-pointer disabled:opacity-50 shadow-sm">
                    {actionLoading === "recurring" ? "Creating…" : `Create for ${recurringForm.weeksAhead} Weeks`}
                  </button>
                </div>
              </div>
            )}

            {/* Block */}
            {createMode === "block" && (
              <div className="space-y-4">
                <h3 className="font-bold text-[#1A1A1A]">Block Dates</h3>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Property</label>
                  <select value={blockForm.propertyId} onChange={e => setBlockForm(f => ({ ...f, propertyId: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#4F46E5]">
                    <option value="" disabled>Select a property...</option>
                    {properties.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                  </select>
                  {properties.length === 0 && (
                    <p className="text-[10px] text-red-500 font-semibold mt-1">You need to create a property first.</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">From</label>
                    <input type="date" value={blockForm.startDate} min={formatDate(new Date())} onChange={e => setBlockForm(f => ({ ...f, startDate: e.target.value }))}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#4F46E5]" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">To (optional)</label>
                    <input type="date" value={blockForm.endDate} min={formatDate(new Date())} onChange={e => setBlockForm(f => ({ ...f, endDate: e.target.value }))}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#4F46E5]" />
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => setShowCreateModal(false)} className="flex-1 py-3 border border-gray-200 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50 transition">Cancel</button>
                  <button onClick={handleBlockDates} disabled={actionLoading === "block"}
                    className="flex-1 py-3 bg-red-500 text-white rounded-xl text-xs font-bold hover:bg-red-600 transition disabled:opacity-50">
                    {actionLoading === "block" ? "Blocking…" : "Block Date(s)"}
                  </button>
                </div>
              </div>
            )}
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
              className="w-full py-3.5 bg-[#4F46E5] text-white rounded-xl text-sm font-bold hover:bg-[#4338CA] transition cursor-pointer shadow-md"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ── ERROR POPUP ── */}
      {errorMessage && (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center transform transition-all animate-in zoom-in-95">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="font-extrabold text-[#1A1A1A] text-xl mb-2">Wait!</h3>
            <p className="text-sm text-gray-500 font-medium mb-8">{errorMessage}</p>
            <button
              onClick={() => setErrorMessage(null)}
              className="w-full py-3.5 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition shadow-md"
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
