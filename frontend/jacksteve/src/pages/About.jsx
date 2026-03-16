import Leadership from "../components/Leadership";
import ServiceCard from "../components/ServiceCard";

const About = () => {
  return (
    <div className="bg-base-100 min-h-screen overflow-hidden">
      {/* 1. Cinematic Page Header */}
      <section className="relative bg-neutral py-32 px-6 text-center overflow-hidden border-b-8 border-primary">
        {/* Background Decorative Graphic */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none select-none text-[25vw] font-black italic text-white -translate-x-20 translate-y-10 uppercase">
          JACKSTEVE
        </div>
        
        <div className="relative z-10">
          <div className="badge badge-secondary font-black py-4 px-6 mb-6 tracking-[0.3em] italic shadow-xl">
            SINCE 2020
          </div>
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-white uppercase leading-none">
            OUR <span className="text-secondary underline decoration-primary decoration-8 underline-offset-8">STORY</span>
          </h1>
          <p className="mt-8 text-xl md:text-2xl text-white/60 max-w-3xl mx-auto font-medium leading-relaxed">
            From the farm gate to the miller’s silo—building a <span className="text-white">high-performance bridge</span> for Kenya’s agricultural and industrial sectors.
          </p>
        </div>
      </section>

      {/* 2. Mission & Vision: The Core Engine */}
      <section className="container mx-auto py-24 px-6 grid lg:grid-cols-2 gap-20 items-center">
        <div className="relative">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <span className="text-primary font-black uppercase tracking-[0.2em] text-xs">The Jacksteve Standard</span>
          <h2 className="text-4xl md:text-6xl font-black italic text-neutral mt-4 mb-8 leading-tight uppercase tracking-tighter">
            RELIABILITY IN <br/> <span className="text-secondary">EVERY TON</span>
          </h2>
          <p className="text-xl text-neutral/60 mb-8 leading-relaxed font-medium">
            Jacksteve Limited was founded to solve a critical gap in the regional supply chain. We realized that while farmers produce world-class maize, the logistics of reaching industrial millers was inefficient and costly. 
          </p>
          <p className="text-xl text-neutral/60 leading-relaxed font-medium">
            Today, we operate a specialized fleet of heavy-duty trucks, ensuring **fair markets for farmers** and **consistent supply for millers**, while optimizing return-trips with industrial goods.
          </p>
          
          <div className="stats shadow-xl bg-primary text-primary-content mt-10 rounded-3xl w-full">
            <div className="stat place-items-center">
              <div className="stat-title text-primary-content/70 text-xs font-bold uppercase">Fleet Strength</div>
              <div className="stat-value italic">4+ Trucks</div>
            </div>
            <div className="stat place-items-center border-l border-white/10">
              <div className="stat-title text-primary-content/70 text-xs font-bold uppercase">Coverage</div>
              <div className="stat-value italic">Regional</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
          <div className="mt-12">
            <ServiceCard 
              title="Our Mission" 
              description="Empowering farmers with guaranteed markets while providing millers with a seamless, high-volume supply chain."
              icon="🎯"
              color="green"
            />
          </div>
          <div>
            <ServiceCard 
              title="Our Vision" 
              description="To be the leading logistics partner in East Africa, maximizing every kilometer through smart backhaul technology."
              icon="🔭"
              color="orange"
            />
          </div>
        </div>
      </section>
      <Leadership /> 

      {/* 3. The "Jacksteve Loop": Efficiency Process */}
      <section className="bg-base-200 py-24 px-6 rounded-[4rem] mx-4 shadow-inner">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black italic text-neutral uppercase tracking-tighter">
              The <span className="text-primary">Optimized</span> Process
            </h2>
            <div className="divider w-24 mx-auto border-secondary border-2 mt-4"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="group text-center">
              <div className="w-24 h-24 bg-primary rounded-[2rem] flex items-center justify-center text-white text-4xl font-black mx-auto mb-8 shadow-2xl shadow-primary/20 group-hover:rotate-6 transition-transform">01</div>
              <h3 className="text-2xl font-black mb-4 uppercase italic text-neutral">Sourcing</h3>
              <p className="text-neutral/50 font-medium">We partner with farmers to procure premium maize directly from the harvest at competitive rates.</p>
            </div>

            {/* Step 2 */}
            <div className="group text-center">
              <div className="w-24 h-24 bg-secondary rounded-[2rem] flex items-center justify-center text-white text-4xl font-black mx-auto mb-8 shadow-2xl shadow-secondary/20 group-hover:-rotate-6 transition-transform">02</div>
              <h3 className="text-2xl font-black mb-4 uppercase italic text-neutral">Logistics</h3>
              <p className="text-neutral/50 font-medium">Our heavy-duty fleet ensures safe, high-volume transport to flour and animal-feed millers.</p>
            </div>

            {/* Step 3 */}
            <div className="group text-center">
              <div className="w-24 h-24 bg-neutral rounded-[2rem] flex items-center justify-center text-white text-4xl font-black mx-auto mb-8 shadow-2xl shadow-neutral/20 group-hover:rotate-6 transition-transform">03</div>
              <h3 className="text-2xl font-black mb-4 uppercase italic text-neutral">Backhaul</h3>
              <p className="text-neutral/50 font-medium">Efficiency redefined: return trips carry industrial goods like cement, ensuring zero empty-truck waste.</p>
            </div>
          </div>
        </div>
      </section>
       

      {/* 4. Leadership Quote: Bold & Minimalist */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto relative">
          <div className="absolute -top-10 -left-10 text-[15rem] font-serif text-primary/5 select-none">“</div>
          <div className="bg-white border-x-8 border-primary p-16 rounded-[3rem] shadow-2xl shadow-primary/5 text-center relative z-10">
            <blockquote className="text-3xl md:text-5xl font-black italic text-neutral leading-[1.1] uppercase tracking-tighter">
              At Jacksteve, we don't just move grain; we <span className="text-secondary">move the economy</span>. Our trucks are a symbol of regional growth.
            </blockquote>
            <div className="mt-10 flex flex-col items-center">
              <div className="w-12 h-1 bg-secondary mb-4"></div>
              <p className="font-black uppercase tracking-widest text-neutral italic text-sm">— Jacksteve Management</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="bg-secondary py-16 text-center">
         <h3 className="text-white text-2xl font-black italic uppercase tracking-tighter">Ready to partner with a leader?</h3>
         <button className="btn btn-neutral btn-lg rounded-full mt-6 px-12 border-none text-white hover:scale-110 transition-all shadow-xl">
           Work With Us
         </button>
      </section>
    </div>
  );
};

export default About;
