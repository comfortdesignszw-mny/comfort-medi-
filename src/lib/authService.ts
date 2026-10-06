import { 
  auth, 
  db, 
  googleProvider, 
  handleFirestoreError, 
  OperationType 
} from './firebase';
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  User 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  collection, 
  getDocs,
  query,
  where
} from 'firebase/firestore';
import { FirebaseUserRecord, UserRole, PatientAssignment, AuditLog } from '../types';

export const ADMIN_EMAIL = 'comfort.designszw@gmail.com';

/**
 * Transforms a Zimbabwean or international phone number into a synthetic email for Firebase Auth.
 * Enables users to log in with Phone & Password on the UI while Firebase Auth handles it as credentials.
 */
export function formatPhoneToEmail(phone: string): string {
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('07') && cleaned.length === 10) {
    cleaned = '263' + cleaned.substring(1);
  } else if (cleaned.length === 9 && cleaned.startsWith('7')) {
    cleaned = '263' + cleaned;
  }
  return `phone_${cleaned}@comfortmedi.app`;
}

/**
 * Checks if a given email is the system super administrator.
 */
export function isSuperAdmin(email?: string | null): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

/**
 * Syncs user record with Firestore and assigns RBAC role.
 * comfort.designszw@gmail.com is always made Admin.
 * All other newly registered users default to Patient.
 */
export async function syncUserProfile(
  user: User, 
  metadata?: { fullName?: string; phoneNumber?: string; authProvider?: 'google' | 'password' | 'phone' }
): Promise<FirebaseUserRecord> {
  const userRef = doc(db, 'users', user.uid);
  const pathForDoc = `users/${user.uid}`;
  
  try {
    const userSnap = await getDoc(userRef);
    const isEmailAdmin = isSuperAdmin(user.email);
    
    if (userSnap.exists()) {
      const data = userSnap.data() as FirebaseUserRecord;
      // If user's email is comfort.designszw@gmail.com, enforce admin role
      if (isEmailAdmin && data.role !== 'admin') {
        await updateDoc(userRef, { role: 'admin', updatedAt: new Date().toISOString() });
        data.role = 'admin';
        // Also register in admins collection
        await setDoc(doc(db, 'admins', user.uid), {
          uid: user.uid,
          email: user.email,
          assignedAt: new Date().toISOString()
        }, { merge: true });
      }
      return data;
    }

    // New User Profile Creation
    const role: UserRole = isEmailAdmin ? 'admin' : 'patient';
    const newRecord: FirebaseUserRecord = {
      uid: user.uid,
      email: user.email || (metadata?.phoneNumber ? formatPhoneToEmail(metadata.phoneNumber) : ''),
      phoneNumber: metadata?.phoneNumber || user.phoneNumber || '',
      fullName: metadata?.fullName || user.displayName || (isEmailAdmin ? 'Comfort Designs Admin' : 'New Patient'),
      role,
      authProvider: metadata?.authProvider || (user.providerData[0]?.providerId === 'google.com' ? 'google' : 'password'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await setDoc(userRef, newRecord);

    if (isEmailAdmin) {
      await setDoc(doc(db, 'admins', user.uid), {
        uid: user.uid,
        email: user.email,
        assignedAt: new Date().toISOString()
      }, { merge: true });
    }

    return newRecord;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, pathForDoc);
  }
}

/**
 * Login Method 1: Google One-Click SSO
 */
export async function loginWithGoogle(): Promise<FirebaseUserRecord> {
  const cred = await signInWithPopup(auth, googleProvider);
  return await syncUserProfile(cred.user, {
    fullName: cred.user.displayName || undefined,
    authProvider: 'google'
  });
}

/**
 * Login Method 2: Email & Password
 */
export async function loginWithEmail(email: string, pass: string): Promise<FirebaseUserRecord> {
  const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
  return await syncUserProfile(cred.user);
}

export async function registerWithEmail(
  email: string, 
  pass: string, 
  fullName: string, 
  phone?: string
): Promise<FirebaseUserRecord> {
  const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
  return await syncUserProfile(cred.user, {
    fullName: fullName.trim(),
    phoneNumber: phone?.trim(),
    authProvider: 'password'
  });
}

/**
 * Login Method 3: Phone & Password
 * Uses phone as email ID under the hood with a clean phone UI.
 */
export async function loginWithPhone(phoneNumber: string, pass: string): Promise<FirebaseUserRecord> {
  const syntheticEmail = formatPhoneToEmail(phoneNumber);
  const cred = await signInWithEmailAndPassword(auth, syntheticEmail, pass);
  return await syncUserProfile(cred.user, {
    phoneNumber: phoneNumber.trim(),
    authProvider: 'phone'
  });
}

export async function registerWithPhone(
  phoneNumber: string, 
  pass: string, 
  fullName: string
): Promise<FirebaseUserRecord> {
  const syntheticEmail = formatPhoneToEmail(phoneNumber);
  const cred = await createUserWithEmailAndPassword(auth, syntheticEmail, pass);
  return await syncUserProfile(cred.user, {
    fullName: fullName.trim(),
    phoneNumber: phoneNumber.trim(),
    authProvider: 'phone'
  });
}

/**
 * Sign out
 */
export async function logout(): Promise<void> {
  await signOut(auth);
}

/**
 * Admin Action: Fetch all users for RBAC management
 */
export async function fetchAllUsers(): Promise<FirebaseUserRecord[]> {
  const pathForList = 'users';
  try {
    const snap = await getDocs(collection(db, 'users'));
    return snap.docs.map(d => d.data() as FirebaseUserRecord);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, pathForList);
  }
}

/**
 * Admin Action: Upgrade or modify user role (Patient, Caregiver, Doctor, Admin)
 */
export async function updateUserRole(targetUid: string, newRole: UserRole): Promise<void> {
  const pathForUpdate = `users/${targetUid}`;
  try {
    const userRef = doc(db, 'users', targetUid);
    await updateDoc(userRef, { 
      role: newRole,
      updatedAt: new Date().toISOString()
    });

    if (newRole === 'admin') {
      await setDoc(doc(db, 'admins', targetUid), {
        uid: targetUid,
        assignedAt: new Date().toISOString()
      }, { merge: true });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, pathForUpdate);
  }
}

/**
 * Patient Assignment Management (Admin assigns patients to doctors/clinicians)
 */
export async function assignPatientToDoctor(
  doctorId: string, 
  doctorName: string, 
  patientId: string, 
  patientName: string, 
  notes?: string
): Promise<PatientAssignment> {
  const assignmentId = `${doctorId}_${patientId}`;
  const path = `assignments/${assignmentId}`;
  try {
    const assignment: PatientAssignment = {
      id: assignmentId,
      doctorId,
      doctorName,
      patientId,
      patientName,
      assignedBy: auth.currentUser?.email || ADMIN_EMAIL,
      assignedAt: new Date().toISOString(),
      status: 'active',
      clinicalNotes: notes || ''
    };
    await setDoc(doc(db, 'assignments', assignmentId), assignment);
    
    // Log admin assignment action
    await logStaffActivity(
      `Assigned Patient ${patientName} to Dr. ${doctorName}`,
      'CLINICAL',
      notes || 'Clinical management authorization assigned by Admin'
    );
    
    return assignment;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function revokePatientAssignment(assignmentId: string): Promise<void> {
  const path = `assignments/${assignmentId}`;
  try {
    await updateDoc(doc(db, 'assignments', assignmentId), {
      status: 'revoked',
      revokedAt: new Date().toISOString()
    });
    await logStaffActivity(
      `Revoked Patient Assignment (${assignmentId})`,
      'CLINICAL',
      'Clinical oversight authorization revoked by Admin'
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function fetchAllAssignments(): Promise<PatientAssignment[]> {
  const path = 'assignments';
  try {
    const snap = await getDocs(collection(db, 'assignments'));
    return snap.docs.map(d => d.data() as PatientAssignment);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function fetchDoctorAssignments(doctorId: string): Promise<PatientAssignment[]> {
  const path = 'assignments';
  try {
    const q = query(
      collection(db, 'assignments'), 
      where('doctorId', '==', doctorId),
      where('status', '==', 'active')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data() as PatientAssignment);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

/**
 * Medical Staff Monitoring Audit Logs (Admin monitors clinical actions)
 */
export async function logStaffActivity(
  action: string, 
  category: 'AUTH' | 'CLINICAL' | 'MEDICATION' | 'RECORD' | 'APPOINTMENT' | 'SECURITY',
  details?: string
): Promise<void> {
  const logId = `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const path = `auditLogs/${logId}`;
  try {
    const log: AuditLog = {
      id: logId,
      action,
      category,
      timestamp: new Date().toISOString(),
      details: details || '',
      actorId: auth.currentUser?.uid || 'system',
      actorName: auth.currentUser?.displayName || auth.currentUser?.email || 'Authenticated User'
    };
    await setDoc(doc(db, 'auditLogs', logId), log);
  } catch (error) {
    // Audit log write failure is non-blocking to app UI
    console.warn('Audit log write notice:', error);
  }
}

export async function fetchStaffAuditLogs(): Promise<AuditLog[]> {
  const path = 'auditLogs';
  try {
    const snap = await getDocs(collection(db, 'auditLogs'));
    const logs = snap.docs.map(d => d.data() as AuditLog);
    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

/**
 * Scalable Firestore Clinical Data Persistence per Patient
 */
export async function persistItemToFirestore(
  userId: string, 
  subcollection: string, 
  itemId: string, 
  data: any
): Promise<void> {
  if (!userId) return;
  const path = `users/${userId}/${subcollection}/${itemId}`;
  try {
    await setDoc(doc(db, 'users', userId, subcollection, itemId), data, { merge: true });
  } catch (error) {
    console.warn(`Firestore write warning for ${path}:`, error);
  }
}

export async function deleteItemFromFirestore(
  userId: string, 
  subcollection: string, 
  itemId: string
): Promise<void> {
  if (!userId) return;
  const path = `users/${userId}/${subcollection}/${itemId}`;
  try {
    await deleteDoc(doc(db, 'users', userId, subcollection, itemId));
  } catch (error) {
    console.warn(`Firestore delete warning for ${path}:`, error);
  }
}

export async function updateUserProfileInFirestore(
  userId: string,
  data: Partial<FirebaseUserRecord>
): Promise<void> {
  if (!userId) return;
  const path = `users/${userId}`;
  try {
    await setDoc(doc(db, 'users', userId), {
      ...data,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.warn(`Firestore profile update warning for ${path}:`, error);
  }
}

export async function fetchCollectionFromFirestore<T>(
  userId: string, 
  subcollection: string
): Promise<T[]> {
  if (!userId) return [];
  const path = `users/${userId}/${subcollection}`;
  try {
    const snap = await getDocs(collection(db, 'users', userId, subcollection));
    return snap.docs.map(d => d.data() as T);
  } catch (error) {
    console.warn(`Firestore collection read notice for ${path}:`, error);
    return [];
  }
}

/**
 * User Data Control: Permanently Erase All User Data (Right to be Forgotten)
 */
export async function deleteUserAccountAndData(userId: string): Promise<void> {
  const path = `users/${userId}`;
  try {
    // Delete subcollections documents if any
    const subcollections = ['vitals', 'medications', 'appointments', 'records', 'tasks', 'medicationLogs'];
    for (const sub of subcollections) {
      try {
        const snap = await getDocs(collection(db, 'users', userId, sub));
        for (const docSnap of snap.docs) {
          await deleteDoc(docSnap.ref);
        }
      } catch (e) {
        console.warn(`Could not delete subcollection ${sub}:`, e);
      }
    }
    // Delete main user profile
    await deleteDoc(doc(db, 'users', userId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
