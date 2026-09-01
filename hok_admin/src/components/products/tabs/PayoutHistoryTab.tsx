// src/components/products/tabs/PayoutHistoryTab.tsx

import React, { useMemo } from 'react';
import { PayoutRecord } from '../../types/product';

interface PayoutHistoryTabProps {
  payoutHistory: PayoutRecord[];
  loading: boolean;
  isAdding?: boolean;
  condition?: string;
  rentedCount?: number;
  defaultSplitPercent?: number;
  onViewPayout?: (record: PayoutRecord) => void;
}

function formatDate(date?: string) {
  if (!date) return '—';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function statusBadgeClasses(status: string) {
  switch (status) {
    case 'Paid':
      return 'bg-emerald-50 text-emerald-700';
    case 'Pending Approval':
      return 'bg-amber-50 text-amber-700';
    default:
      return 'bg-stone-100 text-stone-600';
  }
}

export function PayoutHistoryTab({
  payoutHistory,
  loading,
  isAdding = false,
  condition = '—',
  rentedCount,
  defaultSplitPercent = 45,
  onViewPayout,
}: PayoutHistoryTabProps) {
  if (isAdding) {
    return (
      <div className="bg-white rounded-lg border border-stone-200/80 shadow-sm overflow-hidden">
        <div className="p-5 pb-3 space-y-1">
          <h3 className="font-serif font-bold text-stone-900 text-sm">Payout History &mdash; This Piece</h3>
          <p className="text-xs text-stone-500">
            Every rental of this piece is paid out individually. The percentage below reflects wear, demand, and
            negotiation at the time &mdash; not a fixed rate.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#fcf9f5] text-left text-[10px] uppercase tracking-wide text-stone-400 border-y border-stone-100">
                <th className="py-2.5 px-5 font-medium">Transaction #</th>
                <th className="py-2.5 px-3 font-medium">Date</th>
                <th className="py-2.5 px-3 font-medium">Order</th>
                <th className="py-2.5 px-3 font-medium">Lister</th>
                <th className="py-2.5 px-3 font-medium">Type</th>
                <th className="py-2.5 px-3 font-medium">Transaction Value</th>
                <th className="py-2.5 px-3 font-medium">Payout %</th>
                <th className="py-2.5 px-3 font-medium">Amount</th>
                <th className="py-2.5 px-5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={9} className="py-10 text-center text-stone-400 text-xs">
                  Payouts appear after this piece&rsquo;s first completed transaction.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="px-5 py-3 text-[10px] text-stone-400 border-t border-stone-100">
          Percentage progression across rentals is expected &mdash; later rentals typically settle lower as the piece
          sees more wear. See Master Data for starting defaults.
        </p>
      </div>
    );
  }
  const stats = useMemo(() => {
    const timesRented = payoutHistory.length;
    const avgSplit = timesRented
      ? Math.round(payoutHistory.reduce((sum, r) => sum + (r.payoutPercent || 0), 0) / timesRented)
      : 0;

    const paidRecords = payoutHistory.filter(r => r.status === 'Paid');
    const listerEarnedPaid = paidRecords.reduce((sum, r) => sum + (r.amount || 0), 0);
    const hokRetainedPaid = paidRecords.reduce(
      (sum, r) => sum + ((r.transactionValue || 0) - (r.amount || 0)),
      0
    );

    const lastRecord = payoutHistory[payoutHistory.length - 1];

    return { timesRented, avgSplit, listerEarnedPaid, hokRetainedPaid, lastRecord };
  }, [payoutHistory]);

  if (loading) {
    return (
      <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm">
        <p className="text-stone-400 text-center py-8 text-xs">Loading payout history...</p>
      </div>
    );
  }

  if (!payoutHistory || payoutHistory.length === 0) {
    return (
      <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm">
        <p className="text-stone-400 text-center py-8 text-xs">No payout records found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-lg border border-stone-200/80 shadow-sm">
          <p className="text-[10px] font-medium text-stone-400 uppercase tracking-wide">Times Rented</p>
          <p className="text-xl font-bold text-stone-900 mt-1">{stats.timesRented}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-stone-200/80 shadow-sm">
          <p className="text-[10px] font-medium text-stone-400 uppercase tracking-wide">Avg Split (All Txns)</p>
          <p className="text-xl font-bold text-stone-900 mt-1">{stats.avgSplit}%</p>
          <p className="text-[10px] text-stone-400">default {defaultSplitPercent}%</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-stone-200/80 shadow-sm">
          <p className="text-[10px] font-medium text-stone-400 uppercase tracking-wide">Lister Earned (Paid)</p>
          <p className="text-xl font-bold text-stone-900 mt-1">₹{stats.listerEarnedPaid.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-stone-200/80 shadow-sm">
          <p className="text-[10px] font-medium text-stone-400 uppercase tracking-wide">HOK Retained (Paid)</p>
          <p className="text-xl font-bold text-stone-900 mt-1">₹{stats.hokRetainedPaid.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Decision context */}
      <div className="rounded-md border border-stone-200 bg-[#fcf9f5] p-3">
        <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wide mb-1">Decision Context</p>
        <p className="text-xs text-stone-600">
          Last split {stats.lastRecord?.payoutPercent}% ({stats.lastRecord?.transactionLabel} &middot;{' '}
          {formatDate(stats.lastRecord?.date)}) &middot; piece avg {stats.avgSplit}% across {stats.timesRented}{' '}
          &middot; default {defaultSplitPercent}% &middot; condition {condition} &middot; rented{' '}
          {rentedCount ?? stats.timesRented}&times;
        </p>
      </div>

      {/* Payout history table */}
      <div className="bg-white rounded-lg border border-stone-200/80 shadow-sm overflow-hidden">
        <div className="p-5 pb-3 space-y-1">
          <h3 className="font-serif font-bold text-stone-900 text-sm">Payout History &mdash; This Piece</h3>
          <p className="text-xs text-stone-500">
            Every rental of this piece is paid out individually. The percentage below reflects wear, demand, and
            negotiation at the time &mdash; not a fixed rate.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[820px]">
            <thead>
              <tr className="bg-[#fcf9f5] text-left text-[10px] uppercase tracking-wide text-stone-400 border-y border-stone-100">
                <th className="py-2.5 px-5 font-medium">Transaction #</th>
                <th className="py-2.5 px-3 font-medium">Date</th>
                <th className="py-2.5 px-3 font-medium">Order</th>
                <th className="py-2.5 px-3 font-medium">Lister</th>
                <th className="py-2.5 px-3 font-medium">Type</th>
                <th className="py-2.5 px-3 font-medium">Transaction Value</th>
                <th className="py-2.5 px-3 font-medium">Payout %</th>
                <th className="py-2.5 px-3 font-medium">Amount</th>
                <th className="py-2.5 px-3 font-medium">Status</th>
                <th className="py-2.5 px-5 font-medium" />
              </tr>
            </thead>
            <tbody>
              {payoutHistory.map((record, idx) => (
                <tr key={idx} className="border-b border-stone-50 last:border-b-0">
                  <td className="py-3 px-5 font-semibold text-stone-800 whitespace-nowrap">
                    {record.transactionLabel}
                  </td>
                  <td className="py-3 px-3 text-stone-500 whitespace-nowrap">{formatDate(record.date)}</td>
                  <td className="py-3 px-3 font-mono text-amber-700 whitespace-nowrap">{record.orderId}</td>
                  <td className="py-3 px-3 text-stone-700 whitespace-nowrap">{record.listerName}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded border border-emerald-200 text-emerald-700 text-[10px] font-medium">
                      {record.type}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-stone-700 whitespace-nowrap">
                    ₹{Number(record.transactionValue || 0).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 font-semibold text-stone-800 whitespace-nowrap">
                    {record.payoutPercent}%
                  </td>
                  <td className="py-3 px-3 text-emerald-700 font-medium whitespace-nowrap">
                    ₹{Number(record.amount || 0).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium whitespace-nowrap ${statusBadgeClasses(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-right">
                    <button
                      type="button"
                      onClick={() => onViewPayout?.(record)}
                      className="whitespace-nowrap rounded border border-stone-200 px-2.5 py-1 text-[10px] font-medium text-stone-600 hover:bg-stone-50 transition"
                    >
                      View Payout &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="px-5 py-3 text-[10px] text-stone-400 border-t border-stone-100">
          Percentage progression across rentals is expected &mdash; later rentals typically settle lower as the piece
          sees more wear. See Master Data for starting defaults.
        </p>
      </div>
    </div>
  );
}