import { useAuth } from '../hooks/useAuth';
import { useFetch } from '../hooks/useFetch';
import appointmentService from '../services/appointmentService';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  Video, 
  FileText, 
  AlertCircle,
  MoreVertical,
  Play
} from 'lucide-react';
import { useState } from 'react';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const { data: queueData, loading, executeFetch: refreshQueue } = useFetch(appointmentService.getDoctorQueue, []);
  const [activeConsultation, setActiveConsultation] = useState(null);

  const handleStartConsultation = async (appointment) => {
    try {
      const res = await appointmentService.startConsultation({
        appointment_id: appointment.id,
        call_type: 'video'
      });
      setActiveConsultation({ ...res.consultation, patient: res.patient_records });
      refreshQueue();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-navy-950">Doctor's Terminal</h1>
        <p className="text-slate-500 mt-1">Manage your patients and consultations efficiently.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Stats Summary */}
        <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatMiniCard icon={<Users className="text-teal-600" />} label="Total Patients" value="1,280" />
          <StatMiniCard icon={<Clock className="text-amber" />} label="Waitlist" value={queueData?.queue?.length || 0} />
          <StatMiniCard icon={<CheckCircle className="text-emerald" />} label="Completed Today" value="12" />
        </div>

        {/* Patient Queue */}
        <div className="lg:col-span-3">
          <div className="card !p-0">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-navy-950">Upcoming Consultation Queue</h3>
              <div className="flex space-x-2">
                <span className="bg-teal-50 text-teal-600 px-3 py-1 rounded-full text-xs font-bold">LIVE</span>
              </div>
            </div>
            
            <div className="divide-y divide-slate-100">
              {loading ? (
                <div className="p-10 text-center text-slate-400">Updating queue...</div>
              ) : queueData?.queue?.length > 0 ? (
                queueData.queue.map((appt) => (
                  <div key={appt.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-bold text-navy-900 border border-slate-200">
                        P{appt.patient_id}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-bold text-navy-900">Patient #{appt.patient_id}</p>
                          <span className="text-xs font-bold text-slate-400">• Registered via Web</span>
                        </div>
                        <p className="text-sm text-slate-500 flex items-center mt-1">
                          <Clock size={14} className="mr-1" /> Scheduled for {new Date(appt.scheduled_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => handleStartConsultation(appt)}
                        className="bg-teal-600 text-white px-4 py-2 rounded-lg font-bold shadow-sm hover:bg-teal-500 flex items-center"
                      >
                        <Play size={16} className="mr-2" /> Start Call
                      </button>
                      <button className="p-2 text-slate-400 hover:text-navy-900">
                        <MoreVertical size={20} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-20 text-center">
                  <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="text-slate-300" size={32} />
                  </div>
                  <h4 className="text-lg font-bold text-navy-900">All caught up!</h4>
                  <p className="text-slate-500">No pending appointments in your queue.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card bg-navy-900 text-white">
            <h4 className="font-bold mb-4 flex items-center">
              <AlertCircle size={18} className="mr-2 text-amber" />
              Critical Alerts
            </h4>
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-navy-800 border-l-4 border-rose">
                <p className="text-xs text-rose font-bold uppercase">High Priority</p>
                <p className="text-sm font-medium mt-1">Patient #403 reports severe chest pain.</p>
              </div>
              <div className="p-3 rounded-lg bg-navy-800 border-l-4 border-amber">
                <p className="text-xs text-amber font-bold uppercase">Follow-up</p>
                <p className="text-sm font-medium mt-1">Review lab results for Patient #221.</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h4 className="font-bold text-navy-950 mb-4">Quick Tools</h4>
            <div className="space-y-2">
              <QuickTool icon={<Video size={16} />} label="Meeting Room" />
              <QuickTool icon={<FileText size={16} />} label="Prescription Hub" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatMiniCard = ({ icon, label, value }) => (
  <div className="card flex items-center space-x-4">
    <div className="p-3 rounded-xl bg-slate-50">{icon}</div>
    <div>
      <p className="text-sm text-slate-500 font-semibold">{label}</p>
      <p className="text-2xl font-extrabold text-navy-950 leading-none mt-1">{value}</p>
    </div>
  </div>
);

const QuickTool = ({ icon, label }) => (
  <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 text-slate-600 font-semibold transition-colors">
    {icon}
    <span>{label}</span>
  </button>
);

export default DoctorDashboard;
