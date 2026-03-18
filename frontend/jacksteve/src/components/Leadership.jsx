import { Phone, ArrowUpRight } from "lucide-react"; //

const Leadership = () => {
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

  return (
    <section className="py-24 px-6 bg-base-100 overflow-hidden">
      <div className="container mx-auto">
        {/* 1. FOUNDERS SECTION */}
        <div className="mb-32">
          <div className="flex flex-col md:flex-row items-center gap-6 mb-16 animate-in fade-in slide-in-from-bottom duration-700">
            <h2 className="text-5xl md:text-7xl font-black italic text-neutral uppercase tracking-tighter shrink-0">
              THE{" "}
              <span className="text-primary underline decoration-secondary decoration-4 underline-offset-8">
                FOUNDERS
              </span>
            </h2>
            <div className="h-2 w-full bg-neutral/5 rounded-full hidden md:block">
              <div className="h-full w-1/3 bg-secondary animate-pulse rounded-full"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {founders.map((member, idx) => (
              <div
                key={idx}
                className="group relative flex flex-col md:flex-row bg-white rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-neutral/5 hover:shadow-primary/10 transition-all duration-500"
              >
                {/* Image Container */}
                <div className="md:w-5/12 h-96 md:h-auto relative overflow-hidden">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral/80 md:from-transparent to-transparent"></div>
                </div>

                {/* Content */}
                <div className="md:w-7/12 p-8 md:p-12 flex flex-col justify-center relative">
                  <div className="absolute top-8 right-8 text-neutral/5 group-hover:text-primary/10 transition-colors">
                    <ArrowUpRight size={80} strokeWidth={4} />
                  </div>

                  <span className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                    <span className="w-8 h-[2px] bg-secondary"></span>{" "}
                    DIRECTORATE
                  </span>

                  <h3 className="text-4xl font-black italic text-neutral uppercase mb-2 leading-tight">
                    {member.name}
                  </h3>

                  <p className="text-primary font-bold uppercase text-[11px] mb-6 tracking-wider">
                    {member.role}
                  </p>

                  <p className="text-neutral/60 text-sm mb-8 leading-relaxed font-medium italic border-l-4 border-base-200 pl-4 py-1">
                    "{member.bio}"
                  </p>

                  <a
                    href={`tel:${member.contact}`}
                    className="btn btn-neutral btn-md rounded-xl font-black italic uppercase text-xs w-fit group-hover:btn-primary transition-all shadow-lg"
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
          <div className="mb-12">
            <h3 className="text-2xl font-black italic text-neutral uppercase tracking-tighter flex items-center gap-4">
              SPECIALIST <span className="text-secondary">COMMAND</span>
              <span className="h-px flex-grow bg-neutral/10"></span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {specialists.map((member, idx) => (
              <div
                key={idx}
                className="relative bg-white p-2 rounded-[2.5rem] border border-transparent hover:border-primary/20 shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden"
              >
                {/* Profile Pic with Hover Reveal */}
                <div className="relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden mb-6">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors"></div>

                  {/* Floating Contact Icon */}
                  <a
                    href={`tel:${member.contact}`}
                    className="absolute bottom-4 right-4 p-4 bg-white rounded-2xl shadow-xl translate-y-20 group-hover:translate-y-0 transition-transform duration-500 hover:bg-primary hover:text-white"
                  >
                    <Phone size={20} />
                  </a>
                </div>

                <div className="px-6 pb-6 text-center">
                  <h4 className="font-black italic text-neutral uppercase text-xl leading-tight mb-1">
                    {member.name.split(" ")[0]}{" "}
                    <span className="text-primary">
                      {member.name.split(" ")[1]}
                    </span>
                  </h4>
                  <p className="text-neutral/40 font-bold uppercase text-[9px] tracking-[0.2em] mb-4">
                    {member.role}
                  </p>
                  <div className="h-1.5 w-12 bg-base-200 mx-auto rounded-full group-hover:w-full group-hover:bg-primary transition-all duration-500"></div>
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
