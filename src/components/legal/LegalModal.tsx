import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  Lock, 
  AlertTriangle, 
  Download, 
  Trash2, 
  X, 
  CheckCircle2, 
  Scale, 
  HeartHandshake,
  ExternalLink,
  Copyright,
  EyeOff,
  Globe2,
  Mail,
  MapPin,
  BellOff
} from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'privacy' | 'terms' | 'rights' | 'dmca';
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'privacy',
}) => {
  const [tab, setTab] = useState<'privacy' | 'terms' | 'rights' | 'dmca'>(defaultTab);

  if (!isOpen) return null;

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0a2540] via-teal-950 to-teal-900 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
              <Scale className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest text-teal-300 uppercase">
                Regulatory Compliance, IP &amp; Disclaimers
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white">
                Medical Data Privacy, DMCA Agent &amp; Terms of Use
              </h2>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-4 flex rounded-xl bg-black/30 p-1 text-xs font-bold gap-1 overflow-x-auto">
            <button
              onClick={() => setTab('privacy')}
              className={`flex-1 py-1.5 px-2 rounded-lg transition whitespace-nowrap text-center ${
                tab === 'privacy' ? 'bg-white text-[#0a2540] shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setTab('terms')}
              className={`flex-1 py-1.5 px-2 rounded-lg transition whitespace-nowrap text-center ${
                tab === 'terms' ? 'bg-white text-[#0a2540] shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              Terms of Use
            </button>
            <button
              onClick={() => setTab('dmca')}
              className={`flex-1 py-1.5 px-2 rounded-lg transition whitespace-nowrap text-center flex items-center justify-center gap-1 ${
                tab === 'dmca' ? 'bg-white text-[#0a2540] shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Copyright className="w-3.5 h-3.5" />
              <span>DMCA Copyright Agent</span>
            </button>
            <button
              onClick={() => setTab('rights')}
              className={`flex-1 py-1.5 px-2 rounded-lg transition whitespace-nowrap text-center ${
                tab === 'rights' ? 'bg-white text-[#0a2540] shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              Patient Data Rights
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed flex-1">
          
          {/* TAB 1: PRIVACY POLICY */}
          {tab === 'privacy' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-teal-950">Statutory Health Data Protection &amp; Zero Surveillance</h4>
                  <p className="text-[11px] text-teal-800 mt-0.5">
                    Comfort Medi+ is architected in strict compliance with the <strong>Republic of Zimbabwe Data Protection Act [Chapter 11:12]</strong>, Cyber and Data Protection Regulations, and international healthcare confidentiality standards (HIPAA security rules &amp; GDPR privacy principles).
                  </p>
                </div>
              </div>

              {/* Zero Session Replay Guarantee */}
              <div className="p-3.5 rounded-2xl bg-slate-900 text-slate-100 space-y-2 border border-slate-800">
                <div className="flex items-center gap-2 text-teal-300 font-bold text-xs uppercase tracking-wide">
                  <EyeOff className="w-4 h-4 text-teal-400" />
                  <span>Strict Zero-Session Replay Architecture Guarantee</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Comfort Medi+ explicitly does <strong>NOT employ session replay recording, screen capture trackers, or keystroke surveillance software</strong> (such as LogRocket, Hotjar, FullStory, Smartlook, or Clarity). Your intimate patient diagnostic readings, medication logs, vitals, and physician chats are never video-recorded, replayed, or reconstructed under any circumstances.
                </p>
              </div>

              {/* Self-Hosted Typography & Zero IP Leaks */}
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wide">
                  <Globe2 className="w-4 h-4 text-emerald-700" />
                  <span>Self-Hosted Local Fonts (Zero Third-Party IP Address Leaks)</span>
                </div>
                <p className="text-emerald-900/90 text-xs leading-relaxed">
                  Unlike conventional web applications that link directly to Google Fonts servers (which transmits user IP addresses and metadata to remote CDNs during medical visits), Comfort Medi+ renders typefaces strictly using native high-DPI system font stacks. No external requests are made to Google Fonts servers, guaranteeing 100% IP anonymity and zero network footprint leakage.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">1. Age Gate &amp; Minor Protection (&gt; 16 Years)</h3>
                <p>
                  To register an independent health account, patients must be strictly older than 16 years of age. Minor patients and juveniles aged 16 and below may not create standalone accounts; their accounts must be established, controlled, and supervised by a legal parent or guardian to ensure appropriate pediatric clinical guardianship.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">2. Notification Alerts &amp; Unsubscribe Controls</h3>
                <p>
                  Users maintain absolute authority over communications. You can unsubscribe from WhatsApp reminder notifications and email adherence digests at any time with a single tap in <strong>Profile &amp; Security &gt; Notification Unsubscribe</strong> or via the reminders dashboard. Opt-out requests are executed immediately and persisted across all synced databases.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">3. Sensitivity &amp; Collection of Health Records</h3>
                <p>
                  We collect only data strictly necessary to deliver patient health monitoring, adherence alerts, and clinical homecare tracking. Comfort Medi+ does <strong>not sell, lease, or monetize</strong> patient medical records with third-party advertisers or commercial data brokers under any circumstances.
                </p>
              </div>

              {/* Registered Physical Address */}
              <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <MapPin className="w-3.5 h-3.5 text-teal-700" />
                  <span>Registered Healthcare Operations &amp; Communications Address:</span>
                </div>
                <p>
                  Comfort Medi+ Health Informatics Ltd • Suite 402, Medical Chambers, 128 Herbert Chitepo Avenue, Harare, Zimbabwe.
                  <br />
                  Postal: P.O. Box CY 1420, Causeway, Harare • Phone: +263 77 282 4132 • Email: compliance@comfortmedi.health
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: TERMS OF USE */}
          {tab === 'terms' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-amber-950">Important Medical Disclaimer</h4>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    Comfort Medi+ is an adherence monitoring, scheduling, and encrypted health tracking platform. It is <strong>not a substitute for in-person emergency triage, clinical diagnosis, or ambulance dispatch</strong>. For acute emergencies, immediately contact emergency services (<strong>999</strong> or <strong>112</strong>).
                  </p>
                </div>
              </div>

              {/* Developer Liability Disclaimer for User Uploads */}
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-950 space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wide text-rose-900 flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-rose-700" />
                  <span>Developer &amp; Host Non-Liability Disclaimer for User Uploads</span>
                </h4>
                <p className="text-xs text-rose-900/90 leading-relaxed font-medium">
                  <strong>The application developers, system architects, software contributors, and platform hosting providers ARE NOT LIABLE for any images, medical documents, radiological scans, prescriptions, laboratory reports, or files uploaded, stored, or transmitted by users.</strong>
                </p>
                <p className="text-[11px] text-rose-800 leading-relaxed">
                  Users expressly warrant and represent that they possess lawful authorization, ownership, or clinical consent for all materials uploaded to the system. If any uploaded file violates copyright, intellectual property, or third-party trademark rights, the uploading user assumes full individual legal liability. Comfort Medi+ operates as a neutral technical conduit pursuant to DMCA Safe Harbor and the Zimbabwe Cyber &amp; Data Protection Act.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">1. Age Gate &amp; Eligibility</h3>
                <p>
                  You must be at least 17 years old to create an independent account. Registration attempts by juveniles aged 16 and below are denied unless completed by a parent or legal guardian who accepts primary legal and financial responsibility.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">2. Prescriptions &amp; Clinical Guidance</h3>
                <p>
                  Medication schedules, refill reminders, and biometric tracking must align with instructions provided by your registered medical practitioner. Never alter dosages or discontinue prescription medicines without consulting your attending doctor or specialist.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">3. Pro Subscriptions &amp; Renewal Terms</h3>
                <p>
                  Paid subscription tiers automatically renew at the conclusion of each billing period (monthly or annually) unless canceled at least 24 hours prior to the renewal date. Users can review continuous renewal terms anytime by clicking the <strong>[Renewal Terms]</strong> button in the subscription panel.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: DMCA COPYRIGHT AGENT (NEW DEDICATED SECTION) */}
          {tab === 'dmca' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-teal-950 flex items-start gap-3">
                <Copyright className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-teal-950">DMCA Copyright Agent Registration &amp; Safe Harbor Policy</h4>
                  <p className="text-[11px] text-teal-800 mt-0.5">
                    Comfort Medi+ respects intellectual property rights and complies with the <strong>Digital Millennium Copyright Act (Title 17, United States Code, Section 512(c))</strong> and the <strong>Zimbabwe Copyright and Neighboring Rights Act [Chapter 26:05]</strong>.
                  </p>
                </div>
              </div>

              {/* Developer Non-Liability Notice */}
              <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-300 text-slate-800 space-y-1.5">
                <h4 className="font-bold text-xs text-slate-900">
                  Explicit System Developer Non-Liability Statement:
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  The application developers and technical providers operate strictly as online service providers offering encrypted storage for patient self-management. The developers do not pre-screen, censor, or claim ownership of user-uploaded images or medical documents. <strong>The app developers are not liable for files uploaded by users that infringe any copyright law.</strong> All copyright disputes are subject to the expedited notice and takedown framework below.
                </p>
              </div>

              {/* Designated Agent Details */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Scale className="w-4 h-4 text-teal-600" />
                  <span>Designated DMCA Copyright Agent</span>
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Designated Agent</span>
                    <strong className="text-slate-900 block mt-0.5">Copyright Compliance Officer</strong>
                    <span className="text-slate-600">Legal &amp; IP Protection Department</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Direct DMCA Email</span>
                    <a href="mailto:dmca-agent@comfortmedi.health" className="text-teal-700 font-bold underline block mt-0.5">
                      dmca-agent@comfortmedi.health
                    </a>
                    <span className="text-slate-500 text-[10px]">cc: comfort.designszw@gmail.com</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Physical Filing Address</span>
                    <p className="text-slate-800 text-[11px] mt-0.5">
                      Suite 402, Medical Chambers, 128 Herbert Chitepo Avenue, Harare, Zimbabwe
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Compliance Telephone</span>
                    <a href="tel:+263772824132" className="text-slate-800 font-bold block mt-0.5">
                      +263 77 282 4132
                    </a>
                    <span className="text-slate-500 text-[10px]">Mon-Fri 08:00 - 17:00 CAT</span>
                  </div>
                </div>
              </div>

              {/* Takedown Procedure */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                  Statutory Notice &amp; Takedown Procedure:
                </h4>
                <p className="text-xs text-slate-600">
                  If you are a copyright holder and believe in good faith that an image or document uploaded by a user infringes your copyright, transmit a written notification containing:
                </p>
                <ol className="list-decimal pl-5 space-y-1 text-xs text-slate-600">
                  <li>Physical or electronic signature of authorized copyright representative;</li>
                  <li>Identification of copyrighted work claimed to have been infringed;</li>
                  <li>Identification of specific URL or document ID to be removed;</li>
                  <li>Sufficient contact info (name, address, email, telephone);</li>
                  <li>A statement of good-faith belief that use is unauthorized;</li>
                  <li>A statement under penalty of perjury that the notification is accurate.</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 4: PATIENT DATA RIGHTS */}
          {tab === 'rights' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900">
                <h4 className="font-bold text-sm text-teal-950">Your Data, Your Sovereign Ownership</h4>
                <p className="text-[11px] text-teal-800 mt-0.5">
                  You are the sole owner of your medical records. You have absolute legal rights to export, backup, unsubscribe, or permanently erase your profile and records at any time.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-700 flex items-center justify-center font-bold">
                    <Download className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Right to Data Portability (JSON Backup)</h4>
                  <p className="text-[11px] text-slate-600">
                    You can download a complete backup of your medical file, medications, vitals history, and care plans as a standardized JSON file from <strong>Profile &amp; Security</strong> anytime.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-700 flex items-center justify-center font-bold">
                    <Trash2 className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Right to Erasure (Total Account Reset)</h4>
                  <p className="text-[11px] text-slate-600">
                    Permanently erase your account, vitals, medications, and clinical logs from Cloud Firestore and your device with a single click in <strong>Profile &amp; Security</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2 sm:col-span-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center font-bold">
                    <BellOff className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Right to Unsubscribe from All Notifications</h4>
                  <p className="text-[11px] text-slate-600">
                    You have total control over app behavior. Instantly unsubscribe from automated WhatsApp reminder messages and email digests directly in <strong>Profile Settings &gt; Communications &gt; Unsubscribe All Alerts</strong>.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 text-xs text-slate-600">
                <h4 className="font-bold text-slate-900 mb-1">Contact Data Protection &amp; Legal Compliance:</h4>
                <p>
                  Email: <a href="mailto:compliance@comfortmedi.health" className="font-bold text-teal-700 underline">compliance@comfortmedi.health</a> / <a href="mailto:comfort.designszw@gmail.com" className="font-bold text-teal-700 underline">comfort.designszw@gmail.com</a>
                  <br />
                  Office: Suite 402, Medical Chambers, 128 Herbert Chitepo Avenue, Harare, Zimbabwe • Tel: +263 77 282 4132
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="text-[10px] text-slate-500">
            Comfort Medi+ Compliance v2.5 (2026) • DMCA Filed
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-sm"
          >
            I Understand &amp; Agree
          </button>
        </div>
      </div>
    </div>
  );
};
