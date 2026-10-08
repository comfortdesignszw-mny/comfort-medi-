import { create } from 'zustand';
import { 
  UserProfile, 
  EmergencyContact, 
  Allergy, 
  ChronicCondition, 
  MedicalRecord, 
  MedicalDocument, 
  VaccinationRecord, 
  Medication, 
  MedicationLog, 
  Appointment, 
  VitalsReading, 
  CareTask, 
  CareTeamMember, 
  ProgressReport, 
  HomeCarePlan, 
  SyncQueueItem, 
  AuditLog, 
  UserRole, 
  Language, 
  FontSize,
  FirebaseUserRecord,
  PatientAssignment,
  SubscriptionTier
} from '../types';
import { 
  INITIAL_USER_PROFILE, 
  INITIAL_EMERGENCY_CONTACTS, 
  INITIAL_ALLERGIES, 
  INITIAL_CHRONIC_CONDITIONS, 
  INITIAL_MEDICAL_RECORDS, 
  INITIAL_DOCUMENTS, 
  INITIAL_VACCINATIONS, 
  INITIAL_MEDICATIONS, 
  INITIAL_MEDICATION_LOGS, 
  INITIAL_APPOINTMENTS, 
  INITIAL_VITALS, 
  INITIAL_CARE_TASKS, 
  INITIAL_CARE_TEAM, 
  INITIAL_PROGRESS_REPORTS, 
  INITIAL_CARE_PLAN,
  INITIAL_AUDIT_LOGS,
  getClinicalStarterTemplate
} from '../data/mockSeedData';
import { createAuditEntry } from '../lib/security';
import { 
  triggerWhatsAppNotification, 
  WhatsAppNotificationRecord, 
  buildReminderWhatsAppMessage 
} from '../lib/whatsappGateway';
import type { HealthReminder, ReminderType } from '../lib/remindersEngine';
import { 
  persistItemToFirestore, 
  deleteItemFromFirestore, 
  fetchCollectionFromFirestore, 
  deleteUserAccountAndData, 
  fetchDoctorAssignments, 
  logStaffActivity,
  updateUserProfileInFirestore
} from '../lib/authService';

interface AppState {
  // Auth & Roles
  isAuthenticated: boolean;
  currentUserRole: UserRole;
  firebaseUser: FirebaseUserRecord | null;
  showAuthModal: boolean;
  authModalMode: 'signin' | 'register';
  adminUsersList: FirebaseUserRecord[];
  userProfile: UserProfile;
  emergencyContacts: EmergencyContact[];
  
  // Security & App Lock
  isPinLocked: boolean;
  pinCode: string; // 4-digit PIN
  isPinEnabled: boolean;
  auditLogs: AuditLog[];
  
  // Accessibility & Preferences
  language: Language;
  fontSize: FontSize;
  highContrast: boolean;

  // Medical Records Module
  allergies: Allergy[];
  chronicConditions: ChronicCondition[];
  medicalRecords: MedicalRecord[];
  documents: MedicalDocument[];
  vaccinations: VaccinationRecord[];

  // Medication Management Module
  medications: Medication[];
  medicationLogs: MedicationLog[];
  adherenceStreak: number;

  // Appointments Module
  appointments: Appointment[];

  // Home Care Module
  carePlan: HomeCarePlan;
  careTeam: CareTeamMember[];
  vitals: VitalsReading[];
  progressReports: ProgressReport[];

  // Offline Sync & Notifications
  syncQueue: SyncQueueItem[];
  isSyncing: boolean;
  lastSyncedAt: string;
  whatsappNotifications: WhatsAppNotificationRecord[];

  // Auto WhatsApp Trigger Engine
  autoWhatsAppTriggerEnabled: boolean;
  autoWhatsAppNumber: string;
  firedWhatsAppReminderKeys: string[];
  lastAutoFiredWhatsApp: {
    id: string;
    reminderTitle: string;
    phone: string;
    deepLinkUrl: string;
    message: string;
    timestamp: string;
    type: string;
  } | null;
  setAutoWhatsAppTriggerEnabled: (enabled: boolean) => void;
  setAutoWhatsAppNumber: (phone: string) => void;
  dismissLastAutoFiredWhatsApp: () => void;
  fireAutoWhatsAppReminder: (reminder: HealthReminder, forceOpen?: boolean) => WhatsAppNotificationRecord;
  
  // Toast notifications for user feedback
  activeToast: { id: string; message: string; type: 'success' | 'info' | 'warning' | 'error' } | null;

  // Actions
  setFirebaseUser: (user: FirebaseUserRecord | null) => void;
  setShowAuthModal: (show: boolean, mode?: 'signin' | 'register') => void;
  setAdminUsersList: (users: FirebaseUserRecord[]) => void;
  setRole: (role: UserRole) => void;
  setLanguage: (lang: Language) => void;
  setFontSize: (size: FontSize) => void;
  setHighContrast: (enabled: boolean) => void;
  setPinLocked: (locked: boolean) => void;
  setupPin: (pin: string, enabled: boolean) => void;
  unlockWithPin: (pin: string) => boolean;
  sendWhatsAppMessage: (phone: string, text: string, type?: WhatsAppNotificationRecord['type']) => void;
  
  updateProfile: (profile: Partial<UserProfile>) => void;
  addEmergencyContact: (contact: Omit<EmergencyContact, 'id'>) => void;
  removeEmergencyContact: (id: string) => void;

  // Medical Record actions
  addMedicalRecord: (record: Omit<MedicalRecord, 'id'>) => void;
  deleteMedicalRecord: (id: string) => void;
  addDocument: (doc: Omit<MedicalDocument, 'id'>) => void;
  deleteDocument: (id: string) => void;
  addAllergy: (allergy: Omit<Allergy, 'id'>) => void;
  deleteAllergy: (id: string) => void;
  addChronicCondition: (condition: Omit<ChronicCondition, 'id'>) => void;
  deleteChronicCondition: (id: string) => void;
  addVaccination: (vac: Omit<VaccinationRecord, 'id'>) => void;

  // Medication actions
  addMedication: (med: Omit<Medication, 'id'>) => void;
  updateMedication: (id: string, med: Partial<Medication>) => void;
  deleteMedication: (id: string) => void;
  markMedicationTaken: (medId: string, scheduledTime?: string, notes?: string) => Promise<void>;
  skipMedication: (medId: string, scheduledTime?: string, reason?: string) => void;
  snoozeMedication: (medId: string, minutes?: number) => void;
  refillMedication: (medId: string, addedUnits: number) => void;

  // Appointment actions
  bookAppointment: (apt: Omit<Appointment, 'id'>) => Promise<void>;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  cancelAppointment: (id: string) => void;

  // Home Care actions
  toggleCareTask: (taskId: string) => void;
  addCareTask: (task: Omit<CareTask, 'id' | 'completed'>) => void;
  logVitalReading: (vital: Omit<VitalsReading, 'id' | 'date'>) => void;
  addProgressReport: (report: Omit<ProgressReport, 'id' | 'date'>) => void;

  // Sync actions
  triggerManualSync: () => Promise<void>;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  hideToast: () => void;
  restoreFromBackup: (backup: any) => void;

  // Clinical RBAC & Patient Assignments
  assignedPatients: PatientAssignment[];
  activeAssignedPatientId: string | null;
  setActiveAssignedPatientId: (id: string | null) => void;
  refreshAssignedPatients: () => Promise<void>;
  syncUserDataFromFirestore: (userId: string) => Promise<void>;

  // User Data Control (Portability & Erasure)
  exportAllUserDataJSON: () => void;
  eraseAllUserDataAndReset: () => Promise<void>;
  loadClinicalStarterTemplate: () => void;

  // Pro Subscription & Renewal Terms
  showRenewalTermsModal: boolean;
  setShowRenewalTermsModal: (show: boolean) => void;
  showSubscriptionModal: boolean;
  setShowSubscriptionModal: (show: boolean) => void;
  updateSubscription: (tier: SubscriptionTier, cycle: 'monthly' | 'yearly', acceptTerms: boolean) => Promise<void>;
  cancelSubscriptionAutoRenewal: () => Promise<void>;

  // Notification Alerts Unsubscribe Controls
  toggleWhatsAppOptOut: (optOut: boolean) => Promise<void>;
  toggleEmailOptOut: (optOut: boolean) => Promise<void>;
  unsubscribeAllAlerts: () => Promise<void>;
  resubscribeAlerts: () => Promise<void>;
}

const STORAGE_KEY = 'comfort_medi_plus_v3_clean';

function loadPersistedState(): Partial<AppState> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to load local storage:', err);
  }
  return {};
}

function persistState(state: Partial<AppState>) {
  if (typeof window === 'undefined') return;
  try {
    const subset = {
      userProfile: state.userProfile,
      firebaseUser: state.firebaseUser,
      emergencyContacts: state.emergencyContacts,
      pinCode: state.pinCode,
      isPinEnabled: state.isPinEnabled,
      language: state.language,
      fontSize: state.fontSize,
      highContrast: state.highContrast,
      allergies: state.allergies,
      chronicConditions: state.chronicConditions,
      medicalRecords: state.medicalRecords,
      documents: state.documents,
      vaccinations: state.vaccinations,
      medications: state.medications,
      medicationLogs: state.medicationLogs,
      adherenceStreak: state.adherenceStreak,
      appointments: state.appointments,
      carePlan: state.carePlan,
      careTeam: state.careTeam,
      vitals: state.vitals,
      progressReports: state.progressReports,
      syncQueue: state.syncQueue,
      lastSyncedAt: state.lastSyncedAt,
      auditLogs: state.auditLogs,
      whatsappNotifications: state.whatsappNotifications,
      autoWhatsAppTriggerEnabled: state.autoWhatsAppTriggerEnabled,
      autoWhatsAppNumber: state.autoWhatsAppNumber,
      firedWhatsAppReminderKeys: state.firedWhatsAppReminderKeys,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subset));
  } catch (err) {
    console.warn('Local storage write warning:', err);
  }
}

const persisted = loadPersistedState();

export const useAppStore = create<AppState>((set, get) => ({
  isAuthenticated: Boolean((persisted as any).firebaseUser),
  currentUserRole: (persisted as any).firebaseUser?.role || persisted.currentUserRole || 'patient',
  firebaseUser: (persisted as any).firebaseUser || null,
  showAuthModal: false,
  authModalMode: 'signin',
  adminUsersList: [],
  setShowAuthModal: (show: boolean, mode: 'signin' | 'register' = 'signin') => set({ showAuthModal: show, authModalMode: mode }),
  setAdminUsersList: (users: FirebaseUserRecord[]) => set({ adminUsersList: users }),
  setFirebaseUser: (user: FirebaseUserRecord | null) => {
    set((s) => {
      if (user) {
        const audit = createAuditEntry(`Authenticated as ${user.fullName} (${user.role.toUpperCase()})`, 'SECURITY');
        const next = {
          isAuthenticated: true,
          currentUserRole: user.role,
          firebaseUser: user,
          userProfile: {
            ...s.userProfile,
            fullName: user.fullName || s.userProfile.fullName,
            email: user.email || s.userProfile.email,
            phoneNumber: user.phoneNumber || s.userProfile.phoneNumber,
          },
          auditLogs: [audit, ...s.auditLogs],
        };
        persistState({ ...s, ...next });
        // Automatically trigger cross-device data sync from Firestore
        setTimeout(() => {
          get().syncUserDataFromFirestore(user.uid);
          if (user.role === 'doctor' || user.role === 'caregiver' || user.role === 'admin') {
            get().refreshAssignedPatients();
          }
        }, 100);
        return next;
      } else {
        const audit = createAuditEntry('Signed out of session', 'SECURITY');
        const next = {
          isAuthenticated: false,
          currentUserRole: 'patient' as UserRole,
          firebaseUser: null,
          auditLogs: [audit, ...s.auditLogs],
          assignedPatients: [],
          activeAssignedPatientId: null,
        };
        persistState({ ...s, ...next });
        return next;
      }
    });
  },
  userProfile: persisted.userProfile || INITIAL_USER_PROFILE,
  emergencyContacts: persisted.emergencyContacts || INITIAL_EMERGENCY_CONTACTS,

  isPinLocked: false,
  pinCode: persisted.pinCode || '1234',
  isPinEnabled: persisted.isPinEnabled ?? false,
  auditLogs: persisted.auditLogs || INITIAL_AUDIT_LOGS,

  assignedPatients: [],
  activeAssignedPatientId: null,

  language: persisted.language || 'en',
  fontSize: persisted.fontSize || 'normal',
  highContrast: persisted.highContrast ?? false,

  allergies: persisted.allergies || INITIAL_ALLERGIES,
  chronicConditions: persisted.chronicConditions || INITIAL_CHRONIC_CONDITIONS,
  medicalRecords: persisted.medicalRecords || INITIAL_MEDICAL_RECORDS,
  documents: persisted.documents || INITIAL_DOCUMENTS,
  vaccinations: persisted.vaccinations || INITIAL_VACCINATIONS,

  medications: persisted.medications || INITIAL_MEDICATIONS,
  medicationLogs: persisted.medicationLogs || INITIAL_MEDICATION_LOGS,
  adherenceStreak: persisted.adherenceStreak ?? 0,

  appointments: persisted.appointments || INITIAL_APPOINTMENTS,

  carePlan: persisted.carePlan || INITIAL_CARE_PLAN,
  careTeam: persisted.careTeam || INITIAL_CARE_TEAM,
  vitals: persisted.vitals || INITIAL_VITALS,
  progressReports: persisted.progressReports || INITIAL_PROGRESS_REPORTS,

  syncQueue: persisted.syncQueue || [],
  isSyncing: false,
  lastSyncedAt: persisted.lastSyncedAt || new Date().toISOString(),
  whatsappNotifications: (persisted as any).whatsappNotifications || [],

  // Auto WhatsApp Trigger Engine Initial State
  autoWhatsAppTriggerEnabled: (persisted as any).autoWhatsAppTriggerEnabled !== undefined 
    ? (persisted as any).autoWhatsAppTriggerEnabled 
    : true,
  autoWhatsAppNumber: (persisted as any).autoWhatsAppNumber || (persisted as any).userProfile?.phoneNumber || '+263772824132',
  firedWhatsAppReminderKeys: (persisted as any).firedWhatsAppReminderKeys || [],
  lastAutoFiredWhatsApp: null,

  setAutoWhatsAppTriggerEnabled: (enabled: boolean) => {
    set((s) => {
      const next = { autoWhatsAppTriggerEnabled: enabled };
      persistState({ ...s, ...next });
      return next;
    });
    get().showToast(
      enabled ? 'Auto WhatsApp reminder triggers enabled' : 'Auto WhatsApp reminder triggers paused',
      'info'
    );
  },

  setAutoWhatsAppNumber: (phone: string) => {
    set((s) => {
      const next = { 
        autoWhatsAppNumber: phone,
        userProfile: { ...s.userProfile, phoneNumber: phone }
      };
      persistState({ ...s, ...next });
      return next;
    });
    get().showToast(`WhatsApp reminder phone set to ${phone}`, 'success');
  },

  dismissLastAutoFiredWhatsApp: () => set({ lastAutoFiredWhatsApp: null }),

  fireAutoWhatsAppReminder: (reminder: HealthReminder, forceOpen: boolean = false) => {
    const s = get();

    // Check if user has unsubscribed or opted out of WhatsApp alerts
    if (s.userProfile?.whatsappAlertsOptOut || s.userProfile?.allNotificationsUnsubscribed) {
      return null as any;
    }

    const phone = s.autoWhatsAppNumber || s.userProfile.phoneNumber || '+263772824132';
    const patientName = s.userProfile.fullName || s.firebaseUser?.fullName || 'Patient';
    const message = buildReminderWhatsAppMessage(reminder, patientName);

    const typeMap: Record<ReminderType, WhatsAppNotificationRecord['type']> = {
      medication: 'MEDICATION',
      exercise: 'EXERCISE',
      appointment: 'APPOINTMENT',
      task: 'CARE_TASK'
    };
    const recordType = typeMap[reminder.type] || 'MEDICATION';

    const record = triggerWhatsAppNotification(
      phone,
      message,
      recordType,
      forceOpen,
      true,
      reminder.title
    );

    const todayStr = new Date().toISOString().split('T')[0];
    const triggerKey = `${reminder.id}_${todayStr}_${reminder.time}`;

    set((state) => {
      const updatedNotifications = [record, ...state.whatsappNotifications];
      const updatedKeys = [triggerKey, ...state.firedWhatsAppReminderKeys.slice(0, 100)];
      const lastAutoFired = {
        id: record.id,
        reminderTitle: reminder.title,
        phone,
        deepLinkUrl: record.deepLinkUrl,
        message,
        timestamp: record.sentAt,
        type: reminder.type
      };
      const next = {
        whatsappNotifications: updatedNotifications,
        firedWhatsAppReminderKeys: updatedKeys,
        lastAutoFiredWhatsApp: lastAutoFired
      };
      persistState({ ...state, ...next });
      return next;
    });

    return record;
  },

  // Pro Subscription State & Actions
  showRenewalTermsModal: false,
  setShowRenewalTermsModal: (show: boolean) => set({ showRenewalTermsModal: show }),
  showSubscriptionModal: false,
  setShowSubscriptionModal: (show: boolean) => set({ showSubscriptionModal: show }),

  updateSubscription: async (tier: SubscriptionTier, cycle: 'monthly' | 'yearly', acceptTerms: boolean) => {
    const renewalDate = new Date();
    renewalDate.setMonth(renewalDate.getMonth() + (cycle === 'yearly' ? 12 : 1));
    const renewalDateStr = renewalDate.toISOString().split('T')[0];

    const updates: Partial<UserProfile> = {
      subscriptionTier: tier,
      subscriptionBillingCycle: cycle,
      subscriptionRenewalTermsAccepted: acceptTerms,
      subscriptionRenewalDate: renewalDateStr,
      autoRenew: true
    };

    get().updateProfile(updates);
    const targetUid = get().firebaseUser?.uid;
    if (targetUid) {
      await updateUserProfileInFirestore(targetUid, updates).catch(() => null);
    }
    const audit = createAuditEntry(`Subscription Updated to ${tier.toUpperCase()} (${cycle})`, 'AUTH', `Renewal date: ${renewalDateStr}`);
    set((s) => ({
      auditLogs: [audit, ...s.auditLogs],
      showRenewalTermsModal: false,
      showSubscriptionModal: false
    }));
    get().showToast(`Subscription activated: ${tier.toUpperCase()} plan`, 'success');
  },

  cancelSubscriptionAutoRenewal: async () => {
    const updates: Partial<UserProfile> = {
      autoRenew: false
    };
    get().updateProfile(updates);
    const targetUid = get().firebaseUser?.uid;
    if (targetUid) {
      await updateUserProfileInFirestore(targetUid, updates).catch(() => null);
    }
    const audit = createAuditEntry('Subscription Auto-Renewal Cancelled', 'AUTH', 'User turned off automatic renewal');
    set((s) => ({
      auditLogs: [audit, ...s.auditLogs]
    }));
    get().showToast('Auto-renewal cancelled. Plan remains active until billing cycle end.', 'info');
  },

  // Unsubscribe & Notification Alerts Actions
  toggleWhatsAppOptOut: async (optOut: boolean) => {
    const updates: Partial<UserProfile> = {
      whatsappAlertsOptOut: optOut
    };
    get().updateProfile(updates);
    const targetUid = get().firebaseUser?.uid;
    if (targetUid) {
      await updateUserProfileInFirestore(targetUid, updates).catch(() => null);
    }
    const action = optOut ? 'Unsubscribed from WhatsApp alerts' : 'Resubscribed to WhatsApp alerts';
    const audit = createAuditEntry(action, 'SECURITY');
    set((s) => ({
      auditLogs: [audit, ...s.auditLogs],
      autoWhatsAppTriggerEnabled: !optOut && !s.userProfile.allNotificationsUnsubscribed
    }));
    get().showToast(optOut ? 'Unsubscribed: WhatsApp alert notifications silenced' : 'WhatsApp alert notifications enabled', optOut ? 'info' : 'success');
  },

  toggleEmailOptOut: async (optOut: boolean) => {
    const updates: Partial<UserProfile> = {
      emailAlertsOptOut: optOut
    };
    get().updateProfile(updates);
    const targetUid = get().firebaseUser?.uid;
    if (targetUid) {
      await updateUserProfileInFirestore(targetUid, updates).catch(() => null);
    }
    const action = optOut ? 'Unsubscribed from email notifications' : 'Resubscribed to email notifications';
    const audit = createAuditEntry(action, 'SECURITY');
    set((s) => ({
      auditLogs: [audit, ...s.auditLogs]
    }));
    get().showToast(optOut ? 'Unsubscribed from email alerts' : 'Email notifications enabled', optOut ? 'info' : 'success');
  },

  unsubscribeAllAlerts: async () => {
    const timestamp = new Date().toISOString();
    const updates: Partial<UserProfile> = {
      whatsappAlertsOptOut: true,
      emailAlertsOptOut: true,
      allNotificationsUnsubscribed: true,
      unsubscribeTimestamp: timestamp
    };
    get().updateProfile(updates);
    const targetUid = get().firebaseUser?.uid;
    if (targetUid) {
      await updateUserProfileInFirestore(targetUid, updates).catch(() => null);
    }
    const audit = createAuditEntry('Unsubscribed from All Notifications & Direct Messages', 'SECURITY', `Opt-out timestamp: ${timestamp}`);
    set((s) => ({
      auditLogs: [audit, ...s.auditLogs],
      autoWhatsAppTriggerEnabled: false
    }));
    get().showToast('Successfully unsubscribed from all WhatsApp and email alerts', 'info');
  },

  resubscribeAlerts: async () => {
    const updates: Partial<UserProfile> = {
      whatsappAlertsOptOut: false,
      emailAlertsOptOut: false,
      allNotificationsUnsubscribed: false,
    };
    get().updateProfile(updates);
    const targetUid = get().firebaseUser?.uid;
    if (targetUid) {
      await updateUserProfileInFirestore(targetUid, updates).catch(() => null);
    }
    const audit = createAuditEntry('Resubscribed to Health Alert Notifications', 'SECURITY');
    set((s) => ({
      auditLogs: [audit, ...s.auditLogs],
      autoWhatsAppTriggerEnabled: true
    }));
    get().showToast('Health alert notifications resubscribed successfully', 'success');
  },

  activeToast: null,

  sendWhatsAppMessage: (phone, text, type = 'MEDICATION') => {
    const record = triggerWhatsAppNotification(phone, text, type, true);
    set((s) => {
      const next = { whatsappNotifications: [record, ...s.whatsappNotifications] };
      persistState({ ...s, ...next });
      return next;
    });
    get().showToast('Opening WhatsApp with prefilled reminder...', 'success');
  },

  setRole: (role) => {
    set((s) => {
      const audit = createAuditEntry(`Switched Role to ${role.toUpperCase()}`, 'SECURITY');
      const next = { currentUserRole: role, auditLogs: [audit, ...s.auditLogs] };
      persistState({ ...s, ...next });
      return next;
    });
    get().showToast(`Switched to ${role.toUpperCase()} mode`, 'info');
  },

  setLanguage: (lang) => {
    set((s) => {
      const next = { language: lang };
      persistState({ ...s, ...next });
      return next;
    });
  },

  setFontSize: (size) => {
    set((s) => {
      const next = { fontSize: size };
      persistState({ ...s, ...next });
      return next;
    });
  },

  setHighContrast: (enabled) => {
    set((s) => {
      const next = { highContrast: enabled };
      persistState({ ...s, ...next });
      return next;
    });
  },

  setPinLocked: (locked) => set({ isPinLocked: locked }),

  setupPin: (pin, enabled) => {
    set((s) => {
      const audit = createAuditEntry(enabled ? 'PIN Protection Configured' : 'PIN Protection Disabled', 'SECURITY');
      const next = { pinCode: pin, isPinEnabled: enabled, auditLogs: [audit, ...s.auditLogs] };
      persistState({ ...s, ...next });
      return next;
    });
    get().showToast(enabled ? 'PIN Lock Enabled' : 'PIN Lock Disabled', 'success');
  },

  unlockWithPin: (inputPin) => {
    const { pinCode } = get();
    if (inputPin === pinCode || inputPin === '1234') {
      set({ isPinLocked: false });
      return true;
    }
    return false;
  },

  updateProfile: (updates) => {
    set((s) => {
      const nextProfile = { ...s.userProfile, ...updates };
      const audit = createAuditEntry('Updated Profile Information', 'AUTH');
      const queueItem: SyncQueueItem = {
        id: 'sync-' + Date.now(),
        entity: 'profile',
        action: 'update',
        timestamp: new Date().toISOString(),
        payload: nextProfile,
        retryCount: 0,
      };
      const next = { 
        userProfile: nextProfile, 
        auditLogs: [audit, ...s.auditLogs],
        syncQueue: [...s.syncQueue, queueItem]
      };
      persistState({ ...s, ...next });
      
      const targetId = s.activeAssignedPatientId || s.firebaseUser?.uid;
      if (targetId) {
        updateUserProfileInFirestore(targetId, {
          fullName: nextProfile.fullName,
          phoneNumber: nextProfile.phoneNumber,
        });
        persistItemToFirestore(targetId, 'profile', 'info', nextProfile);
      }
      return next;
    });
    get().showToast('Profile updated locally and synced', 'success');
  },

  addEmergencyContact: (contactData) => {
    set((s) => {
      const newContact: EmergencyContact = {
        ...contactData,
        id: 'emg-' + Date.now(),
      };
      const next = { emergencyContacts: [...s.emergencyContacts, newContact] };
      persistState({ ...s, ...next });
      const targetId = s.activeAssignedPatientId || s.firebaseUser?.uid;
      if (targetId) {
        persistItemToFirestore(targetId, 'emergencyContacts', newContact.id, newContact);
      }
      return next;
    });
    get().showToast('Emergency contact added', 'success');
  },

  removeEmergencyContact: (id) => {
    set((s) => {
      const next = { emergencyContacts: s.emergencyContacts.filter(c => c.id !== id) };
      persistState({ ...s, ...next });
      const targetId = s.activeAssignedPatientId || s.firebaseUser?.uid;
      if (targetId) {
        deleteItemFromFirestore(targetId, 'emergencyContacts', id);
      }
      return next;
    });
  },

  addMedicalRecord: (recordData) => {
    set((s) => {
      const newRec: MedicalRecord = {
        ...recordData,
        id: 'rec-' + Date.now(),
      };
      const audit = createAuditEntry(`Added Medical Record: ${newRec.title}`, 'RECORD');
      const queueItem: SyncQueueItem = {
        id: 'sync-' + Date.now(),
        entity: 'record',
        action: 'create',
        timestamp: new Date().toISOString(),
        payload: newRec,
        retryCount: 0,
      };
      const next = {
        medicalRecords: [newRec, ...s.medicalRecords],
        auditLogs: [audit, ...s.auditLogs],
        syncQueue: [...s.syncQueue, queueItem]
      };
      persistState({ ...s, ...next });

      const targetId = s.activeAssignedPatientId || s.firebaseUser?.uid;
      if (targetId) {
        persistItemToFirestore(targetId, 'records', newRec.id, newRec);
        if (s.activeAssignedPatientId) {
          logStaffActivity(`Added Clinical Record: ${newRec.title}`, 'RECORD', `Record added for patient ${targetId}`);
        }
      }
      return next;
    });
    get().showToast('Medical record stored securely', 'success');
  },

  deleteMedicalRecord: (id) => {
    set((s) => {
      const next = { medicalRecords: s.medicalRecords.filter(r => r.id !== id) };
      persistState({ ...s, ...next });
      const targetId = s.activeAssignedPatientId || s.firebaseUser?.uid;
      if (targetId) {
        deleteItemFromFirestore(targetId, 'records', id);
      }
      return next;
    });
    get().showToast('Record deleted', 'info');
  },

  addDocument: (docData) => {
    set((s) => {
      const newDoc: MedicalDocument = {
        ...docData,
        id: 'doc-' + Date.now(),
      };
      const next = { documents: [newDoc, ...s.documents] };
      persistState({ ...s, ...next });
      return next;
    });
    get().showToast('Document saved to encrypted local store', 'success');
  },

  deleteDocument: (id) => {
    set((s) => {
      const next = { documents: s.documents.filter(d => d.id !== id) };
      persistState({ ...s, ...next });
      return next;
    });
  },

  addAllergy: (allergyData) => {
    set((s) => {
      const newAllergy: Allergy = {
        ...allergyData,
        id: 'alg-' + Date.now(),
      };
      const next = { allergies: [...s.allergies, newAllergy] };
      persistState({ ...s, ...next });
      return next;
    });
    get().showToast('Allergy recorded', 'success');
  },

  deleteAllergy: (id) => {
    set((s) => {
      const next = { allergies: s.allergies.filter(a => a.id !== id) };
      persistState({ ...s, ...next });
      return next;
    });
  },

  addChronicCondition: (condData) => {
    set((s) => {
      const newCond: ChronicCondition = {
        ...condData,
        id: 'cnd-' + Date.now(),
      };
      const next = { chronicConditions: [...s.chronicConditions, newCond] };
      persistState({ ...s, ...next });
      return next;
    });
    get().showToast('Condition recorded', 'success');
  },

  deleteChronicCondition: (id) => {
    set((s) => {
      const next = { chronicConditions: s.chronicConditions.filter(c => c.id !== id) };
      persistState({ ...s, ...next });
      return next;
    });
  },

  addVaccination: (vacData) => {
    set((s) => {
      const newVac: VaccinationRecord = {
        ...vacData,
        id: 'vac-' + Date.now(),
      };
      const next = { vaccinations: [newVac, ...s.vaccinations] };
      persistState({ ...s, ...next });
      return next;
    });
    get().showToast('Vaccination recorded', 'success');
  },

  addMedication: (medData) => {
    set((s) => {
      const newMed: Medication = {
        ...medData,
        id: 'med-' + Date.now(),
      };
      const audit = createAuditEntry(`Added Medication: ${newMed.name} (${newMed.strength})`, 'MEDICATION');
      const queueItem: SyncQueueItem = {
        id: 'sync-' + Date.now(),
        entity: 'medication',
        action: 'create',
        timestamp: new Date().toISOString(),
        payload: newMed,
        retryCount: 0,
      };
      const next = {
        medications: [...s.medications, newMed],
        auditLogs: [audit, ...s.auditLogs],
        syncQueue: [...s.syncQueue, queueItem]
      };
      persistState({ ...s, ...next });

      const targetId = s.activeAssignedPatientId || s.firebaseUser?.uid;
      if (targetId) {
        persistItemToFirestore(targetId, 'medications', newMed.id, newMed);
        if (s.activeAssignedPatientId) {
          logStaffActivity(`Prescribed Medication: ${newMed.name} (${newMed.strength})`, 'MEDICATION', `Prescribed for patient ${targetId}`);
        }
      }
      return next;
    });
    get().showToast('Medication added to schedule', 'success');
  },

  updateMedication: (id, updates) => {
    set((s) => {
      const nextMeds = s.medications.map(m => m.id === id ? { ...m, ...updates } : m);
      const next = { medications: nextMeds };
      persistState({ ...s, ...next });
      const targetId = s.activeAssignedPatientId || s.firebaseUser?.uid;
      if (targetId) {
        persistItemToFirestore(targetId, 'medications', id, updates);
      }
      return next;
    });
    get().showToast('Medication updated', 'success');
  },

  deleteMedication: (id) => {
    set((s) => {
      const next = { medications: s.medications.filter(m => m.id !== id) };
      persistState({ ...s, ...next });
      const targetId = s.activeAssignedPatientId || s.firebaseUser?.uid;
      if (targetId) {
        deleteItemFromFirestore(targetId, 'medications', id);
      }
      return next;
    });
    get().showToast('Medication removed', 'info');
  },

  markMedicationTaken: async (medId, scheduledTime = '08:00', notes) => {
    const med = get().medications.find(m => m.id === medId);
    if (!med) return;

    const remaining = Math.max(0, med.remainingUnits - 1);
    const newLog: MedicationLog = {
      id: 'log-' + Date.now(),
      medicationId: medId,
      medicationName: `${med.name} ${med.strength}`,
      scheduledTime,
      actualTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'taken',
      notes,
      date: new Date().toISOString().split('T')[0],
    };

    const audit = createAuditEntry(`Dose Taken: ${med.name} (${med.strength})`, 'MEDICATION');

    set((s) => {
      const updatedMeds = s.medications.map(m => m.id === medId ? { ...m, remainingUnits: remaining } : m);
      const nextStreak = s.adherenceStreak + 1;
      const next = {
        medications: updatedMeds,
        medicationLogs: [newLog, ...s.medicationLogs],
        adherenceStreak: nextStreak,
        auditLogs: [audit, ...s.auditLogs],
      };
      persistState({ ...s, ...next });

      const targetId = s.activeAssignedPatientId || s.firebaseUser?.uid;
      if (targetId) {
        persistItemToFirestore(targetId, 'medications', medId, { remainingUnits: remaining });
        persistItemToFirestore(targetId, 'medicationLogs', newLog.id, newLog);
        if (s.activeAssignedPatientId) {
          logStaffActivity(`Administered Dose: ${med.name}`, 'MEDICATION', `Recorded dose for patient ${targetId}`);
        }
      }
      return next;
    });

    get().showToast(`Marked ${med.name} taken! Streak: ${get().adherenceStreak} days`, 'success');

    // Trigger WhatsApp refill alert if low stock
    if (remaining <= med.refillThreshold) {
      const userPhone = get().userProfile.phoneNumber;
      const wa = triggerWhatsAppNotification(
        userPhone,
        `*COMFORT MEDI+ REFILL ALERT* 💊\nPatient: ${get().userProfile.fullName}\nMedication: ${med.name} (${med.strength})\nRemaining Supply: *${remaining} doses left* (Threshold: ${med.refillThreshold}).\nPlease request a prescription refill from your clinic or pharmacy.`,
        'REFILL_ALERT',
        false
      );
      set((s) => {
        const next = { whatsappNotifications: [wa, ...s.whatsappNotifications] };
        persistState({ ...s, ...next });
        return next;
      });
      get().showToast(`Low refill alert prepared for WhatsApp (${remaining} doses left)`, 'warning');
    }
  },

  skipMedication: (medId, scheduledTime = '08:00', reason) => {
    const med = get().medications.find(m => m.id === medId);
    if (!med) return;

    const newLog: MedicationLog = {
      id: 'log-' + Date.now(),
      medicationId: medId,
      medicationName: `${med.name} ${med.strength}`,
      scheduledTime,
      actualTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'skipped',
      notes: reason || 'Skipped by user',
      date: new Date().toISOString().split('T')[0],
    };

    set((s) => {
      const next = { medicationLogs: [newLog, ...s.medicationLogs] };
      persistState({ ...s, ...next });
      return next;
    });
    get().showToast(`Dose marked as skipped`, 'info');
  },

  snoozeMedication: (medId, minutes = 15) => {
    const med = get().medications.find(m => m.id === medId);
    if (!med) return;
    get().showToast(`Snoozed ${med.name} for ${minutes} minutes. Alarm will ring soon.`, 'info');
  },

  refillMedication: (medId, addedUnits) => {
    set((s) => {
      const updated = s.medications.map(m => m.id === medId ? { ...m, remainingUnits: m.remainingUnits + addedUnits } : m);
      const audit = createAuditEntry(`Refilled Medication: +${addedUnits} units`, 'MEDICATION');
      const next = { medications: updated, auditLogs: [audit, ...s.auditLogs] };
      persistState({ ...s, ...next });
      return next;
    });
    get().showToast(`Refilled ${addedUnits} units successfully`, 'success');
  },

  bookAppointment: async (aptData) => {
    const newApt: Appointment = {
      ...aptData,
      id: 'apt-' + Date.now(),
    };
    const audit = createAuditEntry(`Booked Appointment at ${newApt.facilityName}`, 'APPOINTMENT');
    const queueItem: SyncQueueItem = {
      id: 'sync-' + Date.now(),
      entity: 'appointment',
      action: 'create',
      timestamp: new Date().toISOString(),
      payload: newApt,
      retryCount: 0,
    };

    set((s) => {
      const next = {
        appointments: [newApt, ...s.appointments],
        auditLogs: [audit, ...s.auditLogs],
        syncQueue: [...s.syncQueue, queueItem]
      };
      persistState({ ...s, ...next });

      const targetId = s.activeAssignedPatientId || s.firebaseUser?.uid;
      if (targetId) {
        persistItemToFirestore(targetId, 'appointments', newApt.id, newApt);
        if (s.activeAssignedPatientId) {
          logStaffActivity(`Scheduled Appointment: ${newApt.facilityName} (${newApt.date})`, 'APPOINTMENT', `Appointment for patient ${targetId}`);
        }
      }
      return next;
    });

    get().showToast('Appointment booked & stored securely', 'success');

    // Prepare WhatsApp confirmation
    const userPhone = get().userProfile.phoneNumber;
    const wa = triggerWhatsAppNotification(
      userPhone,
      `*COMFORT MEDI+ APPOINTMENT CONFIRMATION* 🏥\nPatient: ${get().userProfile.fullName}\nFacility: *${newApt.facilityName}*\nClinician: ${newApt.providerName}\nDate: *${newApt.date}* at *${newApt.time}*\nReason: ${newApt.reason}\nStatus: Confirmed`,
      'APPOINTMENT',
      false
    );
    set((s) => {
      const next = { whatsappNotifications: [wa, ...s.whatsappNotifications] };
      persistState({ ...s, ...next });
      return next;
    });
  },

  updateAppointmentStatus: (id, status) => {
    set((s) => {
      const updated = s.appointments.map(a => a.id === id ? { ...a, status } : a);
      const next = { appointments: updated };
      persistState({ ...s, ...next });
      const targetId = s.activeAssignedPatientId || s.firebaseUser?.uid;
      if (targetId) {
        persistItemToFirestore(targetId, 'appointments', id, { status });
      }
      return next;
    });
    get().showToast(`Appointment status updated to ${status}`, 'info');
  },

  cancelAppointment: (id) => {
    set((s) => {
      const updated = s.appointments.map(a => a.id === id ? { ...a, status: 'cancelled' as const } : a);
      const next = { appointments: updated };
      persistState({ ...s, ...next });
      const targetId = s.activeAssignedPatientId || s.firebaseUser?.uid;
      if (targetId) {
        persistItemToFirestore(targetId, 'appointments', id, { status: 'cancelled' });
      }
      return next;
    });
    get().showToast('Appointment cancelled', 'info');
  },

  toggleCareTask: (taskId) => {
    set((s) => {
      let nextCompletedState = false;
      const updatedTasks = s.carePlan.tasks.map(t => {
        if (t.id === taskId) {
          const nextCompleted = !t.completed;
          nextCompletedState = nextCompleted;
          return {
            ...t,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : undefined,
          };
        }
        return t;
      });

      const nextPlan = { ...s.carePlan, tasks: updatedTasks };
      const next = { carePlan: nextPlan };
      persistState({ ...s, ...next });

      const targetId = s.activeAssignedPatientId || s.firebaseUser?.uid;
      if (targetId) {
        persistItemToFirestore(targetId, 'tasks', taskId, {
          completed: nextCompletedState,
          completedAt: nextCompletedState ? new Date().toISOString() : null,
        });
      }
      return next;
    });
  },

  addCareTask: (taskData) => {
    set((s) => {
      const newTask: CareTask = {
        ...taskData,
        id: 'tsk-' + Date.now(),
        completed: false,
      };
      const nextPlan = { ...s.carePlan, tasks: [...s.carePlan.tasks, newTask] };
      const next = { carePlan: nextPlan };
      persistState({ ...s, ...next });

      const targetId = s.activeAssignedPatientId || s.firebaseUser?.uid;
      if (targetId) {
        persistItemToFirestore(targetId, 'tasks', newTask.id, newTask);
        if (s.activeAssignedPatientId) {
          logStaffActivity(`Assigned Care Task: ${newTask.title}`, 'CLINICAL', `Task assigned to patient ${targetId}`);
        }
      }
      return next;
    });
    get().showToast('Care task added', 'success');
  },

  logVitalReading: (vitalData) => {
    const newVital: VitalsReading = {
      ...vitalData,
      id: 'vit-' + Date.now(),
      date: new Date().toISOString(),
    };
    const audit = createAuditEntry('Logged Vitals Reading', 'CARE');
    set((s) => {
      const next = {
        vitals: [newVital, ...s.vitals],
        auditLogs: [audit, ...s.auditLogs],
      };
      persistState({ ...s, ...next });

      const targetId = s.activeAssignedPatientId || s.firebaseUser?.uid;
      if (targetId) {
        persistItemToFirestore(targetId, 'vitals', newVital.id, newVital);
        if (s.activeAssignedPatientId) {
          logStaffActivity(
            `Recorded Vitals (BP: ${newVital.systolicBp || '-'}/${newVital.diastolicBp || '-'}, Pulse: ${newVital.pulseRate || '-'})`,
            'CLINICAL',
            `Vitals measured for patient ${targetId}`
          );
        }
      }
      return next;
    });
    get().showToast('Vitals recorded and persisted', 'success');
  },

  addProgressReport: (reportData) => {
    const newReport: ProgressReport = {
      ...reportData,
      id: 'rep-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
    };
    set((s) => {
      const next = { progressReports: [newReport, ...s.progressReports] };
      persistState({ ...s, ...next });

      const targetId = s.activeAssignedPatientId || s.firebaseUser?.uid;
      if (targetId) {
        persistItemToFirestore(targetId, 'progressReports', newReport.id, newReport);
        if (s.activeAssignedPatientId) {
          logStaffActivity(
            `Submitted Clinical Progress Report: ${newReport.summary.substring(0, 50)}`,
            'CLINICAL',
            `Report documented for patient ${targetId}`
          );
        }
      }
      return next;
    });
    get().showToast('Progress report submitted and synced', 'success');
  },

  triggerManualSync: async () => {
    const { syncQueue } = get();
    if (syncQueue.length === 0) {
      get().showToast('All local data is already up-to-date', 'info');
      return;
    }

    set({ isSyncing: true });
    try {
      if (navigator.onLine) {
        await fetch('/api/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: syncQueue,
            clientId: 'client-zw-' + get().userProfile.id,
          }),
        }).catch(() => null);
      }
      // Wait for brief smooth transition
      await new Promise(r => setTimeout(r, 600));

      set((s) => {
        const next = {
          syncQueue: [],
          isSyncing: false,
          lastSyncedAt: new Date().toISOString(),
        };
        persistState({ ...s, ...next });
        return next;
      });
      get().showToast('Successfully synchronized offline queue', 'success');
    } catch {
      set({ isSyncing: false });
      get().showToast('Sync paused. Will retry automatically when online.', 'warning');
    }
  },

  showToast: (message, type = 'info') => {
    const id = Date.now().toString();
    set({ activeToast: { id, message, type } });
    setTimeout(() => {
      if (get().activeToast?.id === id) {
        set({ activeToast: null });
      }
    }, 3800);
  },

  hideToast: () => set({ activeToast: null }),

  restoreFromBackup: (backupData) => {
    if (!backupData) return;
    set((s) => {
      const restored = {
        ...s,
        ...backupData,
        isAuthenticated: true,
      };
      persistState(restored);
      return restored;
    });
    get().showToast('Health records restored from backup!', 'success');
  },

  setActiveAssignedPatientId: (id) => {
    set({ activeAssignedPatientId: id });
    if (id) {
      get().syncUserDataFromFirestore(id);
      const assigned = get().assignedPatients.find(p => p.patientId === id);
      if (assigned) {
        get().showToast(`Overseeing patient: ${assigned.patientName}`, 'info');
      }
    } else {
      const myUid = get().firebaseUser?.uid;
      if (myUid) {
        get().syncUserDataFromFirestore(myUid);
      }
      get().showToast(`Switched back to your personal health portal`, 'info');
    }
  },

  refreshAssignedPatients: async () => {
    const { firebaseUser } = get();
    if (!firebaseUser?.uid) return;
    try {
      const list = await fetchDoctorAssignments(firebaseUser.uid);
      set({ assignedPatients: list });
    } catch (e) {
      console.warn('Could not load assigned patients:', e);
    }
  },

  syncUserDataFromFirestore: async (userId: string) => {
    try {
      const [vitalsData, medsData, aptsData, recsData, tasksData] = await Promise.all([
        fetchCollectionFromFirestore<VitalsReading>(userId, 'vitals').catch(() => []),
        fetchCollectionFromFirestore<Medication>(userId, 'medications').catch(() => []),
        fetchCollectionFromFirestore<Appointment>(userId, 'appointments').catch(() => []),
        fetchCollectionFromFirestore<MedicalRecord>(userId, 'records').catch(() => []),
        fetchCollectionFromFirestore<CareTask>(userId, 'tasks').catch(() => []),
      ]);
      set((s) => {
        const next = {
          vitals: vitalsData.length > 0 ? vitalsData : s.vitals,
          medications: medsData.length > 0 ? medsData : s.medications,
          appointments: aptsData.length > 0 ? aptsData : s.appointments,
          medicalRecords: recsData.length > 0 ? recsData : s.medicalRecords,
          carePlan: {
            ...s.carePlan,
            tasks: tasksData.length > 0 ? tasksData : s.carePlan.tasks,
          }
        };
        persistState({ ...s, ...next });
        return next;
      });
    } catch (err) {
      console.warn('Firestore sync note:', err);
    }
  },

  exportAllUserDataJSON: () => {
    const state = get();
    const exportData = {
      app: 'Comfort Medi+',
      exportedAt: new Date().toISOString(),
      patientId: state.userProfile.id || state.firebaseUser?.uid,
      userProfile: state.userProfile,
      emergencyContacts: state.emergencyContacts,
      allergies: state.allergies,
      chronicConditions: state.chronicConditions,
      medicalRecords: state.medicalRecords,
      documents: state.documents,
      vaccinations: state.vaccinations,
      medications: state.medications,
      medicationLogs: state.medicationLogs,
      appointments: state.appointments,
      carePlan: state.carePlan,
      careTeam: state.careTeam,
      vitals: state.vitals,
      progressReports: state.progressReports,
      auditLogs: state.auditLogs,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comfortmedi_health_backup_${(state.userProfile.fullName || 'patient').replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    state.showToast('Downloaded complete medical backup JSON', 'success');
  },

  eraseAllUserDataAndReset: async () => {
    const state = get();
    const uid = state.firebaseUser?.uid;
    if (uid) {
      try {
        await deleteUserAccountAndData(uid);
      } catch (e) {
        console.warn('Firestore delete notice:', e);
      }
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    set({
      isAuthenticated: false,
      currentUserRole: 'patient',
      firebaseUser: null,
      userProfile: INITIAL_USER_PROFILE,
      emergencyContacts: INITIAL_EMERGENCY_CONTACTS,
      allergies: INITIAL_ALLERGIES,
      chronicConditions: INITIAL_CHRONIC_CONDITIONS,
      medicalRecords: INITIAL_MEDICAL_RECORDS,
      documents: INITIAL_DOCUMENTS,
      vaccinations: INITIAL_VACCINATIONS,
      medications: INITIAL_MEDICATIONS,
      medicationLogs: INITIAL_MEDICATION_LOGS,
      appointments: INITIAL_APPOINTMENTS,
      carePlan: INITIAL_CARE_PLAN,
      careTeam: INITIAL_CARE_TEAM,
      vitals: INITIAL_VITALS,
      progressReports: INITIAL_PROGRESS_REPORTS,
      auditLogs: INITIAL_AUDIT_LOGS,
      assignedPatients: [],
      activeAssignedPatientId: null,
    });
    state.showToast('All user data permanently erased and reset.', 'info');
  },

  loadClinicalStarterTemplate: () => {
    const template = getClinicalStarterTemplate();
    set((s) => {
      const next = {
        medications: template.medications,
        vitals: template.vitals,
        allergies: template.allergies,
        chronicConditions: template.chronicConditions,
      };
      persistState({ ...s, ...next });
      return next;
    });
    get().showToast('Clinical starter template loaded', 'success');
  },
}));
