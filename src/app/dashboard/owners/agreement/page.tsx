"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Bell, 
  ArrowRight, 
  Send, 
  FileText, 
  Download, 
  Check, 
  Sparkles, 
  CheckCircle2, 
  Trash2, 
  Copy, 
  FileSignature,
  Info,
  ArrowLeft,
  Layout,
  BookOpen,
  Scale,
  QrCode,
  Smartphone,
  MousePointerClick,
  X
} from 'lucide-react';
import Footer from '@/components/Footer';
import { io, Socket } from 'socket.io-client';

// ─── TYPES ──────────────────────────────────────────────────────────────────
interface TemplateField {
  id: string;
  label: string;
  question: string;
  placeholder: string;
}

interface AgreementTemplate {
  id: string;
  title: string;
  complexity: 'Simple' | 'Standard' | 'Detailed';
  description: string;
  fields: TemplateField[];
  generateText: (values: Record<string, string>) => string;
}

interface SavedAgreement {
  id: string;
  templateId: string;
  templateTitle: string;
  complexity: string;
  tenantName: string;
  propertyAddress: string;
  rentAmount: string;
  dateCreated: string;
  visualTheme: string;
  values: Record<string, string>;
  landlordSig?: string;
  tenantSig?: string;
}

// ─── NAV LINKS ──────────────────────────────────────────────────────────────
const navLinks = [
  { label: 'Home',         href: '/dashboard/owners' },
  { label: 'Listings',     href: '/dashboard/owners/listings' },
  { label: 'Appointments', href: '/dashboard/owners/appointments' },
  { label: 'Chat',         href: '/dashboard/owners/chat' },
  { label: 'Agreement',    href: '/dashboard/owners/agreement' },
  { label: 'Profile',      href: '/dashboard/owners/profile' },
];

// ─── TEMPLATES DATA ─────────────────────────────────────────────────────────
const AGREEMENT_TEMPLATES: AgreementTemplate[] = [
  {
    id: 'simple-agreement',
    title: 'Simple Tenancy Agreement',
    complexity: 'Simple',
    description: 'A basic, short tenancy agreement covering only the absolute essentials (parties, address, rent, start date). Ideal for quick sub-leases or informal setups.',
    fields: [
      { id: 'tenantName', label: 'Tenant Name', question: "What is the Tenant's Full Name?", placeholder: 'e.g. Julianne Voss' },
      { id: 'propertyAddress', label: 'Property Address', question: 'What is the full address of the rental property?', placeholder: 'e.g. Sunset Apartments, Apt 402, Harbor Side' },
      { id: 'rentAmount', label: 'Monthly Rent', question: 'What is the monthly rent amount (including currency)?', placeholder: 'e.g. $1,200 / month' },
      { id: 'startDate', label: 'Lease Start Date', question: 'What is the lease start date?', placeholder: 'e.g. June 1, 2026' }
    ],
    generateText: (values) => `SIMPLE TENANCY AGREEMENT

Date: ${new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}

1. PARTIES:
This Agreement is made between Stayzo Properties (Landlord) and the Tenant:
TENANT Name: ${values.tenantName || '___________________________'}

2. PROPERTY PREMISES:
The Landlord agrees to rent to the Tenant the property located at:
ADDRESS: ${values.propertyAddress || '___________________________'}

3. RENT & PAYMENT:
The Tenant agrees to pay a Monthly Rent of:
RENT: ${values.rentAmount || '___________________________'}
payable on the first day of each calendar month.

4. START DATE:
The tenancy commences on the following start date:
START DATE: ${values.startDate || '___________________________'}

5. AGREEMENT TERMS:
The Tenant agrees to maintain the property in a clean state and hand it back in the same condition at the end of the tenancy.

LANDLORD:                                TENANT:
Stayzo Properties

_________________________                _________________________
Signature                                Signature`
  },
  {
    id: 'standard-agreement',
    title: 'Standard Lease Agreement',
    complexity: 'Standard',
    description: 'Our most popular template. Extends the simple template by including security deposits, advanced rent, lease duration, and standard covenants.',
    fields: [
      { id: 'tenantName', label: 'Tenant Name', question: "What is the Tenant's Full Name?", placeholder: 'e.g. Julianne Voss' },
      { id: 'propertyAddress', label: 'Property Address', question: 'What is the full address of the rental property?', placeholder: 'e.g. Sunset Apartments, Apt 402, Harbor Side' },
      { id: 'rentAmount', label: 'Monthly Rent', question: 'What is the monthly rent amount (including currency)?', placeholder: 'e.g. $1,800 / month' },
      { id: 'depositAmount', label: 'Security Deposit', question: 'What is the security deposit amount?', placeholder: 'e.g. $3,000' },
      { id: 'startDate', label: 'Lease Start Date', question: 'What is the start date of the lease?', placeholder: 'e.g. June 1, 2026' },
      { id: 'duration', label: 'Lease Duration', question: 'What is the duration of the lease term?', placeholder: 'e.g. 12 months' },
      { id: 'advancePayment', label: 'Advanced Payment', question: 'What are the advanced payment details?', placeholder: 'e.g. 2 months rent ($3,600)' }
    ],
    generateText: (values) => `STANDARD LEASE AGREEMENT

THIS LEASE AGREEMENT (hereinafter referred to as the "Agreement") is entered into on this ${new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })} by and between Stayzo Premier Properties (Landlord) and:

TENANT: ${values.tenantName || '___________________________'}

1. PREMISES: Landlord hereby leases to Tenant the real property located at:
PROPERTY ADDRESS: ${values.propertyAddress || '___________________________'}

2. LEASE TERM: The lease shall commence on ${values.startDate || '___________'} and shall remain in effect for a period of ${values.duration || '___________'}.

3. PAYMENT OF RENT: Tenant agrees to pay monthly rent in the amount of ${values.rentAmount || '___________'} on or before the first day of each calendar month.

4. ADVANCED PAYMENT: Tenant agrees to make an advanced payment of ${values.advancePayment || '___________'} upon signing, to be applied towards the rental term.

5. SECURITY DEPOSIT: Tenant shall deposit the sum of ${values.depositAmount || '___________'} with Landlord as a security deposit for damages or default under this Agreement.

6. CONDITION & COVENANTS: Tenant agrees to keep the premises in a sanitary and good condition and comply with all housing regulations.

IN WITNESS WHEREOF, the Landlord and Tenant have executed this Agreement on the day and year first above written.

LANDLORD:                                TENANT:
Stayzo Premier Properties

_________________________                _________________________
Signature                                Signature`
  },
  {
    id: 'detailed-agreement',
    title: 'Comprehensive Lease Agreement',
    complexity: 'Detailed',
    description: 'A comprehensive, strict legal agreement. Adds sections for utilities responsibility, pet rules, late payment fees, and property maintenance terms to minimize disputes.',
    fields: [
      { id: 'tenantName', label: 'Tenant Name', question: "What is the Tenant's Full Name?", placeholder: 'e.g. Julianne Voss' },
      { id: 'propertyAddress', label: 'Property Address', question: 'What is the full address of the rental property?', placeholder: 'e.g. Sunset Apartments, Apt 402, Harbor Side' },
      { id: 'rentAmount', label: 'Monthly Rent', question: 'What is the monthly rent amount (including currency)?', placeholder: 'e.g. $2,200 / month' },
      { id: 'depositAmount', label: 'Security Deposit', question: 'What is the security deposit amount?', placeholder: 'e.g. $4,450' },
      { id: 'startDate', label: 'Lease Start Date', question: 'What is the lease start date?', placeholder: 'e.g. June 1, 2026' },
      { id: 'duration', label: 'Lease Duration', question: 'What is the duration of the lease?', placeholder: 'e.g. 12 months' },
      { id: 'advancePayment', label: 'Advanced Payment', question: 'What are the advanced payment details?', placeholder: 'e.g. 3 months rent ($6,600)' },
      { id: 'utilities', label: 'Utilities Terms', question: 'Who is responsible for utility payments (water, electricity, gas, internet)?', placeholder: 'e.g. Tenant pays electricity and water; Landlord pays gas and internet.' },
      { id: 'petPolicy', label: 'Pet Policy', question: 'What is the policy regarding pets in the property?', placeholder: 'e.g. Small pets under 15 lbs allowed with a $300 pet fee; no aggressive breeds.' },
      { id: 'lateFee', label: 'Late Rent Penalty', question: 'What is the penalty for late rent payments?', placeholder: 'e.g. A late fee of $50 plus 1% daily for payments made after the 5th of the month.' },
      { id: 'maintenance', label: 'Maintenance Rules', question: 'Who handles property maintenance and minor repairs?', placeholder: 'e.g. Tenant handles repairs under $50; Landlord handles structural and appliance failures.' }
    ],
    generateText: (values) => `COMPREHENSIVE LEASE AGREEMENT

THIS LEASE AGREEMENT is executed on this ${new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })} by and between Stayzo Executive Properties (Landlord) and:

TENANT: ${values.tenantName || '___________________________'}

1. DESCRIPTION OF PREMISES:
Landlord leases to Tenant the premises located at:
PROPERTY ADDRESS: ${values.propertyAddress || '___________________________'}

2. DURATION & TERM:
The lease commences on ${values.startDate || '___________'} and runs for a term of ${values.duration || '___________'}.

3. MONTHLY RENT:
Rent is set at ${values.rentAmount || '___________'} per month, due in advance on the 1st day of the month.

4. ADVANCED RENT PAYMENT:
Tenant shall pay an advanced sum of ${values.advancePayment || '___________'} to be credited towards the initial months.

5. SECURITY DEPOSIT:
Tenant shall pay a security deposit of ${values.depositAmount || '___________'} held as security for damages.

6. UTILITIES PAYMENT:
${values.utilities || '___________________________'}

7. PET POLICY:
${values.petPolicy || '___________________________'}

8. LATE FEE PENALTIES:
${values.lateFee || '___________________________'}

9. PROPERTY MAINTENANCE & REPAIRS:
${values.maintenance || '___________________________'}

10. SEVERABILITY & GOVERNING LAW:
If any provision of this lease is declared invalid, the remainder shall continue in effect. This lease is governed by local jurisdiction laws.

LANDLORD:                                TENANT:
Stayzo Executive Properties

_________________________                _________________________
Signature                                Signature`
  }
];

// ─── VISUAL DESIGN THEMES ────────────────────────────────────────────────────
type VisualTheme = 'classic-legal' | 'modern-clean' | 'executive-elite';

const VISUAL_THEMES = [
  { id: 'classic-legal' as VisualTheme, label: '📜 Classic Legal', description: 'Traditional legal serif layout with double-page borders.' },
  { id: 'modern-clean' as VisualTheme, label: '📱 Modern Clean', description: 'Spacious sans-serif style with vertical accent line quotes.' },
  { id: 'executive-elite' as VisualTheme, label: '💎 Executive Elite', description: 'Premium corporate layout with structured tables and dark accents.' }
];

// ─── SUB-COMPONENT: DESKTOP DRAWING PAD ─────────────────────────────────────
function DesktopCanvasPad({ onSave }: { onSave: (dataUrl: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Setup initial canvas styles
    ctx.strokeStyle = '#1A1A1A';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Draw a grey dotted guide line
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

    // Redraw guide line
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
          className="px-4 py-2 border border-slate-200 text-slate-700 hover:border-slate-400 text-[10px] font-black uppercase rounded-lg transition-colors"
        >
          Clear
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-[#1A1A1A] hover:bg-black text-white text-[10px] font-black uppercase rounded-lg transition-colors shadow-sm"
        >
          Apply Signature
        </button>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function OwnerAgreementPage() {
  const pathname = usePathname();
  
  // App States
  const [selectedTemplate, setSelectedTemplate] = useState<AgreementTemplate | null>(null);
  const [currentFieldIdx, setCurrentFieldIdx] = useState<number>(0);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [chatHistory, setChatHistory] = useState<Array<{ id: string; sender: 'bot' | 'user'; text: string; time: string }>>([]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'fields'>('chat');
  const [selectedTheme, setSelectedTheme] = useState<VisualTheme>('classic-legal');
  
  const [savedAgreements, setSavedAgreements] = useState<SavedAgreement[]>([]);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [activePreviewField, setActivePreviewField] = useState<string | null>(null);

  // Signatures State
  const [landlordSig, setLandlordSig] = useState<string | null>(null);
  const [tenantSig, setTenantSig] = useState<string | null>(null);
  const [showSigModal, setShowSigModal] = useState<'landlord' | 'tenant' | null>(null);
  const [sigModalTab, setSigModalTab] = useState<'qr' | 'draw'>('qr');
  const [mobileBaseUrl, setMobileBaseUrl] = useState<string>('');
  const [customIp, setCustomIp] = useState<string>('');
  const [socket, setSocket] = useState<Socket | null>(null);
  
  // Use a unique draft ID (timestamp-based) for the socket room
  const [activeDraftId] = useState<string>(`draft_${Date.now()}`);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Set mobile URL for QR code and init Socket.io
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('stayzo_landlord_sig');
      localStorage.removeItem('stayzo_tenant_sig');
      setMobileBaseUrl(`${window.location.origin}/dashboard/owners/agreement/sign`);

      // Initialize Socket connection to backend
      const backendUrl = `http://${window.location.hostname}:3001`;
      const newSocket = io(backendUrl);
      setSocket(newSocket);

      newSocket.on('connect', () => {
        newSocket.emit('join_draft', activeDraftId);
      });

      newSocket.on('signature_received', (data: { role: 'landlord' | 'tenant', signatureDataUrl: string }) => {
        if (data.role === 'landlord') {
          setLandlordSig(data.signatureDataUrl);
          showToast("Landlord signature received from mobile!");
        } else {
          setTenantSig(data.signatureDataUrl);
          showToast("Tenant signature received from mobile!");
        }
        setShowSigModal(null);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [activeDraftId]);

  // Compute final QR code URL (append draftId)
  const getQrCodeUrl = () => {
    if (customIp.trim()) {
      // Clean custom IP input from protocols or trailing slashes
      const cleanIp = customIp.trim().replace(/^(https?:\/\/)?/, '').replace(/\/$/, '');
      const port = window.location.port ? `:${window.location.port}` : '';
      return `http://${cleanIp}${port}/dashboard/owners/agreement/sign?role=${showSigModal}&draftId=${activeDraftId}`;
    }
    return `${mobileBaseUrl}?role=${showSigModal}&draftId=${activeDraftId}`;
  };

  // Listen to Storage events (fallback from phone signature pads on same device)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'stayzo_landlord_sig' && e.newValue) {
        setLandlordSig(e.newValue);
        showToast("Landlord signature received locally!");
        setShowSigModal(null);
        localStorage.removeItem('stayzo_landlord_sig'); // clean up
      }
      if (e.key === 'stayzo_tenant_sig' && e.newValue) {
        setTenantSig(e.newValue);
        showToast("Tenant signature received locally!");
        setShowSigModal(null);
        localStorage.removeItem('stayzo_tenant_sig'); // clean up
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Load saved agreements from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('stayzo_agreements_v2');
      if (stored) {
        setSavedAgreements(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load saved agreements", e);
    }
  }, []);

  // Save agreements to localStorage helper
  const saveAgreementsToLocalStorage = (agreements: SavedAgreement[]) => {
    try {
      localStorage.setItem('stayzo_agreements_v2', JSON.stringify(agreements));
      setSavedAgreements(agreements);
    } catch (e) {
      console.error("Failed to save agreements", e);
    }
  };

  // Scroll chat to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isTyping]);

  // Set active input highlight when field changes
  useEffect(() => {
    if (selectedTemplate) {
      const activeField = selectedTemplate.fields[currentFieldIdx];
      if (activeField) {
        setActivePreviewField(activeField.id);
      }
    } else {
      setActivePreviewField(null);
    }
  }, [selectedTemplate, currentFieldIdx]);

  // Start Drafting a new agreement from a template
  const handleStartDraft = (template: AgreementTemplate) => {
    setSelectedTemplate(template);
    setCurrentFieldIdx(0);
    setLandlordSig(null);
    setTenantSig(null);
    
    // Reset values
    const initialValues: Record<string, string> = {};
    template.fields.forEach(f => {
      initialValues[f.id] = '';
    });
    setFieldValues(initialValues);

    // Initialize chatbot
    const firstField = template.fields[0];
    const initialMessage = {
      id: 'welcome',
      sender: 'bot' as const,
      text: `Hello! I am your Stayzo Agreement Assistant. Let's draft your **${template.title}** (${template.complexity} version). \n\nI will ask you a few simple questions one by one. \n\nTo start: **${firstField.question}**`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatHistory([initialMessage]);
    setChatInput('');
    setActiveTab('chat');
  };

  // Exit current drafting
  const handleExitDraft = () => {
    if (window.confirm("Are you sure you want to exit the current draft? Your unsaved progress will be lost.")) {
      setSelectedTemplate(null);
      setChatHistory([]);
      setFieldValues({});
      setLandlordSig(null);
      setTenantSig(null);
    }
  };

  // Simulate bot typing delay
  const askNextQuestion = (nextIdx: number, currentVals: Record<string, string>, previousAnswer: string, prevFieldName: string) => {
    if (!selectedTemplate) return;
    
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      
      const isFinished = nextIdx >= selectedTemplate.fields.length;
      let botText = '';
      
      if (isFinished) {
        botText = `Excellent! I have recorded the **${prevFieldName}** as **"${previousAnswer}"**.\n\n🎉 **All details for the agreement have been filled!** \n\nYou can now switch between visual themes on the right preview pane, click on the **Landlord Sign** or **Tenant Sign** buttons at the bottom of the document to sign, and click **"Save"** or **"Print PDF"** to complete.`;
      } else {
        const nextField = selectedTemplate.fields[nextIdx];
        botText = `Got it. Registered **${prevFieldName}** as **"${previousAnswer}"**.\n\nQuestion ${nextIdx + 1} of ${selectedTemplate.fields.length}: **${nextField.question}**`;
      }

      setChatHistory(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: botText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);

      if (isFinished) {
        setCurrentFieldIdx(selectedTemplate.fields.length);
      } else {
        setCurrentFieldIdx(nextIdx);
      }
    }, 900);
  };

  // Handle Send Chat
  const handleSendChat = (textToSend?: string) => {
    const text = (textToSend !== undefined ? textToSend : chatInput).trim();
    if (!text || !selectedTemplate) return;

    if (currentFieldIdx >= selectedTemplate.fields.length) {
      setChatHistory(prev => [
        ...prev,
        { id: Math.random().toString(), sender: 'user', text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
        { id: Math.random().toString(), sender: 'bot', text: "The agreement is fully completed! You can review or edit any field in the 'Manual Form' tab, or click the fields in the document preview itself.", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
      if (textToSend === undefined) setChatInput('');
      return;
    }

    const currentField = selectedTemplate.fields[currentFieldIdx];
    const nextVals = { ...fieldValues, [currentField.id]: text };
    setFieldValues(nextVals);

    const userMessage = {
      id: Math.random().toString(),
      sender: 'user' as const,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, userMessage]);
    if (textToSend === undefined) setChatInput('');

    askNextQuestion(currentFieldIdx + 1, nextVals, text, currentField.label);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendChat();
    }
  };

  // Autofill sample data based on selected complexity
  const handleQuickFill = () => {
    if (!selectedTemplate) return;

    let sampleVals: Record<string, string> = {};
    if (selectedTemplate.id === 'simple-agreement') {
      sampleVals = {
        tenantName: 'Julianne Voss',
        propertyAddress: 'Sunset Apartments, Apt 402, Harbor Side, Zone 4',
        rentAmount: '$1,200 / month',
        startDate: 'June 1, 2026'
      };
    } else if (selectedTemplate.id === 'standard-agreement') {
      sampleVals = {
        tenantName: 'Julianne Voss',
        propertyAddress: 'Sunset Apartments, Apt 402, Harbor Side, Zone 4',
        rentAmount: '$1,800 / month',
        depositAmount: '$3,600',
        startDate: 'June 1, 2026',
        duration: '12 Months',
        advancePayment: '2 Months Rent ($3,600)'
      };
    } else if (selectedTemplate.id === 'detailed-agreement') {
      sampleVals = {
        tenantName: 'Julianne Voss',
        propertyAddress: 'Sunset Apartments, Apt 402, Harbor Side, Zone 4',
        rentAmount: '$2,200 / month',
        depositAmount: '$4,400',
        startDate: 'June 1, 2026',
        duration: '12 Months',
        advancePayment: '3 Months Rent ($6,600)',
        utilities: 'Tenant is responsible for water, electric, and waste disposal. Landlord pays for fiber internet.',
        petPolicy: 'One small dog or cat allowed (under 25 lbs) with an additional $300 pet damage deposit.',
        lateFee: 'Rent is due on the 1st. A grace period is given until the 5th, after which a flat late fee of $100 applies.',
        maintenance: 'Tenant handles light bulbs and minor repairs under $75. Landlord handles plumbing, HVAC, and structural faults.'
      };
    }

    setFieldValues(sampleVals);
    setCurrentFieldIdx(selectedTemplate.fields.length);
    
    setChatHistory(prev => [
      ...prev,
      {
        id: Math.random().toString(),
        sender: 'user',
        text: '✨ [Auto-fill template sample data]',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      {
        id: Math.random().toString(),
        sender: 'bot',
        text: `✨ I have successfully auto-filled the **${selectedTemplate.title}** with demo details! \n\nYou can now see it loaded in the preview pane. Swap styles, make changes, or sign it at the bottom.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Jump to specific field for editing when clicking in document
  const handleJumpToField = (fieldId: string) => {
    if (!selectedTemplate) return;
    const idx = selectedTemplate.fields.findIndex(f => f.id === fieldId);
    if (idx === -1) return;

    setCurrentFieldIdx(idx);
    setActiveTab('chat');
    setActivePreviewField(fieldId);

    const field = selectedTemplate.fields[idx];
    setChatHistory(prev => [
      ...prev,
      {
        id: Math.random().toString(),
        sender: 'bot',
        text: `Let's edit the **${field.label}** (currently: "${fieldValues[fieldId] || 'Not set'}"). \n\nPlease provide the new value:`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleManualFieldChange = (fieldId: string, val: string) => {
    setFieldValues(prev => ({
      ...prev,
      [fieldId]: val
    }));
  };

  // Save to vault (localStorage)
  const handleSaveToVault = () => {
    if (!selectedTemplate) return;
    
    const tenantName = fieldValues.tenantName || 'Unnamed Tenant';
    const propertyAddress = fieldValues.propertyAddress || 'No Address Specified';
    const rentAmount = fieldValues.rentAmount || 'N/A';

    const newAgreement: SavedAgreement = {
      id: 'agree_' + Date.now(),
      templateId: selectedTemplate.id,
      templateTitle: selectedTemplate.title,
      complexity: selectedTemplate.complexity,
      tenantName,
      propertyAddress,
      rentAmount,
      dateCreated: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      visualTheme: selectedTheme,
      values: fieldValues,
      landlordSig: landlordSig || undefined,
      tenantSig: tenantSig || undefined
    };

    const updated = [newAgreement, ...savedAgreements];
    saveAgreementsToLocalStorage(updated);

    showToast("Agreement successfully saved to Stayzo Document Vault!");
  };

  const handleDeleteAgreement = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the agreement for "${name}"?`)) {
      const filtered = savedAgreements.filter(a => a.id !== id);
      saveAgreementsToLocalStorage(filtered);
      showToast("Agreement deleted successfully.");
    }
  };

  const showToast = (message: string) => {
    setSuccessToast(message);
    setTimeout(() => {
      setSuccessToast(null);
    }, 4000);
  };

  const handleCopyText = () => {
    if (!selectedTemplate) return;
    const text = selectedTemplate.generateText(fieldValues);
    navigator.clipboard.writeText(text);
    showToast("Contract text copied to clipboard!");
  };

  // Print function
  const handlePrint = () => {
    const printContent = document.getElementById('contract-printable-area');
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const templateTitle = selectedTemplate?.title || "Rental Agreement";
      const textHtml = printContent.innerHTML;
      
      let themeStyles = '';
      if (selectedTheme === 'classic-legal') {
        themeStyles = `
          body {
            font-family: 'Times New Roman', Times, serif;
            line-height: 1.8;
            padding: 50px;
            color: #000;
            background-color: #fff;
          }
          .printable-paper {
            border: 4px double #000;
            padding: 40px;
          }
          h1, h2, h3, .doc-title {
            text-align: center;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 25px;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
          }
          p { margin-bottom: 1.2rem; text-align: justify; }
          .clause-title { font-weight: bold; margin-top: 1.5rem; margin-bottom: 0.5rem; text-transform: uppercase; }
          .signature-section { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 50px; }
        `;
      } else if (selectedTheme === 'modern-clean') {
        themeStyles = `
          body {
            font-family: 'Inter', system-ui, sans-serif;
            line-height: 1.6;
            padding: 40px;
            color: #2D3748;
            background-color: #fff;
          }
          .doc-title {
            font-size: 24px;
            font-weight: 800;
            color: #1A1A1A;
            margin-bottom: 30px;
            text-transform: uppercase;
            border-left: 5px solid #1A1A1A;
            padding-left: 15px;
          }
          p { margin-bottom: 1rem; }
          .clause-title { font-weight: 700; color: #1A1A1A; margin-top: 1.8rem; margin-bottom: 0.5rem; }
          .highlight-card { background-color: #F7FAFC; border: 1px solid #E2E8F0; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .signature-section { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 60px; }
        `;
      } else { // executive-elite
        themeStyles = `
          body {
            font-family: 'Georgia', serif;
            line-height: 1.7;
            padding: 45px;
            color: #1A202C;
            background-color: #fff;
          }
          .doc-title {
            text-align: center;
            font-size: 20px;
            font-weight: 900;
            color: #0F172A;
            letter-spacing: 0.05em;
            margin-bottom: 30px;
            padding-bottom: 15px;
            border-bottom: 3px double #0F172A;
          }
          p { margin-bottom: 1.1rem; text-align: justify; }
          .clause-title { font-weight: 800; color: #0F172A; margin-top: 1.6rem; margin-bottom: 0.4rem; text-transform: uppercase; font-size: 13px; }
          .highlight-card { border-left: 4px solid #0F172A; background-color: #F8FAFC; padding: 15px; margin: 15px 0; }
          .signature-section { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 50px; }
        `;
      }

      printWindow.document.write(`
        <html>
          <head>
            <title>${templateTitle} - Stayzo</title>
            <style>
              ${themeStyles}
              .signature-line { border-bottom: 1px solid #94A3B8; height: 35px; width: 100%; margin-bottom: 5px; }
              .sig-img-print { max-height: 45px; object-fit: contain; }
              .hide-on-print { display: none !important; }
              span {
                font-family: inherit !important;
                font-size: inherit !important;
                font-weight: bold !important;
                background: none !important;
                border: none !important;
                padding: 0 !important;
                color: inherit !important;
              }
            </style>
          </head>
          <body>
            <div class="printable-paper">
              ${textHtml}
            </div>
            <script>
              window.onload = function() {
                window.print();
                window.close();
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const getProgressPercentage = () => {
    if (!selectedTemplate) return 0;
    const total = selectedTemplate.fields.length;
    const filled = selectedTemplate.fields.filter(f => fieldValues[f.id] && fieldValues[f.id].trim() !== '').length;
    return Math.round((filled / total) * 100);
  };

  // Dynamic Highlight Field Span
  const getFieldSpan = (fieldId: string, label: string) => {
    const val = fieldValues[fieldId];
    const isActive = activePreviewField === fieldId;
    return (
      <span
        onClick={() => handleJumpToField(fieldId)}
        className={`inline-block cursor-pointer px-1.5 py-0.5 mx-1 rounded font-mono text-[12px] transition-all duration-200 ${
          isActive
            ? 'bg-black text-white ring-2 ring-black font-extrabold scale-105 shadow-md'
            : val
            ? 'bg-gray-100 text-gray-900 border-b border-dashed border-gray-400 font-bold hover:bg-gray-200'
            : 'bg-[#EDE9FE] text-[#7C3AED] border-b-2 border-dashed border-[#8B5CF6] font-bold animate-pulse hover:bg-[#DDD6FE]'
        }`}
        title={`Click to edit ${label}`}
      >
        {val || `[Enter ${label}]`}
      </span>
    );
  };

  // Helper to render signature UI block inside the document preview
  const renderSignatureBlock = (roleType: 'landlord' | 'tenant', defaultName: string) => {
    const signature = roleType === 'landlord' ? landlordSig : tenantSig;
    const setSig = roleType === 'landlord' ? setLandlordSig : setTenantSig;
    const title = roleType === 'landlord' ? 'Landlord Representative' : 'Tenant Signature';

    return (
      <div>
        <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-2">{title}</p>
        
        {signature ? (
          <div className="flex flex-col items-start space-y-1">
            <img 
              src={signature} 
              alt={`${roleType} Signature`} 
              className="h-10 object-contain my-1 bg-slate-50 border border-slate-100 rounded px-1.5 py-0.5 sig-img-print" 
            />
            <button 
              onClick={(e) => { e.stopPropagation(); setSig(null); }} 
              className="text-[9px] text-red-500 hover:underline font-sans font-bold hide-on-print"
            >
              Remove
            </button>
          </div>
        ) : (
          <button 
            onClick={(e) => { e.stopPropagation(); setShowSigModal(roleType); setSigModalTab('qr'); }}
            className="text-[10px] border border-dashed border-purple-300 bg-purple-50 hover:bg-purple-100 text-purple-700 font-extrabold px-3 py-2 rounded-lg flex items-center gap-1.5 mt-2 transition-all hover:scale-[1.01] hide-on-print"
          >
            <FileSignature className="w-3.5 h-3.5" />
            <span>Sign Contract</span>
          </button>
        )}
        
        <div className="signature-line border-b border-gray-400 w-full h-1 mt-1" />
        <p className="font-bold mt-1 text-[#1A1A1A]">{defaultName}</p>
      </div>
    );
  };

  // Interactive HTML document structure
  const renderInteractiveDocument = () => {
    if (!selectedTemplate) return null;

    const landlordName = "Stayzo Premier Properties";
    const tenantName = fieldValues.tenantName || 'Tenant Full Name';

    // 1. SIMPLE TEMPLATE LAYOUT
    if (selectedTemplate.id === 'simple-agreement') {
      return (
        <div className="space-y-5">
          <div className="doc-title text-center font-black tracking-tight text-[16px] md:text-[18px] uppercase border-b pb-3 mb-6">
            SIMPLE TENANCY AGREEMENT
          </div>
          
          <p className="text-[13px] md:text-[14px]">
            This Tenancy Agreement is created on this <strong>{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>, by and between the Landlord, <strong>Stayzo Properties</strong>, and the Tenant:
          </p>

          <div className="highlight-card bg-gray-50 border border-gray-100 p-4 rounded-xl">
            <span className="block text-[9px] font-black text-gray-400 tracking-wider uppercase mb-1">TENANT INFORMATION</span>
            <strong>TENANT NAME:</strong> {getFieldSpan('tenantName', 'Tenant Name')}
          </div>

          <p className="text-[13px] md:text-[14px]">
            <strong>1. RENTAL PREMISES:</strong> <br />
            The Landlord agrees to lease to the Tenant, and the Tenant agrees to lease, the property located at: <br />
            {getFieldSpan('propertyAddress', 'Property Address')}
          </p>

          <p className="text-[13px] md:text-[14px]">
            <strong>2. RENT AMOUNT:</strong> <br />
            The Monthly Rent for the premises is set at {getFieldSpan('rentAmount', 'Monthly Rent')}, payable in advance on the 1st of each month.
          </p>

          <p className="text-[13px] md:text-[14px]">
            <strong>3. COMMENCEMENT DATE:</strong> <br />
            This tenancy will officially begin on {getFieldSpan('startDate', 'Start Date')}.
          </p>

          <p className="text-[13px] md:text-[14px] italic text-gray-500">
            * The Tenant agrees to maintain the premises in a clean and safe condition and restore it to its original status at checkout, normal wear and tear excepted.
          </p>

          <div className="signature-section border-t border-gray-100 pt-8 mt-12 grid grid-cols-2 gap-12 text-[12px]">
            {renderSignatureBlock('landlord', 'Stayzo Properties')}
            {renderSignatureBlock('tenant', tenantName)}
          </div>
        </div>
      );
    }

    // 2. STANDARD TEMPLATE LAYOUT
    if (selectedTemplate.id === 'standard-agreement') {
      return (
        <div className="space-y-6">
          <div className="doc-title text-center font-black tracking-tight text-[16px] md:text-[18px] uppercase border-b pb-3 mb-6">
            STANDARD LEASE AGREEMENT
          </div>

          <p className="text-[13px] md:text-[14px]">
            THIS LEASE AGREEMENT (hereinafter referred to as the "Agreement") is entered into on this{' '}
            <strong>{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>, by and between the Landlord, <strong>Stayzo Premier Properties</strong>, and the Tenant:
          </p>

          <div className="highlight-card bg-gray-50 border border-gray-100 p-4 rounded-xl">
            <span className="block text-[9px] font-black text-gray-400 tracking-wider uppercase mb-1">CONTRACT PARTIES</span>
            <strong>TENANT NAME:</strong> {getFieldSpan('tenantName', 'Tenant Name')}
          </div>

          <p className="clause-title font-bold text-[12px] uppercase text-[#1A1A1A] tracking-wider mt-5">1. LEASED PREMISES</p>
          <p className="text-[13px] md:text-[14px]">
            Landlord hereby rents to Tenant the residential property located at: <br />
            <strong>PROPERTY ADDRESS:</strong> {getFieldSpan('propertyAddress', 'Property Address')}
          </p>

          <p className="clause-title font-bold text-[12px] uppercase text-[#1A1A1A] tracking-wider mt-5">2. LEASE DURATION</p>
          <p className="text-[13px] md:text-[14px]">
            The term of this lease shall commence on {getFieldSpan('startDate', 'Start Date')} and shall remain in effect for a period of {getFieldSpan('duration', 'Lease Duration')}.
          </p>

          <p className="clause-title font-bold text-[12px] uppercase text-[#1A1A1A] tracking-wider mt-5">3. MONTHLY RENT</p>
          <p className="text-[13px] md:text-[14px]">
            Tenant agrees to pay monthly rent in the amount of {getFieldSpan('rentAmount', 'Monthly Rent')} on the first day of each calendar month. Payments shall be made online via the Stayzo payment gateway.
          </p>

          <p className="clause-title font-bold text-[12px] uppercase text-[#1A1A1A] tracking-wider mt-5">4. ADVANCED PAYMENT</p>
          <p className="text-[13px] md:text-[14px]">
            Tenant agrees to pay an Advanced Rental Payment of {getFieldSpan('advancePayment', 'Advanced Rent')} upon execution of this Agreement, to be applied to the initial months.
          </p>

          <p className="clause-title font-bold text-[12px] uppercase text-[#1A1A1A] tracking-wider mt-5">5. SECURITY DEPOSIT</p>
          <p className="text-[13px] md:text-[14px]">
            Tenant shall deposit the sum of {getFieldSpan('depositAmount', 'Security Deposit')} as security for any damage caused to the premises or defaults under this Agreement. This deposit shall be returned within 30 days of lease expiration, less any lawful deductions.
          </p>

          <div className="signature-section border-t border-gray-200 pt-8 mt-12 grid grid-cols-2 gap-12 text-[12px]">
            {renderSignatureBlock('landlord', landlordName)}
            {renderSignatureBlock('tenant', tenantName)}
          </div>
        </div>
      );
    }

    // 3. COMPREHENSIVE/DETAILED TEMPLATE LAYOUT
    if (selectedTemplate.id === 'detailed-agreement') {
      return (
        <div className="space-y-6">
          <div className="doc-title text-center font-black tracking-tight text-[16px] md:text-[18px] uppercase border-b pb-3 mb-6">
            COMPREHENSIVE LEASE AGREEMENT
          </div>

          <p className="text-[13px] md:text-[14px]">
            THIS COMPREHENSIVE LEASE AGREEMENT (hereinafter referred to as the "Agreement") is entered into on this{' '}
            <strong>{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>, by and between the Landlord, <strong>Stayzo Executive Properties</strong>, and the Tenant:
          </p>

          <div className="highlight-card bg-gray-50 border border-gray-100 p-4 rounded-xl">
            <span className="block text-[9px] font-black text-gray-400 tracking-wider uppercase mb-1">TENANT DESIGNATION</span>
            <strong>TENANT NAME:</strong> {getFieldSpan('tenantName', 'Tenant Name')}
          </div>

          <p className="clause-title font-bold text-[12px] uppercase text-[#1A1A1A] tracking-wider mt-5">1. LEASED PREMISES & PROPERTY</p>
          <p className="text-[13px] md:text-[14px]">
            Landlord hereby rents to Tenant the residential property located at: <br />
            <strong>PROPERTY ADDRESS:</strong> {getFieldSpan('propertyAddress', 'Property Address')}
          </p>

          <p className="clause-title font-bold text-[12px] uppercase text-[#1A1A1A] tracking-wider mt-5">2. DURATION & TERM</p>
          <p className="text-[13px] md:text-[14px]">
            The term of this lease shall commence on {getFieldSpan('startDate', 'Start Date')} and shall remain in effect for a period of {getFieldSpan('duration', 'Lease Duration')}.
          </p>

          <p className="clause-title font-bold text-[12px] uppercase text-[#1A1A1A] tracking-wider mt-5">3. PAYMENT OF MONTHLY RENT</p>
          <p className="text-[13px] md:text-[14px]">
            Tenant agrees to pay monthly rent in the amount of {getFieldSpan('rentAmount', 'Monthly Rent')} on the first day of each calendar month. Payments shall be made online via the Stayzo payment gateway.
          </p>

          <p className="clause-title font-bold text-[12px] uppercase text-[#1A1A1A] tracking-wider mt-5">4. ADVANCED RENT PAYMENT</p>
          <p className="text-[13px] md:text-[14px]">
            Tenant agrees to pay an Advanced Rental Payment of {getFieldSpan('advancePayment', 'Advanced Rent')} upon execution of this Agreement, to be applied to the initial months.
          </p>

          <p className="clause-title font-bold text-[12px] uppercase text-[#1A1A1A] tracking-wider mt-5">5. SECURITY DEPOSIT</p>
          <p className="text-[13px] md:text-[14px]">
            Tenant shall deposit the sum of {getFieldSpan('depositAmount', 'Security Deposit')} as security for any damage caused to the premises or defaults under this Agreement. This deposit shall be returned within 30 days of lease expiration, less any lawful deductions.
          </p>

          <p className="clause-title font-bold text-[12px] uppercase text-[#1A1A1A] tracking-wider mt-5">6. UTILITIES PAYMENT & RESPONSIBILITIES</p>
          <p className="text-[13px] md:text-[14px]">
            The parties agree to split utilities expenses as follows: <br />
            {getFieldSpan('utilities', 'Utilities Terms')}
          </p>

          <p className="clause-title font-bold text-[12px] uppercase text-[#1A1A1A] tracking-wider mt-5">7. PET RULES & REGULATIONS</p>
          <p className="text-[13px] md:text-[14px]">
            The animal/pet policy for the premises is defined as follows: <br />
            {getFieldSpan('petPolicy', 'Pet Policy')}
          </p>

          <p className="clause-title font-bold text-[12px] uppercase text-[#1A1A1A] tracking-wider mt-5">8. LATE FEE PENALTY CLAUSE</p>
          <p className="text-[13px] md:text-[14px]">
            Late payments received after the grace period shall incur the following late fee charges: <br />
            {getFieldSpan('lateFee', 'Late Rent Penalty')}
          </p>

          <p className="clause-title font-bold text-[12px] uppercase text-[#1A1A1A] tracking-wider mt-5">9. PROPERTY MAINTENANCE & MINOR REPAIRS</p>
          <p className="text-[13px] md:text-[14px]">
            Maintenance duties are distributed as follows: <br />
            {getFieldSpan('maintenance', 'Maintenance Rules')}
          </p>

          <div className="signature-section border-t border-gray-200 pt-8 mt-12 grid grid-cols-2 gap-12 text-[12px]">
            {renderSignatureBlock('landlord', 'Stayzo Executive Properties')}
            {renderSignatureBlock('tenant', tenantName)}
          </div>
        </div>
      );
    }
  };

  // Get active visual theme css class
  const getThemeClass = () => {
    switch (selectedTheme) {
      case 'classic-legal':
        return 'font-serif border-4 border-double border-gray-800 p-8 md:p-12 text-justify bg-white leading-relaxed text-gray-900';
      case 'modern-clean':
        return 'font-sans p-8 md:p-10 text-left bg-white text-gray-700 leading-loose';
      case 'executive-elite':
        return 'font-serif border-l-8 border-gray-900 p-8 md:p-11 text-justify bg-[#FAFAFA] text-slate-800 leading-normal';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F0EEF8] font-sans pb-10">
      
      {/* ── Navbar ── */}
      <header className="w-full bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-[60px] flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="flex items-end space-x-[3px] h-5">
              <div className="w-[3px] h-3 bg-[#1A1A1A] rounded-full" />
              <div className="w-[3px] h-5 bg-[#1A1A1A] rounded-full" />
              <div className="w-[3px] h-4 bg-[#1A1A1A] rounded-full" />
              <div className="w-[3px] h-2.5 bg-[#1A1A1A] rounded-full" />
            </div>
            <span className="text-[15px] font-black tracking-tight text-[#1A1A1A] uppercase">Stayzo</span>
          </Link>

          {/* Center Nav */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`relative px-4 py-2 text-[13px] font-semibold transition-colors ${
                    isActive
                      ? 'text-[#1A1A1A]'
                      : 'text-gray-500 hover:text-[#1A1A1A]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-[#1A1A1A] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="flex items-center space-x-1.5 bg-[#1A1A1A] hover:bg-black text-white text-[11px] font-extrabold tracking-wider uppercase px-4 py-2.5 rounded-full transition-colors shadow-md"
            >
              <span>I AM A TENANT</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
            <button
              id="agreement-notifications-btn"
              className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-[#1A1A1A]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#1A1A1A] rounded-full" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Page Content ── */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-10 py-8">
        
        {/* Toast Notification */}
        {successToast && (
          <div className="fixed top-20 right-6 bg-[#1A1A1A] text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
            <span className="text-[11px] font-black uppercase tracking-widest leading-none">{successToast}</span>
          </div>
        )}

        {/* ── SIGNATURE METHOD MODAL ── */}
        {showSigModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-[430px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              
              {/* Modal Header */}
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-[14px] font-black text-slate-900 uppercase tracking-tight">
                    Add {showSigModal === 'landlord' ? 'Landlord' : 'Tenant'} Signature
                  </h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">Choose your signature method</p>
                </div>
                <button 
                  onClick={() => setShowSigModal(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors"
                >
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              {/* Tab Selector */}
              <div className="flex border-b border-slate-100">
                <button
                  onClick={() => setSigModalTab('qr')}
                  className={`flex-1 py-3 text-center text-[10px] font-black tracking-widest uppercase transition-all flex items-center justify-center gap-1.5 ${
                    sigModalTab === 'qr'
                      ? 'bg-white border-b-2 border-b-black text-black'
                      : 'text-gray-400 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span>Scan QR Code</span>
                </button>
                <button
                  onClick={() => setSigModalTab('draw')}
                  className={`flex-1 py-3 text-center text-[10px] font-black tracking-widest uppercase transition-all flex items-center justify-center gap-1.5 ${
                    sigModalTab === 'draw'
                      ? 'bg-white border-b-2 border-b-black text-black'
                      : 'text-gray-400 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <MousePointerClick className="w-4 h-4" />
                  <span>Draw on Screen</span>
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                {sigModalTab === 'qr' ? (
                  /* METHOD A: QR CODE FOR MOBILE SIGNING */
                  <div className="text-center space-y-5">
                    <p className="text-[11px] text-gray-500 font-medium">
                      Scan this QR code with your mobile phone camera to open the secure signing pad. Draw your signature on your phone screen, and it will update here in real-time.
                    </p>

                    {/* Local Network IP Input */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-left space-y-1.5">
                      <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest">
                        🔌 Scanning with a real phone?
                      </label>
                      <input
                        type="text"
                        placeholder="Enter computer Local IP (e.g. 192.168.1.15)"
                        value={customIp}
                        onChange={(e) => setCustomIp(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded bg-white text-[11px] font-semibold text-slate-700 outline-none focus:border-slate-400"
                      />
                      <p className="text-[8px] text-slate-450 font-medium leading-normal">
                        Tip: Open terminal on your computer and run <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-slate-800">ipconfig</code> to find your IPv4 Address. Ensure both devices are on the same Wi-Fi network.
                      </p>
                    </div>
                    
                    {/* QR Code Container */}
                    <div className="mx-auto w-[180px] h-[180px] bg-white border border-slate-200 rounded-xl p-2 flex items-center justify-center shadow-inner">
                      {mobileBaseUrl ? (
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(getQrCodeUrl())}`}
                          alt="Signature QR Code" 
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-6 h-6 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                      )}
                    </div>

                    <div className="flex flex-col items-center space-y-2">
                      <div className="flex items-center gap-1.5 justify-center text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">
                        <Smartphone className="w-4 h-4 text-purple-600" />
                        <span>Awaiting mobile signature...</span>
                      </div>
                      
                      {/* Desktop Sandbox Test Link */}
                      <a
                        href={getQrCodeUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-black text-purple-700 hover:underline uppercase tracking-wider pt-2"
                      >
                        [Open mobile tab in new window for testing]
                      </a>
                    </div>
                  </div>
                ) : (
                  /* METHOD B: DESKTOP DRAWING BOARD */
                  <DesktopCanvasPad 
                    onSave={(dataUrl) => {
                      if (showSigModal === 'landlord') {
                        setLandlordSig(dataUrl);
                        showToast("Landlord signature applied!");
                      } else {
                        setTenantSig(dataUrl);
                        showToast("Tenant signature applied!");
                      }
                      setShowSigModal(null);
                    }} 
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {!selectedTemplate ? (
          /* ──────────────────────────────────────────────────────────────────
             1. TEMPLATE SELECTION PAGE (Simple vs Standard vs Detailed)
             ────────────────────────────────────────────────────────────────── */
          <div className="space-y-10 animate-in fade-in duration-300">
            
            {/* Page Header */}
            <div>
              <h1 className="text-[32px] md:text-[40px] font-black text-[#1A1A1A] uppercase tracking-tight leading-none">
                Smart Agreement Hub
              </h1>
              <p className="text-[14px] text-gray-500 font-medium mt-2 max-w-2xl">
                Draft binding lease agreements. Select a template based on the complexity you need, and the chatbot assistant will walk you through the details to build the contract.
              </p>
              <div className="w-8 h-[3px] bg-[#1A1A1A] mt-4" />
            </div>

            {/* Template Selection Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {AGREEMENT_TEMPLATES.map((tmpl) => (
                <div 
                  key={tmpl.id}
                  className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-between hover:border-[#1A1A1A] hover:shadow-lg transition-all duration-300 group"
                >
                  <div>
                    {/* Complexity badge */}
                    <div className="flex justify-between items-center">
                      <span className={`text-[9px] font-black tracking-widest uppercase border px-2.5 py-1 rounded ${
                        tmpl.complexity === 'Simple'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                          : tmpl.complexity === 'Standard'
                          ? 'bg-blue-50 border-blue-200 text-blue-600'
                          : 'bg-purple-50 border-purple-200 text-purple-600'
                      }`}>
                        {tmpl.complexity} Version
                      </span>
                      <span className="text-[10px] text-gray-400 font-bold font-mono">
                        {tmpl.fields.length} Questions
                      </span>
                    </div>

                    <h3 className="text-[18px] font-black text-[#1A1A1A] mt-4 group-hover:text-black">
                      {tmpl.title}
                    </h3>
                    <p className="text-[12px] text-gray-500 mt-2 leading-relaxed">
                      {tmpl.description}
                    </p>

                    {/* Fields List details */}
                    <div className="mt-5 space-y-2">
                      <div className="text-[10px] font-black text-[#1A1A1A] uppercase tracking-widest flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-gray-400" />
                        Variables asked by Assistant:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {tmpl.fields.map(f => (
                          <span key={f.id} className="text-[10px] font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
                            {f.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartDraft(tmpl)}
                    className="mt-8 w-full bg-[#1A1A1A] hover:bg-black text-white text-[11px] font-extrabold tracking-widest uppercase py-3.5 rounded-xl transition-all shadow-md group-hover:shadow-lg flex items-center justify-center gap-2 group-hover:scale-[1.01]"
                  >
                    <span>Start Draft</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              ))}
            </div>

            {/* Saved Agreements (Vault) list */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-gray-100 pb-5">
                <div>
                  <h3 className="text-[16px] font-black text-[#1A1A1A] uppercase tracking-wider flex items-center gap-2">
                    <Scale className="w-5 h-5 text-gray-500" />
                    Digital Vault: Saved Agreements
                  </h3>
                  <p className="text-[12px] text-gray-400 font-medium">Drafted legal documents stored in local session storage.</p>
                </div>
                <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  {savedAgreements.length} SAVED CONTRACTS
                </span>
              </div>

              {savedAgreements.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-xl">
                  <FileSignature className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-[13px] font-bold text-gray-400 uppercase tracking-widest">No saved contracts found</p>
                  <p className="text-[12px] text-gray-400 mt-1 max-w-sm mx-auto">Select a template above to generate your first agreement.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedAgreements.map((ag) => (
                    <div 
                      key={ag.id}
                      className="border border-gray-200 rounded-xl p-5 hover:border-gray-400 transition-colors flex flex-col justify-between bg-gray-50/50"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className={`text-[9px] font-bold uppercase tracking-widest border px-2 py-0.5 rounded ${
                              ag.complexity === 'Simple'
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                                : ag.complexity === 'Standard'
                                ? 'bg-blue-50 border-blue-200 text-blue-600'
                                : 'bg-purple-50 border-purple-200 text-purple-600'
                            }`}>
                              {ag.complexity} Version
                            </span>
                            <h4 className="text-[14px] font-black text-[#1A1A1A] mt-2.5 truncate max-w-[220px]">
                              {ag.tenantName}
                            </h4>
                          </div>
                          <span className="text-[10px] text-gray-400 font-medium font-mono">{ag.dateCreated}</span>
                        </div>

                        <div className="text-[11px] space-y-1.5 text-gray-500 font-medium">
                          <div className="truncate">
                            <span className="font-bold text-gray-400">Address:</span> {ag.propertyAddress}
                          </div>
                          <div>
                            <span className="font-bold text-gray-400">Rent:</span> {ag.rentAmount}
                          </div>
                          <div className="flex gap-4 pt-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            <span>Landlord: {ag.landlordSig ? '✍️ Signed' : '❌ Unsigned'}</span>
                            <span>Tenant: {ag.tenantSig ? '✍️ Signed' : '❌ Unsigned'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-5">
                        <button
                          onClick={() => {
                            const tmpl = AGREEMENT_TEMPLATES.find(t => t.id === ag.templateId);
                            if (tmpl) {
                              setSelectedTemplate(tmpl);
                              setFieldValues(ag.values);
                              setCurrentFieldIdx(tmpl.fields.length);
                              setLandlordSig(ag.landlordSig || null);
                              setTenantSig(ag.tenantSig || null);
                              if (ag.visualTheme) setSelectedTheme(ag.visualTheme as VisualTheme);
                              setChatHistory([
                                {
                                  id: 'reopen',
                                  sender: 'bot',
                                  text: `Loaded saved **${ag.complexity}** agreement for **${ag.tenantName}**. You can preview, edit details, and add or clear signatures.`,
                                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                }
                              ]);
                            }
                          }}
                          className="flex items-center gap-1 text-[11px] font-black text-[#1A1A1A] hover:underline"
                        >
                          <Info className="w-3.5 h-3.5" />
                          <span>Open in Workspace</span>
                        </button>

                        <button
                          onClick={() => handleDeleteAgreement(ag.id, ag.tenantName)}
                          className="text-red-500 hover:text-red-700 flex items-center justify-center p-1 hover:bg-red-50 rounded transition-colors"
                          title="Delete Contract"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        ) : (
          /* ──────────────────────────────────────────────────────────────────
             2. ACTIVE DRAFTING SPLIT INTERFACE
             ────────────────────────────────────────────────────────────────── */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
            
            {/* Breadcrumb / Top Bar */}
            <div className="lg:col-span-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleExitDraft}
                  className="bg-white hover:bg-gray-100 border border-gray-200 p-2 rounded-full transition-colors flex items-center justify-center"
                  title="Exit Draft"
                >
                  <ArrowLeft className="w-4 h-4 text-[#1A1A1A]" />
                </button>
                <div>
                  <div className="text-[10px] font-black text-gray-400 tracking-widest uppercase">
                    Template: {selectedTemplate.complexity} Lease
                  </div>
                  <h2 className="text-[20px] font-black text-[#1A1A1A] tracking-tight">{selectedTemplate.title}</h2>
                </div>
              </div>

              {/* Progress and Autofill */}
              <div className="flex items-center gap-4 flex-wrap">
                <button
                  onClick={handleQuickFill}
                  className="bg-white border border-gray-200 hover:border-[#1A1A1A] text-[#1A1A1A] text-[10px] font-extrabold tracking-widest uppercase px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 hover:scale-[1.01]"
                  title="Fill with dummy data"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
                  <span>Autofill Sample</span>
                </button>

                <div className="flex items-center gap-2.5">
                  <div className="w-[100px] bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-black h-full transition-all duration-300"
                      style={{ width: `${getProgressPercentage()}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-black text-[#1A1A1A] uppercase tracking-wider whitespace-nowrap font-mono">
                    {getProgressPercentage()}% Done
                  </span>
                </div>
              </div>
            </div>

            {/* Left side: Interactive Chatbot / Manual Form */}
            <div className="lg:col-span-5 flex flex-col h-[650px] bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              
              {/* Tab Header */}
              <div className="flex border-b border-gray-100 bg-gray-50 flex-shrink-0">
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`flex-1 py-4 text-center text-[11px] font-black tracking-widest uppercase transition-all ${
                    activeTab === 'chat'
                      ? 'bg-white border-b-2 border-b-black text-black'
                      : 'text-gray-400 hover:text-slate-950 hover:bg-white/50'
                  }`}
                >
                  🤖 Chatbot Assistant
                </button>
                <button
                  onClick={() => setActiveTab('fields')}
                  className={`flex-1 py-4 text-center text-[11px] font-black tracking-widest uppercase transition-all ${
                    activeTab === 'fields'
                      ? 'bg-white border-b-2 border-b-black text-black'
                      : 'text-gray-400 hover:text-slate-950 hover:bg-white/50'
                  }`}
                >
                  📝 Manual Form
                </button>
              </div>

              {activeTab === 'chat' ? (
                /* CHATBOT VIEW */
                <div className="flex-1 flex flex-col overflow-hidden min-h-0">
                  
                  {/* Chat Assistant Header Info */}
                  <div className="bg-[#EDE9FE]/50 border-b border-[#DDD6FE] p-3 px-4 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-2.5">
                      <div className="relative w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0 shadow-sm text-white">
                        <Sparkles className="w-4 h-4" />
                        <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white" />
                      </div>
                      <div>
                        <div className="text-[11px] font-black text-purple-950 uppercase tracking-wider">Stayzo Assistant</div>
                        <div className="text-[9px] text-purple-600 font-bold uppercase tracking-widest">Active Drafting Process</div>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono text-purple-700 bg-white border border-purple-200 px-2 py-0.5 rounded">
                      Step {Math.min(currentFieldIdx + 1, selectedTemplate.fields.length)} of {selectedTemplate.fields.length}
                    </span>
                  </div>

                  {/* Message Bubble Log */}
                  <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
                    {chatHistory.map((msg) => (
                      <div 
                        key={msg.id}
                        className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                      >
                        <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-[12px] leading-relaxed font-semibold shadow-sm ${
                          msg.sender === 'user'
                            ? 'bg-[#1A1A1A] text-white rounded-tr-sm'
                            : 'bg-gray-100 text-[#1A1A1A] rounded-tl-sm border border-gray-100'
                        }`}>
                          <p className="whitespace-pre-line">{msg.text}</p>
                        </div>
                        <span className="text-[8px] font-bold text-gray-400 mt-1 uppercase tracking-widest">{msg.time}</span>
                      </div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                      <div className="flex flex-col items-start">
                        <div className="bg-gray-100 text-gray-400 px-4 py-3 rounded-2xl rounded-tl-sm border border-gray-100 flex items-center gap-1 shadow-sm">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Form Area */}
                  <div className="p-4 border-t border-gray-100 flex-shrink-0">
                    <div className="flex items-center gap-2 border border-gray-200 focus-within:border-gray-400 rounded-xl p-1 bg-white transition-colors">
                      <input
                        type="text"
                        placeholder={
                          currentFieldIdx < selectedTemplate.fields.length
                            ? `Type ${selectedTemplate.fields[currentFieldIdx].label}...`
                            : "Draft completed! Review right pane."
                        }
                        disabled={currentFieldIdx >= selectedTemplate.fields.length}
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={handleInputKeyDown}
                        className="flex-1 px-3 py-2.5 text-[12px] font-bold tracking-wide text-black placeholder-gray-300 bg-transparent outline-none disabled:opacity-50"
                      />
                      <button
                        onClick={() => handleSendChat()}
                        disabled={!chatInput.trim() || currentFieldIdx >= selectedTemplate.fields.length}
                        className="bg-[#1A1A1A] hover:bg-black text-white p-2.5 rounded-lg disabled:opacity-30 disabled:hover:bg-[#1A1A1A] transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Helper Suggestions */}
                    {currentFieldIdx < selectedTemplate.fields.length && (
                      <div className="mt-2 flex items-center justify-between text-[10px] text-gray-400">
                        <span>Answer assistant prompts to compile agreement clauses.</span>
                        {selectedTemplate.fields[currentFieldIdx].placeholder && (
                          <button 
                            onClick={() => setChatInput(selectedTemplate.fields[currentFieldIdx].placeholder.replace(/^e\.g\.\s+/, ''))}
                            className="text-purple-600 font-bold hover:underline"
                          >
                            Use Suggestion
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* MANUAL FIELDS VIEW */
                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                  <div className="text-[11px] font-semibold text-gray-400 pb-3 border-b border-gray-100">
                    Adjust specific parameters manually. Updates render live in the selected design theme.
                  </div>
                  {selectedTemplate.fields.map((field, index) => (
                    <div key={field.id} className="space-y-1.5">
                      <label className="block text-[11px] font-black text-gray-700 uppercase tracking-widest">
                        {index + 1}. {field.label}
                      </label>
                      <input
                        type="text"
                        placeholder={field.placeholder}
                        value={fieldValues[field.id] || ''}
                        onChange={(e) => handleManualFieldChange(field.id, e.target.value)}
                        onFocus={() => setActivePreviewField(field.id)}
                        className={`w-full px-4 py-3 border rounded-xl text-[12px] font-semibold outline-none transition-all ${
                          activePreviewField === field.id
                            ? 'border-black ring-2 ring-black/10 text-black'
                            : 'border-gray-200 text-gray-700 hover:border-gray-400'
                        }`}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right side: Live Agreement Preview with Theme Selector */}
            <div className="lg:col-span-7 flex flex-col h-[650px] overflow-hidden">
              
              {/* Layout Switcher Toolbar */}
              <div className="bg-white border border-gray-200 rounded-xl p-3 px-4 mb-4 flex-shrink-0 shadow-sm space-y-3">
                
                {/* Visual Theme Selector Header */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="flex items-center gap-2 text-[10px] font-black text-[#1A1A1A] uppercase tracking-wider">
                    <Layout className="w-4 h-4 text-gray-500" />
                    Select Layout Design Style (CV-Style Templates):
                  </span>
                  
                  {/* Action Group */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleCopyText}
                      className="p-1.5 border border-gray-200 hover:border-gray-400 text-gray-600 rounded-md transition-colors bg-white"
                      title="Copy Raw Text"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={handlePrint}
                      className="px-2.5 py-1.5 bg-white border border-gray-200 hover:border-[#1A1A1A] text-gray-700 text-[9px] font-black uppercase tracking-wider rounded-md transition-colors flex items-center gap-1"
                      title="Print / Save PDF"
                    >
                      <Download className="w-3 h-3" />
                      <span>Print PDF</span>
                    </button>
                    <button
                      onClick={handleSaveToVault}
                      className="px-3 py-1.5 bg-[#1A1A1A] hover:bg-black text-white text-[9px] font-black uppercase tracking-wider rounded-md transition-colors flex items-center gap-1 shadow-sm"
                      title="Save to Vault"
                    >
                      <Check className="w-3 h-3" />
                      <span>Save</span>
                    </button>
                  </div>
                </div>

                {/* Switcher Buttons */}
                <div className="grid grid-cols-3 gap-2">
                  {VISUAL_THEMES.map((theme) => {
                    const isActive = selectedTheme === theme.id;
                    return (
                      <button
                        key={theme.id}
                        onClick={() => setSelectedTheme(theme.id)}
                        className={`p-2.5 rounded-lg border text-left transition-all ${
                          isActive
                            ? 'border-black bg-black text-white ring-2 ring-black/10'
                            : 'border-gray-200 hover:border-gray-400 bg-gray-50 text-gray-700'
                        }`}
                      >
                        <div className={`text-[10px] font-black uppercase tracking-wider ${isActive ? 'text-white' : 'text-gray-900'}`}>
                          {theme.label}
                        </div>
                        <div className={`text-[8px] font-medium leading-normal mt-0.5 ${isActive ? 'text-gray-300' : 'text-gray-400'}`}>
                          {theme.description}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Document Paper Canvas */}
              <div className="flex-1 bg-white border border-gray-200 shadow-md rounded-xl overflow-y-auto p-8 md:p-12 relative no-scrollbar">
                
                {/* Printable Paper Wrapper with Theme classes applied */}
                <div 
                  id="contract-printable-area" 
                  className={`mx-auto max-w-[620px] transition-all duration-300 ${getThemeClass()}`}
                >
                  {renderInteractiveDocument()}
                </div>

                {/* Click-to-edit guide watermark */}
                <div className="absolute top-4 right-4 bg-gray-100/80 backdrop-blur-sm border border-gray-200 text-[8px] font-black uppercase text-gray-400 px-2.5 py-1 rounded-full tracking-widest pointer-events-none select-none flex items-center gap-1">
                  <Info className="w-3 h-3 text-gray-400" />
                  <span>Interactive document</span>
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
