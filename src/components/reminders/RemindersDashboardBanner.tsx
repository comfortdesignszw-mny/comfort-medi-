import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  calculateActiveReminders, 
  HealthReminder, 
  playReminderChime 
} from '../../lib/remindersEngine';
import { 
  Bell, 
  Pill, 
  Activity, 
  Calendar, 
  CheckCircle2, 
  Check, 
  Clock, 
  ChevronRight, 
  Sparkles,
  Volume2,
  MessageSquare,
  Zap
} from 'lucide-react';

interface RemindersDashboardBannerProps {
  onOpenRemindersModal: () => void;
  onNavigateTab?: (tab: any) => void;
}

export const RemindersDashboardBanner: React.FC<RemindersDashboardBannerProps> = ({
  onOpenRemindersModal,
  onNavigateTab
}) => {
  const medications = useAppStore(s => s.medications);
  const medicationLogs = useAppStore(s => s.medicationLogs);
  const appointments = useAppStore(s => s.appointments);
  const carePlan = useAppStore(s => s.carePlan);
  const markMedicationTaken = useAppStore(s => s.markMedicationTaken);
  const toggleCareTask = useAppStore(s => s.toggleCareTask);
  const showToast = useAppStore(s => s.showToast);
  const autoWhatsAppTriggerEnabled = useAppStore(s => s.autoWhatsAppTriggerEnabled);
  const autoWhatsAppNumber = useAppStore(s => s.autoWhatsAppNumber);
  const fireAutoWhatsAppReminder = useAppStore(s => s.fireAutoWhatsAppReminder);

  const allReminders = calculateActiveReminders(
    medications,
    medicationLogs,
    appointments,
    carePlan?.tasks || []
  );

  const dueReminders = allReminders.filter(
    r => (r.dueStatus === 'due_now' || r.dueStatus === 'overdue') && !r.isCompleted
  );

  const upcomingReminders = allReminders.filter(
    r => r.dueStatus === 'upcoming' && !r.isCompleted
  ).slice(0, 2);

  const displayReminders = dueReminders.length > 0 ? dueReminders.slice(0, 3) : upcomingReminders;

  if (displayReminders.length === 0) return null;

  const hasDueNow = dueReminders.length > 0;

  return (
    <div className={`rounded-3xl p-4 sm:p-5 border transition-all shadow-sm ${
      hasDueNow 
        ? 'bg-gradient-to-r from-amber-500/10 via-teal-500/5 to-emerald-500/10 border-amber-400/40' 
        : 'bg-white border-slate-200/80'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/60">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
            hasDueNow ? 'bg-amber-500 text-white animate-pulse' : 'bg-teal-600 text-white'
          }`}>
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-black text-slate-900">
                {hasDueNow ? 'Active Health Reminders Due' : 'Upcoming Daily Health Schedule'}
              </h3>
              {hasDueNow && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-white">
                  {dueReminders.length} Due
                </span>
              )}
              {autoWhatsAppTriggerEnabled && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 flex items-center gap-1 border border-emerald-200">
                  <Zap className="w-2.5 h-2.5 text-emerald-600 fill-emerald-600" />
                  Auto WhatsApp DM Active
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              Medication administration • Care tasks • Exercise • Hospital appointments
            </p>
          </div>
        </div>

        <button
          onClick={onOpenRemindersModal}
          className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-teal-800 flex items-center gap-1 shadow-sm transition active:scale-95 shrink-0 self-start sm:self-auto"
        >
          <span>View All ({allReminders.length})</span>
          <ChevronRight className="w-3.5 h-3.5 text-teal-600" />
        </button>
      </div>

      {/* Reminder Cards Carousel / Stack */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-3">
        {displayReminders.map(r => (
          <div
            key={r.id}
            className={`p-3 rounded-2xl border transition flex flex-col justify-between ${
              r.dueStatus === 'due_now'
                ? 'bg-amber-100/60 border-amber-300'
                : r.dueStatus === 'overdue'
                ? 'bg-rose-100/60 border-rose-300'
                : 'bg-slate-50/80 border-slate-200'
            }`}
          >
            <div className="flex items-start gap-2.5">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-white ${
                r.type === 'medication' ? 'bg-teal-600' :
                r.type === 'exercise' ? 'bg-emerald-600' :
                r.type === 'appointment' ? 'bg-blue-600' : 'bg-amber-600'
              }`}>
                {r.type === 'medication' && <Pill className="w-3.5 h-3.5" />}
                {r.type === 'exercise' && <Activity className="w-3.5 h-3.5" />}
                {r.type === 'appointment' && <Calendar className="w-3.5 h-3.5" />}
                {r.type === 'task' && <CheckCircle2 className="w-3.5 h-3.5" />}
              </div>

              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold text-slate-500 block truncate">
                  {r.targetTimeFormatted}
                </span>
                <h4 className="text-xs font-bold text-slate-900 truncate">
                  {r.title}
                </h4>
                <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">
                  {r.subtitle}
                </p>
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between">
              <button
                onClick={() => {
                  fireAutoWhatsAppReminder(r, true);
                  playReminderChime();
                  showToast(`Opened WhatsApp DM alert for ${r.title}!`, 'success');
                }}
                className="text-[10px] text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
                title="Send WhatsApp DM now"
              >
                <MessageSquare className="w-3 h-3 text-emerald-600" />
                <span>WhatsApp</span>
              </button>

              <div className="flex items-center gap-1.5">
                {r.type === 'medication' && (
                  <button
                    onClick={() => {
                      markMedicationTaken(r.metadata.medicationId!, r.time);
                      playReminderChime();
                      showToast(`Dose recorded for ${r.title}!`, 'success');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-bold text-[11px] flex items-center gap-1 shadow-sm transition"
                  >
                    <Check className="w-3 h-3" />
                    <span>Take Dose</span>
                  </button>
                )}

                {r.type === 'exercise' && (
                  <button
                    onClick={() => {
                      if (r.metadata.taskId) {
                        toggleCareTask(r.metadata.taskId);
                      }
                      playReminderChime();
                      showToast('Physical activity session recorded!', 'success');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-[11px] flex items-center gap-1 shadow-sm transition"
                  >
                    <Check className="w-3 h-3" />
                    <span>Done</span>
                  </button>
                )}

                {r.type === 'task' && (
                  <button
                    onClick={() => {
                      if (r.metadata.taskId) toggleCareTask(r.metadata.taskId);
                      playReminderChime();
                      showToast('Task marked complete!', 'success');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold text-[11px] flex items-center gap-1 shadow-sm transition"
                  >
                    <Check className="w-3 h-3" />
                    <span>Complete</span>
                  </button>
                )}

                {r.type === 'appointment' && (
                  <button
                    onClick={() => onNavigateTab?.('appointments')}
                    className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-[11px] flex items-center gap-1 shadow-sm transition"
                  >
                    <span>Details</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

