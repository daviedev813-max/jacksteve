import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

// 1. IMPORT SUB-COMPONENTS
import HarvestModal from "../components/HarvestModal";
import FarmerReceipt from "../components/documents/FarmerReceipt";

const API_BASE_URL = "https://jacksteve.onrender.com";

const FarmerDashboard = () => {
  const [harvests, setHarvests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHarvest, setSelectedHarvest] = useState(null);
  const [stats, setStats] = useState({
    total: "0 Bags",
    pending: "0 Bags",
    earnings: "KES 0",
    nextPickup: "TBD",
  });

  // ✅ STABILIZED DATA FETCHING
  const fetchHarvests = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(`${API_BASE_URL}/api/farmers`, config);
      const data = res.data.data;

      setHarvests(data);

      const totalBags = data.reduce((acc, curr) => acc + curr.maizeQuantity, 0);
      const pendingBags = data
        .filter((h) => h.status !== "COLLECTED")
        .reduce((acc, curr) => acc + curr.maizeQuantity, 0);

      // Logic: KES 3,200 per bag as per Financial Terminal
      setStats({
        total: `${totalBags} Bags`,
        pending: `${pendingBags} Bags`,
        earnings: `KES ${(totalBags * 3200).toLocaleString()}`,
        nextPickup: data.find((h) => h.status === "IN_TRANSIT")
          ? "Today"
          : "Wait Dispatch",
      });
      setLoading(false);
    } catch (err) {
      console.error("Farmer Terminal Sync Error:", err);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Avoid synchronous setState in effect
    const runFetch = async () => {
      await fetchHarvests();
    };
    runFetch();
  }, [fetchHarvests]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center font-black italic uppercase animate-pulse bg-base-200/50">
        Syncing Harvest Manifest...
      </div>
    );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-base-200/50">
      {/* SIDEBAR - Farmer View */}
      <aside className="w-full lg:w-72 bg-white shadow-xl border-r border-base-300">
        <div className="p-8 sticky top-0">
          <div className="badge badge-secondary font-black mb-8 rounded-none tracking-[0.2em] italic text-[10px] py-3 px-4">
            JACKSTEVE FARMER
          </div>
          <ul className="menu menu-md p-0 gap-3">
            <li>
              <Link to="/farmer/dashboard" className="active bg-secondary text-white font-black italic uppercase tracking-tighter shadow-lg shadow-secondary/20">
                📊 Overview
              </Link>
            </li>
            <li>
              <Link to="/harvests" className="hover:bg-secondary/10 hover:text-secondary font-bold uppercase italic text-[11px] tracking-widest transition-all px-4 py-3">
                🌽 My Harvests
              </Link>
            </li>
            <li>
              <Link to="/schedule" className="hover:text-secondary font-bold uppercase italic text-[11px] tracking-widest transition-all px-4 py-3">
                🚛 Pickup Schedule
              </Link>
            </li>
            <li>
              <Link to="/payments" className="hover:text-secondary font-bold uppercase italic text-[11px] tracking-widest transition-all px-4 py-3">
                💳 Payments
              </Link>
            </li>
            <div className="divider opacity-10"></div>
            <li>
              <button onClick={() => { localStorage.removeItem('token'); window.location.href='/login'; }} className="text-error font-black italic uppercase text-xs tracking-widest text-left px-4">
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      </aside>

      <main className="flex-grow p-6 lg:p-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-black italic text-neutral uppercase tracking-tighter leading-none">
              HARVEST <span className="text-secondary">CONTROL</span>
            </h1>
            <p className="text-neutral/40 font-bold uppercase tracking-widest text-xs mt-2 italic">
              Jacksteve Reliable Sourcing Terminal
            </p>
          </div>
          <button
            onClick={() => document.getElementById("harvest_modal").showModal()}
            className="btn btn-primary rounded-xl shadow-xl shadow-primary/20 px-10 h-16 italic font-black uppercase text-white border-none hover:scale-105 transition-transform"
          >
            + Log New Harvest
          </button>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Total Harvest", value: stats.total, icon: "🌽", color: "text-secondary" },
            { label: "Pending Pickup", value: stats.pending, icon: "🚛", color: "text-primary" },
            { label: "Total Earnings", value: stats.earnings, icon: "💳", color: "text-success" },
            { label: "Next Pickup", value: stats.nextPickup, icon: "📅", color: "text-warning" },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-[2rem] shadow-xl border-b-4 border-secondary group hover:-translate-y-1 transition-all">
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral/40 mb-1">{stat.label}</p>
              <h3 className={`text-3xl font-black italic tracking-tighter ${stat.color}`}>{stat.value}</h3>
              <span className="absolute top-4 right-4 text-2xl opacity-10 group-hover:opacity-100 transition-opacity">{stat.icon}</span>
            </div>
          ))}
        </div>

        {/* TABLE */}
        <div className="bg-white shadow-2xl rounded-[2.5rem] border border-base-200 overflow-hidden">
          <div className="p-8 bg-neutral text-white flex justify-between items-center">
            <h3 className="text-xl font-black italic uppercase tracking-tight">Recent Manifests</h3>
            <span className="badge badge-outline border-secondary text-secondary font-black italic px-4 py-3">SEASON: 2026-A</span>
          </div>
          <div className="overflow-x-auto p-4">
            <table className="table table-lg w-full">
              <thead>
                <tr className="uppercase italic font-black text-neutral/30 tracking-widest border-b-2 text-xs">
                  <th>Date</th>
                  <th>Quantity</th>
                  <th>Grade Status</th>
                  <th>Status</th>
                  <th className="text-right">Voucher</th>
                </tr>
              </thead>
              <tbody className="font-bold text-neutral/80 italic">
                {harvests.map((harvest) => (
                  <tr key={harvest._id} className="hover:bg-base-200/50 transition-colors border-b border-slate-50">
                    <td>{new Date(harvest.createdAt).toLocaleDateString()}</td>
                    <td className="text-secondary font-black">{harvest.maizeQuantity} BAGS</td>
                    <td>
                        <div className={`badge badge-ghost font-black italic text-[9px] uppercase ${harvest.grade === 'REJECT' ? 'text-error' : 'text-neutral/40'}`}>
                            {harvest.grade || "UNGRADED"}
                        </div>
                    </td>
                    <td>
                      <div className={`badge rounded-none font-black text-[9px] p-3 text-white border-none ${
                        harvest.status === "COLLECTED" ? "bg-success shadow-lg shadow-success/20" : "bg-primary"
                      }`}>
                        {harvest.status.replace("_", " ")}
                      </div>
                    </td>
                    <td className="text-right">
                        <button 
                            onClick={() => { setSelectedHarvest(harvest); document.getElementById('receipt_modal').showModal(); }}
                            className="btn btn-xs btn-ghost text-secondary underline font-black uppercase tracking-tighter"
                        >
                            Receipt
                        </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODALS */}
        <HarvestModal onHarvestLogged={fetchHarvests} />
        
        <dialog id="receipt_modal" className="modal">
          <div className="modal-box max-w-4xl bg-white rounded-[2.5rem] p-0 overflow-hidden shadow-2xl border-4 border-neutral">
            {selectedHarvest && <FarmerReceipt data={selectedHarvest} />}
            <div className="p-6 bg-slate-50 border-t flex justify-end">
              <form method="dialog"><button className="btn btn-neutral btn-sm rounded-xl font-black italic uppercase px-8">Dismiss</button></form>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop bg-neutral/80 backdrop-blur-md"><button>close</button></form>
        </dialog>
      </main>
    </div>
  );
};

export default FarmerDashboard;
