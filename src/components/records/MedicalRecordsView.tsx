import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { MedicalRecord, MedicalDocument, Allergy, ChronicCondition, VaccinationRecord } from '../../types';
import { 
  FileText, 
  Calendar, 
  Plus, 
  Trash2, 
  ShieldAlert, 
  Activity, 
  Syringe, 
  Search, 
  Paperclip, 
  Eye, 
  X, 
  Check,
  AlertTriangle
} from 'lucide-react';

export const MedicalRecordsView: React.FC = () => {
  const medicalRecords = useAppStore(s => s.medicalRecords);
  const addMedicalRecord = useAppStore(s => s.addMedicalRecord);
  const deleteMedicalRecord = useAppStore(s => s.deleteMedicalRecord);
  
  const documents = useAppStore(s => s.documents);
  const addDocument = useAppStore(s => s.addDocument);
  const deleteDocument = useAppStore(s => s.deleteDocument);

  const allergies = useAppStore(s => s.allergies);
  const addAllergy = useAppStore(s => s.addAllergy);
  const deleteAllergy = useAppStore(s => s.deleteAllergy);

  const chronicConditions = useAppStore(s => s.chronicConditions);
  const addChronicCondition = useAppStore(s => s.addChronicCondition);
  const deleteChronicCondition = useAppStore(s => s.deleteChronicCondition);

  const vaccinations = useAppStore(s => s.vaccinations);
  const addVaccination = useAppStore(s => s.addVaccination);

  const [activeSubtab, setActiveSubtab] = useState<'timeline' | 'documents' | 'allergies_conditions' | 'vaccinations'>('timeline');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [showAddRecordModal, setShowAddRecordModal] = useState(false);
  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [showAddAllergyModal, setShowAddAllergyModal] = useState(false);
  const [showAddConditionModal, setShowAddConditionModal] = useState(false);
  const [showAddVaccineModal, setShowAddVaccineModal] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<MedicalDocument | null>(null);

  // New Record Form State
  const [newRec, setNewRec] = useState<Omit<MedicalRecord, 'id'>>({
    title: '',
    type: 'diagnosis',
    date: new Date().toISOString().split('T')[0],
    conditionOrReason: '',
    provider: '',
    facility: '',
    outcome: '',
    notes: '',
  });

  // New Document Form State
  const [newDoc, setNewDoc] = useState<Omit<MedicalDocument, 'id'>>({
    title: '',
    type: 'prescription',
    fileFormat: 'jpeg',
    fileUrl: '',
    uploadDate: new Date().toISOString().split('T')[0],
    fileSizeBytes: 125000,
    notes: '',
  });

  // New Allergy Form State
  const [newAllergy, setNewAllergy] = useState<Omit<Allergy, 'id'>>({
    allergen: '',
    category: 'drug',
    severity: 'moderate',
    reaction: '',
    diagnosedDate: new Date().toISOString().split('T')[0],
  });

  // New Condition Form State
  const [newCond, setNewCond] = useState<Omit<ChronicCondition, 'id'>>({
    conditionName: '',
    diagnosedDate: new Date().toISOString().split('T')[0],
    severity: 'controlled',
    treatmentRegimen: '',
    treatingDoctor: '',
    notes: '',
  });

  // New Vaccine Form State
  const [newVac, setNewVac] = useState<Omit<VaccinationRecord, 'id'>>({
    vaccineName: '',
    dateGiven: new Date().toISOString().split('T')[0],
    provider: 'Harare Polyclinic',
    batchNumber: 'ZW-VAC-2026',
    boosterDate: '',
    nextDueDate: '',
    notes: '',
  });

  // Filtered timeline records
  const filteredRecords = medicalRecords.filter(r => {
    const q = searchQuery.toLowerCase();
    return (
      r.title.toLowerCase().includes(q) ||
      r.conditionOrReason.toLowerCase().includes(q) ||
      r.facility.toLowerCase().includes(q) ||
      r.provider.toLowerCase().includes(q) ||
      r.type.toLowerCase().includes(q)
    );
  });

  // Filtered documents
  const filteredDocs = documents.filter(d => 
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-5 pb-24 animate-in fade-in duration-150">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Offline Medical Records
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Encrypted client-side storage • 100% accessible without internet
          </p>
        </div>

        {/* Action Button depending on subtab */}
        <div className="flex items-center gap-2">
          {activeSubtab === 'timeline' && (
            <button
              onClick={() => setShowAddRecordModal(true)}
              className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Record</span>
            </button>
          )}
          {activeSubtab === 'documents' && (
            <button
              onClick={() => setShowAddDocModal(true)}
              className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition"
            >
              <Paperclip className="w-4 h-4" />
              <span>Upload Document</span>
            </button>
          )}
          {activeSubtab === 'allergies_conditions' && (
            <div className="flex gap-2">
              <button
                onClick={() => setShowAddAllergyModal(true)}
                className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm active:scale-95 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Allergy</span>
              </button>
              <button
                onClick={() => setShowAddConditionModal(true)}
                className="px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm active:scale-95 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Condition</span>
              </button>
            </div>
          )}
          {activeSubtab === 'vaccinations' && (
            <button
              onClick={() => setShowAddVaccineModal(true)}
              className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition"
            >
              <Syringe className="w-4 h-4" />
              <span>Add Vaccine</span>
            </button>
          )}
        </div>
      </div>

      {/* Subtab Navigation Pills */}
      <div className="flex gap-1.5 bg-slate-200/60 p-1 rounded-2xl overflow-x-auto text-xs">
        {[
          { key: 'timeline', label: 'Timeline & History', icon: Calendar },
          { key: 'documents', label: 'Documents & Prescriptions', icon: FileText, count: documents.length },
          { key: 'allergies_conditions', label: 'Allergies & Conditions', icon: ShieldAlert, count: allergies.length + chronicConditions.length },
          { key: 'vaccinations', label: 'Vaccinations (ZEPI)', icon: Syringe, count: vaccinations.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeSubtab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveSubtab(tab.key as any)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold whitespace-nowrap transition ${
                isSelected 
                  ? 'bg-white text-teal-800 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {Boolean(tab.count) && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isSelected ? 'bg-teal-100 text-teal-800' : 'bg-slate-300/80 text-slate-700'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search records, diagnoses, providers, documents..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200/80 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
        />
      </div>

      {/* SUBTAB 1: TIMELINE & HISTORY */}
      {activeSubtab === 'timeline' && (
        <div className="space-y-4">
          <div className="relative border-l-2 border-teal-500/30 ml-4 space-y-6 pt-2">
            {filteredRecords.map((record) => (
              <div key={record.id} className="relative pl-6">
                {/* Node indicator */}
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-teal-600 border-2 border-white shadow-sm flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>

                <div className="rounded-3xl bg-white p-5 border border-slate-200/80 shadow-sm space-y-2 hover:border-teal-500/40 transition">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200">
                          {record.type}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          {record.date}
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
                        {record.title}
                      </h4>
                    </div>
                    <button
                      onClick={() => deleteMedicalRecord(record.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Delete record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-600">
                    <strong className="text-slate-800">Reason / Presentation:</strong> {record.conditionOrReason}
                  </p>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-600 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span><strong>Provider:</strong> {record.provider}</span>
                      <span><strong>Facility:</strong> {record.facility}</span>
                    </div>
                    {record.outcome && (
                      <p className="pt-1 border-t border-slate-200/60 text-emerald-800 font-medium">
                        <strong>Clinical Outcome:</strong> {record.outcome}
                      </p>
                    )}
                  </div>

                  {record.notes && (
                    <p className="text-[11px] text-slate-500 italic">
                      Notes: {record.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredRecords.length === 0 && (
            <div className="text-center py-10 text-xs text-slate-400 bg-white rounded-3xl border border-slate-200">
              No medical records match your search.
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: DOCUMENTS */}
      {activeSubtab === 'documents' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="rounded-3xl bg-white p-4 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-9 h-9 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {doc.type.replace('_', ' ')}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-tight">
                  {doc.title}
                </h4>
                {doc.notes && (
                  <p className="text-[11px] text-slate-500 line-clamp-2 italic">
                    {doc.notes}
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">{doc.uploadDate}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPreviewDoc(doc)}
                    className="p-1.5 rounded-lg text-teal-700 hover:bg-teal-50 transition"
                    title="View Document"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteDocument(doc.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Delete Document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredDocs.length === 0 && (
            <div className="col-span-full text-center py-10 text-xs text-slate-400 bg-white rounded-3xl border border-slate-200">
              No documents found.
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 3: ALLERGIES & CHRONIC CONDITIONS */}
      {activeSubtab === 'allergies_conditions' && (
        <div className="space-y-6">
          {/* Allergies Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <h3 className="text-sm font-bold text-slate-900">Allergies ({allergies.length})</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {allergies.map((allergy) => (
                <div
                  key={allergy.id}
                  className="rounded-2xl bg-rose-50/60 p-4 border border-rose-200/80 shadow-sm flex flex-col justify-between space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{allergy.allergen}</h4>
                      <span className="text-[10px] uppercase font-bold text-slate-500">
                        Category: {allergy.category}
                      </span>
                    </div>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-600 text-white">
                      {allergy.severity}
                    </span>
                  </div>
                  <p className="text-xs text-rose-900">
                    <strong>Reaction:</strong> {allergy.reaction}
                  </p>
                  <div className="pt-2 border-t border-rose-200/50 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Diagnosed: {allergy.diagnosedDate || 'Recorded'}</span>
                    <button
                      onClick={() => deleteAllergy(allergy.id)}
                      className="text-rose-600 hover:text-rose-800 font-bold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chronic Conditions Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-teal-600" />
                <h3 className="text-sm font-bold text-slate-900">Chronic Conditions ({chronicConditions.length})</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {chronicConditions.map((cond) => (
                <div
                  key={cond.id}
                  className="rounded-2xl bg-white p-4 border border-slate-200/80 shadow-sm space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{cond.conditionName}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">Diagnosed: {cond.diagnosedDate}</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                      {cond.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    <strong className="text-slate-800">Regimen:</strong> {cond.treatmentRegimen}
                  </p>
                  {cond.treatingDoctor && (
                    <p className="text-[11px] text-slate-500">Doctor: {cond.treatingDoctor}</p>
                  )}
                  <div className="pt-2 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() => deleteChronicCondition(cond.id)}
                      className="text-xs font-semibold text-slate-400 hover:text-rose-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: VACCINATIONS */}
      {activeSubtab === 'vaccinations' && (
        <div className="rounded-3xl bg-white p-5 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Syringe className="w-5 h-5 text-teal-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Vaccination Records (ZEPI & Adult)</h3>
              <p className="text-[11px] text-slate-500">Immunization tracking with next due dates</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {vaccinations.map((vac) => (
              <div key={vac.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900">{vac.vaccineName}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-teal-50 text-teal-700 font-mono">
                      Batch: {vac.batchNumber}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Given: <strong>{vac.dateGiven}</strong> • Provider: {vac.provider}
                  </p>
                  {vac.notes && <p className="text-[10px] text-slate-400 mt-0.5">{vac.notes}</p>}
                </div>
                {vac.nextDueDate && (
                  <div className="text-right shrink-0">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Next Booster</span>
                    <p className="text-xs font-bold text-teal-700">{vac.nextDueDate}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: ADD MEDICAL RECORD */}
      {showAddRecordModal && (
        <div 
          onClick={() => setShowAddRecordModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Record New Medical Event</h3>
              <button onClick={() => setShowAddRecordModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addMedicalRecord(newRec);
                setShowAddRecordModal(false);
              }}
              className="mt-4 space-y-3 text-xs"
            >
              <div>
                <label className="font-bold text-slate-700 block mb-1">Record Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Annual Cardiovascular Review"
                  value={newRec.title}
                  onChange={(e) => setNewRec({ ...newRec, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Event Type</label>
                  <select
                    value={newRec.type}
                    onChange={(e) => setNewRec({ ...newRec, type: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
                  >
                    <option value="diagnosis">Diagnosis</option>
                    <option value="treatment">Treatment</option>
                    <option value="admission">Hospital Admission</option>
                    <option value="surgery">Surgery</option>
                    <option value="procedure">Procedure</option>
                    <option value="referral">Referral</option>
                    <option value="discharge">Discharge</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Date</label>
                  <input
                    required
                    type="date"
                    value={newRec.date}
                    onChange={(e) => setNewRec({ ...newRec, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Reason / Condition Details</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Describe the complaint or medical condition..."
                  value={newRec.conditionOrReason}
                  onChange={(e) => setNewRec({ ...newRec, conditionOrReason: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Healthcare Provider</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Dr. T. Sithole"
                    value={newRec.provider}
                    onChange={(e) => setNewRec({ ...newRec, provider: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Facility / Hospital</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Parirenyatwa / Baines"
                    value={newRec.facility}
                    onChange={(e) => setNewRec({ ...newRec, facility: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Clinical Outcome / Discharge Status</label>
                <input
                  type="text"
                  placeholder="e.g. Stable, medication adjusted"
                  value={newRec.outcome}
                  onChange={(e) => setNewRec({ ...newRec, outcome: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddRecordModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-sm"
                >
                  Save to Offline Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: UPLOAD DOCUMENT */}
      {showAddDocModal && (
        <div 
          onClick={() => setShowAddDocModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Upload Medical Document</h3>
              <button onClick={() => setShowAddDocModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addDocument(newDoc);
                setShowAddDocModal(false);
              }}
              className="mt-4 space-y-3 text-xs"
            >
              <div>
                <label className="font-bold text-slate-700 block mb-1">Document Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Full Blood Count Lab Report"
                  value={newDoc.title}
                  onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Document Category</label>
                  <select
                    value={newDoc.type}
                    onChange={(e) => setNewDoc({ ...newDoc, type: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
                  >
                    <option value="prescription">Prescription</option>
                    <option value="lab_result">Lab Results</option>
                    <option value="referral_letter">Referral Letter</option>
                    <option value="discharge_summary">Discharge Summary</option>
                    <option value="medical_certificate">Medical Certificate</option>
                    <option value="insurance_document">Insurance Document</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Format</label>
                  <select
                    value={newDoc.fileFormat}
                    onChange={(e) => setNewDoc({ ...newDoc, fileFormat: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
                  >
                    <option value="jpeg">Scanned Photo (JPEG)</option>
                    <option value="png">PNG Image</option>
                    <option value="pdf">PDF Document</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Attach File / Photo (Simulated Offline Storage)</label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (uploadEvent) => {
                        setNewDoc({
                          ...newDoc,
                          fileUrl: uploadEvent.target?.result as string,
                          fileSizeBytes: file.size,
                        });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Notes / Key Findings</label>
                <input
                  type="text"
                  placeholder="e.g. Normal lipid levels, check again in 6 months"
                  value={newDoc.notes}
                  onChange={(e) => setNewDoc({ ...newDoc, notes: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              {/* DMCA & User-Uploaded Copyright Non-Liability Disclaimer */}
              <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-950 text-[11px] space-y-1.5">
                <div className="flex items-start gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="leading-tight">
                    <strong className="text-amber-900">DMCA &amp; Copyright Liability Notice:</strong> By uploading this file or image, you certify you hold lawful ownership or clinical authorization. The system developers and platform hosts are <strong>not liable for user-uploaded files</strong> that infringe copyright laws. Designated DMCA Agent filed under 17 U.S.C. § 512(c).
                  </p>
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddDocModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-sm"
                >
                  Save Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DOCUMENT PREVIEW MODAL */}
      {previewDoc && (
        <div 
          onClick={() => setPreviewDoc(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">{previewDoc.title}</h3>
                <span className="text-[10px] uppercase font-bold text-teal-700">{previewDoc.type.replace('_', ' ')}</span>
              </div>
              <button onClick={() => setPreviewDoc(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-4 rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center min-h-[220px]">
              {previewDoc.fileUrl.startsWith('data:image') || previewDoc.fileUrl.startsWith('http') ? (
                <img
                  src={previewDoc.fileUrl}
                  alt={previewDoc.title}
                  className="max-h-[360px] w-auto object-contain rounded-xl shadow-inner"
                />
              ) : (
                <div className="text-center p-8 text-slate-500">
                  <FileText className="w-16 h-16 mx-auto text-teal-600 mb-2" />
                  <p className="text-xs font-semibold text-slate-700">Encrypted PDF Document</p>
                  <p className="text-[11px] text-slate-400 mt-1">Available for local review and clinic printing</p>
                </div>
              )}
            </div>

            {previewDoc.notes && (
              <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 mb-4 border border-slate-200/60">
                <strong>Clinician Notes:</strong> {previewDoc.notes}
              </div>
            )}

            <button
              onClick={() => setPreviewDoc(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}

      {/* MODAL: ADD ALLERGY */}
      {showAddAllergyModal && (
        <div 
          onClick={() => setShowAddAllergyModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Record Allergy</h3>
              <button onClick={() => setShowAddAllergyModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addAllergy(newAllergy);
                setShowAddAllergyModal(false);
              }}
              className="mt-4 space-y-3 text-xs"
            >
              <div>
                <label className="font-bold text-slate-700 block mb-1">Allergen Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Penicillin, Peanuts, Bee Venom"
                  value={newAllergy.allergen}
                  onChange={(e) => setNewAllergy({ ...newAllergy, allergen: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newAllergy.category}
                    onChange={(e) => setNewAllergy({ ...newAllergy, category: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    <option value="drug">Drug / Medication</option>
                    <option value="food">Food</option>
                    <option value="environmental">Environmental</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Severity</label>
                  <select
                    value={newAllergy.severity}
                    onChange={(e) => setNewAllergy({ ...newAllergy, severity: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    <option value="mild">Mild</option>
                    <option value="moderate">Moderate</option>
                    <option value="severe">Severe</option>
                    <option value="life-threatening">Life-Threatening</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Reaction Details</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Swelling, rash, difficulty breathing"
                  value={newAllergy.reaction}
                  onChange={(e) => setNewAllergy({ ...newAllergy, reaction: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddAllergyModal(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold"
                >
                  Save Allergy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD CHRONIC CONDITION */}
      {showAddConditionModal && (
        <div 
          onClick={() => setShowAddConditionModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add Chronic Condition</h3>
              <button onClick={() => setShowAddConditionModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addChronicCondition(newCond);
                setShowAddConditionModal(false);
              }}
              className="mt-4 space-y-3 text-xs"
            >
              <div>
                <label className="font-bold text-slate-700 block mb-1">Condition Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Type 2 Diabetes, Epilepsy, Hypertension"
                  value={newCond.conditionName}
                  onChange={(e) => setNewCond({ ...newCond, conditionName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Treatment Regimen</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Metformin 500mg BD + Diet control"
                  value={newCond.treatmentRegimen}
                  onChange={(e) => setNewCond({ ...newCond, treatmentRegimen: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Severity</label>
                  <select
                    value={newCond.severity}
                    onChange={(e) => setNewCond({ ...newCond, severity: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    <option value="controlled">Controlled</option>
                    <option value="mild">Mild</option>
                    <option value="moderate">Moderate</option>
                    <option value="severe">Severe</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Treating Doctor</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Sithole"
                    value={newCond.treatingDoctor}
                    onChange={(e) => setNewCond({ ...newCond, treatingDoctor: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddConditionModal(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold"
                >
                  Save Condition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD VACCINATION */}
      {showAddVaccineModal && (
        <div 
          onClick={() => setShowAddVaccineModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add Vaccine Record</h3>
              <button onClick={() => setShowAddVaccineModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addVaccination(newVac);
                setShowAddVaccineModal(false);
              }}
              className="mt-4 space-y-3 text-xs"
            >
              <div>
                <label className="font-bold text-slate-700 block mb-1">Vaccine Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Yellow Fever, Hepatitis B, Tetanus"
                  value={newVac.vaccineName}
                  onChange={(e) => setNewVac({ ...newVac, vaccineName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Date Given</label>
                  <input
                    required
                    type="date"
                    value={newVac.dateGiven}
                    onChange={(e) => setNewVac({ ...newVac, dateGiven: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Batch Number</label>
                  <input
                    required
                    type="text"
                    value={newVac.batchNumber}
                    onChange={(e) => setNewVac({ ...newVac, batchNumber: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Provider / Clinic</label>
                <input
                  required
                  type="text"
                  value={newVac.provider}
                  onChange={(e) => setNewVac({ ...newVac, provider: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Next Due / Booster Date (Optional)</label>
                <input
                  type="date"
                  value={newVac.nextDueDate}
                  onChange={(e) => setNewVac({ ...newVac, nextDueDate: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddVaccineModal(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold"
                >
                  Save Vaccine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
