import React, { useEffect, useState } from 'react';
import { Wallet, Check, Eye, Search } from 'lucide-react';
import { Lister, Order } from '../types';
import * as payoutApi from '../services/payoutApi';

interface PayoutsViewProps {
  listers: Lister[];
  orders: Order[];
  setView: (view: string) => void;
  setSelectedOrderId: (id: string) => void;
  onUpdateLister: (updatedLister: Lister) => void;
}

export default function PayoutsView({ listers, orders, setView, setSelectedOrderId, onUpdateLister }: PayoutsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [approvePayout, setApprovePayout] = useState<payoutApi.Payout | null>(null);
  const [paymentReference, setPaymentReference] = useState('');
  const [taxDeduction, setTaxDeduction] = useState(0);
  const [statusFilter, setStatusFilter] = useState('All');
  const [listerFilter, setListerFilter] = useState('All');
  
  const [payoutsList, setPayoutsList] = useState<payoutApi.Payout[]>([]);
  const [pendingPayoutsTotal, setPendingPayoutsTotal] = useState(0);
  const [paidPayoutsTotal, setPaidPayoutsTotal] = useState(0);
  useEffect(() => { payoutApi.getPayouts().then((result) => { setPayoutsList(result.data || []); setPendingPayoutsTotal(result.summary?.pending || 0); setPaidPayoutsTotal(result.summary?.paid || 0); }).catch((error) => console.error('Unable to load payouts:', error)); }, []);

  const handleMarkPaid = async (id: string) => {
    try { const updated = await payoutApi.markPaid(id, { paidBy: 'Admin', paymentReference, taxDeduction }); setPayoutsList(prev => prev.map(p => p.id === id ? updated : p)); setPendingPayoutsTotal(value => Math.max(0, value - updated.listerShare)); setPaidPayoutsTotal(value => value + updated.listerShare); setApprovePayout(null); alert("Payout approved and marked as Paid."); }
    catch (error) { alert(error instanceof Error ? error.message : 'Unable to mark payout paid'); }
  };

  const filteredPayouts = payoutsList.filter(p => {
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    const matchesLister = listerFilter === 'All' || p.listerId === listerFilter;
    return matchesStatus && matchesLister && (p.listerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
           p.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           p.orderId.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  return (
    <div className="space-y-6 text-xs font-sans">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-serif text-stone-900 font-medium">Payouts to Listers</h2>
        <p className="text-xs text-stone-500 mt-1">
          Monthly payout cycles. Click a lister name to view their full profile and edit bank details, or click any row to verify transaction history.
        </p>
      </div>

      {/* Payouts Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#fcf9f5] p-4 rounded-lg border border-stone-200/60">
        <div className="p-4 bg-white rounded border border-stone-100 flex justify-between items-center">
          <div>
            <p className="text-[10px] text-stone-400 font-sans font-bold uppercase tracking-widest">Pending Payouts</p>
            <h4 className="text-2xl font-serif text-stone-900 font-bold mt-1">₹{pendingPayoutsTotal.toLocaleString('en-IN')}</h4>
            <span className="text-[9px] text-stone-400">Scheduled for 1st of next month</span>
          </div>
          <div className="p-3 bg-stone-50 text-[#c5a880] rounded">
            <Wallet className="h-6 w-6" />
          </div>
        </div>
        <div className="p-4 bg-white rounded border border-stone-100 flex justify-between items-center">
          <div>
            <p className="text-[10px] text-stone-400 font-sans font-bold uppercase tracking-widest">Paid Payouts</p>
            <h4 className="text-2xl font-serif text-stone-900 font-bold mt-1">₹{paidPayoutsTotal.toLocaleString('en-IN')}</h4>
            <span className="text-[9px] text-green-600 font-medium">Transferred in current cycle</span>
          </div>
          <div className="p-3 bg-stone-50 text-[#c5a880] rounded">
            <Wallet className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative w-full md:w-80">
        <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-stone-400" />
        <input
          type="text"
          placeholder="Search payout, lister, order..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-white border border-stone-200 rounded text-xs outline-none focus:border-[#c5a880]"
        />
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="rounded border border-stone-200 bg-white px-3 py-2 text-xs"><option>All</option><option>Pending</option><option>Paid</option><option>Failed</option><option>Reversed</option></select>
        <select value={listerFilter} onChange={e => setListerFilter(e.target.value)} className="rounded border border-stone-200 bg-white px-3 py-2 text-xs"><option value="All">All Listers</option>{Array.from(new Map(payoutsList.map(p => [p.listerId, p.listerName]))).map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select>
        <a href={payoutApi.exportPayoutsUrl} className="rounded bg-[#1e1412] px-3 py-2 text-xs font-bold text-white">Export CSV</a>
      </div>

      {/* Payouts Table */}
      <div className="bg-white rounded-lg border border-stone-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 text-stone-400 font-sans uppercase font-bold text-[10px] border-b border-stone-150 tracking-wider">
                <th className="px-5 py-3.5">Lister Name</th>
                <th className="px-5 py-3.5">Order ID</th>
                <th className="px-5 py-3.5">Product Name</th>
                <th className="px-5 py-3.5">Mode</th><th className="px-5 py-3.5">Transaction</th>
                <th className="px-5 py-3.5">Lister Share</th>
                <th className="px-5 py-3.5">HOK Commission</th><th className="px-5 py-3.5">Tax/TDS</th><th className="px-5 py-3.5">Net Payout</th>
                <th className="px-5 py-3.5">Due Date</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-600 font-sans">
              {filteredPayouts.map((p) => (
                <tr key={p.id} className="hover:bg-[#fcf9f5] transition">
                  <td className="px-5 py-4">
                    <span 
                      onClick={() => setView(`lister_detail:${p.listerId}`)}
                      className="font-bold text-stone-800 hover:text-[#c5a880] cursor-pointer hover:underline"
                    >
                      {p.listerName}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-mono text-stone-400">{p.orderId}</td>
                  <td className="px-5 py-4 max-w-[150px] truncate">{p.productName}</td>
                  <td className="px-5 py-4 uppercase font-semibold text-[9px] tracking-wider text-stone-400">{p.mode}</td><td className="px-5 py-4">₹{Number(p.transactionAmount || p.listerShare + p.hokCommission).toLocaleString('en-IN')}</td>
                  <td className="px-5 py-4 font-bold text-stone-850">₹{p.listerShare.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-4 text-stone-500">₹{p.hokCommission.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-4 text-rose-600">₹{Number(p.taxDeduction || 0).toLocaleString('en-IN')}</td><td className="px-5 py-4 font-bold text-emerald-700">₹{Number(p.netPayout ?? p.listerShare - (p.taxDeduction || 0)).toLocaleString('en-IN')}</td>
                  <td className="px-5 py-4 text-stone-400">
                    {new Date(p.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-bold ${
                      p.status === 'Paid'
                        ? 'bg-green-50 text-green-700 border border-green-100'
                        : 'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => {
                          setSelectedOrderId(p.orderId);
                          setView(`order_detail:${p.orderId}`);
                        }}
                        className="p-1 border border-stone-200 hover:border-stone-350 hover:bg-stone-50 rounded text-stone-500 transition cursor-pointer"
                        title="View Order"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      {p.status === 'Pending' && (
                        <button
                          onClick={() => setApprovePayout(p)}
                          className="px-2.5 py-1 bg-[#1e1412] hover:bg-[#2c1d1a] text-white rounded font-bold text-[10px] uppercase flex items-center gap-1 cursor-pointer transition"
                          title="Mark as Paid"
                        >
                          <Check className="h-3 w-3" />
                          <span>Mark Paid</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {approvePayout && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"><div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-2xl"><div className="flex justify-between border-b pb-3"><h3 className="font-serif text-lg font-bold">Approve Payout</h3><button onClick={() => setApprovePayout(null)}>✕</button></div><div className="grid grid-cols-2 gap-4 py-4 text-xs"><div><span className="text-stone-400">Transaction</span><p className="font-bold">₹{Number(approvePayout.transactionAmount || approvePayout.listerShare + approvePayout.hokCommission).toLocaleString('en-IN')}</p></div><div><span className="text-stone-400">Lister Share</span><p className="font-bold">₹{approvePayout.listerShare.toLocaleString('en-IN')}</p></div><div><span className="text-stone-400">HOK Commission</span><p className="font-bold">₹{approvePayout.hokCommission.toLocaleString('en-IN')}</p></div><div><span className="text-stone-400">Net Payout</span><p className="font-bold text-emerald-700">₹{(approvePayout.listerShare - taxDeduction).toLocaleString('en-IN')}</p></div></div><label className="block text-xs text-stone-500">Tax/TDS deduction</label><input type="number" min="0" value={taxDeduction} onChange={e => setTaxDeduction(Number(e.target.value))} className="mb-3 w-full rounded border p-2 text-xs" /><label className="block text-xs text-stone-500">Payment reference</label><input value={paymentReference} onChange={e => setPaymentReference(e.target.value)} placeholder="UTR / transaction ID" className="mb-5 w-full rounded border p-2 text-xs" /><div className="flex justify-end gap-2"><button onClick={() => setApprovePayout(null)} className="rounded border px-4 py-2 text-xs">Cancel</button><button onClick={() => handleMarkPaid(approvePayout.id)} className="rounded bg-[#1e1412] px-4 py-2 text-xs font-bold text-white">Approve & Pay</button></div></div></div>}
    </div>
  );
}
