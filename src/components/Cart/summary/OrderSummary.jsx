// src/components/Cart/summary/OrderSummary.jsx

import React from "react";
import { Lock } from "lucide-react";

import { calculateTotals } from "../../../utils/cart/calculateTotals";
import "../../../styles/cart/summary/order-summary.css";

import SummarySection from "./SummarySection";
import SummaryRow from "./SummaryRow";
import GSTBreakdown from "./GSTBreakdown";
import FinalPaymentInfo from "./FinalPaymentInfo";

const OrderSummary = ({ cartItems, activePromo }) => {

  const totals = calculateTotals(cartItems, activePromo);

  const {
    subtotal,
    discount,
    rentalGST,
    prelovedGST,
    newGST,
    totalGST,
    grandTotal,
    hasRental,
    itemsGrouped,
  } = totals;

  return (
    <div className="order-summary">

      {/* =========================
          HEADER
      ========================= */}
      <div className="summary-eyebrow">
        Order Summary
      </div>

      {/* =========================
          ITEMS (UNCHANGED)
      ========================= */}
      <div className="summary-block">

        {itemsGrouped.rental.length > 0 && (
          <SummarySection
            title="Rental"
            items={itemsGrouped.rental}
            showDeposit={hasRental}
          />
        )}

        {itemsGrouped.preloved.length > 0 && (
          <SummarySection
            title="Preloved"
            items={itemsGrouped.preloved}
          />
        )}

        {itemsGrouped.new.length > 0 && (
          <SummarySection
            title="Buy New"
            items={itemsGrouped.new}
          />
        )}

      </div>

      {/* =========================
          PRICE SUMMARY (CLEAN)
      ========================= */}
      <div className="summary-block">

        {/* SUBTOTAL */}
        <SummaryRow
          title="Subtotal"
          value={subtotal}
        />

        {/* DISCOUNT */}
        {discount > 0 && (
          <SummaryRow
            title="Discount"
            value={`- ${discount.toLocaleString()}`}
            type="discount"
          />
        )}

        {/* DELIVERY (CUSTOM - IMPORTANT) */}
        <SummaryRow
          title="Delivery"
          subtitle="Calculated at checkout · depends on delivery address"
          value="TBD"
          type="dim"
        />

        {/* GST (KEEP LOGIC COMPONENT) */}
        <GSTBreakdown
          rentalGST={rentalGST}
          prelovedGST={prelovedGST}
          newGST={newGST}
          totalGST={totalGST}
        />

      </div>

      {/* =========================
          DIVIDER
      ========================= */}
      <div className="summary-divider" />

      {/* =========================
          GRAND TOTAL
      ========================= */}
      <div className="summary-total">

        <div className="summary-total-top">
          <span className="summary-total-label">
            Total at Checkout
          </span>

          <span className="summary-total-value">
            ₹{grandTotal.toLocaleString()}
          </span>
        </div>

        <div className="summary-total-sub">
          {hasRental
            ? "Excl. delivery + ₹15,000 security deposit"
            : "Excl. delivery charges"}
        </div>

      </div>

      {/* DIVIDER BELOW TOTAL */}
      <div className="summary-sub-divider" />

      {/* =========================
          NOTES
      ========================= */}
      <div className="summary-notes">

        {hasRental && (
          <p>
            <strong>* Security deposit (₹15,000)</strong> not collected here — our team contacts you before dispatch. Refunded within 3–5 business days of return inspection.
          </p>
        )}

        <p>
          <strong>† Delivery charge</strong> will be calculated at checkout based on your delivery address and dispatch location.
        </p>

      </div>

      {/* =========================
          CTA
      ========================= */}
      <button className="checkout-btn">
        Proceed to Checkout
      </button>

      {/* =========================
          SECURITY NOTE
      ========================= */}
      <div className="ssl-note">
        <Lock className="ssl-icon" />
        <span>SSL encrypted · Secured by Razorpay</span>
      </div>

      {/* =========================
          Final payment Notes
      ========================= */}

      <FinalPaymentInfo/>

    </div>
  );
};

export default OrderSummary;