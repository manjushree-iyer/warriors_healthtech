import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
            <Plus className="text-white w-5 h-5" strokeWidth={3} />
          </div>
          <span className="font-heading text-[16px] sm:text-[18px] font-extrabold text-navy-900 tracking-tight">
            Medi<span className="text-teal-600">Care+</span>
          </span>
        </Link>

        {/* Links - Hidden on Mobile */}
        <div className="hidden lg:flex items-center gap-8 flex-1 justify-center">
          {['Home', 'Services', 'About', 'Blog', 'Contact Us'].map((item) => (
            <Link 
              key={item} 
              to="/" 
              className="font-dm text-xs sm:text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-500 transition-all group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden lg:flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span className="font-heading text-[10px] font-bold text-emerald-700">2,500+ Doctors</span>
          </div>
          
          <Link to="/login" className="font-heading text-xs sm:text-sm font-bold text-teal-600 hover:text-teal-700 transition-colors">
            Sign In
          </Link>
          
          <Link 
            to="/register" 
            className="hidden sm:inline-flex border-2 border-teal-600 text-teal-600 bg-transparent hover:bg-teal-600 hover:text-white rounded-full px-5 py-2 font-heading text-xs sm:text-sm font-bold transition-all hover:shadow-teal-cta"
          >
            Book Appointment
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
