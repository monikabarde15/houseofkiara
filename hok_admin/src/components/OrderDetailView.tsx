import React, { useEffect, useState } from 'react';
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  Clock, 
  MapPin, 
  Calendar, 
  Printer, 
  Send, 
  FileText,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  User,
  Plus
} from 'lucide-react';
import { Order } from '../types';
import * as orderApi from '../services/orderApi';
import { uploadFile } from '../services/uploadApi';
import { sendMockMessage } from '../services/messageApi';
import toast from 'react-hot-toast';

interface OrderDetailViewProps {
  order: Order;
  onBack: () => void;
  onUpdateOrder: (updatedOrder: Order) => void;
}

export default function OrderDetailView({ order, onBack, onUpdateOrder }: OrderDetailViewProps) {
  const [activeTab, setActiveTab] = useState<'Summary' | 'Items' | 'Dispatch' | 'Return' | 'Deposit' | 'Log'>('Summary');
  
  // local editable state
  const [status, setStatus] = useState(order.status);
  const [internalNotes, setInternalNotes] = useState(order.internalNotes || '');
  
  // Dispatch fields
  const [dispatchedBy, setDispatchedBy] = useState(order.dispatchDetails?.dispatchedBy || '');
  const [dispatchDate, setDispatchDate] = useState(order.dispatchDetails?.date || '');
  const [trackingNumber, setTrackingNumber] = useState(order.dispatchDetails?.trackingNumber || '');
  const [courierPartner, setCourierPartner] = useState(order.dispatchDetails?.courierPartner || '');

  // Return Logistics fields
  const [returnDate, setReturnDate] = useState(order.returnLogistics?.returnDate || '');
  const [returnMethod, setReturnMethod] = useState(order.returnLogistics?.returnMethod || '');
  const [returnCourier, setReturnCourier] = useState(order.returnLogistics?.courierPartner || '');

  // Return Assessment
  const [receivedBy, setReceivedBy] = useState(order.conditionAssessment?.receivedBy || 'Soumya');
  const [receivedDate, setReceivedDate] = useState(order.conditionAssessment?.receivedDate || '');
  const [conditionGrade, setConditionGrade] = useState<'A' | 'B' | 'C' | 'D'>(order.conditionAssessment?.grade || 'A');
  const [conditionNotes, setConditionNotes] = useState(order.conditionAssessment?.notes || '');

  // Deposit Decision
  const [depositStatus, setDepositStatus] = useState(order.depositDecision?.status || 'Pending');
  const [releasedAmount, setReleasedAmount] = useState(order.depositDecision?.releasedAmount || 0);
  const [deductedAmount, setDeductedAmount] = useState(order.depositDecision?.deductedAmount || 0);
  const [depositReason, setDepositReason] = useState(order.depositDecision?.reason || '');

  // New logs list
  const [logs, setLogs] = useState(order.logs);
  const [newLogText, setNewLogText] = useState('');
  const [dispatchEvidence, setDispatchEvidence] = useState<string[]>([]);
  const [returnEvidence, setReturnEvidence] = useState<string[]>([]);
  const [evidenceUploading, setEvidenceUploading] = useState(false);
  const [evidenceItemIndex, setEvidenceItemIndex] = useState(0);
  useEffect(() => {
    const item = order.items?.[evidenceItemIndex] as any;
    setDispatchEvidence(item?.preDispatch?.photos || []);
    setReturnEvidence(item?.returnCondition?.photos || []);
  }, [order, evidenceItemIndex]);
  const uploadEvidence = async (files: FileList | null, stage: 'dispatch' | 'return') => { if (!files?.length) return; setEvidenceUploading(true); try { const uploaded = await Promise.all(Array.from(files).map(file => uploadFile(file, 'orders'))); const urls = uploaded.map(file => file.url); const current = stage === 'dispatch' ? dispatchEvidence : returnEvidence; const next = [...current, ...urls]; if (stage === 'dispatch') setDispatchEvidence(next); else setReturnEvidence(next); await orderApi.saveEvidence(order.id, evidenceItemIndex, stage, next); } catch (error) { toast.error(error instanceof Error ? error.message : 'Evidence upload failed'); } finally { setEvidenceUploading(false); } };

  const handleSaveChanges = () => {
    const updatedOrder: Order = {
      ...order,
      status,
      internalNotes,
      dispatchDetails: {
        dispatchedBy,
        date: dispatchDate,
        trackingNumber,
        courierPartner
      },
      returnLogistics: returnDate ? {
        returnDate,
        returnMethod,
        courierPartner: returnCourier
      } : undefined,
      conditionAssessment: receivedDate ? {
        receivedDate,
        receivedBy,
        grade: conditionGrade,
        notes: conditionNotes
      } : undefined,
      depositDecision: {
        status: depositStatus as any,
        releasedAmount: Number(releasedAmount),
        deductedAmount: Number(deductedAmount),
        reason: depositReason
      },
      logs
    };
    onUpdateOrder(updatedOrder);
    toast.success("Changes saved successfully!");
  };

  const addLog = async () => {
    if (!newLogText.trim()) return;
    const nowStr = new Date().toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const newLog = {
      date: nowStr,
      message: newLogText,
      user: "Soumya"
    };
    setLogs([newLog, ...logs]);
    setNewLogText('');
    try { await orderApi.addOrderLog(order.id, newLogText, 'Internal Note'); } catch (error) { toast.error(error instanceof Error ? error.message : 'Unable to save log entry'); }
  };

  const downloadInvoice = async () => {
    try {
      const invoice = await orderApi.getInvoice(order.id);
      const money = (value: number) => `₹${Number(value || 0).toLocaleString('en-IN')}`;
      const rows = (invoice.items || []).map((item: any) => `<tr><td>${item.productName}</td><td>${item.mode}</td><td>${money(item.amount)}</td><td>${money(item.gst)}</td><td>${money(item.deposit)}</td></tr>`).join('');
      const win = window.open('', '_blank', 'width=900,height=700');
      if (!win) throw new Error('Please allow pop-ups to print the invoice');
      win.document.write(`<html><head><title>${invoice.invoiceNo}</title><style>body{font-family:Arial;color:#29231d;padding:40px}h1{color:#8b6b32}table{width:100%;border-collapse:collapse;margin-top:28px}th,td{border:1px solid #ddd;padding:10px;text-align:left}th{background:#f5f0e8}.totals{margin-left:auto;width:280px;margin-top:24px;line-height:1.8;text-align:right}@media print{button{display:none}}</style></head><body><h1>HOUSE OF KAIRA</h1><p>GST Invoice</p><p><b>Invoice No:</b> ${invoice.invoiceNo}<br><b>Date:</b> ${new Date(invoice.invoiceDate).toLocaleDateString('en-IN')}<br><b>Order:</b> ${invoice.orderId}</p><p><b>Customer:</b> ${invoice.customer?.name || ''}<br>${invoice.customer?.email || ''}<br>${invoice.customer?.phone || ''}<br>${invoice.customer?.address || ''}</p><table><thead><tr><th>Product</th><th>Mode</th><th>Amount</th><th>GST</th><th>Deposit</th></tr></thead><tbody>${rows}</tbody></table><div class="totals"><b>Order value: ${money(invoice.orderValue)}</b><br>GST: ${money(invoice.gst)}<br>Deposit: ${money(invoice.deposit)}<br><b>Grand total: ${money(invoice.grandTotal)}</b></div><button onclick="window.print()">Print / Save as PDF</button></body></html>`);
      win.document.close(); win.focus();
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Unable to generate invoice'); }
  };

  const printDispatchLabel = () => {
    const win = window.open('', '_blank', 'width=600,height=500');
    if (!win) return toast.error('Please allow pop-ups to print the dispatch label');
    win.document.write(`<html><head><title>Dispatch Label ${order.id}</title><style>body{font-family:Arial;padding:28px;border:2px solid #222;margin:20px}h2{margin-top:0}.line{border-bottom:1px solid #aaa;padding:10px 0}</style></head><body><h2>HOUSE OF KAIRA — DISPATCH LABEL</h2><div class="line"><b>Order:</b> ${order.id}</div><div class="line"><b>Customer:</b> ${order.customerName}</div><div class="line"><b>Phone:</b> ${order.customerPhone || ''}</div><div class="line"><b>Address:</b> ${order.address || '—'}</div><div class="line"><b>Courier:</b> ${courierPartner || '—'} &nbsp; <b>Tracking:</b> ${trackingNumber || '—'}</div><div class="line"><b>Dispatch date:</b> ${dispatchDate || new Date().toISOString().slice(0,10)}</div><button onclick="window.print()">Print Label</button></body></html>`);
    win.document.close(); win.focus();
  };

  const sendTrackingInfo = async () => {
    const tracking = trackingNumber.trim();
    if (!tracking) return toast.error('Please save a tracking number before sending tracking information.');
    const phone = (order.customerPhone || '').replace(/[^0-9]/g, '');
    if (!phone) return toast.error('Customer phone number is missing.');
    const message = `Hello ${order.customerName}, your House of Kaira order #${order.id} has been dispatched via ${courierPartner || 'our courier partner'}. Tracking number: ${tracking}.`;
    await sendMockMessage({ channel: 'whatsapp', to: phone, body: message });
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    const logMessage = `Tracking information shared with customer via WhatsApp: ${tracking}`;
    const log = { date: new Date().toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }), message: logMessage, user: 'Admin' };
    setLogs(current => [log, ...current]);
    try { await orderApi.addOrderLog(order.id, logMessage, 'Customer Communication'); } catch (error) { toast.error(error instanceof Error ? error.message : 'Tracking message opened, but log could not be saved'); }
  };

  const steps = ['Confirmed', 'Dispatched', 'Shipped', 'Delivered', 'Return Sent', 'Returned', 'Complete'];
  const currentStepIndex = steps.indexOf(status === 'Processed' ? 'Complete' : status);

  return (
    <div className="space-y-6">
      
      {/* Breadcrumb / Back button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button 
            onClick={onBack}
            className="p-1 text-stone-500 hover:text-stone-900 rounded cursor-pointer hover:bg-stone-100 transition"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-1.5 text-xs font-sans text-stone-500">
            <span className="hover:underline cursor-pointer" onClick={onBack}>Orders</span>
            <ChevronRight className="h-3 w-3" />
            <span className="font-semibold text-stone-800">{order.id}</span>
          </div>
        </div>
        
        {/* Save actions */}
        <div className="flex items-center gap-2">
          <select 
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs font-semibold text-stone-800 focus:border-[#c5a880] outline-none"
          >
            {steps.map(s => <option key={s} value={s}>{s}</option>)}
            <option value="Processed">Processed</option>
          </select>
          <button 
            onClick={handleSaveChanges}
            className="px-4 py-2 bg-[#1e1412] hover:bg-[#2c1d1a] text-white text-xs font-semibold rounded cursor-pointer transition"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Title block */}
      <div className="flex justify-between items-end border-b border-stone-100 pb-5">
        <div>
          <h2 className="text-2xl font-serif text-stone-950 font-bold">{order.productName || 'Rental Order Details'}</h2>
          <p className="text-xs text-stone-500 mt-1.5 font-sans">
            <span className="font-semibold text-stone-800">{order.customerName}</span>{order.customerEmail ? ` — ${order.customerEmail}` : ''} — ID: <span className="font-mono">{order.id}</span>
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-center">
          <div className="px-4 py-2 bg-stone-50 border border-stone-100 rounded">
            <span className="text-[9px] uppercase tracking-wider text-stone-400 font-sans font-bold">Value</span>
            <p className="text-sm font-serif font-bold text-stone-900 mt-0.5">₹{Number(order.amount || (order as any).totalAmount || 8000).toLocaleString('en-IN')}</p>
          </div>
          <div className="px-4 py-2 bg-stone-50 border border-stone-100 rounded">
            <span className="text-[9px] uppercase tracking-wider text-stone-400 font-sans font-bold">Discount</span>
            <p className="text-sm font-serif font-bold text-stone-900 mt-0.5">₹{Number(order.discount || 0).toLocaleString('en-IN')}</p>
          </div>
          <div className="px-4 py-2 bg-stone-50 border border-stone-100 rounded">
            <span className="text-[9px] uppercase tracking-wider text-stone-400 font-sans font-bold">Deposit Held</span>
            <p className="text-sm font-serif font-bold text-amber-700 mt-0.5">₹{Number(order.deposit || (order as any).securityDeposit || 0).toLocaleString('en-IN')}</p>
          </div>
          <div className="px-4 py-2 bg-stone-50 border border-stone-100 rounded">
            <span className="text-[9px] uppercase tracking-wider text-stone-400 font-sans font-bold">Grand Total</span>
            <p className="text-sm font-serif font-bold text-stone-900 mt-0.5">₹{Number(order.grandTotal || order.amount || (order as any).totalAmount || 8000).toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      {/* Progress Timeline Tracker */}
      <div className="bg-white p-6 rounded-lg border border-stone-200/80 shadow-sm overflow-x-auto pb-4">
        <div className="flex justify-between items-center relative min-w-[550px] lg:min-w-0 max-w-4xl mx-auto">
          {/* Progress bar line */}
          <div className="absolute left-0 right-0 top-3.5 h-0.5 bg-stone-100 -z-0" />
          <div 
            className="absolute left-0 top-3.5 h-0.5 bg-[#c5a880] transition-all duration-350"
            style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
          />

          {steps.map((stepName, idx) => {
            const isCompleted = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <div key={stepName} className="flex flex-col items-center relative z-10 select-none">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 transition ${
                  isCurrent 
                    ? 'bg-white border-[#c5a880] text-[#c5a880] font-bold shadow-sm'
                    : isCompleted 
                    ? 'bg-[#c5a880] border-[#c5a880] text-white' 
                    : 'bg-white border-stone-200 text-stone-300'
                }`}>
                  {isCompleted && !isCurrent ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <span className="text-xs">{idx + 1}</span>
                  )}
                </div>
                <span className={`text-[10px] font-semibold mt-2 ${isCurrent ? 'text-[#c5a880] font-bold' : isCompleted ? 'text-stone-700' : 'text-stone-400'}`}>
                  {stepName}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-stone-200 gap-1 select-none overflow-x-auto whitespace-nowrap scrollbar-none pb-px">
        {(['Summary', 'Items', 'Dispatch', 'Return', 'Deposit', 'Log'] as const).map((tab) => {
          const labels = {
            Summary: 'Summary',
            Items: 'Items & Pricing',
            Dispatch: 'Dispatch',
            Return: 'Return & Condition',
            Deposit: 'Deposit Decision',
            Log: 'Log & Notes'
          };
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-xs font-semibold border-b-2 transition cursor-pointer ${
                isActive 
                  ? 'border-[#c5a880] text-stone-900 font-bold' 
                  : 'border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-200'
              }`}
            >
              {labels[tab]}
            </button>
          );
        })}
      </div>

      {/* Tab Content + Actions Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Tab content - Left Col 2 spans */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'Summary' && (
            <div className="bg-white p-6 rounded-lg border border-stone-200/80 shadow-sm space-y-6 text-xs font-sans">
              
              {/* Customer contact card */}
              <div>
                <h4 className="font-serif font-bold text-[#1e1412] text-sm border-b border-stone-100 pb-2 tracking-wide">
                  Customer Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-stone-600">
                  <div className="space-y-2">
                    <p className="flex items-center gap-2">
                      <User className="h-4 w-4 text-stone-400" />
                      <span>{order.customerName}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-stone-400" />
                      <a href={`mailto:${order.customerEmail}`} className="hover:underline">{order.customerEmail}</a>
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-stone-400" />
                      <span>{order.customerPhone}</span>
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-stone-700">Shipping / Delivery Address:</p>
                    <p className="text-stone-500 mt-1 leading-relaxed">
                      {order.address}
                    </p>
                  </div>
                </div>
              </div>

              {/* Booking timelines */}
              <div>
                <h4 className="font-serif font-bold text-[#1e1412] text-sm border-b border-stone-100 pb-2 tracking-wide">
                  Rental Timelines
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-4">
                  <div className="p-3 bg-stone-50 rounded border border-stone-100">
                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Rental Start</p>
                    <p className="text-xs font-semibold text-stone-800 mt-1 font-sans">
                      {order.rentalStartDate ? new Date(order.rentalStartDate).toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'}) : 'N/A'}
                    </p>
                  </div>
                  <div className="p-3 bg-stone-50 rounded border border-stone-100">
                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Return Date</p>
                    <p className="text-xs font-semibold text-stone-800 mt-1 font-sans">
                      {order.rentalEndDate ? new Date(order.rentalEndDate).toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'}) : 'N/A'}
                    </p>
                  </div>
                  <div className="p-3 bg-stone-50 rounded border border-stone-100">
                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Duration</p>
                    <p className="text-xs font-semibold text-stone-800 mt-1 font-sans">4 Nights</p>
                  </div>
                </div>
              </div>

              {/* Internal Notes textarea */}
              <div className="space-y-2">
                <label className="font-semibold text-stone-700 block">Internal Admin Notes</label>
                <textarea
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="E.g. VIP client, requires extra fabric padding, calls requested before dispatch..."
                  rows={4}
                  className="w-full p-3 bg-[#fcf9f5] border border-stone-200 rounded text-xs outline-none focus:border-[#c5a880] transition leading-relaxed text-stone-700"
                />
              </div>

            </div>
          )}

          {activeTab === 'Items' && (
            <div className="bg-white p-6 rounded-lg border border-stone-200/80 shadow-sm space-y-6 text-xs">
              <h4 className="font-serif font-bold text-stone-900 text-sm border-b border-stone-100 pb-2">
                Pricing & Invoice breakdown
              </h4>
              <div className="space-y-3 font-sans">
                <div className="flex justify-between py-1 border-b border-stone-50 text-stone-600">
                  <span>Rental fee / Retail price</span>
                  <span className="font-semibold">₹{Number(order.amount || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-50 text-stone-600">
                  <span>SGST / CGST Tax (Included)</span>
                  <span>₹{Math.round(Number(order.amount || 0) * 0.12).toLocaleString('en-IN')} (12%)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-50 text-stone-600">
                  <span>Security Deposit held (Refundable)</span>
                  <span className="font-semibold">₹{Number(order.deposit || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-50 text-stone-600">
                  <span>Promo Discount</span>
                  <span className="text-rose-600 font-semibold">- ₹{Number(order.discount || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-2 border-t border-stone-200 text-sm font-bold text-stone-900">
                  <span>Grand Total Paid</span>
                  <span>₹{Number(order.grandTotal || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Invoice block */}
              <div className="p-4 bg-stone-50 border border-stone-100 rounded flex justify-between items-center">
                <div>
                  <p className="font-bold text-stone-800">Invoice No: {order.invoiceNo || `HOK-INV-${order.id.replace(/\W/g, '')}`}</p>
                  <p className="text-[10px] text-stone-400 mt-1 font-mono">Invoice Date: {order.invoiceDate || order.rentalStartDate || new Date().toISOString().slice(0, 10)}</p>
                </div>
                <button 
                  onClick={downloadInvoice}
                  className="px-3 py-1.5 bg-white border border-stone-200 hover:border-[#c5a880] text-stone-700 hover:bg-[#fcf9f5] rounded text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Printer className="h-4 w-4" />
                  <span>Download Invoice</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'Dispatch' && (
            <div className="bg-white p-6 rounded-lg border border-stone-200/80 shadow-sm space-y-6 text-xs font-sans">
              <h4 className="font-serif font-bold text-[#1e1412] text-sm border-b border-stone-100 pb-2">
                Dispatch & Shipping Logistics
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-stone-500 font-medium">Dispatched By / Handled By</label>
                  <input
                    type="text"
                    value={dispatchedBy}
                    onChange={(e) => setDispatchedBy(e.target.value)}
                    placeholder="E.g. DHL Express, BlueDart..."
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-500 font-medium">Dispatch Date</label>
                  <input
                    type="date"
                    value={dispatchDate}
                    onChange={(e) => setDispatchDate(e.target.value)}
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-500 font-medium">Tracking Number</label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="E.g. BD1234567"
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-500 font-medium">Courier Partner</label>
                  <input
                    type="text"
                    value={courierPartner}
                    onChange={(e) => setCourierPartner(e.target.value)}
                    placeholder="E.g. DHL Express, BlueDart..."
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                  />
                </div>
              </div>
              <div className="rounded border border-dashed border-[#c5a880] bg-[#fcf9f5] p-4"><label className="block text-xs font-semibold text-stone-600">Pre-dispatch photos/video</label>{(order.items?.length || 0) > 1 && <select value={evidenceItemIndex} onChange={e => setEvidenceItemIndex(Number(e.target.value))} className="mt-2 w-full rounded border p-2 text-xs">{order.items.map((item, index) => <option key={index} value={index}>Product {index + 1}: {item.productName}</option>)}</select>}<input type="file" accept="image/*,video/*" multiple disabled={evidenceUploading} onChange={e => uploadEvidence(e.currentTarget.files, 'dispatch')} className="mt-2 text-xs" />{dispatchEvidence.length > 0 && <p className="mt-2 text-[10px] text-emerald-700">{dispatchEvidence.length} evidence file(s) uploaded for product {evidenceItemIndex + 1}</p>}</div>

              {/* Return Pickup schedule */}
              <div className="border-t border-stone-100 pt-5 space-y-4">
                <h5 className="font-bold text-stone-800 text-xs">Return Pickup logistics</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-stone-500 font-medium">Scheduled Return Pickup Date</label>
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-stone-500 font-medium">Return Method</label>
                    <input
                      type="text"
                      value={returnMethod}
                      onChange={(e) => setReturnMethod(e.target.value)}
                      placeholder="E.g. Courier Pickup, Dropoff..."
                      className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-stone-500 font-medium">Return Courier Partner</label>
                    <input
                      type="text"
                      value={returnCourier}
                      onChange={(e) => setReturnCourier(e.target.value)}
                      placeholder="E.g. BlueDart, Courier..."
                      className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Return' && (
            <div className="bg-white p-6 rounded-lg border border-stone-200/80 shadow-sm space-y-6 text-xs font-sans">
              <h4 className="font-serif font-bold text-stone-900 text-sm border-b border-stone-100 pb-2">
                Physical Return & Condition Assessment
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-stone-500 font-medium">Inspection Conducted By</label>
                  <input
                    type="text"
                    value={receivedBy}
                    onChange={(e) => setReceivedBy(e.target.value)}
                    placeholder="E.g. Soumya..."
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-500 font-medium">Physical Receipt Date</label>
                  <input
                    type="date"
                    value={receivedDate}
                    onChange={(e) => setReceivedDate(e.target.value)}
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                  />
                </div>
              </div>

              {/* Condition Grade */}
              <div className="space-y-3">
                <label className="text-stone-600 font-bold block">Assessed Garment Condition Grade</label>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { grade: 'A', label: 'Excellent', desc: 'Minimal wear, spotless, dry clean intact' },
                    { grade: 'B', label: 'Good', desc: 'Slight wear, easily repairable lint/creases' },
                    { grade: 'C', label: 'Damaged', desc: 'Minor tears or stains. Requires repair deduction' },
                    { grade: 'D', label: 'Significant', desc: 'Severe fabric ruin, zardozi ripped. Complete loss' }
                  ].map((g) => (
                    <button
                      key={g.grade}
                      type="button"
                      onClick={() => setConditionGrade(g.grade as any)}
                      className={`p-3 border rounded text-left transition cursor-pointer ${
                        conditionGrade === g.grade
                          ? 'border-[#c5a880] bg-[#fcf9f5] shadow-sm'
                          : 'border-stone-200 hover:border-stone-350 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className={`h-5 w-5 rounded-full flex items-center justify-center font-bold text-xs ${
                          conditionGrade === g.grade ? 'bg-[#c5a880] text-white' : 'bg-stone-100 text-stone-500'
                        }`}>
                          {g.grade}
                        </span>
                        <span className="font-bold text-stone-800">{g.label}</span>
                      </div>
                      <p className="text-[10px] text-stone-400 mt-1 leading-snug">{g.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-stone-500 font-medium">Condition Assessment Notes</label>
                <textarea
                  value={conditionNotes}
                  onChange={(e) => setConditionNotes(e.target.value)}
                  placeholder="Describe stitching quality, hooks, stains, thread pulling etc..."
                  rows={3}
                  className="w-full p-2.5 bg-[#fcf9f5] border border-stone-200 rounded text-xs outline-none focus:border-[#c5a880] text-stone-700"
                />
              </div>
              <div className="rounded border border-dashed border-[#c5a880] bg-[#fcf9f5] p-4"><label className="block text-xs font-semibold text-stone-600">Return condition photos/video</label>{(order.items?.length || 0) > 1 && <select value={evidenceItemIndex} onChange={e => setEvidenceItemIndex(Number(e.target.value))} className="mt-2 w-full rounded border p-2 text-xs">{order.items.map((item, index) => <option key={index} value={index}>Product {index + 1}: {item.productName}</option>)}</select>}<input type="file" accept="image/*,video/*" multiple disabled={evidenceUploading} onChange={e => uploadEvidence(e.currentTarget.files, 'return')} className="mt-2 text-xs" />{returnEvidence.length > 0 && <p className="mt-2 text-[10px] text-emerald-700">{returnEvidence.length} evidence file(s) uploaded for product {evidenceItemIndex + 1}</p>}</div>

            </div>
          )}

          {activeTab === 'Deposit' && (
            <div className="bg-white p-6 rounded-lg border border-stone-200/80 shadow-sm space-y-6 text-xs font-sans">
              <h4 className="font-serif font-bold text-stone-900 text-sm border-b border-stone-100 pb-2">
                Deposit Decision & Settlement
              </h4>

              <div className="space-y-3">
                <label className="text-stone-600 font-bold block">Deposit Settlement Option</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { status: 'Released', label: 'Release in Full', desc: 'Refund full amount back to the client.' },
                    { status: 'Partial', label: 'Partial Release', desc: 'Deduct custom fees for minor repair/dry-clean.' },
                    { status: 'Forfeited', label: 'Forfeit Deposit', desc: 'Hold entire deposit due to significant damage.' }
                  ].map((s) => (
                    <button
                      key={s.status}
                      type="button"
                      onClick={() => {
                        setDepositStatus(s.status as 'Pending' | 'Released' | 'Partial' | 'Forfeited');
                        if (s.status === 'Released') {
                          setReleasedAmount(order.deposit);
                          setDeductedAmount(0);
                        } else if (s.status === 'Forfeited') {
                          setReleasedAmount(0);
                          setDeductedAmount(order.deposit);
                        }
                      }}
                      className={`p-3 border rounded text-left transition cursor-pointer ${
                        depositStatus === s.status
                          ? 'border-[#c5a880] bg-[#fcf9f5] shadow-sm'
                          : 'border-stone-200 bg-white hover:border-stone-350'
                      }`}
                    >
                      <p className="font-bold text-stone-800">{s.label}</p>
                      <p className="text-[10px] text-stone-400 mt-1 leading-snug">{s.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-stone-500 font-medium">Refund/Released Amount (₹)</label>
                  <input
                    type="number"
                    value={releasedAmount}
                    onChange={(e) => setReleasedAmount(Number(e.target.value))}
                    max={order.deposit}
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                    disabled={depositStatus === 'Forfeited'}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-500 font-medium">Deducted/Withheld Amount (₹)</label>
                  <input
                    type="number"
                    value={deductedAmount}
                    onChange={(e) => setDeductedAmount(Number(e.target.value))}
                    max={order.deposit}
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                    disabled={depositStatus === 'Released'}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-stone-500 font-medium">Decision Settlement Reason</label>
                <input
                  type="text"
                  value={depositReason}
                  onChange={(e) => setDepositReason(e.target.value)}
                  placeholder="Reason for withholding or releasing deposit..."
                  className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                />
              </div>

            </div>
          )}

          {activeTab === 'Log' && (
            <div className="bg-white p-6 rounded-lg border border-stone-200/80 shadow-sm space-y-6 text-xs">
              <h4 className="font-serif font-bold text-stone-900 text-sm border-b border-stone-100 pb-2">
                Order Timeline & Logs
              </h4>

              {/* Add manual log */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newLogText}
                  onChange={(e) => setNewLogText(e.target.value)}
                  placeholder="Log manual update, WhatsApp call, fit review details..."
                  className="flex-1 p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs outline-none focus:border-[#c5a880]"
                />
                <button
                  type="button"
                  onClick={addLog}
                  className="px-4 py-2 bg-[#1e1412] text-white hover:bg-[#2c1d1a] rounded text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Log Event</span>
                </button>
              </div>

              {/* Log Timeline list */}
              <div className="relative border-l-2 border-stone-100 pl-4 space-y-4 font-sans ml-2">
                {logs.map((log, index) => (
                  <div key={index} className="relative">
                    {/* Circle marker */}
                    <div className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-[#c5a880] border-2 border-white ring-4 ring-[#fcf9f5]" />
                    <div className="space-y-1 bg-stone-50 p-2.5 rounded border border-stone-100/50">
                      <div className="flex justify-between text-[10px] text-stone-400">
                        <span>{log.date}</span>
                        <span className="font-semibold text-[#c5a880]">By {log.user}</span>
                      </div>
                      <p className="text-xs text-stone-700 leading-relaxed">{log.message}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}
        </div>

        {/* Sidebar Actions - Right Col 1 span */}
        <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-4 h-fit select-none">
          <h3 className="font-serif font-bold text-stone-900 text-sm border-b border-stone-100 pb-3 tracking-wide">
            Quick Client Actions
          </h3>

          <div className="space-y-2">
            <button 
              onClick={() => {
                const text = encodeURIComponent(`Hello ${order.customerName},\nThis is Soumya from House of Kaira regarding order #${order.id}.`);
                window.open(`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
              }}
              className="w-full p-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 text-emerald-800 rounded font-semibold text-xs flex items-center justify-between transition cursor-pointer"
            >
              <span>WhatsApp Client</span>
              <Phone className="h-3.5 w-3.5" />
            </button>

            <button 
              onClick={() => {
                window.location.href = `mailto:${order.customerEmail}?subject=Your House of Kaira Order #${order.id}`;
              }}
              className="w-full p-2.5 bg-blue-50 hover:bg-blue-100 border border-blue-100 text-blue-800 rounded font-semibold text-xs flex items-center justify-between transition cursor-pointer"
            >
              <span>Email Client</span>
              <Mail className="h-3.5 w-3.5" />
            </button>

            <button 
              onClick={() => {
                setActiveTab('Return');
              }}
              className="w-full p-2.5 bg-[#fcf9f5] hover:bg-[#f6eee2] border border-stone-100 text-stone-700 rounded font-semibold text-xs flex items-center justify-between transition cursor-pointer"
            >
              <span>Log Return & Assess Condition</span>
              <ChevronRight className="h-3.5 w-3.5 text-stone-400" />
            </button>

            <button 
              onClick={() => {
                setActiveTab('Deposit');
              }}
              className="w-full p-2.5 bg-[#fcf9f5] hover:bg-[#f6eee2] border border-stone-100 text-stone-700 rounded font-semibold text-xs flex items-center justify-between transition cursor-pointer"
            >
              <span>Manage Deposit Decision</span>
              <ChevronRight className="h-3.5 w-3.5 text-stone-400" />
            </button>

            <button 
              onClick={printDispatchLabel}
              className="w-full p-2.5 bg-[#fcf9f5] hover:bg-[#f6eee2] border border-stone-100 text-stone-700 rounded font-semibold text-xs flex items-center justify-between transition cursor-pointer"
            >
              <span>Print Dispatch Label</span>
              <Printer className="h-3.5 w-3.5 text-stone-400" />
            </button>

            <button 
              onClick={sendTrackingInfo}
              className="w-full p-2.5 bg-[#fcf9f5] hover:bg-[#f6eee2] border border-stone-100 text-stone-700 rounded font-semibold text-xs flex items-center justify-between transition cursor-pointer"
            >
              <span>Send Tracking info to Customer</span>
              <Send className="h-3.5 w-3.5 text-stone-400" />
            </button>

            <button 
              onClick={downloadInvoice}
              className="w-full p-2.5 bg-[#fcf9f5] hover:bg-[#f6eee2] border border-stone-100 text-stone-700 rounded font-semibold text-xs flex items-center justify-between transition cursor-pointer"
            >
              <span>Generate GST Invoice</span>
              <FileText className="h-3.5 w-3.5 text-stone-400" />
            </button>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-100 rounded-md flex gap-2 text-stone-600 text-[11px] leading-relaxed">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-800">Dry Cleaning Window</p>
              <p className="text-stone-500 mt-0.5">Allow 2-3 business days buffer for processing after garment receipt.</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
