// CheckoutLayout.jsx

import PageTitle from "./PageTitle";
import CheckoutSummary from "../summary/CheckoutSummary";
import ProgressStrip from "./ProgressStrip";
import "../../../styles/checkout/layout/checkout-layout.css";

// FORM COMPONENT

import ContactSection from "../sections/ContactSection";
import AddressSection from "../sections/AddressSection";
import DeliverySection from "../sections/DeliverySection";
import FulfilmentSection from "../sections/FulfilmentSection";
import PaymentSection from "../sections/PaymentSection";
import ReviewSection from "../sections/ReviewSection";

const CheckoutLayout = () => {
  return (
    <div className="checkout-layout">

      <ProgressStrip />

      <PageTitle />

      {/* 4.2 Two-Column Grid */}
      <div className="checkout-layout__grid">

        {/* Left column — Fluid (1fr) */}
        <div className="checkout-layout__left">
          <ContactSection />
          <AddressSection />
          <DeliverySection />
          <FulfilmentSection />
          <PaymentSection />
          <ReviewSection />
        </div>

        {/* Right column — Fixed 340px */}
        <div className="checkout-layout__summary">
          <CheckoutSummary />
        </div>
        

      </div>
      <div className="policy-strip">

      {/* 01 */}
      <div className="policy-item">
        <div className="policy-number">01</div>

        <h3 className="policy-title">
          Rental Returns
        </h3>

        <p className="policy-text">
          Return your piece by the agreed date using our prepaid return label.
          A one-day cleaning buffer is built in automatically. Late returns may
          incur additional charges per our policy.
        </p>
      </div>

      {/* 02 */}
      <div className="policy-item">
        <div className="policy-number">02</div>

        <h3 className="policy-title">
          Damage & Deposit
        </h3>

        <p className="policy-text">
          Security deposits are refunded within 3–5 business days after return
          inspection. Normal wear is accepted without charge. Significant damage
          may result in partial or full withholding.
        </p>
      </div>

      {/* 03 */}
      <div className="policy-item">
        <div className="policy-number">03</div>

        <h3 className="policy-title">
          Delivery Promise
        </h3>

        <p className="policy-text">
          Rental pieces arrive 2 days before your event date. New purchases ship
          within 3–5 business days. Preloved pieces ship within 2 business days
          of order confirmation.
        </p>
      </div>

    </div>

    </div>
  );
};

export default CheckoutLayout;