import Hero from "../components/Hero";
import FleetGallery from "../components/FleetGallery";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-white overflow-x-hidden selection:bg-primary selection:text-white">
      {/* 1. CINEMATIC HERO SLIDESHOW */}
      <Hero />

      {/* 2. THE COMMAND BAR: High-Impact Stats */}
      <div className="relative z-40 -mt-24 container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] bg-white border-t-[10px] border-primary rounded-[2.5rem] overflow-hidden">
          
          <div className="group relative p-12 text-center border-b md:border-b-0 md:border-r border-base-200 hover:bg-slate-50 transition-all duration-500">
            {/* Animated Scanning Beam */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent h-1/2 w-full -translate-y-full group-hover:translate-y-full transition-transform duration-[1500ms] ease-in-out"></div>
            
            <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-500">🏗️</div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral/20 mb-2 group-hover:text-primary transition-colors">Fleet Readiness</p>
            <h3 className="text-7xl font-black italic text-neutral uppercase tracking-tighter leading-none">
              4<span className="text-primary group-hover:animate-pulse">+</span>
            </h3>
            <p className="text-[10px] font-black italic text-primary/40 mt-3 uppercase tracking-widest">Heavy Duty Units</p>
          </div>
          
          <div className="group relative p-12 text-center border-b md:border-b-0 md:border-r border-base-200 bg-secondary/[0.02] hover:bg-secondary/[0.05] transition-all duration-500">
             <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 to-transparent h-1/2 w-full -translate-y-full group-hover:translate-y-full transition-transform duration-[1500ms] ease-in-out"></div>
            
            <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-500">🌽</div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral/20 mb-2 group-hover:text-secondary transition-colors">Market Flow</p>
            <h3 className="text-7xl font-black italic text-secondary uppercase tracking-tighter leading-none">10<span className="text-2xl lowercase">k</span></h3>
            <p className="text-[10px] font-black italic text-secondary/40 mt-3 uppercase tracking-widest">Tons / Month</p>
          </div>

          <div className="group relative p-12 text-center hover:bg-slate-50 transition-all duration-500">
            <div className="text-4xl mb-4 group-hover:rotate-[360deg] transition-transform duration-1000">✅</div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral/20 mb-2 group-hover:text-primary transition-colors">System Uptime</p>
            <h3 className="text-7xl font-black italic text-neutral uppercase tracking-tighter leading-none">99<span className="text-2xl">%</span></h3>
            <p className="text-[10px] font-black italic text-primary/40 mt-3 uppercase tracking-widest">On-Time Delivery</p>
          </div>
        </div>
      </div>

      {/* 3. PHYSICAL EVIDENCE: BENTO FLEET GALLERY */}
      <section className="pt-40 pb-20 bg-slate-50/50">
        <div className="container mx-auto px-6 mb-16 flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="max-w-xl">
            <div className="h-1 w-12 bg-primary mb-4"></div>
            <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">Strategic Assets</span>
            <h2 className="text-5xl md:text-7xl font-black italic text-neutral uppercase tracking-tighter leading-none mt-2">THE <span className="text-secondary">FLEET</span></h2>
          </div>
          <Link to="/services" className="group flex items-center gap-4 text-xs font-black italic uppercase tracking-widest text-primary hover:gap-6 transition-all duration-300">
            Full Logistics Spec <span className="text-xl">→</span>
          </Link>
        </div>
        <div className="container mx-auto px-4">
          <FleetGallery />
        </div>
      </section>

      {/* 4. VALUE PROPOSITION: The Logistics Loop */}
      <section className="py-48 container mx-auto px-6 grid lg:grid-cols-2 gap-32 items-center">
        <div className="relative order-2 lg:order-1">
          <div className="absolute -top-16 -left-16 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
          <h2 className="text-7xl md:text-[9rem] font-black italic text-neutral uppercase tracking-tighter leading-[0.75] mb-12">
            ENGINE OF <br />
            <span className="text-primary">SUPPLY</span> <br /> 
            <span className="text-secondary">& GROWTH</span>
          </h2>
          <p className="text-2xl text-neutral/40 font-bold uppercase italic tracking-tight leading-none max-w-xl">
            We don't just move maize. <br /> We build the <span className="text-neutral border-b-4 border-secondary">Zero-Empty-Kilometer</span> economy.
          </p>
          <div className="mt-12 p-10 border-l-[6px] border-secondary bg-slate-100/50 rounded-r-[2.5rem] backdrop-blur-sm">
             <p className="text-sm font-bold text-neutral/60 leading-relaxed uppercase tracking-tight">
               By integrating <span className="text-neutral font-black">Farmer Procurement</span> with <span className="text-primary font-black">Industrial Backhauling</span>, 
               our fleet ensures that every trip includes a high-value return load—effectively cutting regional logistics costs by 15%.
             </p>
          </div>
          <Link to="/about" className="btn btn-neutral btn-lg rounded-2xl mt-16 px-12 h-20 italic font-black uppercase shadow-2xl hover:bg-primary border-none transition-all group">
            Strategic Loop <span className="ml-4 group-hover:translate-x-3 transition-transform text-xl">→</span>
          </Link>
        </div>

        <div className="space-y-8 order-1 lg:order-2">
          {/* Enhanced Portal Cards */}
          {[
            { to: "/farmer-portal", label: "Farmer Sourcing", color: "border-secondary", icon: "🌾", desc: "Guaranteed farm-gate procurement & instant payments.", tag: "ORIGIN" },
            { to: "/miller-portal", label: "Miller Logistics", color: "border-primary", icon: "🏗️", desc: "Bulk industrial supply & cement backhaul optimization.", tag: "DESTINATION" }
          ].map((portal, idx) => (
            <Link key={idx} to={portal.to} className={`group block bg-white p-14 rounded-[3rem] shadow-xl hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] transition-all duration-500 border-b-[10px] ${portal.color} relative overflow-hidden`}>
              {/* Decorative Background Icon */}
              <div className="absolute -right-6 -bottom-6 text-9xl opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700">{portal.icon}</div>
              
              <div className="flex justify-between items-start mb-8 relative z-10">
                <span className="badge badge-neutral font-black italic text-[9px] py-4 px-6 tracking-[0.3em] rounded-full">{portal.tag}</span>
                <div className="flex flex-col items-end">
                   <span className="text-[9px] font-black text-neutral/20 group-hover:text-primary tracking-widest transition-colors uppercase">Enter Portal</span>
                   <div className="h-1 w-4 bg-base-200 mt-1 group-hover:w-12 group-hover:bg-primary transition-all duration-500"></div>
                </div>
              </div>
              <h4 className="text-4xl font-black italic uppercase text-neutral group-hover:translate-x-3 transition-transform duration-500">{portal.label}</h4>
              <p className="text-neutral/40 mt-6 font-bold text-xs uppercase italic tracking-widest leading-relaxed max-w-sm">{portal.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. FINAL CTA: Industrial Impact */}
      <section className="bg-[#1A1C1E] py-48 text-center relative overflow-hidden rounded-t-[5rem] md:rounded-t-[8rem]">
         {/* Moving Gradient Overlay */}
         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-40"></div>
         
         <div className="relative z-10 px-4">
           <span className="text-primary font-black uppercase tracking-[0.5em] text-xs mb-8 block">Ready for Dispatch?</span>
           <h2 className="text-white text-7xl md:text-[12rem] font-black italic uppercase tracking-tighter leading-none mb-16">
             LOAD <span className="text-primary group-hover:text-white transition-colors">NOW</span>
           </h2>
           
           <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
             <Link to="/contact" className="btn btn-primary btn-lg rounded-2xl px-20 h-24 text-white font-black shadow-[0_25px_50px_-12px_rgba(240,90,40,0.5)] border-none uppercase italic text-2xl group hover:scale-105 active:scale-95 transition-all">
               Dispatch Center <span className="ml-4 group-hover:rotate-45 transition-transform text-3xl">↗</span>
             </Link>
             <Link to="/services" className="btn btn-outline border-white/10 text-white btn-lg rounded-2xl px-20 h-24 font-black hover:bg-white hover:text-neutral transition-all uppercase italic text-2xl">
               Our Fleet
             </Link>
           </div>
         </div>
      </section>
    </div>
  );
};

export default Home;
