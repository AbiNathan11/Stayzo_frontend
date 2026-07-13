"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, RotateCcw, Check, PenTool } from 'lucide-react';
// @ts-ignore
import { io, Socket } from 'socket.io-client';

export default function MobileSignPage() {
  const router = useRouter();

  // Read query params manually to support standard React hydration
  const [role, setRole] = useState<'landlord' | 'tenant'>('landlord');
  const [draftId, setDraftId] = useState<string>('default-draft');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [hasDrawn, setHasDrawn] = useState(false);

  // State-driven dimensions to ensure React doesn't discard inline styles on rerender
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 340, height: 240 });
  const [dpr, setDpr] = useState(1);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDrawingRef = useRef(false);
  const lastCoordsRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDpr(window.devicePixelRatio || 1);

      const params = new URLSearchParams(window.location.search);
      const roleParam = params.get('role');
      if (roleParam === 'tenant') {
        setRole('tenant');
      }
      const draftIdParam = params.get('draftId');
      if (draftIdParam) {
        setDraftId(draftIdParam);
      }

      // Use backendIp param if provided (embedded in QR URL from LAN auto-detection)
      // Falls back to window.location.hostname (works for same-device testing)
      const backendIp = params.get('backendIp') || window.location.hostname;
      const backendUrl = `http://${backendIp}:3001`;
      const newSocket = io(backendUrl);
      setSocket(newSocket);

      newSocket.on('connect', () => {
        newSocket.emit('join_draft', draftIdParam || 'default-draft');
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, []);

  const drawGuideLine = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(20, h - 40);
    ctx.lineTo(w - 20, h - 40);
    ctx.stroke();
    ctx.setLineDash([]);
  };

  // Measures container and sets canvas dimensions in React state
  const setupCanvas = () => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const w = rect.width || container.offsetWidth || 340;
    const h = 240;

    setCanvasDimensions({ width: w, height: h });
  };

  // Delayed setup to ensure container has completed rendering and has a non-zero width
  useEffect(() => {
    const timer = setTimeout(() => {
      setupCanvas();
    }, 200);

    window.addEventListener('resize', setupCanvas);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', setupCanvas);
    };
  }, [isSubmitted]);

  // Redraw guide line and re-apply DPR transformation whenever dimensions update
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // Scale context to match DPR
    ctx.clearRect(0, 0, canvasDimensions.width, canvasDimensions.height);
    drawGuideLine(ctx, canvasDimensions.width, canvasDimensions.height);
  }, [canvasDimensions, dpr]);

  // Coordinates helper for Mouse/Touch event offset calculation
  const getCoords = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if (e.touches && e.touches.length > 0) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    } else if (e.changedTouches && e.changedTouches.length > 0) {
      const touch = e.changedTouches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const handleStart = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCoords(e);

    // Apply scaled transformation to match DPR
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Apply drawing styles
    ctx.strokeStyle = '#1A1A1A';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    
    isDrawingRef.current = true;
    lastCoordsRef.current = coords;
  };

  const handleMove = (e: any) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCoords(e);

    // Re-apply transformation and styles on move
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.strokeStyle = '#1A1A1A';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(lastCoordsRef.current.x, lastCoordsRef.current.y);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();

    lastCoordsRef.current = coords;
    setHasDrawn(true);
  };

  const handleEnd = () => {
    isDrawingRef.current = false;
  };

  const handleClear = () => {
    setHasDrawn(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, canvasDimensions.width, canvasDimensions.height);
    drawGuideLine(ctx, canvasDimensions.width, canvasDimensions.height);
  };

  const handleSubmit = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Convert canvas drawing to base64 Data URL
    const signatureDataUrl = canvas.toDataURL('image/png');

    // Save to localStorage safely inside a try-catch to support Safari/Chrome private browsing modes
    try {
      const storageKey = role === 'landlord' ? 'stayzo_landlord_sig' : 'stayzo_tenant_sig';
      localStorage.setItem(storageKey, signatureDataUrl);
    } catch (err) {
      console.warn("localStorage setItem failed (e.g. private browsing mode):", err);
    }

    // Socket.io transmission (for separate devices)
    if (socket) {
      socket.emit('signature_drawn', {
        draftId,
        role,
        signatureDataUrl
      });
    }

    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans px-4 py-6 justify-between select-none">

      {/* Top Title Bar */}
      <div className="text-center space-y-1">
        <div className="flex items-center justify-center space-x-1 text-[#1A1A1A]">
          <PenTool className="w-5 h-5" />
          <span className="text-[13px] font-black uppercase tracking-widest">Stayzo Signature Pad</span>
        </div>
        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">
          Signing as: <span className="text-[#1A1A1A] underline">{role}</span>
        </p>
      </div>

      {!isSubmitted ? (
        /* ──── SIGNING STATE ──── */
        <div className="flex-1 flex flex-col justify-center my-6 space-y-4">

          {/* Canvas Wrapper */}
          <div ref={containerRef} className="bg-white border-2 border-dashed border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col items-center w-full">
            <div className="w-full bg-slate-50 border-b border-slate-100 py-3 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {hasDrawn ? '✓ Signature drawn — tap Confirm Sign' : 'Draw your signature in the box below'}
            </div>

            <canvas
              ref={canvasRef}
              width={canvasDimensions.width * dpr}
              height={canvasDimensions.height * dpr}
              style={{
                display: 'block',
                touchAction: 'none',
                width: `${canvasDimensions.width}px`,
                height: `${canvasDimensions.height}px`
              }}
              onMouseDown={handleStart}
              onMouseMove={handleMove}
              onMouseUp={handleEnd}
              onMouseLeave={handleEnd}
              onTouchStart={handleStart}
              onTouchMove={handleMove}
              onTouchEnd={handleEnd}
              className="bg-white cursor-crosshair"
            />
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleClear}
              className="py-3.5 border border-slate-200 hover:border-slate-400 bg-white text-slate-700 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Board</span>
            </button>
            <button
              onClick={handleSubmit}
              disabled={!hasDrawn}
              className={`py-3.5 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer ${
                hasDrawn 
                  ? "bg-[#1A1A1A] hover:bg-black text-white" 
                  : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>Confirm Sign</span>
            </button>
          </div>
        </div>
      ) : (
        /* ──── SUCCESS SUBMISSION STATE ──── */
        <div className="flex-1 flex flex-col justify-center items-center text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <div>
            <h3 className="text-[16px] font-black text-slate-900 uppercase tracking-tight">Signature Transmitted!</h3>
            <p className="text-[11px] text-gray-500 font-medium mt-1.5 max-w-[280px] mx-auto">
              Your signature has been synchronized with the desktop workspace in real-time. You may now close this screen.
            </p>
          </div>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setHasDrawn(false);
            }}
            className="text-[11px] font-extrabold text-[#1A1A1A] hover:underline uppercase tracking-wider pt-4 cursor-pointer"
          >
            Redraw Signature
          </button>
        </div>
      )}

      {/* Footer Branding */}
      <div className="text-center text-[9px] font-bold text-slate-300 uppercase tracking-widest">
        SECURE DIGITALLY SIGNED VIA STAYZO VAULT
      </div>
    </div>
  );
}
