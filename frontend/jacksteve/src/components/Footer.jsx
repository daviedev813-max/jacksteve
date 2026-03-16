import { Link } from "react-router-dom";

const Footer = () => {
  return (
    /* 
       CHANGE: Switched from bg-neutral to a custom 'Deep Slate' (bg-[#1A1C1E]).
       Added a double-border effect for that 'Heavy Duty' truck trim feel.
    */
    <footer className="bg-[#1A1C1E] text-white pt-24 border-t-[12px] border-primary rounded-t-[4rem] mt-32 relative overflow-hidden">
      
      {/* Visual Accent: Subtle gradient reflecting the logo's energy */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] -mt-64 pointer-events-none"></div>
      
      <div className="container mx-auto px-8 pb-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          
          {/* 1. BRAND IDENTITY: The Truck Decal Look */}
          <aside className="space-y-8">
            <Link to="/" className="group inline-block">
              <div className="flex flex-col leading-none">
                <span className="text-4xl font-black italic tracking-tighter text-white uppercase group-hover:text-primary transition-colors">
                  JACK<span className="text-primary group-hover:text-white">STEVE</span>
                </span>
                <span className="text-[10px] font-black tracking-[0.5em] text-secondary uppercase mt-1">Limited</span>
              </div>
            </Link>
            
            <p className="text-sm font-bold italic uppercase tracking-tight text-white/40 leading-relaxed max-w-xs">
              Optimizing the bridge between <span className="text-secondary">Agricultural Sourcing</span> and <span className="text-primary">Industrial Logistics</span>. 
              <span className="block mt-4 text-[9px] font-black tracking-[0.3em] opacity-60">HQ: Nairobi Logistics Hub</span>
            </p>

            <div className="flex gap-3">
               {/* Tactical Social Buttons */}
               {['f', '𝕏', 'in'].map((social) => (
                 <div key={social} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-transparent transition-all cursor-pointer font-black italic text-lg shadow-xl">
                   {social}
                 </div>
               ))}
            </div>
          </aside> 

          {/* 2. LOGISTICS CHANNELS: The Farmer/Miller Loop */}
          <nav className="flex flex-col gap-6">
            <h6 className="text-secondary font-black uppercase italic tracking-[0.3em] text-[10px]">Supply Chain Portals</h6> 
            <div className="flex flex-col gap-4">
              <Link to="/farmer-portal" className="group flex items-center gap-3 text-sm font-black italic uppercase tracking-tighter opacity-50 hover:opacity-100 hover:text-secondary transition-all">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span> Farmer.SYS
              </Link>
              <Link to="/miller-portal" className="group flex items-center gap-3 text-sm font-black italic uppercase tracking-tighter opacity-50 hover:opacity-100 hover:text-primary transition-all">
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce"></span> Miller.CTRL
              </Link>
              <Link to="/services" className="text-sm font-black italic uppercase tracking-tighter opacity-30 hover:opacity-100 transition-all">Industrial Backhaul</Link>
              <Link to="/contact" className="text-sm font-black italic uppercase tracking-tighter opacity-30 hover:opacity-100 transition-all">Fleet Dispatch</Link>
            </div>
          </nav> 

          {/* 3. CORPORATE ASSETS */}
          <nav className="flex flex-col gap-6">
            <h6 className="text-primary font-black uppercase italic tracking-[0.3em] text-[10px]">Company Manifest</h6> 
            <div className="flex flex-col gap-4">
              <Link to="/about" className="text-sm font-black italic uppercase tracking-tighter opacity-30 hover:opacity-100 transition-all">Strategy & Loop</Link>
              <Link to="/contact" className="text-sm font-black italic uppercase tracking-tighter opacity-30 hover:opacity-100 transition-all">Contact Center</Link>
              <a className="text-sm font-black italic uppercase tracking-tighter opacity-30 hover:opacity-100 transition-all cursor-pointer">Safety Protocols</a>
              <a className="text-sm font-black italic uppercase tracking-tighter opacity-30 hover:opacity-100 transition-all cursor-pointer">Privacy Data</a>
            </div>
          </nav>

          {/* 4. MARKET INTELLIGENCE: The Newsletter Manifest */}
          <div className="flex flex-col gap-8 bg-white/5 p-8 rounded-[2rem] border border-white/5">
            <div>
              <h6 className="text-white font-black uppercase italic tracking-[0.2em] text-[10px] mb-2">Market Intel</h6>
              <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 leading-relaxed">Subscribe for regional maize pricing and backhaul availability alerts.</p>
            </div>
            
            <div className="relative group">
              <input 
                type="text" 
                placeholder="OPERATOR EMAIL" 
                className="input w-full bg-white/5 border-white/10 rounded-xl focus:border-primary focus:bg-white/10 text-white font-black italic tracking-tighter h-14 transition-all" 
              /> 
              <button className="absolute right-2 top-2 btn btn-primary btn-sm h-10 rounded-lg font-black uppercase italic shadow-lg shadow-primary/40 border-none">
                JOIN
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FINAL SYSTEM STATUS BAR */}
      <div className="border-t border-white/5 py-12 bg-black/40 backdrop-blur-md">
        <div className="container mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-6 text-[9px] font-black uppercase tracking-[0.4em] opacity-30 text-center md:text-left">
            <p>© 2026 JACKSTEVE LIMITED</p>
            <p className="hidden md:block opacity-20">|</p>
            <p className="text-secondary">Reliable Maize Sourcing & Logistics</p>
          </div>
          
          <div className="flex gap-10 items-center">
            <div className="flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-primary animate-ping shadow-[0_0_10px_rgba(240,90,40,0.5)]"></div>
               <span className="text-[9px] font-black uppercase tracking-widest text-primary italic">All Systems Operational</span>
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 italic hover:text-white transition-colors cursor-default">Designed for the Fleet</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
