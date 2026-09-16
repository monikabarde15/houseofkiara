import React, { useMemo, useState } from 'react';
import { Payout } from "../../../services/payoutApi";

interface ByProductTabProps {
  payouts?: Payout[];
}

const statusBadgeClasses: Record<string, string> = {
  'Paid': 'bg-green-100 text-green-700',
  'Pending': 'bg-[#fff3d6] text-[#8a6a2c]',
  'Failed': 'bg-red-100 text-red-700',
  'Reversed': 'bg-gray-100 text-gray-700',
};

export default function ByProductTab({ payouts = [] }: ByProductTabProps) {
  // Only show rental transactions or relevant payouts
  const rentalPayouts = payouts.filter(p => p.mode === 'Rental' || p.mode === 'Preloved Sale');
  const PRODUCT_NAMES = Array.from(new Set(rentalPayouts.map(t => t.productName))).sort();
  
  const [selectedProduct, setSelectedProduct] = useState<string>(PRODUCT_NAMES[0] ?? '');

  const productTransactions = useMemo(
    () => rentalPayouts.filter(t => t.productName === selectedProduct),
    [selectedProduct, rentalPayouts]
  );

  return (
    <div className="space-y-4 text-xs font-sans">
      <div className="space-y-1 max-w-md">
        <label className="uppercase text-[11px] tracking-wider font-bold text-stone-400">
          Select Rental Product
        </label>
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          className="w-full px-3 py-2 border border-stone-200 rounded-md text-sm bg-white focus:outline-none focus:border-[#c5a880]"
        >
          {PRODUCT_NAMES.map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
          {PRODUCT_NAMES.length === 0 && <option>No Products Available</option>}
        </select>
      </div>

      <div className="bg-white rounded-lg border border-stone-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
            <thead>
              <tr className="bg-stone-50 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-200">
                <th className="px-4 py-3">Mode</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Lister</th>
                <th className="px-4 py-3">Transaction Value</th>
                <th className="px-4 py-3">HOK Commission</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-600 font-sans">
              {productTransactions.map((t, idx) => (
                <tr
                  key={t.id}
                  className={`hover:bg-[#fcf9f5] transition-colors ${idx % 2 === 1 ? 'bg-stone-50/40' : ''}`}
                >
                  <td className="px-4 py-3 text-stone-500">{t.mode}</td>
                  <td className="px-4 py-3">{new Date(t.dueDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-[#8a6a2c] font-mono text-[10px]">{t.orderId}</td>
                  <td className="px-4 py-3 font-semibold text-[#8a6a2c]">{t.listerName}</td>
                  <td className="px-4 py-3 font-medium">₹{(Number(t.transactionAmount || ((t.listerShare || 0) + (t.hokCommission || 0))) || 0).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-stone-500">₹{(Number(t.hokCommission) || 0).toLocaleString('en-IN')}</td>
                  <td className={`px-4 py-3 font-semibold ${t.status === 'Paid' ? 'text-green-600' : 'text-orange-500'}`}>
                    ₹{(Number(t.listerShare) || 0).toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-medium ${statusBadgeClasses[t.status] || statusBadgeClasses['Pending']}`}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
              {productTransactions.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-stone-400">
                    No transactions match this product.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-stone-400 px-1">
        This view isolates the rental and payout history of individual products so you can track how much a specific piece has earned over its lifetime.
      </p>
    </div>
  );
}