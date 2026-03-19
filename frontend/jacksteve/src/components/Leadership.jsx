import { Phone, ArrowUpRight } from "lucide-react";

// Move data outside the component to keep it clean
const founders = [
  {
    name: "Stephen Musyoka",
    role: "Co-Founder / Logistics & Operations",
    contact: "+254 796 622480",
    bio: "The operational architect. Stephen directs farm-gate procurement and ensures cargo integrity from transit to delivery.",
    img: "/stephene.jpg",
  },
  {
    name: "Jackline Syokau",
    role: "Co-Founder / Market & Finance",
    contact: "+254 725 239307",
    bio: "The market bridge. Jackline leads high-level trade negotiations and ensures financial precision across the logistics cycle.",
    img: "/jackline.jpg",
  },
];

const specialists = [
  {
    name: "Stephen Matheka",
    role: "Field Ops & Fleet Supervisor",
    contact: "+254 717 573171",
    img: "/steve.jpg",
  },
  {
    name: "Brian Ngila",
    role: "Maintenance & Technical Lead",
    contact: "+254 115 824878",
    img: "/brian.jpg",
  },
  {
    name: "David Matheka",
    role: "ICT Systems & Support",
    contact: "+254 796 103776",
    img: "/David.jpg",
  },
  {
    name: "Christine Mwikali",
    role: "Financial Administration",
    contact: "+254 7XX XXX XXX",
    img: "/christine.jpg",
  },
];

const Leadership = () => {
  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-slate-50 overflow-hidden">
      <div className="container mx-auto">
        {/* 1. FOUNDERS SECTION */}
        <div className="mb-24 md:mb-32">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-12 animate-in fade-in slide-in-from-bottom duration-700">
            <h2 className="text-4xl md:text-7xl font-black italic text-slate-900 uppercase tracking-tighter">
              THE{" "}
              <span className="text-primary underline decoration-secondary decoration-4 underline-offset-8">
                FOUNDERS
              </span>
            </h2>
            <div className="h-1.5 w-32 md:w-full bg-slate-200 rounded-full">
              <div className="h-full w-1/3 bg-secondary animate-pulse rounded-full"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
            {founders.map((member, idx) => (
              <div
                key={idx}
                className="group relative flex flex-col md:flex-row bg-white rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-xl border border-slate-100 hover:border-primary/30 transition-all duration-500"
              >
                {/* Image Container - High Color on Mobile */}
                <div className="md:w-5/12 aspect-square md:aspect-auto relative overflow-hidden">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale-0 md:grayscale md:group-hover:grayscale-0 md:group-hover:saturate-150 scale-100 group-hover:scale-110 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent md:hidden"></div>
                </div>

                {/* Content */}
                <div className="md:w-7/12 p-6 md:p-10 flex flex-col justify-center bg-white/80 backdrop-blur-sm relative">
                  <div className="hidden md:block absolute top-8 right-8 text-slate-100 group-hover:text-primary/10 transition-colors">
                    <ArrowUpRight size={80} strokeWidth={4} />
                  </div>

                  <span className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
                    <span className="w-6 h-[2px] bg-secondary"></span>{" "}
                    DIRECTORATE
                  </span>

                  <h3 className="text-3xl md:text-4xl font-black italic text-slate-900 uppercase mb-1">
                    {member.name}
                  </h3>

                  <p className="text-primary font-bold uppercase text-[10px] md:text-[11px] mb-4 tracking-widest">
                    {member.role}
                  </p>

                  <p className="text-slate-600 text-sm mb-6 leading-relaxed font-medium italic border-l-4 border-primary/20 pl-4 py-1">
                    "{member.bio}"
                  </p>

                  <a
                    href={`tel:${member.contact}`}
                    className="btn btn-neutral btn-md rounded-xl font-black italic uppercase text-xs w-full md:w-fit group-hover:btn-primary transition-all shadow-md"
                  >
                    <Phone size={14} className="mr-2" /> {member.contact}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. SPECIALIST COMMAND */}
        <div className="relative">
          <div className="mb-10">
            <h3 className="text-xl md:text-2xl font-black italic text-slate-900 uppercase tracking-tighter flex items-center gap-4">
              SPECIALIST <span className="text-secondary">COMMAND</span>
              <span className="h-px flex-grow bg-slate-200"></span>
            </h3>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {specialists.map((member, idx) => (
              <div
                key={idx}
                className="relative bg-white p-1.5 md:p-2 rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 group"
              >
                <div className="relative w-full aspect-[3/4] md:aspect-[4/5] rounded-[1.2rem] md:rounded-[2rem] overflow-hidden mb-4">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale-0 md:grayscale md:group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                  />
                  <a
                    href={`tel:${member.contact}`}
                    className="absolute bottom-2 right-2 p-3 bg-white/90 backdrop-blur rounded-xl shadow-lg md:translate-y-20 md:group-hover:translate-y-0 transition-transform duration-500 text-primary"
                  >
                    <Phone size={18} />
                  </a>
                </div>

                <div className="px-2 md:px-6 pb-4 md:pb-6 text-center">
                  <h4 className="font-black italic text-slate-900 uppercase text-sm md:text-xl leading-tight mb-1">
                    {member.name.split(" ")[0]} <br className="md:hidden" />
                    <span className="text-primary">
                      {member.name.split(" ")[1]}
                    </span>
                  </h4>
                  <p className="text-slate-400 font-bold uppercase text-[8px] md:text-[9px] tracking-widest mb-3">
                    {member.role}
                  </p>
                  <div className="h-1 w-8 bg-slate-100 mx-auto rounded-full group-hover:w-full group-hover:bg-primary transition-all duration-500"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Leadership;
