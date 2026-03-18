import { useState, useEffect } from "react";
import axios from "axios";
const API_BASE_URL = "https://jacksteve.onrender.com";

const MyHarvests = () => {
  const [harvests, setHarvests] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/api/farmers`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHarvests(res.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Ledger Sync Error", err);
      }
    };
    fetchData();
  }, []);

  const filteredData = filter === "ALL" 
    ? harvests 
    : harvests.filter(h => h.status === filter);

  if (loading) return <div className="p-20 font-black italic animate-pulse text-center uppercase tracking-widest">Accessing Ledger...</div>;

  return (
    <div className="p-6 lg:p-12 bg-base-200/50 min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <h1 className="text-5xl font-black italic text-neutral uppercase tracking-tighter">
            HARVEST <span className="text-secondary">LEDGER</span>
          </h1>
          <p className="text-neutral/40 font-bold uppercase tracking-widest text-xs mt-2 italic">Historical Record: Season 2026-A</p>
        </div>

        {/* FILTER TABS */}
        <div className="tabs tabs-boxed bg-white p-2 rounded-2xl shadow-inner border border-base-300">
          {["ALL", "PENDING_PICKUP", "IN_TRANSIT", "COLLECTED"].map((tab) => (
            <button 
              key={tab}
              onClick={() => setFilter(tab)}
              className={`tab font-black italic uppercase text-[10px] transition-all px-6 ${filter === tab ? 'bg-secondary text-white rounded-xl' : 'text-neutral/40'}`}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* LEDGER LIST */}
      <div className="grid gap-4">
        {filteredData.length > 0 ? filteredData.map((item) => (
          <div key={item._id} className="group bg-white hover:bg-neutral hover:text-white transition-all duration-300 rounded-[2rem] p-8 shadow-xl border border-base-200 flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* DATE & ID */}
            <div className="flex items-center gap-6 w-full md:w-auto">
              <div className="text-center px-6 py-4 bg-base-200 group-hover:bg-white/10 rounded-2xl">
                <p className="text-[10px] font-black uppercase opacity-40">Month</p>
                <p className="text-xl font-black italic uppercase text-secondary">
                  {new Date(item.createdAt).toLocaleString('default', { month: 'short' })}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase opacity-40 tracking-widest">Manifest Reference</p>
                <h3 className="text-lg font-black italic uppercase">#JS-{item._id.slice(-6)}</h3>
              </div>
            </div>

            {/* SPECS */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 flex-grow px-0 md:px-12 border-l-0 md:border-l border-white/10">
              <div>
                <p className="text-[10px] font-black uppercase opacity-40">Quantity</p>
                <p className="font-black italic text-xl uppercase tracking-tighter">{item.maizeQuantity} BAGS</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase opacity-40">Grade</p>
                <p className="font-black italic text-xl uppercase text-secondary">{item.grade}</p>
              </div>
              <div className="hidden md:block">
                <p className="text-[10px] font-black uppercase opacity-40">Drop-off Point</p>
                <p className="font-black italic text-sm uppercase truncate w-32">{item.location}</p>
              </div>
            </div>

            {/* STATUS & ACTION */}
            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0">
              <div className={`badge font-black italic text-[10px] p-4 uppercase border-none ${
                item.status === 'COLLECTED' ? 'bg-success/20 text-success' : 'bg-primary/20 text-primary'
              }`}>
                ● {item.status.replace('_', ' ')}
              </div>
              <button className="btn btn-circle btn-ghost group-hover:bg-white group-hover:text-neutral">
                <svg xmlns="http://www.w3.org" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

          </div>
        )) : (
          <div className="bg-white p-20 rounded-[3rem] text-center border-4 border-dashed border-base-300">
            <p className="text-2xl font-black italic text-neutral/20 uppercase tracking-widest">No Manifests Found Under This Category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyHarvests;
