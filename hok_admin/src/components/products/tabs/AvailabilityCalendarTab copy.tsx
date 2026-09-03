// src/components/products/tabs/AvailabilityCalendarTab.tsx

import React, { useMemo, useState } from 'react';
import { Product } from '../../../types';
import { CalendarDays } from 'lucide-react';
import * as productSectionsApi from '../../../services/productSectionsApi';
import toast from 'react-hot-toast';

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
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase())
    .join('');
}

function toISODate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function addDays(d: Date, n: number) {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + n);
  return copy;
}

function isSameDay(a: Date, b: Date) {
  return toISODate(a) === toISODate(b);
}

type DayType = 'muted' | 'available' | 'buffer' | 'rental' | 'blocked';

interface DayInfo {
  date: Date;
  type: DayType;
  label?: string;
  isToday: boolean;
}

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

  const [viewMonth, setViewMonth] = useState(initialAnchor.getMonth());
  const [viewYear, setViewYear] = useState(initialAnchor.getFullYear());
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
    return (
      <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm">
        <p className="text-stone-400 text-center py-8">No product selected</p>
      </div>
    );
  }

  const preBufferDays = (editingProduct as any).preRentalBufferDays ?? DEFAULT_PRE_BUFFER_DAYS;
  const postBufferDays = (editingProduct as any).postRentalBufferDays ?? DEFAULT_POST_BUFFER_DAYS;

  const bookingHistory = (editingProduct.bookingHistory || []) as any[];
  const blockedDates = editingProduct.blockedDates || [];

  const activeBookings = bookingHistory
    .filter(h => h.startDate && h.endDate)
    .map(h => ({
      ...h,
      start: new Date(h.startDate),
      end: new Date(h.endDate),
    }));

  const reasonMeta = REASON_OPTIONS.find(r => r.value === reason)!;
  const isExternalBooking = reasonMeta.isExternal;

  // --- Calendar grid ---
  const firstOfMonth = new Date(viewYear, viewMonth, 1);
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const startOffset = firstOfMonth.getDay(); // 0 = Sunday

  const days: DayInfo[] = [];
  for (let i = 0; i < startOffset; i++) {
    days.push({ date: new Date(NaN), type: 'muted', isToday: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(viewYear, viewMonth, d);
    let type: DayType = 'available';
    let label: string | undefined;

    // manual blocks
    const manualBlock = blockedDates.find(b => date >= new Date(b.from) && date <= new Date(b.to));

    // active rentals
    const rental = activeBookings.find(b => date >= b.start && date <= b.end);

    // buffer zones around each booking
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
      type = 'rental';
      label = initialsFromName(rental.customerName || '');
    } else if (inBuffer) {
      type = 'buffer';
    } else {
      type = 'available';
    }

    days.push({ date, type, label, isToday: isSameDay(date, today) });
  }

  const monthLabel = firstOfMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

  const changeMonth = (delta: number) => {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    setViewMonth(m);
    setViewYear(y);
  };

  const dayCellClasses = (type: DayType) => {
    switch (type) {
      case 'available':
        return 'bg-emerald-100/70 text-emerald-900';
      case 'rental':
        return 'bg-[#a8492f] text-white font-semibold';
      case 'buffer':
        return 'text-amber-800';
      case 'blocked':
        return 'text-stone-600';
      default:
        return 'bg-stone-50 text-stone-300';
    }
  };

  const dayCellStyle = (type: DayType): React.CSSProperties => {
    if (type === 'buffer') {
      return {
        backgroundImage:
          'repeating-linear-gradient(45deg, #fde9c8, #fde9c8 4px, #fbd9a0 4px, #fbd9a0 8px)',
      };
    }
    if (type === 'blocked') {
      return {
        backgroundImage:
          'repeating-linear-gradient(45deg, #e7e5e4, #e7e5e4 4px, #d6d3d1 4px, #d6d3d1 8px)',
      };
    }
    return {};
  };

  // --- Actions ---
  const resetForm = () => {
    setBlockFrom('');
    setBlockTo('');
    setCustomerName('');
    setWhatsappNumber('');
    setCity('');
    setChannel(CHANNEL_OPTIONS[0]);
    setListerSplit(45);
    setSplitNote('');
  };

  const handleBlockManualDates = () => {
    if (!blockFrom || !blockTo) {
      toast.error('Please choose a from and to date.');
      return;
    }
    const updated = {
      ...editingProduct,
      blockedDates: [
        ...blockedDates,
        { from: blockFrom, to: blockTo, reason: reasonMeta.label },
      ],
    };
    onUpdateProduct(updated);
    resetForm();
  };

  const handleCreateExternalOrder = async () => {
    if (!blockFrom || !blockTo || !customerName || !whatsappNumber) {
      toast.error('From date, to date, customer name and WhatsApp number are required.');
      return;
    }
    setSubmitting(true);
    try {
      await productSectionsApi.addExternalBooking(editingProduct.id, {
        orderId: '',
        customerName,
        startDate: blockFrom,
        endDate: blockTo,
        amount: 0,
        whatsappNumber,
        city,
        channel,
        listerSplitPercent: listerSplit,
        splitNote,
      } as any);

      const calendar = await productSectionsApi.getCalendar(editingProduct.id);
      onUpdateProduct({
        ...editingProduct,
        blockedDates: calendar.blockedDates || [],
        bookingHistory: calendar.bookingHistory || [],
      });
      resetForm();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to reserve these dates');
    } finally {
      setSubmitting(false);
    }
  };

  const lastSplitBooking = [...activeBookings].reverse().find(b => b.listerSplitPercent != null);
  const splitValues = activeBookings.map(b => b.listerSplitPercent).filter((v): v is number => v != null);
  const avgSplit = splitValues.length
    ? Math.round(splitValues.reduce((a, b) => a + b, 0) / splitValues.length)
    : null;

  const hasManualBlocks = blockedDates.length > 0;

  return (
    <div className="space-y-5">
      {/* Auto-block logic banner */}
      <div className="rounded-md border border-amber-200/70 bg-amber-50/60 p-3 flex gap-2">
        <span className="text-amber-500 text-sm leading-none">&#9432;</span>
        <p className="text-xs text-stone-600 leading-relaxed">
          <span className="font-semibold text-stone-800">Auto-block logic (from Master Data &rarr; Rental Logic):</span>{' '}
          this piece is automatically blocked <span className="font-semibold text-stone-800">{preBufferDays} days before</span> every
          dispatch and <span className="font-semibold text-stone-800">{postBufferDays} days after</span> every return
          ({postBufferDays - 1}-day Post-Rental Buffer + 1-day Cleaning Period). Override either window for this piece specifically
          in <span className="font-semibold text-stone-800">Pricing &amp; Tax</span> above &mdash; changes apply to the calendar immediately.
        </p>
      </div>

      {/* Calendar + side panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Calendar card */}
        <div className="lg:col-span-2 bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-serif font-bold text-stone-900 text-sm">{editingProduct.name}</h3>
              <p className="text-xs text-stone-400">
                {editingProduct.designer} &middot; {(editingProduct as any).sku}
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenGlobalCalendar}
              className="whitespace-nowrap rounded border border-stone-200 px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50 transition"
            >
              Global Calendar &rarr;
            </button>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              className="w-7 h-7 flex items-center justify-center rounded border border-stone-200 text-stone-500 hover:bg-stone-50 transition"
              aria-label="Previous month"
            >
              &larr;
            </button>
            <p className="font-serif font-bold text-stone-800 text-sm">{monthLabel}</p>
            <button
              type="button"
              onClick={() => changeMonth(1)}
              className="w-7 h-7 flex items-center justify-center rounded border border-stone-200 text-stone-500 hover:bg-stone-50 transition"
              aria-label="Next month"
            >
              &rarr;
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center">
            {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map(d => (
              <div key={d} className="text-[10px] font-semibold text-stone-400 pb-1">{d}</div>
            ))}
            {days.map((day, idx) => (
              <button
                key={idx}
                type="button"
                disabled={isNaN(day.date.getTime())}
                onClick={() => setSelectedDate(day.date)}
                className={`relative aspect-square rounded flex flex-col items-center justify-center text-[11px] transition
                  ${isNaN(day.date.getTime()) ? 'invisible' : 'cursor-pointer hover:opacity-80'}
                  ${dayCellClasses(day.type)}
                  ${day.isToday ? 'ring-2 ring-stone-800 ring-offset-1' : ''}`}
                style={dayCellStyle(day.type)}
              >
                {!isNaN(day.date.getTime()) && (
                  <>
                    <span>{day.date.getDate()}</span>
                    {day.label && <span className="text-[9px] leading-none">{day.label}</span>}
                  </>
                )}
              </button>
            ))}
          </div>

          {/* Legend */}
          <div className="pt-2 border-t border-stone-100 space-y-1.5">
            <div className="flex flex-wrap items-center gap-4 text-[10px] text-stone-500">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-sm bg-emerald-100/70 inline-block" /> Available
              </span>
              <span className="flex items-center gap-1">
                <span
                  className="w-3 h-3 rounded-sm inline-block"
                  style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fde9c8, #fde9c8 3px, #fbd9a0 3px, #fbd9a0 6px)' }}
                /> Buffer (prep or cleaning)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-sm bg-[#a8492f] inline-block" /> In Rental
              </span>
              <span className="flex items-center gap-1">
                <span
                  className="w-3 h-3 rounded-sm inline-block"
                  style={{ backgroundImage: 'repeating-linear-gradient(45deg, #e7e5e4, #e7e5e4 3px, #d6d3d1 3px, #d6d3d1 6px)' }}
                /> Blocked
              </span>
            </div>
            <p className="text-[10px] text-stone-400">
              Initials = customer &middot; X = manual block &middot; ring = today (ops date)
            </p>
          </div>
        </div>

        {/* Side panel */}
        <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm flex flex-col items-center justify-center text-center min-h-[220px]">
          {selectedDate && !isNaN(selectedDate.getTime()) ? (
            <div className="space-y-2 w-full">
              <p className="text-xs font-semibold text-stone-700">
                {selectedDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              {(() => {
                const info = days.find(d => !isNaN(d.date.getTime()) && isSameDay(d.date, selectedDate));
                if (!info) return null;
                if (info.type === 'rental') {
                  const booking = activeBookings.find(b => selectedDate >= b.start && selectedDate <= b.end);
                  return (
                    <div className="text-left text-xs text-stone-500 space-y-1">
                      <p><span className="font-semibold text-stone-700">Renter:</span> {booking?.customerName}</p>
                      <p><span className="font-semibold text-stone-700">Order:</span> {booking?.orderId}</p>
                    </div>
                  );
                }
                if (info.type === 'buffer') {
                  return <p className="text-xs text-amber-700">Automatic pre/post rental buffer &mdash; not bookable.</p>;
                }
                if (info.type === 'blocked') {
                  return <p className="text-xs text-stone-500">Manually blocked on this date.</p>;
                }
                return <p className="text-xs text-emerald-700">Available &mdash; use the form below to block or reserve it.</p>;
              })()}
            </div>
          ) : (
            <>
              <CalendarDays className="w-5 h-5 text-stone-300 mb-2" />
              <p className="text-xs text-stone-400">
                Select a date to view booking details or block dates
              </p>
            </>
          )}
        </div>
      </div>

      {/* Block Dates & External Bookings */}
      <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-4">
        <div>
          <h3 className="font-serif font-bold text-stone-900 text-sm">Block Dates &amp; External Bookings</h3>
          <p className="text-xs text-stone-500 mt-1">
            Block dates for external bookings (Instagram, in-person enquiries), maintenance, alterations, or cleaning
            beyond the automatic buffer. Blocks apply to the calendar above immediately &mdash; no save step needed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-stone-500 font-medium text-[10px] uppercase tracking-wide">From Date</label>
            <input
              type="date"
              value={blockFrom}
              onChange={(e) => setBlockFrom(e.target.value)}
              className="w-full p-2 bg-white border border-stone-200 rounded text-xs"
            />
          </div>
          <div className="space-y-1">
            <label className="text-stone-500 font-medium text-[10px] uppercase tracking-wide">To Date</label>
            <input
              type="date"
              value={blockTo}
              onChange={(e) => setBlockTo(e.target.value)}
              className="w-full p-2 bg-white border border-stone-200 rounded text-xs"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-stone-500 font-medium text-[10px] uppercase tracking-wide">Reason</label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-2 bg-white border border-stone-200 rounded text-xs"
          >
            {REASON_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {isExternalBooking && (
          <>
            <div className="rounded-md border border-amber-200/70 bg-amber-50/60 p-3">
              <p className="text-xs text-stone-600 leading-relaxed">
                An external booking is a real transaction &mdash; HOK reserves these dates by{' '}
                <span className="font-semibold text-stone-800">creating an order</span>, so deposit, GST, lister payout and
                dispatch are all tracked. There is no date-block without an order on this path.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-stone-500 font-medium text-[10px] uppercase tracking-wide">Customer Name *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="As shared on chat"
                  className="w-full p-2 bg-white border border-stone-200 rounded text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-stone-500 font-medium text-[10px] uppercase tracking-wide">WhatsApp Number *</label>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="+91 ..."
                  className="w-full p-2 bg-white border border-stone-200 rounded text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-stone-500 font-medium text-[10px] uppercase tracking-wide">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="For dispatch estimate"
                  className="w-full p-2 bg-white border border-stone-200 rounded text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-stone-500 font-medium text-[10px] uppercase tracking-wide">Channel</label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  className="w-full p-2 bg-white border border-stone-200 rounded text-xs"
                >
                  {CHANNEL_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-stone-500 font-medium text-[10px] uppercase tracking-wide">
                  Lister Split % (This Transaction)
                </label>
                <input
                  type="number"
                  value={listerSplit}
                  onChange={(e) => setListerSplit(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-stone-200 rounded text-xs"
                />
                <p className="text-[10px] text-stone-400">
                  Piece default 45% &mdash; adjust for demand, silhouette, condition, effort.
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-stone-500 font-medium text-[10px] uppercase tracking-wide">Why This % (Internal)</label>
                <input
                  type="text"
                  value={splitNote}
                  onChange={(e) => setSplitNote(e.target.value)}
                  placeholder="e.g. couture demand · 8th rental · fair condition"
                  className="w-full p-2 bg-white border border-stone-200 rounded text-xs"
                />
              </div>
            </div>

            <div className="rounded-md border border-stone-200 bg-[#fcf9f5] p-3">
              <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wide mb-1">Decision Context</p>
              <p className="text-xs text-stone-600">
                Last split {lastSplitBooking ? `${lastSplitBooking.listerSplitPercent}%` : '—'}
                {lastSplitBooking ? ` (${lastSplitBooking.orderId} · ${new Date(lastSplitBooking.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })})` : ''}
                {' '}&middot; piece avg {avgSplit != null ? `${avgSplit}%` : '—'} across {activeBookings.length}
                {' '}&middot; default 45% &middot; condition {(editingProduct as any).condition || '—'}
                {' '}&middot; rented {(editingProduct as any).rentedCount ?? bookingHistory.length}&times;
              </p>
            </div>

            <div className="rounded-md border border-dashed border-stone-200 p-3">
              <p className="text-xs text-stone-400">Pick dates above to see the quote.</p>
            </div>
          </>
        )}

        <div className="space-y-2">
          <button
            type="button"
            onClick={isExternalBooking ? handleCreateExternalOrder : handleBlockManualDates}
            disabled={submitting}
            className="rounded-md bg-amber-700/90 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2.5 transition disabled:opacity-50"
          >
            {isExternalBooking
              ? (submitting ? 'Reserving...' : 'Reserve Dates & Create Order \u2192')
              : 'Block These Dates'}
          </button>
          {!hasManualBlocks && (
            <p className="text-[10px] text-stone-400">
              No manual blocks on this piece &mdash; only automatic booking buffers apply.
            </p>
          )}
        </div>
      </div>

      {/* Order history table */}
      <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-3">
        <h3 className="font-serif font-bold text-stone-900 text-sm">Order History for this Piece</h3>
        {loading ? (
          <p className="text-stone-400 text-xs">Loading bookings...</p>
        ) : bookingHistory.length === 0 ? (
          <p className="text-stone-400 text-xs">No historical bookings logged under this piece.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-wide text-stone-400 border-b border-stone-100">
                  <th className="py-2 pr-3 font-medium">Order ID</th>
                  <th className="py-2 pr-3 font-medium">Customer</th>
                  <th className="py-2 pr-3 font-medium">Dates</th>
                  <th className="py-2 pr-3 font-medium">Revenue</th>
                  <th className="py-2 pr-3 font-medium">Deposit</th>
                  <th className="py-2 pr-3 font-medium">Status</th>
                  <th className="py-2 pr-3 font-medium" />
                </tr>
              </thead>
              <tbody>
                {bookingHistory.map((h, idx) => (
                  <tr key={idx} className="border-b border-stone-50 last:border-b-0">
                    <td className="py-2.5 pr-3 font-mono text-stone-600">{h.orderId}</td>
                    <td className="py-2.5 pr-3 text-stone-700">{h.customerName}</td>
                    <td className="py-2.5 pr-3 text-stone-500">
                      {h.startDate && h.endDate
                        ? `${new Date(h.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - ${new Date(h.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`
                        : new Date(h.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-2.5 pr-3 text-stone-700">₹{Number(h.amount || 0).toLocaleString('en-IN')}</td>
                    <td className="py-2.5 pr-3 text-stone-500">{h.depositStatus || '—'}</td>
                    <td className="py-2.5 pr-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                        h.status === 'Returned'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {h.status}
                      </span>
                    </td>
                    <td className="py-2.5 pr-0 text-right">
                      <button
                        type="button"
                        onClick={() => onViewOrder?.(h.orderId)}
                        className="rounded border border-stone-200 px-2.5 py-1 text-[10px] font-medium text-stone-600 hover:bg-stone-50 transition"
                      >
                        View &rarr;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
