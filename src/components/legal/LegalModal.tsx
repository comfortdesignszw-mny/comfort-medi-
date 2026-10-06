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
  ExternalLink
} from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'privacy' | 'terms' | 'rights';
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'privacy',
}) => {
  const [tab, setTab] = useState<'privacy' | 'terms' | 'rights'>(defaultTab);

  if (!isOpen) return null;

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
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
                Legal &amp; Regulatory Compliance
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white">
                Medical Data Privacy, Terms of Use &amp; Patient Rights
              </h2>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-4 flex rounded-xl bg-black/30 p-1 text-xs font-bold">
            <button
              onClick={() => setTab('privacy')}
              className={`flex-1 py-1.5 rounded-lg transition ${
                tab === 'privacy' ? 'bg-white text-[#0a2540] shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setTab('terms')}
              className={`flex-1 py-1.5 rounded-lg transition ${
                tab === 'terms' ? 'bg-white text-[#0a2540] shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              Terms of Use
            </button>
            <button
              onClick={() => setTab('rights')}
              className={`flex-1 py-1.5 rounded-lg transition ${
                tab === 'rights' ? 'bg-white text-[#0a2540] shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              Patient Data Rights
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed flex-1">
          {tab === 'privacy' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-teal-950">Statutory Health Data Protection</h4>
                  <p className="text-[11px] text-teal-800 mt-0.5">
                    Comfort Medi+ is architected in strict compliance with the <strong>Republic of Zimbabwe Data Protection Act [Chapter 11:12]</strong>, Cyber and Data Protection Regulations, and international healthcare confidentiality standards (HIPAA technical guidelines and GDPR data sovereignty).
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">1. Sensitivity &amp; Collection of Health Records</h3>
                <p>
                  We recognize that electronic medical records, including diagnostic history, vital signs (blood pressure, blood glucose, heart rate), prescribed medications, allergies, and clinical reports represent deeply sensitive personal data. We collect only data strictly necessary to deliver patient health monitoring, adherence alerts, and clinical homecare tracking.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">2. Role-Based Data Isolation (RBAC)</h3>
                <p>
                  To eliminate unauthorized access, user records are isolated using strict Attribute-Based Access Control:
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-1 text-slate-600">
                  <li><strong>Patients:</strong> Have strict, private access exclusively to their personal health file.</li>
                  <li><strong>Doctors, Clinicians &amp; Healthcare Workers:</strong> Are granted read and clinical write authorization <em>only</em> for specific patients assigned to them by the certified Administrator.</li>
                  <li><strong>Administrators:</strong> Retain auditable governance to assign clinical staff and monitor healthcare delivery quality.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">3. Storage, Encryption &amp; Zero Data Brokering</h3>
                <p>
                  All patient records are encrypted in transit via TLS 1.3 and at rest within Cloud Firestore enterprise storage (AES-256). Comfort Medi+ does <strong>not sell, lease, or monetize</strong> patient medical records with third-party advertisers or commercial data brokers under any circumstances.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">4. Offline Resilience &amp; Local Encryption</h3>
                <p>
                  To ensure uninterrupted care during network outages, localized data is cached safely on the patient's device and synchronized with the central database once internet connectivity is re-established.
                </p>
              </div>
            </div>
          )}

          {tab === 'terms' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-amber-950">Important Medical Disclaimer</h4>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    Comfort Medi+ is a clinical management, medication adherence, and electronic health tracking software tool. It is <strong>not a substitute for in-person emergency triage, clinical diagnosis, or ambulance dispatch</strong>.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">1. Emergency Situations</h3>
                <p>
                  In the event of acute cardiovascular collapse, severe respiratory distress, anaphylaxis, or acute trauma, you must immediately contact National Emergency Services by dialing <strong>999</strong> or <strong>112</strong>, or report directly to the nearest acute emergency hospital facility.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">2. Prescriptions &amp; Clinical Guidance</h3>
                <p>
                  Medication schedules, refill reminders, and biometric tracking must align with instructions provided by your registered medical practitioner. Never alter dosages or discontinue prescription medicines without consulting your attending doctor or specialist.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">3. Account Responsibility</h3>
                <p>
                  Users must safeguard their authentication credentials (Google SSO, password, or Mobile PIN). Do not share your login credentials with unverified parties. You are responsible for ensuring that biometric and vital readings recorded into the application reflect accurate measurements.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">4. Professional Oversight</h3>
                <p>
                  Healthcare workers and doctors using the clinical oversight portal confirm they hold valid practicing certifications with the Medical and Dental Practitioners Council of Zimbabwe (MDPCZ) or equivalent regulatory body.
                </p>
              </div>
            </div>
          )}

          {tab === 'rights' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900">
                <h4 className="font-bold text-sm text-teal-950">Your Data, Your Ownership</h4>
                <p className="text-[11px] text-teal-800 mt-0.5">
                  You are the sole owner of your medical records. You have absolute legal rights to export, backup, or permanently erase your profile and records at any time.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-700 flex items-center justify-center font-bold">
                    <Download className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Right to Data Portability (JSON Backup)</h4>
                  <p className="text-[11px] text-slate-600">
                    You can download a complete backup of your medical file, medications, vitals history, and care plans as a standardized JSON file from the <strong>Profile &amp; Security</strong> section anytime.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-700 flex items-center justify-center font-bold">
                    <Trash2 className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Right to Erasure (Total Account Reset)</h4>
                  <p className="text-[11px] text-slate-600">
                    You can permanently erase your account, vitals, medications, and clinical logs from Cloud Firestore and your device with a single click in <strong>Profile &amp; Security</strong>.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Contact the Data Protection Officer</h3>
                <p>
                  For inquiries regarding clinical privacy, regulatory audits, or data rights:
                  <br />
                  Email: <a href="mailto:comfort.designszw@gmail.com" className="font-bold text-teal-700 underline">comfort.designszw@gmail.com</a>
                  <br />
                  Compliance Support: <a href="tel:+263772824132" className="text-slate-600 underline">+263 77 282 4132</a> (Comfort Designs Data &amp; Health Systems)
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-medium">
            Comfort Medi+ Compliance v2.4 (2026)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition"
          >
            I Understand &amp; Agree
          </button>
        </div>
      </div>
    </div>
  );
};
