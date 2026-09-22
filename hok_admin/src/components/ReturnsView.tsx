import React from 'react';
import { Eye, RotateCcw, ShieldCheck, CheckCircle, ShieldAlert, X, MessageSquare, AlertTriangle, MessageCircle } from 'lucide-react';
import { Order } from '../types';
import toast from 'react-hot-toast';

interface ReturnsViewProps {
  orders: Order[];
  setView: (view: string) => void;
  setSelectedOrderId: (id: string) => void;
  onUpdateOrder: (updatedOrder: Order) => void;
}

export default function ReturnsView({ orders, setView, setSelectedOrderId, onUpdateOrder }: ReturnsViewProps) {
  
  // Stats
  const pendingReturns = orders.filter(o => o.mode === 'Rental' && o.status === 'Shipped').length;
  const depositsHeld = orders
    .filter(o => o.mode === 'Rental' && (o.status === 'Confirmed' || o.status === 'Dispatched' || o.status === 'Shipped' || o.status === 'Delivered'))
    .reduce((sum, o) => sum + (Number(o.deposit) || 0), 0);
  const releasedDeposits = orders
    .filter(o => o.depositDecision?.status === 'Released')
    .reduce((sum, o) => sum + (Number(o.depositDecision?.releasedAmount) || 0), 0);
  const deductions = orders
    .filter(o => o.depositDecision?.status === 'Partial')
    .reduce((sum, o) => sum + (Number(o.depositDecision?.deductedAmount) || 0), 0);

  // Due returns (In transit / Shipped / Delivered rentals)
  const dueReturns = orders.filter(o => o.mode === 'Rental' && !!o.productName && (o.status === 'Shipped' || o.status === 'Delivered'));
  
  // Pending Assessments & Requests (Returned but deposit is Pending)
  const pendingAssessments = orders.filter(o => o.mode === 'Rental' && !!o.productName && ['Returned', 'Complete', 'Processed'].includes(o.status) && o.depositDecision?.status === 'Pending');

  // Recent Returns (status === Returned / Complete and deposit is finalized)
  const recentReturns = orders.filter(o => o.mode === 'Rental' && !!o.productName && ['Returned', 'Complete', 'Processed'].includes(o.status) && o.depositDecision?.status !== 'Pending');

  // Modal states
  const [returnModalOrder, setReturnModalOrder] = React.useState<Order | null>(null);
  const [returnCondition, setReturnCondition] = React.useState<'A' | 'B' | 'C' | 'D'>('A');
  const [returnNotes, setReturnNotes] = React.useState('');

  const [assessmentModalOrder, setAssessmentModalOrder] = React.useState<Order | null>(null);
  const [deductionAmount, setDeductionAmount] = React.useState('');
  const [adminComment, setAdminComment] = React.useState('');
  const [assessmentAction, setAssessmentAction] = React.useState<'Deduct' | 'Reject' | 'Release' | null>(null);

  const openReturnModal = (order: Order) => {
    setReturnModalOrder(order);
    setReturnCondition('A');
    setReturnNotes('');
  };

  const processReturn = () => {
    if (!returnModalOrder) return;
    const isDamaged = returnCondition === 'C' || returnCondition === 'D';
    
    const updated: Order = {
      ...returnModalOrder,
      status: 'Returned',
      conditionAssessment: {
        receivedDate: new Date().toISOString().split('T')[0],
        receivedBy: 'Soumya',
        grade: returnCondition,
        notes: returnNotes
      },
      returnCondition: {
        receivedDate: new Date().toISOString().split('T')[0],
        receivedBy: 'Soumya',
        grade: returnCondition,
        notes: returnNotes
      },
      depositDecision: {
        status: isDamaged ? 'Pending' : 'Released',
        releasedAmount: isDamaged ? 0 : returnModalOrder.deposit,
        deductedAmount: 0,
        reason: isDamaged ? 'Pending Assessment due to damage' : 'Auto-released',
        issueStatus: isDamaged ? 'Reported' : 'None',
        issueSource: isDamaged ? 'Admin' : undefined
      }
    };
    onUpdateOrder(updated);
    setReturnModalOrder(null);
    if (isDamaged) {
      toast.error(`Order ${returnModalOrder.id} logged as Damaged. Deposit moved to Pending Assessments.`);
    } else {
      toast.success(`Order ${returnModalOrder.id} returned in good condition. Deposit released.`);
    }
  };

  const processAssessment = () => {
    if (!assessmentModalOrder || !assessmentAction) return;

    let updatedDecision = { ...assessmentModalOrder.depositDecision } as any;
    
    if (assessmentAction === 'Deduct') {
      const deduction = Number(deductionAmount);
      if (isNaN(deduction) || deduction < 0 || deduction > assessmentModalOrder.deposit) {
        toast.error('Invalid deduction amount.');
        return;
      }
      updatedDecision = {
        status: deduction === assessmentModalOrder.deposit ? 'Forfeited' : 'Partial',
        releasedAmount: assessmentModalOrder.deposit - deduction,
        deductedAmount: deduction,
        reason: adminComment || 'Deduction applied for damages/delays',
        issueStatus: 'Valid',
        adminComment: adminComment
      };
    } else if (assessmentAction === 'Reject') {
      updatedDecision = {
        status: 'Released',
        releasedAmount: assessmentModalOrder.deposit,
        deductedAmount: 0,
        reason: 'Issue rejected by admin',
        issueStatus: 'Invalid',
        adminComment: adminComment
      };
    } else if (assessmentAction === 'Release') {
      updatedDecision = {
        status: 'Released',
        releasedAmount: assessmentModalOrder.deposit,
        deductedAmount: 0,
        reason: 'Manually released by admin',
        issueStatus: 'None',
        adminComment: adminComment
      };
    }

    const updated: Order = {
      ...assessmentModalOrder,
      depositDecision: updatedDecision
    };
    
    onUpdateOrder(updated);
    setAssessmentModalOrder(null);
    setAssessmentAction(null);
    setDeductionAmount('');
    setAdminComment('');
    toast.success(`Deposit action processed for order ${assessmentModalOrder.id}`);
  };

  // Replaced quick log with modal flow

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

      {/* Deposits Pending Collection */}
      <div className="bg-white rounded-lg border border-stone-200/80 p-5 shadow-sm space-y-4">
        <h3 className="font-serif font-bold text-stone-900 text-sm border-b border-stone-100 pb-3">
          Deposits Pending Collection
        </h3>
        
        {orders.filter(o => o.mode === 'Rental' && o.status === 'Confirmed' && o.deposit > 0 && o.depositStatus !== 'Held').length === 0 ? (
          <div className="text-center py-6 text-stone-400 text-xs font-sans">
            No deposits pending collection.
          </div>
        ) : (
          <div className="space-y-3">
            {orders.filter(o => o.mode === 'Rental' && o.status === 'Confirmed' && o.deposit > 0 && o.depositStatus !== 'Held').map((order) => (
              <div 
                key={order.id}
                className="p-4 bg-[#fcf9f5] border border-stone-100 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans text-xs"
              >
                <div className="flex gap-3 items-start">
                  <div className="p-2 bg-white rounded border border-stone-100 text-stone-600 shrink-0">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-stone-800 text-sm">{order.productName}</span>
                    <p className="text-stone-500 font-sans">
                      Renter: {order.customerName} | Mobile: {order.customerPhone}
                    </p>
                    <p className="text-[#c5a880] font-sans font-medium mt-1">Amount to Collect: ₹{order.deposit.toLocaleString('en-IN')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
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
                    onClick={() => {
                      const updated = { ...order, depositStatus: 'Held' as any };
                      onUpdateOrder(updated);
                      toast.success(`Deposit of ₹${order.deposit} collected for order ${order.id}.`);
                    }}
                    className="px-3 py-1.5 bg-[#d2ae63] hover:bg-[#c49d4f] text-[#3d2d14] rounded text-xs font-semibold flex items-center gap-1 cursor-pointer transition"
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>Mark Collected</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pending Deposit Assessments & Requests */}
      <div className="bg-white rounded-lg border border-stone-200/80 p-5 shadow-sm space-y-4 border-l-4 border-l-amber-400">
        <h3 className="font-serif font-bold text-stone-900 text-sm border-b border-stone-100 pb-3 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          Pending Deposit Assessments & Requests
        </h3>
        
        {pendingAssessments.length === 0 ? (
          <div className="text-center py-6 text-stone-400 text-xs font-sans">
            No pending deposit assessments or requests.
          </div>
        ) : (
          <div className="space-y-3">
            {pendingAssessments.map((order) => (
              <div 
                key={order.id}
                className="p-4 bg-amber-50/30 border border-amber-100 rounded flex flex-col xl:flex-row xl:items-center justify-between gap-4 font-sans text-xs"
              >
                <div className="flex gap-3 items-start">
                  <div className={`p-2 rounded border shrink-0 ${order.depositDecision?.issueSource === 'Customer' ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-rose-50 border-rose-200 text-rose-600'}`}>
                    {order.depositDecision?.issueSource === 'Customer' ? <MessageCircle className="h-5 w-5" /> : <ShieldAlert className="h-5 w-5" />}
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-stone-800 text-sm">{order.productName}</span>
                    <p className="text-stone-500 font-sans">
                      Renter: {order.customerName} | Order: <span className="font-mono">{order.id}</span>
                    </p>
                    {order.depositDecision?.issueSource === 'Customer' ? (
                      <div className="mt-2 p-2 bg-white rounded border border-stone-100">
                        <span className="font-bold text-[10px] uppercase text-blue-600 tracking-wider">Customer Dispute/Request</span>
                        <p className="text-stone-600 mt-0.5 italic">"{order.depositDecision?.customerRequestDetails?.reason || 'Customer is requesting immediate refund or disputing a charge.'}"</p>
                      </div>
                    ) : (
                      <div className="mt-2 p-2 bg-white rounded border border-stone-100">
                        <span className="font-bold text-[10px] uppercase text-rose-600 tracking-wider">Admin Reported Damage</span>
                        <p className="text-stone-600 mt-0.5 italic">Condition marked as {order.conditionAssessment?.grade}. "{order.conditionAssessment?.notes}"</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap xl:flex-nowrap shrink-0">
                  <button
                    onClick={() => {
                      setAssessmentAction('Release');
                      setAssessmentModalOrder(order);
                    }}
                    className="px-3 py-1.5 bg-white border border-stone-200 hover:border-green-600 hover:text-green-700 text-stone-700 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer transition"
                  >
                    Release Full (₹{order.deposit.toLocaleString('en-IN')})
                  </button>
                  <button
                    onClick={() => {
                      setAssessmentAction('Reject');
                      setAssessmentModalOrder(order);
                    }}
                    className="px-3 py-1.5 bg-white border border-stone-200 hover:border-stone-400 text-stone-700 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer transition"
                  >
                    Reject Issue
                  </button>
                  <button
                    onClick={() => {
                      setAssessmentAction('Deduct');
                      setAssessmentModalOrder(order);
                    }}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-semibold flex items-center gap-1 cursor-pointer transition shadow-sm"
                  >
                    Process Fine / Deduct
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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
                      Expected Return Date: {order.rentalEndDate ? new Date(order.rentalEndDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'} | Security: ₹{(order.deposit || 0).toLocaleString('en-IN')}
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
                    onClick={() => openReturnModal(order)}
                    className="px-3 py-1.5 bg-[#1e1412] hover:bg-[#2c1d1a] text-white rounded text-xs font-semibold flex items-center gap-1 cursor-pointer transition"
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Log Return</span>
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
                    <td className="px-5 py-3.5 text-stone-600 font-medium">
                      {(() => {
                        const raw = o.conditionAssessment?.receivedDate || o.returnCondition?.receivedDate || o.items?.[0]?.returnCondition?.receivedDate || o.returnedDate || o.returnedAt || o.returnDetails?.date || o.rentalEndDate || o.updatedAt;
                        if (!raw) return '—';
                        try {
                          const d = new Date(raw);
                          return isNaN(d.getTime()) ? '—' : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                        } catch {
                          return '—';
                        }
                      })()}
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
                          ₹{(o.depositDecision?.releasedAmount ?? o.deposit ?? 0).toLocaleString('en-IN')} Released
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

      {/* Modals */}
      
      {/* Return Condition Modal */}
      {returnModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl overflow-hidden font-sans">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-[#fcf9f5]">
              <h3 className="text-sm font-serif font-bold text-stone-900">
                Log Return: {returnModalOrder.productName}
              </h3>
              <button onClick={() => setReturnModalOrder(null)} className="text-stone-400 hover:text-stone-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Quality Assessment Grade</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`border rounded-lg p-3 cursor-pointer transition-colors ${returnCondition === 'A' ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500' : 'bg-white border-stone-200 hover:border-stone-300'}`}>
                    <input type="radio" name="grade" value="A" checked={returnCondition === 'A'} onChange={() => setReturnCondition('A')} className="sr-only" />
                    <span className="font-bold text-emerald-800 flex items-center justify-between">Grade A: Excellent</span>
                    <p className="text-[10px] text-stone-500 mt-1">No signs of wear, returned perfectly.</p>
                  </label>
                  <label className={`border rounded-lg p-3 cursor-pointer transition-colors ${returnCondition === 'B' ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'bg-white border-stone-200 hover:border-stone-300'}`}>
                    <input type="radio" name="grade" value="B" checked={returnCondition === 'B'} onChange={() => setReturnCondition('B')} className="sr-only" />
                    <span className="font-bold text-blue-800 flex items-center justify-between">Grade B: Good</span>
                    <p className="text-[10px] text-stone-500 mt-1">Minor removable stains, normal wear.</p>
                  </label>
                  <label className={`border rounded-lg p-3 cursor-pointer transition-colors ${returnCondition === 'C' ? 'bg-amber-50 border-amber-500 ring-1 ring-amber-500' : 'bg-white border-stone-200 hover:border-stone-300'}`}>
                    <input type="radio" name="grade" value="C" checked={returnCondition === 'C'} onChange={() => setReturnCondition('C')} className="sr-only" />
                    <span className="font-bold text-amber-800 flex items-center justify-between">Grade C: Damaged</span>
                    <p className="text-[10px] text-stone-500 mt-1">Tears, hard stains. Deposit deduction likely.</p>
                  </label>
                  <label className={`border rounded-lg p-3 cursor-pointer transition-colors ${returnCondition === 'D' ? 'bg-rose-50 border-rose-500 ring-1 ring-rose-500' : 'bg-white border-stone-200 hover:border-stone-300'}`}>
                    <input type="radio" name="grade" value="D" checked={returnCondition === 'D'} onChange={() => setReturnCondition('D')} className="sr-only" />
                    <span className="font-bold text-rose-800 flex items-center justify-between">Grade D: Severe</span>
                    <p className="text-[10px] text-stone-500 mt-1">Ruined or unwearable. Full deposit forfeit.</p>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Inspection Notes</label>
                <textarea
                  value={returnNotes}
                  onChange={(e) => setReturnNotes(e.target.value)}
                  placeholder="Note any specific damages or missing items..."
                  className="w-full p-3 border border-stone-200 rounded-lg text-xs bg-stone-50 outline-none focus:border-[#c5a880] resize-none h-24"
                />
              </div>

              {(returnCondition === 'C' || returnCondition === 'D') && (
                <div className="p-3 bg-amber-50 text-amber-800 rounded text-[11px] border border-amber-200 flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>Logging as Damaged will freeze the deposit and move this order to the <strong>Pending Deposit Assessments</strong> queue for manual review.</span>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-stone-100 flex justify-end gap-3 bg-stone-50">
              <button onClick={() => setReturnModalOrder(null)} className="px-4 py-2 border border-stone-200 rounded text-xs font-semibold text-stone-600 hover:bg-white transition cursor-pointer">
                Cancel
              </button>
              <button onClick={processReturn} className="px-5 py-2 bg-[#1e1412] hover:bg-[#2c1d1a] text-white rounded text-xs font-bold transition cursor-pointer shadow-sm">
                Confirm Return Assessment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Modal (Deduct/Reject/Release) */}
      {assessmentModalOrder && assessmentAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl overflow-hidden font-sans">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-[#fcf9f5]">
              <h3 className="text-sm font-serif font-bold text-stone-900">
                {assessmentAction === 'Deduct' ? 'Process Fine / Deduction' : assessmentAction === 'Reject' ? 'Reject Issue & Refund' : 'Release Full Deposit'}
              </h3>
              <button onClick={() => setAssessmentModalOrder(null)} className="text-stone-400 hover:text-stone-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="p-3 bg-stone-50 border border-stone-100 rounded text-xs space-y-1">
                <p><span className="font-semibold text-stone-500">Order:</span> {assessmentModalOrder.id}</p>
                <p><span className="font-semibold text-stone-500">Customer:</span> {assessmentModalOrder.customerName}</p>
                <p><span className="font-semibold text-stone-500">Total Deposit Held:</span> <span className="font-bold text-stone-900">₹{assessmentModalOrder.deposit.toLocaleString('en-IN')}</span></p>
              </div>

              {assessmentAction === 'Deduct' && (
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Deduction Amount (₹)</label>
                  <input
                    type="number"
                    value={deductionAmount}
                    onChange={(e) => setDeductionAmount(e.target.value)}
                    placeholder="E.g. 1500"
                    className="w-full p-2 border border-stone-200 rounded-md text-sm outline-none focus:border-[#c5a880]"
                  />
                  <p className="text-[10px] text-stone-400">The remaining ₹{Math.max(0, assessmentModalOrder.deposit - (Number(deductionAmount) || 0)).toLocaleString('en-IN')} will be released to the customer.</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Admin Comment to Customer (Optional)</label>
                <textarea
                  value={adminComment}
                  onChange={(e) => setAdminComment(e.target.value)}
                  placeholder={assessmentAction === 'Deduct' ? "Explain the deduction (e.g. 'Dry cleaning fee for wine stain')..." : "Message to customer..."}
                  className="w-full p-2 border border-stone-200 rounded-md text-xs bg-white outline-none focus:border-[#c5a880] resize-none h-20"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-stone-100 flex justify-end gap-3 bg-stone-50">
              <button onClick={() => setAssessmentModalOrder(null)} className="px-4 py-2 border border-stone-200 rounded text-xs font-semibold text-stone-600 hover:bg-white transition cursor-pointer">
                Cancel
              </button>
              <button onClick={processAssessment} className={`px-5 py-2 text-white rounded text-xs font-bold transition cursor-pointer shadow-sm ${assessmentAction === 'Deduct' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
                Confirm {assessmentAction === 'Deduct' ? 'Deduction' : 'Release'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
