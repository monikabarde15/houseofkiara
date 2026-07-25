import React, { useMemo, useState } from 'react';

// ============================================================
// BY PRODUCT TAB
// This is the content for the "By Product" tab only — your
// parent screen already renders the Payment Queue / All Payouts /
// By Lister / By Product / Damage Compensation tab bar and time
// filter, same as ByProductTab and AllPayoutsTab siblings.
//
// TODO(backend): this file currently ships its own MOCK_PAYOUTS
// copy so it can run standalone. Once you have a real payouts
// data source, delete MOCK_PAYOUTS here and pass the same list
// used in AllPayoutsTab down as a prop instead, e.g.:
//   <ByProductTab payouts={payouts} />
// so both tabs always show the same numbers.
// ============================================================

type PayoutStatus = 'Paid' | 'Pending Approval';

interface RentalTransaction {
  id: string;
  productName: string;
  rentalNumber: string;   // "Rental #1", "Rental #2"...
  date: string | null;    // null = not yet processed
  orderId: string;
  listerName: string;
  transactionValue: number;
  payoutPercent: string;
  amount: number;
  status: PayoutStatus;
}

// TODO(backend): swap for real fetched data, scoped to rental
// transactions only (By Product groups rental history per piece —
// preloved sales and damage comp rows don't belong in this view).
const MOCK_TRANSACTIONS: RentalTransaction[] = [
  { id: 't1', productName: 'Crimson Zardozi Bridal Lehenga', rentalNumber: 'Rental #1', date: '10 Jan 2026', orderId: 'HOK-ORD-006', listerName: 'Meera Joshi', transactionValue: 8500, payoutPercent: '65%', amount: 5525, status: 'Paid' },
  { id: 't2', productName: 'Crimson Zardozi Bridal Lehenga', rentalNumber: 'Rental #2', date: '5 Feb 2026', orderId: 'HOK-ORD-007', listerName: 'Meera Joshi', transactionValue: 8500, payoutPercent: '60%', amount: 5100, status: 'Paid' },
  { id: 't3', productName: 'Crimson Zardozi Bridal Lehenga', rentalNumber: 'Rental #3', date: null, orderId: 'HOK-ORD-001', listerName: 'Meera Joshi', transactionValue: 8500, payoutPercent: '55%', amount: 4675, status: 'Pending Approval' },
  { id: 't4', productName: 'Crimson Zardozi Bridal Lehenga', rentalNumber: 'Rental #4', date: null, orderId: 'HOK-ORD-009', listerName: 'Meera Joshi', transactionValue: 8500, payoutPercent: '55%', amount: 4675, status: 'Pending Approval' },
  { id: 't5', productName: 'Rose Georgette Anarkali', rentalNumber: 'Rental #1', date: null, orderId: 'HOK-ORD-003', listerName: 'Aishwarya Sharma', transactionValue: 6500, payoutPercent: '60%', amount: 3900, status: 'Pending Approval' },
];

// Distinct product list for the dropdown, derived from the mock
// transactions so it never falls out of sync with the table below.
// TODO(backend): once real data lands, derive this the same way
// (unique productName values) or fetch a dedicated products list.
const PRODUCT_NAMES = Array.from(new Set(MOCK_TRANSACTIONS.map(t => t.productName)));

const statusBadgeClasses: Record<PayoutStatus, string> = {
  'Paid': 'bg-green-100 text-green-700',
  'Pending Approval': 'bg-[#fff3d6] text-[#8a6a2c]',
};

export default function ByProductTab() {
  const [selectedProduct, setSelectedProduct] = useState<string>(PRODUCT_NAMES[0] ?? '');

  const productTransactions = useMemo(
    () => MOCK_TRANSACTIONS.filter(t => t.productName === selectedProduct),
    [selectedProduct]
  );

  return (
    <div className="space-y-4 text-xs font-sans">

      {/* Product selector */}
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
        </select>
      </div>

      {/* Rental history table for the selected product */}
      <div className="bg-white rounded-lg border border-stone-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
            <thead>
              <tr className="bg-stone-50 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-200">
                <th className="px-4 py-3">Transaction</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Lister</th>
                <th className="px-4 py-3">Transaction Value</th>
                <th className="px-4 py-3">Payout %</th>
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
                  <td className="px-4 py-3 font-semibold text-stone-900">
                    {t.rentalNumber}
                  </td>

                  {/* NOTE: renders "—" for not-yet-processed rentals.
                      Your screenshot showed the literal text "null" here —
                      that's the raw value printing straight to the DOM
                      (date field is genuinely null, just not guarded).
                      Using "—" instead so it reads as "not processed yet"
                      rather than looking like a bug. */}
                  <td className="px-4 py-3">
                    {t.date ?? '—'}
                  </td>

                  <td className="px-4 py-3 text-[#8a6a2c] font-mono text-[10px]">
                    {t.orderId}
                  </td>

                  <td className="px-4 py-3 text-[#8a6a2c] font-medium">
                    {t.listerName}
                  </td>

                  <td className="px-4 py-3">
                    ₹{t.transactionValue.toLocaleString('en-IN')}
                  </td>

                  <td className="px-4 py-3 font-semibold text-stone-900">
                    {t.payoutPercent}
                  </td>

                  <td className="px-4 py-3 font-medium">
                    ₹{t.amount.toLocaleString('en-IN')}
                  </td>

                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-medium ${statusBadgeClasses[t.status]}`}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}

              {productTransactions.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-stone-400">
                    No rental history for this product yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}