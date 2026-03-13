import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Heart, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 glass-effect border-b border-navy-800/5 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-teal-600 p-2 rounded-lg">
              <Heart className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-extrabold text-navy-900 tracking-tight">
              Warriors<span className="text-teal-600">Health</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-slate-500 hover:text-teal-600 font-medium transition-colors">Home</Link>
            {isAuthenticated ? (
              <>
                <Link to={`/${user.role}-dashboard`} className="text-slate-500 hover:text-teal-600 font-medium transition-colors">Dashboard</Link>
                {user.role === 'patient' && (
                  <>
                    <Link to="/book-appointment" className="text-slate-500 hover:text-teal-600 font-medium transition-colors">Book Appointment</Link>
                    <Link to="/symptom-checker" className="text-slate-500 hover:text-teal-600 font-medium transition-colors">Symptom Checker</Link>
                  </>
                )}
                <div className="flex items-center space-x-4 border-l border-slate-200 pl-8">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                      <User size={18} />
                    </div>
                    <span className="text-navy-900 font-semibold">{user.name}</span>
                  </div>
                  <button onClick={handleLogout} className="text-slate-500 hover:text-rose transition-colors">
                    <LogOut size={20} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-slate-500 hover:text-teal-600 font-medium">Login</Link>
                <Link to="/register" className="btn-primary">Get Started</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-navy-900">
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-xl p-4 flex flex-col space-y-4">
          <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
          {isAuthenticated ? (
            <>
              <Link to={`/${user.role}-dashboard`} onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
              <button onClick={handleLogout} className="text-left text-rose">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)} className="btn-primary text-center">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
