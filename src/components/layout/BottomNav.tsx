import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { getTranslation } from '../../lib/translations';
import { 
  LayoutDashboard, 
  FileText, 
  Pill, 
  CalendarCheck, 
  HeartHandshake, 
  Bot,
  ShieldCheck
} from 'lucide-react';

export type TabKey = 'dashboard' | 'records' | 'medications' | 'appointments' | 'homecare' | 'ai' | 'profile';

interface BottomNavProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  const language = useAppStore(s => s.language);
  const medications = useAppStore(s => s.medications);
  const appointments = useAppStore(s => s.appointments);
  const t = getTranslation(language);

  // Indicators: count low supplies
  const lowRefillsCount = medications.filter(m => m.remainingUnits <= m.refillThreshold).length;
  // Upcoming confirmed appointments
  const upcomingCount = appointments.filter(a => a.status === 'confirmed' || a.status === 'booked').length;

  const tabs: { key: TabKey; label: string; icon: any; badge?: number }[] = [
    { key: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { key: 'records', label: t.records, icon: FileText },
    { key: 'medications', label: t.medications, icon: Pill, badge: lowRefillsCount },
    { key: 'appointments', label: t.appointments, icon: CalendarCheck, badge: upcomingCount },
    { key: 'homecare', label: t.homeCare, icon: HeartHandshake },
    { key: 'ai', label: t.healthAI, icon: Bot },
    { key: 'profile', label: 'Profile & Security', icon: ShieldCheck },
  ];

  return (
    <div className="fixed bottom-2.5 sm:bottom-4 left-0 right-0 z-30 flex justify-center px-2.5 sm:px-4 pointer-events-none">
      <nav 
        aria-label="Bottom Navigation"
        className="pointer-events-auto max-w-2xl w-full bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_10px_35px_rgba(6,182,212,0.18)] rounded-3xl sm:rounded-full px-1.5 py-1 transition-all duration-300 ring-1 ring-cyan-500/25"
      >
        <div className="flex items-center justify-around h-14 sm:h-15">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => onSelectTab(tab.key)}
                className={`group relative flex flex-col items-center justify-center flex-1 h-full py-1 px-1 rounded-2xl sm:rounded-full transition-all duration-200 active:scale-90 ${
                  isActive 
                    ? 'text-cyan-700 font-bold' 
                    : 'text-slate-500 hover:text-cyan-600 hover:bg-cyan-50/50'
                }`}
              >
                {/* Cyan ambient aura on active */}
                {isActive && (
                  <span className="absolute inset-0 rounded-2xl sm:rounded-full bg-gradient-to-r from-cyan-400/20 via-teal-400/25 to-cyan-400/20 border border-cyan-400/40 shadow-[0_0_14px_rgba(6,182,212,0.35)] -z-10 animate-in fade-in zoom-in-90 duration-200" />
                )}

                <div className="relative">
                  <Icon 
                    className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-200 ${
                      isActive 
                        ? 'stroke-[2.5px] text-cyan-600 drop-shadow-[0_0_8px_rgba(6,182,212,0.65)] scale-110' 
                        : 'stroke-2 group-hover:scale-105 group-hover:text-cyan-600'
                    }`} 
                  />
                  {Boolean(tab.badge && tab.badge > 0) && (
                    <span className="absolute -top-1 -right-2 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-rose-500 text-white text-[8px] sm:text-[9px] font-bold flex items-center justify-center shadow-sm">
                      {tab.badge}
                    </span>
                  )}
                </div>

                <span className={`text-[8.5px] sm:text-[10px] mt-0.5 tracking-tight truncate max-w-[46px] sm:max-w-[70px] text-center transition-colors duration-200 ${
                  isActive ? 'font-black text-cyan-800' : 'font-medium'
                }`}>
                  {tab.label}
                </span>

                {/* Animated cyan indicator pill */}
                {isActive && (
                  <span className="absolute -bottom-0.5 w-5 sm:w-6 h-0.5 sm:h-1 rounded-full bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-500 shadow-[0_0_10px_#06b6d4] animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
