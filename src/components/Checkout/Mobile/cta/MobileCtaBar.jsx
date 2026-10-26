import React, { forwardRef } from "react";
import { ChevronDown, LockKeyhole } from "lucide-react";
import "../../../../styles/checkout/mobile/cta/mobile-cta-bar.css";

const MobileCtaBar = forwardRef(({
  grandTotal = 0,
  deliveryType = "standard",
  onPlaceOrder,
  isProcessingOrder = false,
  onOpenDrawer,
}, ref) => {
  return (
    <div className="mobile-cta-bar" id="mobile-cta-bar" ref={ref}>
      {/* ========================================
          SUMMARY TAP ROW (Opens Drawer)
      ======================================== */}
      <div className="mobile-cta-summary-tap" onClick={onOpenDrawer}>
        <div className="mobile-cta-summary-left">
          <div className="mobile-cta-summary-label">Total due today</div>
          <div className="mobile-cta-summary-total" id="cta-total">
            <span className="mobile-cta-currency">₹</span>
            {grandTotal.toLocaleString()}
          </div>
        </div>

        <div className="mobile-cta-summary-right">
          <span className="mobile-cta-view-order">View order</span>
          <ChevronDown size={12} strokeWidth={1.5} id="cta-chevron" />
        </div>
      </div>

      {/* ========================================
          PLACE ORDER BUTTON
      ======================================== */}
      <button
        type="button"
        className={`mobile-cta-button ${isProcessingOrder ? "is-processing" : ""}`}
        onClick={onPlaceOrder}
        disabled={isProcessingOrder}
      >
        <span className="mobile-cta-button-shimmer"></span>
        {isProcessingOrder ? "Processing payment..." : `Place order`}
      </button>

      {/* ========================================
          SECURE NOTE & RETURN TO CART
      ======================================== */}
      <div className="mobile-cta-secure-note">
        <LockKeyhole size={10} strokeWidth={1.5} />
        <span>SSL encrypted · Secured by Razorpay</span>
      </div>

      <a href="/cart" className="mobile-cta-return-link">
        <span>Return to cart</span>
      </a>
    </div>
  );
});

MobileCtaBar.displayName = "MobileCtaBar";

export default MobileCtaBar;