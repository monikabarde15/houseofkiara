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

    const [currentDate, setCurrentDate] = useState(new Date());

   
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

    const isUnavailable = (day) => {
        if (!day) return false;

        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        return rentData?.availability?.unavailableDates?.includes(dateStr);
    };

    // DATE SELECTION HANDLER
    const handleDateClick = (day) => {
        if (!day) return;

        if (isUnavailable(day)) return;

        const clickedDate = new Date(year, month, day);

        // first click
        if (!selectedStart || (selectedStart && selectedEnd)) {
            setSelectedStart(clickedDate);
            setSelectedEnd(null);
            return;
        }

        // second click
        if (selectedStart && !selectedEnd) {
            if (clickedDate < selectedStart) {
                setSelectedStart(clickedDate);
            } else {
                setSelectedEnd(clickedDate);
            }
        }
    };

    // RANGE FOR THE RENT 

    const isInRange = (day) => {
        if (!selectedStart || !selectedEnd) return false;

        const date = new Date(year, month, day);

        return date > selectedStart && date < selectedEnd;
    };

    const isStart = (day) =>
        selectedStart &&
        day === selectedStart.getDate() &&
        month === selectedStart.getMonth();

    const isEnd = (day) =>
        selectedEnd &&
        day === selectedEnd.getDate() &&
        month === selectedEnd.getMonth();

    // COUNT THE DAYS
    const getDays = () => {
        if (!selectedStart || !selectedEnd) return 0;

        const diff = selectedEnd - selectedStart;
        return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
    };

    const totalDays = getDays();

    // CALCULATE THE PRICE
    const getPrice = () => {
        if (!totalDays || !rentData?.pricing) return 0;

        const pricing = rentData.pricing;

        // ✅ 1. Check window match first
        const windowMatch = pricing.windows?.find(
            (w) => w.days === totalDays
        );

        if (windowMatch) {
            return windowMatch.price;
        }

        // ✅ 2. fallback to per day
        return totalDays * pricing.pricePerDay;
    };

    const totalPrice = getPrice();

    // GET THE DELIVERY
    const getDeliveryDate = () => {
        if (!selectedStart || !rentData?.delivery) return null;

        const daysBefore = rentData.delivery.dispatchBeforeDays || 0;

        const date = new Date(selectedStart);
        date.setDate(date.getDate() - daysBefore);

        return date;
    };

    const getReturnDate = () => {
        if (!selectedEnd) return null;

        const date = new Date(selectedEnd);
        date.setDate(date.getDate() + rentData.delivery.returnAfterDays);
        return date;
    };

    // DATE FORMAT
    const formatDate = (date) => {
        if (!date) return "";

        return date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short"
        });
    };
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

                    {/* Dynamic Calander Grid */}
                    <div className="calendar__grid" id="calDays">
                        {daysArray.map((day, i) => {
                            const unavailable = isUnavailable(day);

                            return (
                                <div
                                    key={i}
                                    onClick={() => handleDateClick(day)}
                                    className={`calendar__day
          ${!day ? "empty" : ""}
          ${unavailable ? "blocked" : "available"}
          ${isStart(day) ? "start" : ""}
          ${isEnd(day) ? "end" : ""}
          ${isInRange(day) ? "range" : ""}
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

                {/* Calender Summary */}
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