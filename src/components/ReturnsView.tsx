import React from 'react';
import { Eye, RotateCcw, ShieldCheck, CheckCircle, ShieldAlert } from 'lucide-react';
import { Order } from '../types';

interface ReturnsViewProps {
  orders: Order[];
  setView: (view: string) => void;
  setSelectedOrderId: (id: string) => void;
  onUpdateOrder: (updatedOrder: Order) => void;
}

export default function ReturnsView({ orders, setView, setSelectedOrderId, onUpdateOrder }: ReturnsViewProps) {
  
  // Stats
  const pendingReturns = orders.filter(o => o.mode === 'Rental' && o.status === 'Shipped').length || 1;
  const depositsHeld = orders
    .filter(o => o.mode === 'Rental' && (o.status === 'Confirmed' || o.status === 'Dispatched' || o.status === 'Shipped' || o.status === 'Delivered'))
    .reduce((sum, o) => sum + o.deposit, 0);
  const releasedDeposits = orders
    .filter(o => o.depositDecision?.status === 'Released')
    .reduce((sum, o) => sum + (o.depositDecision?.releasedAmount || 0), 0);
  const deductions = orders
    .filter(o => o.depositDecision?.status === 'Partial')
    .reduce((sum, o) => sum + (o.depositDecision?.deductedAmount || 0), 0);

  // Due returns (In transit / Shipped / Delivered rentals)
  const dueReturns = orders.filter(o => o.mode === 'Rental' && (o.status === 'Shipped' || o.status === 'Delivered'));
  
  // Recent Returns (status === Returned / Complete)
  const recentReturns = orders.filter(o => o.mode === 'Rental' && (o.status === 'Returned' || o.status === 'Complete'));

  const handleQuickLogReturn = (order: Order) => {
    const updated: Order = {
      ...order,
      status: 'Returned',
      conditionAssessment: {
        receivedDate: new Date().toISOString().split('T')[0],
        receivedBy: 'Soumya',
        grade: 'A',
        notes: 'Quick logged on Returns page.'
      },
      depositDecision: {
        status: 'Released',
        releasedAmount: order.deposit,
        deductedAmount: 0,
        reason: 'Auto-released'
      }
    };
    onUpdateOrder(updated);
    alert(`Quick-logged return of order ${order.id} in Excellent Condition. Deposit of ₹${order.deposit} released.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-serif text-stone-900 font-medium">Returns & Deposits</h2>
        <p className="text-xs text-stone-500 mt-1">
          Complete log of rental returns, condition quality control, and security deposit refunds.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#fcf9f5] p-4 rounded-lg border border-stone-200/60">
        <div className="p-3 bg-white rounded border border-stone-100">
          <p className="text-[10px] text-stone-400 font-sans font-bold uppercase tracking-widest">Pending Returns</p>
          <h4 className="text-xl font-serif text-stone-900 font-bold mt-1">{pendingReturns}</h4>
          <span className="text-[9px] text-stone-400">Awaiting courier pickup</span>
        </div>
        <div className="p-3 bg-white rounded border border-stone-100">
          <p className="text-[10px] text-stone-400 font-sans font-bold uppercase tracking-widest">Deposits Held</p>
          <h4 className="text-xl font-serif text-stone-900 font-bold mt-1">₹{depositsHeld.toLocaleString('en-IN')}</h4>
          <span className="text-[9px] text-amber-600 font-medium">Safe in escrow</span>
        </div>
        <div className="p-3 bg-white rounded border border-stone-100">
          <p className="text-[10px] text-stone-400 font-sans font-bold uppercase tracking-widest">Released Deposits</p>
          <h4 className="text-xl font-serif text-stone-900 font-bold mt-1">₹{releasedDeposits.toLocaleString('en-IN')}</h4>
          <span className="text-[9px] text-green-600 font-medium">Returned to clients</span>
        </div>
        <div className="p-3 bg-white rounded border border-stone-100">
          <p className="text-[10px] text-stone-400 font-sans font-bold uppercase tracking-widest">Deductions / Fines</p>
          <h4 className="text-xl font-serif text-stone-900 font-bold mt-1">₹{deductions.toLocaleString('en-IN')}</h4>
          <span className="text-[9px] text-stone-400">Damage repairs withheld</span>
        </div>
      </div>

      {/* Pieces Due for Return */}
      <div className="bg-white rounded-lg border border-stone-200/80 p-5 shadow-sm space-y-4">
        <h3 className="font-serif font-bold text-stone-900 text-sm border-b border-stone-100 pb-3">
          Pieces Due for Return
        </h3>
        
        {dueReturns.length === 0 ? (
          <div className="text-center py-6 text-stone-400 text-xs font-sans">
            No garments are currently due for return.
          </div>
        ) : (
          <div className="space-y-3">
            {dueReturns.map((order) => (
              <div 
                key={order.id}
                className="p-4 bg-[#fcf9f5] border border-stone-100 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans text-xs"
              >
                <div className="flex gap-3 items-start">
                  <div className="p-2 bg-white rounded border border-stone-100 text-stone-600 shrink-0">
                    <RotateCcw className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-stone-800 text-sm">{order.productName}</span>
                    <p className="text-stone-500 font-medium">Renter: {order.customerName} | Mobile: {order.customerPhone}</p>
                    <p className="text-[10px] text-stone-400">
                      Expected Return Date: {order.rentalEndDate ? new Date(order.rentalEndDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'} | Security: ₹{order.deposit.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setSelectedOrderId(order.id);
                      setView(`order_detail:${order.id}`);
                    }}
                    className="px-3 py-1.5 bg-white border border-stone-200 hover:border-[#c5a880] text-stone-700 hover:bg-stone-50 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer transition"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>View Order</span>
                  </button>
                  <button
                    onClick={() => handleQuickLogReturn(order)}
                    className="px-3 py-1.5 bg-[#1e1412] hover:bg-[#2c1d1a] text-white rounded text-xs font-semibold flex items-center gap-1 cursor-pointer transition"
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Log Return (Excellent Cond.)</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Returns Table */}
      <div className="bg-white rounded-lg border border-stone-200/80 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-100 bg-stone-50/50">
          <h3 className="font-serif font-bold text-stone-900 text-sm">Recent Returns Assessment Log</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 text-stone-400 font-sans uppercase font-bold text-[10px] border-b border-stone-150 tracking-wider">
                <th className="px-5 py-3">Order ID</th>
                <th className="px-5 py-3">Product Name</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Returned On</th>
                <th className="px-5 py-3">Quality Assessment</th>
                <th className="px-5 py-3">Deposit Action</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-600 font-sans">
              {recentReturns.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-stone-400">
                    No returns logged yet.
                  </td>
                </tr>
              ) : (
                recentReturns.map((o) => (
                  <tr key={o.id} className="hover:bg-[#fcf9f5] transition">
                    <td className="px-5 py-3.5 font-mono text-stone-400">{o.id}</td>
                    <td className="px-5 py-3.5 font-medium text-stone-800">{o.productName}</td>
                    <td className="px-5 py-3.5">{o.customerName}</td>
                    <td className="px-5 py-3.5 text-stone-400">
                      {o.conditionAssessment?.receivedDate ? new Date(o.conditionAssessment.receivedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '19 Mar'}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`h-5 w-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                          o.conditionAssessment?.grade === 'A' || o.conditionAssessment?.grade === 'B'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                            : 'bg-rose-50 text-rose-800 border border-rose-100'
                        }`}>
                          {o.conditionAssessment?.grade || 'A'}
                        </span>
                        <span className="font-semibold text-stone-700">
                          {o.conditionAssessment?.grade === 'A' ? 'Excellent' : o.conditionAssessment?.grade === 'B' ? 'Good' : 'Damaged'}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div>
                        <span className="font-bold text-stone-800">
                          ₹{(o.depositDecision?.releasedAmount || o.deposit).toLocaleString('en-IN')} Released
                        </span>
                        {o.depositDecision?.deductedAmount && o.depositDecision.deductedAmount > 0 ? (
                          <p className="text-[10px] text-rose-600 font-medium mt-0.5">₹{o.depositDecision.deductedAmount.toLocaleString('en-IN')} Fine</p>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => {
                          setSelectedOrderId(o.id);
                          setView(`order_detail:${o.id}`);
                        }}
                        className="p-1 text-stone-500 hover:text-[#c5a880] transition cursor-pointer"
                        title="View Full Order"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
