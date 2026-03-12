import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-navy-950 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-navy-800 pb-12 mb-10">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <div className="bg-teal-600 p-2 rounded-lg">
                <Heart className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight">
                Warriors<span className="text-teal-400">Health</span>
              </span>
            </Link>
            <p className="text-slate-400 leading-relaxed">
              Modern healthcare accessibility for rural and urban warriors. Connecting patients with expert care.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-teal-400 mb-6">Services</h4>
            <ul className="space-y-4 text-slate-400">
              <li><Link to="/symptom-checker" className="hover:text-white transition-colors">Symptom Checker</Link></li>
              <li><Link to="/book-appointment" className="hover:text-white transition-colors">Tele-Consultation</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Pharmacy Search</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Rural Outreach</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-teal-400 mb-6">Company</h4>
            <ul className="space-y-4 text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-teal-400 mb-6">Newsletter</h4>
            <p className="text-slate-400 mb-4">Stay updated with latest healthcare tips.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-navy-900 border border-navy-800 rounded-l-lg px-4 py-2 w-full focus:outline-none focus:border-teal-500"
              />
              <button className="bg-teal-600 px-4 py-2 rounded-r-lg hover:bg-teal-500 transition-colors">Join</button>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
          <p>© 2026 Warriors Healthtech. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">Twitter</a>
            <a href="#" className="hover:text-white">LinkedIn</a>
            <a href="#" className="hover:text-white">Facebook</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
