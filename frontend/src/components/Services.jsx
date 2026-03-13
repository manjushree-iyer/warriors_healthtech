import { Activity, Zap, Star, Shield, ArrowRight } from "lucide-react";

const ServiceCard = ({ icon: Icon, title, description }) => (
  <div className="group bg-white rounded-2xl p-6 border border-white/10 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
    <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-teal-600 transition-colors duration-300">
      <Icon className="text-teal-600 w-6 h-6 group-hover:text-white transition-colors duration-300" />
    </div>
    <h3 className="font-heading text-[15px] font-bold text-navy-900 mb-3">{title}</h3>
    <p className="font-dm text-[13px] text-slate-500 leading-relaxed mb-4">{description}</p>
    <button className="text-teal-600 font-heading text-[12px] font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
      Learn More <ArrowRight className="w-3 h-3" />
    </button>
  </div>
);

const Services = () => {
  return (
    <section className="bg-navy-900 py-16 sm:py-24 relative overflow-hidden z-10">
      {/* Hex Texture Overlay */}
      <div className="absolute inset-0 hex-bg opacity-10 pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <div className="text-teal-400 font-heading text-[10px] sm:text-[11px] font-bold uppercase tracking-widest mb-3">
              Our Services
            </div>
            <h2 className="text-white font-heading text-3xl sm:text-4xl font-extrabold leading-tight mb-4">
              Full Range of <br className="hidden sm:block" />
              <span className="text-teal-400">Clinical Services</span>
            </h2>
            <p className="text-slate-400 font-dm text-sm sm:text-base leading-relaxed mb-6 max-w-lg mx-auto lg:mx-0">
              Comprehensive medical services across multiple disciplines, combining clinical expertise with state-of-the-art diagnostic technology.
            </p>
            <button className="inline-flex items-center gap-2 text-white font-heading font-bold text-sm hover:text-teal-400 group transition-all">
              Explore More Services <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <ServiceCard 
              icon={Activity} 
              title="Emergency 24/7" 
              description="Rapid response medical teams available round the clock for critical care needs."
            />
            <ServiceCard 
              icon={Zap} 
              title="Radiology & Imaging" 
              description="Advanced diagnostic imaging including MRI, CT scans, and digital X-rays."
            />
            <ServiceCard 
              icon={Star} 
              title="Laboratory Services" 
              description="Comprehensive testing and pathological analysis with rapid results."
            />
            <ServiceCard 
              icon={Shield} 
              title="Pharmacy" 
              description="Fully stocked institutional pharmacy providing precise medication management."
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
