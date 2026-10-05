import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Medication } from '../../types';
import { 
  Pill, 
  Clock, 
  Check, 
  RotateCcw, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Flame, 
  MessageSquare, 
  ShieldCheck, 
  X, 
  Bell,
  RefreshCw,
  TrendingUp,
  History
} from 'lucide-react';

export const MedicationManagementView: React.FC = () => {
  const medications = useAppStore(s => s.medications);
  const medicationLogs = useAppStore(s => s.medicationLogs);
  const adherenceStreak = useAppStore(s => s.adherenceStreak);
  const userProfile = useAppStore(s => s.userProfile);
  const addMedication = useAppStore(s => s.addMedication);
  const updateMedication = useAppStore(s => s.updateMedication);
  const deleteMedication = useAppStore(s => s.deleteMedication);
  const markMedicationTaken = useAppStore(s => s.markMedicationTaken);
  const snoozeMedication = useAppStore(s => s.snoozeMedication);
  const skipMedication = useAppStore(s => s.skipMedication);
  const refillMedication = useAppStore(s => s.refillMedication);
  const sendWhatsAppMessage = useAppStore(s => s.sendWhatsAppMessage);
  const showToast = useAppStore(s => s.showToast);

  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'schedules' | 'refills' | 'history'>('schedules');
  const [refillModalMed, setRefillModalMed] = useState<Medication | null>(null);
  const [refillQuantity, setRefillQuantity] = useState(30);

  // New Medication Form State
  const [newMed, setNewMed] = useState<Omit<Medication, 'id'>>({
    name: '',
    genericName: '',
    brandName: '',
    strength: '',
    dosage: '1 tablet',
    route: 'oral',
    frequency: 'once_daily',
    purpose: '',
    instructions: 'Take with food and a full glass of water',
    startDate: new Date().toISOString().split('T')[0],
    prescribingDoctor: 'Dr. T. Sithole',
    scheduledTimes: ['08:00'],
    remainingUnits: 30,
    totalPrescribedUnits: 30,
    refillThreshold: 7,
    active: true,
  });

  // Calculate adherence percentage
  const totalLogs = medicationLogs.length;
  const takenLogs = medicationLogs.filter(l => l.status === 'taken').length;
  const adherenceRate = totalLogs > 0 ? Math.round((takenLogs / totalLogs) * 100) : 96;

  // Send WhatsApp deep link reminder for a medication
  const handleSendWhatsAppReminder = (med: Medication) => {
    const text = `*COMFORT MEDI+ REMINDER* 💊\nHello ${userProfile.fullName},\nThis is your reminder to take your scheduled dose:\n• Medication: *${med.name} ${med.strength}*\n• Dosage: *${med.dosage}*\n• Instructions: ${med.instructions}\n• Prescribed by: ${med.prescribingDoctor}\n\nPlease reply *TAKEN* once consumed. Stay healthy!`;
    sendWhatsAppMessage(userProfile.phoneNumber, text, 'MEDICATION');
  };

  return (
    <div className="space-y-5 pb-24 animate-in fade-in duration-150">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Medication &amp; Reminder System
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Offline schedules • WhatsApp reminders • Adherence analytics &amp; refills
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Medication</span>
        </button>
      </div>

      {/* Adherence & Analytics Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-white p-3.5 border border-slate-200/80 shadow-sm text-center">
          <div className="flex items-center justify-center gap-1 text-teal-600 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-[10px] uppercase font-bold text-slate-400">Adherence</span>
          </div>
          <p className="text-lg sm:text-xl font-black text-teal-800">{adherenceRate}%</p>
          <span className="text-[10px] text-emerald-600 font-bold">Excellent</span>
        </div>

        <div className="rounded-2xl bg-white p-3.5 border border-slate-200/80 shadow-sm text-center">
          <div className="flex items-center justify-center gap-1 text-amber-500 mb-1">
            <Flame className="w-4 h-4 fill-amber-500" />
            <span className="text-[10px] uppercase font-bold text-slate-400">Streak</span>
          </div>
          <p className="text-lg sm:text-xl font-black text-slate-900">{adherenceStreak} <span className="text-xs font-normal">Days</span></p>
          <span className="text-[10px] text-slate-400">Unbroken</span>
        </div>

        <div className="rounded-2xl bg-white p-3.5 border border-slate-200/80 shadow-sm text-center">
          <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
            <Pill className="w-4 h-4" />
            <span className="text-[10px] uppercase font-bold text-slate-400">Active</span>
          </div>
          <p className="text-lg sm:text-xl font-black text-slate-900">{medications.filter(m => m.active).length}</p>
          <span className="text-[10px] text-slate-400">Prescribed</span>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex gap-1.5 bg-slate-200/60 p-1 rounded-2xl text-xs">
        <button
          onClick={() => setActiveTab('schedules')}
          className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition ${
            activeTab === 'schedules' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Daily Schedules</span>
        </button>
        <button
          onClick={() => setActiveTab('refills')}
          className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition ${
            activeTab === 'refills' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refill Management</span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition ${
            activeTab === 'history' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Dose History</span>
        </button>
      </div>

      {/* TAB 1: DAILY SCHEDULES */}
      {activeTab === 'schedules' && (
        <div className="space-y-3.5">
          {medications.map((med) => {
            const isLowStock = med.remainingUnits <= med.refillThreshold;
            return (
              <div
                key={med.id}
                className="rounded-3xl bg-white p-5 border border-slate-200/80 shadow-sm space-y-4 hover:border-teal-500/40 transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                      <Pill className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">
                          {med.name} {med.strength}
                        </h3>
                        {med.brandName && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                            {med.brandName}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {med.dosage} • Route: <span className="capitalize">{med.route}</span> • {med.frequency.replace('_', ' ')}
                      </p>
                      <p className="text-xs text-teal-800 font-medium mt-1">
                        🎯 Purpose: {med.purpose}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteMedication(med.id)}
                    className="p-1.5 rounded-lg text-slate-300 hover:text-rose-600 transition"
                    title="Remove Medication"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl text-xs text-slate-600 border border-slate-200/60">
                  <p><strong>Instructions:</strong> {med.instructions}</p>
                  <p className="text-[11px] text-slate-500 mt-1">Prescribed by {med.prescribingDoctor} on {med.startDate}</p>
                </div>

                {/* Stock bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-600">Remaining Supply:</span>
                    <span className={`font-bold ${isLowStock ? 'text-amber-600' : 'text-slate-900'}`}>
                      {med.remainingUnits} / {med.totalPrescribedUnits} doses
                      {isLowStock && ' (Low Stock Alert)'}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isLowStock ? 'bg-amber-500' : 'bg-teal-500'
                      }`}
                      style={{ width: `${Math.min(100, (med.remainingUnits / med.totalPrescribedUnits) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Scheduled Times & Action Buttons */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs text-slate-500 font-medium">Scheduled at:</span>
                    {med.scheduledTimes.map(t => (
                      <span key={t} className="px-2 py-0.5 rounded-lg bg-teal-50 text-teal-800 text-xs font-bold font-mono">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSendWhatsAppReminder(med)}
                      className="px-2.5 py-1.5 rounded-xl border border-emerald-500/40 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 shadow-xs"
                      title="Send WhatsApp Reminder via Deep Link"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp</span>
                    </button>
                    <button
                      onClick={() => snoozeMedication(med.id, 15)}
                      className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold transition"
                    >
                      Snooze 15m
                    </button>
                    <button
                      onClick={() => markMedicationTaken(med.id, med.scheduledTimes[0])}
                      className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Take Dose</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: REFILL MANAGEMENT */}
      {activeTab === 'refills' && (
        <div className="space-y-3.5">
          <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200/80 text-xs text-teal-900">
            <h4 className="font-bold mb-1">Zimbabwe Pharmacy Refill Coordination</h4>
            <p className="text-teal-800 leading-relaxed">
              Track remaining supplies, receive automated WhatsApp alerts when threshold falls under 7 days, and log prescription refills from local pharmacies (e.g. Greenwood Park, CAPS, Baines).
            </p>
          </div>

          <div className="divide-y divide-slate-100 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm">
            {medications.map((med) => {
              const isLow = med.remainingUnits <= med.refillThreshold;
              return (
                <div key={med.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{med.name} {med.strength}</h4>
                      {isLow && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          Refill Needed
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Remaining: <strong className="text-slate-900">{med.remainingUnits}</strong> doses (Threshold: {med.refillThreshold})
                    </p>
                    {med.refillDate && (
                      <p className="text-[11px] text-teal-700 mt-0.5">Target Refill Date: {med.refillDate}</p>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setRefillModalMed(med);
                      setRefillQuantity(30);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition self-end sm:self-center"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Log Refill</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: DOSE LOG HISTORY */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Recent Medication Logs</h3>
          <div className="divide-y divide-slate-100">
            {medicationLogs.map((log) => (
              <div key={log.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{log.medicationName}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      log.status === 'taken' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : log.status === 'skipped' 
                        ? 'bg-rose-100 text-rose-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {log.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {log.date} at {log.actualTime || log.scheduledTime}
                    {log.notes && ` • ${log.notes}`}
                  </p>
                </div>
                <Check className={`w-4 h-4 ${log.status === 'taken' ? 'text-emerald-600' : 'text-slate-300'}`} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: ADD MEDICATION */}
      {showAddModal && (
        <div 
          onClick={() => setShowAddModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add New Medication</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addMedication(newMed);
                setShowAddModal(false);
              }}
              className="mt-4 space-y-3 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Medication Name</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Metformin"
                    value={newMed.name}
                    onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Strength</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. 500mg, 10ml, 100mcg"
                    value={newMed.strength}
                    onChange={(e) => setNewMed({ ...newMed, strength: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Generic Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Metformin Hydrochloride"
                    value={newMed.genericName}
                    onChange={(e) => setNewMed({ ...newMed, genericName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Brand Name (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Glucophage"
                    value={newMed.brandName}
                    onChange={(e) => setNewMed({ ...newMed, brandName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Route</label>
                  <select
                    value={newMed.route}
                    onChange={(e) => setNewMed({ ...newMed, route: e.target.value as any })}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    <option value="oral">Oral (Tablet/Liquid)</option>
                    <option value="inhaler">Inhaler</option>
                    <option value="injection">Injection</option>
                    <option value="topical">Topical / Cream</option>
                    <option value="eye_ear_drops">Drops</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Frequency</label>
                  <select
                    value={newMed.frequency}
                    onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value as any })}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    <option value="once_daily">Once Daily</option>
                    <option value="twice_daily">Twice Daily</option>
                    <option value="thrice_daily">3 Times Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="as_needed">As Needed (PRN)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Dose Time</label>
                  <input
                    type="time"
                    value={newMed.scheduledTimes[0] || '08:00'}
                    onChange={(e) => setNewMed({ ...newMed, scheduledTimes: [e.target.value] })}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Clinical Purpose</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Type 2 Diabetes Glycemic Control"
                  value={newMed.purpose}
                  onChange={(e) => setNewMed({ ...newMed, purpose: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Instructions</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Take with morning food and water"
                  value={newMed.instructions}
                  onChange={(e) => setNewMed({ ...newMed, instructions: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Initial Pill Count</label>
                  <input
                    type="number"
                    min="1"
                    value={newMed.remainingUnits}
                    onChange={(e) => setNewMed({ ...newMed, remainingUnits: parseInt(e.target.value, 10) || 30, totalPrescribedUnits: parseInt(e.target.value, 10) || 30 })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Low Alert Threshold (doses)</label>
                  <input
                    type="number"
                    min="1"
                    value={newMed.refillThreshold}
                    onChange={(e) => setNewMed({ ...newMed, refillThreshold: parseInt(e.target.value, 10) || 7 })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-sm"
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REFILL LOG MODAL */}
      {refillModalMed && (
        <div 
          onClick={() => setRefillModalMed(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xs rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-3">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Log Refill</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Add new supply for <strong>{refillModalMed.name}</strong>
            </p>

            <div className="flex items-center justify-center gap-3 my-4">
              <button
                type="button"
                onClick={() => setRefillQuantity(Math.max(10, refillQuantity - 10))}
                className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 font-bold text-lg hover:bg-slate-200"
              >
                -
              </button>
              <span className="text-2xl font-black text-slate-900 w-16 text-center">{refillQuantity}</span>
              <button
                type="button"
                onClick={() => setRefillQuantity(refillQuantity + 10)}
                className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 font-bold text-lg hover:bg-slate-200"
              >
                +
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mb-4">doses / tablets</p>

            <div className="flex gap-2">
              <button
                onClick={() => setRefillModalMed(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  refillMedication(refillModalMed.id, refillQuantity);
                  setRefillModalMed(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
