import React, { useState } from 'react';
import { Payout } from "../../../services/payoutApi";

interface ByListerTabProps {
  payouts?: Payout[];
}

export default function ByListerTab({ payouts = [] }: ByListerTabProps) {
  // Get unique listers
  const listers = Array.from(new Set(payouts.map(p => p.listerName))).sort();
  const [selectedLister, setSelectedLister] = useState(listers[0] || "Select Lister");

  const listerPayouts = payouts.filter(p => p.listerName === selectedLister);
  const paidPayouts = listerPayouts.filter(p => p.status === 'Paid');
  const pendingPayouts = listerPayouts.filter(p => p.status === 'Pending');

  const totalEarned = paidPayouts.reduce((sum, p) => sum + p.listerShare, 0);
  const totalPending = pendingPayouts.reduce((sum, p) => sum + p.listerShare, 0);
  const avgPayoutPct = paidPayouts.length > 0 
    ? (paidPayouts.reduce((sum, p) => sum + (p.listerShare / (p.transactionAmount || (p.listerShare + p.hokCommission) || 1)), 0) / paidPayouts.length) * 100
    : 0;

  const nextDueDate = pendingPayouts.length > 0 
    ? new Date(Math.min(...pendingPayouts.map(p => new Date(p.dueDate).getTime()))).toLocaleDateString()
    : "—";

  const summaryCards = [
    { title: "TOTAL EARNED", value: `₹${totalEarned.toLocaleString('en-IN')}` },
    { title: "PENDING", value: `₹${totalPending.toLocaleString('en-IN')}` },
    { title: "AVG PAYOUT %", value: `${avgPayoutPct.toFixed(1)}%` },
    { title: "TRANSACTIONS", value: listerPayouts.length.toString() },
    { title: "NEXT PAYOUT DUE", value: nextDueDate },
  ];

  return (
    <div className="space-y-5">
      <div className="max-w-sm">
        <label className="block mb-2 text-[11px] font-semibold tracking-[1.4px] uppercase text-[#8D8275]">
          Select Lister
        </label>
        <select
          value={selectedLister}
          onChange={e => setSelectedLister(e.target.value)}
          className="w-full h-[42px] rounded-md border border-[#D8D1C8] bg-white px-4 text-[14px] text-[#4A433D] focus:outline-none"
        >
          {listers.map(lister => <option key={lister} value={lister}>{lister}</option>)}
          {listers.length === 0 && <option>No Listers Available</option>}
        </select>
      </div>

      <div className="flex items-center gap-3">
        <h2 className="text-[30px]" style={{ color: "#C49A53", fontFamily: "Cormorant Garamond, serif" }}>
          {selectedLister}
        </h2>
        <button className="h-8 w-8 rounded bg-[#22C55E] flex items-center justify-center text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.52 3.48A11.86 11.86 0 0 0 12.04 0C5.43 0 .06 5.37.06 11.98c0 2.11.55 4.17 1.59 5.99L0 24l6.2-1.63a11.92 11.92 0 0 0 5.83 1.49h.01c6.61 0 11.98-5.37 11.98-11.98 0-3.2-1.25-6.2-3.5-8.4Zm-8.48 18.4a9.9 9.9 0 0 1-5.05-1.39l-.36-.22-3.68.97.98-3.59-.23-.37a9.93 9.93 0 1 1 8.34 4.6Zm5.45-7.43c-.3-.15-1.79-.88-2.07-.98-.28-.1-.48-.15-.69.15-.2.3-.79.98-.96 1.18-.18.2-.35.23-.65.08-.3-.15-1.28-.47-2.43-1.5-.9-.8-1.5-1.8-1.68-2.1-.18-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.08-.15-.69-1.66-.94-2.27-.25-.6-.5-.52-.69-.53h-.58c-.2 0-.53.08-.8.38-.28.3-1.06 1.04-1.06 2.54s1.09 2.94 1.24 3.14c.15.2 2.14 3.27 5.18 4.58.72.31 1.28.49 1.72.63.72.23 1.38.2 1.9.12.58-.09 1.79-.73 2.04-1.43.25-.7.25-1.3.18-1.43-.08-.13-.28-.2-.58-.35Z" />
          </svg>
        </button>
        <button className="h-8 rounded border border-[#D8D1C8] bg-white px-4 text-[12px] font-medium text-[#4E4942]">
          Statement → WhatsApp
        </button>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {summaryCards.map((card) => (
          <div key={card.title} className="rounded border border-[#E6DDD4] bg-white px-5 py-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <div className="mb-3 text-[10px] font-semibold uppercase tracking-[1.5px] text-[#8D8275]">{card.title}</div>
            <div className="text-[20px] font-bold text-[#423C36]">{card.value}</div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded border border-[#E6DDD4] bg-white">
        <table className="w-full text-left text-[13px] text-[#423C36]">
          <thead className="border-b border-[#E6DDD4] bg-[#F7F4F0] text-[10px] font-bold uppercase tracking-[1px] text-[#8D8275]">
            <tr>
              <th className="px-5 py-3">Order</th>
              <th className="px-5 py-3">Product</th>
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3 text-right">Transaction</th>
              <th className="px-5 py-3 text-right">HOK Comm.</th>
              <th className="px-5 py-3 text-right">Lister Payout</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0ECE7]">
            {listerPayouts.map((row) => (
              <tr key={row.id}>
                <td className="px-5 py-4 font-mono text-[11px] text-[#A69C8E]">{row.orderId}</td>
                <td className="px-5 py-4">
                  <div className="font-semibold">{row.productName}</div>
                </td>
                <td className="px-5 py-4 text-[#7A7065]">{row.mode}</td>
                <td className="px-5 py-4 text-right">₹{(Number(row.transactionAmount || ((row.listerShare || 0) + (row.hokCommission || 0))) || 0).toLocaleString('en-IN')}</td>
                <td className="px-5 py-4 text-right text-[#A69C8E]">₹{(Number(row.hokCommission) || 0).toLocaleString('en-IN')}</td>
                <td className="px-5 py-4 text-right font-bold text-[#1F1B18]">₹{(Number(row.listerShare) || 0).toLocaleString('en-IN')}</td>
                <td className="px-5 py-4">
                  <span className={`inline-flex items-center rounded-sm px-1.5 py-0.5 text-[10px] font-semibold uppercase ${row.status === 'Paid' ? 'bg-[#EBF5ED] text-[#347A3E]' : 'bg-[#FEF5E5] text-[#B87A14]'}`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
            {listerPayouts.length === 0 && (
                <tr>
                    <td colSpan={7} className="px-5 py-4 text-center text-stone-500">No payouts found for this lister.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}