// CheckoutLayout.jsx

import PageTitle from "./PageTitle";
// import CheckoutSummary from "../summary/CheckoutSummary";
import ProgressStrip from "./ProgressStrip";
import "../../../styles/checkout/layout/checkout-layout.css";
import { useLocation } from "react-router-dom";


import ContactSection from "../sections/ContactSection";
import AddressSection from "../sections/AddressSection";
import DeliverySection from "../sections/DeliverySection";
import FulfilmentSection from "../sections/FulfilmentSection";
import PaymentSection from "../sections/PaymentSection";
import ReviewSection from "../sections/ReviewSection";
import { OrderSummary, PolicyStrip } from "../../Cart";
import CheckoutSummary from "../summary/CheckoutSummary";

import { calculateTotals } from "../../../utils/cart/calculateTotals";



const CheckoutLayout = () => {


  const location = useLocation();

  const checkoutData =
    location.state ||
    JSON.parse(localStorage.getItem("checkoutData")) ||
    {};

  const checkoutItems = checkoutData.items || [];
  const activePromo = checkoutData.activePromo || null;

  const deliveryType = "standard";

  const totals = calculateTotals(
    checkoutItems,
    activePromo
  );

  return (
    <div className="checkout-layout">

      <ProgressStrip />

      <PageTitle
        cartItems={checkoutItems}
        grandTotal={totals.grandTotal}
        deliveryType={deliveryType}
      />

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
          <CheckoutSummary
            cartItems={checkoutItems}
            activePromo={activePromo}
          />
        </div>


      </div>
      <PolicyStrip />

    </div>
  );
};

export default CheckoutLayout;