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
        aria-label="Floating Bottom Navigation"
        className="pointer-events-auto max-w-2xl w-full bg-white/35 dark:bg-slate-900/35 backdrop-blur-md border border-cyan-400/40 shadow-[0_8px_32px_rgba(6,182,212,0.28)] rounded-3xl sm:rounded-full px-1.5 py-1 transition-all duration-300 ring-1 ring-cyan-400/30"
      >
        <div className="flex items-center justify-around h-14 sm:h-15">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => onSelectTab(tab.key)}
                className={`group relative flex flex-col items-center justify-center flex-1 h-full py-1 px-1 rounded-2xl sm:rounded-full transition-all duration-200 active:scale-90 active:drop-shadow-[0_0_14px_rgba(6,182,212,0.8)] ${
                  isActive 
                    ? 'text-cyan-800 font-black' 
                    : 'text-slate-600 hover:text-cyan-600 hover:bg-cyan-100/30'
                }`}
              >
                {/* Cyan ambient aura and interactive glow on active */}
                {isActive && (
                  <span className="absolute inset-0 rounded-2xl sm:rounded-full bg-gradient-to-r from-cyan-400/25 via-teal-300/30 to-cyan-400/25 border border-cyan-400/60 shadow-[0_0_18px_rgba(6,182,212,0.45)] -z-10 animate-in fade-in zoom-in-95 duration-200" />
                )}

                <div className="relative">
                  <Icon 
                    className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-200 ${
                      isActive 
                        ? 'stroke-[2.5px] text-cyan-600 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)] scale-110' 
                        : 'stroke-2 group-hover:scale-110 group-hover:text-cyan-500 group-hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]'
                    }`} 
                  />
                  {Boolean(tab.badge && tab.badge > 0) && (
                    <span className="absolute -top-1 -right-2 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-rose-500 text-white text-[8px] sm:text-[9px] font-bold flex items-center justify-center shadow-sm">
                      {tab.badge}
                    </span>
                  )}
                </div>

                <span className={`text-[8.5px] sm:text-[10px] mt-0.5 tracking-tight truncate max-w-[46px] sm:max-w-[70px] text-center transition-colors duration-200 ${
                  isActive ? 'font-black text-cyan-900 drop-shadow-[0_0_4px_rgba(6,182,212,0.3)]' : 'font-medium'
                }`}>
                  {tab.label}
                </span>

                {/* Animated cyan indicator beam with glow */}
                {isActive && (
                  <span className="absolute -bottom-0.5 w-6 sm:w-8 h-1 rounded-full bg-gradient-to-r from-cyan-500 via-teal-300 to-cyan-500 shadow-[0_0_12px_#06b6d4] animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
