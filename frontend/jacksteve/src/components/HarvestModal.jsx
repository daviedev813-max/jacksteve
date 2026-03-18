import { useState } from "react";
import axios from "axios";

const API_BASE_URL = "https://jacksteve.onrender.com";

const HarvestModal = ({ onHarvestLogged }) => {
  const [formData, setFormData] = useState({
    maizeQuantity: "",
    grade: "GRADE 1",
    location: "",
    phone: ""
  });
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        location: formData.location,
        maizeQuantity: Number(formData.maizeQuantity),
        grade: formData.grade,
        phone: formData.phone
      };

      await axios.post(`${API_BASE_URL}/api/farmers/sell-maize`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // TRIGGER SUCCESS STATE
      setIsSuccess(true);
      onHarvestLogged(); // Refresh background data

      // DELAY FOR USER SATISFACTION
      setTimeout(() => {
        document.getElementById("harvest_modal").close();
        // Reset everything after modal closes
        setTimeout(() => {
          setIsSuccess(false);
          setFormData({ maizeQuantity: "", grade: "GRADE 1", location: "", phone: "" });
        }, 200);
      }, 2000);

    } catch (err) {
      console.error("Server Response:", err.response?.data);
      alert(err.response?.data?.message || "System Error: Could not log harvest.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog id="harvest_modal" className="modal">
      <div className="modal-box bg-white rounded-[2rem] border-t-8 border-secondary p-10 relative overflow-hidden">
        
        {/* SUCCESS OVERLAY - The "Best of the Best" touch */}
        {isSuccess && (
          <div className="absolute inset-0 z-50 bg-white flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mb-4 animate-bounce">
              <svg xmlns="http://www.w3.org" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-black italic uppercase text-neutral">Manifest Logged!</h3>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral/40 mt-2">Initialising Jacksteve Pickup...</p>
          </div>
        )}

        <h3 className="text-3xl font-black italic uppercase text-neutral mb-2">Log <span className="text-secondary">Harvest</span></h3>
        <p className="text-[10px] font-black uppercase tracking-widest text-neutral/40 mb-8">Data Entry: Season 2026-A</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label py-0 mb-1"><span className="label-text font-black uppercase italic text-[10px] opacity-40">Contact Phone</span></label>
              <input 
                type="tel" required placeholder="07XXXXXXXX"
                className="input input-bordered bg-base-200 border-none font-bold italic focus:ring-2 focus:ring-secondary transition-all" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>

            <div className="form-control">
              <label className="label py-0 mb-1"><span className="label-text font-black uppercase italic text-[10px] opacity-40">Tonnage (Bags)</span></label>
              <input 
                type="number" required
                className="input input-bordered bg-base-200 border-none font-bold italic focus:ring-2 focus:ring-secondary transition-all" 
                value={formData.maizeQuantity}
                onChange={(e) => setFormData({...formData, maizeQuantity: e.target.value})}
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label py-0 mb-1"><span className="label-text font-black uppercase italic text-[10px] opacity-40">Maize Grade</span></label>
            <select 
              className="select select-bordered bg-base-200 border-none font-bold italic focus:ring-2 focus:ring-secondary transition-all"
              value={formData.grade}
              onChange={(e) => setFormData({...formData, grade: e.target.value})}
            >
              <option>GRADE 1</option>
              <option>GRADE 2</option>
              <option>UNGRADED</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label py-0 mb-1"><span className="label-text font-black uppercase italic text-[10px] opacity-40">Collection Point (Location)</span></label>
            <input 
              type="text" required placeholder="e.g. Eldoret Hub"
              className="input input-bordered bg-base-200 border-none font-bold italic focus:ring-2 focus:ring-secondary transition-all" 
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
          </div>

          <div className="modal-action mt-8">
            <button 
              type="button" 
              className="btn btn-ghost font-black italic uppercase text-xs" 
              onClick={() => document.getElementById("harvest_modal").close()}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className={`btn btn-secondary px-10 text-white font-black italic uppercase rounded-xl shadow-xl transition-all ${loading ? 'loading' : ''}`}
            >
              {loading ? "Transmitting..." : "Initialize Pickup"}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop bg-neutral/60 backdrop-blur-md">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default HarvestModal;
