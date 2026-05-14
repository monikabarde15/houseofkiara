import React from "react";
import { Check } from "lucide-react";
import "../../../../styles/checkout/mobile/layout/mobile-progress-strip.css";

const MobileProgressStrip = () => {
  return (
    <div className="mobile-progress-strip">
      <div className="mobile-progress-inner">
        {/* Step 1 - Cart (clickable, done) */}
        <a href="/cart" className="mobile-prog-step done">
          <span className="mobile-prog-circle done">
            <Check size={8} strokeWidth={1.8} />
          </span>
          <span className="mobile-prog-lbl">Cart</span>
        </a>

        <div className="mobile-prog-sep" />

        {/* Step 2 - Checkout (active) */}
        <div className="mobile-prog-step active">
          <span className="mobile-prog-circle active">2</span>
          <span className="mobile-prog-lbl">Checkout</span>
        </div>

        <div className="mobile-prog-sep" />

        {/* Step 3 - Confirmation (inactive) */}
        <div className="mobile-prog-step">
          <span className="mobile-prog-circle">3</span>
          <span className="mobile-prog-lbl">Confirmation</span>
        </div>
      </div>
    </div>
  );
};

export default MobileProgressStrip;