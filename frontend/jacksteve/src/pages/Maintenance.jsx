import { useState, useEffect } from "react";
import axios from "axios";

const Maintenance = () => {
  const [fleetHealth, setFleetHealth] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");


  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/fleet/status", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFleetHealth(res.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Diagnostic Sync Error", err);
      }
    };
    fetchData();
  }, []);

  // Utility to determine "Service Urgency"
  const getUrgency = (truck) => {
    if (truck.telemetry.fuelLevel < 20 || truck.status === "MAINTENANCE") return "CRITICAL";
    if (truck.telemetry.fuelLevel < 50) return "WARNING";
    return "OPTIMAL";
  };

  const filteredFleet = fleetHealth.filter(t => {
    if (filter === "ALL") return true;
    return getUrgency(t) === filter;
  });

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-40">
      <span className="loading loading-ring loading-lg text-primary mb-4"></span>
      <p className="font-black italic text-neutral/20 uppercase tracking-[0.5em] text-xs">Calibrating Sensors...</p>
    </div>
  );

  return (
    <div className="p-6 lg:p-12 bg-slate-50 min-h-screen">
      {/* 🛠️ HEADER & CONTROL CENTER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8">
        <div>
          <div className="badge badge-outline border-neutral/10 font-black italic uppercase text-[9px] px-4 py-3 mb-4 opacity-50">
            Sector: Service Bay 04
          </div>
          <h1 className="text-6xl md:text-8xl font-black italic text-neutral uppercase tracking-tighter leading-[0.8]">
            SERVICE <span className="text-primary text-shadow-glow">VAULT</span>
          </h1>
        </div>

        <div className="flex flex-wrap gap-3">
          {["ALL", "OPTIMAL", "WARNING", "CRITICAL"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-3 rounded-xl font-black italic uppercase text-[10px] tracking-widest transition-all ${
                filter === status 
                ? "bg-neutral text-white shadow-xl scale-105" 
                : "bg-white text-neutral/40 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* 🚀 DIAGNOSTIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredFleet.map((truck) => {
          const urgency = getUrgency(truck);
          return (
            <div key={truck.truckId} className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group hover:-translate-y-2 transition-all duration-500">
              
              {/* Status Indicator Light */}
              <div className={`absolute top-10 right-10 w-3 h-3 rounded-full animate-pulse ${
                urgency === "CRITICAL" ? "bg-error shadow-[0_0_15px_rgba(255,0,0,0.5)]" : 
                urgency === "WARNING" ? "bg-warning" : "bg-success"
              }`}></div>

              <div className="mb-10">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-1 italic">Asset #{truck.truckId.split('-').pop()}</p>
                <h3 className="text-3xl font-black italic uppercase tracking-tighter text-neutral leading-none">{truck.truckId}</h3>
                <p className="text-[11px] font-bold text-neutral/30 uppercase mt-2">{truck.model}</p>
              </div>

              {/* LIVE TELEMETRY DATA */}
              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="bg-slate-50 p-5 rounded-[1.5rem] border border-slate-100">
                   <p className="text-[8px] font-black uppercase opacity-30 mb-1">Fuel Reserve</p>
                   <p className={`text-xl font-black italic ${truck.telemetry.fuelLevel < 30 ? 'text-error' : 'text-neutral'}`}>
                    {truck.telemetry.fuelLevel}%
                   </p>
                </div>
                <div className="bg-slate-50 p-5 rounded-[1.5rem] border border-slate-100">
                   <p className="text-[8px] font-black uppercase opacity-30 mb-1">Odometer</p>
                   <p className="text-xl font-black italic text-neutral">12,450 <span className="text-[10px] opacity-30">KM</span></p>
                </div>
              </div>

              {/* ENGINEERING PROGRESS BARS */}
              <div className="space-y-6 mb-12">
                <div className="group/bar">
                  <div className="flex justify-between text-[9px] font-black uppercase mb-2 tracking-widest">
                    <span className="opacity-40">System Oil Life</span>
                    <span className="text-primary group-hover/bar:scale-110 transition-transform">82%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: '82%' }}></div>
                  </div>
                </div>

                <div className="group/bar">
                  <div className="flex justify-between text-[9px] font-black uppercase mb-2 tracking-widest">
                    <span className="opacity-40">Tyre Integrity</span>
                    <span className="text-secondary group-hover/bar:scale-110 transition-transform">94%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-secondary h-full rounded-full" style={{ width: '94%' }}></div>
                  </div>
                </div>
              </div>

              {/* ACTION FOOTER */}
              <div className="flex items-center gap-4 pt-8 border-t border-slate-50">
                <button 
                  onClick={() => alert(`Initiating diagnostics for ${truck.truckId}...`)}
                  className="flex-grow py-4 bg-neutral text-white rounded-2xl font-black italic uppercase text-[10px] tracking-widest hover:bg-primary hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95"
                >
                  Log Full Service
                </button>
                <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xl grayscale hover:grayscale-0 transition-all cursor-help opacity-40 hover:opacity-100">
                   🖨️
                </div>
              </div>

              {/* Decorative Background Text */}
              <div className="absolute -bottom-4 -right-4 text-9xl font-black italic opacity-[0.02] select-none pointer-events-none uppercase">
                {truck.truckId.split('-').pop()}
              </div>
            </div>
          );
        })}
      </div>

      {/* NO RESULTS STATE */}
      {filteredFleet.length === 0 && (
        <div className="text-center py-40 border-4 border-dashed border-slate-200 rounded-[4rem]">
          <p className="text-2xl font-black italic text-neutral/10 uppercase tracking-widest">No Assets Match This Filter</p>
        </div>
      )}
    </div>
  );
};

export default Maintenance;
