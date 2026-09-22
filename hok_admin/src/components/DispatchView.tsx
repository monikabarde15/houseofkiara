import React, { useState } from 'react';
import { Order } from '../types';
import toast from 'react-hot-toast';
import './Dispatch/css/DispatchView.css';
import './Dispatch/css/DispatchItemCard.css';
import './Dispatch/css/DepositWarning.css';

// ============================================================
// WHATSAPP ICON
// ============================================================
const WhatsAppIcon = () => (
  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#25D366] text-white shadow-sm mr-1.5">
    <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  </span>
);

function DepositWarning({ amount }: { amount: number }) {
  return (
    <div className="deposit-warning">
      <span className="deposit-warning-icon">⚠</span>
      <span>
        Deposit ₹{Number(amount).toLocaleString('en-IN')} not yet collected — record it on the order
        before this piece leaves the studio. Mark Dispatched will ask for an explicit override.
      </span>
    </div>
  );
}

interface DispatchViewProps {
  orders: Order[];
  setView: (view: string) => void;
  setSelectedOrderId: (id: string) => void;
  onUpdateOrder: (updatedOrder: Order) => void;
}

export default function DispatchView({ orders, setView, setSelectedOrderId, onUpdateOrder }: DispatchViewProps) {
  const [activeTab, setActiveTab] = useState<'Today' | 'Tomorrow' | 'Week'>('Week');

  // Helper to format date
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return { day: '--', month: '---' };
    try {
      const d = new Date(dateString);
      return {
        day: d.getDate().toString(),
        month: d.toLocaleString('default', { month: 'short' }).toUpperCase()
      };
    } catch (e) {
      return { day: '--', month: '---' };
    }
  };

  const [filterDateStr, setFilterDateStr] = useState<string>(new Date().toISOString().split('T')[0]);
  
  const todayDate = new Date(filterDateStr);
  const todayKey = todayDate.toISOString().split('T')[0];
  
  const tomorrowDate = new Date(todayDate);
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowKey = tomorrowDate.toISOString().split('T')[0];

  const getDispatchDate = (order: any) => {
    const item = order.items?.[0] || order;
    if (item.dispatch?.date) return item.dispatch.date;
    if (item.dispatchDate) return item.dispatchDate;
    if (item.rentalStartDate) {
      const d = new Date(item.rentalStartDate);
      d.setDate(d.getDate() - 2);
      return d.toISOString().split('T')[0];
    }
    return '';
  };

  const isValidDispatch = (o: any) => {
    const pName = o.items?.[0]?.productName || o.productName;
    return !!pName && !!o.customerName && pName !== 'Unknown Product';
  };

  const weekEndDate = new Date(todayDate);
  weekEndDate.setDate(weekEndDate.getDate() + 7);
  const weekEndKey = weekEndDate.toISOString().split('T')[0];

  const dispatchToday = orders.filter(o => o.status === 'Confirmed' && getDispatchDate(o) <= todayKey && isValidDispatch(o));
  const dispatchTomorrow = orders.filter(o => o.status === 'Confirmed' && getDispatchDate(o) === tomorrowKey && isValidDispatch(o));
  
  const dispatchWeek = orders.filter(o => {
    if (!isValidDispatch(o)) return false;
    if (o.status !== 'Confirmed' && o.status !== 'Dispatched' && o.status !== 'Shipped') return false;
    const dDate = getDispatchDate(o);
    if (!dDate) return false;
    
    if (o.status === 'Confirmed' && dDate <= weekEndKey) return true;
    if ((o.status === 'Dispatched' || o.status === 'Shipped') && dDate >= todayKey && dDate <= weekEndKey) return true;
    return false;
  }).sort((a, b) => getDispatchDate(a).localeCompare(getDispatchDate(b)));

  const handleMarkDispatched = (order: Order, depositNeeded: boolean, depositCollected: boolean) => {
    if (depositNeeded && !depositCollected) {
      if (!window.confirm(`Deposit for order ${order.id} has NOT been collected yet. Are you sure you want to mark this as Dispatched and override the block?`)) {
        return;
      }
    }
    const updated: Order = {
      ...order,
      status: 'Dispatched',
      dispatchDetails: {
        dispatchedBy: "DHL Express",
        date: new Date().toISOString().split('T')[0],
        trackingNumber: "DHL" + Math.floor(100000 + Math.random() * 900000) + "IN",
        courierPartner: "DHL Express"
      }
    };
    onUpdateOrder(updated);
    toast.success(`Order ${order.id} marked as Dispatched! Tracking number auto-generated.`);
  };

  const handleWhatsApp = (phone: string | undefined, name: string | undefined) => {
    if (!phone) {
      toast.error('No phone number found for this customer');
      return;
    }
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanPhone}`;
    window.open(url, '_blank');
  };

  const handlePrintLabel = () => {
    toast.success('Preparing shipping label for printing...');
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const currentList = activeTab === 'Today' ? dispatchToday : activeTab === 'Tomorrow' ? dispatchTomorrow : dispatchWeek;

  return (
    <div className="dispatch-page">
      <div className="dispatch-body">
        <span className="dispatch-eyebrow">OPERATIONS</span>
        <h1 className="dispatch-title">Dispatch Schedule</h1>
        <p className="dispatch-subtitle">
          Everything leaving the studio today, tomorrow, and this week. Mark dispatched, print labels, and jump
          to any order.
        </p>

        <div className="dispatch-date-row">
          <label>Filter Date:</label>
          <input
            type="date"
            value={filterDateStr}
            onChange={(e) => setFilterDateStr(e.target.value)}
            className="border border-stone-200 rounded px-2 py-1 text-sm outline-none focus:border-[#c5a880]"
          />
        </div>

        <div className="dispatch-tabs">
          {[
            { key: 'Today', label: 'Today', count: dispatchToday.length },
            { key: 'Tomorrow', label: 'Tomorrow', count: dispatchTomorrow.length },
            { key: 'Week', label: 'This Week', count: dispatchWeek.length }
          ].map((tab) => (
            <button
              key={tab.key}
              className={`dispatch-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key as any)}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        <div className="dispatch-tab-content">
          {currentList.length === 0 ? (
            <div className="text-center py-12 text-stone-400 text-xs font-sans">
              No dispatches scheduled for this period.
            </div>
          ) : (
            <div className="space-y-6">
              {currentList.map((order: any) => {
                const item = order.items?.[0] || order;
                const dDate = getDispatchDate(order);
                const dateParts = formatDateForDisplay(dDate || todayKey);
                
                const actualDeposit = Number(order.depositHeld ?? order.deposit ?? item?.deposit ?? order.securityDeposit ?? 0);
                const depositNeeded = actualDeposit > 0;
                const depositCollected = order.depositStatus === 'Held' || order.depositStatus === 'Released' || order.depositStatus === 'Partially Released' || order.paymentStatus === 'Paid';
                const pieces = order.items?.length || item.quantity || 1;
                const rentalDates = item.rentalStartDate ? `${item.rentalStartDate} – ${item.rentalEndDate}` : 'Dates missing';
                const pName = item.productName || order.productName || 'Unknown Product';
                const pDesigner = item.designer || order.designer || 'Unknown';
                const oId = order.orderId || order.id || order._id;
                
                const courier = item.dispatch?.courierPartner || order.dispatchDetails?.courierPartner || 'TBD';
                const tracking = item.dispatch?.trackingNumber || order.dispatchDetails?.trackingNumber || '';
                
                return (
                  <div key={order.id}>
                    <div className="dispatch-card">
                      <div className="dispatch-card-date">
                        <span className="day">{dateParts.day}</span>
                        <span className="month">{dateParts.month}</span>
                      </div>

                      <div className="dispatch-card-info">
                        <h3>
                          {pName} — {pDesigner}
                          {pieces > 1 && <span className="pieces-badge">{pieces} PIECES</span>}
                        </h3>
                        <p>
                          {oId} · {order.customerName} · {(order.address || order.customerCity || "").substring(0, 20)}... · {rentalDates} · Size: {item.size || "M"} · Dep: ₹{Number(actualDeposit).toLocaleString("en-IN")}
                        </p>

                        <p>
                          Courier: {courier} · Tracking: {!tracking ? <span className="tracking-pending">awaiting AWB</span> : tracking}
                        </p>
                      </div>

                      <div className="dispatch-card-actions">
                        <button 
                          className="btn-whatsapp flex items-center" 
                          onClick={() => handleWhatsApp(order.customerPhone, order.customerName)}
                        >
                          <WhatsAppIcon /> WhatsApp {order.customerName?.split(' ')[0]}
                        </button>
                        <button 
                          className="btn-outline"
                          onClick={() => {
                            setSelectedOrderId(order.id || order._id);
                            setView(`order_detail:${order.id || order._id}`);
                          }}
                        >
                          View Order →
                        </button>
                        <button 
                          className="btn-outline"
                          onClick={handlePrintLabel}
                        >
                          Print Label
                        </button>
                        
                        {order.status === 'Confirmed' && (
                          <button 
                            className="btn-mark-dispatched"
                            onClick={() => handleMarkDispatched(order, depositNeeded, depositCollected)}
                          >
                            Mark Dispatched
                          </button>
                        )}
                      </div>
                    </div>

                    {depositNeeded && !depositCollected && (
                      <DepositWarning amount={actualDeposit} />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
