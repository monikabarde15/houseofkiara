// src\components\RentalCalendar.jsx
import '../styles/rental-calendar.css';
import React, { useState } from "react";
import { Calendar } from 'lucide-react';

export default function RentalCalendar({
  rentData,
  selectedStart,
  setSelectedStart,
  selectedEnd,
  setSelectedEnd
}) {

    const [currentDate, setCurrentDate] = useState(
        selectedStart || new Date()
    );
    const [hoverDate, setHoverDate] = useState(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); // 0–11

    // total days in month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // first day of month
    const firstDay = new Date(year, month, 1).getDay();

    // convert Sunday=0 → Monday=0
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;

    const daysArray = [];

    // empty cells
    for (let i = 0; i < startOffset; i++) {
        daysArray.push(null);
    }

    // actual days
    for (let d = 1; d <= daysInMonth; d++) {
        daysArray.push(d);
    }

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const prevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    // ─── Helpers ───────────────────────────────────────────────────────────
    const toMidnight = (d) => {
        const copy = new Date(d);
        copy.setHours(0, 0, 0, 0);
        return copy;
    };

    const today = toMidnight(new Date());

    const bufferDays = rentData?.availability?.preRentalBufferDays ?? 
                       rentData?.delivery?.dispatchBeforeDays ?? 2;

    const minValidDate = new Date(today);
    minValidDate.setDate(today.getDate() + bufferDays);

    // Build the flat unavailable date set (already includes buffer days from makeProductDetail)
    const unavailableSet = new Set(
        rentData?.availability?.unavailableDates || []
    );

    // Build raw booked ranges for overlap checks (with buffers already in unavailableSet)
    // We also keep raw ranges for the "range crosses blocked" check
    const blockedRanges = (rentData?.availability?.blockedRanges || []).map(r => ({
        from: toMidnight(new Date(r.from)),
        to: toMidnight(new Date(r.to)),
    }));

    // ─── Core availability checks ──────────────────────────────────────────

    /** Is a single calendar date unavailable to click? */
    const isUnavailable = (day) => {
        if (!day) return false;
        const date = toMidnight(new Date(year, month, day));
        if (date < minValidDate) return true;
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        return unavailableSet.has(dateStr);
    };

    /** Does the range [a, b] contain any unavailable date? */
    const rangeHasBlockedDate = (a, b) => {
        if (!a || !b) return false;
        const start = toMidnight(new Date(Math.min(a, b)));
        const end   = toMidnight(new Date(Math.max(a, b)));
        let d = new Date(start);
        while (d <= end) {
            const str = d.toISOString().split('T')[0];
            if (unavailableSet.has(str)) return true;
            d.setDate(d.getDate() + 1);
        }
        return false;
    };

    // ─── Date selection handler ────────────────────────────────────────────
    const handleDateClick = (day) => {
        if (!day) return;
        if (isUnavailable(day)) {
            alert("This date is already booked and unavailable for rental.");
            return;
        }

        const clicked = toMidnight(new Date(year, month, day));

        // First click OR reset (already have both selected)
        if (!selectedStart || (selectedStart && selectedEnd)) {
            setSelectedStart(clicked);
            setSelectedEnd(null);
            return;
        }

        // Second click → set end date
        if (selectedStart && !selectedEnd) {
            if (clicked < selectedStart) {
                // User clicked earlier → swap: make clicked the new start
                setSelectedStart(clicked);
                setSelectedEnd(null);
                return;
            }

            // ⛔ Block if any date in selected range is unavailable
            if (rangeHasBlockedDate(selectedStart, clicked)) {
                alert("Your selected range includes dates that are already booked.");
                // Reset selection — range crosses a booked date
                setSelectedStart(clicked);
                setSelectedEnd(null);
                return;
            }

            setSelectedEnd(clicked);
        }
    };

    const handleMouseEnter = (day) => {
        if (!day || !selectedStart || selectedEnd) {
            setHoverDate(null);
            return;
        }
        setHoverDate(toMidnight(new Date(year, month, day)));
    };

    const handleMouseLeave = () => setHoverDate(null);

    // ─── Range / state helpers ─────────────────────────────────────────────
    const isInRange = (day) => {
        if (!day) return false;
        const start = selectedStart;
        const end = selectedEnd || hoverDate;
        if (!start || !end) return false;

        const date = toMidnight(new Date(year, month, day));
        const lo = toMidnight(new Date(Math.min(start, end)));
        const hi = toMidnight(new Date(Math.max(start, end)));
        return date > lo && date < hi;
    };

    const isStart = (day) => {
        if (!selectedStart || !day) return false;
        return toMidnight(new Date(year, month, day)).getTime() === toMidnight(new Date(selectedStart)).getTime();
    };

    const isEnd = (day) => {
        if (!selectedEnd || !day) return false;
        return toMidnight(new Date(year, month, day)).getTime() === toMidnight(new Date(selectedEnd)).getTime();
    };

    /** Is this day in a hover-preview range that crosses blocked dates? */
    const isRangeConflict = (day) => {
        if (!day || !selectedStart || selectedEnd) return false;
        if (!hoverDate) return false;
        const date = toMidnight(new Date(year, month, day));
        const lo = toMidnight(new Date(Math.min(selectedStart, hoverDate)));
        const hi = toMidnight(new Date(Math.max(selectedStart, hoverDate)));
        if (date < lo || date > hi) return false;
        return rangeHasBlockedDate(selectedStart, hoverDate);
    };

    // ─── Pricing calculations ──────────────────────────────────────────────
    const getDays = () => {
        if (!selectedStart || !selectedEnd) return 0;
        const diff = toMidnight(new Date(selectedEnd)) - toMidnight(new Date(selectedStart));
        return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
    };

    const totalDays = getDays();

    const getPrice = () => {
        if (!totalDays || !rentData?.pricing) return 0;
        const pricing = rentData.pricing;
        const windowMatch = pricing.windows?.find((w) => w.days === totalDays);
        if (windowMatch) return windowMatch.price;
        return totalDays * pricing.pricePerDay;
    };

    const totalPrice = getPrice();

    const getDeliveryDate = () => {
        if (!selectedStart) return null;
        const daysBefore = rentData?.delivery?.dispatchBeforeDays || 2;
        const date = new Date(selectedStart);
        date.setDate(date.getDate() - daysBefore);
        return date;
    };

    const getReturnDate = () => {
        if (!selectedEnd) return null;
        const date = new Date(selectedEnd);
        date.setDate(date.getDate() + (rentData?.delivery?.returnAfterDays || 1));
        return date;
    };

    const formatDate = (date) => {
        if (!date) return "";
        return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    };

    // Determine if hover range is invalid (crosses blocked dates)
    const hoverRangeConflicts = selectedStart && !selectedEnd && hoverDate
        ? rangeHasBlockedDate(selectedStart, hoverDate)
        : false;

    return (
        <>
            <p className="calendar-section-label">
                Select Your Rental Dates
            </p>
            <div className="calendar">

                {/* HEADER */}
                <div className="calendar__header">
                    <div className="calendar__left">
                        <span className="calendar__icon"><Calendar /></span>
                        <span className="calendar__title">Availability Calendar</span>
                    </div>

                    <div className="calendar__right">
                        <button onClick={prevMonth} className="calendar__nav">‹</button>

                        <span className="calendar__month" id="calMonth">
                            {monthNames[month]} {year}
                        </span>

                        <button onClick={nextMonth} className="calendar__nav">›</button>
                    </div>
                </div>

                {/* BODY */}
                <div className="calendar__body">

                    {/* WEEK DAYS */}
                    <div className="calendar__week">
                        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map(day => (
                            <div key={day} className="calendar__week-day">{day}</div>
                        ))}
                    </div>

                    {/* Dynamic Calendar Grid */}
                    <div className="calendar__grid" id="calDays">
                        {daysArray.map((day, i) => {
                            const unavailable = isUnavailable(day);
                            const conflict = isRangeConflict(day);
                            const inRange = !conflict && isInRange(day);

                            return (
                                <div
                                    key={i}
                                    onClick={() => handleDateClick(day)}
                                    onMouseEnter={() => handleMouseEnter(day)}
                                    onMouseLeave={handleMouseLeave}
                                    title={
                                        unavailable && day
                                            ? "This date is unavailable"
                                            : conflict
                                            ? "This range includes booked dates"
                                            : undefined
                                    }
                                    className={`calendar__day
                                        ${!day ? "empty" : ""}
                                        ${unavailable ? "blocked" : "available"}
                                        ${isStart(day) ? "start" : ""}
                                        ${isEnd(day) ? "end" : ""}
                                        ${inRange ? "range" : ""}
                                        ${conflict ? "conflict" : ""}
                                    `}
                                >
                                    {day || ""}
                                </div>
                            );
                        })}
                    </div>
                </div>


                {/* LEGEND */}
                <div className="calendar__legend">
                <div className="calendar__legend-inner">
                    <div className="legend-item">
                        <span className="dot available"></span>
                        <span>Available</span>
                    </div>

                    <div className="legend-item">
                        <span className="dot selected"></span>
                        <span>Selected</span>
                    </div>

                    <div className="legend-item">
                        <span className="dot range"></span>
                        <span>Your window</span>
                    </div>

                    <div className="legend-item">
                        <span className="dot blocked"></span>
                        <span>Unavailable</span>
                    </div>
                </div>
                </div>

                {/* Conflict Warning */}
                {hoverRangeConflicts && selectedStart && !selectedEnd && (
                    <div className="calendar-conflict-warning">
                        ⚠ This range includes booked dates — please choose different dates.
                    </div>
                )}

                {/* Calendar Summary */}
                <div className="calendar-summary">

                    <div className="summary-row" id="sumDates">
                        <span>Rental dates</span>
                        <span>
                            {selectedStart && selectedEnd
                                ? `${formatDate(selectedStart)} – ${formatDate(selectedEnd)}`
                                : "Select dates above"}
                        </span>
                    </div>

                    <div className="summary-row" id="sumDuration">
                        <span>Duration</span>
                        <span>
                            {selectedStart && selectedEnd
                                ? `${totalDays} days`
                                : "— days"}
                        </span>
                    </div>

                    <div className="summary-row" id="sumDelivery">
                        <span>Delivery (estimated)</span>
                        <span>
                            {selectedStart && selectedEnd
                                ? `Arrives ${formatDate(getDeliveryDate())} · Collected ${formatDate(getReturnDate())}`
                                : "—"}
                        </span>
                    </div>

                    <div className="summary-row" id="sumFee">
                        <span>Rental fee</span>
                        <span>
                            {selectedStart && selectedEnd
                                ? `₹${totalPrice}`
                                : "—"}
                        </span>
                    </div>

                    <div className="summary-row total" id="sumTotal">
                        <span>Total payable now</span>
                        <span>
                            {selectedStart && selectedEnd
                                ? `₹${totalPrice}`
                                : "—"}
                        </span>
                    </div>

                </div>

            </div>
        </>
    );
}