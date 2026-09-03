import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Search, Calendar as CalendarIcon, Info, Eye } from 'lucide-react';
import { Order, Product } from '../types';

interface CalendarViewProps {
  orders: Order[];
  products: Product[];
  setView: (view: string) => void;
  setSelectedOrderId: (id: string) => void;
}

export default function CalendarView({ orders, products, setView, setSelectedOrderId }: CalendarViewProps) {
  const [activeTab, setActiveTab] = useState<'Month' | 'Agenda' | 'Gantt'>('Month');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 2, 1)); // Default to March 2026 matching the video
  const [hoveredBooking, setHoveredBooking] = useState<Order | null>(null);

  // Month rendering utils
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Get total days in month
  const totalDays = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  // Create array for grid days
  const daysArray: (number | null)[] = [];
  for (let i = 0; i < firstDayIndex; i++) {
    daysArray.push(null);
  }
  for (let i = 1; i <= totalDays; i++) {
    daysArray.push(i);
  }

  const getBookingsForDay = (dayNum: number) => {
    if (!dayNum) return [];
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    return orders.filter(o => {
      if (!o.rentalStartDate || !o.rentalEndDate) return false;
      const matchesSearch = searchQuery === '' || 
        (o.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
        (o.productName || '').toLowerCase().includes(searchQuery.toLowerCase());
      return dateStr >= o.rentalStartDate && dateStr <= o.rentalEndDate && matchesSearch;
    });
  };

  const getProductGanttBookings = (prodId: string) => {
    return orders.filter(o => o.productId === prodId && o.rentalStartDate && o.rentalEndDate);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-serif text-stone-900 font-medium">Rental Calendar</h2>
        <p className="text-xs text-stone-500 mt-1">
          Complete operational calendar view. Click any block or calendar entry to open individual order workflows.
        </p>
      </div>

      {/* Tabs and Controls Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-lg border border-stone-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex bg-stone-100 p-0.5 rounded border border-stone-200/50">
            {(['Month', 'Agenda', 'Gantt'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 text-xs font-semibold rounded cursor-pointer transition ${
                  activeTab === tab 
                    ? 'bg-white text-stone-900 shadow-sm font-bold' 
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Month Navigator */}
          <div className="flex items-center gap-2">
            <button 
              onClick={prevMonth}
              className="p-1 bg-stone-50 border border-stone-200 hover:bg-stone-100 rounded cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4 text-stone-600" />
            </button>
            <span className="text-xs font-bold text-stone-700 min-w-[100px] text-center font-serif">
              {currentDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
            </span>
            <button 
              onClick={nextMonth}
              className="p-1 bg-stone-50 border border-stone-200 hover:bg-stone-100 rounded cursor-pointer"
            >
              <ChevronRight className="h-4 w-4 text-stone-600" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-stone-400" />
          <input
            type="text"
            placeholder="Search calendar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#fcf9f5] border border-stone-200 rounded text-xs outline-none focus:border-[#c5a880]"
          />
        </div>
      </div>

      {/* Main Calendar Containers */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Side: Dynamic Display area based on selected tab */}
        <div className="lg:col-span-3 bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm relative overflow-hidden min-h-[480px]">
          
          {activeTab === 'Month' && (
            <div className="overflow-x-auto pb-2">
              <div className="space-y-4 min-w-[600px] lg:min-w-0">
                {/* Day names */}
                <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-sans font-bold text-stone-400 uppercase tracking-widest border-b border-stone-100 pb-2">
                  <span>Sun</span>
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                </div>

                {/* Grid Days */}
                <div className="grid grid-cols-7 gap-2">
                  {daysArray.map((day, idx) => {
                    const dayBookings = day ? getBookingsForDay(day) : [];
                    return (
                      <div 
                        key={idx} 
                        className={`min-h-[70px] p-1.5 border border-stone-50 rounded flex flex-col justify-between transition-colors ${
                          day ? 'bg-white hover:bg-[#fcf9f5]' : 'bg-stone-50/50 border-none'
                        }`}
                      >
                        <span className={`text-[10px] font-semibold text-stone-400 ${dayBookings.length > 0 ? 'text-stone-800' : ''}`}>
                          {day || ''}
                        </span>
                        
                        {/* Booking strips */}
                        <div className="space-y-1 mt-1">
                          {dayBookings.slice(0, 2).map(b => (
                            <div 
                              key={b.id}
                              onClick={() => {
                                setSelectedOrderId(b.id);
                                setView(`order_detail:${b.id}`);
                              }}
                              onMouseEnter={() => setHoveredBooking(b)}
                              onMouseLeave={() => setHoveredBooking(null)}
                              className={`p-1 text-[8px] font-semibold rounded cursor-pointer truncate uppercase font-sans border transition ${
                                b.status === 'Returned' || b.status === 'Complete'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-100 hover:bg-emerald-100'
                                  : b.status === 'Shipped' || b.status === 'Dispatched'
                                  ? 'bg-blue-50 text-blue-800 border-blue-100 hover:bg-blue-100'
                                  : 'bg-amber-50 text-amber-800 border-amber-100 hover:bg-amber-100'
                              }`}
                            >
                              {b.customerName.split(' ')[0]} - {b.productName.split(' ')[0]}
                            </div>
                          ))}
                          {dayBookings.length > 2 && (
                            <div className="text-[8px] font-bold text-stone-400 text-center">
                              + {dayBookings.length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Agenda' && (
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-stone-900 text-sm border-b border-stone-100 pb-2">Upcoming Rental Bookings</h3>
              <div className="space-y-3 font-sans text-xs">
                {orders.filter(o => o.rentalStartDate).map(o => (
                  <div 
                    key={o.id}
                    onClick={() => {
                      setSelectedOrderId(o.id);
                      setView(`order_detail:${o.id}`);
                    }}
                    className="p-4 bg-[#fcf9f5] border border-stone-100 rounded-md flex items-center justify-between hover:border-[#c5a880] cursor-pointer transition"
                  >
                    <div className="flex gap-4 items-center">
                      <div className="p-2 bg-white rounded border border-stone-100 text-[#c5a880]">
                        <CalendarIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="font-bold text-stone-800 text-sm">{o.productName}</span>
                        <p className="text-[11px] text-stone-400 mt-0.5">Renter: {o.customerName} | Status: <span className="font-semibold">{o.status}</span></p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-stone-800">
                        {new Date(o.rentalStartDate!).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - {new Date(o.rentalEndDate!).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <p className="text-[10px] text-stone-400 mt-1 font-mono">ID: {o.id}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Gantt' && (
            <div className="space-y-6 font-sans">
              <h3 className="font-serif font-bold text-stone-900 text-sm border-b border-stone-100 pb-2">Product Rental Timeline Grid</h3>
              
              <div className="space-y-4">
                {products.map(prod => {
                  const prodBookings = getProductGanttBookings(prod.id);
                  return (
                    <div key={prod.id} className="flex flex-col sm:grid sm:grid-cols-4 gap-2 sm:gap-4 items-stretch sm:items-center border-b border-stone-50 pb-3">
                      <div className="sm:col-span-1">
                        <span className="font-semibold text-stone-800 text-xs block truncate">{prod.name}</span>
                        <span className="text-[10px] text-stone-400 font-mono block">{prod.designer}</span>
                      </div>
                      <div className="sm:col-span-3 relative h-10 bg-stone-50 rounded border border-stone-100/50">
                        {prodBookings.map(b => (
                          <div
                            key={b.id}
                            onClick={() => {
                              setSelectedOrderId(b.id);
                              setView(`order_detail:${b.id}`);
                            }}
                            className="absolute top-2 bottom-2 bg-[#fcf9f5] hover:bg-[#f6eee2] border border-[#c5a880] rounded px-2 py-0.5 text-[9px] font-semibold text-stone-700 flex items-center justify-between cursor-pointer truncate uppercase font-sans"
                            style={{
                              left: `${(Number(b.rentalStartDate!.split('-')[2]) / 31) * 100}%`,
                              right: `${(1 - (Number(b.rentalEndDate!.split('-')[2]) / 31)) * 100}%`
                            }}
                          >
                            <span>{b.customerName.split(' ')[0]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Right Side: Legend & Tooltip Card */}
        <div className="space-y-6 select-none text-xs font-sans">
          
          {/* Tooltip Card */}
          <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-4 min-h-[220px] flex flex-col justify-between">
            <div>
              <h3 className="font-serif font-bold text-stone-900 text-sm border-b border-stone-100 pb-3 flex items-center gap-2">
                <Info className="h-4 w-4 text-[#c5a880]" />
                <span>Selected Booking</span>
              </h3>
              
              {hoveredBooking ? (
                <div className="space-y-3 mt-3">
                  <div>
                    <span className="text-stone-400 uppercase text-[9px] font-bold tracking-wider">Customer</span>
                    <p className="font-semibold text-stone-800">{hoveredBooking.customerName}</p>
                    <p className="text-[10px] text-stone-400 mt-0.5">{hoveredBooking.customerEmail}</p>
                  </div>
                  <div>
                    <span className="text-stone-400 uppercase text-[9px] font-bold tracking-wider">Product / Rent</span>
                    <p className="font-semibold text-stone-800">{hoveredBooking.productName}</p>
                    <p className="text-[10px] text-[#c5a880] mt-0.5">Value: ₹{Number(hoveredBooking.amount || 0).toLocaleString('en-IN')} | Deposit: ₹{Number(hoveredBooking.deposit || 0).toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <span className="text-stone-400 uppercase text-[9px] font-bold tracking-wider">Rental Dates</span>
                    <p className="font-semibold text-stone-800">
                      {new Date(hoveredBooking.rentalStartDate!).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - {new Date(hoveredBooking.rentalEndDate!).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-stone-400 text-xs mt-3">
                  Hover or click any reservation strip in the calendar to load quick info.
                </div>
              )}
            </div>

            {hoveredBooking && (
              <button
                onClick={() => {
                  setSelectedOrderId(hoveredBooking.id);
                  setView(`order_detail:${hoveredBooking.id}`);
                }}
                className="w-full py-2 bg-[#1e1412] hover:bg-[#2c1d1a] text-white rounded text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Go to Order</span>
              </button>
            )}
          </div>

          {/* Color Key */}
          <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-3">
            <h4 className="font-serif font-bold text-stone-900 text-xs border-b border-stone-150 pb-2">Status Codes</h4>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="h-3.5 w-3.5 rounded bg-emerald-50 border border-emerald-100" />
                <span className="text-stone-600 font-medium text-[11px]">Returned / Complete (Grade A/B)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3.5 w-3.5 rounded bg-blue-50 border border-blue-100" />
                <span className="text-stone-600 font-medium text-[11px]">In Transit / Dispatched</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3.5 w-3.5 rounded bg-amber-50 border border-amber-100" />
                <span className="text-stone-600 font-medium text-[11px]">Confirmed / Awaiting pickup</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
