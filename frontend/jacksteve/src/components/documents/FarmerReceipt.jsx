const FarmerReceipt = ({ data }) => {
  const print = () => window.print();

  return (
    <div className="bg-white p-8 max-w-2xl mx-auto border-t-8 border-secondary shadow-2xl rounded-xl print:shadow-none print:border-none">
      <div className="flex justify-between items-start mb-10">
        <div>
          <h2 className="text-3xl font-black italic uppercase text-neutral tracking-tighter">
            HARVEST <span className="text-secondary">RECEIPT</span>
          </h2>
          <p className="text-[10px] font-black uppercase opacity-40">Jacksteve Logistics Ltd • Sourcing Div.</p>
        </div>
        <div className="text-right">
          <p className="font-black italic text-sm">NO: JS-RCV-{data._id?.slice(-5).toUpperCase()}</p>
          <p className="text-xs opacity-50">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-10 border-y border-base-200 py-6">
        <div>
          <span className="text-[10px] font-black uppercase opacity-40 block mb-1">Producer</span>
          <p className="font-bold text-neutral uppercase">{data.name}</p>
          <p className="text-xs opacity-60">{data.location}</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-black uppercase opacity-40 block mb-1">Status</span>
          <div className="badge badge-secondary font-black italic uppercase text-[10px]">Collected</div>
        </div>
      </div>

      <table className="table table-zebra w-full mb-10">
        <thead className="bg-base-200 uppercase italic font-black text-[10px]">
          <tr><th>Description</th><th className="text-right">Quantity</th></tr>
        </thead>
        <tbody className="font-bold uppercase italic text-sm">
          <tr><td>White Maize (Grade 1)</td><td className="text-right">{data.maizeQuantity} Bags</td></tr>
        </tbody>
      </table>

      <div className="text-center border-2 border-dashed border-base-300 p-6 rounded-2xl mb-8">
        <p className="text-[10px] font-black uppercase opacity-40 mb-2">Electronic Verification</p>
        <div className="bg-neutral text-white py-2 px-4 inline-block font-mono text-xs tracking-widest uppercase">
          SECURE-ID: {data._id}
        </div>
      </div>

      <button onClick={print} className="btn btn-secondary btn-block font-black italic uppercase print:hidden">
        Print Official Receipt
      </button>
    </div>
  );
};

export default FarmerReceipt;
