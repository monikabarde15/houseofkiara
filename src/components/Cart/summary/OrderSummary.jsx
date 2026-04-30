// src/components/Cart/summary/OrderSummary.jsx

import React from "react";
// import { useCartStore } from "../../../store/cartStore";
import { Lock } from "lucide-react";


import { calculateTotals } from "../../../utils/cart/calculateTotals";
import "../../../styles/cart/summary/order-summary.css"

import SummarySection from "./SummarySection";
import SummaryRow from "./SummaryRow";
import GSTBreakdown from "./GSTBreakdown";

const OrderSummary = ({ cartItems, activePromo,}) => {

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
      <div className="summary-section-head">
        <span className="summary-label">Order Summary</span>
      </div>

      {/* SECTIONS */}
      <SummarySection
        title="Rental"
        items={itemsGrouped.rental}
        showDeposit={hasRental}
      />

      <SummarySection
        title="Preloved"
        items={itemsGrouped.preloved}
      />

      <SummarySection title="Buy New" items={itemsGrouped.new} />

      {/* SUBTOTAL */}
      <SummaryRow
        title="Subtotal"
        value={subtotal}
      />

      {/* PROMO */}
      {discount > 0 && (
        <SummaryRow
          title="Discount"
          value={`- ${discount.toLocaleString()}`}
          type="discount"
        />
      )}

      {/* DELIVERY ROW */}
      <SummaryRow
        title="Delivery"
        subtitle="Calculated at checkout · depends on delivery address"
        value="TBD"
        type="dim"
      />


      {/* GST */}
      <GSTBreakdown
        rentalGST={rentalGST}
        prelovedGST={prelovedGST}
        newGST={newGST}
        totalGST={totalGST}
      />

      {/* GRAND TOTAL */}
      <div className="grand-total">
        <div>Total at Checkout</div>
        <div>₹{grandTotal.toLocaleString()}</div>

        <div className="grand-sub">
          {hasRental
            ? "Excl. delivery + ₹15,000 deposit"
            : "Excl. delivery charges"}
        </div>
      </div>

      {/* FINAL NOTES */}

      <div className="summary-notes">

        <p>
          * <strong>Security deposit (₹15,000)</strong> not collected here — our team contacts you before dispatch. Refunded within 3–5 business days of return inspection.
        </p>

        <p>
          † <strong>Delivery charge</strong> will be calculated at checkout based on your delivery address and the item's dispatch location. Charges vary by distance and courier zone.
        </p>

      </div>

      {/* CTA BUTTON */}

      <button className="checkout-btn">
        PROCEED TO CHECKOUT
      </button>

      {/* SSL NOTE */}

      <div className="ssl-note">
        <Lock className="ssl-icon" />
        <span>SSL encrypted · Secured by Razorpay</span>
      </div>



    </div>
  );
};

export default OrderSummary;