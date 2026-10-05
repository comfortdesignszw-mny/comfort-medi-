import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { exportHealthDataJSON, triggerBiometricAuthentication } from '../../lib/security';
import { generateWhatsAppLink } from '../../lib/whatsappGateway';
import { 
  User, 
  ShieldCheck, 
  Lock, 
  Phone, 
  Download, 
  Upload, 
  FileText, 
  Fingerprint, 
  Check, 
  AlertCircle, 
  X,
  MessageSquare,
  KeyRound
} from 'lucide-react';

export const ProfileSettingsView: React.FC = () => {
  const userProfile = useAppStore(s => s.userProfile);
  const updateProfile = useAppStore(s => s.updateProfile);
  const emergencyContacts = useAppStore(s => s.emergencyContacts);
  const addEmergencyContact = useAppStore(s => s.addEmergencyContact);
  const removeEmergencyContact = useAppStore(s => s.removeEmergencyContact);
  const isPinEnabled = useAppStore(s => s.isPinEnabled);
  const setupPin = useAppStore(s => s.setupPin);
  const setPinLocked = useAppStore(s => s.setPinLocked);
  const auditLogs = useAppStore(s => s.auditLogs);
  const whatsappNotifications = useAppStore(s => s.whatsappNotifications);
  const restoreFromBackup = useAppStore(s => s.restoreFromBackup);
  const showToast = useAppStore(s => s.showToast);
  const fullStoreState = useAppStore.getState();

  const [activeTab, setActiveTab] = useState<'profile' | 'emergency' | 'security' | 'audit_whatsapp'>('profile');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState(userProfile);

  // New Emergency Contact Form
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    relationship: 'Family Member',
    phoneNumber: '+263 77 ',
    alternativePhone: '',
    address: 'Harare',
    priorityLevel: 1 as 1 | 2 | 3,
    emergencyNotes: '',
  });

  // PIN Setup Form
  const [pinInput, setPinInput] = useState('1234');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profileForm);
    setIsEditingProfile(false);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          restoreFromBackup(parsed);
        } catch {
          showToast('Invalid backup JSON format', 'error');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-5 pb-24 animate-in fade-in duration-150">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Profile &amp; Security Settings
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Personal identity • Emergency contacts • AES local vault • Audit logs
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 bg-slate-200/60 p-1 rounded-2xl text-xs">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition ${
            activeTab === 'profile' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Patient Info</span>
        </button>
        <button
          onClick={() => setActiveTab('emergency')}
          className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition ${
            activeTab === 'emergency' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Contacts ({emergencyContacts.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition ${
            activeTab === 'security' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Security &amp; PIN</span>
        </button>
        <button
          onClick={() => setActiveTab('audit_whatsapp')}
          className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition ${
            activeTab === 'audit_whatsapp' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
          <span>Audit &amp; WhatsApp</span>
        </button>
      </div>

      {/* TAB 1: PATIENT PROFILE INFO */}
      {activeTab === 'profile' && (
        <div className="rounded-3xl bg-white p-5 sm:p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white font-black text-lg flex items-center justify-center shadow-md">
                {userProfile.fullName.charAt(0)}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{userProfile.fullName}</h3>
                <p className="text-xs text-slate-500">ID: {userProfile.nationalId} • {userProfile.city}</p>
              </div>
            </div>

            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="px-3.5 py-1.5 rounded-xl border border-teal-500 text-teal-700 hover:bg-teal-50 text-xs font-bold transition"
            >
              {isEditingProfile ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {isEditingProfile ? (
            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    value={profileForm.fullName}
                    onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone Number (Zimbabwe)</label>
                  <input
                    type="text"
                    value={profileForm.phoneNumber}
                    onChange={(e) => setProfileForm({ ...profileForm, phoneNumber: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={profileForm.dateOfBirth}
                    onChange={(e) => setProfileForm({ ...profileForm, dateOfBirth: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">National ID</label>
                  <input
                    type="text"
                    value={profileForm.nationalId}
                    onChange={(e) => setProfileForm({ ...profileForm, nationalId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Passport Number</label>
                  <input
                    type="text"
                    value={profileForm.passportNumber || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, passportNumber: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Blood Type</label>
                  <select
                    value={profileForm.bloodType}
                    onChange={(e) => setProfileForm({ ...profileForm, bloodType: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Height (cm)</label>
                  <input
                    type="number"
                    value={profileForm.heightCm}
                    onChange={(e) => setProfileForm({ ...profileForm, heightCm: parseInt(e.target.value, 10) || 168 })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={profileForm.weightKg}
                    onChange={(e) => setProfileForm({ ...profileForm, weightKg: parseFloat(e.target.value) || 69 })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Medical Aid / Insurance</label>
                  <input
                    type="text"
                    value={profileForm.insuranceProvider}
                    onChange={(e) => setProfileForm({ ...profileForm, insuranceProvider: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Policy Number</label>
                  <input
                    type="text"
                    value={profileForm.insurancePolicyNumber}
                    onChange={(e) => setProfileForm({ ...profileForm, insurancePolicyNumber: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition shadow-sm"
              >
                Save Profile Changes
              </button>
            </form>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Personal</span>
                <p className="font-bold text-slate-900 mt-1">{userProfile.gender.toUpperCase()} • DOB: {userProfile.dateOfBirth}</p>
                <p className="text-slate-500 mt-0.5">{userProfile.occupation}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Contact</span>
                <p className="font-bold text-slate-900 mt-1">{userProfile.phoneNumber}</p>
                <p className="text-slate-500 mt-0.5">{userProfile.address}, {userProfile.city}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Clinical Overview</span>
                <p className="font-bold text-teal-800 mt-1">Blood: {userProfile.bloodType} (Rh {userProfile.rhesusFactor})</p>
                <p className="text-slate-500 mt-0.5">BMI: {userProfile.bmi} • Organ Donor: {userProfile.organDonor ? 'Yes' : 'No'}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60 sm:col-span-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Medical Aid &amp; Provider</span>
                <p className="font-bold text-slate-900 mt-1">{userProfile.insuranceProvider} ({userProfile.insurancePolicyNumber})</p>
                <p className="text-slate-500 mt-0.5">Primary Doctor: {userProfile.primaryHealthcareProvider}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Language</span>
                <p className="font-bold text-slate-900 mt-1 uppercase">{userProfile.languagePreference}</p>
                <p className="text-slate-500 mt-0.5">Zimbabwean Resident</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: EMERGENCY CONTACTS */}
      {activeTab === 'emergency' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Emergency Contact List (One-Tap Calling)</h3>
            <button
              onClick={() => setShowAddContactModal(true)}
              className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Add Contact</span>
            </button>
          </div>

          <div className="space-y-3">
            {emergencyContacts.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{c.name}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 font-bold">
                      {c.relationship}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
                      Priority {c.priorityLevel}
                    </span>
                  </div>
                  <p className="text-slate-600 font-mono mt-1">{c.phoneNumber}</p>
                  {c.emergencyNotes && (
                    <p className="text-slate-500 text-[11px] mt-0.5">{c.emergencyNotes}</p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <a
                    href={generateWhatsAppLink(
                      c.phoneNumber,
                      `Hello ${c.name}, this is ${userProfile.fullName} sharing an update via Comfort Medi+.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1 text-xs shadow-sm transition active:scale-95"
                    title="Send WhatsApp message"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span className="hidden xs:inline">WhatsApp</span>
                  </a>
                  <a
                    href={`tel:${c.phoneNumber.replace(/\s+/g, '')}`}
                    className="px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold flex items-center gap-1 text-xs shadow-sm transition active:scale-95"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </a>
                  <button
                    onClick={() => removeEmergencyContact(c.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SECURITY & PIN */}
      {activeTab === 'security' && (
        <div className="space-y-4">
          {/* AES Encryption Status */}
          <div className="rounded-3xl bg-white p-5 border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex items-center gap-2.5 text-teal-700">
              <ShieldCheck className="w-6 h-6" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">Local Data Encryption (Web Crypto AES-256)</h3>
                <p className="text-[11px] text-slate-500">Zero plain-text transmission • Offline encrypted vault</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              All personal medical histories, medication schedules, lab results, and vitals readings are encrypted locally on this device using 256-bit AES-GCM cryptography. Your records remain private and accessible without requiring external cloud handshake checks.
            </p>
          </div>

          {/* PIN Lock Settings */}
          <div className="rounded-3xl bg-white p-5 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Lock className="w-5 h-5 text-teal-600" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Application PIN Protection</h4>
                  <p className="text-[11px] text-slate-500">Require 4-digit PIN when opening app</p>
                </div>
              </div>
              <button
                onClick={() => setupPin(pinInput, !isPinEnabled)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  isPinEnabled ? 'bg-rose-100 text-rose-700' : 'bg-teal-600 text-white'
                }`}
              >
                {isPinEnabled ? 'Disable PIN' : 'Enable PIN'}
              </button>
            </div>

            {isPinEnabled && (
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-3 text-xs">
                <div className="flex items-center gap-3">
                  <label className="font-bold text-slate-700 shrink-0">Current PIN:</label>
                  <input
                    type="password"
                    maxLength={4}
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    className="w-24 p-2 text-center text-sm font-mono tracking-widest rounded-xl border border-slate-200 bg-white"
                  />
                  <button
                    onClick={() => setupPin(pinInput, true)}
                    className="px-3 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold"
                  >
                    Update PIN
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-200 flex gap-2">
                  <button
                    onClick={() => setPinLocked(true)}
                    className="px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Lock App Now</span>
                  </button>
                  <button
                    onClick={async () => {
                      await triggerBiometricAuthentication();
                      showToast('Biometric sensor test passed', 'success');
                    }}
                    className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5"
                  >
                    <Fingerprint className="w-3.5 h-3.5 text-teal-600" />
                    <span>Test Biometrics</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Backup & Recovery */}
          <div className="rounded-3xl bg-white p-5 border border-slate-200/80 shadow-sm space-y-3 text-xs">
            <h4 className="font-bold text-slate-900">Encrypted Backup &amp; Recovery</h4>
            <p className="text-slate-500">
              Export your entire medical record history into an encrypted JSON file for safekeeping or transfer to another phone.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={() => {
                  exportHealthDataJSON(fullStoreState, `comfort-medi-plus-export-${new Date().toISOString().split('T')[0]}.json`);
                  showToast('Medical backup downloaded successfully', 'success');
                }}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold flex items-center gap-1.5 shadow-sm transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Backup (JSON)</span>
              </button>

              <label className="cursor-pointer px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold flex items-center gap-1.5 transition">
                <Upload className="w-3.5 h-3.5 text-teal-600" />
                <span>Restore from JSON</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImportJSON}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT LOGS & WHATSAPP DISPATCH */}
      {activeTab === 'audit_whatsapp' && (
        <div className="space-y-4">
          {/* WhatsApp Dispatch History */}
          <div className="rounded-3xl bg-white p-5 border border-slate-200/80 shadow-sm space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <h4 className="font-bold text-slate-900">WhatsApp Deep Link Notifications ({whatsappNotifications.length})</h4>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Zimbabwe Deep Links Active
              </span>
            </div>

            <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
              {whatsappNotifications.map((wa) => (
                <div key={wa.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="font-bold text-slate-800">{wa.recipient}</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-600">
                        {wa.type}
                      </span>
                      <span className="text-slate-400 font-mono text-[10px]">
                        {new Date(wa.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-1 italic text-xs">"{wa.message}"</p>
                  </div>
                  <a
                    href={wa.deepLinkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 self-start sm:self-center px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-[11px] inline-flex items-center gap-1.5 shadow-sm transition"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Open in WhatsApp</span>
                  </a>
                </div>
              ))}
              {whatsappNotifications.length === 0 && (
                <p className="text-slate-400 py-6 text-center italic">
                  No WhatsApp notifications recorded yet. Medications and appointments will generate one-tap deep links here.
                </p>
              )}
            </div>
          </div>

          {/* Audit Logs */}
          <div className="rounded-3xl bg-white p-5 border border-slate-200/80 shadow-sm space-y-3 text-xs">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-600" />
              <h4 className="font-bold text-slate-900">Local Security Audit Trail ({auditLogs.length})</h4>
            </div>

            <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
              {auditLogs.map((log) => (
                <div key={log.id} className="py-2 flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                        {log.category}
                      </span>
                      <span className="font-semibold text-slate-800">{log.action}</span>
                    </div>
                    {log.details && <p className="text-[11px] text-slate-500 mt-0.5">{log.details}</p>}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD EMERGENCY CONTACT */}
      {showAddContactModal && (
        <div 
          onClick={() => setShowAddContactModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add Emergency Contact</h3>
              <button onClick={() => setShowAddContactModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addEmergencyContact(newContact);
                setShowAddContactModal(false);
              }}
              className="mt-4 space-y-3 text-xs"
            >
              <div>
                <label className="font-bold text-slate-700 block mb-1">Contact Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Tendai Moyo"
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Relationship</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Spouse, Brother"
                    value={newContact.relationship}
                    onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Priority</label>
                  <select
                    value={newContact.priorityLevel}
                    onChange={(e) => setNewContact({ ...newContact, priorityLevel: parseInt(e.target.value, 10) as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value={1}>1 (First Call)</option>
                    <option value={2}>2 (Second Call)</option>
                    <option value={3}>3 (Backup)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Phone Number (+263)</label>
                <input
                  required
                  type="text"
                  placeholder="+263 77 123 4567"
                  value={newContact.phoneNumber}
                  onChange={(e) => setNewContact({ ...newContact, phoneNumber: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Emergency Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Lives 5 mins away, has car"
                  value={newContact.emergencyNotes}
                  onChange={(e) => setNewContact({ ...newContact, emergencyNotes: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddContactModal(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold"
                >
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
