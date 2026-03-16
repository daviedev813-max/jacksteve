const Leadership = () => {
  const founders = [
    {
      name: "Stephen Musyoka",
      role: "Co-Founder / Logistics & Operations",
      contact: "+254 700 000 000",
      bio: "The operational architect. Stephen directs farm-gate procurement and ensures cargo integrity from transit to delivery.",
      img: "/stephen.jpg",
    },
    {
      name: "Jackline Syokau",
      role: "Co-Founder / Market & Finance",
      contact: "+254 700 000 000",
      bio: "The market bridge. Jackline leads high-level trade negotiations and ensures financial precision across the logistics cycle.",
      img: "/jackline.jpg",
    },
  ];

  const specialists = [
    {
      name: "Stephen Matheka",
      role: "Field Ops & Fleet Supervisor",
      contact: "+254 7XX XXX XXX",
      img: "/steve.jpg",
    },
    {
      name: "Brian Ngila",
      role: "Maintenance & Technical Lead",
      contact: "+254 7XX XXX XXX",
      img: "/brian.jpg",
    },
    {
      name: "David Matheka",
      role: "ICT Systems & Support",
      contact: "+254 7XX XXX XXX",
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
    <section className="py-24 px-6 bg-base-100">
      <div className="container mx-auto">
        {/* 1. FOUNDERS SECTION */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-px flex-grow bg-neutral/10"></div>
            <h2 className="text-4xl md:text-6xl font-black italic text-neutral uppercase tracking-tighter">
              THE <span className="text-secondary">FOUNDERS</span>
            </h2>
            <div className="h-px flex-grow bg-neutral/10"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {founders.map((member, idx) => (
              <div
                key={idx}
                className="flex flex-col md:flex-row bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-neutral/5 group"
              >
                <div className="md:w-1/2 h-80 md:h-auto relative overflow-hidden">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-neutral/40 to-transparent"></div>
                </div>
                <div className="md:w-1/2 p-10 flex flex-col justify-center">
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">
                    Directorate
                  </span>
                  <h3 className="text-3xl font-black italic text-neutral uppercase mb-1 leading-none">
                    {member.name}
                  </h3>
                  <p className="text-neutral/40 font-bold uppercase text-[10px] mb-6 tracking-tighter">
                    {member.role}
                  </p>
                  <p className="text-neutral/60 text-sm mb-8 leading-relaxed font-medium italic">
                    "{member.bio}"
                  </p>
                  <a
                    href={`tel:${member.contact}`}
                    className="btn btn-sm btn-outline rounded-full font-black italic uppercase text-[10px]"
                  >
                    📞 {member.contact}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. SPECIALIST COMMAND */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {specialists.map((member, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-[2rem] border-b-4 border-neutral group hover:border-primary transition-all"
            >
              <div className="w-full aspect-square rounded-2xl overflow-hidden mb-6">
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-full h-full object-cover grayscale group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h4 className="font-black italic text-neutral uppercase text-lg leading-tight mb-1">
                {member.name}
              </h4>
              <p className="text-primary font-bold uppercase text-[9px] tracking-widest mb-4">
                {member.role}
              </p>
              <p className="text-neutral/30 font-black text-[10px]">
                {member.contact}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Leadership;
