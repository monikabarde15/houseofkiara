import React, { useState } from 'react';
import { Eye, Truck, Check, HelpCircle } from 'lucide-react';
import { Order } from '../types';

interface DispatchViewProps {
  orders: Order[];
  setView: (view: string) => void;
  setSelectedOrderId: (id: string) => void;
  onUpdateOrder: (updatedOrder: Order) => void;
}

export default function DispatchView({ orders, setView, setSelectedOrderId, onUpdateOrder }: DispatchViewProps) {
  const [activeTab, setActiveTab] = useState<'Today' | 'Tomorrow' | 'Week'>('Week');

  // filter schedules
  const dispatchToday = orders.filter(o => o.status === 'Confirmed'); // Representing today's awaiting dispatch
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowKey = tomorrow.toISOString().split('T')[0];
  const dispatchTomorrow = orders.filter(o => o.status === 'Confirmed' && o.dispatchDetails?.date === tomorrowKey);
  const dispatchWeek = orders.filter(o => o.status === 'Confirmed' || o.status === 'Dispatched' || o.status === 'Shipped');

  const handleMarkDispatched = (order: Order) => {
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
    alert(`Order ${order.id} marked as Dispatched! Tracking number auto-generated.`);
  };

  const getCountLabel = (tab: 'Today' | 'Tomorrow' | 'Week') => {
    if (tab === 'Today') return dispatchToday.length;
    if (tab === 'Tomorrow') return dispatchTomorrow.length;
    return dispatchWeek.length;
  };

  const currentList = activeTab === 'Today' ? dispatchToday : activeTab === 'Tomorrow' ? dispatchTomorrow : dispatchWeek;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-serif text-stone-900 font-medium">Dispatch Schedule</h2>
        <p className="text-xs text-stone-500 mt-1">
          Everything leaving the studio today, tomorrow, and this week. Mark dispatches, print labels, and jump to any order.
        </p>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-stone-200 gap-1 select-none font-sans text-xs font-semibold">
        {(['Today', 'Tomorrow', 'Week'] as const).map(tab => {
          const labels = {
            Today: `Today (${getCountLabel('Today')})`,
            Tomorrow: `Tomorrow (${getCountLabel('Tomorrow')})`,
            Week: `This Week (${getCountLabel('Week')})`
          };
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 border-b-2 transition cursor-pointer ${
                isActive 
                  ? 'border-[#c5a880] text-stone-900 font-bold' 
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              {labels[tab]}
            </button>
          );
        })}
      </div>

      {/* Dispatch schedule list */}
      <div className="bg-white rounded-lg border border-stone-200/80 shadow-sm overflow-hidden p-5">
        {currentList.length === 0 ? (
          <div className="text-center py-12 text-stone-400 text-xs font-sans">
            No dispatches scheduled for this period.
          </div>
        ) : (
          <div className="space-y-4 font-sans text-xs">
            {currentList.map((order) => (
              <div 
                key={order.id}
                className="p-4 bg-[#fcf9f5] border border-stone-100 rounded-md flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex gap-4 items-start">
                  <div className="p-2.5 bg-white rounded border border-stone-150 text-[#c5a880] shrink-0">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-850 text-sm">{order.productName}</span>
                      <span className="text-[10px] text-stone-400 font-mono font-bold">({order.id})</span>
                    </div>
                    <p className="text-stone-600 font-medium">
                      Customer: {order.customerName} | Mobile: {order.customerPhone}
                    </p>
                    <p className="text-[11px] text-stone-400">
                      Destination Address: {order.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 md:self-center">
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

                  {order.status === 'Confirmed' && (
                    <button
                      onClick={() => handleMarkDispatched(order)}
                      className="px-3 py-1.5 bg-[#1e1412] hover:bg-[#2c1d1a] text-white rounded text-xs font-semibold flex items-center gap-1 cursor-pointer transition"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Mark as Dispatched</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
