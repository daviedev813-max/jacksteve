import { useState, useEffect } from "react";
import axios from "axios";

const Payments = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [finStats, setFinStats] = useState({ totalPaid: 0, pending: 0 });

  useEffect(() => {
    const fetchFinancials = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/farmers", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = res.data.data;

        // Logic: Only COLLECTED harvests are "Paid", others are "Pending"
        const paid = data
          .filter(h => h.status === 'COLLECTED')
          .reduce((acc, curr) => acc + (curr.maizeQuantity * 3200), 0); // KES 3,200 per bag
        
        const pending = data
          .filter(h => h.status !== 'COLLECTED')
          .reduce((acc, curr) => acc + (curr.maizeQuantity * 3200), 0);

        setTransactions(data);
        setFinStats({ totalPaid: paid, pending: pending });
        setLoading(false);
      } catch (err) {
        console.error("Finance Sync Error", err);
      }
    };
    fetchFinancials();
  }, []);

  if (loading) return <div className="p-20 font-black italic animate-pulse text-center uppercase">Decrypting Ledger...</div>;

  return (
    <div className="p-6 lg:p-12 bg-base-200/50 min-h-screen">
      {/* FINANCIAL HEADER */}
      <div className="mb-12">
        <h1 className="text-5xl font-black italic text-neutral uppercase tracking-tighter leading-none">
          FINANCIAL <span className="text-success font-black">TERMINAL</span>
        </h1>
        <p className="text-neutral/40 font-bold uppercase tracking-widest text-xs mt-2 italic">Jacksteve Payout Gateway</p>
      </div>

      {/* BALANCE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-neutral p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-2">Total Dispersed (KES)</p>
            <h2 className="text-5xl md:text-6xl font-black italic text-success tracking-tighter">
              {finStats.totalPaid.toLocaleString()}
            </h2>
          </div>
          <div className="absolute right-[-20px] bottom-[-20px] text-9xl opacity-5 group-hover:rotate-12 transition-transform text-white italic font-black">KES</div>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border-b-8 border-warning flex flex-col justify-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral/40 mb-2">Pending Clearance</p>
          <h2 className="text-4xl font-black italic text-neutral tracking-tighter">
            {finStats.pending.toLocaleString()} <span className="text-sm opacity-30">UNPROCESSED</span>
          </h2>
        </div>
      </div>

      {/* TRANSACTION TABLE */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-base-200">
        <div className="p-8 bg-base-100 border-b border-base-200 flex justify-between items-center">
          <h3 className="text-xl font-black italic uppercase italic">Remittance History</h3>
          <button className="btn btn-ghost btn-sm font-black italic uppercase text-secondary">Export CSV</button>
        </div>
        
        <div className="overflow-x-auto p-6">
          <table className="table table-lg w-full">
            <thead>
              <tr className="uppercase italic font-black text-neutral/30 tracking-widest border-b-2 text-[10px]">
                <th>Ref ID</th>
                <th>Manifest Details</th>
                <th>Rate</th>
                <th>Gross Total</th>
                <th>Method</th>
                <th className="text-right">Voucher</th>
              </tr>
            </thead>
            <tbody className="font-bold text-neutral italic">
              {transactions.map((t) => (
                <tr key={t._id} className="hover:bg-base-200/50 transition-colors">
                  <td className="text-[11px] opacity-40">#JS-{t._id.slice(-5)}</td>
                  <td>
                    <div className="flex flex-col">
                      <span className="font-black text-sm uppercase">{t.maizeQuantity} BAGS</span>
                      <span className="text-[9px] opacity-40 uppercase tracking-widest font-black">{new Date(t.createdAt).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="text-[12px]">KES 3,200/Bag</td>
                  <td className={`font-black ${t.status === 'COLLECTED' ? 'text-success' : 'text-neutral/20'}`}>
                    KES {(t.maizeQuantity * 3200).toLocaleString()}
                  </td>
                  <td>
                    <span className="badge badge-outline border-neutral/10 font-black italic text-[9px] uppercase tracking-tighter p-3">M-PESA</span>
                  </td>
                  <td className="text-right">
                    {t.status === 'COLLECTED' ? (
                      <button className="btn btn-xs btn-secondary rounded-lg font-black italic px-4 shadow-lg shadow-secondary/20">Receipt</button>
                    ) : (
                      <span className="text-[9px] font-black uppercase opacity-20 italic">Awaiting Pickup</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payments;
