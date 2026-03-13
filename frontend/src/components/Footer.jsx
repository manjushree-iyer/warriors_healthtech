import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-navy-950 text-white py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col lg:flex-row justify-between gap-8 sm:gap-12 mb-8 sm:mb-12">
          {/* Brand */}
          <div className="max-w-sm text-center lg:text-left mx-auto lg:mx-0">
            <Link to="/" className="flex items-center justify-center lg:justify-start gap-2 mb-4">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                <Plus className="text-white w-5 h-5" strokeWidth={3} />
              </div>
              <span className="font-heading text-base sm:text-lg font-extrabold">
                Medi<span className="text-teal-400">Care+</span>
              </span>
            </Link>
            <p className="font-dm text-xs sm:text-sm text-slate-400 leading-relaxed">
              Leading the way in medical excellence, MediCare+ provides advanced diagnostic and treatment solutions for a healthier tomorrow.
            </p>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 sm:flex sm:justify-center lg:justify-start gap-6 sm:gap-12 lg:gap-16">
            <div>
              <h4 className="font-heading text-[10px] sm:text-[11px] font-bold uppercase tracking-widest mb-4">Platform</h4>
              <ul className="space-y-3">
                {['Direct Care', 'Mental Health', 'Radiology', 'Appointments'].map((link) => (
                  <li key={link}>
                    <Link to="/" className="font-dm text-xs sm:text-sm text-slate-400 hover:text-teal-400 transition-colors">{link}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-heading text-[10px] sm:text-[11px] font-bold uppercase tracking-widest mb-4">Company</h4>
              <ul className="space-y-3">
                {['About Us', 'Careers', 'Contact', 'Blog'].map((link) => (
                  <li key={link}>
                    <Link to="/" className="font-dm text-xs sm:text-sm text-slate-400 hover:text-teal-400 transition-colors">{link}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 text-center md:text-left">
          <p className="font-dm text-[11px] sm:text-xs text-slate-500">
            © 2026 MediCare+ Health Systems. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {['HIPAA Compliant', 'FHIR R4', 'ISO 27001'].map((badge) => (
              <span key={badge} className="bg-teal-600/10 border border-teal-600/20 rounded-full px-2 sm:px-3 py-1 text-[9px] sm:text-[10px] font-bold text-teal-400 uppercase tracking-wide whitespace-nowrap">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
