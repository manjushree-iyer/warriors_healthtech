import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Lock, Mail, ArrowRight, Loader2, AlertCircle, Fingerprint } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '', abha_id: '' });
  const [isAbhaLogin, setIsAbhaLogin] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const payload = isAbhaLogin 
        ? { abha_id: formData.abha_id, password: formData.password }
        : { email: formData.email, password: formData.password };
      
      const res = await login(payload);
      navigate(`/${res.user.role}-dashboard`);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl shadow-navy-950/5 border border-slate-100">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-navy-950">Welcome Back</h2>
          <p className="mt-2 text-slate-500">Access your medical dashboard</p>
        </div>

        <div className="flex p-1 bg-slate-100 rounded-xl mb-8">
          <button 
            onClick={() => setIsAbhaLogin(false)}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${!isAbhaLogin ? 'bg-white shadow-sm text-teal-600' : 'text-slate-500'}`}
          >
            Email Login
          </button>
          <button 
            onClick={() => setIsAbhaLogin(true)}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${isAbhaLogin ? 'bg-white shadow-sm text-teal-600' : 'text-slate-500'}`}
          >
            ABHA ID
          </button>
        </div>

        {error && (
          <div className="bg-rose/10 border border-rose/20 text-rose px-4 py-3 rounded-xl flex items-center space-x-2">
            <AlertCircle size={20} />
            <p className="text-sm font-semibold">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {isAbhaLogin ? (
              <div className="relative">
                <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  required
                  placeholder="ABHA ID (14 digits)"
                  className="input-field pl-12"
                  value={formData.abha_id}
                  onChange={(e) => setFormData({ ...formData, abha_id: e.target.value })}
                />
              </div>
            ) : (
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="email"
                  required
                  placeholder="Email address"
                  className="input-field pl-12"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            )}
            
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="password"
                required
                placeholder="Password"
                className="input-field pl-12"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary py-4 flex items-center justify-center group"
          >
            {isLoading ? <Loader2 className="animate-spin mr-2" /> : (
              <>
                Sign In
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-slate-500">
          Don't have an account? <Link to="/register" className="text-teal-600 font-bold hover:underline">Register now</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
