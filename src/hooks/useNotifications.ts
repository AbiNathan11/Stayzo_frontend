'use client';
import Cookies from 'js-cookie';
import { useState, useEffect, useCallback } from 'react';

const API = 'http://localhost:3001';

function getToken() {
  if (typeof window === 'undefined') return null;
  return Cookies.get('stayzo_token');
}

function handleAuthError(res: Response, data: any) {
  if (res.status === 401 || res.status === 403) {
    const errMsg = data && data.error ? String(data.error).toLowerCase() : '';
    if (errMsg.includes('expired') || errMsg.includes('token') || errMsg.includes('forbidden') || errMsg.includes('unauthorized')) {
      if (typeof window !== 'undefined') {
        Cookies.remove('stayzo_token');
        Cookies.remove('stayzo_refresh_token');
        window.location.href = '/auth?expired=true';
      }
    }
  }
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  bookingId?: string;
  createdAt: string;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetch_ = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch(`${API}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      } else {
        handleAuthError(res, data);
      }
    } catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetch_();
    // Poll every 30 seconds for new notifications
    const interval = setInterval(fetch_, 30000);
    return () => clearInterval(interval);
  }, [fetch_]);

  const markAllRead = async () => {
    const token = getToken();
    if (!token) return;
    const res = await fetch(`${API}/api/notifications/read-all`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (res.ok) {
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } else {
      handleAuthError(res, data);
    }
  };

  const markOneRead = async (id: string) => {
    const token = getToken();
    if (!token) return;
    const res = await fetch(`${API}/api/notifications/${id}/read`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (res.ok) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } else {
      handleAuthError(res, data);
    }
  };

  return { notifications, unreadCount, loading, refresh: fetch_, markAllRead, markOneRead };
}
