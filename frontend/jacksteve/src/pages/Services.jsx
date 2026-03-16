import { useEffect, useState } from 'react';
import ServiceCard from '../components/ServiceCard';
import SupplyRequestForm from '../components/SupplyRequestModal.jsx';

const Services = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = (window.pageYOffset / totalScroll) * 100;
      setScrollProgress(currentProgress);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-primary selection:text-white">
      {/* 0. Top Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-2 z-[100] bg-base-200">
        <div 
          className="h-full bg-primary transition-all duration-150 ease-out shadow-[0_0_20px_rgba(240,90,40,0.5)]" 
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* 1. HERO: Industrial Clarity */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-20 bg-white">
        <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:40px_40px]"></div>
        
        <div className="relative z-20 container mx-auto px-6 text-center">
          <div className="inline-block px-6 py-2 rounded-full bg-secondary/10 border border-secondary/20 mb-8">
            <span className="text-secondary font-black uppercase tracking-[0.5em] text-[10px] italic">Fleet Intelligence Terminal</span>
          </div>
          <h1 className="text-6xl md:text-[10rem] font-black text-neutral italic tracking-tighter uppercase leading-[0.8] mb-8">
            RELIABLE <br/>
            <span className="text-primary underline decoration-secondary decoration-8 underline-offset-[20px]">SOURCING.</span>
          </h1>
          <p className="text-xl md:text-2xl text-neutral/40 font-bold max-w-3xl mx-auto leading-relaxed italic uppercase tracking-tight">
            Optimizing the <span className="text-secondary font-black">Regional Grain Loop</span> with high-performance fleet management.
          </p>
        </div>
      </section>

      {/* 2. THE PROCESS: Mechanical Logic */}
      <div className="py-24 bg-white border-y border-base-200 relative overflow-hidden">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-black italic text-base-200 select-none pointer-events-none opacity-50 uppercase">LOGISTICS</div>
         
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            {[
              { id: '01', title: 'SOURCE', desc: 'Farmer Procurement', icon: '🌽', color: 'bg-secondary' },
              { id: '02', title: 'LOAD', desc: 'Fleet Logistics', icon: '🚛', color: 'bg-primary' },
              { id: '03', title: 'SUPPLY', desc: 'Industrial Delivery', icon: '🏗️', color: 'bg-neutral' }
            ].map((step) => (
              <div key={step.id} className="group flex flex-col items-center text-center p-12 bg-white rounded-[3rem] shadow-xl border border-base-100 hover:shadow-2xl transition-all duration-500">
                <div className={`w-24 h-24 rounded-3xl ${step.color} flex items-center justify-center text-4xl mb-6 shadow-xl group-hover:scale-110 transition-transform text-white`}>
                  {step.icon}
                </div>
                <h4 className="text-neutral font-black italic uppercase text-2xl tracking-tighter">{step.title}</h4>
                <p className="text-[10px] font-black text-neutral/30 uppercase tracking-[0.3em] mt-3">{step.desc}</p>
              </div>
            ))}
         </div>
      </div>

      {/* 3. CORE SERVICES: The Tactical Grid */}
      <section className="py-32 container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-end justify-between mb-24 gap-12">
          <div className="max-w-2xl">
            <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px]">Solutions Portfolio</span>
            <h2 className="text-5xl md:text-8xl font-black uppercase italic text-neutral tracking-tighter leading-[0.9] mt-6">
              FLEET <br/> <span className="text-secondary">CAPABILITY</span>
            </h2>
          </div>
          <div className="bg-primary p-8 rounded-3xl shadow-2xl shadow-primary/20 max-w-sm rotate-1 hover:rotate-0 transition-transform">
             <p className="text-white font-bold text-xs uppercase italic leading-loose">
               "Maximum Value. Zero Empty Kilometers. We ensure every kilometer driven adds profit to your supply chain."
             </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <ServiceCard 
            color="green"
            icon="🌾"
            title="Harvest Sourcing"
            description="Direct bulk procurement from regional maize producers at guaranteed market-leading rates."
          />
          <ServiceCard 
            color="orange"
            icon="🚛"
            title="Bulk Logistics"
            description="Specialized 30-Ton Actros units ensuring rapid, dry-cargo movement to industrial millers."
          />
          <ServiceCard 
            color="neutral"
            icon="🏗️"
            title="Backhaul Ops"
            description="Industrial return-trip optimization carrying cement and construction materials to regional hubs."
          />
        </div>
      </section>

      {/* 4. CALL TO ACTION: Dispatch Terminal */}
      <section className="py-32 bg-neutral rounded-t-[5rem] mx-2 mb-0 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-24 items-center">
          <div className="relative z-10">
            <h3 className="text-4xl md:text-7xl font-black text-white italic uppercase tracking-tighter mb-8 leading-[0.9]">
              INITIALIZE <br/> <span className="text-primary">DISPATCH</span>
            </h3>
            <p className="text-white/40 text-xl font-bold uppercase italic tracking-tight max-w-md leading-relaxed mb-12">
              Partner with Jacksteve to optimize your procurement and transport efficiency today.
            </p>
            <div className="flex items-center gap-6">
               <div className="flex -space-x-4">
                  {[1,2,3,4].map(i => <div key={i} className="w-12 h-12 rounded-full border-4 border-neutral bg-base-200"></div>)}
               </div>
               <p className="text-white/60 text-[10px] font-black uppercase tracking-widest italic">Join 40+ Active Partners</p>
            </div>
          </div>

          <div className="bg-white p-12 rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-base-200 relative">
            <h4 className="text-3xl font-black text-neutral uppercase italic mb-8 tracking-tighter leading-none">
              Request <span className="text-primary">Uplink</span>
            </h4>
            <SupplyRequestForm />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
