import React, { useState } from 'react';
import { Search, Filter, Calendar as CalendarIcon, Eye, Plus } from 'lucide-react';
import { Order } from '../types';

interface OrdersViewProps {
  orders: Order[];
  setView: (view: string) => void;
  setSelectedOrderId: (id: string) => void;
  onCreateMockOrder?: () => void;
}

export default function OrdersView({ orders, setView, setSelectedOrderId, onCreateMockOrder }: OrdersViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [selectedMode, setSelectedMode] = useState('All Modes');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Calculate order metrics
  const totalOrders = orders.length;
  const rentalsToday = orders.filter(o => o.mode === 'Rental' && o.status === 'Shipped').length || 1;
  const depositsHeld = orders
    .filter(o => o.mode === 'Rental' && (o.status === 'Confirmed' || o.status === 'Dispatched' || o.status === 'Shipped' || o.status === 'Delivered'))
    .reduce((sum, o) => sum + o.deposit, 0);
  const mtdRevenue = orders.reduce((sum, o) => sum + o.amount, 0);

  // Filter logic
  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.productName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'All Statuses' || o.status === selectedStatus;
    const matchesMode = selectedMode === 'All Modes' || o.mode === selectedMode;

    let matchesDates = true;
    if (startDate && o.rentalStartDate) {
      matchesDates = matchesDates && o.rentalStartDate >= startDate;
    }
    if (endDate && o.rentalEndDate) {
      matchesDates = matchesDates && o.rentalEndDate <= endDate;
    }

    return matchesSearch && matchesStatus && matchesMode && matchesDates;
  });

  const statuses = ['All Statuses', 'Confirmed', 'Dispatched', 'Shipped', 'Delivered', 'Return Sent', 'Returned', 'Complete', 'Processed'];
  const modes = ['All Modes', 'Rental', 'Preloved', 'Buy'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif text-stone-900 font-medium">Orders</h2>
          <p className="text-xs text-stone-500 mt-1">
            Accept online and walking bookings. Manual orders can be created for any client.
          </p>
        </div>
        {onCreateMockOrder && (
          <button 
            onClick={onCreateMockOrder}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#1e1412] text-white hover:bg-[#2e1f1c] text-xs font-semibold rounded cursor-pointer transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Create Order</span>
          </button>
        )}
      </div>

      {/* Orders Metrics Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#fcf9f5] p-4 rounded-lg border border-stone-200/60">
        <div className="p-3 bg-white rounded border border-stone-100">
          <p className="text-[10px] text-stone-400 font-sans font-bold uppercase tracking-widest">Orders (MTD)</p>
          <h4 className="text-xl font-serif text-stone-900 font-bold mt-1">{totalOrders}</h4>
          <span className="text-[9px] text-stone-400">+2 from last month</span>
        </div>
        <div className="p-3 bg-white rounded border border-stone-100">
          <p className="text-[10px] text-stone-400 font-sans font-bold uppercase tracking-widest">Rentals Today</p>
          <h4 className="text-xl font-serif text-stone-900 font-bold mt-1">{rentalsToday}</h4>
          <span className="text-[9px] text-[#c5a880] font-medium">1 in dispatch queue</span>
        </div>
        <div className="p-3 bg-white rounded border border-stone-100">
          <p className="text-[10px] text-stone-400 font-sans font-bold uppercase tracking-widest">Deposits Held</p>
          <h4 className="text-xl font-serif text-stone-900 font-bold mt-1">₹{depositsHeld.toLocaleString('en-IN')}</h4>
          <span className="text-[9px] text-amber-600 font-medium">Holding for returns</span>
        </div>
        <div className="p-3 bg-white rounded border border-stone-100">
          <p className="text-[10px] text-stone-400 font-sans font-bold uppercase tracking-widest">Revenue (MTD)</p>
          <h4 className="text-xl font-serif text-stone-900 font-bold mt-1">₹{mtdRevenue.toLocaleString('en-IN')}</h4>
          <span className="text-[9px] text-green-600 font-medium">+24% vs target</span>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded-lg border border-stone-200/80 shadow-sm flex flex-col md:flex-row gap-3 items-center">
        
        {/* Search */}
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search order ID, customer, product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880] outline-none transition"
          />
        </div>

        {/* Status Dropdown */}
        <div className="w-full md:w-44">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs font-medium text-stone-700 focus:border-[#c5a880] outline-none"
          >
            {statuses.map(s => (
              <option key={s} value={s}>{s === 'All Statuses' ? 'All Statuses' : s}</option>
            ))}
          </select>
        </div>

        {/* Mode Dropdown */}
        <div className="w-full md:w-36">
          <select
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value)}
            className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs font-medium text-stone-700 focus:border-[#c5a880] outline-none"
          >
            {modes.map(m => (
              <option key={m} value={m}>{m === 'All Modes' ? 'All Modes' : m}</option>
            ))}
          </select>
        </div>

        {/* Date Inputs */}
        <div className="flex w-full md:w-auto items-center gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs text-stone-600 outline-none w-full md:w-32"
            title="Start Date"
          />
          <span className="text-stone-400 text-xs">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs text-stone-600 outline-none w-full md:w-32"
            title="End Date"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border border-stone-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 text-stone-400 font-sans uppercase font-bold text-[10px] border-b border-stone-150 tracking-wider">
                <th className="px-5 py-3">Order ID</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">Mode</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Rental Dates</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-600">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-stone-400 font-sans">
                    No orders found matching your search.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr 
                    key={order.id} 
                    className="hover:bg-[#fcf9f5] transition-colors"
                  >
                    <td className="px-5 py-3.5 font-mono text-stone-400">{order.id}</td>
                    <td className="px-5 py-3.5">
                      <div>
                        <span className="font-semibold text-stone-800">{order.customerName}</span>
                        <p className="text-[10px] text-stone-400 mt-0.5">{order.customerEmail}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 max-w-[150px] truncate">
                      <span className="font-medium text-stone-800">{order.productName}</span>
                      <p className="text-[10px] text-[#c5a880] font-sans mt-0.5">{order.designer}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 text-[9px] rounded-full uppercase tracking-wider font-semibold font-sans ${
                        order.mode === 'Rental' 
                          ? 'bg-amber-50 text-amber-700 border border-amber-100' 
                          : order.mode === 'Preloved' 
                          ? 'bg-purple-50 text-purple-700 border border-purple-100'
                          : 'bg-teal-50 text-teal-700 border border-teal-100'
                      }`}>
                        {order.mode}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div>
                        <span className="font-semibold text-stone-900">₹{Number(order.amount || 0).toLocaleString('en-IN')}</span>
                        {(order.deposit || 0) > 0 && (
                          <p className="text-[9px] text-stone-400 mt-0.5">+ ₹{Number(order.deposit || 0).toLocaleString('en-IN')} Dep.</p>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-sans">
                      {order.rentalStartDate && order.rentalEndDate ? (
                        <div className="flex flex-col">
                          <span className="font-medium text-stone-700">
                            {new Date(order.rentalStartDate).toLocaleDateString('en-GB', {day: 'numeric', month: 'short'})} - {new Date(order.rentalEndDate).toLocaleDateString('en-GB', {day: 'numeric', month: 'short'})}
                          </span>
                          <span className="text-[9px] text-stone-400 mt-0.5">4 nights</span>
                        </div>
                      ) : (
                        <span className="text-stone-400 font-medium">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase ${
                        order.status === 'Returned' || order.status === 'Complete' || order.status === 'Processed'
                          ? 'bg-green-50 text-green-700 border border-green-100'
                          : order.status === 'Shipped' || order.status === 'Dispatched'
                          ? 'bg-blue-50 text-blue-700 border border-blue-100'
                          : 'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right shrink-0">
                      <button
                        onClick={() => {
                          setSelectedOrderId(order.id);
                          setView(`order_detail:${order.id}`);
                        }}
                        className="px-2.5 py-1.5 border border-stone-200 text-stone-600 hover:text-stone-900 hover:border-[#c5a880] rounded hover:bg-stone-50 transition cursor-pointer inline-flex items-center gap-1 text-[11px] font-medium"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer info */}
        <div className="px-5 py-3.5 border-t border-stone-100 bg-stone-50 flex items-center justify-between text-stone-500 font-sans text-[11px]">
          <span>Showing {filteredOrders.length} of {orders.length} orders</span>
          <div className="flex gap-2">
            <button className="px-2.5 py-1 border border-stone-200 rounded bg-white text-stone-600 cursor-not-allowed">Previous</button>
            <button className="px-2.5 py-1 border border-stone-200 rounded bg-white text-stone-600 cursor-not-allowed">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
