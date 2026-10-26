import React, { useState } from "react";
import { X, Truck, Shield, RefreshCw } from "lucide-react";
import SummarySection from "../../../Cart/summary/SummarySection";
import SummaryRow from "../../../Cart/summary/SummaryRow";
import GSTBreakdown from "../../../Cart/summary/GSTBreakdown";
import "../../../../styles/checkout/mobile/drawer/mobile-summary-drawer.css";

const MobileSummaryDrawer = ({
  isOpen,
  onClose,
  cartItems = [],
  activePromo = null,
  deliveryType = "standard",
  totals = {},
}) => {
  if (!isOpen) return null;

  const {
    subtotal = 0,
    discount = 0,
    rentalGST = 0,
    prelovedGST = 0,
    newGST = 0,
    totalGST = 0,
    grandTotal = 0,
    hasRental = false,
    itemsGrouped = { rental: [], preloved: [], new: [] },
    deliveryCharge = 0,
  } = totals;

  const formatShortDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  };

  // Build estimated delivery text
  const deliveryMessages = [];

  if (itemsGrouped.rental.length > 0) {
    const rentalItem = itemsGrouped.rental[0];
    deliveryMessages.push(
      `${rentalItem.productName} arrives by ${formatShortDate(rentalItem.startDate)}`
    );
  }

  if (itemsGrouped.preloved.length > 0) {
    const prelovedItem = itemsGrouped.preloved[0];
    deliveryMessages.push(
      `${prelovedItem.productName} ships within ${
        deliveryType === "express" ? "1 day" : "2 days"
      } of confirmation`
    );
  }

  if (itemsGrouped.new.length > 0) {
    const newItem = itemsGrouped.new[0];
    deliveryMessages.push(
      `${newItem.productName} ships within ${
        deliveryType === "express" ? "1–2 days" : "3–5 days"
      }`
    );
  }

  const estimatedDeliveryText = deliveryMessages.join(" · ");

  return (
    <div className="mobile-drawer-overlay open" onClick={onClose}>
      <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Handle */}
        <div className="mobile-drawer-handle">
          <div className="mobile-drawer-title">
            Your <em>Order</em>
          </div>
          <button className="mobile-drawer-close" onClick={onClose}>
            <X size={14} strokeWidth={1.8} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="mobile-drawer-body">
          {/* ITEM GROUPS */}
          <div className="mobile-drawer-items">
            {itemsGrouped.rental.length > 0 && (
              <SummarySection
                title="Rental"
                items={itemsGrouped.rental}
                showDeposit={hasRental}
              />
            )}
            {itemsGrouped.preloved.length > 0 && (
              <SummarySection title="Preloved" items={itemsGrouped.preloved} />
            )}
            {itemsGrouped.new.length > 0 && (
              <SummarySection title="Buy New" items={itemsGrouped.new} />
            )}
          </div>

          {/* PRICE SUMMARY */}
          <div className="mobile-drawer-price">
            <SummaryRow title="Subtotal" value={subtotal} />

            {activePromo && discount > 0 && (
              <SummaryRow
                title={`Promo — ${activePromo.code}`}
                subtitle={activePromo.label}
                value={`- ₹${discount.toLocaleString()}`}
                type="discount"
              />
            )}

            <SummaryRow
              title="Delivery"
              subtitle={
                deliveryType === "express"
                  ? "Express delivery · 1–2 business days"
                  : "Standard · 3–5 business days"
              }
              value={deliveryCharge > 0 ? `₹${deliveryCharge.toLocaleString()}` : "Free"}
              type="dim"
            />

            {/* GST - Reusing desktop component */}
            <GSTBreakdown
              rentalGST={rentalGST}
              prelovedGST={prelovedGST}
              newGST={newGST}
              totalGST={totalGST}
            />
          </div>

          {/* DIVIDER */}
          <div className="mobile-drawer-divider" />

                  {/* TOTAL DUE */}
                  <div className="mobile-drawer-total">
                      <div className="mobile-drawer-total-row">
                          <span className="mobile-drawer-total-label">Total due today</span>
                          <span className="mobile-drawer-total-amount">₹{grandTotal.toLocaleString()}</span>
                      </div>
                      <div className="mobile-drawer-total-sub">
                          {deliveryType === "express"
                              ? "Incl. express delivery · Excl. ₹15,000 deposit"
                              : "Incl. free delivery · Excl. ₹15,000 deposit"}
                      </div>
                  </div>

          {/* DEPOSIT NOTE */}
          {hasRental && (
            <div className="mobile-drawer-deposit-note">
              <p>
                <strong>* Security deposit (₹15,000)</strong> not due today — our ops team will
                contact you on WhatsApp before dispatch to arrange this separately. Fully refunded
                within 3–5 business days of return inspection.
              </p>
            </div>
          )}

          {/* ESTIMATED DELIVERY */}
          <div className="mobile-drawer-delivery">
            <Truck size={14} strokeWidth={1.75} />
            <div className="mobile-drawer-delivery-content">
              <span className="mobile-drawer-delivery-label">Estimated delivery</span>
              <p className="mobile-drawer-delivery-text">{estimatedDeliveryText}</p>
            </div>
          </div>

          {/* TRUST LIST - Mobile spec Page 29 (2 items) */}
          <div className="mobile-drawer-trust">
            <div className="mobile-drawer-trust-item">
              <Shield size={12} strokeWidth={1.4} />
              <span>Every piece quality-verified before dispatch</span>
            </div>
            <div className="mobile-drawer-trust-item">
              <RefreshCw size={12} strokeWidth={1.4} />
              <span>Deposits refunded within 3–5 business days</span>
            </div>
          </div>

          {/* PAYMENT MARKS */}
          <div className="mobile-drawer-payment-marks">
            <span>UPI</span>
            <span>Visa</span>
            <span>Mastercard</span>
            <span>RuPay</span>
            <span>Net Banking</span>
            <span>EMI</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileSummaryDrawer;