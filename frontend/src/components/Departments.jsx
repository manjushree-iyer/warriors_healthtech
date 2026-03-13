import { useState } from "react";

const DepartmentIcon = ({ type }) => {
  const icons = {
    heart: (
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    ),
    brain: (
      <path d="M9.5 2.1a5 5 0 0 1 5 0 5 5 0 0 1 2.5 4.3v.6a5 5 0 0 1 3 4.5 5 5 0 0 1-5 5h-10a5 5 0 0 1-5-5 5 5 0 0 1 3-4.5v-.6a5 5 0 0 1 2.5-4.3z" />
    ),
    lungs: (
      <path d="M7 2a5 5 0 0 0-5 5v11a2 2 0 0 0 2 2h3a2 2 0 0 0 2-2V7a5 5 0 0 0-5-5zm10 0a5 5 0 0 1 5 5v11a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2V7a5 5 0 0 1 5-5z" />
    ),
    kidney: (
      <path d="M12 2a5 5 0 0 0-5 5c0 4 2 6 5 10 3-4 5-6 5-10a5 5 0 0 0-5-5z" />
    ),
    dental: (
      <path d="M7 3a4 4 0 0 0-4 4v2c0 5 4 11 9 12 5-1 9-7 9-12V7a4 4 0 0 0-4-4H7z" />
    ),
    bone: (
      <path d="M17 3a3 3 0 0 0-3 3 3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
    ),
  };

  return (
    <svg 
      viewBox="0 0 24 24" 
      className="w-10 h-10 transition-colors"
      stroke="currentColor" 
      strokeWidth="1.8" 
      fill="none" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      {icons[type] || <circle cx="12" cy="12" r="10" />}
    </svg>
  );
};

const Departments = () => {
  const [active, setActive] = useState("Heart");

  const depts = [
    { name: "Heart", type: "heart" },
    { name: "Brain", type: "brain" },
    { name: "Lungs", type: "lungs" },
    { name: "Kidney", type: "kidney" },
    { name: "Dental", type: "dental" },
    { name: "Orthopedic", type: "bone" },
  ];

  return (
    <section className="bg-white py-16 sm:py-24 relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <div className="text-teal-600 font-heading text-[10px] sm:text-[11px] font-bold uppercase tracking-widest mb-2">
            Specialties
          </div>
          <h2 className="text-navy-900 font-heading text-3xl sm:text-4xl font-extrabold mb-3">
            Browse by Specialty
          </h2>
          <p className="text-slate-500 font-dm text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            Find the right care from our comprehensive range of medical departments staffed by experienced specialists.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {depts.map((dept) => (
            <button
              key={dept.name}
              onClick={() => setActive(dept.name)}
              className={`group flex flex-col items-center gap-3 rounded-xl p-4 sm:p-5 transition-all duration-300 border-2 ${
                active === dept.name
                  ? "bg-teal-600 border-teal-600 text-white shadow-teal-cta scale-[1.05]"
                  : "bg-white border-slate-100 text-teal-600 hover:border-teal-200 hover:bg-teal-50/50"
              }`}
            >
              <div className={`transition-transform duration-300 ${active === dept.name ? 'scale-110' : 'group-hover:scale-110'}`}>
                <DepartmentIcon type={dept.type} />
              </div>
              <span className={`font-heading text-[11px] sm:text-xs font-bold uppercase tracking-wider text-center ${active === dept.name ? 'text-white' : 'text-navy-900'}`}>
                {dept.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Departments;
