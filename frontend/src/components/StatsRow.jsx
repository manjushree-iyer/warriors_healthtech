import { useState, useEffect, useRef } from "react";

const CountUp = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const endValue = parseFloat(end.replace(/,/g, ''));
    if (isNaN(endValue)) return;

    const increment = endValue / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= endValue) {
        setCount(endValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isVisible, end, duration]);

  // Format with commas if original had them
  const displayCount = end.includes(',') ? count.toLocaleString() : count;

  return <span ref={countRef}>{displayCount}{suffix}</span>;
};

const StatsRow = () => {
  const stats = [
    { value: "4,500", suffix: "+", label: "Happy Patients" },
    { value: "200", suffix: "+", label: "Hospital Partners" },
    { value: "98.6", suffix: "%", label: "Accuracy Rate" },
    { value: "24/7", suffix: "", label: "Support" },
  ];

  return (
    <section id="stats-section" className="relative bg-white border-y border-slate-100 py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center md:items-start group">
              <div className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold text-navy-900 leading-none mb-2">
                {stat.value === "24/7" ? "24/7" : <CountUp end={stat.value} suffix={stat.suffix} />}
              </div>
              <div className="font-dm text-xs sm:text-sm text-slate-500 font-medium">
                {stat.label}
              </div>
              <div className="mt-4 w-10 h-1 bg-teal-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsRow;
