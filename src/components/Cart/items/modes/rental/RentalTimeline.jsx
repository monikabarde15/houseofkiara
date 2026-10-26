// src\components\Cart\items\modes\rental\RentalTimeline.jsx
// src/components/Cart/items/modes/rental/RentalTimeline.jsx
import React from "react";
import "../../../../../styles/cart/items/rental-timeline.css";

/* ============================= */
/* HELPERS */
/* ============================= */

const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const day = d.getDate();
  const month = d.toLocaleString("en-IN", { month: "short" });
  return `${day} ${month}`;
};

const formatDay = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-IN", {
        weekday: "long"
    });
};

// ✅ Calculate window days from deliveryDate and returnDate
const calculateWindowDays = (deliveryDate, returnDate) => {
    if (!deliveryDate || !returnDate) return 5;
    
    const start = new Date(deliveryDate);
    const end = new Date(returnDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // +1 to include both start and end days
    // Example: April 20 to April 25 = 6 days (20,21,22,23,24,25)
    return diffDays + 1;
};

/* ============================= */
/* COMPONENT */
/* ============================= */

const RentalTimeline = ({ booking }) => {

    if (!booking) return null;

    // ✅ Calculate - don't look for stored value
    const windowDays = calculateWindowDays(
        booking?.deliveryDate, 
        booking?.returnDate
    );
    
    const windowLabel = `${windowDays}-Day Window`;

    return (
        <div className="cart-timeline">

            {/* DELIVERY */}
            <div className="cart-timeline__node">
                <div className="cart-timeline__header">
                    <div className="cart-timeline__node-label">
                        DELIVERY
                    </div>
                </div>

                <div className="cart-timeline__circle cart-timeline__circle--filled" />

                <div className="cart-timeline__date">
                    {formatDate(booking?.deliveryDate)}
                </div>

                <div className="cart-timeline__sub">
                    {formatDay(booking?.deliveryDate)}
                </div>
            </div>

            {/* EVENT */}
            <div className="cart-timeline__node">
                <div className="cart-timeline__header">
                    <div className="cart-timeline__window">
                        {windowLabel}
                    </div>
                    <div className="cart-timeline__node-label">
                        EVENT
                    </div>
                </div>

                <div className="cart-timeline__circle cart-timeline__circle--filled" />

                <div className="cart-timeline__date">
                    {formatDate(booking?.eventDate)}
                </div>

                <div className="cart-timeline__sub">
                    {formatDay(booking?.eventDate)}
                </div>
            </div>

            {/* RETURN */}
            <div className="cart-timeline__node">
                <div className="cart-timeline__header">
                    <div className="cart-timeline__node-label">
                        RETURN BY
                    </div>
                </div>

                <div className="cart-timeline__circle" />

                <div className="cart-timeline__date">
                    {formatDate(booking?.returnDate)}
                </div>

                <div className="cart-timeline__sub">
                    {formatDay(booking?.returnDate)}
                </div>
            </div>

        </div>
    );
};

export default RentalTimeline;