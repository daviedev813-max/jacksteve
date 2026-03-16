const MillerInvoice = ({ data }) => {
  const subtotal = data.quantity * 3500; // Example rate per ton
  const vat = subtotal * 0.16; // 16% VAT

  return (
    <div className="bg-white p-10 max-w-3xl mx-auto border-t-[12px] border-primary shadow-2xl rounded-2xl print:shadow-none">
      <div className="flex justify-between items-start mb-12">
        <div className="flex flex-col">
          <span className="text-4xl font-black italic text-neutral tracking-tighter uppercase leading-none">
            JACK<span className="text-primary">STEVE</span>
          </span>
          <span className="text-[9px] font-black tracking-[0.4em] text-secondary uppercase mt-2">Logistics Intelligence</span>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-black italic uppercase text-primary mb-1">VAT INVOICE</h2>
          <p className="font-bold text-xs">INV-{data._id?.slice(-6).toUpperCase()}</p>
        </div>
      </div>

      <div className="flex justify-between mb-12 bg-base-100 p-6 rounded-2xl border border-base-200">
        <div>
          <h4 className="text-[10px] font-black uppercase opacity-40 mb-2">Billed To:</h4>
          <p className="font-black italic text-lg uppercase text-neutral leading-none">{data.companyName}</p>
          <p className="text-xs font-bold opacity-50 mt-1">{data.location}</p>
        </div>
        <div className="text-right">
          <h4 className="text-[10px] font-black uppercase opacity-40 mb-2">System Date:</h4>
          <p className="font-black italic text-sm uppercase">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <table className="table w-full mb-8">
        <thead className="border-b-2 border-neutral uppercase italic font-black text-xs">
          <tr><th>Supply Manifest</th><th className="text-right">Tonnage</th><th className="text-right">Rate</th><th className="text-right">Total (KES)</th></tr>
        </thead>
        <tbody className="font-bold uppercase text-sm italic">
          <tr className="border-b border-base-200">
            <td>{data.commodityType || 'White Maize'}</td>
            <td className="text-right">{data.quantity}T</td>
            <td className="text-right">3,500.00</td>
            <td className="text-right">{(subtotal).toLocaleString()}</td>
          </tr>
        </tbody>
      </table>

      <div className="flex justify-end mb-12">
        <div className="w-full md:w-64 space-y-2 border-t-2 border-neutral pt-4">
          <div className="flex justify-between text-xs font-bold opacity-60"><span>Subtotal:</span><span>{subtotal.toLocaleString()}</span></div>
          <div className="flex justify-between text-xs font-bold opacity-60"><span>VAT (16%):</span><span>{vat.toLocaleString()}</span></div>
          <div className="flex justify-between text-xl font-black italic text-primary pt-2 border-t border-base-200">
            <span>TOTAL:</span><span>{(subtotal + vat).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <button onClick={() => window.print()} className="btn btn-primary btn-block text-white font-black italic uppercase rounded-xl print:hidden">
        Generate PDF / Print
      </button>
    </div>
  );
};

export default MillerInvoice;
