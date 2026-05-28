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
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  Trash2, 
  Copy, 
  FileSignature,
  FileSpreadsheet,
  RefreshCw,
  Info,
  Calendar,
  Layers,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import Footer from '@/components/Footer';

// ─── TYPES ──────────────────────────────────────────────────────────────────
interface TemplateField {
  id: string;
  label: string;
  question: string;
  placeholder: string;
  defaultValue?: string;
  validationRule?: (val: string) => string | null;
}

interface AgreementTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  fields: TemplateField[];
  generateText: (values: Record<string, string>) => string;
}

interface SavedAgreement {
  id: string;
  templateId: string;
  templateTitle: string;
  tenantName: string;
  propertyAddress: string;
  rentAmount: string;
  dateCreated: string;
  values: Record<string, string>;
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
    id: 'residential-lease',
    title: 'Residential Lease Agreement',
    description: 'Standard contract for renting residential apartments, homes, or individual rooms to tenants.',
    category: 'Long-Term Residential',
    icon: 'Home',
    fields: [
      { id: 'tenantName', label: 'Tenant Name', question: "What is the Tenant's Full Name?", placeholder: 'e.g. Julianne Voss' },
      { id: 'propertyAddress', label: 'Property Address', question: 'What is the full address of the rental property?', placeholder: 'e.g. Sunset Apartments, Suite 402, Harbor Side' },
      { id: 'rentAmount', label: 'Monthly Rent', question: 'What is the monthly rent amount (including currency)?', placeholder: 'e.g. $1,800' },
      { id: 'depositAmount', label: 'Security Deposit', question: 'What is the security deposit amount?', placeholder: 'e.g. $3,000' },
      { id: 'startDate', label: 'Lease Start Date', question: 'What is the start date of the lease?', placeholder: 'e.g. June 1, 2026' },
      { id: 'duration', label: 'Lease Duration', question: 'What is the duration of the lease?', placeholder: 'e.g. 12 months' },
      { id: 'advancePayment', label: 'Advanced Payment', question: 'What is the required advanced payment details?', placeholder: 'e.g. 2 months rent ($3,600)' },
    ],
    generateText: (values) => `RESIDENTIAL LEASE AGREEMENT

THIS LEASE AGREEMENT (hereinafter referred to as the "Agreement") is made and entered into on this ${new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })} by and between the Landlord, Stayzo Premier Properties, and the Tenant:

TENANT: ${values.tenantName || '___________________________'}

1. PREMISES. Landlord hereby leases to Tenant, and Tenant hereby leases from Landlord, the real property located at:
PROPERTY ADDRESS: ${values.propertyAddress || '___________________________'}

2. TERM. The lease shall commence on ${values.startDate || '___________'} and shall remain in effect for a period of ${values.duration || '___________'}.

3. PAYMENT OF RENT. Tenant agrees to pay monthly rent in the amount of ${values.rentAmount || '___________'} on the first day of each calendar month. 

4. ADVANCED PAYMENT. Tenant agrees to make an advanced payment of ${values.advancePayment || '___________'} upon the execution of this Agreement. This advanced payment shall be applied to the initial months of the lease term.

5. SECURITY DEPOSIT. Tenant shall deposit the sum of ${values.depositAmount || '___________'} with Landlord as a security deposit for any damage caused to the premises or default under this Agreement. This deposit shall be refunded within 30 days of lease termination, less any lawful deductions.

6. USE OF PREMISES. The premises shall be used and occupied by Tenant exclusively as a private residential dwelling. Tenant shall keep the premises in a clean, sanitary, and good condition.

7. BINDING EFFECT. The covenants and conditions herein contained shall apply to and bind the heirs, legal representatives, and assigns of the parties hereto.

IN WITNESS WHEREOF, the Landlord and Tenant have executed this Agreement on the day and year first above written.

LANDLORD:                                TENANT:
Stayzo Premier Properties

_________________________                _________________________
Signature                                Signature`
  },
  {
    id: 'commercial-lease',
    title: 'Commercial Lease Agreement',
    description: 'Contract for renting commercial office spaces, retail shops, or business hubs.',
    category: 'Commercial Property',
    icon: 'Building',
    fields: [
      { id: 'tenantBusiness', label: 'Business Name', question: "What is the Tenant's Registered Business Name?", placeholder: 'e.g. Vector Solutions LLC' },
      { id: 'repName', label: 'Representative Name', question: "Who is the business's signing representative?", placeholder: 'e.g. Marcus Thorne' },
      { id: 'propertyAddress', label: 'Commercial Address', question: 'What is the address of the commercial property?', placeholder: 'e.g. Vector Plaza, Suite 801, Financial Hub' },
      { id: 'rentAmount', label: 'Base Monthly Rent', question: 'What is the base monthly rent amount?', placeholder: 'e.g. $4,500' },
      { id: 'depositAmount', label: 'Security Deposit', question: 'What is the security deposit amount?', placeholder: 'e.g. $9,000' },
      { id: 'permittedUse', label: 'Permitted Use', question: 'What is the permitted business use of the premises?', placeholder: 'e.g. Corporate tech offices' },
      { id: 'escalationRate', label: 'Escalation Rate', question: 'What is the annual rent escalation rate?', placeholder: 'e.g. 5% annually' },
      { id: 'advancePayment', label: 'Advanced Payment', question: 'What is the required advanced payment details?', placeholder: 'e.g. 3 months rent ($13,500)' },
    ],
    generateText: (values) => `COMMERCIAL LEASE AGREEMENT

THIS COMMERCIAL LEASE AGREEMENT is made on this ${new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })} by and between the Landlord, Stayzo Premier Properties, and the Tenant:

TENANT: ${values.tenantBusiness || '___________________________'}
REPRESENTED BY: ${values.repName || '___________________________'}

1. PREMISES. Landlord leases to Tenant, and Tenant leases from Landlord, the commercial property located at:
PROPERTY ADDRESS: ${values.propertyAddress || '___________________________'}

2. TERM. The lease shall commence on ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} and shall remain in effect for a term of 36 months, subject to renewal.

3. BASE RENT. Tenant agrees to pay base monthly rent of ${values.rentAmount || '___________'} on the first day of each calendar month. 

4. RENT ESCALATION. The base monthly rent shall escalate at a rate of ${values.escalationRate || '___________'} on each anniversary of the lease commencement date.

5. ADVANCED PAYMENT. Tenant shall pay an advanced payment of ${values.advancePayment || '___________'} upon signing, which shall be applied to the first rent periods.

6. SECURITY DEPOSIT. Tenant shall deposit the sum of ${values.depositAmount || '___________'} as security for the full and faithful performance of every provision of this lease.

7. PERMITTED USE. The premises shall be used solely for the purpose of:
USE: ${values.permittedUse || '___________________________'}
and for no other business or purpose without the prior written consent of the Landlord.

8. MAINTENANCE & REPAIRS. Tenant shall, at its sole cost, maintain the interior of the premises and keep it in a good state of repair.

IN WITNESS WHEREOF, the parties hereto have executed this lease.

LANDLORD:                                TENANT:
Stayzo Premier Properties                For: ${values.tenantBusiness || 'Tenant Business'}

_________________________                _________________________
Signature                                Signature (Representative)`
  },
  {
    id: 'vacation-rental',
    title: 'Vacation Rental Agreement',
    description: 'Short-term contract for holiday bookings, guest houses, or weekend stays.',
    category: 'Short-Term / Vacation',
    icon: 'Tent',
    fields: [
      { id: 'guestName', label: 'Guest Name', question: "What is the Guest's Full Name?", placeholder: 'e.g. Robert Smith' },
      { id: 'propertyAddress', label: 'Property Address', question: 'What is the address of the vacation property?', placeholder: 'e.g. Skyline Pavilion, Penthouse A' },
      { id: 'checkInDate', label: 'Check-in Date', question: 'What is the check-in date and check-in time?', placeholder: 'e.g. July 10, 2026 at 3:00 PM' },
      { id: 'checkOutDate', label: 'Check-out Date', question: 'What is the check-out date and check-out time?', placeholder: 'e.g. July 17, 2026 at 11:00 AM' },
      { id: 'rentalFee', label: 'Total Rental Fee', question: 'What is the total rental fee for the entire stay?', placeholder: 'e.g. $2,100' },
      { id: 'cleaningFee', label: 'Cleaning Fee', question: 'What is the one-time cleaning fee amount?', placeholder: 'e.g. $150' },
      { id: 'depositAmount', label: 'Security Deposit', question: 'What is the refundable security deposit amount?', placeholder: 'e.g. $500' },
      { id: 'advancePayment', label: 'Advanced Payment', question: 'What is the required booking prepayment details?', placeholder: 'e.g. Full prepayment of $2,250' },
    ],
    generateText: (values) => `SHORT-TERM VACATION RENTAL AGREEMENT

THIS VACATION RENTAL AGREEMENT is entered into on this ${new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })} by and between Stayzo Host Services (Landlord) and the Primary Guest:

GUEST: ${values.guestName || '___________________________'}

1. PROPERTY. The rental property is located at:
PROPERTY ADDRESS: ${values.propertyAddress || '___________________________'}

2. TERM OF OCCUPANCY. 
CHECK-IN: ${values.checkInDate || '___________________________'}
CHECK-OUT: ${values.checkOutDate || '___________________________'}

3. RENTAL FEES & CHARGES. Guest agrees to the following booking breakdown:
TOTAL RENTAL FEE: ${values.rentalFee || '___________'}
CLEANING FEE: ${values.cleaningFee || '___________'}
REFUNDABLE DAMAGE DEPOSIT: ${values.depositAmount || '___________'}

4. PREPAYMENT & RESERVATION. Guest has paid an Advanced Booking Payment of ${values.advancePayment || '___________'} to secure this reservation. 

5. CANCELLATION POLICY. Cancellations made more than 14 days prior to check-in will receive a full refund. Cancellations within 14 days of check-in are non-refundable.

6. HOUSE RULES. Guest agrees to abide by all house rules, including: no smoking, no unauthorized parties, and respect for neighborhood quiet hours (10 PM - 8 AM). Any violations may result in immediate eviction without refund.

IN WITNESS WHEREOF, the Host and Guest have agreed to the terms above.

HOST:                                    GUEST:
Stayzo Host Services

_________________________                _________________________
Signature                                Signature`
  }
];

// ─── COMPONENT ──────────────────────────────────────────────────────────────
export default function OwnerAgreementPage() {
  const pathname = usePathname();
  
  // States
  const [selectedTemplate, setSelectedTemplate] = useState<AgreementTemplate | null>(null);
  const [currentFieldIdx, setCurrentFieldIdx] = useState<number>(0);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [chatHistory, setChatHistory] = useState<Array<{ id: string; sender: 'bot' | 'user'; text: string; time: string }>>([]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'fields'>('chat');
  const [savedAgreements, setSavedAgreements] = useState<SavedAgreement[]>([]);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [activePreviewField, setActivePreviewField] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load saved agreements from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('stayzo_agreements');
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
      localStorage.setItem('stayzo_agreements', JSON.stringify(agreements));
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
      text: `Hello! I am your Stayzo Agreement Assistant. Let's draft your **${template.title}**! I will ask you a few simple questions. \n\nTo start: **${firstField.question}**`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatHistory([initialMessage]);
    setChatInput('');
    setActiveTab('chat');
  };

  // Switch template confirmation
  const handleExitDraft = () => {
    if (window.confirm("Are you sure you want to exit the current draft? Your unsaved progress will be lost.")) {
      setSelectedTemplate(null);
      setChatHistory([]);
      setFieldValues({});
    }
  };

  // Add bot message with delay for a natural chat feel
  const askNextQuestion = (nextIdx: number, currentVals: Record<string, string>, previousAnswer: string, prevFieldName: string) => {
    if (!selectedTemplate) return;
    
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      
      const isFinished = nextIdx >= selectedTemplate.fields.length;
      let botText = '';
      
      if (isFinished) {
        botText = `Superb! I've updated the **${prevFieldName}** to **"${previousAnswer}"**.\n\n🎉 **All details have been successfully gathered!** You can review the fully generated contract on the right. \n\nClick **"Save to Vault"** to store it digitally, or **"Download PDF / Print"** to export.`;
      } else {
        const nextField = selectedTemplate.fields[nextIdx];
        botText = `Got it! Updated **${prevFieldName}** to **"${previousAnswer}"**.\n\nQuestion ${nextIdx + 1} of ${selectedTemplate.fields.length}: **${nextField.question}**`;
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

  // Handle Send Chat message
  const handleSendChat = (textToSend?: string) => {
    const text = (textToSend !== undefined ? textToSend : chatInput).trim();
    if (!text || !selectedTemplate) return;

    if (currentFieldIdx >= selectedTemplate.fields.length) {
      // Completed, handle random chat inputs or help
      setChatHistory(prev => [
        ...prev,
        { id: Math.random().toString(), sender: 'user', text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
        { id: Math.random().toString(), sender: 'bot', text: "The agreement is fully completed! You can review or edit any field in the 'Manual Form' tab, click on the highlighted fields in the document itself to edit them, or save the document.", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
      if (textToSend === undefined) setChatInput('');
      return;
    }

    const currentField = selectedTemplate.fields[currentFieldIdx];
    
    // Update local values
    const nextVals = { ...fieldValues, [currentField.id]: text };
    setFieldValues(nextVals);

    // Add user response to history
    const userMessage = {
      id: Math.random().toString(),
      sender: 'user' as const,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, userMessage]);
    if (textToSend === undefined) setChatInput('');

    // Trigger chatbot transition to next question
    askNextQuestion(currentFieldIdx + 1, nextVals, text, currentField.label);
  };

  // Handle pressing Enter
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendChat();
    }
  };

  // Quick fill sample data for quick demonstration
  const handleQuickFill = () => {
    if (!selectedTemplate) return;

    let sampleVals: Record<string, string> = {};
    if (selectedTemplate.id === 'residential-lease') {
      sampleVals = {
        tenantName: 'Julianne Voss',
        propertyAddress: 'Sunset Apartments, Apt 402, Harbor Side, Zone 4',
        rentAmount: '$1,800 / month',
        depositAmount: '$3,600',
        startDate: 'June 1, 2026',
        duration: '12 Months',
        advancePayment: '2 Months Rent ($3,600)'
      };
    } else if (selectedTemplate.id === 'commercial-lease') {
      sampleVals = {
        tenantBusiness: 'Vector Solutions LLC',
        repName: 'Marcus Thorne',
        propertyAddress: 'Vector Plaza, Suite 801, Financial Hub, Zone 1',
        rentAmount: '$4,500 / month',
        depositAmount: '$9,000',
        permittedUse: 'Corporate software engineering and product sales offices',
        escalationRate: '5% annually',
        advancePayment: '3 Months Rent ($13,500)'
      };
    } else if (selectedTemplate.id === 'vacation-rental') {
      sampleVals = {
        guestName: 'Robert Smith',
        propertyAddress: 'Skyline Pavilion, Penthouse A, Central District',
        checkInDate: 'July 10, 2026 at 3:00 PM',
        checkOutDate: 'July 17, 2026 at 11:00 AM',
        rentalFee: '$2,100 total',
        cleaningFee: '$150',
        depositAmount: '$500 refundable',
        advancePayment: 'Full Booking Prepayment ($2,250)'
      };
    }

    setFieldValues(sampleVals);
    setCurrentFieldIdx(selectedTemplate.fields.length);
    
    // Add chatbot message confirming autofill
    setChatHistory(prev => [
      ...prev,
      {
        id: Math.random().toString(),
        sender: 'user',
        text: '✨ [Auto-fill sample demo data]',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      {
        id: Math.random().toString(),
        sender: 'bot',
        text: `✨ I have successfully auto-filled the template with realistic sample data! \n\nYou can inspect the filled contract on the right, make any adjustments directly, or proceed to save/export!`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Jump to specific field for editing when clicking in document or sidebar
  const handleJumpToField = (fieldId: string) => {
    if (!selectedTemplate) return;
    const idx = selectedTemplate.fields.findIndex(f => f.id === fieldId);
    if (idx === -1) return;

    setCurrentFieldIdx(idx);
    setActiveTab('chat');
    setActivePreviewField(fieldId);

    // Bot asks to update the field
    const field = selectedTemplate.fields[idx];
    setChatHistory(prev => [
      ...prev,
      {
        id: Math.random().toString(),
        sender: 'bot',
        text: `Let's update the **${field.label}** (current: "${fieldValues[fieldId] || 'Not set'}"). \n\nWhat is the new value?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Handle manual field changes from the input form
  const handleManualFieldChange = (fieldId: string, val: string) => {
    setFieldValues(prev => ({
      ...prev,
      [fieldId]: val
    }));
  };

  // Save completed agreement to the vault (localStorage)
  const handleSaveToVault = () => {
    if (!selectedTemplate) return;
    
    // Validate if at least tenantName/guestName or propertyAddress is entered
    const tenantName = fieldValues.tenantName || fieldValues.tenantBusiness || fieldValues.guestName || 'Unnamed Tenant';
    const propertyAddress = fieldValues.propertyAddress || 'No Address Specified';
    const rentAmount = fieldValues.rentAmount || 'N/A';

    const newAgreement: SavedAgreement = {
      id: 'agree_' + Date.now(),
      templateId: selectedTemplate.id,
      templateTitle: selectedTemplate.title,
      tenantName,
      propertyAddress,
      rentAmount,
      dateCreated: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      values: fieldValues
    };

    const updated = [newAgreement, ...savedAgreements];
    saveAgreementsToLocalStorage(updated);

    showToast("Agreement successfully saved to Stayzo Document Vault!");
  };

  // Delete saved agreement
  const handleDeleteAgreement = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the agreement for "${name}"?`)) {
      const filtered = savedAgreements.filter(a => a.id !== id);
      saveAgreementsToLocalStorage(filtered);
      showToast("Agreement deleted successfully.");
    }
  };

  // Trigger toast notification
  const showToast = (message: string) => {
    setSuccessToast(message);
    setTimeout(() => {
      setSuccessToast(null);
    }, 4000);
  };

  // Copy raw contract text to clipboard
  const handleCopyText = () => {
    if (!selectedTemplate) return;
    const text = selectedTemplate.generateText(fieldValues);
    navigator.clipboard.writeText(text);
    showToast("Contract text copied to clipboard!");
  };

  // Trigger browser print of the document
  const handlePrint = () => {
    const printContent = document.getElementById('contract-printable-area');
    if (!printContent) return;

    const originalContent = document.body.innerHTML;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const templateTitle = selectedTemplate?.title || "Rental Agreement";
      const textHtml = printContent.innerHTML;
      
      printWindow.document.write(`
        <html>
          <head>
            <title>${templateTitle} - Stayzo</title>
            <style>
              body {
                font-family: 'Times New Roman', Times, serif;
                line-height: 1.8;
                padding: 40px;
                color: #000;
                background-color: #fff;
              }
              .space-y-6 > * + * {
                margin-top: 1.5rem;
              }
              p {
                margin-bottom: 1rem;
                text-align: justify;
              }
              .text-center { text-align: center; }
              .font-black { font-weight: 900; }
              .text-lg { font-size: 1.25rem; }
              .uppercase { text-transform: uppercase; }
              .border-b-2 { border-bottom: 2px solid #000; }
              .pb-3 { padding-bottom: 0.75rem; }
              .mb-8 { margin-bottom: 2rem; }
              .mt-12 { margin-top: 3rem; }
              .pt-8 { padding-top: 2rem; }
              .border-t { border-top: 1px solid #ccc; }
              .grid { display: grid; }
              .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
              .gap-12 { gap: 3rem; }
              .bg-gray-50 {
                background-color: #f9fafb;
                border: 1px solid #f3f4f6;
                padding: 1rem;
                border-radius: 0.375rem;
                margin-top: 1rem;
                margin-bottom: 1rem;
              }
              .font-bold { font-weight: 700; }
              .text-[11px] { font-size: 11px; }
              .text-gray-500 { color: #6b7280; }
              .block { display: block; }
              .tracking-wider { letter-spacing: 0.05em; }
              /* Remove interactive styled spans back to standard inline prints */
              span {
                font-family: inherit;
                font-size: inherit;
                font-weight: bold;
                background: none !important;
                border: none !important;
                padding: 0 !important;
                color: #000 !important;
              }
            </style>
          </head>
          <body>
            ${textHtml}
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

  // Helper to calculate progress percentage
  const getProgressPercentage = () => {
    if (!selectedTemplate) return 0;
    const totalFields = selectedTemplate.fields.length;
    const filledFields = selectedTemplate.fields.filter(f => fieldValues[f.id] && fieldValues[f.id].trim() !== '').length;
    return Math.round((filledFields / totalFields) * 100);
  };

  // JSX Renderers for each Template document
  const renderDocumentJSX = () => {
    if (!selectedTemplate) return null;

    const getFieldSpan = (fieldId: string, label: string) => {
      const value = fieldValues[fieldId];
      const isActive = activePreviewField === fieldId;
      return (
        <span
          onClick={() => handleJumpToField(fieldId)}
          className={`inline-block cursor-pointer px-2 py-0.5 mx-1 rounded font-mono text-[13px] transition-all duration-200 ${
            isActive
              ? 'bg-black text-white ring-2 ring-black font-extrabold scale-105 shadow-md'
              : value
              ? 'bg-gray-100 text-gray-900 border-b border-dashed border-gray-400 font-bold hover:bg-gray-200'
              : 'bg-[#EDE9FE] text-[#7C3AED] border-b-2 border-dashed border-[#8B5CF6] font-bold animate-pulse hover:bg-[#DDD6FE]'
          }`}
          title={`Click to edit ${label}`}
        >
          {value || `[Enter ${label}]`}
        </span>
      );
    };

    if (selectedTemplate.id === 'residential-lease') {
      return (
        <div className="space-y-6 text-[#1A1A1A] leading-relaxed text-[13px] md:text-[14px]">
          <div className="text-center font-black text-[16px] md:text-[18px] tracking-tight uppercase mb-8 border-b-2 border-[#1A1A1A] pb-3">
            RESIDENTIAL LEASE AGREEMENT
          </div>

          <p>
            THIS LEASE AGREEMENT (hereinafter referred to as the <strong>"Agreement"</strong>) is entered into on this{' '}
            <strong>{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>, by and between the Landlord, <strong>Stayzo Premier Properties</strong>, and the Tenant:
          </p>

          <div className="bg-gray-50 p-4 border border-gray-100 rounded-lg my-4">
            <span className="font-bold text-gray-400 text-[10px] block tracking-wider uppercase mb-1">TENANT DESIGNATION</span>
            <strong>TENANT:</strong> {getFieldSpan('tenantName', 'Tenant Name')}
          </div>

          <p className="font-black text-[12px] mt-6 mb-2 text-[#1A1A1A] uppercase tracking-wide">1. PREMISES</p>
          <p>
            The Landlord hereby leases to the Tenant, and the Tenant hereby leases from the Landlord, the real property located at: <br />
            <strong>PROPERTY ADDRESS:</strong> {getFieldSpan('propertyAddress', 'Property Address')}
          </p>

          <p className="font-black text-[12px] mt-6 mb-2 text-[#1A1A1A] uppercase tracking-wide">2. TERM</p>
          <p>
            The term of this lease shall commence on {getFieldSpan('startDate', 'Start Date')} and shall remain in full force and effect for a period of {getFieldSpan('duration', 'Lease Duration')}.
          </p>

          <p className="font-black text-[12px] mt-6 mb-2 text-[#1A1A1A] uppercase tracking-wide">3. PAYMENT OF RENT</p>
          <p>
            Tenant agrees to pay monthly rent in the amount of {getFieldSpan('rentAmount', 'Monthly Rent')} on the first day of each calendar month. Payment shall be made via electronic transfer to the Landlord's designated bank account.
          </p>

          <p className="font-black text-[12px] mt-6 mb-2 text-[#1A1A1A] uppercase tracking-wide">4. ADVANCED PAYMENT</p>
          <p>
            The Tenant agrees to pay an Advanced Rent Payment of {getFieldSpan('advancePayment', 'Advanced Payment')} upon the execution of this Agreement. This advance shall be credited toward the initial lease periods.
          </p>

          <p className="font-black text-[12px] mt-6 mb-2 text-[#1A1A1A] uppercase tracking-wide">5. SECURITY DEPOSIT</p>
          <p>
            The Tenant shall deposit the sum of {getFieldSpan('depositAmount', 'Security Deposit')} with the Landlord as security for any damages caused to the premises or defaults under this Agreement. This deposit shall be returned within 30 days of the expiration of the lease term, less any lawful deductions.
          </p>

          <p className="font-black text-[12px] mt-6 mb-2 text-[#1A1A1A] uppercase tracking-wide">6. USE OF PREMISES</p>
          <p>
            The premises shall be occupied exclusively as a private residential dwelling. The Tenant shall not use the premises for any business purpose or illegal activity and shall maintain the property in a clean, sanitary condition.
          </p>

          <div className="border-t border-gray-200 pt-8 mt-12 grid grid-cols-2 gap-12 text-[12px]">
            <div>
              <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-8">Landlord Representative</p>
              <div className="border-b border-gray-400 w-full h-8" />
              <p className="font-bold mt-1 text-[#1A1A1A]">Stayzo Premier Properties</p>
            </div>
            <div>
              <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-8">Tenant Signature</p>
              <div className="border-b border-gray-400 w-full h-8" />
              <p className="font-bold mt-1 text-[#1A1A1A]">{fieldValues.tenantName || 'Tenant Full Name'}</p>
            </div>
          </div>
        </div>
      );
    }

    if (selectedTemplate.id === 'commercial-lease') {
      return (
        <div className="space-y-6 text-[#1A1A1A] leading-relaxed text-[13px] md:text-[14px]">
          <div className="text-center font-black text-[16px] md:text-[18px] tracking-tight uppercase mb-8 border-b-2 border-[#1A1A1A] pb-3">
            COMMERCIAL LEASE AGREEMENT
          </div>

          <p>
            THIS COMMERCIAL LEASE AGREEMENT is made and entered into on this{' '}
            <strong>{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>, by and between the Landlord, <strong>Stayzo Premier Properties</strong>, and the Tenant:
          </p>

          <div className="bg-gray-50 p-4 border border-gray-100 rounded-lg my-4 space-y-2">
            <div>
              <span className="font-bold text-gray-400 text-[10px] block tracking-wider uppercase mb-0.5">REGISTERED TENANT ENTITY</span>
              <strong>BUSINESS NAME:</strong> {getFieldSpan('tenantBusiness', 'Business Name')}
            </div>
            <div className="border-t border-gray-200 pt-2">
              <span className="font-bold text-gray-400 text-[10px] block tracking-wider uppercase mb-0.5">SIGNING AUTHORITY</span>
              <strong>REPRESENTATIVE:</strong> {getFieldSpan('repName', 'Representative Name')}
            </div>
          </div>

          <p className="font-black text-[12px] mt-6 mb-2 text-[#1A1A1A] uppercase tracking-wide">1. DESCRIPTION OF PREMISES</p>
          <p>
            Landlord hereby leases to Tenant, and Tenant leases from Landlord, the commercial space located at: <br />
            <strong>PROPERTY ADDRESS:</strong> {getFieldSpan('propertyAddress', 'Commercial Address')}
          </p>

          <p className="font-black text-[12px] mt-6 mb-2 text-[#1A1A1A] uppercase tracking-wide">2. TERM OF LEASE</p>
          <p>
            The commercial lease shall commence on the first day of next calendar month and shall remain in effect for a period of <strong>36 Months</strong>, subject to renewal options defined herein.
          </p>

          <p className="font-black text-[12px] mt-6 mb-2 text-[#1A1A1A] uppercase tracking-wide">3. BASE MONTHLY RENT</p>
          <p>
            Tenant agrees to pay base monthly rent in the amount of {getFieldSpan('rentAmount', 'Base Monthly Rent')} on the first day of each calendar month. Payments made after the 5th day shall incur a 5% late fee penalty.
          </p>

          <p className="font-black text-[12px] mt-6 mb-2 text-[#1A1A1A] uppercase tracking-wide">4. ANNUAL RENT ESCALATION</p>
          <p>
            The base monthly rent shall escalate at a rate of {getFieldSpan('escalationRate', 'Escalation Rate')} on each anniversary of the lease commencement date.
          </p>

          <p className="font-black text-[12px] mt-6 mb-2 text-[#1A1A1A] uppercase tracking-wide">5. ADVANCED PAYMENT</p>
          <p>
            Tenant shall pay an advanced payment of {getFieldSpan('advancePayment', 'Advanced Payment')} upon execution of this Agreement, to be applied to the first lease payments.
          </p>

          <p className="font-black text-[12px] mt-6 mb-2 text-[#1A1A1A] uppercase tracking-wide">6. SECURITY DEPOSIT</p>
          <p>
            Tenant shall deposit the sum of {getFieldSpan('depositAmount', 'Security Deposit')} as security for the full performance of all covenants under this lease.
          </p>

          <p className="font-black text-[12px] mt-6 mb-2 text-[#1A1A1A] uppercase tracking-wide">7. PERMITTED USE OF PREMISES</p>
          <p>
            The premises shall be used solely for the following commercial activity: <br />
            <strong>PERMITTED USE:</strong> {getFieldSpan('permittedUse', 'Permitted Use')}
          </p>

          <div className="border-t border-gray-200 pt-8 mt-12 grid grid-cols-2 gap-12 text-[12px]">
            <div>
              <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-8">Landlord Representative</p>
              <div className="border-b border-gray-400 w-full h-8" />
              <p className="font-bold mt-1 text-[#1A1A1A]">Stayzo Premier Properties</p>
            </div>
            <div>
              <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-8">Tenant Authorized Representative</p>
              <div className="border-b border-gray-400 w-full h-8" />
              <p className="font-bold mt-1 text-[#1A1A1A]">{fieldValues.repName || 'Representative Name'}</p>
              <p className="text-gray-500 text-[11px]">{fieldValues.tenantBusiness || 'Business Name'}</p>
            </div>
          </div>
        </div>
      );
    }

    if (selectedTemplate.id === 'vacation-rental') {
      return (
        <div className="space-y-6 text-[#1A1A1A] leading-relaxed text-[13px] md:text-[14px]">
          <div className="text-center font-black text-[16px] md:text-[18px] tracking-tight uppercase mb-8 border-b-2 border-[#1A1A1A] pb-3">
            SHORT-TERM VACATION RENTAL AGREEMENT
          </div>

          <p>
            THIS VACATION RENTAL AGREEMENT is entered into on this{' '}
            <strong>{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>, by and between Stayzo Host Services, and the Primary Guest:
          </p>

          <div className="bg-gray-50 p-4 border border-gray-100 rounded-lg my-4">
            <span className="font-bold text-gray-400 text-[10px] block tracking-wider uppercase mb-1">PRIMARY GUEST DETAILS</span>
            <strong>PRIMARY GUEST:</strong> {getFieldSpan('guestName', 'Guest Name')}
          </div>

          <p className="font-black text-[12px] mt-6 mb-2 text-[#1A1A1A] uppercase tracking-wide">1. RENTAL PROPERTY</p>
          <p>
            The host hereby rents to the guest for vacation rental purposes, the furnished property located at: <br />
            <strong>VACATION ADDRESS:</strong> {getFieldSpan('propertyAddress', 'Property Address')}
          </p>

          <p className="font-black text-[12px] mt-6 mb-2 text-[#1A1A1A] uppercase tracking-wide">2. RENTAL PERIOD</p>
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg border border-gray-100 text-[12px]">
            <div>
              <strong>CHECK-IN DATE/TIME:</strong> <br />
              {getFieldSpan('checkInDate', 'Check-in Date')}
            </div>
            <div>
              <strong>CHECK-OUT DATE/TIME:</strong> <br />
              {getFieldSpan('checkOutDate', 'Check-out Date')}
            </div>
          </div>

          <p className="font-black text-[12px] mt-6 mb-2 text-[#1A1A1A] uppercase tracking-wide">3. PAYMENT BREAKDOWN</p>
          <p>
            The rental fees for this booking are structured as follows: <br />
            - <strong>TOTAL RENTAL FEE:</strong> {getFieldSpan('rentalFee', 'Total Rental Fee')} <br />
            - <strong>ONE-TIME CLEANING FEE:</strong> {getFieldSpan('cleaningFee', 'Cleaning Fee')} <br />
            - <strong>REFUNDABLE SECURITY DEPOSIT:</strong> {getFieldSpan('depositAmount', 'Security Deposit')}
          </p>

          <p className="font-black text-[12px] mt-6 mb-2 text-[#1A1A1A] uppercase tracking-wide">4. BOOKING PREPAYMENT</p>
          <p>
            Guest has paid a reservation prepayment of {getFieldSpan('advancePayment', 'Advanced Payment')} upon booking. This reservation is confirmed only upon successful clearance of this prepayment.
          </p>

          <p className="font-black text-[12px] mt-6 mb-2 text-[#1A1A1A] uppercase tracking-wide">5. HOUSE RULES & GUEST COVENANTS</p>
          <p>
            Guest agrees to follow all posted house rules, including quiet hours from 10:00 PM to 8:00 AM, maximum occupancy limits, and a strict no-smoking policy. Any violations will result in immediate termination of tenancy and forfeiture of all fees.
          </p>

          <div className="border-t border-gray-200 pt-8 mt-12 grid grid-cols-2 gap-12 text-[12px]">
            <div>
              <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-8">Host Agent Signature</p>
              <div className="border-b border-gray-400 w-full h-8" />
              <p className="font-bold mt-1 text-[#1A1A1A]">Stayzo Host Services</p>
            </div>
            <div>
              <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-8">Primary Guest Signature</p>
              <div className="border-b border-gray-400 w-full h-8" />
              <p className="font-bold mt-1 text-[#1A1A1A]">{fieldValues.guestName || 'Guest Full Name'}</p>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F0EEF8] font-sans">
      
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

          {/* Right side */}
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

      {/* ── Page Layout ── */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-10 py-8">
        
        {/* Toast Notification */}
        {successToast && (
          <div className="fixed top-20 right-6 bg-[#1A1A1A] text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
            <span className="text-[12px] font-bold uppercase tracking-widest leading-none">{successToast}</span>
          </div>
        )}

        {!selectedTemplate ? (
          /* ──────────────────────────────────────────────────────────────────
             1. TEMPLATE SELECTION PAGE
             ────────────────────────────────────────────────────────────────── */
          <div className="space-y-10 animate-in fade-in duration-300">
            
            {/* Page Header */}
            <div>
              <h1 className="text-[32px] md:text-[40px] font-black text-[#1A1A1A] uppercase tracking-tight leading-none">
                Smart Agreement Hub
              </h1>
              <p className="text-[14px] text-gray-500 font-medium mt-2 max-w-2xl">
                Draft binding tenancy, commercial, or vacation rental contracts in minutes. Select a template and our chatbot will guide you through the details to build the contract automatically.
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
                    {/* Category tag */}
                    <span className="text-[9px] font-black text-gray-400 tracking-widest uppercase border border-gray-200 px-2 py-0.5 rounded">
                      {tmpl.category}
                    </span>
                    <h3 className="text-[18px] font-black text-[#1A1A1A] mt-3 group-hover:text-black">
                      {tmpl.title}
                    </h3>
                    <p className="text-[12px] text-gray-500 mt-2 leading-relaxed">
                      {tmpl.description}
                    </p>

                    {/* Fields List details */}
                    <div className="mt-5 space-y-2">
                      <div className="text-[10px] font-black text-[#1A1A1A] uppercase tracking-widest">
                        Required Parameters ({tmpl.fields.length}):
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

            {/* Drafted Agreements (Saved in Vault) list */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-gray-100 pb-5">
                <div>
                  <h3 className="text-[16px] font-black text-[#1A1A1A] uppercase tracking-wider">
                    Digital Vault: Generated Agreements
                  </h3>
                  <p className="text-[12px] text-gray-400 font-medium">Your generated legal documents are saved securely below in local session storage.</p>
                </div>
                <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  {savedAgreements.length} Active Contracts
                </span>
              </div>

              {savedAgreements.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-xl">
                  <FileSignature className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-[13px] font-bold text-gray-400 uppercase tracking-widest">No generated agreements found</p>
                  <p className="text-[12px] text-gray-400 mt-1 max-w-sm mx-auto">Select a template above to generate your first rental contract and save it here.</p>
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
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest bg-white border border-gray-200 px-2 py-0.5 rounded">
                              {ag.templateTitle}
                            </span>
                            <h4 className="text-[14px] font-black text-[#1A1A1A] mt-1.5 truncate max-w-[220px]">
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
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-5">
                        <button
                          onClick={() => {
                            // Re-open/Load the draft
                            const tmpl = AGREEMENT_TEMPLATES.find(t => t.id === ag.templateId);
                            if (tmpl) {
                              setSelectedTemplate(tmpl);
                              setFieldValues(ag.values);
                              setCurrentFieldIdx(tmpl.fields.length);
                              setChatHistory([
                                {
                                  id: 'reopen',
                                  sender: 'bot',
                                  text: `Loaded existing signed agreement for **${ag.tenantName}**. You can preview, edit details, or export the document.`,
                                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                }
                              ]);
                            }
                          }}
                          className="flex items-center gap-1 text-[11px] font-black text-[#1A1A1A] hover:underline"
                        >
                          <Info className="w-3.5 h-3.5" />
                          <span>View & Edit</span>
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
                  <div className="text-[10px] font-black text-gray-400 tracking-widest uppercase">Drafting Wizard</div>
                  <h2 className="text-[20px] font-black text-[#1A1A1A] tracking-tight">{selectedTemplate.title}</h2>
                </div>
              </div>

              {/* Progress and Autofill */}
              <div className="flex items-center gap-4 flex-wrap">
                {/* Autofill Demo Button */}
                <button
                  onClick={handleQuickFill}
                  className="bg-white border border-gray-200 hover:border-[#1A1A1A] text-[#1A1A1A] text-[10px] font-extrabold tracking-widest uppercase px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 hover:scale-[1.01]"
                  title="Fill with dummy data"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
                  <span>Autofill Sample</span>
                </button>

                {/* Progress bar info */}
                <div className="flex items-center gap-2.5">
                  <div className="w-[100px] bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-black h-full transition-all duration-300"
                      style={{ width: `${getProgressPercentage()}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-black text-[#1A1A1A] uppercase tracking-wider whitespace-nowrap">
                    {getProgressPercentage()}% Done
                  </span>
                </div>
              </div>
            </div>

            {/* Left side: Interactive Chatbot or Forms (5 Columns) */}
            <div className="lg:col-span-5 flex flex-col h-[650px] bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              
              {/* Tab Header */}
              <div className="flex border-b border-gray-100 bg-gray-50 flex-shrink-0">
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`flex-1 py-4 text-center text-[11px] font-black tracking-widest uppercase transition-all ${
                    activeTab === 'chat'
                      ? 'bg-white border-b-2 border-b-[#1A1A1A] text-[#1A1A1A]'
                      : 'text-gray-400 hover:text-[#1A1A1A] hover:bg-white/50'
                  }`}
                >
                  🤖 Chatbot Assistant
                </button>
                <button
                  onClick={() => setActiveTab('fields')}
                  className={`flex-1 py-4 text-center text-[11px] font-black tracking-widest uppercase transition-all ${
                    activeTab === 'fields'
                      ? 'bg-white border-b-2 border-b-[#1A1A1A] text-[#1A1A1A]'
                      : 'text-gray-400 hover:text-[#1A1A1A] hover:bg-white/50'
                  }`}
                >
                  📝 Manual Form
                </button>
              </div>

              {activeTab === 'chat' ? (
                /* CHATBOT VIEW */
                <div className="flex-1 flex flex-col overflow-hidden min-h-0">
                  
                  {/* Chat Assistant Bio Info */}
                  <div className="bg-[#EDE9FE]/50 border-b border-[#DDD6FE] p-3 px-4 flex items-center gap-2.5 flex-shrink-0">
                    <div className="relative w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0 shadow-sm text-white">
                      <Sparkles className="w-4 h-4" />
                      <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white" />
                    </div>
                    <div>
                      <div className="text-[11px] font-black text-purple-950 uppercase tracking-wider">Stayzo Assistant</div>
                      <div className="text-[9px] text-purple-600 font-bold uppercase tracking-widest">Active & Ready to Draft</div>
                    </div>
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

                  {/* Input form */}
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

                    {/* Helper Prompt Chips */}
                    {currentFieldIdx < selectedTemplate.fields.length && (
                      <div className="mt-2 flex items-center justify-between text-[10px] text-gray-400">
                        <span>Answer the prompt to fill in the contract blanks.</span>
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
                  <div className="text-[12px] font-medium text-gray-400 pb-3 border-b border-gray-100">
                    You can edit the parameters directly below. The contract preview on the right will update in real-time.
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

            {/* Right side: Live Agreement Preview (7 Columns) */}
            <div className="lg:col-span-7 flex flex-col h-[650px] overflow-hidden">
              
              {/* Toolbar Actions */}
              <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-3 px-4 mb-4 flex-shrink-0 shadow-sm gap-4">
                <span className="flex items-center gap-2 text-[10px] font-black text-[#1A1A1A] uppercase tracking-wider">
                  <FileText className="w-4 h-4 text-gray-500" />
                  Live Contract Preview
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyText}
                    className="p-2 border border-gray-200 hover:border-gray-400 text-gray-600 rounded-lg transition-colors flex items-center justify-center bg-white"
                    title="Copy to Clipboard"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handlePrint}
                    className="px-3.5 py-2 bg-white border border-gray-200 hover:border-[#1A1A1A] text-gray-700 text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5"
                    title="Print / Save PDF"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Print PDF</span>
                  </button>
                  <button
                    onClick={handleSaveToVault}
                    className="px-4 py-2 bg-[#1A1A1A] hover:bg-black text-white text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                    title="Save to Document Vault"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save to Vault</span>
                  </button>
                </div>
              </div>

              {/* A4 Paper Container */}
              <div className="flex-1 bg-white border border-gray-200 shadow-md rounded-xl overflow-y-auto p-8 md:p-12 font-serif relative no-scrollbar">
                {/* Clean print wrapper */}
                <div id="contract-printable-area" className="mx-auto max-w-[620px]">
                  {renderDocumentJSX()}
                </div>

                {/* Info Guide Overlay Badge */}
                <div className="absolute top-4 right-4 bg-gray-50/80 backdrop-blur-sm border border-gray-200 text-[9px] font-extrabold uppercase text-gray-400 px-2.5 py-1 rounded-full tracking-widest pointer-events-none select-none flex items-center gap-1">
                  <Info className="w-3 h-3 text-gray-400" />
                  <span>Click items to edit</span>
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
