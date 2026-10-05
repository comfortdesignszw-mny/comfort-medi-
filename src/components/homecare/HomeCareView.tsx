import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { VitalsReading, CareTask, ProgressReport } from '../../types';
import { 
  HeartHandshake, 
  Activity, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Users, 
  FileText, 
  Calendar, 
  Smile, 
  Meh, 
  Frown, 
  AlertCircle, 
  Phone, 
  X,
  TrendingUp
} from 'lucide-react';

export const HomeCareView: React.FC<{ initialOpenVitalsModal?: boolean }> = ({ initialOpenVitalsModal = false }) => {
  const carePlan = useAppStore(s => s.carePlan);
  const careTeam = useAppStore(s => s.careTeam);
  const vitals = useAppStore(s => s.vitals);
  const progressReports = useAppStore(s => s.progressReports);
  const toggleCareTask = useAppStore(s => s.toggleCareTask);
  const addCareTask = useAppStore(s => s.addCareTask);
  const logVitalReading = useAppStore(s => s.logVitalReading);
  const addProgressReport = useAppStore(s => s.addProgressReport);

  const [activeTab, setActiveTab] = useState<'tasks' | 'vitals' | 'team' | 'reports'>('tasks');
  const [showLogVitalModal, setShowLogVitalModal] = useState(initialOpenVitalsModal);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showAddReportModal, setShowAddReportModal] = useState(false);

  // New Vital Reading Form
  const [vitalForm, setVitalForm] = useState<Omit<VitalsReading, 'id' | 'date'>>({
    systolicBp: 124,
    diastolicBp: 80,
    pulseRate: 72,
    temperature: 36.6,
    respiratoryRate: 16,
    bloodSugar: 5.4,
    weightKg: 69.5,
    oxygenSaturation: 98,
    painLevel: 0,
    mood: 'great',
    sleepHours: 7.5,
    recordedBy: 'Self',
    notes: '',
  });

  // New Care Task Form
  const [taskForm, setTaskForm] = useState<Omit<CareTask, 'id' | 'completed'>>({
    title: '',
    category: 'vitals',
    timeOfDay: '08:00',
    assignedTo: 'Caregiver',
    notes: '',
  });

  // New Progress Report Form
  const [reportForm, setReportForm] = useState<Omit<ProgressReport, 'id' | 'date'>>({
    authorName: 'Sister Chipo',
    authorRole: 'Community Nurse',
    summary: '',
    observations: '',
    incidents: '',
  });

  const completedTasksCount = carePlan.tasks.filter(t => t.completed).length;
  const completionPercentage = carePlan.tasks.length > 0 
    ? Math.round((completedTasksCount / carePlan.tasks.length) * 100) 
    : 100;

  return (
    <div className="space-y-5 pb-24 animate-in fade-in duration-150">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Home-Based Care Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Caregiver coordination • Clinical vitals monitoring • Home visit logs
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowLogVitalModal(true)}
            className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition"
          >
            <Activity className="w-4 h-4" />
            <span>Record Vitals</span>
          </button>
        </div>
      </div>

      {/* Care Plan Progress Card */}
      <div className="rounded-3xl bg-gradient-to-r from-teal-900 to-[#0a2540] text-white p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-teal-300">
                Active {carePlan.period} Care Plan
              </span>
              <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                {carePlan.title}
              </h3>
            </div>
            <div className="text-right shrink-0">
              <span className="text-2xl font-black text-teal-300">{completionPercentage}%</span>
              <span className="text-[10px] block text-slate-300">Completed Today</span>
            </div>
          </div>

          <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>

          <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10 text-xs text-slate-200">
            {carePlan.goals.slice(0, 3).map((goal, idx) => (
              <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/10 text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-300" />
                {goal}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 bg-slate-200/60 p-1 rounded-2xl text-xs">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition ${
            activeTab === 'tasks' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Care Tasks ({completedTasksCount}/{carePlan.tasks.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('vitals')}
          className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition ${
            activeTab === 'vitals' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Vitals Trends ({vitals.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('team')}
          className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition ${
            activeTab === 'team' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Care Team ({careTeam.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition ${
            activeTab === 'reports' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Progress Reports</span>
        </button>
      </div>

      {/* TAB 1: CARE TASKS CHECKLIST */}
      {activeTab === 'tasks' && (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Today's Home Care Tasks</h3>
            <button
              onClick={() => setShowAddTaskModal(true)}
              className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Task</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {carePlan.tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleCareTask(task.id)}
                className={`cursor-pointer p-4 rounded-3xl border transition flex items-center justify-between gap-3 ${
                  task.completed 
                    ? 'bg-teal-50/50 border-teal-200/80 text-slate-700' 
                    : 'bg-white border-slate-200/80 text-slate-900 hover:border-teal-500/40'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button className="mt-0.5 shrink-0 text-teal-600">
                    {task.completed ? (
                      <CheckCircle2 className="w-6 h-6 fill-teal-600 text-white" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-300" />
                    )}
                  </button>
                  <div>
                    <h4 className={`text-xs sm:text-sm font-bold ${task.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      {task.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Assigned to: <strong className="text-slate-700">{task.assignedTo}</strong> • Time: {task.timeOfDay}
                    </p>
                    {task.notes && (
                      <p className="text-[11px] text-teal-700 italic mt-0.5">{task.notes}</p>
                    )}
                  </div>
                </div>

                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 shrink-0">
                  {task.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: VITALS TRACKER & CLINICAL TRENDS */}
      {activeTab === 'vitals' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Vitals History &amp; Clinical Ranges</h3>
            <button
              onClick={() => setShowLogVitalModal(true)}
              className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Reading</span>
            </button>
          </div>

          <div className="space-y-3">
            {vitals.map((v) => {
              const isHighBp = (v.systolicBp || 0) >= 140 || (v.diastolicBp || 0) >= 90;
              return (
                <div
                  key={v.id}
                  className="rounded-3xl bg-white p-5 border border-slate-200/80 shadow-sm space-y-3 hover:border-teal-500/40 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-400">
                      {new Date(v.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                    <span className="text-xs font-semibold text-slate-600">
                      Recorded by: {v.recordedBy}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {/* BP */}
                    <div className={`p-3 rounded-2xl border text-center ${
                      isHighBp ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-slate-50 border-slate-200/60 text-slate-900'
                    }`}>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Blood Pressure</span>
                      <p className="text-base font-black mt-0.5">
                        {v.systolicBp}/{v.diastolicBp} <span className="text-[10px] font-normal">mmHg</span>
                      </p>
                      <span className={`text-[10px] font-bold ${isHighBp ? 'text-amber-700' : 'text-emerald-600'}`}>
                        {isHighBp ? 'Elevated' : 'Normal'}
                      </span>
                    </div>

                    {/* Blood Glucose */}
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60 text-center text-slate-900">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Blood Sugar</span>
                      <p className="text-base font-black mt-0.5">
                        {v.bloodSugar || '--'} <span className="text-[10px] font-normal">mmol/L</span>
                      </p>
                      <span className="text-[10px] text-emerald-600 font-bold">In Target</span>
                    </div>

                    {/* Pulse */}
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60 text-center text-slate-900">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Pulse Rate</span>
                      <p className="text-base font-black mt-0.5">
                        {v.pulseRate || '--'} <span className="text-[10px] font-normal">bpm</span>
                      </p>
                      <span className="text-[10px] text-slate-400">Regular</span>
                    </div>

                    {/* Temperature */}
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60 text-center text-slate-900">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Body Temp</span>
                      <p className="text-base font-black mt-0.5">
                        {v.temperature ? `${v.temperature}°C` : '--'}
                      </p>
                      <span className="text-[10px] text-emerald-600 font-bold">Afebrile</span>
                    </div>
                  </div>

                  {v.notes && (
                    <p className="text-xs text-slate-500 italic pt-1">
                      Notes: {v.notes}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: CARE TEAM */}
      {activeTab === 'team' && (
        <div className="space-y-4">
          <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 text-xs text-teal-900 leading-relaxed">
            Multidisciplinary Care Team: Connects family members, registered home nurses, and community health liaisons across Zimbabwe.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {careTeam.map((member) => (
              <div
                key={member.id}
                className="rounded-3xl bg-white p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{member.name}</h4>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-teal-50 text-teal-800">
                      {member.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono mt-1">{member.phone}</p>
                  {member.notes && (
                    <p className="text-xs text-slate-600 mt-2">{member.notes}</p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <a
                    href={`tel:${member.phone.replace(/\s+/g, '')}`}
                    className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Team Member</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PROGRESS REPORTS */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Caregiver Clinical Reports</h3>
            <button
              onClick={() => setShowAddReportModal(true)}
              className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Submit Report</span>
            </button>
          </div>

          <div className="space-y-3">
            {progressReports.map((report) => (
              <div
                key={report.id}
                className="rounded-3xl bg-white p-5 border border-slate-200/80 shadow-sm space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-mono text-slate-400">{report.date}</span>
                    <h4 className="text-sm font-bold text-slate-900 mt-0.5">{report.summary}</h4>
                  </div>
                  <span className="text-[11px] font-semibold text-teal-700">
                    {report.authorName} ({report.authorRole})
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl text-xs text-slate-700 border border-slate-200/60 space-y-1">
                  <p><strong>Clinical Observations:</strong> {report.observations}</p>
                  {report.incidents && (
                    <p className="text-amber-800 pt-1 border-t border-slate-200/40">
                      <strong>Incidents/Concerns:</strong> {report.incidents}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: LOG VITALS */}
      {showLogVitalModal && (
        <div 
          onClick={() => setShowLogVitalModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Log Home Vitals Reading</h3>
              <button onClick={() => setShowLogVitalModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                logVitalReading(vitalForm);
                setShowLogVitalModal(false);
              }}
              className="mt-4 space-y-3.5 text-xs"
            >
              {/* BP */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/60">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Systolic BP (mmHg)</label>
                  <input
                    type="number"
                    min="60"
                    max="240"
                    value={vitalForm.systolicBp || ''}
                    onChange={(e) => setVitalForm({ ...vitalForm, systolicBp: parseInt(e.target.value, 10) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                    placeholder="120"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Diastolic BP (mmHg)</label>
                  <input
                    type="number"
                    min="40"
                    max="140"
                    value={vitalForm.diastolicBp || ''}
                    onChange={(e) => setVitalForm({ ...vitalForm, diastolicBp: parseInt(e.target.value, 10) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                    placeholder="80"
                  />
                </div>
              </div>

              {/* Glucose & Pulse */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Blood Glucose (mmol/L)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={vitalForm.bloodSugar || ''}
                    onChange={(e) => setVitalForm({ ...vitalForm, bloodSugar: parseFloat(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                    placeholder="5.4"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Pulse (bpm)</label>
                  <input
                    type="number"
                    value={vitalForm.pulseRate || ''}
                    onChange={(e) => setVitalForm({ ...vitalForm, pulseRate: parseInt(e.target.value, 10) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                    placeholder="72"
                  />
                </div>
              </div>

              {/* Temp & O2 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Temperature (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={vitalForm.temperature || ''}
                    onChange={(e) => setVitalForm({ ...vitalForm, temperature: parseFloat(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                    placeholder="36.6"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">SpO2 Oxygen (%)</label>
                  <input
                    type="number"
                    value={vitalForm.oxygenSaturation || ''}
                    onChange={(e) => setVitalForm({ ...vitalForm, oxygenSaturation: parseInt(e.target.value, 10) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                    placeholder="98"
                  />
                </div>
              </div>

              {/* Pain & Mood */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Pain Level (0 - 10)</label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={vitalForm.painLevel || 0}
                    onChange={(e) => setVitalForm({ ...vitalForm, painLevel: parseInt(e.target.value, 10) })}
                    className="w-full accent-teal-600"
                  />
                  <span className="text-[11px] font-bold text-slate-600 block text-center mt-1">
                    Score: {vitalForm.painLevel} / 10
                  </span>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Current Mood</label>
                  <select
                    value={vitalForm.mood}
                    onChange={(e) => setVitalForm({ ...vitalForm, mood: e.target.value as any })}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    <option value="great">Great / Energetic</option>
                    <option value="good">Good / Stable</option>
                    <option value="neutral">Neutral</option>
                    <option value="low">Low Energy</option>
                    <option value="distressed">Distressed / In Discomfort</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Observations / Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Taken before breakfast, well rested"
                  value={vitalForm.notes}
                  onChange={(e) => setVitalForm({ ...vitalForm, notes: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowLogVitalModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-sm"
                >
                  Save Reading
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD CARE TASK */}
      {showAddTaskModal && (
        <div 
          onClick={() => setShowAddTaskModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add Care Task</h3>
              <button onClick={() => setShowAddTaskModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addCareTask(taskForm);
                setShowAddTaskModal(false);
              }}
              className="mt-4 space-y-3 text-xs"
            >
              <div>
                <label className="font-bold text-slate-700 block mb-1">Task Description</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Wound dressing change, 15 min mobility walk"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={taskForm.category}
                    onChange={(e) => setTaskForm({ ...taskForm, category: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    <option value="vitals">Vital Signs</option>
                    <option value="medication">Medication</option>
                    <option value="meal">Meal Assistance</option>
                    <option value="exercise">Exercise / Walk</option>
                    <option value="wound_care">Wound Care</option>
                    <option value="hygiene">Personal Hygiene</option>
                    <option value="mobility">Mobility</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Time</label>
                  <input
                    type="time"
                    value={taskForm.timeOfDay}
                    onChange={(e) => setTaskForm({ ...taskForm, timeOfDay: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Assigned Person</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Nurse Chipo, Farai (Spouse), Self"
                  value={taskForm.assignedTo}
                  onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SUBMIT PROGRESS REPORT */}
      {showAddReportModal && (
        <div 
          onClick={() => setShowAddReportModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Submit Caregiver Report</h3>
              <button onClick={() => setShowAddReportModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addProgressReport(reportForm);
                setShowAddReportModal(false);
              }}
              className="mt-4 space-y-3 text-xs"
            >
              <div>
                <label className="font-bold text-slate-700 block mb-1">Summary Header</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Weekly Mobility & Blood Pressure Progress"
                  value={reportForm.summary}
                  onChange={(e) => setReportForm({ ...reportForm, summary: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Author Name</label>
                  <input
                    required
                    type="text"
                    value={reportForm.authorName}
                    onChange={(e) => setReportForm({ ...reportForm, authorName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Author Role</label>
                  <input
                    required
                    type="text"
                    value={reportForm.authorRole}
                    onChange={(e) => setReportForm({ ...reportForm, authorRole: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Observations</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Describe patient's condition, appetite, compliance..."
                  value={reportForm.observations}
                  onChange={(e) => setReportForm({ ...reportForm, observations: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Incidents or Concerns (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Mild dizzy spell on standing, resolved"
                  value={reportForm.incidents}
                  onChange={(e) => setReportForm({ ...reportForm, incidents: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddReportModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
