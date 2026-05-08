// src\components\Checkout\summary\CheckoutSummary.jsx
import React from "react";

import { calculateTotals } from "../../../utils/cart/calculateTotals";
import { Truck, ChevronLeft, LockKeyhole } from "lucide-react";
import SummarySection from "../../Cart/summary/SummarySection";
import SummaryRow from "../../Cart/summary/SummaryRow";
import GSTBreakdown from "../../Cart/summary/GSTBreakdown";

import "../../../styles/checkout/summary/checkout-summary.css";
import TrustList from "../ui/TrustList";

const CheckoutSummary = ({
    cartItems,
    activePromo,
    deliveryType = "standard"
}) => {


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

        <div className="checkout-summary">

            {/* ========================================
          HEADER
      ======================================== */}

            <div className="checkout-summary-eyebrow">
                Order Summary
            </div>

            {/* ========================================
          ITEM GROUPS
      ======================================== */}

            <div className="checkout-summary-block">

                {/* RENTAL */}
                {itemsGrouped.rental.length > 0 && (
                    <SummarySection
                        title="Rental"
                        items={itemsGrouped.rental}
                        showDeposit={hasRental}
                    />
                )}

                {/* PRELOVED */}
                {itemsGrouped.preloved.length > 0 && (
                    <SummarySection
                        title="Preloved"
                        items={itemsGrouped.preloved}
                    />
                )}

                {/* BUY NEW */}
                {itemsGrouped.new.length > 0 && (
                    <SummarySection
                        title="Buy New"
                        items={itemsGrouped.new}
                    />
                )}

            </div>

            {/* ========================================
          PRICE SUMMARY
      ======================================== */}

            <div className="checkout-summary-block">

                {/* SUBTOTAL */}
                <SummaryRow
                    title="Subtotal"
                    value={subtotal}
                />

                {/* PROMO */}
                {activePromo && discount > 0 && (
                    <SummaryRow
                        title={`Promo — ${activePromo.code}`}
                        subtitle={activePromo.label}
                        value={`- ₹${discount.toLocaleString()}`}
                        type="discount"
                    />
                )}

                {/* DELIVERY */}
                <SummaryRow
                    title="Delivery"
                    subtitle={
                        deliveryType === "express"
                            ? "Express delivery · 1–2 business days"
                            : "Standard · 3–5 business days"
                    }
                    value={
                        deliveryType === "express"
                            ? "₹1,500"
                            : "Free"
                    }
                    type="dim"
                />

                {/* GST */}
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
            <div className="checkout-summary-divider" />

            {/* ========================================
          TOTAL DUE
      ======================================== */}

            <div className="checkout-summary-total">

                <div className="checkout-summary-total-top">

                    <div className="checkout-summary-total-left">

                        <div className="checkout-summary-total-label">
                            Total due today
                        </div>

                        <div className="checkout-summary-total-sub">
                            Incl. free standard delivery · Excl. ₹15,000 deposit
                        </div>

                    </div>

                    <div className="checkout-summary-total-value">
                        ₹{grandTotal.toLocaleString()}
                    </div>

                </div>

            </div>

            {/* DIVIDER BELOW TOTAL
            <div className="checkout-summary-sub-divider" /> */}

            {/* ========================================
                DEPOSIT NOTE
            ======================================== */}

            {hasRental && (
                <div className="checkout-summary-note">

                    <p>
                        <strong>
                            * Security deposit (₹15,000)
                        </strong>{" "}
                        not due today — our ops team will contact you on
                        WhatsApp before dispatch to arrange this separately.
                        Fully refunded within 3–5 business days of return
                        inspection.
                    </p>

                </div>
            )}


            {/* ========================================
    ESTIMATED DELIVERY
======================================== */}

            <div className="checkout-est-delivery">

                <Truck
                    size={13}
                    strokeWidth={1.75}
                    className="checkout-est-delivery__icon"
                />

                <div className="checkout-est-delivery__content">

                    <span className="checkout-est-delivery__label">
                        Estimated delivery
                    </span>

                    <p className="checkout-est-delivery__text">
                        Rental arrives 14 Nov · Preloved ships within 2 days
                        of confirmation · Sherwani ships within 3–5 days
                    </p>

                </div>

            </div>

            {/* ========================================
    CHECKOUT CTA ACTIONS
======================================== */}

            <button
                type="button"
                className="checkout-cta-btn"

            >
                <span className="checkout-cta-btn__shimmer"></span>

                Place order · ₹{grandTotal.toLocaleString()}
            </button>


            <a
                href="#cart"
                className="checkout-cta-back"
            >
                <ChevronLeft size={10} strokeWidth={1.7} />

                <span>Return to cart</span>
            </a>


            <div className="checkout-secure-note">

                <LockKeyhole
                    size={11}
                    strokeWidth={1.5}
                    className="checkout-secure-note__icon"
                />

                <span>
                    SSL encrypted · Secured by Razorpay
                </span>

            </div>


            <TrustList />

        </div>

    );
};

export default CheckoutSummary;