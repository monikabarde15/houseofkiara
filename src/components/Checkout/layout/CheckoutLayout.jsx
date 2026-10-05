// CheckoutLayout.jsx

import PageTitle from "./PageTitle";
// import CheckoutSummary from "../summary/CheckoutSummary";
import "../../../styles/checkout/layout/checkout-layout.css";
import { useLocation, useNavigate } from "react-router-dom";

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
  const [completedOrderData, setCompletedOrderData] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const checkoutData =
    location.state || JSON.parse(localStorage.getItem("checkoutData")) || {};

  const checkoutItems = checkoutData.items || [];

  const hasRentalItem = checkoutItems.some((item) => item.type === "rental");

  const activePromo = checkoutData.activePromo || null;

  const [deliveryType, setDeliveryType] = useState("standard");

  const totals = calculateTotals(checkoutItems, activePromo, deliveryType);

  useEffect(() => {
    if (checkoutItems.length === 0 && !isOrderConfirmed) {
      navigate("/products", { replace: true });
    }
  }, [checkoutItems.length, isOrderConfirmed, navigate]);

  const handlePlaceOrder = () => {
    /* trigger validation */
    setSubmitCount((prev) => prev + 1);

    /*
      wait for validation states
      to update before checking
    */
    setTimeout(() => {
      const hasFieldErrors = Object.values(fieldErrors).some(Boolean);

      /*
        CONSENT ERRORS
      */
      const consentErrors = document.querySelectorAll(
        ".checkout-consent-row.has-error",
      );

      const hasConsentErrors = consentErrors.length > 0;

      /*
        STOP FLOW
      */
      if (hasFieldErrors || hasConsentErrors) {
        return;
      }

      /*
        PROCESSING STATE
      */
      setIsProcessingOrder(true);

      const storeState = import("../../../store/checkoutStore").then((m) =>
        m.default.getState(),
      );
      storeState.then(async (state) => {
        const address = state.address;
        const addressString = `${address.address1}, ${address.city}, ${address.state} - ${address.pin}`;

        const authStore = await import("../../../store/authStore").then((m) =>
          m.default.getState(),
        );
        const token = authStore.token;

        if (!token) {
          console.error("No token available for checkout");
          setIsProcessingOrder(false);
          return;
        }

        try {
          const backendUrl =
            import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
          const res = await fetch("/api/customer/auth/orders/place", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              items: checkoutItems,
              totals: totals,
              address: addressString,
              paymentMethod: state.paymentMethod,
              activePromo: activePromo,
            }),
          });
          const result = await res.json();
          if (result.success) {
            // Clear checkout session
            localStorage.removeItem("checkoutData");

            // Clear cart
            const cartStore = await import("../../../store/cartStore").then(
              (m) => m.default.getState(),
            );
            cartStore.clearCart();

            // Remove ordered items from wishlist
            const wishlistStore =
              await import("../../../store/wishlistStore").then((m) =>
                m.default.getState(),
              );
            const wishlistItems = wishlistStore.items;

            checkoutItems.forEach((item) => {
              const id = item.id || item._id;
              if (wishlistItems.includes(id)) {
                wishlistStore.toggleWishlist(id);
              }
            });

            // Update order stats
            const authStore = await import("../../../store/authStore").then(
              (m) => m.default.getState(),
            );
            authStore.fetchOrderStats();

            // Store snapshot for overlay before clearing state
            setCompletedOrderData({
              items: checkoutItems,
              totals: totals,
              activePromo: activePromo
            });

            // Show confirmation overlay
            setIsOrderConfirmed(true);
            
            // Clear React Router state to prevent back-button ordering
            navigate("/checkout", { replace: true, state: null });
          } else {
            console.error("Order failed:", result.message);
            alert("Failed to place order: " + result.message);
          }
        } catch (error) {
          console.error("Order network error:", error);
          alert("Network error while placing order.");
        } finally {
          setIsProcessingOrder(false);
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
        "First name (Contact & Account)": "first-name",

        "Last name (Contact & Account)": "last-name",

        "Email address (Contact & Account)": "email-address",

        "WhatsApp number (Contact & Account)": "whatsapp-number",

        "Address line 1 (Delivery Address)": "address-line-1",

        "City (Delivery Address)": "city",

        "State (Delivery Address)": "state",

        "PIN code (Delivery Address)": "pin-code",
      };

      const invalidTargets = summaryErrors
        .map((errorKey) => {
          const fieldId = fieldMap[errorKey];

          return document.getElementById(fieldId);
        })
        .filter(Boolean);

      /*
        find top-most invalid field
      */
      const firstInvalidField = invalidTargets.sort(
        (a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top,
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
    const consentGroup = document.getElementById("consent-group");

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
        cartItems={completedOrderData?.items || checkoutItems}
        activePromo={completedOrderData?.activePromo || activePromo}
        totals={completedOrderData?.totals || totals}
        onClose={() => setIsOrderConfirmed(false)}
      />
      {hasRentalItem && <PolicyStrip />}
    </div>
  );
};

export default CheckoutLayout;
