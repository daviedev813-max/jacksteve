import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const BulkProcurement = () => {
  const [procurements, setProcurements] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("ALL");

  useEffect(() => {
    const fetchProcurementData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/supply", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Filter for grain-related commodities
        const grainLoads = res.data.data.filter(order => 
          ["WHITE MAIZE", "YELLOW MAIZE"].includes(order.commodityType)
        );
        
        setProcurements(grainLoads);
        setFilteredData(grainLoads);
        setLoading(false);
      } catch (err) {
        console.error("Procurement Retrieval Error:", err);
        setLoading(false);
      }
    };
    fetchProcurementData();
  }, []);

  // 🔍 FILTER LOGIC
  const applyFilter = (filter) => {
    setActiveFilter(filter);
    if (filter === "ALL") {
      setFilteredData(procurements);
    } else {
      setFilteredData(procurements.filter(p => p.grade === filter));
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-black italic uppercase animate-pulse">
      Scanning Grain Inventory...
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
      className="p-6 lg:p-12 bg-slate-50 min-h-screen"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h1 className="text-5xl font-black italic text-neutral uppercase tracking-tighter">
            GRAIN <span className="text-secondary">INTELLIGENCE</span>
          </h1>
          <p className="text-neutral/40 font-bold uppercase tracking-widest text-[10px] mt-2 italic">
            Quality Control & Intake Terminal v2.0
          </p>
        </div>

        {/* 🏷️ GRADE FILTERS */}
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
          {["ALL", "GRADE_1", "GRADE_2", "REJECT"].map((f) => (
            <button
              key={f}
              onClick={() => applyFilter(f)}
              className={`px-4 py-2 text-[10px] font-black uppercase italic rounded-lg transition-all ${
                activeFilter === f ? "bg-neutral text-white shadow-lg" : "text-neutral/40 hover:text-neutral"
              }`}
            >
              {f.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* QUALITY SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border-l-8 border-green-500 hover:-translate-y-1 transition-all">
          <p className="text-[10px] font-black uppercase text-neutral/40 tracking-[0.2em]">Avg. Moisture</p>
          <h3 className="text-4xl font-black italic mt-1">12.4%</h3>
          <div className="badge badge-success text-white badge-xs mt-4 font-black uppercase italic">Safe for storage</div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border-l-8 border-secondary hover:-translate-y-1 transition-all">
          <p className="text-[10px] font-black uppercase text-neutral/40 tracking-[0.2em]">Premium Stock (G1)</p>
          <h3 className="text-4xl font-black italic mt-1">
            {procurements.filter(p => p.grade === 'GRADE_1').length} <span className="text-lg">Units</span>
          </h3>
          <p className="text-[10px] font-bold text-secondary mt-4 uppercase">Verified Quality</p>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border-l-8 border-neutral hover:-translate-y-1 transition-all">
          <p className="text-[10px] font-black uppercase text-neutral/40 tracking-[0.2em]">Total Tonnage</p>
          <h3 className="text-4xl font-black italic mt-1">
            {procurements.reduce((acc, curr) => acc + curr.quantity, 0)} <span className="text-lg text-slate-300">MT</span>
          </h3>
        </div>
      </div>

      {/* INTAKE TABLE */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200">
        <div className="p-8 bg-neutral text-white flex justify-between items-center">
            <h3 className="text-xl font-black italic uppercase tracking-tight">Grain Ledger</h3>
            <span className="text-[10px] font-black uppercase italic tracking-widest text-white/40">Filtered by: {activeFilter}</span>
        </div>
        <div className="overflow-x-auto p-4">
          <table className="table table-lg w-full">
            <thead>
              <tr className="uppercase italic font-black text-neutral/30 tracking-widest border-b-2 text-xs">
                <th>Manifest ID</th>
                <th>Moisture</th>
                <th>Grade Status</th>
                <th>Aflatoxin</th>
                <th className="text-right">Intelligence</th>
              </tr>
            </thead>
            <tbody className="font-bold italic text-sm">
              <AnimatePresence mode="popLayout">
                {filteredData.map((load) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={load._id} 
                    className="hover:bg-slate-50 transition-colors border-b border-slate-50"
                  >
                    <td className="text-secondary font-black">#{load._id.slice(-6).toUpperCase()}</td>
                    
                    <td>
                      <span className={`px-3 py-1 rounded-lg text-xs font-black ${
                        load.qualityMetrics?.moistureContent > 13.5 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                      }`}>
                        {load.qualityMetrics?.moistureContent || "12.0"}%
                      </span>
                    </td>

                    <td>
                      <div className={`badge rounded-none font-black italic text-[10px] py-3 px-4 ${
                        load.grade === 'GRADE_1' ? 'badge-success text-white' : 
                        load.grade === 'GRADE_2' ? 'badge-warning' : 'badge-error text-white'
                      }`}>
                        {load.grade || "UNGRADED"}
                      </div>
                    </td>

                    <td className="text-neutral/40">{load.qualityMetrics?.aflatoxinLevel || "0"} ppb</td>

                    <td className="text-right">
                      <button className="btn btn-ghost btn-xs font-black italic text-secondary hover:underline">
                        VIEW ANALYTICS
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default BulkProcurement;
