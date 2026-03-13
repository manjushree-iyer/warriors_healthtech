import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import symptomService from '../services/symptomService';
import { 
  Activity, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  AlertCircle,
  Stethoscope,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

const SymptomChecker = () => {
  const { user } = useAuth();
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setLoading(true);
    try {
      const res = await symptomService.checkSymptoms(symptoms, user?.id);
      setResults(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <div className="inline-flex p-3 rounded-2xl bg-teal-50 text-teal-600 mb-6">
          <Bot size={32} />
        </div>
        <h1 className="text-4xl font-extrabold text-navy-950">AI Symptom Assistant</h1>
        <p className="text-slate-500 mt-2 max-w-xl mx-auto text-lg leading-relaxed">
          Describe how you're feeling and our AI will analyze your symptoms to provide initial triage and recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Input Section */}
        <div className="card h-full flex flex-col">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-teal-600">
              <User size={18} />
            </div>
            <h3 className="text-xl font-bold text-navy-950">Describe Symptoms</h3>
          </div>

          <form onSubmit={handleCheck} className="flex-grow flex flex-col space-y-6">
            <textarea 
              className="input-field flex-grow min-h-[250px] resize-none text-lg"
              placeholder="Example: I have been feeling a dull pain in my chest for the last 2 hours and feeling slightly dizzy..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              required
            ></textarea>

            <button 
              type="submit" 
              disabled={loading || !symptoms.trim()}
              className="w-full btn-primary py-4 flex items-center justify-center text-lg group"
            >
              {loading ? <Loader2 className="animate-spin mr-2" /> : (
                <>
                  Analyze Symptoms
                  <Send size={20} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Section */}
        <div className="h-full">
          {results ? (
            <div className="card h-full bg-navy-950 text-white animate-in fade-in slide-in-from-right duration-500">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400">
                  <Activity size={18} />
                </div>
                <h3 className="text-xl font-bold uppercase tracking-wider text-teal-400">Analysis Results</h3>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-4">Initial Assessment</label>
                  <div className="p-6 rounded-2xl bg-navy-900 border border-navy-800">
                    <p className="text-lg leading-relaxed text-teal-50">{results.analysis || results.result}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-navy-900 border-l-4 border-amber">
                    <p className="text-xs text-amber font-bold uppercase mb-1">Risk Level</p>
                    <p className="text-lg font-bold">{results.risk_level || 'Moderate'}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-navy-900 border-l-4 border-teal-500">
                    <p className="text-xs text-teal-400 font-bold uppercase mb-1">Recommended</p>
                    <p className="text-lg font-bold">Consult GP</p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-4">Next Steps</label>
                  <ul className="space-y-3">
                    <li className="flex items-center text-slate-300">
                      <ChevronRight size={16} className="text-teal-500 mr-2" />
                      Keep track of blood pressure every hour.
                    </li>
                    <li className="flex items-center text-slate-300">
                      <ChevronRight size={16} className="text-teal-500 mr-2" />
                      Schedule a virtual visit with our doctor.
                    </li>
                  </ul>
                </div>

                <div className="pt-6 border-t border-navy-800 mt-4">
                  <button className="w-full btn-primary py-3 hover:bg-teal-400 bg-teal-500 border-none">
                    Book Consultation Now
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="card h-full border-dashed border-2 flex flex-col items-center justify-center text-center p-12 bg-slate-50/50">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                <Stethoscope size={40} className="text-slate-300" />
              </div>
              <h4 className="text-xl font-bold text-navy-900 mb-2">Ready for Analysis</h4>
              <p className="text-slate-500">Submit your symptoms on the left to see the AI assessment here.</p>
              
              <div className="mt-12 flex items-center space-x-2 text-xs text-slate-400 bg-white px-4 py-2 rounded-full border border-slate-100">
                <ShieldCheck size={14} className="text-emerald" />
                <span>HIPAA Compliant Data Processing</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;
