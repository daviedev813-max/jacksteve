import { useState, useEffect } from "react";
import axios from "axios";
const API_BASE_URL = "https://jacksteve.onrender.com";

const AdminFinancials = () => {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalStats, setGlobalStats] = useState({ margin: "0", fuelIndex: "0", totalRev: 0 });

  useEffect(() => {
    const fetchCombinedData = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // 🚀 FETCH BOTH: Farmer Harvests AND Miller Supply Requests
        const [farmerRes, millerRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/farmers`, config),
          axios.get(`${API_BASE_URL}/api/supply`, config)
        ]);

        // 1. Map Farmer Missions (Per Bag Logic)
        const farmerMissions = farmerRes.data.data.map(m => {
          const revenue = m.maizeQuantity * 3200; // KES per bag
          const expenses = (m.maizeQuantity * 120) + 5000; 
          return {
            id: `FARM-${m._id.slice(-4)}`,
            type: "FARMER",
            revenue,
            expenses,
            margin: revenue - expenses,
            fuelLitres: ((m.maizeQuantity * 120) / 165).toFixed(1),
            status: m.status
          };
        });

        // 2. Map Miller Missions (Industrial Tonnage Logic)
        const millerMissions = millerRes.data.data.map(m => {
          const revenue = m.quantity * 4200; // KES per Metric Ton
          const fuelCost = m.quantity * 800; // Industrial scale fuel
          const expenses = fuelCost + 12000; // Higher driver/toll overhead
          return {
            id: `MILL-${m._id.slice(-4)}`,
            type: "INDUSTRIAL",
            revenue,
            expenses,
            margin: revenue - expenses,
            fuelLitres: (fuelCost / 165).toFixed(1),
            status: m.status
          };
        });

        const allMissions = [...farmerMissions, ...millerMissions];
        
        // Calculate Global HUD Stats
        const totalRev = allMissions.reduce((acc, m) => acc + m.revenue, 0);
        const totalExp = allMissions.reduce((acc, m) => acc + m.expenses, 0);
        const avgFuel = (allMissions.reduce((acc, m) => acc + parseFloat(m.fuelLitres), 0) / allMissions.length).toFixed(1);

        setGlobalStats({
          margin: (((totalRev - totalExp) / totalRev) * 100).toFixed(1),
          fuelIndex: avgFuel,
          totalRev
        });

        setMissions(allMissions);
        setLoading(false);
      } catch (err) {
        console.error("Global Finance Link Failure", err);
      }
    };
    fetchCombinedData();
  }, []);

  if (loading) return <div className="p-20 font-black italic animate-pulse text-center text-white bg-slate-900 min-h-screen uppercase tracking-[0.5em]">Establishing Global Fiscal Uplink...</div>;

  return (
    <div className="p-6 lg:p-12 bg-slate-950 min-h-screen text-white font-sans selection:bg-success selection:text-black">
      
      {/* 1. GLOBAL REVENUE HUD */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
             <span className="h-2 w-2 bg-success rounded-full animate-ping"></span>
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Integrated Treasury Feed (Farmer + Miller)</span>
          </div>
          <h1 className="text-6xl lg:text-8xl font-black italic uppercase tracking-tighter leading-none">
            FISCAL <span className="text-success">TERM</span>
          </h1>
        </div>

        <div className="stats bg-white/5 border border-white/10 rounded-[2rem] shadow-2xl p-2">
          <div className="stat px-10 border-r border-white/10">
            <div className="stat-title text-[9px] font-black uppercase text-white/40 mb-1">Total Revenue</div>
            <div className="stat-value text-white italic text-3xl">KES {globalStats.totalRev.toLocaleString()}</div>
          </div>
          <div className="stat px-10">
            <div className="stat-title text-[9px] font-black uppercase text-white/40 mb-1">Fleet Gross Margin</div>
            <div className="stat-value text-success italic text-4xl">{globalStats.margin}%</div>
          </div>
        </div>
      </div>

      {/* 2. UNIFIED PROFITABILITY LEDGER */}
      <div className="bg-white/5 rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="p-10 border-b border-white/10 flex justify-between items-center bg-white/5">
          <h3 className="text-xl font-black italic uppercase tracking-tight">Cross-Sector Unit Economics</h3>
          <div className="flex gap-2">
            <span className="badge badge-success font-black italic text-[8px] p-2">FARMER</span>
            <span className="badge badge-primary font-black italic text-[8px] p-2">INDUSTRIAL</span>
          </div>
        </div>

        <div className="overflow-x-auto p-8">
          <table className="table table-lg w-full">
            <thead>
              <tr className="uppercase italic font-black text-white/20 tracking-widest border-b border-white/10 text-[10px]">
                <th>Mission ID</th>
                <th>Sector</th>
                <th>Fuel (L)</th>
                <th>Revenue</th>
                <th>Expenses</th>
                <th className="text-right">Net Margin</th>
              </tr>
            </thead>
            <tbody className="font-bold italic text-sm">
              {missions.map((m) => (
                <tr key={m.id} className="hover:bg-white/5 transition-all border-b border-white/5">
                  <td className="text-white/40">#{m.id}</td>
                  <td>
                    <span className={`text-[10px] px-2 py-1 rounded ${m.type === 'INDUSTRIAL' ? 'bg-primary/20 text-primary' : 'bg-success/20 text-success'}`}>
                      {m.type}
                    </span>
                  </td>
                  <td className="text-primary/70">{m.fuelLitres} L</td>
                  <td className="text-white">KES {m.revenue.toLocaleString()}</td>
                  <td className="text-error/60">- {m.expenses.toLocaleString()}</td>
                  <td className="text-right">
                    <div className={`inline-block px-4 py-2 rounded-xl border ${m.margin > 10000 ? 'border-success/40 text-success' : 'border-white/10 text-white/20'}`}>
                      KES {m.margin.toLocaleString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. EFFICIENCY RADAR */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-primary/10 p-10 rounded-[3rem] border border-primary/20">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6">Fuel Performance Index</h4>
            <div className="flex items-end gap-4 mb-4">
               <span className="text-6xl font-black italic leading-none">{globalStats.fuelIndex}</span>
               <span className="text-xl font-black italic text-primary/60 mb-1">L/Trip (Avg)</span>
            </div>
            <p className="text-[10px] font-bold uppercase text-white/30 italic">Aggregated across Farm & Industrial Units</p>
         </div>
         <div className="bg-secondary/10 p-10 rounded-[3rem] border border-secondary/20">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary mb-6">Earnings Per Mile</h4>
            <div className="flex items-end gap-4 mb-4">
               <span className="text-6xl font-black italic leading-none">412</span>
               <span className="text-xl font-black italic text-secondary/60 mb-1">KES/KM</span>
            </div>
            <p className="text-[10px] font-bold uppercase text-white/30 italic">Optimization: Backhaul active</p>
         </div>
      </div>
    </div>
  );
};

export default AdminFinancials;
