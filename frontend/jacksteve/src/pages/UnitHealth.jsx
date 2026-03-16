import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

// 1. Define the missing PageWrapper here
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

const UnitHealth = () => {
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFleetStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        // Update this endpoint to match your truck/fleet route
        const res = await axios.get("/api/supply", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Filter out orders to get unique assigned trucks
        const assignedTrucks = res.data.data
          .filter(order => order.assignedTruck)
          .map(order => order.assignedTruck);
        
        setTrucks(assignedTrucks);
        setLoading(false);
      } catch (err) {
        console.error("Fleet Telemetry Link Failure", err);
        setLoading(false);
      }
    };
    fetchFleetStatus();
  }, []);

  if (loading) return <div className="p-10 font-black italic animate-pulse uppercase">Syncing Unit Telemetry...</div>;

  return (
    <PageWrapper>
      <div className="p-6 lg:p-12 bg-slate-50 min-h-screen">
        <div className="mb-10">
          <h1 className="text-5xl font-black italic text-neutral uppercase tracking-tighter">
            UNIT <span className="text-secondary">HEALTH</span>
          </h1>
          <p className="text-neutral/40 font-bold uppercase tracking-widest text-[10px] mt-2 italic">
            Real-Time Fleet Diagnostics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trucks.length > 0 ? trucks.map((truck) => (
            <div key={truck._id} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 hover:shadow-2xl transition-all">
              <div className="flex justify-between items-center mb-6">
                <div className="badge badge-neutral font-black italic uppercase rounded-none text-[10px] py-3">
                  {truck.truckId}
                </div>
                <span className={`h-3 w-3 rounded-full animate-pulse ${truck.status === 'ON_ROUTE' ? 'bg-success' : 'bg-warning'}`}></span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                    <span>Fuel Level</span>
                    <span className="text-secondary">{truck.telemetry.fuelLevel}%</span>
                  </div>
                  <progress className="progress progress-secondary w-full" value={truck.telemetry.fuelLevel} max="100"></progress>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                  <div>
                    <p className="text-[9px] font-black uppercase text-neutral/40">Status</p>
                    <p className="font-bold italic uppercase text-xs">{truck.status}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase text-neutral/40">Cargo</p>
                    <p className="font-bold italic uppercase text-xs">{truck.activeMission.cargoType}</p>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
               <p className="font-black italic text-neutral/20 uppercase tracking-widest">No active units in sector</p>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default UnitHealth;
