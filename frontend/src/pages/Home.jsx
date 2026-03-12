import { ArrowRight, Shield, Zap, Heart, Activity, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import CountUp from 'react-countup';

const Home = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-teal-50/50 to-transparent -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-white border border-slate-200 px-4 py-2 rounded-full mb-8 shadow-sm">
            <span className="bg-teal-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">New</span>
            <span className="text-sm font-semibold text-navy-900">Virtual consultations now available 24/7</span>
          </div>
          
          <h1 className="text-[52px] md:text-[72px] font-extrabold text-navy-950 leading-[1.1] mb-8 tracking-tight">
            Healthcare designed for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-400">Rural & Urban Warriors</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl text-slate-500 mb-10 leading-relaxed">
            Experience the next generation of healthcare. From AI-powered triage to instant specialist access, we bring world-class medical care to your doorstep.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/register" className="btn-primary flex items-center group">
              Start Your Journey
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login" className="btn-secondary">Explore Features</Link>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 max-w-4xl mx-auto">
            <StatCard label="Patients Trusted" value={50} suffix="K+" />
            <StatCard label="Specialists" value={120} suffix="+" />
            <StatCard label="Villages Covered" value={850} suffix="+" />
            <StatCard label="Response Time" value={15} suffix="min" />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-navy-950 mb-4">Comprehensive Solutions</h2>
            <p className="text-slate-500 text-lg">Everything you need for a healthier life, all in one place.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ServiceCard 
              icon={<Shield className="text-teal-600" />} 
              title="AI Symptom Checker" 
              desc="Instant triage powered by advanced AI. Get preliminary advice before seeing a doctor."
              link="/symptom-checker"
            />
            <ServiceCard 
              icon={<Zap className="text-amber" />} 
              title="Instant Bookings" 
              desc="Book appointments with top specialists across the country in seconds."
              link="/book-appointment"
            />
            <ServiceCard 
              icon={<Search className="text-lavender" />} 
              title="Pharmacy Locator" 
              desc="Find medicines and health supplies at your nearest pharmacy with real-time stock info."
              link="/pharmacy-dashboard"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy-950 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-8">Ready to transform your health?</h2>
          <p className="text-slate-400 text-xl mb-10 max-w-2xl mx-auto">
            Join thousands of others who have switched to a smarter, faster, and more reliable way of managing their health.
          </p>
          <Link to="/register" className="bg-teal-500 hover:bg-teal-400 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all inline-block shadow-lg shadow-teal-500/20">
            Create Free Account
          </Link>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-lavender/10 blur-[100px] rounded-full"></div>
      </section>
    </div>
  );
};

const StatCard = ({ label, value, suffix }) => (
  <div className="p-4">
    <div className="text-4xl font-extrabold text-navy-950 mb-1 font-mono">
      <CountUp end={value} duration={2.5} />{suffix}
    </div>
    <div className="text-slate-500 font-semibold">{label}</div>
  </div>
);

const ServiceCard = ({ icon, title, desc, link }) => (
  <Link to={link} className="card group">
    <div className="bg-slate-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-50 transition-colors">
      {icon}
    </div>
    <h3 className="text-2xl font-bold text-navy-950 mb-4">{title}</h3>
    <p className="text-slate-500 leading-relaxed mb-6">{desc}</p>
    <div className="flex items-center text-teal-600 font-bold group-hover:translate-x-1 transition-transform">
      Learn more <ArrowRight size={18} className="ml-2" />
    </div>
  </Link>
);

export default Home;
