import { Play, Heart } from "lucide-react";

const Hero = () => {
  return (
    <section id="hero" className="relative w-full bg-gradient-to-br from-slate-50 via-white to-teal-50/40 overflow-hidden pt-24 pb-16 md:pt-32 md:pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
          
          {/* Left Side: Content */}
          <div className="flex-1 text-center md:text-left animate-[fade-in_0.6s_ease-out_forwards]">
            {/* Compliance Badge */}
            <div className="inline-flex items-center gap-2 bg-white border border-slate-200 shadow-sm rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
              <span className="font-heading text-[10px] sm:text-[11px] font-bold text-navy-900 uppercase tracking-widest leading-none">
                HIPAA · FHIR R4 · ISO 27001
              </span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-navy-900 leading-tight tracking-tight mb-6">
              Advanced Care For a <span className="text-teal-600 block md:inline">Healthier Tomorrow</span>
            </h1>

            <p className="font-dm text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto md:mx-0 mb-8">
              Personalized healthcare solutions powered by advanced technology and medical expertise. Experience the future of clinical excellence today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 sm:gap-4">
              <button className="w-full sm:w-auto bg-teal-600 text-white rounded-full px-8 py-3 font-heading font-bold text-sm sm:text-base hover:bg-teal-700 hover:shadow-teal-cta hover:scale-[1.02] active:scale-[0.98] transition-all">
                Get Started Now
              </button>
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border-2 border-slate-200 rounded-full px-8 py-3 font-heading font-bold text-sm sm:text-base hover:border-teal-400 hover:text-teal-600 hover:scale-[1.02] active:scale-[0.98] transition-all group">
                <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
                  <Play className="text-white w-2.5 h-2.5 fill-current ml-0.5" />
                </div>
                Watch Demo
              </button>
            </div>
          </div>

          {/* Right Side: Visual - Hidden on mobile */}
          <div className="hidden lg:flex flex-1 justify-center items-center">
            <div className="relative w-full max-w-xs aspect-square">
              <div className="absolute inset-0 bg-teal-500/5 rounded-full animate-pulse"></div>
              <div className="absolute inset-4 border-2 border-dashed border-teal-500/10 rounded-full animate-[spin_30s_linear_infinite]"></div>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center mb-4">
                  <Heart className="w-10 h-10 text-teal-600" />
                </div>
                <div className="bg-navy-900 px-3 py-1 rounded-full">
                  <span className="text-white font-heading text-[9px] font-bold uppercase">Expert Care</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
