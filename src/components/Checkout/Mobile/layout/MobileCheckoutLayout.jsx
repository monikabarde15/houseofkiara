import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import MobileProgressStrip from "./MobileProgressStrip";
import MobilePageTitle from "./MobilePageTitle";

// Form section
import ContactSection from "../../sections/ContactSection";
import AddressSection from "../../sections/AddressSection";
import DeliverySection from "../../sections/DeliverySection";
import FulfilmentSection from "../../sections/FulfilmentSection";
import PaymentSection from "../../sections/PaymentSection";
import ReviewSection from "../../sections/ReviewSection";

import { calculateTotals } from "../../../../utils/cart/calculateTotals";
import "../../../../styles/checkout/mobile/layout/mobile-checkout-layout.css";
import MobileCtaBar from "../cta/MobileCtaBar";

const MobileCheckoutLayout = () => {
    // ========================================
    // SAME DATA LOGIC AS DESKTOP
    // ========================================
    const location = useLocation();
    const pageRef = useRef(null);
  const ctaBarRef = useRef(null);
  const [isDocked, setIsDocked] = useState(false);

    const [submitCount, setSubmitCount] = useState(0);
    const [fieldErrors, setFieldErrors] = useState({});
    const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);
    const [isProcessingOrder, setIsProcessingOrder] = useState(false);
    const [deliveryType, setDeliveryType] = useState("standard");

    const checkoutData =
        location.state ||
        JSON.parse(localStorage.getItem("checkoutData")) ||
        {};

    const checkoutItems = checkoutData.items || [];
    const activePromo = checkoutData.activePromo || null;

    const totals = calculateTotals(checkoutItems, activePromo, deliveryType);
    const hasRentalItem = checkoutItems.some(item => item.type === "rental");

    const handlePlaceOrder = () => {
        setSubmitCount(prev => prev + 1);

        setTimeout(() => {
            const hasFieldErrors = Object.values(fieldErrors).some(Boolean);
            const consentErrors = document.querySelectorAll(".checkout-consent-row.has-error");
            const hasConsentErrors = consentErrors.length > 0;

            if (hasFieldErrors || hasConsentErrors) return;

            setIsProcessingOrder(true);

            setTimeout(() => {
                setIsProcessingOrder(false);
                setIsOrderConfirmed(true);
            }, 2000);
        }, 0);
    };

    const summaryErrors = Object.entries(fieldErrors)
        .filter(([, value]) => value)
        .map(([key]) => key);

    const errorCount = summaryErrors.length;

    useEffect(() => {
        if (submitCount === 0) return;

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
                .map(errorKey => document.getElementById(fieldMap[errorKey]))
                .filter(Boolean);

            const firstInvalidField = invalidTargets.sort(
                (a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top
            )[0];

            if (firstInvalidField) {
                firstInvalidField.scrollIntoView({ behavior: "smooth", block: "center" });
            }
            return;
        }

        const consentGroup = document.getElementById("consent-group");
        if (consentGroup) {
            consentGroup.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [submitCount, summaryErrors]);



    // ========================================
    // INTERSECTION OBSERVER FOR DOCKING
    // ========================================
    useEffect(() => {
        const sentinel = document.getElementById("cta-sentinel");
        const ctaBar = document.getElementById("mobile-cta-bar");
        const page = document.getElementById("mobile-checkout-page");

        if (!sentinel || !ctaBar || !page) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const sentinelRect = entry.boundingClientRect;

                    if (entry.isIntersecting) {
                        // Sentinel is visible → dock the CTA bar
                        if (!isDocked) {
                            setIsDocked(true);
                            ctaBar.classList.add("docked");
                            page.classList.add("cta-docked");
                        }
                    } else {
                        // Sentinel is not visible, check scroll direction
                        if (sentinelRect.top > 0) {
                            // Scrolled back up above consent section → undock
                            if (isDocked) {
                                setIsDocked(false);
                                ctaBar.classList.remove("docked");
                                page.classList.remove("cta-docked");
                            }
                        }
                        // If scrolled down past sentinel, keep docked (one-way)
                    }
                });
            },
            { threshold: 0, rootMargin: "0px" }
        );

        observer.observe(sentinel);

        return () => {
            observer.disconnect();
        };
    }, [isDocked]);

    // Temporary handler for drawer (will be implemented in Step 5)
    const handleOpenDrawer = () => {
        console.log("Open drawer - will be implemented in next step");
    };

    return (
        <div className="mobile-checkout-layout" id="mobile-checkout-page">
            <MobileProgressStrip />
            <MobilePageTitle
                cartItems={checkoutItems}
                grandTotal={totals.grandTotal}
            />

            {/* Contact Section - Reused from desktop */}
            <ContactSection
                submitCount={submitCount}
                setFieldErrors={setFieldErrors}
            />
            {/* Address Section - Reused from desktop */}
            <AddressSection
                submitCount={submitCount}
                setFieldErrors={setFieldErrors}
            />
            {/* Delivery Section - Reused from desktop */}
            <DeliverySection
                deliveryType={deliveryType}
                setDeliveryType={setDeliveryType}
                checkoutItems={checkoutItems}
            />

            {/* Fullfilment Section - Reused from desktop */}
            <FulfilmentSection />

            {/* Payment Section - Reused from desktop */}
            <PaymentSection/>

            {/* Payment Section - Reused from desktop */}
            <ReviewSection
                checkoutItems={checkoutItems}
                submitCount={submitCount}
            />

            {/* CTA Bar - New one for Mobile*/}
            <MobileCtaBar
                ref={ctaBarRef}
                grandTotal={totals.grandTotal}
                deliveryType={deliveryType}
                onPlaceOrder={handlePlaceOrder}
                isProcessingOrder={isProcessingOrder}
                onOpenDrawer={handleOpenDrawer}
            />
            
        </div>
    );
};

export default MobileCheckoutLayout;