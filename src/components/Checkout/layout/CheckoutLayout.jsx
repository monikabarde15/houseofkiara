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

    </div>
  );
};

export default CheckoutLayout;