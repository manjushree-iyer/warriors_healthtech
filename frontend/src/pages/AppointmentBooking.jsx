import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import appointmentService from '../services/appointmentService';
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  Shield, 
  ChevronRight, 
  CheckCircle2, 
  ArrowLeft,
  Loader2
} from 'lucide-react';

const AppointmentBooking = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    doctor_id: '1', // Defaulting for demo
    specialization: '',
    scheduled_time: '',
    notes: ''
  });

  const doctors = [
    { id: '1', name: 'Dr. Rahul Sharma', spec: 'Cardiologist', hospital: 'City Health' },
    { id: '2', name: 'Dr. Priya Mani', spec: 'Dermatologist', hospital: 'Metro Clinic' },
    { id: '3', name: 'Dr. Ajay Verma', spec: 'General Physician', hospital: 'Village Outreach' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await appointmentService.createAppointment({
        doctor_id: parseInt(formData.doctor_id),
        scheduled_time: formData.scheduled_time
      });
      setStep(3); // Success step
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="mb-12">
        <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-navy-950 mb-6 font-semibold transition-colors">
          <ArrowLeft size={20} className="mr-2" /> Back
        </button>
        <h1 className="text-4xl font-extrabold text-navy-950">Secure Your Slot</h1>
        <p className="text-slate-500 mt-2">Book a consultation with certified healthcare specialists.</p>
      </div>

      {/* Progress Stepper */}
      <div className="flex items-center justify-between mb-16 max-w-lg mx-auto">
        <StepIndicator num={1} active={step >= 1} label="Specialist" />
        <div className={`h-1 flex-1 mx-4 rounded-full ${step >= 2 ? 'bg-teal-600' : 'bg-slate-100'}`}></div>
        <StepIndicator num={2} active={step >= 2} label="Schedule" />
        <div className={`h-1 flex-1 mx-4 rounded-full ${step >= 3 ? 'bg-teal-600' : 'bg-slate-100'}`}></div>
        <StepIndicator num={3} active={step >= 3} label="Finish" />
      </div>

      <div className="card">
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-navy-950 mb-8">Select a Specialist</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doctors.map((doc) => (
                <div 
                  key={doc.id}
                  onClick={() => {
                    setFormData({ ...formData, doctor_id: doc.id });
                    setStep(2);
                  }}
                  className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between group ${formData.doctor_id === doc.id ? 'border-teal-500 bg-teal-50/30' : 'border-slate-100 hover:border-teal-200'}`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center text-teal-600 border border-slate-100 group-hover:scale-110 transition-transform">
                      <User size={28} />
                    </div>
                    <div>
                      <p className="font-bold text-navy-950">{doc.name}</p>
                      <p className="text-sm text-slate-500">{doc.spec}</p>
                      <p className="text-xs text-slate-400 mt-1 flex items-center">
                        <MapPin size={12} className="mr-1" /> {doc.hospital}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-slate-300 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-bold text-navy-900 mb-3 uppercase tracking-wider">Consultation Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="date" 
                    required
                    className="input-field pl-12"
                    onChange={(e) => setFormData({ ...formData, scheduled_time: `${e.target.value}T10:00:00Z` })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-navy-900 mb-3 uppercase tracking-wider">Preferred Time</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <select required className="input-field pl-12 appearance-none">
                    <option>09:00 AM</option>
                    <option>10:00 AM</option>
                    <option>11:30 AM</option>
                    <option>02:00 PM</option>
                    <option>04:30 PM</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-navy-900 mb-3 uppercase tracking-wider">Additional Notes (Optional)</label>
              <textarea 
                className="input-field min-h-[120px] resize-none"
                placeholder="Briefly describe your symptoms or concerns..."
              ></textarea>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button 
                type="button"
                onClick={() => setStep(1)}
                className="text-slate-500 font-bold hover:text-navy-950 transition-colors"
              >
                Go Back
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="btn-primary px-10 py-4 flex items-center"
              >
                {loading ? <Loader2 className="animate-spin mr-2" /> : 'Confirm Booking'}
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="py-12 text-center">
            <div className="w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <CheckCircle2 className="text-teal-600" size={48} />
            </div>
            <h3 className="text-3xl font-extrabold text-navy-950 mb-4">Appointment Confirmed!</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-10 leading-relaxed text-lg">
              Your session has been successfully scheduled. We've sent a confirmation email with details on how to join the call.
            </p>
            <div className="flex justify-center space-x-4">
              <button onClick={() => navigate('/patient-dashboard')} className="btn-primary">Go to Dashboard</button>
              <button className="btn-secondary">Add to Calendar</button>
            </div>
          </div>
        )}
      </div>

      {/* Safety Badge */}
      <div className="mt-12 flex justify-center">
        <div className="inline-flex items-center space-x-3 text-slate-400 font-medium">
          <Shield size={20} className="text-teal-600" />
          <span>All our specialists are verified and consultations are 256-bit encrypted.</span>
        </div>
      </div>
    </div>
  );
};

const StepIndicator = ({ num, active, label }) => (
  <div className="flex flex-col items-center space-y-2">
    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${active ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20 scale-110' : 'bg-slate-100 text-slate-400'}`}>
      {num}
    </div>
    <span className={`text-sm font-bold ${active ? 'text-navy-900' : 'text-slate-400'}`}>{label}</span>
  </div>
);

export default AppointmentBooking;
