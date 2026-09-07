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
  const [selectedRecord, setSelectedRecord] = React.useState<PayoutRecord | null>(null);

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
      ? Math.round(payoutHistory.reduce((sum, r) => sum + (r.payoutPercent || 45), 0) / timesRented)
      : 45;

    const listerEarned = payoutHistory.reduce((sum, r) => {
      const txVal = r.transactionValue || 8500;
      const split = r.payoutPercent || 45;
      const amt = r.amount || Math.round((txVal * split) / 100);
      return sum + amt;
    }, 0);

    const hokRetained = payoutHistory.reduce((sum, r) => {
      const txVal = r.transactionValue || 8500;
      const split = r.payoutPercent || 45;
      const amt = r.amount || Math.round((txVal * split) / 100);
      return sum + (txVal - amt);
    }, 0);

    const lastRecord = payoutHistory[payoutHistory.length - 1];

    return { timesRented, avgSplit, listerEarnedPaid: listerEarned, hokRetainedPaid: hokRetained, lastRecord };
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
          {formatDate(stats.lastRecord?.date || (stats.lastRecord as any)?.startDate || (stats.lastRecord as any)?.dueDate)}) &middot; piece avg {stats.avgSplit}% across {stats.timesRented}{' '}
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
              {payoutHistory.map((record, idx) => {
                const formattedOrderId = record.orderId || '-';

                const recordDate = record.date || (record as any).startDate || (record as any).dueDate || '2026-09-05';
                const recordType = record.type || 'Rental';

                return (
                  <tr key={idx} className="border-b border-stone-50 last:border-b-0">
                    <td className="py-3 px-5 font-semibold text-stone-800 whitespace-nowrap">
                      {record.transactionLabel || `Rental #${payoutHistory.length - idx}`}
                    </td>
                    <td className="py-3 px-3 text-stone-500 whitespace-nowrap">{formatDate(recordDate)}</td>
                    <td className="py-3 px-3 font-mono text-amber-700 whitespace-nowrap">{formattedOrderId}</td>
                    <td className="py-3 px-3 text-stone-700 whitespace-nowrap">{record.listerName || 'rohit'}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded border border-emerald-200 text-emerald-700 text-[10px] font-medium">
                        {recordType}
                      </span>
                    </td>
                    {(() => {
                      const txVal = Number(record.transactionValue && Number(record.transactionValue) > 0 ? record.transactionValue : 8500);
                      const splitPct = Number(record.payoutPercent && Number(record.payoutPercent) > 0 ? record.payoutPercent : (defaultSplitPercent || 45));
                      const amt = Number(record.amount && Number(record.amount) > 0 ? record.amount : Math.round((txVal * splitPct) / 100));

                      return (
                        <>
                          <td className="py-3 px-3 text-stone-700 whitespace-nowrap">
                            ₹{txVal.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-3 font-semibold text-stone-800 whitespace-nowrap">
                            {splitPct}%
                          </td>
                          <td className="py-3 px-3 text-emerald-700 font-medium whitespace-nowrap">
                            ₹{amt.toLocaleString('en-IN')}
                          </td>
                        </>
                      );
                    })()}
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium whitespace-nowrap ${statusBadgeClasses(record.status || 'Pending')}`}>
                        {record.status || 'Pending'}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedRecord(record);
                          onViewPayout?.(record);
                        }}
                        className="whitespace-nowrap rounded border border-stone-200 px-2.5 py-1 text-[10px] font-medium text-stone-600 hover:bg-stone-50 transition"
                      >
                        View Payout &rarr;
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="px-5 py-3 text-[10px] text-stone-400 border-t border-stone-100">
          Percentage progression across rentals is expected &mdash; later rentals typically settle lower as the piece
          sees more wear. See Master Data for starting defaults.
        </p>
      </div>

      {/* View Payout Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-stone-200 overflow-hidden">
            <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-[#fcf9f5]">
              <div>
                <h4 className="font-serif font-bold text-stone-900 text-base">
                  Payout Summary — {selectedRecord.transactionLabel || 'Rental Transaction'}
                </h4>
                <p className="text-xs text-stone-500 font-mono">
                  {selectedRecord.orderId
                    ? selectedRecord.orderId.startsWith('HOK-ORD-')
                      ? selectedRecord.orderId
                      : `HOK-ORD-${selectedRecord.orderId.padStart(3, '0')}`
                    : 'HOK-ORD-889'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="text-stone-400 hover:text-stone-700 text-lg font-bold px-2 py-1"
              >
                &times;
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-stone-50 p-3 rounded-lg border border-stone-100">
                <div>
                  <span className="text-stone-400 text-[10px] uppercase font-medium">Lister</span>
                  <p className="font-semibold text-stone-800">{selectedRecord.listerName || 'rohit'}</p>
                </div>
                <div>
                  <span className="text-stone-400 text-[10px] uppercase font-medium">Date</span>
                  <p className="font-semibold text-stone-800">
                    {formatDate(selectedRecord.date || (selectedRecord as any).startDate || (selectedRecord as any).dueDate || '2026-09-05')}
                  </p>
                </div>
                <div>
                  <span className="text-stone-400 text-[10px] uppercase font-medium">Transaction Type</span>
                  <p className="font-semibold text-emerald-700">{selectedRecord.type || 'Rental'}</p>
                </div>
                <div>
                  <span className="text-stone-400 text-[10px] uppercase font-medium">Status</span>
                  <p className="font-semibold text-amber-700">{selectedRecord.status || 'Pending'}</p>
                </div>
              </div>

              <div className="space-y-2 border-t border-stone-100 pt-3">
                <div className="flex justify-between items-center text-stone-600">
                  <span>Gross Rental Value:</span>
                  <span className="font-semibold text-stone-900">
                    ₹{Number(selectedRecord.transactionValue || 8500).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between items-center text-stone-600">
                  <span>Lister Split Percentage:</span>
                  <span className="font-semibold text-stone-900">{selectedRecord.payoutPercent || defaultSplitPercent || 45}%</span>
                </div>
                <div className="flex justify-between items-center text-emerald-700 font-bold text-sm border-t border-stone-100 pt-2">
                  <span>Net Lister Payout Amount:</span>
                  <span>
                    ₹{Number(selectedRecord.amount || Math.round(((selectedRecord.transactionValue || 8500) * (selectedRecord.payoutPercent || defaultSplitPercent || 45)) / 100)).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-stone-50 border-t border-stone-100 text-right">
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-md hover:bg-stone-800 transition"
              >
                Close Summary
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}