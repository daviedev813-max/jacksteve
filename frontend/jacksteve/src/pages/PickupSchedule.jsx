import { useState, useEffect } from "react";
import axios from "axios";

const PickupSchedule = () => {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPickups = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/farmers", {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Filter for active logistics only
        setPickups(res.data.data.filter(h => h.status !== 'COLLECTED'));
        setLoading(false);
      } catch (err) {
        console.error("Logistics Sync Error", err);
      }
    };
    fetchPickups();
  }, []);

  if (loading) return <div className="p-20 font-black italic animate-pulse text-center">LINKING TO DISPATCH...</div>;

  return (
    <div className="p-6 lg:p-12 bg-base-200/50 min-h-screen">
      <div className="mb-10">
        <h1 className="text-5xl font-black italic text-neutral uppercase tracking-tighter">
          LOGISTICS <span className="text-primary">TRACKER</span>
        </h1>
        <p className="text-neutral/40 font-bold uppercase tracking-widest text-xs mt-2 italic">Real-time Fleet Positioning</p>
      </div>

      <div className="grid gap-8">
        {pickups.length > 0 ? pickups.map((item) => (
          <div key={item._id} className="bg-white rounded-[2.5rem] shadow-2xl border border-base-200 overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              
              {/* LEFT: PROGRESS STEPS */}
              <div className="flex-grow p-10">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral/30">Manifest ID</span>
                    <h2 className="text-xl font-black italic text-secondary uppercase">#{item._id.slice(-6)}</h2>
                  </div>
                  <div className="badge badge-primary font-black italic p-4 tracking-tighter">ETA: 45 MINS</div>
                </div>

                <ul className="steps steps-vertical lg:steps-horizontal w-full font-black italic uppercase text-[10px]">
                  <li className="step step-primary" data-content="✓">Logged</li>
                  <li className={`step ${item.status === 'IN_TRANSIT' ? 'step-primary' : ''}`} data-content="🚛">Dispatched</li>
                  <li className="step" data-content="📍">At Hub</li>
                  <li className="step" data-content="⚖️">Weighed</li>
                </ul>
              </div>

              {/* RIGHT: DRIVER CARD */}
              <div className="w-full lg:w-80 bg-neutral p-10 text-white flex flex-col justify-center border-l border-white/10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="avatar placeholder">
                    <div className="bg-secondary text-white rounded-full w-12 font-black italic">JD</div>
                  </div>
                  <div>
                    <p className="text-[10px] opacity-40 font-black uppercase tracking-widest">Assigned Driver</p>
                    <p className="font-black italic uppercase">John "Speedy" Doe</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white/5 p-4 rounded-xl">
                    <p className="text-[10px] opacity-40 font-black uppercase mb-1">Truck Plate</p>
                    <p className="font-black italic text-secondary tracking-widest">KCA 442X</p>
                  </div>
                  <button className="btn btn-secondary btn-block rounded-xl font-black italic uppercase">
                    Call Driver
                  </button>
                </div>
              </div>

            </div>
          </div>
        )) : (
          <div className="bg-white p-20 rounded-[3rem] text-center border-4 border-dashed border-base-300">
            <p className="text-2xl font-black italic text-neutral/20 uppercase">No Active Pickups Scheduled</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PickupSchedule;
