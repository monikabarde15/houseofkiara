// src/components/products/tabs/AvailabilityCalendarTab.tsx


import React, { useMemo, useState } from 'react';
import { Product } from '../../../types';
import { CalendarDays, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import * as productSectionsApi from '../../../services/productSectionsApi';
import toast from 'react-hot-toast';

interface AvailabilityCalendarTabProps {
  editingProduct: Product | null;
  onUpdateProduct: (product: Product) => void | Promise<void>;
  loading?: boolean;
  onOpenGlobalCalendar?: () => void;
  onViewOrder?: (orderId: string) => void;
  orders?: any[];
  onAddOrder?: (newOrder: any) => void;
}

const REASON_OPTIONS = [
  { value: 'external_instagram', label: 'External booking (Instagram / WhatsApp)', isExternal: true },
  { value: 'maintenance', label: 'Maintenance', isExternal: false },
  { value: 'alterations', label: 'Alterations', isExternal: false },
  { value: 'cleaning', label: 'Cleaning (beyond automatic buffer)', isExternal: false },
  { value: 'photoshoot', label: 'Photoshoot', isExternal: false },
  { value: 'other', label: 'Other manual block', isExternal: false },
];

const CHANNEL_OPTIONS = ['Instagram', 'WhatsApp', 'Walk-in', 'Phone', 'Website'];

const DEFAULT_PRE_BUFFER_DAYS = 2;
const DEFAULT_POST_BUFFER_DAYS = 3;

function initialsFromName(name: string) {
  return name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]?.toUpperCase()).join('');
}

function toISODate(d: Date) { return d.toISOString().slice(0, 10); }
function addDays(d: Date, n: number) { const copy = new Date(d); copy.setDate(copy.getDate() + n); return copy; }
function isSameDay(a: Date, b: Date) { return toISODate(a) === toISODate(b); }

type DayType = 'muted' | 'available' | 'buffer' | 'rental' | 'blocked';
interface DayInfo { date: Date; type: DayType; label?: string; isToday: boolean; }

function parseToStartOfDay(d: Date | string | number | null | undefined): Date {
  if (!d) return new Date(NaN);
  if (typeof d === 'string') {
    const match = d.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      return new Date(parseInt(match[1], 10), parseInt(match[2], 10) - 1, parseInt(match[3], 10));
    }
  }
  const dateObj = new Date(d);
  if (isNaN(dateObj.getTime())) return new Date(NaN);
  return new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
}

export function AvailabilityCalendarTab({
  editingProduct,
  onUpdateProduct,
  loading = false,
  onOpenGlobalCalendar,
  onViewOrder,
  orders = [],
  onAddOrder,
}: AvailabilityCalendarTabProps) {
  const [localProduct, setLocalProduct] = useState<Product>(editingProduct!);

  React.useEffect(() => {
    if (editingProduct) {
      setLocalProduct(editingProduct);
    }
  }, [editingProduct]);

  const activeProduct = localProduct || editingProduct;
  const today = useMemo(() => parseToStartOfDay(new Date()), []);

  const initialAnchor = useMemo(() => {
    const firstBooking = activeProduct?.bookingHistory?.[0] as any;
    if (firstBooking?.startDate) {
      const d = parseToStartOfDay(firstBooking.startDate);
      if (!isNaN(d.getTime())) return d;
    }
    return today;
  }, [activeProduct, today]);

  // State for BIG Calendar (Left Side)
  const [viewMonth, setViewMonth] = useState(initialAnchor.getMonth());
  const [viewYear, setViewYear] = useState(initialAnchor.getFullYear());

  // State for SMALL Calendar (Right Side)
  const [smallViewMonth, setSmallViewMonth] = useState(today.getMonth());
  const [smallViewYear, setSmallViewYear] = useState(today.getFullYear());

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [blockFrom, setBlockFrom] = useState('');
  const [blockTo, setBlockTo] = useState('');
  const [reason, setReason] = useState(REASON_OPTIONS[0].value);
  const [customerName, setCustomerName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [city, setCity] = useState('');
  const [channel, setChannel] = useState(CHANNEL_OPTIONS[0]);
  const [listerSplit, setListerSplit] = useState<number>(45);
  const [splitNote, setSplitNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!activeProduct) {
    return <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm"><p className="text-stone-400 text-center py-8">No product selected</p></div>;
  }

  const rawPre = Number((activeProduct as any).preRentalBufferDays);
  const rawPost = Number((activeProduct as any).postRentalBufferDays);
  const preBufferDays = (!isNaN(rawPre) && rawPre >= 0 && rawPre <= 14) ? rawPre : DEFAULT_PRE_BUFFER_DAYS;
  const postBufferDays = (!isNaN(rawPost) && rawPost >= 0 && rawPost <= 14) ? rawPost : DEFAULT_POST_BUFFER_DAYS;
  const bookingHistory = (activeProduct.bookingHistory || []) as any[];
  const blockedDates = activeProduct.blockedDates || [];

  const activeBookings = useMemo(() => {
    return bookingHistory
      .filter(h => h.startDate && h.endDate)
      .map(h => ({
        ...h,
        start: parseToStartOfDay(h.startDate),
        end: parseToStartOfDay(h.endDate),
      }));
  }, [bookingHistory]);

  const reasonMeta = REASON_OPTIONS.find(r => r.value === reason)!;
  const isExternalBooking = reasonMeta.isExternal;

  // --- Helper to generate days for ANY month ---
  const generateDaysForMonth = (year: number, month: number) => {
    const firstOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startOffset = firstOfMonth.getDay();

    const days: DayInfo[] = [];
    for (let i = 0; i < startOffset; i++) {
      days.push({ date: new Date(NaN), type: 'muted', isToday: false });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const dateStart = parseToStartOfDay(date);
      let type: DayType = 'available';
      let label: string | undefined;

      const manualBlock = blockedDates.find(b => {
        const from = parseToStartOfDay(b.from);
        const to = parseToStartOfDay(b.to);
        return dateStart >= from && dateStart <= to;
      });
      const rental = activeBookings.find(b => dateStart >= b.start && dateStart <= b.end);
      const inBuffer = activeBookings.some(b => {
        const preStart = addDays(b.start, -preBufferDays);
        const preEnd = addDays(b.start, -1);
        const postStart = addDays(b.end, 1);
        const postEnd = addDays(b.end, postBufferDays);
        return (dateStart >= preStart && dateStart <= preEnd) || (dateStart >= postStart && dateStart <= postEnd);
      });

      if (dateStart < today) {
        type = 'muted';
      } else if (rental) {
        type = 'rental';
        label = initialsFromName(rental.customerName || '');
      } else if (manualBlock) {
        type = 'blocked';
      } else if (inBuffer) {
        type = 'buffer';
      } else {
        type = 'available';
      }

      days.push({ date, type, label, isToday: isSameDay(date, today) });
    }
    return { days, monthLabel: firstOfMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) };
  };

  // Generate data for both calendars
  const bigCalendar = generateDaysForMonth(viewYear, viewMonth);
  const smallCalendar = generateDaysForMonth(smallViewYear, smallViewMonth);

  // --- Change Month Handlers ---
  const changeMonth = (delta: number) => {
    let m = viewMonth + delta; let y = viewYear;
    if (m < 0) { m = 11; y -= 1; } if (m > 11) { m = 0; y += 1; }
    setViewMonth(m); setViewYear(y);
  };
  const changeSmallMonth = (delta: number) => {
    let m = smallViewMonth + delta; let y = smallViewYear;
    if (m < 0) { m = 11; y -= 1; } if (m > 11) { m = 0; y += 1; }
    setSmallViewMonth(m); setSmallViewYear(y);
  };

  const dayCellClasses = (type: DayType, isSmall: boolean = false) => {
    const baseSize = isSmall ? 'h-7 text-[9px]' : 'h-10 text-[12px]';
    switch (type) {
      case 'available': return `bg-emerald-100/70 text-emerald-900 hover:bg-emerald-200/70 border border-transparent hover:border-emerald-300 ${baseSize}`;
      case 'rental': return `bg-[#a8492f] text-white font-semibold border border-[#a8492f] ${baseSize}`;
      case 'buffer': return `text-amber-800 border border-stone-200 ${baseSize}`;
      case 'blocked': return `text-stone-600 border border-stone-200 ${baseSize}`;
      default: return `bg-stone-50 text-stone-300 border border-stone-100 ${baseSize}`;
    }
  };

  const dayCellStyle = (type: DayType): React.CSSProperties => {
    if (type === 'buffer') return { backgroundImage: 'repeating-linear-gradient(45deg, #fde9c8, #fde9c8 4px, #fbd9a0 4px, #fbd9a0 8px)' };
    if (type === 'blocked') return { backgroundImage: 'repeating-linear-gradient(45deg, #e7e5e4, #e7e5e4 4px, #d6d3d1 4px, #d6d3d1 8px)' };
    return {};
  };

  // --- Overlap Validation ---
  const checkOverlapError = (fromDateStr: string, toDateStr: string): string | null => {
    const start = parseToStartOfDay(fromDateStr);
    const end = parseToStartOfDay(toDateStr);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 'Please select valid From and To dates.';
    if (end < start) return 'To date cannot be earlier than From date.';

    for (const b of activeBookings) {
      const bStart = parseToStartOfDay(b.startDate || b.start);
      const bEnd = parseToStartOfDay(b.endDate || b.end);
      const bPostEnd = addDays(bEnd, postBufferDays);

      if (start <= bPostEnd && end >= bStart) {
        return `Selected dates overlap with rental for ${b.customerName || 'customer'} (${b.orderId || 'existing order'}) or its cleaning buffer. Only available dates can be booked.`;
      }
    }

    for (const b of blockedDates) {
      const bStart = parseToStartOfDay(b.from);
      const bEnd = parseToStartOfDay(b.to);
      if (start <= bEnd && end >= bStart) {
        return `Selected dates overlap with blocked range (${b.reason || 'Blocked'}). Only available dates can be booked.`;
      }
    }

    return null;
  };

  // --- Actions ---
  const resetForm = () => { setBlockFrom(''); setBlockTo(''); setCustomerName(''); setWhatsappNumber(''); setCity(''); setChannel(CHANNEL_OPTIONS[0]); setListerSplit(45); setSplitNote(''); };
  
  const handleBlockManualDates = async () => {
    if (!blockFrom || !blockTo) { toast.error('Please choose a from and to date.'); return; }
    const overlapErr = checkOverlapError(blockFrom, blockTo);
    if (overlapErr) { toast.error(overlapErr); return; }
    
    setSubmitting(true);
    try {
      const targetId = activeProduct.productId || (activeProduct as any)._id || activeProduct.id;
      const res = await productSectionsApi.addBlockedDate(targetId, { from: blockFrom, to: blockTo, reason: reasonMeta.label });
      const updatedBlockedDates = [...blockedDates, res || { from: blockFrom, to: blockTo, reason: reasonMeta.label }];
      
      const updatedProd = {
        ...activeProduct,
        blockedDates: updatedBlockedDates
      };
      
      setLocalProduct(updatedProd);
      onUpdateProduct(updatedProd);
      resetForm();
      toast.success('Dates blocked successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to block these dates');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateExternalOrder = async () => {
    if (!blockFrom || !blockTo || !customerName || !whatsappNumber) {
      toast.error('From date, to date, customer name and WhatsApp number are required.');
      return;
    }
    const overlapErr = checkOverlapError(blockFrom, blockTo);
    if (overlapErr) { toast.error(overlapErr); return; }
    setSubmitting(true);
    try {
      const targetId = activeProduct.productId || (activeProduct as any)._id || activeProduct.id;
      const res = await productSectionsApi.addExternalBooking(targetId, {
        customerName,
        startDate: blockFrom,
        endDate: blockTo,
        amount: Number(activeProduct.rentalPrice || 8500),
        whatsappNumber,
        city,
        channel,
        listerSplitPercent: listerSplit,
        splitNote
      } as any);

      const resData = res?.data || res;
      const finalOrderId = resData.orderId || resData.bookingEntry?.orderId || resData.order?.id;
      const updatedBookingHistory = resData.bookingHistory || [...(activeProduct.bookingHistory || []), { ...(resData.bookingEntry || resData), orderId: finalOrderId }];
      const updatedBlockedDates = resData.blockedDates || activeProduct.blockedDates || [];
      const updatedExternalBookings = resData.externalBookings || [...(activeProduct.externalBookings || []), { ...(resData.bookingEntry || resData), orderId: finalOrderId }];
      const updatedActivityLog = resData.activityLog || activeProduct.activityLog || [];

      const updatedProd = {
        ...activeProduct,
        blockedDates: updatedBlockedDates,
        bookingHistory: updatedBookingHistory,
        externalBookings: updatedExternalBookings,
        activityLog: updatedActivityLog,
        timesRented: resData.timesRented || (activeProduct.timesRented || 0) + 1
      };

      if (resData.order && onAddOrder) {
        onAddOrder(resData.order);
      }

      // Instant Local State update (No page refresh needed!)
      setLocalProduct(updatedProd);
      onUpdateProduct(updatedProd);

      resetForm();
      toast.success('Reservation saved & order created!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to reserve these dates');
    } finally {
      setSubmitting(false);
    }
  };

  // --- Render ---
  return (
    <div className="space-y-6">
      {/* Auto-block logic banner */}
      <div className="rounded-md border border-amber-200/70 bg-amber-50/60 p-3 flex gap-2">
        <span className="text-amber-500 text-sm leading-none">&#9432;</span>
        <p className="text-xs text-stone-600 leading-relaxed">
          <span className="font-semibold text-stone-800">Auto-block logic:</span> blocked {preBufferDays} days before dispatch and {postBufferDays} days after return.
        </p>
      </div>

      {/* Grid divides screen into Big Left (2/3) & Right Details (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ================= LEFT SIDE: Main Calendar ================= */}
        <div className="lg:col-span-2 bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-serif font-bold text-stone-900 text-sm">{editingProduct.name}</h3>
              <p className="text-xs text-stone-400">{editingProduct.designer} &middot; {(editingProduct as any).sku}</p>
            </div>
            <button type="button" onClick={onOpenGlobalCalendar} className="whitespace-nowrap rounded border border-stone-200 px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50 transition">Global Calendar &rarr;</button>
          </div>

          <div className="flex items-center justify-between">
            <button onClick={() => changeMonth(-1)} className="w-7 h-7 flex items-center justify-center rounded border border-stone-200 text-stone-500 hover:bg-stone-50 transition">&larr;</button>
            <p className="font-serif font-bold text-stone-800 text-sm">{bigCalendar.monthLabel}</p>
            <button onClick={() => changeMonth(1)} className="w-7 h-7 flex items-center justify-center rounded border border-stone-200 text-stone-500 hover:bg-stone-50 transition">&rarr;</button>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center max-w-[500px] mx-auto">
            {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map(d => (<div key={d} className="text-[10px] font-semibold text-stone-400 pb-1">{d}</div>))}
            {bigCalendar.days.map((day, idx) => (
              <button key={idx} disabled={isNaN(day.date.getTime())} onClick={() => setSelectedDate(day.date)}
                className={`relative flex items-center justify-center w-full rounded transition-all ${isNaN(day.date.getTime()) ? 'invisible' : 'cursor-pointer hover:scale-105 shadow-sm'} ${dayCellClasses(day.type)} ${day.isToday ? 'ring-2 ring-stone-800 ring-offset-1' : ''}`} style={dayCellStyle(day.type)}>
                {!isNaN(day.date.getTime()) && (<><span>{day.date.getDate()}</span>{day.label && <span className="absolute -top-1 -right-1 bg-white rounded-full px-1 text-[8px] font-bold text-stone-700 border border-stone-200">{day.label}</span>}</>)}
              </button>
            ))}
          </div>
        </div>

        {/* ================= RIGHT SIDE: Right Panel ================= */}
        <div className="flex flex-col gap-4">

          {/* 1. Availability (Small Calendar) */}
          <div className="bg-white p-4 rounded-lg border border-stone-200/80 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-serif font-bold text-stone-800 text-xs">Availability</h4>
              <div className="flex gap-1">
                <button onClick={() => changeSmallMonth(-1)} className="p-0.5 rounded hover:bg-stone-100 border border-transparent hover:border-stone-200"><ChevronLeft className="w-3 h-3 text-stone-500" /></button>
                <button onClick={() => changeSmallMonth(1)} className="p-0.5 rounded hover:bg-stone-100 border border-transparent hover:border-stone-200"><ChevronRight className="w-3 h-3 text-stone-500" /></button>
              </div>
            </div>
            <p className="text-[10px] text-stone-400 -mt-1">{smallCalendar.monthLabel}</p>

            {/* Small Grid */}
            <div className="grid grid-cols-7 gap-1 text-center mt-2">
              {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map(d => (<div key={d} className="text-[8px] font-semibold text-stone-400 pb-0.5">{d}</div>))}
              {smallCalendar.days.map((day, idx) => (
                <button key={idx} disabled={isNaN(day.date.getTime())} onClick={() => { setSelectedDate(day.date); setViewMonth(day.date.getMonth()); setViewYear(day.date.getFullYear()); }}
                  className={`relative flex items-center justify-center rounded transition-all ${isNaN(day.date.getTime()) ? 'invisible' : 'cursor-pointer hover:opacity-80'} ${dayCellClasses(day.type, true)} ${day.isToday ? 'ring-1 ring-stone-800 ring-offset-1' : ''}`} style={dayCellStyle(day.type)}>
                  {!isNaN(day.date.getTime()) && <span>{day.date.getDate()}</span>}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Selected Date Details */}
          <div className="bg-white p-4 rounded-lg border border-stone-200/80 shadow-sm flex-grow">
            {selectedDate && !isNaN(selectedDate.getTime()) ? (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-stone-700 border-b border-stone-100 pb-1 mb-1">
                  {selectedDate.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long' })}
                </p>
                {(() => {
                  const info = bigCalendar.days.find(d => !isNaN(d.date.getTime()) && isSameDay(d.date, selectedDate));
                  if (!info) return null;
                  if (info.type === 'rental') {
                    const booking = activeBookings.find(b => selectedDate >= b.start && selectedDate <= b.end);
                    const rawOrderId = booking?.orderId || 'HOK-ORD-889';
                    const displayOrderId = rawOrderId.startsWith('HOK-ORD-')
                      ? rawOrderId
                      : rawOrderId.startsWith('EXT-')
                      ? `HOK-ORD-${rawOrderId.replace(/[^0-9]/g, '').slice(-3) || '889'}`
                      : `HOK-ORD-${String(rawOrderId).padStart(3, '0')}`;

                    return (
                      <div className="text-[11px] text-stone-600 space-y-1">
                        <p><span className="font-semibold text-stone-800">Renter:</span> {booking?.customerName}</p>
                        <p><span className="font-semibold text-stone-800">Order:</span> {displayOrderId}</p>
                      </div>
                    );
                  }
                  if (info.type === 'buffer') return <p className="text-[11px] text-amber-700">⏳ Buffer &mdash; Not bookable.</p>;
                  if (info.type === 'blocked') return <p className="text-[11px] text-stone-500">🔒 Manually blocked.</p>;
                  return <p className="text-[11px] text-emerald-700">✅ Available for rental.</p>;
                })()}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-stone-400 py-4">
                <CalendarDays className="w-5 h-5 text-stone-300 mb-1" />
                <p className="text-[11px]">Select a date</p>
              </div>
            )}
          </div>

          {/* 3. Quick Actions */}
          <div className="bg-white p-4 rounded-lg border border-stone-200/80 shadow-sm space-y-2">
            <h4 className="font-serif font-bold text-stone-800 text-xs mb-2">Quick Actions</h4>
            <button onClick={() => window.open(`/product/${editingProduct.urlSlug}`, '_blank')} className="flex items-center gap-2 w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded text-[11px] font-medium text-stone-700 hover:bg-stone-100 transition">
              <ExternalLink className="w-3.5 h-3.5" /> View Live Site
            </button>
            <button onClick={onOpenGlobalCalendar} className="flex items-center gap-2 w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded text-[11px] font-medium text-stone-700 hover:bg-stone-100 transition">
              <CalendarDays className="w-3.5 h-3.5" /> Global Calendar
            </button>
          </div>

        </div>
      </div>

      {/* ================= BOTTOM: Block Forms & External Bookings ================= */}
      <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-4">
        <h3 className="font-serif font-bold text-stone-900 text-sm">Block Dates &amp; External Bookings</h3>
        <p className="text-xs text-stone-500">Block dates for external bookings (Instagram, in-person enquiries), maintenance, alterations, or cleaning beyond the automatic buffer. Blocks apply to the calendar above immediately.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1"><label className="text-stone-500 font-medium text-[10px] uppercase tracking-wide">From Date</label><input type="date" value={blockFrom} onChange={(e) => setBlockFrom(e.target.value)} className="w-full p-2 bg-white border border-stone-200 rounded text-xs" /></div>
          <div className="space-y-1"><label className="text-stone-500 font-medium text-[10px] uppercase tracking-wide">To Date</label><input type="date" value={blockTo} onChange={(e) => setBlockTo(e.target.value)} className="w-full p-2 bg-white border border-stone-200 rounded text-xs" /></div>
        </div>
        <div className="space-y-1"><label className="text-stone-500 font-medium text-[10px] uppercase tracking-wide">Reason</label>
          <select value={reason} onChange={(e) => setReason(e.target.value)} className="w-full p-2 bg-white border border-stone-200 rounded text-xs">
            {REASON_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>

        {isExternalBooking && (
          <div className="space-y-3 pt-2">
            <div className="rounded-md border border-amber-200/70 bg-amber-50/60 p-3"><p className="text-xs text-stone-600 font-medium">An external booking is a real reservation &mdash; HOK reserves these dates by creating an order, so deposit, GST, lister payout and dispatch are all tracked. There is no date-block without an order on this path.</p></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1"><label className="text-stone-500 font-medium text-[10px] uppercase tracking-wide">Customer Name *</label><input type="text" placeholder="As shared on chat" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full p-2 bg-white border border-stone-200 rounded text-xs" /></div>
              <div className="space-y-1"><label className="text-stone-500 font-medium text-[10px] uppercase tracking-wide">WhatsApp Number *</label><input type="text" placeholder="+91 ..." value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} className="w-full p-2 bg-white border border-stone-200 rounded text-xs" /></div>
              <div className="space-y-1"><label className="text-stone-500 font-medium text-[10px] uppercase tracking-wide">City</label><input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} className="w-full p-2 bg-white border border-stone-200 rounded text-xs" /></div>
              <div className="space-y-1"><label className="text-stone-500 font-medium text-[10px] uppercase tracking-wide">Channel</label>
                <select value={channel} onChange={(e) => setChannel(e.target.value)} className="w-full p-2 bg-white border border-stone-200 rounded text-xs">
                  {CHANNEL_OPTIONS.map(ch => <option key={ch} value={ch}>{ch}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1"><label className="text-stone-500 font-medium text-[10px] uppercase tracking-wide">Lister Split % (This Transaction)</label><input type="number" value={listerSplit} onChange={(e) => setListerSplit(Number(e.target.value))} className="w-full p-2 bg-white border border-stone-200 rounded text-xs" /></div>
              <div className="space-y-1"><label className="text-stone-500 font-medium text-[10px] uppercase tracking-wide">Why This % (Internal)</label><input type="text" placeholder="e.g. couture demand - 8th rental, fair condition" value={splitNote} onChange={(e) => setSplitNote(e.target.value)} className="w-full p-2 bg-white border border-stone-200 rounded text-xs" /></div>
            </div>

            <div className="rounded-md border border-stone-200 bg-stone-50 p-3 space-y-1">
              <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Decision Context</p>
              <p className="text-xs text-stone-700">Last split 55% (Rental #{bookingHistory.length} &middot; {bookingHistory[0]?.startDate ? new Date(bookingHistory[0].startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent'}) &middot; piece avg {listerSplit}% &middot; default 45% &middot; condition Excellent &middot; rented {editingProduct.timesRented || bookingHistory.length}&times;</p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-1 pt-2">
          <button type="button" onClick={isExternalBooking ? handleCreateExternalOrder : handleBlockManualDates} disabled={submitting} className="w-fit rounded-md bg-[#8c3523] hover:bg-[#722a1b] text-white text-xs font-bold px-4 py-2.5 transition disabled:opacity-50">
            {isExternalBooking ? (submitting ? 'Reserving...' : 'Reserve Dates & Create Order \u2192') : 'Block These Dates'}
          </button>
          <p className="text-[10px] text-stone-400 font-medium">No manual blocks on this piece &mdash; only automatic buffers apply.</p>
        </div>
      </div>

      {/* ================= ORDER HISTORY FOR THIS PIECE ================= */}
      <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div>
            <h3 className="font-serif font-bold text-stone-900 text-sm">Order History for This Piece</h3>
            <p className="text-xs text-stone-500">Tracked orders, rental periods, revenue, deposit status, and order management.</p>
          </div>
        </div>

        {(() => {
          // Direct matching with Orders list
          const matchedOrders = (orders || []).filter((o: any) => 
            o.productId === editingProduct.id ||
            o.productId === (editingProduct as any)._id ||
            o.productName === editingProduct.name ||
            (bookingHistory || []).some((b: any) => 
              b.orderId === o.id ||
              b.orderId === o.orderNumber ||
              b.orderId === o.orderId ||
              (b.orderId && o.id && b.orderId === o.id)
            )
          );

          const displayList = matchedOrders.length > 0 ? matchedOrders : (bookingHistory.length > 0 ? bookingHistory : []);

          if (displayList.length === 0) {
            return <p className="text-stone-400 text-xs py-4 text-center">No orders recorded for this piece yet.</p>;
          }

          return (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700 border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 text-[10px] uppercase tracking-wider font-semibold text-stone-400 bg-stone-50/50">
                    <th className="py-2.5 px-3">Order ID</th>
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3">Dates</th>
                    <th className="py-2.5 px-3">Revenue</th>
                    <th className="py-2.5 px-3">Deposit</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {displayList.map((item: any, idx: number) => {
                    const displayOrderId = item.orderId || item.id || item.orderNumber || '-';

                    // Lookup from master orders
                    const masterOrder = (orders || []).find((o: any) =>
                      o.id === displayOrderId ||
                      o.orderNumber === displayOrderId ||
                      o.orderId === displayOrderId
                    ) || item;

                    const customerName = masterOrder.customerName || item.customerName || 'Riya Sharma';
                    const startDate = masterOrder.rentalStartDate || masterOrder.startDate || item.startDate;
                    const endDate = masterOrder.rentalEndDate || masterOrder.endDate || item.endDate;
                    const startFmt = startDate ? new Date(startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '10 Sept 2026';
                    const endFmt = endDate ? new Date(endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '14 Sept 2026';
                    const amountVal = Number(masterOrder.amount || masterOrder.totalAmount || item.amount || editingProduct.rentalPrice || 8000);
                    const revenueFmt = `₹${amountVal.toLocaleString('en-IN')}`;
                    const status = masterOrder.status || item.status || 'Confirmed';
                    const deposit = masterOrder.depositStatus || item.depositStatus || (status === 'Returned' ? 'Released' : status === 'Partially Returned' ? 'Held' : 'Pending');

                    return (
                      <tr key={idx} className="hover:bg-stone-50/80 transition">
                        <td className="py-3 px-3">
                          <span className="font-semibold text-stone-900 block">{displayOrderId}</span>
                          <span className="text-[10px] text-stone-400 font-medium block truncate max-w-[140px]">{masterOrder.productName || editingProduct.name}</span>
                        </td>
                        <td className="py-3 px-3 font-medium text-stone-800">{customerName}</td>
                        <td className="py-3 px-3 text-stone-600">{startFmt} &mdash; {endFmt}</td>
                        <td className="py-3 px-3 font-semibold text-stone-900">{revenueFmt}</td>
                        <td className="py-3 px-3">
                          <span className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded ${
                            deposit === 'Released' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            deposit === 'Held' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            'bg-stone-100 text-stone-600'
                          }`}>
                            {deposit}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`inline-block px-2.5 py-1 text-[10px] font-semibold rounded-full uppercase ${
                            status === 'Shipped' || status === 'Dispatched' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                            status === 'Delivered' || status === 'Returned' || status === 'Processed' || status === 'Complete' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                            'bg-amber-50 text-amber-700 border border-amber-100'
                          }`}>
                            {status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => onViewOrder?.(displayOrderId)}
                            className="text-stone-700 hover:text-amber-800 font-semibold text-xs transition"
                          >
                            View &rarr;
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })()}
      </div>
    </div>
  );
}