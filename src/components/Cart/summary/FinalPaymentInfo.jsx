import React from "react";
import { ShieldCheck, RefreshCcw, Truck } from "lucide-react";

import "../../../styles/cart/summary/final-payment-info.css";

const FinalPaymentInfo = () => {
  return (
    <div className="final-payment">

      {/* DIVIDER */}
      <div className="final-divider" />

      {/* TRUST LIST */}
      <div className="final-trust-list">

        <div className="final-trust-item">
          <ShieldCheck className="final-icon" />
          <span>Every piece quality-verified before dispatch</span>
        </div>

        <div className="final-trust-item">
          <RefreshCcw className="final-icon" />
          <span>Security deposits refunded within 3–5 business days</span>
        </div>

        <div className="final-trust-item">
          <Truck className="final-icon" />
          <span>Pan-India shipping · Rentals arrive 2 days before event</span>
        </div>

      </div>

      {/* PAYMENT METHODS */}
      <div className="final-payments">
        <span>UPI</span>
        <span>VISA</span>
        <span>MASTERCARD</span>
        <span>NET BANKING</span>
        <span>EMI</span>
      </div>

    </div>
  );
};

export default FinalPaymentInfo;