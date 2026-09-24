// src/components/products/tabs/AvailabilityCalendarTab.tsx

import React, { useMemo, useState } from 'react';
import { Product } from '../../../types';
import { CalendarDays, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import * as productSectionsApi from '../../../services/productSectionsApi';

interface AvailabilityCalendarTabProps {
  editingProduct: Product | null;
  onUpdateProduct: (product: Product) => void | Promise<void>;
  loading?: boolean;
  onOpenGlobalCalendar?: () => void;
  onViewOrder?: (orderId: string) => void;
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

export function AvailabilityCalendarTab({
  editingProduct,
  onUpdateProduct,
  loading = false,
  onOpenGlobalCalendar,
  onViewOrder,
}: AvailabilityCalendarTabProps) {
  const today = useMemo(() => new Date(), []);

  const initialAnchor = useMemo(() => {
    const firstBooking = editingProduct?.bookingHistory?.[0] as any;
    if (firstBooking?.startDate) {
      const d = new Date(firstBooking.startDate);
      if (!isNaN(d.getTime())) return d;
    }
    return today;
  }, [editingProduct, today]);

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

  if (!editingProduct) {
    return <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm"><p className="text-stone-400 text-center py-8">No product selected</p></div>;
  }

  const preBufferDays = (editingProduct as any).preRentalBufferDays ?? DEFAULT_PRE_BUFFER_DAYS;
  const postBufferDays = (editingProduct as any).postRentalBufferDays ?? DEFAULT_POST_BUFFER_DAYS;
  const bookingHistory = (editingProduct.bookingHistory || []) as any[];
  const blockedDates = editingProduct.blockedDates || [];

  const activeBookings = bookingHistory.filter(h => h.startDate && h.endDate).map(h => ({ ...h, start: new Date(h.startDate), end: new Date(h.endDate) }));
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
      let type: DayType = 'available';
      let label: string | undefined;

      const manualBlock = blockedDates.find(b => date >= new Date(b.from) && date <= new Date(b.to));
      const rental = activeBookings.find(b => date >= b.start && date <= b.end);
      const inBuffer = activeBookings.some(b => {
        const preStart = addDays(b.start, -preBufferDays);
        const preEnd = addDays(b.start, -1);
        const postStart = addDays(b.end, 1);
        const postEnd = addDays(b.end, postBufferDays);
        return (date >= preStart && date <= preEnd) || (date >= postStart && date <= postEnd);
      });

      if (date < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
        type = 'muted';
      } else if (manualBlock) {
        type = 'blocked';
      } else if (rental) {
        type = 'rental'; label = initialsFromName(rental.customerName || '');
      } else if (inBuffer) {
        type = 'buffer';
      } else { type = 'available'; }

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

  // --- Actions ---
  const resetForm = () => { setBlockFrom(''); setBlockTo(''); setCustomerName(''); setWhatsappNumber(''); setCity(''); setChannel(CHANNEL_OPTIONS[0]); setListerSplit(45); setSplitNote(''); };
  const handleBlockManualDates = () => {
    if (!blockFrom || !blockTo) { alert('Please choose a from and to date.'); return; }
    const updated = { ...editingProduct, blockedDates: [...blockedDates, { from: blockFrom, to: blockTo, reason: reasonMeta.label }] };
    onUpdateProduct(updated); resetForm();
  };
  const handleCreateExternalOrder = async () => {
    if (!blockFrom || !blockTo || !customerName || !whatsappNumber) { alert('From date, to date, customer name and WhatsApp number are required.'); return; }
    setSubmitting(true);
    try {
      await productSectionsApi.addExternalBooking(editingProduct.id, { orderId: '', customerName, startDate: blockFrom, endDate: blockTo, amount: 0, whatsappNumber, city, channel, listerSplitPercent: listerSplit, splitNote } as any);
      const calendar = await productSectionsApi.getCalendar(editingProduct.id);
      onUpdateProduct({ ...editingProduct, blockedDates: calendar.blockedDates || [], bookingHistory: calendar.bookingHistory || [] });
      resetForm();
    } catch (error) { alert(error instanceof Error ? error.message : 'Unable to reserve these dates'); } finally { setSubmitting(false); }
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

      {/* ✅ EXACT PDF LAYOUT: Grid divides screen into Big Left (2/3) & Right Details (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ================= LEFT SIDE: Main Calendar ================= */}
        <div className="lg:col-span-2 bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-4">
          <div className="flex items-start justify-between">
            <div><h3 className="font-serif font-bold text-stone-900 text-sm">{editingProduct.name}</h3>
              <p className="text-xs text-stone-400">{editingProduct.designer} &middot; {(editingProduct as any).sku}</p></div>
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

        {/* ================= RIGHT SIDE: PDF Jaisa Right Panel ================= */}
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
                    return (
                      <div className="text-[11px] text-stone-600 space-y-1">
                        <p><span className="font-semibold text-stone-800">Renter:</span> {booking?.customerName}</p>
                        <p><span className="font-semibold text-stone-800">Order:</span> {booking?.orderId}</p>
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

      {/* ================= BOTTOM: Block Forms ================= */}
      <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-4">
        <h3 className="font-serif font-bold text-stone-900 text-sm">Block Dates &amp; External Bookings</h3>
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
          <div className="space-y-3">
            <div className="rounded-md border border-amber-200/70 bg-amber-50/60 p-3"><p className="text-xs text-stone-600">External booking creates an order.</p></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1"><label className="text-stone-500 font-medium text-[10px] uppercase tracking-wide">Customer Name *</label><input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full p-2 bg-white border border-stone-200 rounded text-xs" /></div>
              <div className="space-y-1"><label className="text-stone-500 font-medium text-[10px] uppercase tracking-wide">WhatsApp Number *</label><input type="text" value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} className="w-full p-2 bg-white border border-stone-200 rounded text-xs" /></div>
            </div>
            {/* Baaki form fields jaisa aapke paas hai */}
          </div>
        )}
        <button type="button" onClick={isExternalBooking ? handleCreateExternalOrder : handleBlockManualDates} disabled={submitting} className="rounded-md bg-amber-700/90 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2.5 transition disabled:opacity-50">
          {isExternalBooking ? (submitting ? 'Reserving...' : 'Reserve Dates & Create Order') : 'Block These Dates'}
        </button>
      </div>
    </div>
  );
}