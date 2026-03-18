const ContactForm = () => {
  return (
    <div className="card lg:card-side bg-white shadow-[0_35px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden border border-base-300 rounded-[2rem]">
      
      {/* Left Panel: The Manifest */}
      <div className="bg-neutral p-10 lg:p-14 text-white lg:w-1/3 relative flex flex-col justify-between overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        
        <div className="relative z-10">
          <div className="w-16 h-1 bg-secondary mb-8"></div>
          <h3 className="text-4xl font-black italic mb-6 tracking-tighter uppercase leading-none">
            INQUIRY <span className="text-secondary text-5xl">MANIFEST</span>
          </h3>
          <p className="mb-10 text-white/50 font-bold uppercase italic text-xs tracking-widest leading-loose">
            Procurement • Logistics • Backhaul • Distribution
          </p>
          
          <div className="space-y-8">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] mb-1">Regional HQ</span>
              <p className="font-black italic text-lg uppercase">Nairobi, Kenya</p>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] mb-1">Direct Comms</span>
              <p className="font-black italic text-lg uppercase">+254 796 622480</p>
              
              <p className="font-black italic text-lg uppercase">+254 725 239307</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 hidden lg:block relative z-10">
          <div className="flex items-center gap-3">
             <div className="flex gap-1">
                {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-secondary"></div>)}
             </div>
             <p className="text-[10px] uppercase tracking-widest font-black text-white/40 italic">System Ready for Inputs</p>
          </div>
        </div>
      </div>

      {/* Right Side: The Data Entry Form */}
      <form className="card-body lg:w-2/3 p-8 lg:p-14 bg-white">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="form-control">
            <label className="label py-0 mb-2"><span className="label-text font-black uppercase italic text-xs opacity-40">Client Identifier</span></label>
            <input type="text" placeholder="FULL NAME" className="input input-bordered bg-base-200 border-none font-bold italic focus:ring-2 focus:ring-secondary focus:bg-white transition-all" />
          </div>
          <div className="form-control">
            <label className="label py-0 mb-2"><span className="label-text font-black uppercase italic text-xs opacity-40">Comms Protocol</span></label>
            <input type="email" placeholder="EMAIL ADDRESS" className="input input-bordered bg-base-200 border-none font-bold italic focus:ring-2 focus:ring-secondary focus:bg-white transition-all" />
          </div>
        </div>

        <div className="form-control mt-6">
          <label className="label py-0 mb-2"><span className="label-text font-black uppercase italic text-xs opacity-40">Operational Profile</span></label>
          <select className="select select-bordered bg-base-200 border-none font-bold italic focus:ring-2 focus:ring-primary focus:bg-white transition-all">
            <option disabled selected>SELECT ROLE</option>
            <option>FARMER / PRODUCER</option>
            <option>MILLER / PROCESSOR</option>
            <option>LOGISTICS PARTNER</option>
            <option>INDUSTRIAL BACKHAULER</option>
          </select>
        </div>

        <div className="form-control mt-6">
          <label className="label py-0 mb-2"><span className="label-text font-black uppercase italic text-xs opacity-40">Requirement Brief</span></label>
          <textarea className="textarea textarea-bordered bg-base-200 border-none h-36 font-bold italic focus:ring-2 focus:ring-primary focus:bg-white transition-all" placeholder="DESCRIBE YOUR CARGO OR SOURCING NEEDS..."></textarea>
        </div>

        <div className="card-actions mt-10">
          <button className="btn btn-primary btn-lg w-full rounded-2xl shadow-2xl shadow-primary/30 text-white font-black italic uppercase tracking-tighter text-xl group">
             Initialize Inquiry 
             <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
