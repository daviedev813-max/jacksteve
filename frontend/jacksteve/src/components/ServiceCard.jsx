const ServiceCard = ({ title, description, icon, color }) => {
  // Mapping colors to your brand theme
  const colorMap = {
    green: 'border-secondary hover:bg-secondary text-secondary',
    orange: 'border-primary hover:bg-primary text-primary',
    neutral: 'border-neutral hover:bg-neutral text-neutral'
  };

  const activeColor = colorMap[color] || colorMap.orange;

  return (
    <div className={`group relative card bg-white p-12 rounded-[3rem] shadow-xl border-b-[12px] ${activeColor.split(' ')[0]} hover:-translate-y-4 transition-all duration-500 overflow-hidden`}>
      {/* Decorative Background Icon */}
      <div className="absolute -right-6 -bottom-6 text-9xl opacity-[0.03] group-hover:opacity-10 group-hover:scale-110 transition-all duration-700 select-none">
        {icon}
      </div>

      <div className="relative z-10">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-8 bg-base-100 group-hover:bg-white group-hover:shadow-lg transition-all duration-500`}>
          {icon}
        </div>
        
        <h3 className={`text-3xl font-black italic uppercase tracking-tighter mb-4 transition-colors group-hover:text-white`}>
          {title}
        </h3>
        
        <p className={`text-sm font-bold leading-relaxed transition-colors group-hover:text-white/80 italic uppercase tracking-tight`}>
          {description}
        </p>

        <div className={`w-12 h-1 bg-base-200 mt-8 rounded-full transition-all group-hover:w-full group-hover:bg-white/30`}></div>
      </div>
    </div>
  );
};

export default ServiceCard;
