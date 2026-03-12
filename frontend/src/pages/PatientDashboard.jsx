import { useAuth } from '../hooks/useAuth';
import { useFetch } from '../hooks/useFetch';
import appointmentService from '../services/appointmentService';
import { 
  Calendar, 
  Clock, 
  FileText, 
  Activity, 
  MessageSquare, 
  PlusCircle, 
  ChevronRight,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { Link } from 'react-router-dom';

const PatientDashboard = () => {
  const { user } = useAuth();
  const { data: history, loading } = useFetch(() => appointmentService.getConsultationHistory(user.id), []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-navy-950">Hello, {user?.name} 👋</h1>
          <p className="text-slate-500 mt-1">Ready for your health checkup today?</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link to="/book-appointment" className="btn-primary flex items-center">
            <PlusCircle size={18} className="mr-2" />
            Book Appointment
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ActionCard 
              icon={<Activity className="text-teal-600" />} 
              title="Symptom Checker" 
              desc="Run a quick AI-powered diagnostic check"
              link="/symptom-checker"
              bgColor="bg-teal-50"
            />
            <ActionCard 
              icon={<MessageSquare className="text-lavender" />} 
              title="Consult History" 
              desc="Review your past medical consultations"
              link="#"
              bgColor="bg-lavender/10"
            />
          </div>

          {/* Medical History Table */}
          <div className="card !p-0 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-navy-950">Recent Medical History</h3>
              <button className="text-teal-600 font-bold text-sm hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-sm uppercase">
                  <tr>
                    <th className="px-6 py-4 font-bold">Date</th>
                    <th className="px-6 py-4 font-bold">Doctor ID</th>
                    <th className="px-6 py-4 font-bold">Type</th>
                    <th className="px-6 py-4 font-bold">Notes</th>
                    <th className="px-6 py-4 font-bold"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr><td colSpan="5" className="px-6 py-10 text-center text-slate-400">Loading history...</td></tr>
                  ) : history?.history?.length > 0 ? (
                    history.history.map((record) => (
                      <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-navy-900">{new Date(record.created_at).toLocaleDateString()}</span>
                            <span className="text-xs text-slate-400">{new Date(record.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-600">DR-{record.doctor_id}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${record.call_type === 'video' ? 'bg-teal-50 text-teal-600' : 'bg-lavender/10 text-lavender'}`}>
                            {record.call_type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 truncate max-w-[200px]">{record.doctor_notes || 'No notes available'}</td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-slate-400 hover:text-teal-600 transition-colors">
                            <ChevronRight size={20} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="5" className="px-6 py-10 text-center text-slate-400">No medical history found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-8">
          {/* Health Stats */}
          <div className="card">
            <h3 className="text-lg font-bold text-navy-950 mb-6 flex items-center">
              <TrendingUp className="mr-2 text-teal-600" size={20} />
              Health Metrics
            </h3>
            <div className="space-y-6">
              <MetricBar label="Physical Activity" value={75} color="bg-teal-500" />
              <MetricBar label="Heart Rate" value={60} color="bg-rose" />
              <MetricBar label="Sleep Quality" value={90} color="bg-lavender" />
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="card">
            <h3 className="text-lg font-bold text-navy-950 mb-6">Upcoming Appointments</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 rounded-xl bg-slate-50">
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  <Calendar className="text-teal-600" size={20} />
                </div>
                <div>
                  <p className="font-bold text-navy-900">Dr. Rahul Sharma</p>
                  <p className="text-sm text-slate-500 flex items-center mt-1">
                    <Clock size={14} className="mr-1" /> Today, 2:30 PM
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 rounded-xl border border-dashed border-slate-200">
                <div className="bg-slate-100 p-2 rounded-lg">
                  <PlusCircle className="text-slate-400" size={20} />
                </div>
                <div className="flex items-center">
                  <Link to="/book-appointment" className="text-sm font-bold text-teal-600 hover:underline">Schedule next visit</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ActionCard = ({ icon, title, desc, link, bgColor }) => (
  <Link to={link} className="card flex items-start space-x-5 hover:border-teal-500/30">
    <div className={`p-4 rounded-2xl ${bgColor}`}>
      {icon}
    </div>
    <div>
      <h4 className="text-lg font-bold text-navy-950 mb-1">{title}</h4>
      <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
    </div>
  </Link>
);

const MetricBar = ({ label, value, color }) => (
  <div>
    <div className="flex justify-between text-sm mb-2">
      <span className="font-semibold text-slate-600">{label}</span>
      <span className="font-bold text-navy-900">{value}%</span>
    </div>
    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full`} style={{ width: `${value}%` }}></div>
    </div>
  </div>
);

export default PatientDashboard;
