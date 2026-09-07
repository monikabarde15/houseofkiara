// src/components/products/ProductSidebar.tsx

import React, { useMemo, useState } from 'react';
import { Calendar, ExternalLink, Archive } from 'lucide-react';
import { Product } from '../types/product';

interface ProductSidebarProps {
    product: Product;
    isNew?: boolean;
    onViewLive?: () => void;
    onArchive?: () => void;
    onOpenGlobalCalendar?: () => void;
    onViewOrder?: (orderId: string) => void;
}

const DEFAULT_PRE_BUFFER_DAYS = 2;
const DEFAULT_POST_BUFFER_DAYS = 3;

type DayType = 'available' | 'buffer' | 'rental' | 'blocked' | 'plain';

interface DayInfo {
    date: Date;
    type: DayType;
    initials?: string;
    isToday: boolean;
}

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

export function ProductSidebar({
    product,
    isNew = false,
    onViewLive,
    onArchive,
    onOpenGlobalCalendar,
    onViewOrder,
}: ProductSidebarProps) {
    // ── All hooks run unconditionally, on every render, regardless of `isNew`. ──
    const today = useMemo(() => parseToStartOfDay(new Date()), []);

    const bookingHistory = ((product as any)?.bookingHistory || []) as any[];
    const blockedDates = (product?.blockedDates || []) as { from: string; to: string; reason?: string }[];

    const activeBookings = useMemo(
        () =>
            bookingHistory
                .filter(h => h.startDate && h.endDate)
                .map(h => ({
                    ...h,
                    start: parseToStartOfDay(h.startDate),
                    end: parseToStartOfDay(h.endDate),
                })),
        [bookingHistory]
    );

    const rawPre = Number((product as any)?.preRentalBufferDays);
    const rawPost = Number((product as any)?.postRentalBufferDays);
    const preBufferDays = (!isNaN(rawPre) && rawPre >= 0 && rawPre <= 14) ? rawPre : DEFAULT_PRE_BUFFER_DAYS;
    const postBufferDays = (!isNaN(rawPost) && rawPost >= 0 && rawPost <= 14) ? rawPost : DEFAULT_POST_BUFFER_DAYS;

    // Default the visible month to whichever active booking covers today, else the
    // nearest upcoming booking, else the current month.
    const initialAnchor = useMemo(() => {
        const covering = activeBookings.find(b => today >= b.start && today <= b.end);
        if (covering) return covering.start;
        const upcoming = activeBookings
            .filter(b => b.start >= today)
            .sort((a, b) => a.start.getTime() - b.start.getTime())[0];
        if (upcoming) return upcoming.start;
        return today;
    }, [activeBookings, today]);

    const [viewMonth, setViewMonth] = useState(initialAnchor.getMonth());
    const [viewYear, setViewYear] = useState(initialAnchor.getFullYear());
    const [selectedDate, setSelectedDate] = useState<Date>(
        activeBookings.find(b => today >= b.start && today <= b.end) ? today : initialAnchor
    );

    const getDayInfo = (date: Date): DayInfo => {
        const dateStart = parseToStartOfDay(date);
        const manualBlock = blockedDates.find(b => dateStart >= parseToStartOfDay(b.from) && dateStart <= parseToStartOfDay(b.to));
        const rental = activeBookings.find(b => dateStart >= b.start && dateStart <= b.end);
        const inBuffer = activeBookings.some(b => {
            const preStart = addDays(b.start, -preBufferDays);
            const preEnd = addDays(b.start, -1);
            const postStart = addDays(b.end, 1);
            const postEnd = addDays(b.end, postBufferDays);
            return (dateStart >= preStart && dateStart <= preEnd) || (dateStart >= postStart && dateStart <= postEnd);
        });

        let type: DayType = 'plain';
        if (rental) type = 'rental';
        else if (manualBlock) type = 'blocked';
        else if (inBuffer) type = 'buffer';
        else if (dateStart >= today) type = 'available';

        return {
            date,
            type,
            initials: rental ? initialsFromName(rental.customerName || '') : undefined,
            isToday: isSameDay(date, today),
        };
    };

    const firstOfMonth = new Date(viewYear, viewMonth, 1);
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const startOffset = firstOfMonth.getDay();
    const monthLabel = firstOfMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

    const cells: (DayInfo | null)[] = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
        cells.push(getDayInfo(new Date(viewYear, viewMonth, d)));
    }

    const changeMonth = (delta: number) => {
        let m = viewMonth + delta;
        let y = viewYear;
        if (m < 0) { m = 11; y -= 1; }
        if (m > 11) { m = 0; y += 1; }
        setViewMonth(m);
        setViewYear(y);
    };

    const selectedInfo = getDayInfo(selectedDate);
    const selectedRental = activeBookings.find(b => selectedDate >= b.start && selectedDate <= b.end);
    const selectedBlock = blockedDates.find(
        b => selectedDate >= parseToStartOfDay(b.from) && selectedDate <= parseToStartOfDay(b.to)
    );

    // ── Only the JSX branches on `isNew` — no hooks below this point. ──
    if (isNew) {
        return (
           <div className="w-full lg:h-full">
    <div className="lg:sticky lg:top-24 space-y-5">

                    {/* =========================== Availability (empty state) =========================== */}
                    <div className="rounded-xl border border-[#E8E0D6] bg-white shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between border-b border-[#F1EBE3] px-5 py-4">
                            <h3 className="text-[15px] font-semibold text-[#2D2926]">Availability</h3>
                            <button
                                onClick={onOpenGlobalCalendar}
                                className="rounded-md border border-[#E7DED2] bg-white px-3 py-1.5 text-[11px] font-medium text-[#6B645C] transition hover:bg-[#FAF8F5]"
                            >
                                Full Calendar →
                            </button>
                        </div>

                        <div className="p-5 space-y-4">
                            <div className="rounded-lg border border-dashed border-[#DDD3C7] bg-[#FAF8F5] px-4 py-6 text-center">
                                <p className="text-[12px] text-[#8B8175]">
                                    Availability appears once the piece is created
                                </p>
                            </div>

                            <div className="flex flex-col items-center justify-center rounded-lg bg-[#F1EBE3] px-4 py-10">
                                <Calendar className="h-5 w-5 text-[#B5AB9D] mb-2" />
                                <p className="text-[12px] text-[#A2978A]">Tap a date to see details</p>
                            </div>
                        </div>
                    </div>

                    {/* =========================== Quick Actions (new) =========================== */}
                    <div className="overflow-hidden rounded-xl border border-[#E8E0D6] bg-white shadow-sm">
                        <div className="border-b border-[#EFE8DE] px-5 py-4">
                            <h3 className="text-[15px] font-semibold text-[#2D2926]">Quick Actions</h3>
                        </div>

                        <div className="space-y-3 p-4">
                            <button
                                onClick={onOpenGlobalCalendar}
                                className="flex h-11 w-full items-center gap-3 rounded-lg border border-[#E7DED2] bg-white px-4 text-[15px] font-medium text-[#2D2926] transition-colors hover:bg-[#FAF8F5]"
                            >
                                <Calendar className="h-4 w-4" />
                                <span>Global Rental Calendar</span>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="lg:sticky lg:top-24 space-y-5">
                {/* =========================== Availability =========================== */}

                <div className="rounded-xl border border-[#E8E0D6] bg-white shadow-sm overflow-hidden">

                    <div className="flex items-center justify-between border-b border-[#F1EBE3] px-5 py-4">
                        <h3 className="text-[15px] font-semibold text-[#2D2926]">Availability</h3>
                        <button
                            onClick={onOpenGlobalCalendar}
                            className="rounded-md border border-[#E7DED2] bg-white px-3 py-1.5 text-[11px] font-medium text-[#6B645C] transition hover:bg-[#FAF8F5]"
                        >
                            Full Calendar →
                        </button>
                    </div>

                    <div className="p-5">

                        {/* Month */}
                        <div className="mb-5 flex items-center justify-between">
                            <button
                                onClick={() => changeMonth(-1)}
                                className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E7DED2] bg-white hover:bg-[#FAF8F5]"
                                aria-label="Previous month"
                            >
                                ←
                            </button>
                            <h4 className="font-serif text-[22px] text-[#312C27]">{monthLabel}</h4>
                            <button
                                onClick={() => changeMonth(1)}
                                className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E7DED2] bg-white hover:bg-[#FAF8F5]"
                                aria-label="Next month"
                            >
                                →
                            </button>
                        </div>

                        {/* Weekdays */}
                        <div className="mb-2 grid grid-cols-7 text-center">
                            {["SU", "MO", "TU", "WE", "TH", "FR", "SA"].map(day => (
                                <div key={day} className="pb-2 text-[10px] font-semibold tracking-wide text-[#A2978A]">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar */}
                        <div className="grid grid-cols-7 gap-[2px]">
                            {cells.map((info, index) => {
                                if (!info) return <div key={index} className="aspect-square" />;

                                const { date, type, initials, isToday } = info;
                                const isSelected = isSameDay(date, selectedDate);

                                return (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => setSelectedDate(date)}
                                        className={`
                                            relative aspect-square rounded-[4px]
                                            border text-[11px] font-semibold
                                            flex flex-col items-center justify-center
                                            overflow-hidden transition
                                            ${isToday ? "ring-2 ring-[#2D2926] ring-offset-1" : ""}
                                            ${isSelected && !isToday ? "ring-2 ring-[#C7683B] ring-offset-1" : ""}
                                            ${type === "rental"
                                                ? "bg-[#C7683B] border-[#C7683B] text-white"
                                                : type === "available"
                                                    ? "bg-[#DDE9D8] border-[#DDE9D8] text-[#42553D]"
                                                    : type === "blocked"
                                                        ? "border-[#D8C7AA] bg-[#FFF9EF]"
                                                        : type === "buffer"
                                                            ? "border-[#EFE4CB] bg-[#F7F2E8] text-[#8D857B]"
                                                            : "border-[#EEE7DD] bg-white text-[#8D857B]"
                                            }
                                        `}
                                    >
                                        {(type === "blocked" || type === "buffer") && (
                                            <div
                                                className="absolute inset-0 opacity-70"
                                                style={{
                                                    backgroundImage:
                                                        type === "blocked"
                                                            ? "repeating-linear-gradient(45deg,#D8C7AA 0,#D8C7AA 2px,transparent 2px,transparent 7px)"
                                                            : "repeating-linear-gradient(45deg,#F0C989 0,#F0C989 2px,transparent 2px,transparent 7px)"
                                                }}
                                            />
                                        )}
                                        <span className="relative z-10">{date.getDate()}</span>
                                        {initials && (
                                            <span className="relative z-10 mt-[2px] text-[8px] font-bold tracking-wide">
                                                {initials}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Legend */}
                        <div className="mt-5 border-t border-[#EFE8DE] pt-4">
                            <div className="grid grid-cols-2 gap-y-2 text-[10px]">
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded bg-[#DDE9D8]" />
                                    <span className="text-[#7B7369]">Available</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="h-3 w-3 rounded"
                                        style={{
                                            backgroundColor: "#F7F2E8",
                                            backgroundImage:
                                                "repeating-linear-gradient(45deg,#F0C989 0,#F0C989 2px,transparent 2px,transparent 7px)"
                                        }}
                                    />
                                    <span className="text-[#7B7369]">Buffer</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded bg-[#C7683B]" />
                                    <span className="text-[#7B7369]">In Rental</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="h-3 w-3 rounded border border-[#D8C7AA]"
                                        style={{
                                            backgroundImage:
                                                "repeating-linear-gradient(45deg,#D8C7AA 0,#D8C7AA 2px,transparent 2px,transparent 7px)"
                                        }}
                                    />
                                    <span className="text-[#7B7369]">Blocked</span>
                                </div>
                            </div>

                            <p className="mt-3 text-[10px] text-[#A2978A]">
                                Initials = customer &middot; X = manual block &middot; ring = today (ops date)
                            </p>
                        </div>

                    </div>

                </div>

                {/* ========================== Current Booking =========================== */}

                <div className="rounded-xl border border-[#E8E0D6] bg-[#FBF8F4] p-4 shadow-sm">

                    <div className="mb-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8B8175]">
                            {selectedDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    </div>

                    {selectedRental ? (
                        <>
                            {(() => {
                              const rawId = selectedRental.orderId || 'HOK-ORD-889';
                              const displayOrderId = rawId.startsWith('HOK-ORD-')
                                ? rawId
                                : rawId.startsWith('EXT-')
                                ? `HOK-ORD-${rawId.replace(/[^0-9]/g, '').slice(-3) || '889'}`
                                : `HOK-ORD-${String(rawId).padStart(3, '0')}`;
                              return (
                                <div className="rounded-lg border border-[#ECE3D8] bg-white p-4">
                                    <p className="text-[10px] font-bold tracking-wide text-[#2D2926]">
                                        {displayOrderId}
                                    </p>
                                    <h4 className="mt-2 text-[17px] font-semibold text-[#2C2926]">
                                        {selectedRental.customerName}
                                    </h4>
                                    <p className="mt-1 text-[12px] text-[#7E756B]">
                                        {selectedRental.start.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                        {'–'}
                                        {selectedRental.end.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </p>
                                    <span className="mt-3 inline-flex rounded-md bg-[#C7683B] px-2.5 py-1 text-[11px] font-semibold text-white">
                                        In Rental
                                    </span>
                                </div>
                              );
                            })()}

                             <button
                                onClick={() => {
                                  const rawId = selectedRental.orderId || 'HOK-ORD-889';
                                  const displayOrderId = rawId.startsWith('HOK-ORD-')
                                    ? rawId
                                    : `HOK-ORD-${String(rawId).replace(/[^0-9]/g, '').slice(-3) || '889'}`;
                                  onViewOrder?.(displayOrderId);
                                }}
                                className="mt-4 flex h-10 w-full items-center justify-center rounded-md border border-[#DDD3C7] bg-white text-[13px] font-medium text-[#403A35] transition hover:bg-[#FAF8F5]"
                            >
                                View Full Order →
                            </button>
                        </>
                    ) : selectedBlock ? (
                        <div className="rounded-lg border border-[#ECE3D8] bg-white p-4">
                            <p className="text-[13px] font-semibold text-[#2D2926]">Manually blocked</p>
                            <p className="mt-1 text-[12px] text-[#7E756B]">{selectedBlock.reason || 'No reason logged'}</p>
                        </div>
                    ) : selectedInfo.type === 'buffer' ? (
                        <div className="rounded-lg border border-[#ECE3D8] bg-white p-4">
                            <p className="text-[13px] font-semibold text-[#2D2926]">Automatic buffer</p>
                            <p className="mt-1 text-[12px] text-[#7E756B]">Pre/post rental prep or cleaning &mdash; not bookable.</p>
                        </div>
                    ) : (
                        <div className="rounded-lg border border-[#ECE3D8] bg-white p-4">
                            <p className="text-[13px] font-semibold text-[#2D2926]">Available</p>
                            <p className="mt-1 text-[12px] text-[#7E756B]">No booking on this date.</p>
                        </div>
                    )}

                </div>

                {/* ===========================
                    Quick Actions
                =========================== */}

                <div className="overflow-hidden rounded-xl border border-[#E8E0D6] bg-white shadow-sm">

                    <div className="border-b border-[#EFE8DE] px-5 py-4">
                        <h3 className="text-[15px] font-semibold text-[#2D2926]">Quick Actions</h3>
                    </div>

                    <div className="space-y-3 p-4">
                        <button
                            onClick={onViewLive}
                            className="flex h-11 w-full items-center gap-3 rounded-lg border border-[#E7DED2] bg-white px-4 text-[15px] font-medium text-[#2D2926] transition-colors hover:bg-[#FAF8F5]"
                        >
                            <ExternalLink className="h-4 w-4" />
                            <span>View Live PDP</span>
                        </button>

                        <button
                            onClick={onOpenGlobalCalendar}
                            className="flex h-11 w-full items-center gap-3 rounded-lg border border-[#E7DED2] bg-white px-4 text-[15px] font-medium text-[#2D2926] transition-colors hover:bg-[#FAF8F5]"
                        >
                            <Calendar className="h-4 w-4" />
                            <span>Global Rental Calendar</span>
                        </button>

                        <button
                            onClick={onArchive}
                            className="flex h-11 w-full items-center gap-3 rounded-lg border border-[#F2B8A8] bg-[#FFF8F6] px-4 text-[15px] font-medium text-[#C7683B] transition-colors hover:bg-[#FFF2EE]"
                        >
                            <Archive className="h-4 w-4" />
                            <span>Archive Product</span>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}