import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// --- SUB-COMPONENTS ---
import Employees from "./Employees";
import Maintenance from "./Maintenance";
import AdminFinancials from "./AdminFinancials";
import LiveOpsView from "./LiveOpsView";
import AdminDispatchControl from "./AdminDispatchControl";

// Leaflet Icon Fix
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const API_BASE_URL = "https://jacksteve.onrender.com";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const AdminFleetDashboard = () => {
  const [fleet, setFleet] = useState([]);
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("LIVE_OPS");
  const [selectedHarvest, setSelectedHarvest] = useState(null);

 const fetchCommandData = useCallback(async () => {
  try {
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    const [fleetRes, harvestRes] = await Promise.all([
      axios.get(`${API_BASE_URL}/api/fleet/status`, config),
      // Use the absolute URL here too!
      axios.get(`${API_BASE_URL}/api/farmers`, config),
    ]);

    // React 18+ batches these, but if you're on an older version or 
    // want to be explicit, updates should happen together.
    const filteredQueue = harvestRes.data.data.filter(
      (h) => h.status === "PENDING_PICKUP" || h.status === "PENDING_DISPATCH"
    );

    setFleet(fleetRes.data.data);
    setQueue(filteredQueue);
  } catch (err) {
    console.error("Command Link Failure:", err);
  } finally {
    // Move setLoading here so it only triggers once at the end
    setLoading(false);
  }
}, []);


  useEffect(() => {
    fetchCommandData();
    const interval = setInterval(fetchCommandData, 30000);
    return () => clearInterval(interval);
  }, [fetchCommandData]);

  const handleOpenDispatch = (harvestId) => {
    setSelectedHarvest(harvestId);
    document.getElementById("dispatch_modal").showModal();
  };

  const confirmDeployment = async (truckId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_BASE_URL}/api/fleet/assign`, 
        { truckId, harvestId: selectedHarvest }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      document.getElementById("dispatch_modal").close();
      alert(`🛰️ UNIT ${truckId} DEPLOYED`);
      fetchCommandData();
    } catch (err) {
      alert(err.response?.data?.message || "Deployment Failed.");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
      <span className="loading loading-infinity loading-lg text-primary scale-150"></span>
      <p className="font-black italic text-white uppercase tracking-[0.5em] text-[10px] animate-pulse">Syncing Command Uplink</p>
    </div>
  );

  return (
    <div className="p-6 lg:p-12 bg-slate-50 min-h-screen font-sans">
      
      {/* 1. COMMAND HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-8">
        <div>
          <div className="badge badge-primary font-black italic rounded-full mb-4 px-6 uppercase tracking-widest text-[9px] py-4 shadow-lg shadow-primary/20">
            JS Strategic Asset Command
          </div>
          <h1 className="text-6xl lg:text-8xl font-black italic uppercase text-neutral tracking-tighter leading-[0.85]">
            FLEET <span className="text-primary text-shadow-glow">COMMAND</span>
          </h1>
        </div>
        
        <div className="stats bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl px-6 divide-x divide-slate-50">
          <div className="stat">
            <div className="stat-title font-black uppercase text-[9px] opacity-40">Available</div>
            <div className="stat-value text-primary italic text-4xl">{fleet.filter(t => t.status === 'IDLE').length}</div>
          </div>
          <div className="stat">
            <div className="stat-title font-black uppercase text-[9px] opacity-40">Radar Hits</div>
            <div className="stat-value text-secondary italic text-4xl">{queue.length}</div>
          </div>
        </div>
      </div>

      {/* 2. NAVIGATION */}
      <div className="flex gap-3 mb-12 overflow-x-auto pb-4 scrollbar-hide">
        {["LIVE_OPS", "TACTICAL_DISPATCH", "MAINTENANCE", "EMPLOYEES", "FINANCIALS"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-10 py-5 rounded-[1.5rem] font-black italic uppercase text-[11px] tracking-widest transition-all duration-300 ${
              activeTab === tab 
                ? "bg-neutral text-white shadow-2xl scale-105 border-b-4 border-primary" 
                : "bg-white text-neutral/40 hover:bg-white hover:text-neutral border border-slate-200"
            }`}
          >
            {tab.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* 3. DYNAMIC CONTENT AREA */}
      <div className={activeTab === "TACTICAL_DISPATCH" ? "w-full" : "grid lg:grid-cols-4 gap-10"}>
        
        <div className={activeTab === "TACTICAL_DISPATCH" ? "w-full" : "lg:col-span-3"}>
          {activeTab === "LIVE_OPS" && <LiveOpsView fleet={fleet} />}
          {activeTab === "TACTICAL_DISPATCH" && <AdminDispatchControl />}
          {activeTab === "MAINTENANCE" && <Maintenance />}
          {activeTab === "EMPLOYEES" && <Employees />}
          {activeTab === "FINANCIALS" && <AdminFinancials />}
        </div>

        {activeTab !== "TACTICAL_DISPATCH" && (
          <aside className="lg:col-span-1">
            <div className="card bg-neutral text-white p-8 rounded-[3rem] shadow-2xl sticky top-10 border-t-8 border-primary overflow-hidden group">
              <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                <h3 className="text-2xl font-black italic uppercase">Radar</h3>
                <span className="badge badge-primary font-black animate-pulse px-3">{queue.length}</span>
              </div>
              
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {queue.length > 0 ? queue.map((task) => (
                  <div key={task._id} className="p-6 bg-white/5 rounded-[2rem] border border-white/5 hover:bg-white/10 transition-all">
                    <div className="flex justify-between mb-4">
                        <span className="text-[9px] font-black text-secondary uppercase italic">Mission Pending</span>
                        <span className="text-[9px] opacity-20 font-black italic">#{task._id.slice(-4)}</span>
                    </div>
                    <p className="font-black italic text-xl text-white uppercase truncate mb-1">{task.location || task.dropOffLocation}</p>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{task.maizeQuantity || task.quantity} Units</p>
                    <button onClick={() => handleOpenDispatch(task._id)} className="mt-6 w-full py-4 bg-primary text-white rounded-xl font-black italic uppercase text-[10px] shadow-xl hover:scale-105 transition-all">
                      Deploy Asset →
                    </button>
                  </div>
                )) : (
                  <div className="text-center py-20 opacity-20 italic text-[10px] uppercase font-black tracking-widest">Radar Clear</div>
                )}
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* 4. MODAL: Tactical Deployment */}
      <dialog id="dispatch_modal" className="modal">
        <div className="modal-box bg-neutral text-white rounded-[3rem] p-0 border-t-8 border-primary max-w-6xl shadow-2xl overflow-hidden">
          <div className="p-10 border-b border-white/5">
            <h3 className="text-5xl font-black italic uppercase tracking-tighter">Tactical <span className="text-primary">Deployment</span></h3>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 italic mt-2">Asset Allocation Terminal v4.0</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* MAP VIEW */}
            <div className="h-[600px] border-r border-white/5 relative">
              <MapContainer center={[-1.286, 36.817]} zoom={7} className="h-full w-full grayscale brightness-75 contrast-125">
                <TileLayer url="https://{s}://{z}/{x}/{y}{r}.png" />
                {fleet.filter(t => t.status === "IDLE").map(truck => (
                  <Marker key={truck.truckId} position={[truck.location?.coordinates?.lat || 0, truck.location?.coordinates?.lng || 0]}>
                    <Popup>
                      <div className="p-2 text-center">
                        <p className="font-black uppercase text-[10px] mb-2">{truck.truckId}</p>
                        <button onClick={() => confirmDeployment(truck.truckId)} className="btn btn-xs btn-primary font-black italic">Assign Pilot</button>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
              <div className="absolute top-6 left-6 z-[400] bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-[9px] font-black italic uppercase">Live Asset Telemetry</div>
            </div>

            {/* SELECTION LIST */}
            <div className="p-10 space-y-4 max-h-[600px] overflow-y-auto bg-black/20 custom-scrollbar">
              {fleet.filter(t => t.status === "IDLE").length > 0 ? fleet.filter(t => t.status === "IDLE").map((truck) => (
                <button key={truck.truckId} onClick={() => confirmDeployment(truck.truckId)} className="w-full group flex flex-col p-8 bg-white/5 hover:bg-primary transition-all duration-500 border border-white/5 rounded-[2.5rem] relative overflow-hidden">
                  <div className="flex justify-between items-start w-full relative z-10">
                    <div className="flex items-center gap-6 text-left">
                      <span className="text-5xl group-hover:scale-125 transition-transform duration-500">🚛</span>
                      <div>
                        <p className="font-black italic text-3xl uppercase tracking-tighter group-hover:text-white transition-colors">{truck.truckId}</p>
                        <p className="text-[10px] font-black text-secondary uppercase group-hover:text-white/60 italic">{truck.model}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-black italic text-xl ${truck.telemetry.fuelLevel < 30 ? "text-error" : "text-primary"} group-hover:text-white`}>{truck.telemetry.fuelLevel}%</p>
                      <p className="text-[8px] font-black uppercase opacity-20 group-hover:opacity-40 tracking-widest">Fuel</p>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex items-center justify-between w-full bg-black/40 p-4 rounded-2xl group-hover:bg-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-black text-xs">{truck.currentDriver.charAt(0)}</div>
                        <p className="font-black italic text-[10px] uppercase">{truck.currentDriver}</p>
                    </div>
                    <span className="text-[9px] font-black italic group-hover:animate-bounce">ENGAGE PILOT →</span>
                  </div>
                  <div className="absolute -right-6 -bottom-6 text-9xl font-black italic opacity-[0.02] group-hover:opacity-[0.05] uppercase">{truck.truckId.split("-").pop()}</div>
                </button>
              )) : (
                <div className="text-center py-32 border-2 border-dashed border-white/5 rounded-[3rem] opacity-20 font-black italic uppercase tracking-widest">No Assets Docked</div>
              )}
            </div>
          </div>

          <div className="p-8 flex justify-between items-center bg-black/40">
            <p className="text-[9px] font-bold opacity-30 italic uppercase">Satellite Link: STABLE</p>
            <form method="dialog"><button className="btn btn-ghost btn-sm font-black italic uppercase text-[10px] text-error opacity-40 hover:opacity-100">Abort Mission</button></form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default AdminFleetDashboard;
