import { useState, forwardRef } from "react";
import axios from "axios";
const API_BASE_URL = "https://jacksteve.onrender.com";

const SupplyRequestModal = forwardRef(({ onOrderLogged }, ref) => {
  const [activeTab, setActiveTab] = useState("miller");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    quantity: "",
    dropOffLocation: "",
    commodityType: "WHITE MAIZE",
    grade: "UNGRADED",
    isBackhaulEligible: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Double check the values before sending
    const qty = Number(formData.quantity);
    const loc = formData.dropOffLocation?.trim();

    // 2. Client-side guard
    if (!qty || !loc) {
      alert("❌ Error: Please enter a valid Quantity and Location.");
      setLoading(false);
      return;
    }

    const payload = {
      quantity: qty,
      location: loc, // 👈 Add this (likely what the error wants)
      dropOffLocation: loc, // Keep this for the controller destructuring
      commodityType: formData.commodityType,
      isBackhaulEligible: formData.isBackhaulEligible,
      qualityMetrics: {
        grade: formData.grade,
      },
    };

    try {
      const token = localStorage.getItem("token");
      const endpoint =
        activeTab === "miller" ? `${API_BASE_URL}/api/supply/request` : `${API_BASE_URL}/api/farmers/request`;

      const res = await axios.post(endpoint, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        alert(`🛰️ LOGISTICS INITIALIZED`);
        setFormData({
          quantity: "",
          dropOffLocation: "",
          commodityType: "WHITE MAIZE",
          grade: "UNGRADED",
          isBackhaulEligible: true,
        });
        ref.current?.close();
        if (onOrderLogged) onOrderLogged();
      }
    } catch (err) {
      // This will now show the SPECIFIC message from your backend
      const errorMsg = err.response?.data?.message || "Internal Server Error";
      alert(`❌ DISPATCH ERROR: ${errorMsg}`);
      console.error("Payload sent:", payload);
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog ref={ref} className="modal overflow-hidden">
      <div className="modal-box p-0 max-w-2xl bg-base-100 shadow-2xl overflow-hidden border border-white/10 rounded-[2.5rem] z-50">
        <div className="grid grid-cols-2">
          <button
            type="button"
            onClick={() => setActiveTab("miller")}
            className={`py-5 text-xs font-black uppercase italic tracking-widest transition-all ${activeTab === "miller" ? "bg-secondary text-white shadow-inner" : "bg-base-200 text-neutral/40 hover:text-neutral"}`}
          >
            🏗️ Miller Supply
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("farmer")}
            className={`py-5 text-xs font-black uppercase italic tracking-widest transition-all ${activeTab === "farmer" ? "bg-primary text-white shadow-inner" : "bg-base-200 text-neutral/40 hover:text-neutral"}`}
          >
            🌾 Farmer Collection
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 lg:p-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-neutral leading-none">
              {activeTab === "miller" ? "Initialize " : "Book "}
              <span
                className={
                  activeTab === "miller" ? "text-secondary" : "text-primary"
                }
              >
                {activeTab === "miller" ? "Manifest" : "Pickup"}
              </span>
            </h2>
            <div className="badge badge-outline opacity-30 font-bold text-[10px] uppercase">
              Ops Terminal 2.0
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-black uppercase italic text-[10px] opacity-60">
                  Commodity
                </span>
              </label>
              <select
                className="select select-bordered rounded-xl font-bold uppercase text-xs"
                value={formData.commodityType}
                onChange={(e) =>
                  setFormData({ ...formData, commodityType: e.target.value })
                }
              >
                <option value="WHITE MAIZE">White Maize</option>
                <option value="YELLOW MAIZE">Yellow Maize</option>
                <option value="ANIMAL FEED">Animal Feed</option>
                <option value="CEMENT">Cement</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-black uppercase italic text-[10px] opacity-60">
                  Quality Grade
                </span>
              </label>
              <select
                className="select select-bordered rounded-xl font-bold uppercase text-xs"
                value={formData.grade}
                onChange={(e) =>
                  setFormData({ ...formData, grade: e.target.value })
                }
              >
                <option value="UNGRADED">Ungraded</option>
                <option value="GRADE_1">Grade 1 (Premium)</option>
                <option value="GRADE_2">Grade 2 (Standard)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-black uppercase italic text-[10px] opacity-60">
                  Tonnage (MT)
                </span>
              </label>
              <input
                type="number"
                className="input input-bordered rounded-xl font-bold"
                placeholder="0"
                required
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-black uppercase italic text-[10px] opacity-60">
                  Backhaul Loop?
                </span>
              </label>
              <select
                className="select select-bordered rounded-xl font-bold text-xs"
                value={formData.isBackhaulEligible.toString()}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    isBackhaulEligible: e.target.value === "true",
                  })
                }
              >
                <option value="true">Enable Loop (Savings)</option>
                <option value="false">One-Way Only</option>
              </select>
            </div>
          </div>

          <div className="form-control mt-2">
            <label className="label">
              <span className="label-text font-black uppercase italic text-[10px] opacity-60">
                Terminal / Dropoff Location
              </span>
            </label>
            <input
              type="text"
              className="input input-bordered rounded-xl font-bold"
              placeholder="e.g. Unga Ltd Eldoret"
              required
              value={formData.dropOffLocation}
              onChange={(e) =>
                setFormData({ ...formData, dropOffLocation: e.target.value })
              }
            />
          </div>

          <div className="form-control mt-8">
            <button
              type="submit"
              disabled={loading}
              className={`btn btn-lg border-none text-white font-black italic uppercase tracking-widest rounded-xl shadow-xl transition-all hover:scale-[1.02] ${activeTab === "miller" ? "bg-secondary shadow-secondary/20" : "bg-primary shadow-primary/20"}`}
            >
              {loading ? "Processing Dispatch..." : "Initialize Manifest →"}
            </button>
          </div>
        </form>
      </div>

      <form
        method="dialog"
        className="modal-backdrop bg-neutral/80 backdrop-blur-sm"
      >
        <button className="cursor-default">close</button>
      </form>
    </dialog>
  );
});

export default SupplyRequestModal;
