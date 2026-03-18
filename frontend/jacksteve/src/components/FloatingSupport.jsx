const FloatingSupport = () => {
  return (
    <div className="fixed bottom-6 right-6 z-[100] group">
      {/* Tooltip for Desktop */}
      <div className="absolute bottom-full right-0 mb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
        <div className="bg-neutral text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl shadow-2xl border border-white/10 whitespace-nowrap">
          Contact Dispatch Hub
        </div>
      </div>

      {/* Main Pulse Button */}
      <a 
        href="tel:+254 796 622480" 
        className="flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-[0_20px_50px_rgba(38,222,129,0.4)] border-2 border-white/20 hover:scale-110 active:scale-95 transition-all duration-300 relative group"
      >
        {/* Animated Rings for Urgency */}
        <span className="absolute inset-0 rounded-2xl bg-primary animate-ping opacity-20"></span>
        
        {/* Support Icon */}
        <svg xmlns="http://www.w3.org" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      </a>
    </div>
  );
};
export default FloatingSupport;