import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  fetchAllUsers, 
  updateUserRole, 
  ADMIN_EMAIL,
  assignPatientToDoctor,
  revokePatientAssignment,
  fetchAllAssignments,
  fetchStaffAuditLogs,
  deleteUserAccountAndData,
  logStaffActivity
} from '../../lib/authService';
import { FirebaseUserRecord, UserRole, PatientAssignment, AuditLog } from '../../types';
import { 
  ShieldAlert, 
  UserCheck, 
  Users, 
  Stethoscope, 
  Briefcase, 
  X, 
  Loader2, 
  RefreshCw, 
  Search, 
  Mail, 
  Phone, 
  AlertCircle, 
  UserPlus, 
  Activity, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  Trash2
} from 'lucide-react';

interface AdminUserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminUserManagementModal: React.FC<AdminUserManagementModalProps> = ({
  isOpen,
  onClose,
}) => {
  const showToast = useAppStore(s => s.showToast);

  const [activeTab, setActiveTab] = useState<'roles' | 'assignments' | 'audit'>('roles');
  const [users, setUsers] = useState<FirebaseUserRecord[]>([]);
  const [assignments, setAssignments] = useState<PatientAssignment[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingUid, setUpdatingUid] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<FirebaseUserRecord | null>(null);
  const [isDeletingUser, setIsDeletingUser] = useState(false);

  // New assignment form state
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [assignmentNotes, setAssignmentNotes] = useState('');
  const [assigning, setAssigning] = useState(false);

  const loadAllData = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const [usersData, assignmentsData, auditData] = await Promise.all([
        fetchAllUsers(),
        fetchAllAssignments(),
        fetchStaffAuditLogs()
      ]);
      setUsers(usersData);
      setAssignments(assignmentsData);
      setAuditLogs(auditData);
    } catch (err: any) {
      console.error('Failed to load admin data:', err);
      setErrorMessage(err?.message || 'Could not load management data. Verify admin permissions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadAllData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRoleChange = async (targetUid: string, targetName: string, newRole: UserRole) => {
    setUpdatingUid(targetUid);
    try {
      await updateUserRole(targetUid, newRole);
      setUsers(prev => prev.map(u => u.uid === targetUid ? { ...u, role: newRole } : u));
      showToast(`Role for ${targetName} upgraded to ${newRole.toUpperCase()}`, 'success');
    } catch (err: any) {
      console.error('Failed to update role:', err);
      showToast(err?.message || 'Failed to update user role', 'error');
    } finally {
      setUpdatingUid(null);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setIsDeletingUser(true);
    try {
      await deleteUserAccountAndData(userToDelete.uid);
      await logStaffActivity(
        `Admin deleted user: ${userToDelete.fullName} (${userToDelete.email || userToDelete.phoneNumber || userToDelete.uid})`,
        'SECURITY',
        `User account and clinical data permanently removed by Administrator (${ADMIN_EMAIL})`
      );
      setUsers(prev => prev.filter(u => u.uid !== userToDelete.uid));
      setAssignments(prev => prev.filter(a => a.patientId !== userToDelete.uid && a.doctorId !== userToDelete.uid));
      showToast(`User ${userToDelete.fullName} deleted permanently`, 'success');
      setUserToDelete(null);
    } catch (err: any) {
      console.error('Failed to delete user:', err);
      showToast(err?.message || 'Failed to delete user from database', 'error');
    } finally {
      setIsDeletingUser(false);
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctorId || !selectedPatientId) {
      showToast('Please select both a doctor and a patient', 'warning');
      return;
    }
    const docUser = users.find(u => u.uid === selectedDoctorId);
    const patUser = users.find(u => u.uid === selectedPatientId);
    if (!docUser || !patUser) return;

    setAssigning(true);
    try {
      const newAssign = await assignPatientToDoctor(
        docUser.uid,
        docUser.fullName,
        patUser.uid,
        patUser.fullName,
        assignmentNotes
      );
      setAssignments(prev => [newAssign, ...prev.filter(a => a.id !== newAssign.id)]);
      setSelectedDoctorId('');
      setSelectedPatientId('');
      setAssignmentNotes('');
      showToast(`Assigned ${patUser.fullName} to Dr. ${docUser.fullName}`, 'success');
    } catch (err: any) {
      console.error('Assignment error:', err);
      showToast(err?.message || 'Failed to create assignment', 'error');
    } finally {
      setAssigning(false);
    }
  };

  const handleRevoke = async (assignmentId: string) => {
    try {
      await revokePatientAssignment(assignmentId);
      setAssignments(prev => prev.map(a => a.id === assignmentId ? { ...a, status: 'revoked' } : a));
      showToast('Assignment revoked successfully', 'info');
    } catch (err: any) {
      console.error('Revoke error:', err);
      showToast(err?.message || 'Failed to revoke assignment', 'error');
    }
  };

  const doctorsList = users.filter(u => u.role === 'doctor' || u.role === 'caregiver');
  const patientsList = users.filter(u => u.role === 'patient');

  const filteredUsers = users.filter(u => {
    const q = searchQuery.toLowerCase();
    return (
      u.fullName.toLowerCase().includes(q) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.phoneNumber && u.phoneNumber.includes(q)) ||
      u.role.toLowerCase().includes(q)
    );
  });

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-950 via-[#0a2540] to-teal-950 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <ShieldAlert className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest text-amber-300 uppercase">
                Admin Control &amp; Clinical Governance
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white">
                RBAC Roles, Patient Assignment &amp; Staff Monitoring
              </h2>
            </div>
          </div>

          <p className="text-xs text-slate-300 mt-2">
            Administrator: <code className="text-amber-200 font-bold">{ADMIN_EMAIL}</code>. Supervise healthcare workers, assign patients to clinicians, and monitor clinical activities.
          </p>

          {/* Tab Switcher */}
          <div className="mt-4 flex rounded-xl bg-black/30 p-1 text-xs font-bold">
            <button
              onClick={() => setActiveTab('roles')}
              className={`flex-1 py-1.5 rounded-lg transition ${
                activeTab === 'roles' ? 'bg-white text-[#0a2540] shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              1. User Roles &amp; Upgrades ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('assignments')}
              className={`flex-1 py-1.5 rounded-lg transition ${
                activeTab === 'assignments' ? 'bg-white text-[#0a2540] shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              2. Assign Patients to Doctors ({assignments.filter(a => a.status === 'active').length})
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`flex-1 py-1.5 rounded-lg transition ${
                activeTab === 'audit' ? 'bg-white text-[#0a2540] shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              3. Staff Monitoring Audit ({auditLogs.length})
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* TAB 1: USER ROLES */}
          {activeTab === 'roles' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input 
                    type="text"
                    placeholder="Search users by name, phone, email, or role..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <button
                  onClick={loadAllData}
                  disabled={loading}
                  className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition"
                  title="Refresh List"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {loading ? (
                <div className="py-12 text-center text-slate-500 space-y-2">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-teal-600" />
                  <p className="text-xs font-semibold">Loading registered users from Firebase...</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="py-10 text-center text-slate-400 text-xs">
                  No users found matching your search.
                </div>
              ) : (
                filteredUsers.map((u) => {
                  const isSuperAdminEmail = u.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
                  return (
                    <div 
                      key={u.uid}
                      className="p-3.5 rounded-2xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white font-bold flex items-center justify-center shrink-0 text-sm shadow-sm">
                          {u.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-slate-900 truncate">{u.fullName}</h4>
                            {isSuperAdminEmail && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-100 text-amber-800 border border-amber-300">
                                SUPER ADMIN
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-2 mt-0.5">
                            {u.email && (
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3 text-slate-400" />
                                <span className="truncate max-w-[150px]">{u.email}</span>
                              </span>
                            )}
                            {u.phoneNumber && (
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3 text-slate-400" />
                                <span>{u.phoneNumber}</span>
                              </span>
                            )}
                            <span className="text-slate-400">• Provider: {u.authProvider || 'email'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Role upgrade buttons */}
                      <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                        <span className="text-[10px] text-slate-400 font-bold uppercase mr-1">Role:</span>
                        {(['patient', 'caregiver', 'doctor', 'admin'] as UserRole[]).map((r) => {
                          const isCurrent = u.role === r;
                          const isUpdatingThis = updatingUid === u.uid;
                          const label = r === 'patient' ? 'Patient' : r === 'caregiver' ? 'Caregiver' : r === 'doctor' ? 'Doctor' : 'Admin';
                          return (
                            <button
                              key={r}
                              disabled={isCurrent || isUpdatingThis || (isSuperAdminEmail && r !== 'admin')}
                              onClick={() => handleRoleChange(u.uid, u.fullName, r)}
                              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition ${
                                isCurrent
                                  ? 'bg-teal-700 text-white shadow-sm ring-2 ring-teal-500/30'
                                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 active:scale-95 disabled:opacity-50'
                              }`}
                            >
                              {label}
                            </button>
                          );
                        })}

                        {/* Admin Delete User Button (not allowed on super admin) */}
                        {!isSuperAdminEmail && (
                          <button
                            type="button"
                            onClick={() => setUserToDelete(u)}
                            className="p-1.5 ml-1 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 transition"
                            title="Delete User (Admin Privilege)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 2: PATIENT ASSIGNMENTS */}
          {activeTab === 'assignments' && (
            <div className="space-y-4">
              {/* Assignment Form */}
              <form onSubmit={handleCreateAssignment} className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-teal-900">
                  <UserPlus className="w-4 h-4 text-teal-700" />
                  <span>Authorize Clinical Oversight: Assign Patient to Doctor/Clinician</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Select Doctor / Clinician / Nurse</label>
                    <select
                      value={selectedDoctorId}
                      onChange={(e) => setSelectedDoctorId(e.target.value)}
                      required
                      className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="">-- Choose Medical Staff ({doctorsList.length}) --</option>
                      {doctorsList.map(d => (
                        <option key={d.uid} value={d.uid}>
                          Dr. {d.fullName} ({d.role.toUpperCase()})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Select Patient to Assign</label>
                    <select
                      value={selectedPatientId}
                      onChange={(e) => setSelectedPatientId(e.target.value)}
                      required
                      className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="">-- Choose Patient ({patientsList.length}) --</option>
                      {patientsList.map(p => (
                        <option key={p.uid} value={p.uid}>
                          {p.fullName} ({p.phoneNumber || p.email || 'Patient'})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Clinical assignment notes (e.g. Hypertension management & weekly vitals review)..."
                    value={assignmentNotes}
                    onChange={(e) => setAssignmentNotes(e.target.value)}
                    className="w-full p-2 text-xs rounded-xl border border-slate-200 bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={assigning}
                  className="w-full py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition active:scale-95 disabled:opacity-50"
                >
                  {assigning ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                  <span>Grant Clinical Authorization &amp; Assign Patient</span>
                </button>
              </form>

              {/* Active & Revoked Assignments Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Current Clinical Assignments ({assignments.length})
                </h4>
                {assignments.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    No patient assignments authorized yet. Use the form above to pair a patient with a doctor.
                  </div>
                ) : (
                  assignments.map(a => (
                    <div 
                      key={a.id}
                      className="p-3.5 rounded-2xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">Dr. {a.doctorName}</span>
                          <span className="text-slate-400">➔</span>
                          <span className="font-bold text-teal-800">Patient: {a.patientName}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            a.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {a.status.toUpperCase()}
                          </span>
                        </div>
                        {a.clinicalNotes && (
                          <p className="text-[11px] text-slate-500 mt-1 italic">"{a.clinicalNotes}"</p>
                        )}
                        <p className="text-[10px] text-slate-400 mt-1">
                          Assigned by {a.assignedBy} on {new Date(a.assignedAt).toLocaleDateString()}
                        </p>
                      </div>

                      {a.status === 'active' ? (
                        <button
                          onClick={() => handleRevoke(a.id)}
                          className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-xs transition active:scale-95 self-end sm:self-center"
                        >
                          Revoke Access
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 self-end sm:self-center font-semibold">Access Revoked</span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: STAFF MONITORING AUDIT */}
          {activeTab === 'audit' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
                <div>
                  <strong>Clinical Governance:</strong> Monitoring medical staff activity, patient chart updates, and clinical actions across the database.
                </div>
                <button
                  onClick={loadAllData}
                  className="px-3 py-1 rounded-xl bg-amber-600 text-white font-bold text-[11px] hover:bg-amber-700 transition"
                >
                  Refresh Logs
                </button>
              </div>

              {auditLogs.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No staff actions recorded yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {auditLogs.map(log => (
                    <div 
                      key={log.id}
                      className="p-3 rounded-2xl border border-slate-200 bg-white flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{log.action}</span>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-slate-100 text-slate-700">
                            {log.category}
                          </span>
                        </div>
                        {log.details && (
                          <p className="text-[11px] text-slate-600">{log.details}</p>
                        )}
                        <p className="text-[10px] text-slate-400">
                          Actor: <strong>{log.actorName || log.actorId}</strong>
                        </p>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            System Administrators: <strong>1</strong> • Registered Accounts: <strong>{users.length}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition"
          >
            Close / Return to App
          </button>
        </div>
      </div>

      {/* Admin Delete User Confirmation Dialog */}
      {userToDelete && (
        <div 
          onClick={() => !isDeletingUser && setUserToDelete(null)}
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl bg-white shadow-2xl border border-rose-200 overflow-hidden p-6 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">
                  Delete User Account (Admin Privilege)
                </h3>
                <p className="text-xs text-slate-500">
                  Permanent removal from Firestore database
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Name:</span>
                <span className="font-bold text-slate-800">{userToDelete.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Role:</span>
                <span className="font-bold uppercase text-teal-700">{userToDelete.role}</span>
              </div>
              {userToDelete.email && (
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Email:</span>
                  <span className="font-medium text-slate-700">{userToDelete.email}</span>
                </div>
              )}
              {userToDelete.phoneNumber && (
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Phone:</span>
                  <span className="font-medium text-slate-700">{userToDelete.phoneNumber}</span>
                </div>
              )}
            </div>

            <p className="text-[11px] text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-200 leading-relaxed">
              ⚠️ <strong>Warning:</strong> This action will permanently delete this user's profile and all subcollection health records (vitals, medications, appointments, records) from Cloud Firestore. This action cannot be undone.
            </p>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                disabled={isDeletingUser}
                onClick={() => setUserToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeletingUser}
                onClick={handleDeleteUser}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                {isDeletingUser ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Permanently Delete User</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
