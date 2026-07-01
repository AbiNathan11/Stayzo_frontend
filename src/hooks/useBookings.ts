'use client';
import Cookies from 'js-cookie';
import { useState, useEffect, useCallback } from 'react';

const API = 'http://localhost:3001';

function getToken() {
  if (typeof window === 'undefined') return null;
  return Cookies.get('stayzo_token');
}

function authHeaders() {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` };
}

export interface Slot {
  id: string;
  propertyId: string;
  ownerId: string;
  date: string;
  startTime: string;
  endTime: string;
  slotDuration: number;
  bufferTime: number;
  isBlocked: boolean;
  isRecurring: boolean;
  maxBookings: number;
  bookings?: { id: string; status: string; tenantId: string }[];
  property?: { title: string };
}

export interface Booking {
  id: string;
  slotId: string;
  tenantId: string;
  propertyId: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  note?: string;
  createdAt: string;
  slot: Slot;
  property: { title: string; address: string; city?: string; images?: string[] };
  tenant?: { firstName: string; lastName: string; email: string };
}

// ─── Tenant hooks ─────────────────────────────────────────────

export function useTenantBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetch_ = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/bookings/tenant`, { headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBookings(data);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetch_(); }, [fetch_]);
  return { bookings, loading, error, refresh: fetch_ };
}

export function usePropertySlots(propertyId: string) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch_ = useCallback(async () => {
    if (!propertyId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/availability/property/${propertyId}`);
      const data = await res.json();
      setSlots(Array.isArray(data) ? data : []);
    } catch {}
    finally { setLoading(false); }
  }, [propertyId]);

  useEffect(() => { fetch_(); }, [fetch_]);
  return { slots, loading, refresh: fetch_ };
}

export async function bookSlot(slotId: string, note?: string) {
  const res = await fetch(`${API}/api/bookings`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ slotId, note }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

export async function cancelBookingApi(bookingId: string) {
  const res = await fetch(`${API}/api/bookings/${bookingId}/cancel`, {
    method: 'PATCH', headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

export async function rescheduleBookingApi(bookingId: string, newSlotId: string) {
  const res = await fetch(`${API}/api/bookings/${bookingId}/reschedule`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ newSlotId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

// ─── Owner hooks ─────────────────────────────────────────────

export function useOwnerBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch_ = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/bookings/owner`, { headers: authHeaders() });
      const data = await res.json();
      if (res.ok) setBookings(Array.isArray(data) ? data : []);
    } catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetch_(); }, [fetch_]);
  return { bookings, loading, refresh: fetch_ };
}

export function useOwnerSlots(propertyId?: string) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch_ = useCallback(async () => {
    try {
      setLoading(true);
      const url = propertyId
        ? `${API}/api/availability/owner?propertyId=${propertyId}`
        : `${API}/api/availability/owner`;
      const res = await fetch(url, { headers: authHeaders() });
      const data = await res.json();
      if (res.ok) setSlots(Array.isArray(data) ? data : []);
    } catch {}
    finally { setLoading(false); }
  }, [propertyId]);

  useEffect(() => { fetch_(); }, [fetch_]);
  return { slots, loading, refresh: fetch_ };
}

export function useOwnerSettings() {
  const [settings, setSettings] = useState({ autoApprove: false, slotDuration: 30, bufferTime: 0, maxBookingsPerDay: 5 });
  const [loading, setLoading] = useState(true);

  const fetch_ = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/availability/settings`, { headers: authHeaders() });
      const data = await res.json();
      if (res.ok) setSettings(data);
    } catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetch_(); }, [fetch_]);

  const updateSettings = async (updates: Partial<typeof settings>) => {
    const res = await fetch(`${API}/api/availability/settings`, {
      method: 'PATCH', headers: authHeaders(), body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    setSettings(prev => ({ ...prev, ...data }));
  };

  return { settings, loading, updateSettings, refresh: fetch_ };
}

export async function createSlotApi(payload: {
  propertyId: string; date: string; startTime: string; endTime: string;
  slotDuration?: number; bufferTime?: number; maxBookings?: number;
}) {
  const res = await fetch(`${API}/api/availability`, {
    method: 'POST', headers: authHeaders(), body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

export async function createRecurringApi(payload: {
  propertyId: string; dayOfWeek: number; startTime: string; endTime: string;
  slotDuration?: number; bufferTime?: number; weeksAhead?: number;
}) {
  const res = await fetch(`${API}/api/availability/recurring`, {
    method: 'POST', headers: authHeaders(), body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

export async function blockDatesApi(payload: { propertyId: string; startDate: string; endDate?: string }) {
  const res = await fetch(`${API}/api/availability/block`, {
    method: 'POST', headers: authHeaders(), body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

export async function deleteSlotApi(slotId: string) {
  const res = await fetch(`${API}/api/availability/${slotId}`, {
    method: 'DELETE', headers: authHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

export async function approveBookingApi(bookingId: string) {
  const res = await fetch(`${API}/api/bookings/${bookingId}/approve`, {
    method: 'PATCH', headers: authHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

export async function rejectBookingApi(bookingId: string) {
  const res = await fetch(`${API}/api/bookings/${bookingId}/reject`, {
    method: 'PATCH', headers: authHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}
