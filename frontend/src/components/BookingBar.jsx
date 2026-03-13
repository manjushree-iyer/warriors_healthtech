const BookingBar = () => {
  return (
    <section id="booking-section" className="bg-slate-50/50 py-16 sm:py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="bg-navy-900 rounded-2xl p-4 sm:p-6 lg:p-6 shadow-2xl flex flex-col lg:flex-row items-center gap-6 lg:gap-4">
          <div className="flex-shrink-0 text-center lg:text-left">
            <div className="text-teal-400 font-heading text-[10px] sm:text-[11px] font-bold uppercase tracking-widest mb-1">
              Find Your Care
            </div>
            <div className="text-white font-heading text-base sm:text-lg font-extrabold">
              Book Appointment
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
            {[ 
              { label: "Select Department", options: ["Cardiology", "Neurology"] },
              { label: "Select Doctor", options: ["Dr. Smith", "Dr. Jones"] },
              { label: "Select Date", options: [] },
              { label: "Select Location", options: [] }
            ].map((item, i) => (
              <div key={i} className="relative group">
                <select className="bg-white/5 text-white border border-white/10 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 font-dm text-xs sm:text-sm w-full hover:bg-white/10 focus:ring-2 focus:ring-teal-500/50 outline-none transition-all appearance-none cursor-pointer">
                  <option className="bg-navy-900">{item.label}</option>
                  {item.options.map(opt => <option key={opt} className="bg-navy-900">{opt}</option>)}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full lg:w-auto bg-teal-500 text-white rounded-xl px-8 sm:px-10 py-2.5 sm:py-3 font-heading font-bold text-xs sm:text-sm hover:bg-teal-400 hover:shadow-teal-cta hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap">
            Find Now
          </button>
        </div>
      </div>
    </section>
  );
};;

export default BookingBar;
