export type UserRole = 'patient' | 'caregiver' | 'doctor' | 'admin';

export interface FirebaseUserRecord {
  uid: string;
  email?: string;
  phoneNumber?: string;
  fullName: string;
  role: UserRole;
  authProvider: 'google' | 'password' | 'phone';
  createdAt?: string;
  updatedAt?: string;
}

export type Language = 'en' | 'sn' | 'nd'; // English, Shona, Ndebele

export type FontSize = 'normal' | 'large' | 'xlarge';

export interface UserProfile {
  id: string;
  fullName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  nationalId: string;
  passportNumber?: string;
  phoneNumber: string;
  email: string;
  address: string;
  city: string;
  province: string;
  profilePhoto?: string;
  occupation: string;
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  nationality: string;
  languagePreference: Language;
  
  // Medical overview
  bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'Unknown';
  rhesusFactor: '+' | '-' | 'Unknown';
  heightCm: number;
  weightKg: number;
  bmi: number;
  organDonor: boolean;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  primaryHealthcareProvider: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phoneNumber: string;
  alternativePhone?: string;
  address: string;
  priorityLevel: 1 | 2 | 3;
  emergencyNotes?: string;
}

export interface Allergy {
  id: string;
  allergen: string;
  category: 'food' | 'drug' | 'environmental';
  severity: 'mild' | 'moderate' | 'severe' | 'life-threatening';
  reaction: string;
  diagnosedDate?: string;
}

export interface ChronicCondition {
  id: string;
  conditionName: string;
  diagnosedDate: string;
  severity: 'controlled' | 'mild' | 'moderate' | 'severe';
  treatmentRegimen: string;
  treatingDoctor?: string;
  notes?: string;
}

export interface MedicalRecord {
  id: string;
  type: 'diagnosis' | 'treatment' | 'admission' | 'surgery' | 'procedure' | 'referral' | 'discharge';
  title: string;
  date: string;
  conditionOrReason: string;
  provider: string;
  facility: string;
  outcome?: string;
  notes: string;
  attachments?: MedicalDocument[];
}

export interface MedicalDocument {
  id: string;
  recordId?: string;
  title: string;
  type: 'prescription' | 'lab_result' | 'referral_letter' | 'discharge_summary' | 'medical_certificate' | 'insurance_document' | 'other';
  fileFormat: 'pdf' | 'jpeg' | 'png';
  fileUrl: string; // base64 or object url for offline
  uploadDate: string;
  fileSizeBytes: number;
  notes?: string;
}

export interface VaccinationRecord {
  id: string;
  vaccineName: string;
  dateGiven: string;
  boosterDate?: string;
  provider: string;
  batchNumber: string;
  nextDueDate?: string;
  notes?: string;
}

export interface MedicalNote {
  id: string;
  authorType: 'doctor' | 'personal' | 'caregiver';
  authorName: string;
  date: string;
  content: string;
  isPinned?: boolean;
}

export interface Medication {
  id: string;
  name: string;
  genericName: string;
  brandName?: string;
  strength: string; // e.g. 500mg, 10ml
  dosage: string; // e.g. 1 tablet, 2 puffs
  route: 'oral' | 'injection' | 'inhaler' | 'topical' | 'eye_ear_drops';
  frequency: 'once_daily' | 'twice_daily' | 'thrice_daily' | 'four_times_daily' | 'weekly' | 'as_needed';
  purpose: string; // e.g. Hypertension, Blood pressure control
  instructions: string; // e.g. Take after meal with plenty of water
  startDate: string;
  endDate?: string;
  prescribingDoctor: string;
  scheduledTimes: string[]; // ['08:00', '20:00']
  remainingUnits: number;
  totalPrescribedUnits: number;
  refillThreshold: number; // e.g. 10
  refillDate?: string;
  expiryDate?: string;
  active: boolean;
}

export interface MedicationLog {
  id: string;
  medicationId: string;
  medicationName: string;
  scheduledTime: string;
  actualTime?: string;
  status: 'taken' | 'skipped' | 'snoozed' | 'rescheduled';
  notes?: string;
  date: string; // YYYY-MM-DD
}

export interface Facility {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'pharmacy' | 'laboratory' | 'specialist' | 'home_care';
  province: string;
  city: string;
  address: string;
  phone: string;
  operatingHours: string;
  hasEmergency24_7: boolean;
  services: string[];
  specialties: string[];
}

export interface Appointment {
  id: string;
  facilityId: string;
  facilityName: string;
  appointmentType: 'general_consultation' | 'follow_up' | 'vaccination' | 'lab_test' | 'specialist' | 'mental_health' | 'home_visit' | 'telehealth';
  date: string;
  time: string;
  providerName: string;
  reason: string;
  notes?: string;
  status: 'booked' | 'confirmed' | 'checked_in' | 'completed' | 'cancelled' | 'rescheduled';
  isWaitingList?: boolean;
}

export interface VitalsReading {
  id: string;
  date: string; // ISO
  temperature?: number; // deg C
  systolicBp?: number; // mmHg
  diastolicBp?: number; // mmHg
  pulseRate?: number; // bpm
  respiratoryRate?: number; // bpm
  bloodSugar?: number; // mmol/L
  weightKg?: number;
  oxygenSaturation?: number; // %
  painLevel?: number; // 0-10
  mood?: 'great' | 'good' | 'neutral' | 'low' | 'distressed';
  sleepHours?: number;
  notes?: string;
  recordedBy: string; // e.g. "Self" or "Nurse Chipo"
}

export interface CareTask {
  id: string;
  title: string;
  category: 'medication' | 'meal' | 'exercise' | 'mobility' | 'wound_care' | 'hygiene' | 'vitals' | 'custom';
  timeOfDay: string; // '08:00'
  assignedTo: string; // 'Tendai (Caregiver)'
  completed: boolean;
  completedAt?: string;
  notes?: string;
}

export interface CareTeamMember {
  id: string;
  name: string;
  role: 'Family Member' | 'Caregiver' | 'Nurse' | 'Doctor' | 'Therapist' | 'Community Health Worker';
  phone: string;
  email?: string;
  notes?: string;
}

export interface ProgressReport {
  id: string;
  date: string;
  authorName: string;
  authorRole: string;
  summary: string;
  observations: string;
  incidents?: string;
  photoUrl?: string;
}

export interface HomeCarePlan {
  id: string;
  title: string;
  period: 'daily' | 'weekly' | 'monthly' | 'long_term';
  startDate: string;
  endDate?: string;
  goals: string[];
  tasks: CareTask[];
}

export interface SyncQueueItem {
  id: string;
  entity: 'medication' | 'appointment' | 'record' | 'vital' | 'task' | 'profile';
  action: 'create' | 'update' | 'delete';
  timestamp: string;
  payload: any;
  retryCount: number;
}

export interface AuditLog {
  id: string;
  action: string;
  category: 'AUTH' | 'MEDICATION' | 'RECORD' | 'APPOINTMENT' | 'CARE' | 'SECURITY' | 'CLINICAL';
  timestamp: string;
  details?: string;
  actorId?: string;
  actorName?: string;
}

export interface PatientAssignment {
  id: string;
  doctorId: string;
  doctorName: string;
  patientId: string;
  patientName: string;
  assignedBy: string;
  assignedAt: string;
  status: 'active' | 'revoked';
  clinicalNotes?: string;
}

