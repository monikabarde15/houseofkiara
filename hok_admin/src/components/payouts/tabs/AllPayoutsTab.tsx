import React, { useState } from 'react';
import { Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { Payout } from "../../../services/payoutApi";
import * as payoutApi from "../../../services/payoutApi";

const WhatsAppIcon = () => (
  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#25D366] text-white shadow-sm">
    <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  </span>
);

const typeBadgeClasses: Record<string, string> = {
  'Rental': 'bg-green-50 text-green-700',
  'Preloved Sale': 'bg-[#f6ede0] text-[#8a6a2c]',
  'Damage Comp.': 'bg-purple-50 text-purple-700',
};

const statusBadgeClasses: Record<string, string> = {
  'Paid': 'bg-green-100 text-green-700',
  'Pending': 'bg-[#fff3d6] text-[#8a6a2c]',
  'Failed': 'bg-red-100 text-red-700',
  'Reversed': 'bg-gray-100 text-gray-700',
};

interface AllPayoutsTabProps {
  payouts?: Payout[];
}

export default function AllPayoutsTab({ payouts = [] }: AllPayoutsTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [timeFilter, setTimeFilter] = useState('All time');

  const filteredPayouts = payouts.filter(p => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (p.listerName || '').toLowerCase().includes(term) ||
      (p.orderId || '').toLowerCase().includes(term) ||
      (p.productName || '').toLowerCase().includes(term);
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const paidPayouts = filteredPayouts.filter(p => p.status === 'Paid');
  const listerPaidTotal = paidPayouts.reduce((sum, p) => sum + p.listerShare, 0);
  const hokRetainedTotal = paidPayouts.reduce((sum, p) => sum + p.hokCommission, 0);
  const avgSplit = paidPayouts.length > 0
    ? Math.round(
        (paidPayouts.reduce((sum, p) => sum + p.listerShare / ((p.transactionAmount || p.listerShare + p.hokCommission) || 1), 0) /
          paidPayouts.length) * 100
      )
    : 0;

  const handleExportCsv = () => {
    window.location.href = payoutApi.exportPayoutsUrl;
  };

  return (
    <div className="space-y-4 text-xs font-sans">
      {/* Search + status filter + time filter + export row */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search lister or order..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-stone-200 rounded-md text-sm bg-white focus:outline-none focus:border-[#c5a880]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-stone-200 rounded-md text-sm bg-white"
        >
          <option value="All">All</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending Approval</option>
          <option value="Failed">Failed</option>
          <option value="Reversed">Reversed</option>
        </select>

        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          className="px-3 py-2 border border-stone-200 rounded-md text-sm bg-white"
        >
          <option>All time</option>
          <option>This month</option>
          <option>Last month</option>
          <option>This quarter</option>
          <option>This year</option>
        </select>

        <button
          onClick={handleExportCsv}
          className="px-4 py-2 bg-[#181521] hover:bg-[#2a2536] text-white rounded-md text-sm font-medium transition whitespace-nowrap"
        >
          Export CSV
        </button>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-lg border border-stone-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
            <thead>
              <tr className="bg-stone-50 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-200">
                <th className="px-4 py-3">Lister</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Transaction Value</th>
                <th className="px-4 py-3">Payout Amount</th>
                <th className="px-4 py-3">HOK Commission</th>
                <th className="px-4 py-3">Mode</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-600 font-sans">
              {filteredPayouts.map((p, idx) => (
                <tr
                  key={p.id}
                  className={`hover:bg-[#fcf9f5] transition-colors ${idx % 2 === 1 ? 'bg-stone-50/40' : ''}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#8a6a2c]">{p.listerName}</span>
                      <WhatsAppIcon />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#8a6a2c] font-mono text-[10px]">{p.orderId}</td>
                  <td className="px-4 py-3 font-medium text-stone-800 max-w-[160px] whitespace-normal">{p.productName}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-[10px] font-medium ${typeBadgeClasses[p.mode] || typeBadgeClasses['Rental']}`}>
                      {p.mode}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium">₹{(p.transactionAmount || p.listerShare + p.hokCommission).toLocaleString('en-IN')}</td>
                  <td className={`px-4 py-3 font-semibold ${p.status === 'Paid' ? 'text-green-600' : 'text-orange-500'}`}>₹{p.listerShare.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3">₹{p.hokCommission.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-stone-500">{p.mode}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-medium ${statusBadgeClasses[p.status]}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-stone-500">
                    {new Date(p.dueDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {filteredPayouts.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-stone-400">
                    No payouts match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 bg-stone-50 border-t border-stone-200 text-stone-500">
          {timeFilter} · {paidPayouts.length} paid · Lister paid ₹{listerPaidTotal.toLocaleString('en-IN')} · HOK retained ₹{hokRetainedTotal.toLocaleString('en-IN')} · avg split {avgSplit}%
        </div>
      </div>
      <p className="text-stone-400 px-1">
        Payout % varies per transaction based on rental number, condition, and any deposit deduction events. All payouts require individual approval before processing.
      </p>
    </div>
  );
}