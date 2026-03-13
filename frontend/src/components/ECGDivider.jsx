const ECGDivider = () => {
  return (
    <div className="w-full h-[120px] sm:h-[160px] bg-white overflow-hidden flex items-center py-10">
      <svg 
        viewBox="0 0 1200 60" 
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        <path
          d="M0 30 L100 30 L110 10 L120 50 L130 30 L250 30 L260 5 L275 55 L290 30 L400 30 L410 15 L420 45 L430 30 L550 30 L560 0 L575 60 L590 30 L700 30 L710 10 L720 50 L730 30 L850 30 L860 5 L875 55 L890 30 L1000 30 L1010 15 L1020 45 L1030 30 L1200 30"
          fill="none"
          stroke="#14B8A6"
          strokeWidth="2.5"
          strokeDasharray="600"
          className="animate-[ecgDraw_3s_linear_infinite]"
        />
      </svg>
    </div>
  );
};

export default ECGDivider;
