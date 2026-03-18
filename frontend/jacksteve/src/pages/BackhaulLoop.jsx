import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // For the 'Back' feature
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
const API_BASE_URL = "https://jacksteve.onrender.com";


const BackhaulLoop = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🛰️ STABILIZED FETCH
  const fetchBackhaul = useCallback(async () => {
  const token = localStorage.getItem("token");
  if (!token) return; // Don't even try the request if no token exists

  try {
    const res = await axios.get(`${API_BASE_URL}/api/supply/backhaul-opportunities`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setOpportunities(res.data.data || []);
  } catch (err) {
    console.error("Backhaul Link Failure", err);
    // If it's a 401, you might want to redirect to login
    if (err.response?.status === 401) {
       // Optional: window.location.href = '/login';
    }
  } finally {
    setLoading(false);
  }
}, []);


  useEffect(() => {
    fetchBackhaul();
  }, [fetchBackhaul]);

  const handleAssignBackhaul = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`/api/supply/assign-backhaul/${orderId}`, 
        { returnCommodity: "CEMENT", returnQuantity: 28 }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        alert(`✅ LOOP CLOSED: ${res.data.message}`);
        fetchBackhaul(); 
      }
    } catch {
      alert("❌ Dispatch Error: Could not assign return load.");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center font-black italic uppercase animate-pulse bg-slate-50">
      Scanning Sector for Empty Units...
    </div>
  );

  return (
    <div className="p-6 lg:p-12 bg-slate-50 min-h-screen">
      {/* TOP NAV: BACK FEATURE */}
      <div className="flex justify-between items-center mb-10">
        <button 
          onClick={() => navigate(-1)} 
          className="btn btn-ghost gap-2 font-black italic uppercase text-xs opacity-50 hover:opacity-100"
        >
          ← Back to Terminal
        </button>
        <div className="badge badge-primary font-black italic px-4 py-3 text-[10px] uppercase">Ops Node: BH-01</div>
      </div>

      <div className="mb-10">
        <h1 className="text-5xl md:text-7xl font-black italic uppercase text-neutral tracking-tighter leading-none">
          BACKHAUL <span className="text-primary">OPTIMIZATION</span>
        </h1>
        <p className="text-neutral/40 font-bold uppercase tracking-widest text-[10px] mt-2 italic">
          Empty Mile Reduction Terminal v2.0
        </p>
      </div>

      {/* EFFICIENCY HUD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-neutral text-white p-8 rounded-[2.5rem] shadow-xl border-l-8 border-primary group">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Ready Units</p>
          <h3 className="text-4xl font-black italic mt-1">{opportunities.length}</h3>
          <p className="text-[10px] font-bold text-primary mt-4 uppercase">Awaiting Return Leg</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {opportunities.map((opp) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              key={opp._id} 
              className="card bg-white shadow-2xl rounded-[2.5rem] border-t-8 border-primary p-8 hover:-translate-y-2 transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex flex-col">
                  <span className="badge badge-neutral font-black italic uppercase text-[9px] py-3 px-4 rounded-none">
                    UNIT: {opp.assignedTruck?.truckId || "N/A"}
                  </span>
                  <span className="text-[8px] font-black text-neutral/30 mt-2 uppercase tracking-widest">
                    REF: #{opp._id.slice(-6).toUpperCase()}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs font-black text-primary italic uppercase">Match Ready</span>
                  <span className="text-[9px] font-bold text-neutral/20 uppercase tracking-tighter">
                    {opp.assignedTruck?.telemetry?.fuelLevel}% Fuel
                  </span>
                </div>
              </div>

              <h2 className="text-2xl font-black italic uppercase tracking-tighter text-neutral">
                {opp.dropOffLocation}
              </h2>
              <div className="divider my-2 opacity-5"></div>
              
              <div className="flex flex-col gap-1 mb-8">
                 <p className="text-[10px] font-black text-neutral/40 uppercase tracking-widest">Inbound Cargo</p>
                 <p className="text-sm font-black italic text-neutral uppercase">
                    {opp.commodityType} <span className="text-primary">|</span> {opp.quantity}T
                 </p>
              </div>

              <button 
                onClick={() => handleAssignBackhaul(opp._id)}
                className="btn btn-primary w-full h-14 rounded-2xl shadow-lg shadow-primary/20 font-black italic uppercase tracking-widest border-none group-hover:scale-[1.02] active:scale-95 transition-all"
              >
                Assign Cement Return →
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {opportunities.length === 0 && (
          <div className="col-span-full py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 text-center">
             <p className="font-black italic text-neutral/20 uppercase tracking-[0.3em]">No idle units detected in sector</p>
          </div>
        )}
      </div>
    </div>
  );
};


export default BackhaulLoop;
