import React, { useState } from 'react';
import { 
  HeartPulse, 
  Pill, 
  Activity, 
  CalendarCheck, 
  HeartHandshake, 
  ShieldCheck, 
  WifiOff, 
  Download, 
  ArrowRight, 
  LogIn, 
  UserPlus, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Hospital, 
  Sparkles, 
  Phone, 
  FileText, 
  Lock, 
  Scale, 
  ChevronRight,
  Stethoscope,
  Globe,
  Share2,
  RefreshCw,
  CreditCard,
  Copyright,
  BellOff
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface LandingPageViewProps {
  onOpenAuth: (mode?: 'signin' | 'register') => void;
  onLaunchApp: () => void;
  onOpenLegal: (tab: 'privacy' | 'terms' | 'rights' | 'dmca') => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onOpenAuth,
  onLaunchApp,
  onOpenLegal,
}) => {
  const language = useAppStore(s => s.language);
  const setShowRenewalTermsModal = useAppStore(s => s.setShowRenewalTermsModal);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [demoDoseTaken, setDemoDoseTaken] = useState(false);
  const [demoStreak, setDemoStreak] = useState(14);

  const handleTakeDemoDose = () => {
    if (!demoDoseTaken) {
      setDemoDoseTaken(true);
      setDemoStreak(prev => prev + 1);
    }
  };

  return (
    <div className="space-y-12 sm:space-y-16 animate-in fade-in duration-200">
      
      {/* 1. HERO SECTION */}
      <section className="relative rounded-3xl bg-gradient-to-r from-[#0a2540] via-teal-950 to-teal-900 text-white p-6 sm:p-10 lg:p-12 overflow-hidden shadow-2xl border border-teal-500/30">
        
        {/* Subtle Decorative Ambient Glows */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Hero Left Column: Copy & Actions */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Unboxed Editorial Kicker */}
            <div className="flex items-center gap-2 text-xs font-bold text-teal-300 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping inline-block" />
              <span>Digital Health &amp; Medication Platform</span>
              <span aria-hidden="true" className="text-teal-600">·</span>
              <span className="text-teal-400/80">Zimbabwe &amp; Global Standards</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight sm:leading-none text-white">
              Complete Health, Medication &amp; Clinical Care at Your Fingertips.
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-200/90 leading-relaxed max-w-2xl font-normal">
              Comfort Medi+ is your all-in-one digital health companion. Seamlessly manage medication schedules, track clinical vitals, book hospital appointments, maintain encrypted medical records, and coordinate home care — built with 100% offline resilience for peace of mind.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={() => onOpenAuth('register')}
                className="py-3 px-6 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-black text-sm shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2 transition active:scale-95 group"
              >
                <UserPlus className="w-4 h-4 text-slate-950" />
                <span>Create Free Account</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onOpenAuth('signin')}
                className="py-3 px-6 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm flex items-center justify-center gap-2 transition active:scale-95 backdrop-blur-sm"
              >
                <LogIn className="w-4 h-4 text-teal-300" />
                <span>Sign In to Portal</span>
              </button>

              <button
                onClick={onLaunchApp}
                className="py-3 px-5 rounded-2xl bg-teal-950/60 hover:bg-teal-900/80 border border-teal-500/40 text-teal-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Explore Live Demo as Guest</span>
              </button>
            </div>

            {/* Trust & Compliance Unboxed Metadata */}
            <div className="pt-2 flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-teal-200/80 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>Data Protection Act [Cap 11:12]</span>
              </span>
              <span aria-hidden="true" className="text-teal-700">·</span>
              <span className="flex items-center gap-1.5">
                <WifiOff className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>100% Offline-First Mode</span>
              </span>
              <span aria-hidden="true" className="text-teal-700">·</span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>AES-256 Vault Encryption</span>
              </span>
            </div>

          </div>

          {/* Hero Right Column: Interactive Software Live Preview */}
          <div className="lg:col-span-5">
            <div className="bg-slate-950/70 border border-teal-500/40 backdrop-blur-md rounded-3xl p-5 shadow-2xl text-slate-100 space-y-4">
              
              {/* Preview Window Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center">
                    <HeartPulse className="w-4 h-4 text-teal-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black tracking-tight text-white">COMFORT MEDI+ PREVIEW</h4>
                    <span className="text-[10px] text-teal-300">Live Interactive Adherence Tracker</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[10px] bg-teal-900/60 px-2 py-0.5 rounded-full border border-teal-500/30 text-teal-300 font-bold">
                  <span>Streak: {demoStreak} Days</span>
                </div>
              </div>

              {/* Live Vitals Preview Card */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                  <span className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-teal-400" />
                    <span>Clinical Vitals Snapshot</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold">Normal Range</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-black/30 p-2 rounded-xl">
                    <div className="text-[10px] text-slate-400">Blood Pressure</div>
                    <div className="text-xs font-black text-white mt-0.5">124 / 78</div>
                    <div className="text-[9px] text-teal-300">mmHg</div>
                  </div>
                  <div className="bg-black/30 p-2 rounded-xl">
                    <div className="text-[10px] text-slate-400">Heart Rate</div>
                    <div className="text-xs font-black text-white mt-0.5">72</div>
                    <div className="text-[9px] text-teal-300">bpm</div>
                  </div>
                  <div className="bg-black/30 p-2 rounded-xl">
                    <div className="text-[10px] text-slate-400">Blood Sugar</div>
                    <div className="text-xs font-black text-white mt-0.5">5.4</div>
                    <div className="text-[9px] text-teal-300">mmol/L</div>
                  </div>
                </div>
              </div>

              {/* Live Medication Card */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0">
                      <Pill className="w-4 h-4 text-teal-400" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Amlodipine Besylate</div>
                      <div className="text-[10px] text-slate-300">5mg · Oral Tablet · 08:00 AM</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-lg border border-amber-500/30 font-bold">
                    28 Doses Left
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-300">Scheduled: Morning Dose</span>
                  <button
                    onClick={handleTakeDemoDose}
                    disabled={demoDoseTaken}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
                      demoDoseTaken
                        ? 'bg-emerald-500 text-slate-950 cursor-default'
                        : 'bg-teal-500 hover:bg-teal-400 text-slate-950 active:scale-95'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{demoDoseTaken ? 'Dose Logged ✓' : 'Mark Dose Taken'}</span>
                  </button>
                </div>
              </div>

              {/* Facility & WhatsApp Integration Snippet */}
              <div className="p-3 rounded-2xl bg-teal-950/50 border border-teal-500/30 flex items-center justify-between text-xs text-teal-100">
                <div className="flex items-center gap-2 min-w-0">
                  <Hospital className="w-4 h-4 text-teal-400 shrink-0" />
                  <span className="truncate text-[11px]">Parirenyatwa General Hospital · Consultation</span>
                </div>
                <span className="text-[10px] font-bold text-teal-300 bg-teal-900/60 px-2 py-0.5 rounded-md border border-teal-700 shrink-0">
                  Confirmed
                </span>
              </div>

              {/* Callout to enter full demo */}
              <button
                onClick={onLaunchApp}
                className="w-full py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <span>Open Full Interactive Workspace</span>
                <ChevronRight className="w-4 h-4" />
              </button>

            </div>
          </div>

        </div>
      </section>

      {/* 2. THE IMPORTANCE & IMPACT OF COMFORT MEDI+ */}
      <section className="space-y-6">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="text-xs font-bold text-teal-700 uppercase tracking-widest">
            Healthcare Impact &amp; Purpose
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Why Reliable Medication &amp; Health Tracking Saves Lives
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Non-communicable diseases such as hypertension, diabetes, and asthma require consistent adherence and timely monitoring. Comfort Medi+ bridges the critical gap between hospital visits, home care, and emergency triage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 border border-teal-100 flex items-center justify-center">
              <Pill className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Eliminate Missed Doses &amp; Overdosing
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Missing cardiovascular or diabetic medications can precipitate acute crisis. Clear schedules, streak encouragement, and low-supply refill triggers ensure patients always have essential medications on hand.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center">
              <HeartHandshake className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Empower Family Caregivers &amp; Nurses
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Taking care of elderly parents or recovering relatives shouldn't be guesswork. Structured daily care plans for mobility, wound dressing, meals, and vitals keep everyone informed and accountable.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Emergency Preparedness &amp; Instant SOS
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              In severe allergic reactions, hypertensive urgency, or acute collapse, having allergies, emergency contacts, blood type, and national emergency lines (999/112) accessible in one tap is life-saving.
            </p>
          </div>

        </div>
      </section>

      {/* 3. CORE FEATURES & FUNCTIONALITIES SHOWCASE */}
      <section className="space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="text-xs font-bold text-teal-700 uppercase tracking-widest">
            Complete Feature Suite
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Engineered for Comprehensive Patient &amp; Clinical Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Explore the 8 core pillars that make Comfort Medi+ the most dependable digital health platform in Zimbabwe and beyond.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          
          {/* Feature 1 */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3 hover:border-teal-400 transition group">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-700 border border-teal-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Pill className="w-5 h-5 text-teal-600" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              1. Medication Adherence &amp; Refills
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Track multi-dose schedules, dosages, active pill counts, and remaining supply. Triggers pre-formatted WhatsApp refill requests directly to your pharmacy.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3 hover:border-teal-400 transition group">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-700 border border-teal-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5 text-teal-600" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              2. Biometrics &amp; Vitals History
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Record systolic/diastolic blood pressure, pulse, fasting glucose, and oxygen saturation with clinical alert highlights and date-stamped charts.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3 hover:border-teal-400 transition group">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-700 border border-teal-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5 text-teal-600" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              3. Encrypted Medical Records Vault
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Catalog chronic illnesses, documented drug &amp; food allergies (penicillin, peanuts), immunization history, and clinical diagnosis notes in an AES vault.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3 hover:border-teal-400 transition group">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-700 border border-teal-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Hospital className="w-5 h-5 text-teal-600" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              4. Hospital &amp; Clinic Booking
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Access an extensive directory of Zimbabwean medical facilities (Parirenyatwa, Mpilo, CIMAS, Baines). Schedule consultations and get WhatsApp reminders.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3 hover:border-teal-400 transition group">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-700 border border-teal-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
              <HeartHandshake className="w-5 h-5 text-teal-600" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              5. Home Care &amp; Clinical Tasks
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Organize daily care plans including hygiene, meal times, mobility exercises, and wound dressing. Caregivers log verified observation reports.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3 hover:border-teal-400 transition group">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-700 border border-teal-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5 text-teal-600" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              6. Strict Clinical RBAC Security
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Patients exclusively see their own private data. Attending doctors only oversee patients explicitly assigned to them by the Admin, with auditable logs.
            </p>
          </div>

          {/* Feature 7 */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3 hover:border-teal-400 transition group">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-700 border border-teal-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
              <WifiOff className="w-5 h-5 text-teal-600" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              7. Offline-First Resilience
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Designed for power outages and unstable mobile coverage. All data caches safely on your device in IndexedDB and syncs automatically when online.
            </p>
          </div>

          {/* Feature 8 */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3 hover:border-teal-400 transition group">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-700 border border-teal-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Download className="w-5 h-5 text-teal-600" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              8. Patient Data Sovereignty
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Export your full health file as a standardized JSON backup anytime. Exercise your Right to Erasure with permanent one-click database account reset.
            </p>
          </div>

        </div>
      </section>

      {/* 4. HOW IT WORKS (3 SIMPLE STEPS) */}
      <section className="p-6 sm:p-10 rounded-3xl bg-slate-900 text-white space-y-8 border border-slate-800">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-teal-400 uppercase tracking-widest">
            Easy Onboarding
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Get Started in 3 Simple Steps
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            No complicated technical setup. Start taking control of your daily health in minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500 text-slate-950 font-black text-xs flex items-center justify-center">
              1
            </div>
            <h4 className="font-bold text-sm text-white">Create Your Profile</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Sign up securely with Google One-Tap, Email &amp; Password, or your Zimbabwean Mobile Phone Number with zero friction.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500 text-slate-950 font-black text-xs flex items-center justify-center">
              2
            </div>
            <h4 className="font-bold text-sm text-white">Input Prescriptions &amp; Vitals</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Add your current medications, dosages, blood pressure targets, and emergency contacts. Everything is encrypted safely on device.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500 text-slate-950 font-black text-xs flex items-center justify-center">
              3
            </div>
            <h4 className="font-bold text-sm text-white">Stay Adherent &amp; Synchronized</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Log daily doses with a single tap, receive automated WhatsApp refill alerts, and share records with authorized attending clinicians.
            </p>
          </div>
        </div>
      </section>

      {/* 5. TRANSPARENT PRO SUBSCRIPTION TIERS & RENEWAL TERMS */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 uppercase tracking-widest inline-block">
            Transparent Pricing &amp; Renewal Terms
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Predictable Care Plans with Zero Hidden Fees
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Every paid subscription includes statutory renewal terms transparency, 1-click self-service cancellation, and a 7-day money-back guarantee.
          </p>

          {/* Billing Cycle Switch */}
          <div className="pt-2 flex items-center justify-center">
            <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 rounded-2xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`py-1.5 px-4 rounded-xl transition ${billingCycle === 'monthly' ? 'bg-white text-teal-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('yearly')}
                className={`py-1.5 px-4 rounded-xl transition flex items-center gap-1 ${billingCycle === 'yearly' ? 'bg-white text-teal-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                <span>Annual Billing</span>
                <span className="text-[10px] text-emerald-700 font-extrabold">(Save ~18%)</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tier 1: Free Starter */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full inline-block">
                Free Forever
              </span>
              <div>
                <h3 className="text-xl font-black text-slate-900">Standard Free Care</h3>
                <p className="text-xs text-slate-500 mt-1">Core offline self-management</p>
              </div>
              <div className="pt-2">
                <span className="text-3xl font-black text-slate-900">$0</span>
                <span className="text-xs text-slate-500 font-medium"> / forever</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-2 pt-3 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Offline Prescriptions &amp; Dose Logging</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Basic Appointment Reminders</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>IndexedDB Local Storage Vault</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Right to Portability (JSON Backups)</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onOpenAuth('register')}
              className="w-full py-2.5 rounded-xl border border-teal-600 text-teal-700 font-bold text-xs hover:bg-teal-50 transition"
            >
              Start Free Account
            </button>
          </div>

          {/* Tier 2: Pro Adherence */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-teal-900 to-[#0a2540] text-white shadow-xl border-2 border-teal-400 relative flex flex-col justify-between space-y-4">
            <span className="absolute -top-3 right-6 bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow">
              Most Popular
            </span>
            <div className="space-y-3">
              <span className="text-xs font-bold text-teal-300 bg-white/10 px-3 py-1 rounded-full inline-block">
                Individual Patient Pro
              </span>
              <div>
                <h3 className="text-xl font-black text-white">Comfort Medi+ Pro</h3>
                <p className="text-xs text-teal-200 mt-1">Full auto WhatsApp &amp; clinical sync</p>
              </div>
              <div className="pt-2">
                <span className="text-3xl font-black text-white">
                  {billingCycle === 'yearly' ? '$49' : '$4.99'}
                </span>
                <span className="text-xs text-teal-300 font-medium">
                  {billingCycle === 'yearly' ? ' / year' : ' / month'}
                </span>
              </div>
              <ul className="text-xs text-teal-100 space-y-2 pt-3 border-t border-white/10">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Auto-Fired WhatsApp Reminders</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Doctor Portal Sync &amp; Care Task Tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Smart Refill Depletion Predictions</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Unlimited Encrypted Health Vault</span>
                </li>
              </ul>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => onOpenAuth('register')}
                className="w-full py-2.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-black text-xs shadow-md transition active:scale-95"
              >
                Subscribe to Pro
              </button>
              {/* Statutory Renewal Terms Button */}
              <button
                type="button"
                onClick={() => setShowRenewalTermsModal(true)}
                className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition border border-white/10"
              >
                <RefreshCw className="w-3.5 h-3.5 text-teal-300" />
                <span>View Renewal Terms</span>
              </button>
            </div>
          </div>

          {/* Tier 3: Family & Clinic Care Pro */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-full inline-block border border-teal-200">
                Family &amp; Guardianship
              </span>
              <div>
                <h3 className="text-xl font-black text-slate-900">Family &amp; Clinic Pro</h3>
                <p className="text-xs text-slate-500 mt-1">Multi-dependent supervision &amp; minor care</p>
              </div>
              <div className="pt-2">
                <span className="text-3xl font-black text-slate-900">
                  {billingCycle === 'yearly' ? '$99' : '$9.99'}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {billingCycle === 'yearly' ? ' / year' : ' / month'}
                </span>
              </div>
              <ul className="text-xs text-slate-600 space-y-2 pt-3 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Everything in Pro Adherence included</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Up to 5 Family Members / Juvenile Minor Accounts</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Pediatric &amp; Elderly Dosing Guardianship</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Priority Tele-Consultation Booking Queue</span>
                </li>
              </ul>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => onOpenAuth('register')}
                className="w-full py-2.5 rounded-xl bg-teal-900 hover:bg-slate-950 text-white font-bold text-xs shadow-md transition active:scale-95"
              >
                Subscribe to Family Pro
              </button>
              {/* Statutory Renewal Terms Button */}
              <button
                type="button"
                onClick={() => setShowRenewalTermsModal(true)}
                className="w-full py-2 rounded-xl border border-slate-300 hover:border-teal-500 text-slate-700 hover:text-teal-700 font-bold text-[11px] flex items-center justify-center gap-1.5 transition"
              >
                <RefreshCw className="w-3.5 h-3.5 text-teal-600" />
                <span>View Renewal Terms</span>
              </button>
            </div>
          </div>
        </div>

        {/* Consumer Protection Notice Banner */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <CreditCard className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 font-bold block">Statutory Continuous Service Guarantee:</strong>
              <span className="text-[11px]">
                Subscriptions auto-renew at the end of each billing period unless canceled 24 hours prior. Self-service 1-click cancellation anytime in Profile Settings. Full 7-day money-back guarantee.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowRenewalTermsModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-300 text-teal-800 text-[11px] font-bold hover:bg-slate-100 transition shrink-0 flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3 text-teal-600" />
            <span>Renewal Policy Disclosure</span>
          </button>
        </div>
      </section>

      {/* 6. PROMINENT BOTTOM CALL-TO-ACTION BANNER */}
      <section className="rounded-3xl bg-gradient-to-r from-[#0a2540] via-teal-950 to-teal-900 text-white p-8 sm:p-12 text-center space-y-6 shadow-2xl border border-teal-500/40 relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Ready to Take Control of Your Health Journey?
          </h2>
          <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed">
            Join patients, caregivers, and medical professionals managing health with precision, privacy, and peace of mind on Comfort Medi+.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onOpenAuth('register')}
            className="w-full sm:w-auto py-3 px-8 rounded-2xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-black text-sm shadow-lg shadow-teal-500/25 transition active:scale-95 flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Free Account Now</span>
          </button>

          <button
            onClick={() => onOpenAuth('signin')}
            className="w-full sm:w-auto py-3 px-8 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition active:scale-95 flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4 text-teal-300" />
            <span>Sign In to Your Account</span>
          </button>

          <button
            onClick={onLaunchApp}
            className="w-full sm:w-auto py-3 px-6 rounded-2xl bg-teal-950/70 hover:bg-teal-900/90 border border-teal-400/40 text-teal-200 font-semibold text-xs transition active:scale-95 flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Explore Demo as Guest</span>
          </button>
        </div>
      </section>

      {/* 7. COMPREHENSIVE FOOTER WITH STATUTORY LEGAL DOCUMENTS */}
      <footer className="pt-8 pb-12 border-t border-slate-200/80 text-center space-y-4">
        
        {/* Prominent Statutory Compliance Links */}
        <div className="flex items-center justify-center gap-3 text-xs font-bold text-slate-700 flex-wrap">
          <button
            onClick={() => onOpenLegal('terms')}
            className="hover:text-teal-700 underline underline-offset-4 transition flex items-center gap-1"
          >
            <Scale className="w-3.5 h-3.5 text-teal-600" />
            <span>Terms of Use &amp; Clinical Disclaimers</span>
          </button>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <button
            onClick={() => onOpenLegal('privacy')}
            className="hover:text-teal-700 underline underline-offset-4 transition flex items-center gap-1"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Privacy Policy (Data Protection Act [Cap 11:12])</span>
          </button>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <button
            onClick={() => onOpenLegal('dmca')}
            className="hover:text-teal-700 underline underline-offset-4 transition flex items-center gap-1 font-bold text-teal-800"
          >
            <Copyright className="w-3.5 h-3.5 text-teal-600" />
            <span>DMCA Copyright Agent (Non-Liability Policy)</span>
          </button>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <button
            onClick={() => onOpenLegal('rights')}
            className="hover:text-teal-700 underline underline-offset-4 transition flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5 text-teal-600" />
            <span>Patient Data Rights &amp; Portability</span>
          </button>
        </div>

        {/* Brand Copyright & Developer Contact */}
        <div className="space-y-1 text-xs text-slate-500">
          <p className="font-semibold text-slate-600">
            © 2026 Comfort Medi+, All Rights Reserved. Engineered for Healthcare Delivery in Zimbabwe &amp; Southern Africa.
          </p>
          <p className="text-[11px] text-slate-400">
            Developed with ❤️ by <a href="https://wa.me/263772824132" target="_blank" rel="noopener noreferrer" className="font-bold text-teal-700 hover:text-teal-800 underline">Comfort Designs</a> · <a href="tel:+263772824132" className="hover:underline">+263 77 282 4132</a> · <a href="mailto:comfort.designszw@gmail.com" className="hover:underline">comfort.designszw@gmail.com</a>
          </p>
        </div>
      </footer>

    </div>
  );
};
