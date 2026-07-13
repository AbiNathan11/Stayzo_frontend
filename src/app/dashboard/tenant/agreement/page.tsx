"use client";
import Cookies from 'js-cookie';

import React, { useState, useEffect, useRef } from 'react';
import {
  FileSignature, ShieldCheck, Download, UploadCloud,
  Smartphone, CheckCircle2, FileText, ExternalLink, Scale, Clock, ShieldAlert
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
// @ts-ignore
import { io } from 'socket.io-client';

// ─── SUB-COMPONENT: DESKTOP DRAWING PAD ─────────────────────────────────────
function DesktopCanvasPad({ onSave }: { onSave: (dataUrl: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = '#1A1A1A';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(15, canvas.height - 30);
    ctx.lineTo(canvas.width - 15, canvas.height - 30);
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.strokeStyle = '#1A1A1A';
    ctx.lineWidth = 3;
  }, []);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(15, canvas.height - 30);
    ctx.lineTo(canvas.width - 15, canvas.height - 30);
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.strokeStyle = '#1A1A1A';
    ctx.lineWidth = 3;
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    onSave(canvas.toDataURL('image/png'));
  };

  return (
    <div className="space-y-4">
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 flex flex-col items-center">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          width={360}
          height={180}
          className="bg-white cursor-crosshair border-b border-slate-100"
        />
      </div>
      <div className="flex gap-2 justify-end">
        <button
          onClick={handleClear}
          type="button"
          className="px-4 py-2 border border-slate-200 text-slate-700 hover:border-slate-400 text-[10px] font-black uppercase rounded-lg transition-colors"
        >
          Clear
        </button>
        <button
          onClick={handleSave}
          type="button"
          className="px-4 py-2 bg-[#1A1A1A] hover:bg-black text-white text-[10px] font-black uppercase rounded-lg transition-colors shadow-sm"
        >
          Apply Signature
        </button>
      </div>
    </div>
  );
}

export default function TenantAgreementPage() {
  const getThemeClass = (theme: string) => {
    switch (theme) {
      case 'classic-legal':
        return 'font-serif border-4 border-double border-gray-800 p-8 md:p-12 bg-white text-gray-900 leading-relaxed text-justify';
      case 'modern-clean':
        return 'font-sans p-8 md:p-10 bg-white text-gray-700 leading-loose text-left';
      case 'executive-elite':
        return 'font-serif border-l-8 border-gray-900 p-8 md:p-11 bg-[#FAFAFA] text-slate-800 leading-normal text-justify';
      default:
        return 'font-serif border-4 border-double border-gray-855 p-8 md:p-12 bg-white text-gray-900 leading-relaxed text-justify';
    }
  };

  const cleanContractText = (text: string) => {
    if (!text) return '';
    const lastLandlordIdx = text.lastIndexOf("LANDLORD:");
    if (lastLandlordIdx !== -1 && lastLandlordIdx > text.length - 400) {
      const afterText = text.substring(lastLandlordIdx);
      if (afterText.includes("TENANT:") || afterText.includes("Signature")) {
        return text.substring(0, lastLandlordIdx).trim();
      }
    }
    return text;
  };

  const [userEmail, setUserEmail] = useState('abiramy@example.com');
  const [agreements, setAgreements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Signature States
  const [selectedAgreement, setSelectedAgreement] = useState<any | null>(null);
  const [tenantSig, setTenantSig] = useState<string | null>(null);
  const [sigModalTab, setSigModalTab] = useState<'qr' | 'draw'>('qr');
  const [socket, setSocket] = useState<any>(null);
  const [localNetIp, setLocalNetIp] = useState<string>('localhost');

  // Tenant NIC States for renting
  const [nicFront, setNicFront] = useState<string | null>(null);
  const [nicBack, setNicBack] = useState<string | null>(null);
  const [nicFrontName, setNicFrontName] = useState<string>('');
  const [nicBackName, setNicBackName] = useState<string>('');

  const handleNICChange = (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Only image files (.jpg, .jpeg, .png, etc.) are allowed for the NIC copy!');
        e.target.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (side === 'front') {
          setNicFront(base64String);
          setNicFrontName(file.name);
          toast.success('NIC front image uploaded successfully!');
        } else {
          setNicBack(base64String);
          setNicBackName(file.name);
          toast.success('NIC back image uploaded successfully!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchAgreements = async (email: string) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/agreements?tenantEmail=${encodeURIComponent(email)}`, { cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        setAgreements(data);
      }
    } catch (err) {
      console.error("Error fetching agreements for tenant:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = Cookies.get('stayzo_token');
    let email = 'abiramy@example.com';
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        email = payload.email || 'abiramy@example.com';
        setUserEmail(email);
      } catch (e) {
        console.error(e);
      }
    }
    fetchAgreements(email);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      fetch('/api/local-ip')
        .then(r => r.json())
        .then(data => { if (data.ip) setLocalNetIp(data.ip); })
        .catch(() => setLocalNetIp(window.location.hostname));
    }
  }, []);

  // Sync mobile signatures via socket
  useEffect(() => {
    if (!selectedAgreement) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const backendUrl = `http://${window.location.hostname}:3001`;
    const newSocket = io(backendUrl);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('join_draft', selectedAgreement.id);
    });

    newSocket.on('signature_received', (data: { role: string; signatureDataUrl: string }) => {
      if (data.role === 'tenant') {
        setTenantSig(data.signatureDataUrl);
        toast.success("Signature received from mobile!");
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [selectedAgreement]);

  // Poll localStorage for signatures written by same-device QR tab
  useEffect(() => {
    if (!selectedAgreement) return;
    const interval = setInterval(() => {
      const tenantKey = localStorage.getItem('stayzo_tenant_sig');
      if (tenantKey) {
        setTenantSig(tenantKey);
        localStorage.removeItem('stayzo_tenant_sig');
        toast.success('Signature applied!');
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [selectedAgreement]);

  const getQrCodeUrl = () => {
    if (!selectedAgreement) return '';
    const port = typeof window !== 'undefined' && window.location.port ? `:${window.location.port}` : ':3000';
    return `http://${localNetIp}${port}/sign?role=tenant&draftId=${selectedAgreement.id}&backendIp=${localNetIp}`;
  };

  const submitTenantSignature = async () => {
    if (!selectedAgreement || !tenantSig) return;

    try {
      const response = await fetch(`http://localhost:3001/api/agreements/${selectedAgreement.id}/sign`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tenantSig, nicFront: "", nicBack: "" })
      });

      if (!response.ok) {
        throw new Error('Failed to submit signature and verification to database.');
      }

      toast.success("Agreement signed successfully! Status is now Active.");
      setSelectedAgreement(null);
      setNicFront(null);
      setNicBack(null);
      setNicFrontName('');
      setNicBackName('');
      fetchAgreements(userEmail);
    } catch (err) {
      console.error(err);
      toast.error("Error signing agreement and uploading verification documents.");
    }
  };


  const pendingAgreements = agreements.filter(a => a.status !== 'Active');
  const activeAgreements = agreements.filter(a => a.status === 'Active');

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <Toaster position="top-right" toastOptions={{ style: { background: '#1A1A1A', color: '#fff', fontWeight: 700, fontSize: '13px', borderRadius: '12px' } }} />

      {/* Header and Metainfo */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gray-200 pb-5">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#1A1A1A]">Tenancy Lease Agreement Vault</h2>
          <p className="text-xs text-gray-500 font-semibold mt-1">
            Securely review, download, and sign legal agreements generated by your landlords.
          </p>
        </div>
      </div>

      {/* Agreements Lists */}
      <div className="space-y-8">
        {/* SECTION 1: PENDING SIGNATURES */}
        {pendingAgreements.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-[32px] p-6 md:p-8 shadow-sm space-y-6">
            <div>
              <h4 className="font-extrabold text-base text-gray-900 flex items-center gap-2">
                <FileSignature className="w-5 h-5 text-amber-500" /> Pending Signatures
              </h4>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Inspect and sign pending lease agreements</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-bold">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-widest text-[9px]">
                    <th className="py-4 px-4">Lease Target</th>
                    <th className="py-4 px-4">Landlord details</th>
                    <th className="py-4 px-4">Monthly Rent</th>
                    <th className="py-4 px-4">Security Deposit</th>
                    <th className="py-4 px-4">Signature Status</th>
                    <th className="py-4 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {pendingAgreements.map((agreement) => (
                    <tr key={agreement.id} className="hover:bg-gray-50/40 transition">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                            <FileSignature className="w-4 h-4 text-slate-700" />
                          </div>
                          <div>
                            <p className="text-gray-950 font-extrabold">{agreement.listingName}</p>
                            <p className="text-[9px] text-gray-400 font-semibold mt-0.5">ID: {agreement.id.substring(0, 10).toUpperCase()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-850 font-bold">{agreement.landlordName}</p>
                        <p className="text-gray-400 font-semibold text-[9px] mt-0.5">{agreement.landlordEmail}</p>
                      </td>
                      <td className="py-4 px-4 text-gray-950 font-extrabold">
                        Rs {agreement.monthlyRent?.toLocaleString()}/mo
                      </td>
                      <td className="py-4 px-4 text-gray-950 font-extrabold">
                        Rs {agreement.securityDeposit?.toLocaleString()}
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase border bg-amber-50 text-amber-600 border-amber-100">
                          Pending signature
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedAgreement(agreement);
                            setTenantSig(null);
                          }}
                          className="bg-[#1A1A1A] hover:bg-black text-white px-3.5 py-1.5 rounded-lg text-[10px] font-extrabold transition uppercase tracking-wider mx-auto cursor-pointer shadow-xs"
                        >
                          Review &amp; Sign
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION 2: DIGITAL DOCUMENT VAULT (FULLY SIGNED) */}
        <div className="bg-white border border-gray-200 rounded-[32px] p-6 md:p-8 shadow-sm space-y-6">
          <div>
            <h4 className="font-extrabold text-base text-gray-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" /> Digital Document Vault
            </h4>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Your double-sided, fully signed lease agreements</p>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-12 text-gray-400 font-bold uppercase tracking-widest animate-pulse">
                Loading tenancy agreements...
              </div>
            ) : activeAgreements.length === 0 ? (
              <div className="text-center py-16 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 p-8 space-y-3">
                <FileText className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm font-extrabold text-slate-800">No Signed Agreements Vaulted</p>
                <p className="text-xs text-slate-400 font-semibold max-w-sm mx-auto">
                  Once lease agreements are fully signed by both you and the landlord, they will automatically be preserved here.
                </p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs font-bold">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-widest text-[9px]">
                    <th className="py-4 px-4">Lease Target</th>
                    <th className="py-4 px-4">Landlord details</th>
                    <th className="py-4 px-4">Monthly Rent</th>
                    <th className="py-4 px-4">Security Deposit</th>
                    <th className="py-4 px-4">Signature Status</th>
                    <th className="py-4 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {activeAgreements.map((agreement) => (
                    <tr key={agreement.id} className="hover:bg-gray-50/40 transition">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                            <FileSignature className="w-4 h-4 text-slate-700" />
                          </div>
                          <div>
                            <p className="text-gray-950 font-extrabold">{agreement.listingName}</p>
                            <p className="text-[9px] text-gray-400 font-semibold mt-0.5">ID: {agreement.id.substring(0, 10).toUpperCase()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-850 font-bold">{agreement.landlordName}</p>
                        <p className="text-gray-400 font-semibold text-[9px] mt-0.5">{agreement.landlordEmail}</p>
                      </td>
                      <td className="py-4 px-4 text-gray-950 font-extrabold">
                        Rs {agreement.monthlyRent?.toLocaleString()}/mo
                      </td>
                      <td className="py-4 px-4 text-gray-950 font-extrabold">
                        Rs {agreement.securityDeposit?.toLocaleString()}
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase border bg-emerald-50 text-emerald-600 border-emerald-100">
                          Active (Signed)
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedAgreement(agreement);
                            setTenantSig(agreement.tenantSig || null);
                          }}
                          className="bg-emerald-50 border border-emerald-100 text-emerald-600 hover:bg-emerald-500 hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-extrabold transition uppercase flex items-center space-x-1 cursor-pointer mx-auto"
                        >
                          <span>Inspect</span>
                          <ExternalLink className="w-3 h-3 ml-0.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Agreement Review & Signing Modal */}
      {selectedAgreement && (
        <div className="fixed inset-0 bg-[#1A1A1A]/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white border border-gray-200 rounded-[32px] w-full max-w-4xl p-6 md:p-8 shadow-2xl relative overflow-hidden my-8 animate-in zoom-in-95 duration-200">

            <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-xl font-extrabold text-[#1A1A1A]">Tenancy Lease Agreement</h3>
                <p className="text-xs text-gray-500 font-semibold mt-1">
                  Review terms and conditions for {selectedAgreement.listingName}.
                </p>
              </div>
              <button
                onClick={() => setSelectedAgreement(null)}
                className="text-gray-400 hover:text-gray-600 font-extrabold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* Document Text Pane */}
              <div className={`h-[400px] overflow-y-auto rounded-2xl border border-slate-200 flex flex-col justify-between ${getThemeClass(selectedAgreement.visualTheme)} shadow-inner`}>
                <div className="whitespace-pre-wrap text-[13px]">{cleanContractText(selectedAgreement.contractText)}</div>

                {/* Signatures inside the document layout */}
                <div className="mt-12 pt-8 border-t border-gray-200 grid grid-cols-2 gap-8 text-[12px] font-sans text-left">
                  <div>
                    <p className="text-gray-400 text-[9px] uppercase tracking-wider mb-2">Landlord Representative</p>
                    {selectedAgreement.landlordSig ? (
                      <img src={selectedAgreement.landlordSig} alt="Landlord Signature" className="h-10 object-contain my-1" />
                    ) : (
                      <p className="text-[10px] font-bold text-gray-400 italic">Signature Pending</p>
                    )}
                    <div className="border-b border-gray-400 w-full h-1 mt-1" />
                    <p className="font-bold mt-1 text-[11px] text-[#1A1A1A]">{selectedAgreement.landlordName}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-[9px] uppercase tracking-wider mb-2">Tenant Signature</p>
                    {selectedAgreement.tenantSig ? (
                      <img src={selectedAgreement.tenantSig} alt="Tenant Signature" className="h-10 object-contain my-1" />
                    ) : tenantSig ? (
                      <img src={tenantSig} alt="Tenant Signature Preview" className="h-10 object-contain my-1" />
                    ) : (
                      <p className="text-[10px] font-bold text-gray-400 italic">Signature Pending</p>
                    )}
                    <div className="border-b border-gray-400 w-full h-1 mt-1" />
                    <p className="font-bold mt-1 text-[11px] text-[#1A1A1A]">{selectedAgreement.tenantName}</p>
                  </div>
                </div>
              </div>

              {/* Signing Control Pane */}
              <div className="flex flex-col justify-between space-y-6">

                {/* General Info */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-gray-400 uppercase">Landlord:</span>
                    <span className="font-extrabold text-[#1A1A1A]">{selectedAgreement.landlordName}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-gray-400 uppercase">Monthly Rent:</span>
                    <span className="font-extrabold text-[#1A1A1A]">Rs {selectedAgreement.monthlyRent?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-gray-400 uppercase">Security Deposit:</span>
                    <span className="font-extrabold text-[#1A1A1A]">Rs {selectedAgreement.securityDeposit?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-gray-400 uppercase">Lease Term:</span>
                    <span className="font-extrabold text-[#1A1A1A]">{selectedAgreement.termLength}</span>
                  </div>
                </div>

                {selectedAgreement.status === 'Active' ? (
                  /* ALREADY SIGNED PREVIEW */
                  <div className="space-y-4">
                    <div className="text-center py-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      <span>This Agreement is Active & Fully Signed</span>
                    </div>
                  </div>

                ) : (
                  /* SIGNING WORKFLOW */
                  <div className="space-y-6">
                    {/* Tab Switcher */}
                    <div className="flex bg-[#EEF2FF] p-0.5 rounded-lg shrink-0 w-max">
                      <button
                        onClick={() => setSigModalTab('qr')}
                        type="button"
                        className={`px-3 py-1.5 rounded-md text-[10px] font-extrabold transition ${sigModalTab === 'qr'
                            ? 'bg-white text-[#4F46E5] shadow-xs'
                            : 'text-gray-500 hover:text-gray-800'
                          }`}
                      >
                        📱 Mobile Scan
                      </button>
                      <button
                        onClick={() => setSigModalTab('draw')}
                        type="button"
                        className={`px-3 py-1.5 rounded-md text-[10px] font-extrabold transition ${sigModalTab === 'draw'
                            ? 'bg-white text-[#4F46E5] shadow-xs'
                            : 'text-gray-500 hover:text-gray-800'
                          }`}
                      >
                        ✍️ Draw Desktop
                      </button>
                    </div>

                    {sigModalTab === 'qr' ? (
                      /* QR CODE CONTAINER */
                      <div className="space-y-4">
                        <div className="mx-auto w-[180px] h-[180px] bg-white border border-slate-200 rounded-xl p-2 flex items-center justify-center shadow-inner">
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(getQrCodeUrl())}`}
                            alt="Signature QR Code"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="text-center">
                          <div className="flex items-center gap-1.5 justify-center text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">
                            <Smartphone className="w-4 h-4 text-purple-600" />
                            <span>Scan with your phone to sign...</span>
                          </div>

                          <a
                            href={getQrCodeUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-black text-purple-700 hover:underline uppercase tracking-wider block mt-2"
                          >
                            [Open Mobile Signature Page]
                          </a>
                        </div>
                      </div>
                    ) : (
                      /* DESKTOP CANVAS PAD */
                      <DesktopCanvasPad onSave={(dataUrl) => setTenantSig(dataUrl)} />
                    )}



                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setSelectedAgreement(null);
                        }}
                        type="button"
                        className="flex-1 border border-gray-200 text-gray-500 hover:bg-gray-50 rounded-2xl py-3 text-xs font-bold transition cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={submitTenantSignature}
                        disabled={!tenantSig}
                        type="button"
                        className={`flex-1 rounded-2xl py-3 text-xs font-bold shadow-sm transition duration-200 cursor-pointer ${!tenantSig
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-[#4F46E5] text-white hover:bg-[#4338CA] active:scale-95"
                          }`}
                      >
                        Submit Signature
                      </button>
                    </div>

                  </div>
                )}

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
