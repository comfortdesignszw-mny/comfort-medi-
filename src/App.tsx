import React, { useState, useEffect } from 'react';
import { useAppStore } from './store/useAppStore';
import { Header } from './components/layout/Header';
import { BottomNav, TabKey } from './components/layout/BottomNav';
import { OfflineIndicator } from './components/layout/OfflineIndicator';
import { PinLockModal } from './components/layout/PinLockModal';
import { NotificationToast } from './components/common/NotificationToast';

import { DashboardView } from './components/dashboard/DashboardView';
import { MedicalRecordsView } from './components/records/MedicalRecordsView';
import { MedicationManagementView } from './components/medications/MedicationManagementView';
import { AppointmentBookingView } from './components/appointments/AppointmentBookingView';
import { HomeCareView } from './components/homecare/HomeCareView';
import { AIHealthAssistantView } from './components/ai/AIHealthAssistantView';
import { ProfileSettingsView } from './components/profile/ProfileSettingsView';

import { User } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey | 'profile'>('dashboard');
  const [openVitalsDirectly, setOpenVitalsDirectly] = useState(false);

  const fontSize = useAppStore(s => s.fontSize);
  const highContrast = useAppStore(s => s.highContrast);

  // Keyboard shortcut listener or emergency trigger
  useEffect(() => {
    // Service worker registration check
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').catch(err => {
        console.warn('SW register info:', err);
      });
    }
  }, []);

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

      {/* Global Toast Feedback */}
      <NotificationToast />

      {/* Top Application Header */}
      <Header />

      {/* Main Body Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 pb-36 sm:pb-40">
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

        {/* Clean & Simple Footer */}
        <footer className="mt-10 mb-8 pt-6 border-t border-slate-200/60 text-center space-y-1.5 text-xs text-slate-500">
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

      {/* Persistent Bottom Navigation for Mobile & Android devices */}
      <BottomNav 
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setOpenVitalsDirectly(false);
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

    </div>
  );
}
