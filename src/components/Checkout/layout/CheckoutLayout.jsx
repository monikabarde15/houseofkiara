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
import { useState, useEffect } from "react";
import { calculateTotals } from "../../../utils/cart/calculateTotals";



const CheckoutLayout = () => {

  const [submitCount, setSubmitCount] = useState(0);

  const [fieldErrors, setFieldErrors] = useState({});

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

  const handlePlaceOrder = () => {

    setSubmitCount(prev => prev + 1);
  };

  const summaryErrors = Object.entries(fieldErrors)
    .filter(([, value]) => value)
    .map(([key]) => key);

  const errorCount = summaryErrors.length;

  useEffect(() => {

    /* only after first submit */
    if (submitCount === 0) return;

    /*
      FIELD ERRORS
      take priority over consent errors
    */
    if (summaryErrors.length > 0) {

      const fieldMap = {

        "First name (Contact & Account)":
          "first-name",

        "Last name (Contact & Account)":
          "last-name",

        "Email address (Contact & Account)":
          "email-address",

        "WhatsApp number (Contact & Account)":
          "whatsapp-number",

        "Address line 1 (Delivery Address)":
          "address-line-1",

        "City (Delivery Address)":
          "city",

        "State (Delivery Address)":
          "state",

        "PIN code (Delivery Address)":
          "pin-code",
      };

      const invalidTargets =
        summaryErrors
          .map((errorKey) => {

            const fieldId =
              fieldMap[errorKey];

            return document.getElementById(fieldId);

          })
          .filter(Boolean);


      /*
        find top-most invalid field
      */
      const firstInvalidField =
        invalidTargets.sort(
          (a, b) =>
            a.getBoundingClientRect().top -
            b.getBoundingClientRect().top
        )[0];


      if (firstInvalidField) {

        firstInvalidField.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

      }

      return;
    }

    /*
      CONSENT ERRORS ONLY
    */
    const consentGroup =
      document.getElementById(
        "consent-group"
      );

    if (consentGroup) {

      consentGroup.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

    }

  }, [submitCount]);

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
          <ContactSection
            submitCount={submitCount}
            setFieldErrors={setFieldErrors}
          />
          <AddressSection
            submitCount={submitCount}
            setFieldErrors={setFieldErrors}
          />
          <DeliverySection />
          <FulfilmentSection />
          <PaymentSection />
          <ReviewSection checkoutItems={checkoutItems} />
        </div>

        {/* Right column — Fixed 340px */}
        <div className="checkout-layout__summary">
          <CheckoutSummary
            cartItems={checkoutItems}
            activePromo={activePromo}
            onPlaceOrder={handlePlaceOrder}
            errorCount={errorCount}
            fieldErrors={summaryErrors}
          />
        </div>


      </div>
      <PolicyStrip />

    </div>
  );
};

export default CheckoutLayout;