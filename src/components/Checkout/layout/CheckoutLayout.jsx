// CheckoutLayout.jsx

import PageTitle from "./PageTitle";
// import CheckoutSummary from "../summary/CheckoutSummary";
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
import OrderConfirmedOverlay from "../overlay/OrderConfirmedOverlay";



const CheckoutLayout = () => {

  const [submitCount, setSubmitCount] = useState(0);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  const location = useLocation();

  const checkoutData =
    location.state ||
    JSON.parse(localStorage.getItem("checkoutData")) ||
    {};

  const checkoutItems = checkoutData.items || [];

  const hasRentalItem = checkoutItems.some(
    item => item.type === "rental"
  );

  const activePromo = checkoutData.activePromo || null;

  const [deliveryType, setDeliveryType] = useState("standard");

  const totals = calculateTotals(
    checkoutItems,
    activePromo,
    deliveryType
  );

  const handlePlaceOrder = () => {

    /* trigger validation */
    setSubmitCount(prev => prev + 1);

    /*
      wait for validation states
      to update before checking
    */
    setTimeout(() => {

      const hasFieldErrors =
        Object.values(fieldErrors)
          .some(Boolean);

      /*
        CONSENT ERRORS
      */
      const consentErrors =
        document.querySelectorAll(
          ".checkout-consent-row.has-error"
        );

      const hasConsentErrors =
        consentErrors.length > 0;

      /*
        STOP FLOW
      */
      if (
        hasFieldErrors ||
        hasConsentErrors
      ) {
        return;
      }

      /*
        PROCESSING STATE
      */
      setIsProcessingOrder(true);

      const storeState = import('../../../store/checkoutStore').then(m => m.default.getState());
      storeState.then(async (state) => {
        const contact = state.contact;
        const address = state.address;
        const orderData = {
          orderId: `HOK-ORD-${Date.now()}`,
          customerName: `${contact.firstName} ${contact.lastName}`,
          customerEmail: contact.email,
          customerPhone: contact.whatsapp,
          customerCity: address.city,
          customerState: address.state,
          address: `${address.address1}, ${address.city}, ${address.state} - ${address.pin}`,
          mode: hasRentalItem ? 'Rental' : 'Buy',
          discount: activePromo ? activePromo.discount : 0,
          items: checkoutItems.map(item => ({
            productId: item.id || item._id,
            productName: item.title || item.name,
            designer: item.designer,
            mode: item.type === 'rental' ? 'Rental' : 'Buy',
            size: item.size || 'M',
            quantity: item.quantity || 1,
            rentalStartDate: item.rentalDates?.start,
            rentalEndDate: item.rentalDates?.end,
            amount: item.price || item.modes?.rent?.pricing?.pricePerDay,
          }))
        };

        try {
          const res = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
          });
          const result = await res.json();
          if (result.success) {
            // clear cart if needed
            localStorage.removeItem('checkoutData');
          } else {
            console.error("Order failed:", result.message);
          }
        } catch (error) {
          console.error("Order network error:", error);
        } finally {
          setIsProcessingOrder(false);
          setIsOrderConfirmed(true);
        }
      });

    }, 0);

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
          <DeliverySection
            deliveryType={deliveryType}
            setDeliveryType={setDeliveryType}
            checkoutItems={checkoutItems}
          />
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
            isProcessingOrder={isProcessingOrder}
            deliveryType={deliveryType}
          />
        </div>


      </div>
      <OrderConfirmedOverlay
        isOpen={isOrderConfirmed}
        cartItems={checkoutItems}
        activePromo={activePromo}
        totals={totals}
        onClose={() =>
          setIsOrderConfirmed(false)
        }
      />
      {hasRentalItem && (
        <PolicyStrip />
      )}

    </div>
  );
};

export default CheckoutLayout;