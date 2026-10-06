import React, { useState, useEffect } from 'react';
import { useAppStore } from './store/useAppStore';
import { Header } from './components/layout/Header';
import { BottomNav, TabKey } from './components/layout/BottomNav';
import { OfflineIndicator } from './components/layout/OfflineIndicator';
import { PinLockModal } from './components/layout/PinLockModal';
import { NotificationToast } from './components/common/NotificationToast';
import { AuthModal } from './components/auth/AuthModal';
import { AssignedPatientsBanner } from './components/common/AssignedPatientsBanner';
import { LegalModal } from './components/legal/LegalModal';
import { auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { syncUserProfile } from './lib/authService';

import { DashboardView } from './components/dashboard/DashboardView';
import { MedicalRecordsView } from './components/records/MedicalRecordsView';
import { MedicationManagementView } from './components/medications/MedicationManagementView';
import { AppointmentBookingView } from './components/appointments/AppointmentBookingView';
import { HomeCareView } from './components/homecare/HomeCareView';
import { AIHealthAssistantView } from './components/ai/AIHealthAssistantView';
import { ProfileSettingsView } from './components/profile/ProfileSettingsView';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey | 'profile'>('dashboard');
  const [openVitalsDirectly, setOpenVitalsDirectly] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<'privacy' | 'terms' | 'rights'>('privacy');

  const fontSize = useAppStore(s => s.fontSize);
  const highContrast = useAppStore(s => s.highContrast);
  const setFirebaseUser = useAppStore(s => s.setFirebaseUser);

  // Auth state subscriber and service worker registration
  useEffect(() => {
    // Listen for Firebase Auth changes (SSO, email, phone)
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const profile = await syncUserProfile(user);
          setFirebaseUser(profile);
        } catch (err) {
          console.warn('Firebase user sync note:', err);
        }
      }
    });

    // Service worker registration check
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').catch(err => {
        console.warn('SW register info:', err);
      });
    }

    return () => unsubscribe();
  }, [setFirebaseUser]);

  const fontSizeClass = {
    normal: 'text-sm',
    large: 'text-base font-normal tracking-wide',
    xlarge: 'text-lg font-medium tracking-wide',
  }[fontSize];

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-150 ${
      highContrast 
        ? 'bg-black text-white contrast-150 selection:bg-teal-400 selection:text-black' 
        : 'bg-slate-100/70 text-slate-900 selection:bg-teal-500 selection:text-white'
    } ${fontSizeClass}`}>

      {/* Global PIN Lock Modal */}
      <PinLockModal />

      {/* Firebase Authentication Modal (Google SSO, Email, Phone) */}
      <AuthModal />

      {/* Global Toast Feedback */}
      <NotificationToast />

      {/* Top Application Header */}
      <Header />

      {/* Main Body Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 pb-28 sm:pb-32">
        {/* Clinical Staff Assigned Patients Banner (for Doctors, Clinicians & Admins) */}
        <AssignedPatientsBanner />

        {activeTab === 'dashboard' && (
          <DashboardView 
            onNavigateTab={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenQuickVitals={() => {
              setOpenVitalsDirectly(true);
              setActiveTab('homecare');
            }}
          />
        )}

        {activeTab === 'records' && (
          <MedicalRecordsView />
        )}

        {activeTab === 'medications' && (
          <MedicationManagementView />
        )}

        {activeTab === 'appointments' && (
          <AppointmentBookingView />
        )}

        {activeTab === 'homecare' && (
          <HomeCareView initialOpenVitalsModal={openVitalsDirectly} />
        )}

        {activeTab === 'ai' && (
          <AIHealthAssistantView />
        )}

        {activeTab === 'profile' && (
          <ProfileSettingsView />
        )}

        {/* Floating Background Content & Footer with Legal Compliance Links */}
        <footer className="mt-12 mb-6 pt-6 pb-24 sm:pb-28 border-t border-slate-200/60 text-center space-y-2 text-xs text-slate-500">
          {/* Statutory Compliance & Data Sovereignty Links */}
          <div className="flex items-center justify-center gap-3 text-[11px] font-semibold text-slate-600 flex-wrap">
            <button
              onClick={() => {
                setLegalModalTab('privacy');
                setShowLegalModal(true);
              }}
              className="hover:text-teal-700 underline underline-offset-2 transition"
            >
              Privacy Policy (Data Protection Act)
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => {
                setLegalModalTab('terms');
                setShowLegalModal(true);
              }}
              className="hover:text-teal-700 underline underline-offset-2 transition"
            >
              Terms of Use &amp; Clinical Disclaimers
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => {
                setLegalModalTab('rights');
                setShowLegalModal(true);
              }}
              className="hover:text-teal-700 underline underline-offset-2 transition"
            >
              Patient Data Rights (JSON Export / Erasure)
            </button>
          </div>

          <p className="font-semibold text-slate-600">
            @2026 Comfort Medi+, All Rights Reserved
          </p>
          <p className="text-[11px] text-slate-500">
            Developed with ❤️ by <a href="https://wa.me/263772824132" target="_blank" rel="noopener noreferrer" className="font-bold text-teal-700 hover:text-teal-800 underline">Comfort Designs</a> - <a href="tel:+263772824132" className="text-slate-600 hover:underline">+263772824132</a>
          </p>
        </footer>
      </main>

      {/* Non-intrusive Offline & Sync Queue Indicator */}
      <OfflineIndicator />

      {/* Persistent Floating Bottom Navigation with High Glassmorphism & Cyan Interaction */}
      <BottomNav 
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setOpenVitalsDirectly(false);
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Global Statutory Legal Compliance & Patient Rights Modal */}
      <LegalModal
        isOpen={showLegalModal}
        onClose={() => setShowLegalModal(false)}
        defaultTab={legalModalTab}
      />

    </div>
  );
}
