import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

// 1. IMPORT SUB-COMPONENTS
import MillerInvoice from "../components/documents/MillerInvoice";
import SupplyRequestModal from "../components/SupplyRequestModal";

const MillerDashboard = () => {
  const [activeOrders, setActiveOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // 🔥 REFS: This prevents the 'showModal of null' error
  const invoiceModalRef = useRef(null);
  const supplyModalRef = useRef(null);

  const [stats, setStats] = useState({
    tonnage: 0,
    trucks: 0,
    savings: 15,
    credit: 4.2,
  });

  // ✅ STABILIZED DATA FETCHING
  const fetchMillerData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const res = await axios.get("/api/supply", config);
      const data = res.data.data || [];

      const totalTons = data.reduce((acc, curr) => acc + curr.quantity, 0);
      const activeUnits = data.filter(order => order.assignedTruck && order.status !== 'DELIVERED').length;

      // Batching state updates
      setActiveOrders(data);
      setStats(prev => ({
        ...prev,
        tonnage: totalTons,
        trucks: activeUnits,
      }));
      setLoading(false);
    } catch (err) {
      console.error("Industrial Terminal Link Failure:", err);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMillerData();
  }, [fetchMillerData]);

  const handleLiveTrack = (order) => {
    if (!order.assignedTruck) {
      return alert("⚠️ UNIT PENDING: No truck assigned to this manifest yet.");
    }
    const { truckId, telemetry, location, status } = order.assignedTruck;
    alert(
      `🛰️ UNIT ${truckId} IDENTIFIED\n` +
      `Location: ${location.name}\n` +
      `Fuel: ${telemetry.fuelLevel}%\n` +
      `Status: ${status}`
    );
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center font-black italic uppercase animate-pulse bg-slate-50">
        Establishing Secure Uplink...
      </div>
    );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50">
      {/* SIDEBAR */}
      <aside className="w-full lg:w-72 bg-neutral text-white shadow-2xl">
        <div className="p-8 sticky top-0">
          <div className="badge badge-secondary font-black mb-6 rounded-none tracking-widest italic py-3 px-4 uppercase text-[10px]">
            Miller Portal
          </div>
          <ul className="menu menu-md p-0 gap-3">
            <li><Link to="/miller-portal" className="active bg-secondary font-black italic uppercase tracking-tighter shadow-lg">📦 Control Center</Link></li>
            <li><Link to="/bulk-procurement" className="hover:text-secondary font-bold uppercase italic text-xs">📈 Bulk Procurement</Link></li>
            <li><Link to="/backhaul-loop" className="hover:text-secondary font-bold uppercase italic text-xs">🏗️ Backhaul</Link></li>
            <li><Link to="/unit-health" className="hover:text-secondary font-bold uppercase italic text-xs">🚛 Unit Health</Link></li>
            <li><Link to="/financial-terminal" className="hover:text-secondary font-bold uppercase italic text-xs">💰 Financial Terminal</Link></li>
          </ul>
        </div>
      </aside>

      <main className="flex-grow p-6 lg:p-12">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-black italic text-neutral uppercase tracking-tighter leading-none">
              SUPPLY <span className="text-secondary">INTELLIGENCE</span>
            </h1>
            <p className="text-neutral/40 font-bold uppercase tracking-widest text-xs mt-2 italic">LIVE TELEMETRY FEED</p>
          </div>
          <button
            onClick={() => supplyModalRef.current?.showModal()}
            className="btn btn-secondary shadow-lg shadow-secondary/20 rounded-xl font-black italic uppercase px-10 text-white border-none h-14"
          >
            + New Bulk Order
          </button>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-8 rounded-3xl shadow-xl border-l-8 border-secondary group hover:-translate-y-1 transition-all">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral/40">Active Inbound</p>
            <h3 className="text-4xl font-black italic text-neutral mt-1">{stats.tonnage} <span className="text-lg">Tons</span></h3>
            <div className="badge badge-secondary badge-xs mt-4 uppercase font-black">{stats.trucks} Units Active</div>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-xl border-l-8 border-primary group hover:-translate-y-1 transition-all">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral/40">Efficiency</p>
            <h3 className="text-4xl font-black italic text-neutral mt-1">{stats.savings}%</h3>
            <p className="text-[10px] font-bold text-primary mt-4 uppercase italic">Loop Optimization Applied</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-xl border-l-8 border-neutral group hover:-translate-y-1 transition-all">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral/40">System Credit</p>
            <h3 className="text-4xl font-black italic text-neutral mt-1">{stats.credit} <span className="text-lg text-slate-300">M</span></h3>
            <progress className="progress progress-secondary w-full mt-4" value="70" max="100"></progress>
          </div>
        </div>

        {/* ACTIVE TABLE */}
        <div className="bg-white shadow-2xl rounded-[2.5rem] border border-base-200 overflow-hidden">
          <div className="p-8 bg-neutral text-white flex justify-between items-center">
            <h3 className="text-xl font-black italic uppercase tracking-tight">Active Supply Chain</h3>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest italic">Live Radar</span>
            </div>
          </div>
          <div className="overflow-x-auto p-4">
            <table className="table table-lg w-full">
              <thead>
                <tr className="uppercase italic font-black text-neutral/30 tracking-widest border-b-2 text-xs">
                  <th>Manifest ID</th>
                  <th>Commodity</th>
                  <th>Tonnage</th>
                  <th>Status</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody className="font-bold text-neutral/80 italic">
                {activeOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50 transition-colors border-b border-slate-50">
                    <td className="text-secondary font-black">#{order._id.slice(-6).toUpperCase()}</td>
                    <td className="uppercase">{order.commodityType}</td>
                    <td>{order.quantity} MT</td>
                    <td>
                      <div className={`badge rounded-none font-black text-[9px] p-2 ${order.status === "IN_TRANSIT" ? "badge-primary" : "badge-ghost"}`}>
                        {order.status.replace("_", " ")}
                      </div>
                    </td>
                    <td className="text-right flex justify-end gap-2">
                      <button onClick={() => handleLiveTrack(order)} className="btn btn-xs btn-ghost hover:text-secondary underline font-black uppercase">Track</button>
                      <button 
                        onClick={() => { 
                          setSelectedOrder(order); 
                          invoiceModalRef.current?.showModal(); 
                        }} 
                        className="btn btn-xs btn-ghost text-primary underline font-black uppercase"
                      >
                        Invoice
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODALS SECTION */}
        <SupplyRequestModal 
           id="supply_modal"
           ref={supplyModalRef}
           onOrderLogged={fetchMillerData} 
        />

        <dialog ref={invoiceModalRef} id="invoice_modal" className="modal">
          <div className="modal-box max-w-4xl bg-white rounded-3xl p-0 overflow-hidden shadow-2xl border-4 border-neutral">
            {selectedOrder && <MillerInvoice data={selectedOrder} />}
            <div className="p-4 bg-base-100 flex justify-center">
              <form method="dialog"><button className="btn btn-ghost btn-sm font-black italic uppercase">Close</button></form>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop bg-neutral/90 backdrop-blur-md"><button>close</button></form>
        </dialog>
      </main>
    </div>
  );
};

export default MillerDashboard;
