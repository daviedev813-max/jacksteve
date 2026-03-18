import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
const API_BASE_URL = "https://jacksteve.onrender.com";


const FinancialTerminal = () => {
  const [finances, setFinances] = useState([]);
  const [stats, setStats] = useState({ totalSpent: 0, pendingInvoices: 0, creditLimit: 10 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFinanceData = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        // Fetch specific Finance Stats & All Requests
        const [statsRes, requestsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/supply/finance-stats`, config),
          axios.get(`${API_BASE_URL}/api/supply`, config)
        ]);

        setStats(statsRes.data.data);
        setFinances(requestsRes.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Financial Uplink Error:", err);
      }
    };
    fetchFinanceData();
  }, []);

  if (loading) return <div className="p-10 font-black italic animate-pulse">SYNCING LEDGERS...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 lg:p-12 bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start mb-12">
        <div>
          <h1 className="text-5xl font-black italic text-neutral uppercase tracking-tighter">
            FINANCIAL <span className="text-secondary">TERMINAL</span>
          </h1>
          <p className="text-neutral/40 font-bold uppercase tracking-widest text-xs mt-2 italic">
            Industrial Credit & Settlement Feed
          </p>
        </div>
        <button className="btn btn-neutral rounded-xl font-black italic uppercase px-8 mt-4 md:mt-0">
          Download Statement (PDF)
        </button>
      </div>

      {/* FINANCE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-neutral text-white p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.82v-1.91c-1.84-.4-3.18-1.51-3.27-3.33h1.91c.12.9 1.1 1.41 2.36 1.41 1.4 0 2.21-.69 2.21-1.4 0-.96-.71-1.39-2.31-1.93-2.07-.69-3.55-1.42-3.55-3.38 0-1.74 1.34-2.84 3.16-3.23V5h2.82v1.9c1.55.33 2.82 1.34 3 3.03h-1.92c-.11-.84-1.02-1.31-2.08-1.31-1.22 0-2 .57-2 1.37 0 .8.62 1.15 2.14 1.69 2.24.77 3.72 1.55 3.72 3.66 0 1.9-1.4 3.01-3.41 3.38z"/></svg>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Total Operational Spend</p>
          <h3 className="text-4xl font-black italic mt-1">
            KES {stats.totalSpent?.toLocaleString()}
          </h3>
          <p className="text-[10px] font-bold text-secondary mt-4 uppercase italic">Active Settlement Required</p>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-xl border-2 border-slate-100">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral/40">System Credit Limit</p>
          <h3 className="text-4xl font-black italic text-neutral mt-1">10.0 <span className="text-lg text-slate-300">M</span></h3>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-6 overflow-hidden">
            <div className="bg-secondary h-full" style={{ width: '42%' }}></div>
          </div>
          <p className="text-[10px] font-bold text-neutral/60 mt-2 uppercase">42% Credit Utilized</p>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-xl border-2 border-slate-100">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral/40">Loop Savings (Backhaul)</p>
          <h3 className="text-4xl font-black italic text-green-600 mt-1">15%</h3>
          <p className="text-[10px] font-bold text-neutral/60 mt-6 uppercase">Reduction in Industrial Tariffs</p>
        </div>
      </div>

      {/* LEDGER TABLE */}
      <div className="bg-white shadow-2xl rounded-[2.5rem] border border-base-200 overflow-hidden">
        <div className="p-8 bg-neutral text-white">
          <h3 className="text-xl font-black italic uppercase tracking-tight">Industrial Ledger</h3>
        </div>
        <div className="overflow-x-auto p-4">
          <table className="table table-lg w-full">
            <thead>
              <tr className="uppercase italic font-black text-neutral/30 tracking-widest border-b-2 text-xs">
                <th>Invoice #</th>
                <th>Tonnage</th>
                <th>Cost (KES)</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="font-bold text-neutral/80 italic">
              {finances.map((manifest) => (
                <tr key={manifest._id} className="hover:bg-slate-50 border-b border-slate-50">
                  <td className="text-[10px]">INV-{manifest._id.slice(-6).toUpperCase()}</td>
                  <td>{manifest.quantity} T</td>
                  <td className="font-black">{(manifest.estimatedCost || 0).toLocaleString()}</td>
                  <td>
                    <div className={`badge rounded-none font-black italic text-[10px] ${
                      manifest.paymentStatus === 'PAID' ? 'badge-success text-white' : 
                      manifest.paymentStatus === 'PARTIAL' ? 'badge-warning' : 'badge-error text-white'
                    }`}>
                      {manifest.paymentStatus || 'UNPAID'}
                    </div>
                  </td>
                  <td>
                    <button className="btn btn-ghost btn-xs font-black italic uppercase text-secondary">
                      View Bill
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default FinancialTerminal;
