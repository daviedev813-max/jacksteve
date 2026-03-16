import { useState, useEffect } from "react";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [activeDept, setActiveDept] = useState("FLEET");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Tactical configuration for different departments
  const deptConfig = {
    FLEET: {
      label: "Field Pilots",
      icon: "🚛",
      metric: "Safety Score",
      color: "text-primary",
      theme: "border-primary",
    },
    WAREHOUSE: {
      label: "Silo Ops",
      icon: "🏗️",
      metric: "Logistics Accuracy",
      color: "text-secondary",
      theme: "border-secondary",
    },
    FINANCE: {
      label: "Registry",
      icon: "💳",
      metric: "Payout Velocity",
      color: "text-success",
      theme: "border-success",
    },
  };

  useEffect(() => {
    const mockStaff = [
      {
        id: "JS-DRV-001",
        name: "John Doe",
        dept: "FLEET",
        role: "Heavy Unit Pilot",
        status: "ON_DUTY",
        val: "98%",
        sub: "JS-UNIT-01",
      },
      {
        id: "JS-FIN-002",
        name: "Sarah Jenkins",
        dept: "FINANCE",
        role: "Treasury Lead",
        status: "ACTIVE",
        val: "1.2h",
        sub: "Settlement Unit",
      },
      {
        id: "JS-WHS-003",
        name: "Mike Otieno",
        dept: "WAREHOUSE",
        role: "Grade Inspector",
        status: "ON_SITE",
        val: "99.8%",
        sub: "Eldoret Silo A",
      },
      {
        id: "JS-DRV-004",
        name: "Alex Otieno",
        dept: "FLEET",
        role: "Tactical Driver",
        status: "ON_DUTY",
        val: "95%",
        sub: "JS-UNIT-09",
      },
      {
        id: "JS-WHS-005",
        name: "David K.",
        dept: "WAREHOUSE",
        role: "Inventory Lead",
        status: "ON_SITE",
        val: "94%",
        sub: "Nakuru Hub",
      },
    ];
    setTimeout(() => {
      setLoading(false);
      setEmployees(mockStaff);
    }, 800);
  }, []);

  // Filter logic for Department + Search
  const filteredStaff = employees.filter(
    (emp) =>
      emp.dept === activeDept &&
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading)
    return (
      <div className="p-20 flex flex-col items-center justify-center">
        <div className="loading loading-bars loading-lg text-primary mb-4"></div>
        <p className="font-black italic uppercase tracking-widest text-neutral/40">
          Syncing Roster...
        </p>
      </div>
    );

  return (
    <div className="p-6 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 1. TACTICAL SUB-NAV & SEARCH */}
      <div className="flex flex-col xl:flex-row justify-between items-center mb-12 gap-8 border-b border-base-300 pb-10">
        {/* SUB-CATEGORY SELECTOR */}
        <div className="flex flex-wrap gap-3 justify-center">
          {Object.keys(deptConfig).map((dept) => (
            <button
              key={dept}
              onClick={() => setActiveDept(dept)}
              className={`group flex items-center gap-4 px-8 py-5 rounded-[1.5rem] transition-all duration-500 ${
                activeDept === dept
                  ? "bg-neutral text-white shadow-2xl scale-105"
                  : "bg-white text-neutral/40 hover:bg-base-200 border border-base-200 shadow-sm"
              }`}
            >
              <span className="text-2xl group-hover:scale-125 transition-transform">
                {deptConfig[dept].icon}
              </span>
              <div className="text-left">
                <p className="text-[8px] font-black uppercase tracking-[0.2em] opacity-40">
                  Section
                </p>
                <p className="text-xs font-black italic uppercase tracking-tighter">
                  {deptConfig[dept].label}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* UTILITY ACTIONS */}
        <div className="flex items-center gap-4 w-full xl:w-auto">
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-4 flex items-center opacity-20">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search Personnel..."
              className="input input-bordered bg-white pl-12 rounded-xl font-bold italic w-full md:w-64 border-none shadow-inner focus:ring-2 focus:ring-primary"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() =>
              document.getElementById("new_hire_modal").showModal()
            }
            className="btn btn-primary rounded-xl px-8 font-black italic uppercase shadow-xl shadow-primary/20 border-none whitespace-nowrap"
          >
            + New Hire
          </button>
        </div>
      </div>

      {/* 2. DEPARTMENT PERFORMANCE SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div
          className={`bg-white p-8 rounded-[2rem] shadow-lg border-l-8 ${deptConfig[activeDept].theme}`}
        >
          <p className="text-[10px] font-black uppercase opacity-40 tracking-widest">
            Active {deptConfig[activeDept].label}
          </p>
          <h3 className="text-4xl font-black italic text-neutral">
            {filteredStaff.length}{" "}
            <span className="text-sm opacity-20 italic font-bold">UNITS</span>
          </h3>
        </div>
        <div
          className={`bg-white p-8 rounded-[2rem] shadow-lg border-l-8 ${deptConfig[activeDept].theme}`}
        >
          <p className="text-[10px] font-black uppercase opacity-40 tracking-widest">
            Avg {deptConfig[activeDept].metric}
          </p>
          <h3 className="text-4xl font-black italic text-neutral">
            96.2<span className="text-sm opacity-20 italic font-bold">%</span>
          </h3>
        </div>
        <div className="bg-neutral p-8 rounded-[2rem] shadow-lg border-l-8 border-success">
          <p className="text-[10px] font-black uppercase text-white/40 tracking-widest">
            System Status
          </p>
          <h3 className="text-4xl font-black italic text-success uppercase">
            Optimal
          </h3>
        </div>
      </div>

      {/* 3. EMPLOYEE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredStaff.length > 0 ? (
          filteredStaff.map((staff) => (
            <div
              key={staff.id}
              className="group bg-white rounded-[2.5rem] p-8 shadow-xl border border-base-200 hover:bg-neutral transition-all duration-500 relative overflow-hidden"
            >
              {/* Header: Identity */}
              <div className="flex justify-between items-start mb-10 relative z-10">
                <div className="flex items-center gap-5">
                  <div
                    className={`w-16 h-16 bg-base-200 group-hover:bg-white/10 rounded-2xl flex items-center justify-center font-black italic text-2xl group-hover:text-white transition-all ${deptConfig[activeDept].color}`}
                  >
                    {staff.name.charAt(0)}
                  </div>
                  <div>
                    <span className="text-[9px] font-black uppercase opacity-30 group-hover:text-white/30 tracking-[0.3em]">
                      {staff.id}
                    </span>
                    <h3 className="text-xl font-black italic uppercase tracking-tighter group-hover:text-white leading-none mt-1">
                      {staff.name}
                    </h3>
                    <p className="text-[10px] font-black text-secondary uppercase mt-2 italic tracking-widest">
                      {staff.role}
                    </p>
                  </div>
                </div>
                <div
                  className={`badge font-black italic text-[8px] p-3 border-none text-white shadow-lg ${staff.status === "OFFLINE" ? "bg-neutral/40" : "bg-success shadow-success/20"}`}
                >
                  {staff.status}
                </div>
              </div>

              {/* Tactical Metric Box */}
              <div className="bg-slate-50 group-hover:bg-white/5 p-6 rounded-3xl border border-transparent group-hover:border-white/10 transition-all relative z-10">
                <p className="text-[9px] font-black uppercase opacity-40 group-hover:text-white/40 mb-2 tracking-widest">
                  Current {deptConfig[activeDept].metric}
                </p>
                <div className="flex justify-between items-end">
                  <span
                    className={`text-4xl font-black italic group-hover:text-white ${deptConfig[activeDept].color}`}
                  >
                    {staff.val}
                  </span>
                  <div className="text-right">
                    <p className="text-[8px] font-black uppercase opacity-30 group-hover:text-white/30 italic">
                      Assigned Unit
                    </p>
                    <p className="text-[11px] font-black text-primary uppercase italic">
                      {staff.sub}
                    </p>
                  </div>
                </div>
              </div>

              {/* Hidden Action Overlay (Visible on Hover) */}
              <div className="mt-8 flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0 relative z-10">
                <button className="btn btn-xs btn-ghost text-white font-black italic uppercase text-[9px] border border-white/10 px-4">
                  View File
                </button>

                <button
                  onClick={() =>
                    alert(`Establishing link to Pilot: ${staff.name}...`)
                  }
                  className="btn btn-xs btn-secondary font-black italic uppercase text-[9px] px-6 shadow-lg shadow-secondary/30"
                >
                  Signal Pilot
                </button>
              </div>

              {/* Background Aesthetic Watermark */}
              <div className="absolute -right-4 -bottom-4 text-8xl font-black italic opacity-[0.03] group-hover:opacity-[0.08] group-hover:text-white transition-all select-none uppercase tracking-tighter leading-none">
                {activeDept}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border-4 border-dashed border-base-200">
            <p className="text-xl font-black italic text-neutral/20 uppercase tracking-widest">
              No personnel found in {deptConfig[activeDept].label}
            </p>
          </div>
        )}
      </div>

      {/* NEW HIRE MODAL */}
      <dialog id="new_hire_modal" className="modal">
        <div className="modal-box bg-white rounded-[2rem] border-t-8 border-primary p-10">
          <h3 className="text-3xl font-black italic uppercase text-neutral mb-2">
            Onboard <span className="text-primary">Personnel</span>
          </h3>
          <p className="text-[10px] font-black uppercase tracking-widest text-neutral/40 mb-8">
            Registry: Human Capital Management
          </p>

          <form method="dialog" className="space-y-4">
            <div className="form-control">
              <label className="label py-0 mb-1">
                <span className="label-text font-black uppercase italic text-[10px] opacity-40">
                  Full Legal Name
                </span>
              </label>
              <input
                type="text"
                className="input input-bordered bg-base-200 border-none font-bold italic"
                placeholder="e.g. John Doe"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label py-0 mb-1">
                  <span className="label-text font-black uppercase italic text-[10px] opacity-40">
                    Department
                  </span>
                </label>
                <select className="select select-bordered bg-base-200 border-none font-bold italic">
                  <option>FLEET</option>
                  <option>WAREHOUSE</option>
                  <option>FINANCE</option>
                </select>
              </div>
              <div className="form-control">
                <label className="label py-0 mb-1">
                  <span className="label-text font-black uppercase italic text-[10px] opacity-40">
                    Specific Role
                  </span>
                </label>
                <input
                  type="text"
                  className="input input-bordered bg-base-200 border-none font-bold italic"
                  placeholder="e.g. Lead Pilot"
                />
              </div>
            </div>
            <div className="modal-action mt-10">
              <button className="btn btn-ghost font-black italic uppercase text-xs">
                Cancel
              </button>
              <button className="btn btn-primary px-10 text-white font-black italic uppercase rounded-xl">
                Initialize Contract
              </button>
            </div>
          </form>
        </div>
        <form
          method="dialog"
          className="modal-backdrop bg-neutral/40 backdrop-blur-sm"
        >
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default Employees;
