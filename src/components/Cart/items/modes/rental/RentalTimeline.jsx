import React from "react";
import "../../../../../styles/cart/items/rental-timeline.css";

/* ============================= */
/* HELPERS */
/* ============================= */

const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short"
    });
};

const formatDay = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-IN", {
        weekday: "long"
    });
};


/* ============================= */
/* COMPONENT */
/* ============================= */

const RentalTimeline = ({ booking }) => {

    if (!booking) return null;

    const windowDays = booking?.rentalWindowDays || 5;
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