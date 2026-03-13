import { Brain, ShieldCheck, Activity } from "lucide-react";

const WhyChooseUs = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Diagnostics",
      description: "Our advanced algorithms assist doctors in detecting patterns and anomalies with unprecedented precision."
    },
    {
      icon: ShieldCheck,
      title: "FHIR Compliant Records",
      description: "Your health data is synchronized securely across systems using industry-standard FHIR protocol."
    },
    {
      icon: Activity,
      title: "Real-Time Monitoring",
      description: "Continuous health tracking that alerts medical teams to changes in patient status immediately."
    }
  ];

  return (
    <section className="bg-slate-50/70 py-16 sm:py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <div className="text-teal-600 font-heading text-[10px] sm:text-[11px] font-bold uppercase tracking-widest mb-2">
            Why MediCare+
          </div>
          <h2 className="text-navy-900 font-heading text-3xl sm:text-4xl font-extrabold mb-3">
            Built for Clinical Excellence
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="card-premium p-4 sm:p-6 text-center group">
              <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-teal-600 transition-colors duration-300">
                <feature.icon className="text-teal-600 w-6 h-6 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="font-heading text-sm sm:text-base font-bold text-navy-900 mb-2">
                {feature.title}
              </h3>
              <p className="font-dm text-xs sm:text-sm text-slate-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
