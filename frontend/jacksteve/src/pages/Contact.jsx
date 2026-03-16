import ContactForm from "../components/ContactForm";

const Contact = () => {
  return (
    <div className="bg-base-200/30 min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header - High Visibility Style */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary font-black text-[10px] uppercase tracking-[0.2em] mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
            </span>
            Direct Logistics Channel
          </div>
          <h1 className="text-5xl md:text-8xl font-black italic text-neutral tracking-tighter uppercase leading-none">
            CONNECT <span className="text-primary">JACK</span><span className="text-secondary">STEVE</span>
          </h1>
          <p className="mt-8 text-lg md:text-xl text-neutral/50 max-w-3xl mx-auto font-bold uppercase italic tracking-tight">
            Optimizing the bridge between <span className="text-secondary">Harvest</span> and <span className="text-primary">Supply Chain</span> efficiency.
          </p>
        </div>

        {/* The Form Component */}
        <ContactForm />

        {/* Tactical Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {[
            { icon: "📞", label: "Operations", val: "+254 700 000 000", color: "border-primary" },
            { icon: "🚛", label: "Fleet Dispatch", val: "Nairobi Logistics Center", color: "border-secondary" },
            { icon: "📧", label: "Official Email", val: "info@jacksteve.co.ke", color: "border-accent" }
          ].map((item, idx) => (
            <div key={idx} className={`bg-white p-10 rounded-2xl shadow-xl border-l-8 ${item.color} group hover:-translate-y-2 transition-all duration-300`}>
              <div className="text-4xl mb-4 group-hover:rotate-12 transition-transform">{item.icon}</div>
              <h3 className="font-black italic uppercase text-[10px] tracking-widest text-neutral/40 mb-1">{item.label}</h3>
              <p className="text-neutral font-black italic text-lg uppercase">{item.val}</p>
            </div>
          ))}
        </div>

        {/* The "Efficiency" Banner */}
        <div className="mt-24 bg-neutral p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
           {/* Visual "JS" Decal - like a truck door */}
           <div className="absolute -right-16 -bottom-16 text-white/5 text-[280px] font-black italic select-none group-hover:text-primary/10 transition-colors">JS</div>
           
           <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
              <div className="text-center md:text-left flex-grow">
                <h4 className="text-white text-3xl font-black italic uppercase mb-4 leading-none">
                  THE ZERO-EMPTY-TRUCK <span className="text-primary">GUARANTEE</span>
                </h4>
                <p className="text-white/60 max-w-xl font-bold italic text-sm uppercase tracking-wide">
                  Every kilometer counts. We specialize in maize procurement with optimized 
                  industrial backhauling to keep regional rates competitive.
                </p>
              </div>
              <button className="btn btn-secondary btn-lg rounded-xl px-12 font-black italic uppercase shadow-xl shadow-secondary/20">
                Partner Now
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
