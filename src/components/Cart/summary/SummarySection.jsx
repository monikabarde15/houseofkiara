// src/components/Cart/summary/SummarySection.jsx

import React from "react";
import SummaryRow from "./SummaryRow";
import "../../../styles/cart/summary/order-summary.css"

const getModeClass = (title) => {
    if (title === "Rental") return "rental";
    if (title === "Preloved") return "preloved";
    return "new";
};

const truncate = (text = "", max = 30) => {
    if (text.length <= max) return text;

    const truncated = text.slice(0, max);
    const lastSpace = truncated.lastIndexOf(" ");

    return lastSpace > 0
        ? truncated.slice(0, lastSpace) + "..."
        : truncated + "...";
};

const getSubtitle = (item) => {
    if (item.type === "rental") {

        const start = new Date(item.startDate);
        const end = new Date(item.endDate);

        //  SAFE WINDOW CALCULATION
        const windowDays =
            item.windowDays ||
            Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;

        // FORMAT DATE RANGE (SPEC STYLE)
        const startMonth = start.toLocaleString("en-IN", { month: "short" });
        const endMonth = end.toLocaleString("en-IN", { month: "short" });

        const startDay = start.getDate();
        const endDay = end.getDate();

        const dateRange =
            startMonth === endMonth
                ? `${startMonth} ${startDay}–${endDay}`
                : `${startMonth} ${startDay}–${endMonth} ${endDay}`;

        return `${windowDays}-day window · ${dateRange}`;
    }

    if (item.type === "preloved") {
        return "Final sale · non-returnable";
    }

    return `Size ${item.size} · incl. GST`;
};

const SummarySection = ({ title, items, showDeposit }) => {
    if (!items.length) return null;

    return (
        <div className="summary-section">

            <div className={`summary-section-head ${getModeClass(title)}`}>
                <span className="summary-dot"></span>
                <span className="summary-label">{title}</span>
            </div>

            {items.map((item) => (
                <SummaryRow
                    key={item.id}
                    title={truncate(item.productName)}
                    subtitle={getSubtitle(item)}
                    value={item.basePrice}
                />
            ))}

            {/* ✅ DEPOSIT HERE */}
            {showDeposit && (
                <SummaryRow
                    title="Security deposit"
                    subtitle="Collected separately by ops team"
                    value="15,000 *"
                    type="deposit"
                />
            )}

        </div>
    );
};

export default SummarySection;