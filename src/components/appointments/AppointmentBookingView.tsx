import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { PRELOADED_FACILITIES, ZIMBABWE_PROVINCES } from '../../data/zimbabweFacilities';
import { Appointment, Facility } from '../../types';
import { generateWhatsAppLink } from '../../lib/whatsappGateway';
import { 
  CalendarCheck, 
  MapPin, 
  Phone, 
  Clock, 
  Search, 
  Plus, 
  ShieldAlert, 
  CheckCircle, 
  X, 
  AlertCircle, 
  Building2, 
  ListFilter,
  Users,
  MessageSquare
} from 'lucide-react';

export const AppointmentBookingView: React.FC = () => {
  const appointments = useAppStore(s => s.appointments);
  const userProfile = useAppStore(s => s.userProfile);
  const bookAppointment = useAppStore(s => s.bookAppointment);
  const updateAppointmentStatus = useAppStore(s => s.updateAppointmentStatus);
  const cancelAppointment = useAppStore(s => s.cancelAppointment);
  const showToast = useAppStore(s => s.showToast);

  const [activeTab, setActiveTab] = useState<'my_appointments' | 'facility_directory' | 'waiting_list'>('my_appointments');
  const [selectedProvince, setSelectedProvince] = useState<string>('All Provinces');
  const [searchQuery, setSearchQuery] = useState('');
  const [facilityTypeFilter, setFacilityTypeFilter] = useState<string>('all');
  
  // Booking modal
  const [bookingModalFacility, setBookingModalFacility] = useState<Facility | null>(null);
  const [isWaitingListBooking, setIsWaitingListBooking] = useState(false);

  // New Appointment Form
  const [newApt, setNewApt] = useState<Omit<Appointment, 'id'>>({
    facilityId: '',
    facilityName: '',
    appointmentType: 'general_consultation',
    date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    time: '09:00 AM',
    providerName: 'Consultant on Duty',
    reason: '',
    notes: '',
    status: 'booked',
  });

  // Filter facilities
  const filteredFacilities = PRELOADED_FACILITIES.filter(f => {
    const matchesProvince = selectedProvince === 'All Provinces' || f.province === selectedProvince;
    const matchesType = facilityTypeFilter === 'all' || f.type === facilityTypeFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      f.name.toLowerCase().includes(q) ||
      f.city.toLowerCase().includes(q) ||
      f.specialties.some(s => s.toLowerCase().includes(q)) ||
      f.services.some(s => s.toLowerCase().includes(q));

    return matchesProvince && matchesType && matchesSearch;
  });

  const handleOpenBooking = (facility: Facility, asWaitingList = false) => {
    setBookingModalFacility(facility);
    setIsWaitingListBooking(asWaitingList);
    setNewApt({
      facilityId: facility.id,
      facilityName: facility.name,
      appointmentType: 'general_consultation',
      date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      time: '10:00 AM',
      providerName: facility.specialties[0] ? `Dr. Specialist (${facility.specialties[0]})` : 'Clinical Officer',
      reason: '',
      notes: '',
      status: asWaitingList ? 'booked' : 'confirmed',
      isWaitingList: asWaitingList,
    });
  };

  return (
    <div className="space-y-5 pb-24 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Clinic &amp; Hospital Appointments
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Preloaded Zimbabwe facility directory • Offline bookings &amp; waiting lists
          </p>
        </div>

        <button
          onClick={() => setActiveTab('facility_directory')}
          className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition self-start sm:self-auto"
        >
          <Building2 className="w-4 h-4" />
          <span>Find Facility to Book</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 bg-slate-200/60 p-1 rounded-2xl text-xs">
        <button
          onClick={() => setActiveTab('my_appointments')}
          className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition ${
            activeTab === 'my_appointments' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CalendarCheck className="w-3.5 h-3.5" />
          <span>My Visits ({appointments.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('facility_directory')}
          className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition ${
            activeTab === 'facility_directory' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Facilities Directory ({PRELOADED_FACILITIES.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('waiting_list')}
          className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition ${
            activeTab === 'waiting_list' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Waiting Lists</span>
        </button>
      </div>

      {/* TAB 1: MY APPOINTMENTS */}
      {activeTab === 'my_appointments' && (
        <div className="space-y-3.5">
          {appointments.map((apt) => (
            <div
              key={apt.id}
              className="rounded-3xl bg-white p-5 border border-slate-200/80 shadow-sm space-y-3 hover:border-teal-500/40 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                      {apt.appointmentType.replace('_', ' ')}
                    </span>
                    <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full ${
                      apt.status === 'confirmed' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : apt.status === 'checked_in'
                        ? 'bg-teal-100 text-teal-800'
                        : apt.status === 'completed'
                        ? 'bg-slate-200 text-slate-700'
                        : apt.status === 'cancelled'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {apt.facilityName}
                  </h3>
                  <p className="text-xs text-slate-500">{apt.providerName}</p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-black text-teal-800 block">{apt.date}</span>
                  <span className="text-[11px] text-slate-500 font-mono">{apt.time}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl text-xs text-slate-700 border border-slate-200/60">
                <p><strong>Reason for Consultation:</strong> {apt.reason}</p>
                {apt.notes && <p className="text-[11px] text-slate-500 mt-1">Instructions: {apt.notes}</p>}
              </div>

              {/* Status workflow buttons */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400">Manage appointment status:</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <a
                    href={generateWhatsAppLink(
                      userProfile.phoneNumber,
                      `*Comfort Medi+ Appointment Reminder*\n🏥 Facility: ${apt.facilityName}\n👨‍⚕️ Provider: ${apt.providerName}\n📅 Date: ${apt.date}\n⏰ Time: ${apt.time}\n📋 Reason: ${apt.reason}`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-300 text-[11px] font-bold flex items-center gap-1 shadow-sm transition"
                    title="Send WhatsApp Reminder via Deep Link"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                  {apt.status === 'confirmed' && (
                    <button
                      onClick={() => updateAppointmentStatus(apt.id, 'checked_in')}
                      className="px-2.5 py-1 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold transition"
                    >
                      Check-In at Clinic
                    </button>
                  )}
                  {apt.status === 'checked_in' && (
                    <button
                      onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                      className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition"
                    >
                      Mark Completed
                    </button>
                  )}
                  {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                    <button
                      onClick={() => cancelAppointment(apt.id)}
                      className="px-2.5 py-1 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-[11px] font-semibold transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {appointments.length === 0 && (
            <div className="text-center py-12 text-xs text-slate-400 bg-white rounded-3xl border border-slate-200">
              No appointments booked yet. Browse facilities directory to schedule a consultation.
            </div>
          )}
        </div>
      )}

      {/* TAB 2: FACILITY DIRECTORY */}
      {activeTab === 'facility_directory' && (
        <div className="space-y-4">
          
          {/* Filters row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search facility name, specialty..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="w-full p-2 rounded-xl bg-white border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                {ZIMBABWE_PROVINCES.map((prov) => (
                  <option key={prov} value={prov}>{prov}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={facilityTypeFilter}
                onChange={(e) => setFacilityTypeFilter(e.target.value)}
                className="w-full p-2 rounded-xl bg-white border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                <option value="all">All Healthcare Facility Types</option>
                <option value="hospital">Hospitals</option>
                <option value="clinic">Clinics</option>
                <option value="pharmacy">Pharmacies</option>
                <option value="laboratory">Laboratories</option>
                <option value="specialist">Specialist Practices</option>
                <option value="home_care">Home Care Providers</option>
              </select>
            </div>
          </div>

          {/* Facility Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFacilities.map((facility) => (
              <div
                key={facility.id}
                className="rounded-3xl bg-white p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4 hover:border-teal-500/40 transition"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {facility.type.replace('_', ' ')}
                        </span>
                        {facility.hasEmergency24_7 && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                            24/7 Casualty
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-1">
                        {facility.name}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>{facility.address} • {facility.city}, {facility.province}</span>
                  </p>

                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{facility.operatingHours}</span>
                  </p>

                  {/* Specialties Pills */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {facility.specialties.map(spec => (
                      <span key={spec} className="px-2 py-0.5 rounded-lg bg-teal-50 text-teal-800 text-[10px] font-semibold">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <a
                    href={`tel:${facility.phone.replace(/\s+/g, '')}`}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <Phone className="w-3.5 h-3.5 text-teal-600" />
                    <span>Call Facility</span>
                  </a>

                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleOpenBooking(facility, true)}
                      className="px-2.5 py-1.5 rounded-xl border border-teal-200 text-teal-800 hover:bg-teal-50 text-xs font-semibold transition"
                      title="Join Waiting List if fully booked"
                    >
                      Waitlist
                    </button>
                    <button
                      onClick={() => handleOpenBooking(facility, false)}
                      className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm transition active:scale-95"
                    >
                      Book Visit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredFacilities.length === 0 && (
            <div className="text-center py-12 text-xs text-slate-400 bg-white rounded-3xl border border-slate-200">
              No healthcare facilities found matching your province or filters.
            </div>
          )}
        </div>
      )}

      {/* TAB 3: WAITING LISTS */}
      {activeTab === 'waiting_list' && (
        <div className="rounded-3xl bg-white p-5 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Waiting List Notification System</h3>
              <p className="text-[11px] text-slate-500">Auto-alerts when busy specialists or clinics open up slots</p>
            </div>
          </div>

          <div className="p-4 bg-teal-50/70 rounded-2xl border border-teal-200 text-xs text-teal-900 leading-relaxed">
            When public hospital specialist clinics (such as Cardiology, Ophthalmology, or Oncology at Parirenyatwa &amp; Mpilo) are fully booked, patients can join the waiting list. You will receive a WhatsApp alert as soon as an opening becomes available.
          </div>

          <div className="space-y-3">
            {appointments.filter(a => a.isWaitingList).map((waitApt) => (
              <div key={waitApt.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-slate-900">{waitApt.facilityName}</h4>
                  <p className="text-slate-500">{waitApt.providerName} • {waitApt.reason}</p>
                  <span className="text-[10px] text-teal-700 font-semibold">Priority Queue Active (WhatsApp notification enabled)</span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                  On Waitlist
                </span>
              </div>
            ))}

            {appointments.filter(a => a.isWaitingList).length === 0 && (
              <p className="text-xs text-slate-400 text-center py-6">
                You are currently not on any facility waiting lists.
              </p>
            )}
          </div>
        </div>
      )}

      {/* BOOK APPOINTMENT MODAL */}
      {bookingModalFacility && (
        <div 
          onClick={() => setBookingModalFacility(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {isWaitingListBooking ? 'Join Facility Waiting List' : 'Book Appointment'}
                </h3>
                <p className="text-xs text-teal-700 font-semibold">{bookingModalFacility.name}</p>
              </div>
              <button onClick={() => setBookingModalFacility(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                bookAppointment(newApt);
                setBookingModalFacility(null);
              }}
              className="mt-4 space-y-3 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Appointment Type</label>
                  <select
                    value={newApt.appointmentType}
                    onChange={(e) => setNewApt({ ...newApt, appointmentType: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    <option value="general_consultation">General Consultation</option>
                    <option value="follow_up">Follow-Up Visit</option>
                    <option value="vaccination">Vaccination</option>
                    <option value="lab_test">Laboratory Test</option>
                    <option value="specialist">Specialist Consultation</option>
                    <option value="mental_health">Mental Health Support</option>
                    <option value="home_visit">Home Visit Request</option>
                    <option value="telehealth">Telehealth Session</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Preferred Date</label>
                  <input
                    required
                    type="date"
                    value={newApt.date}
                    onChange={(e) => setNewApt({ ...newApt, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Time Slot</label>
                  <select
                    value={newApt.time}
                    onChange={(e) => setNewApt({ ...newApt, time: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    <option value="08:00 AM">08:00 AM - Morning Slot</option>
                    <option value="09:30 AM">09:30 AM - Morning Slot</option>
                    <option value="11:00 AM">11:00 AM - Late Morning</option>
                    <option value="02:00 PM">02:00 PM - Afternoon Slot</option>
                    <option value="03:30 PM">03:30 PM - Afternoon Slot</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Clinician / Unit</label>
                  <input
                    required
                    type="text"
                    value={newApt.providerName}
                    onChange={(e) => setNewApt({ ...newApt, providerName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Reason for Visit</label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. Regular blood pressure checkup, lab blood test review..."
                  value={newApt.reason}
                  onChange={(e) => setNewApt({ ...newApt, reason: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Special Clinical Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Patient requires wheelchair access, bring fasting sample"
                  value={newApt.notes}
                  onChange={(e) => setNewApt({ ...newApt, notes: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="p-3 bg-teal-50 rounded-2xl text-[11px] text-teal-800">
                A confirmation message will be prepared for WhatsApp and sent to your registered phone number.
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setBookingModalFacility(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-sm"
                >
                  {isWaitingListBooking ? 'Confirm Waitlist' : 'Confirm Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
