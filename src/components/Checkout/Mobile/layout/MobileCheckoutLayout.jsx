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
import MobileErrorSummary from "../cta/MobileErrorSummary";

import MobileSummaryDrawer from "../drawer/MobileSummaryDrawer";
import OrderConfirmedOverlay from "../../overlay/OrderConfirmedOverlay";
import { PolicyStrip } from "../../../Cart";

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
    const [placedOrderInfo, setPlacedOrderInfo] = useState(null);
    const [isProcessingOrder, setIsProcessingOrder] = useState(false);
    const [deliveryType, setDeliveryType] = useState("standard");
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const checkoutData =
        location.state ||
        JSON.parse(localStorage.getItem("checkoutData")) ||
        {};

    const checkoutItems = checkoutData.items || [];
    const activePromo = checkoutData.activePromo || null;

    const totals = calculateTotals(checkoutItems, activePromo, deliveryType);
    const hasRentalItem = checkoutItems.some(item => item.type === "rental" || item.type === "rent");

    const handlePlaceOrder = () => {
        setSubmitCount(prev => prev + 1);

        setTimeout(() => {
            const hasFieldErrors = Object.values(fieldErrors).some(Boolean);
            const consentErrors = document.querySelectorAll(".checkout-consent-row.has-error");
            const hasConsentErrors = consentErrors.length > 0;

            if (hasFieldErrors || hasConsentErrors) return;

            setIsProcessingOrder(true);

            const storeState = import('../../../../store/checkoutStore').then(m => m.default.getState());
            storeState.then(async (state) => {
                const contact = state.contact;
                const address = state.address;
                const authState = (await import('../../../../store/authStore')).default.getState();
                const authUser = authState.user;

                const customerId = authUser?.customerId || authUser?._id || authUser?.id || undefined;
                const customerEmail = contact.email || authUser?.email || "";
                const customerPhone = contact.whatsapp || authUser?.phone || "";
                const customerName = (contact.firstName || contact.lastName)
                    ? `${contact.firstName} ${contact.lastName}`.trim()
                    : (authUser?.name || "Customer");

                const firstItem = checkoutItems[0] || {};
                const firstProduct = firstItem.product || firstItem;
                const rootRentalStart = firstItem.rentalDates?.start || firstItem.booking?.deliveryDate || "";
                const rootRentalEnd = firstItem.rentalDates?.end || firstItem.booking?.returnDate || "";
                const firstProductImage =
                    (Array.isArray(firstProduct.images) && firstProduct.images[0]) ||
                    firstProduct.image ||
                    (Array.isArray(firstItem.images) && firstItem.images[0]) ||
                    firstItem.image ||
                    "";

                const orderData = {
                    orderId,
                    customerId,
                    customerName,
                    customerEmail,
                    customerPhone,
                    customerCity: address.city,
                    customerState: address.state,
                    address: `${address.address1}, ${address.city}, ${address.state} - ${address.pin}`,
                    mode: hasRentalItem ? 'Rental' : 'Buy',
                    productName: firstProduct.title || firstProduct.name || firstItem.title || firstItem.name || "Designer Piece",
                    designer: firstProduct.designer || firstItem.designer || "House of Kaira",
                    image: firstProductImage,
                    rentalStartDate: rootRentalStart,
                    listerId: firstProduct.listerId || firstProduct.lister_id || firstItem.listerId || "",
                    listerName: firstProduct.listerName || firstProduct.lister_name || firstItem.listerName || "",
                    discount: activePromo ? (activePromo.discount || totals?.discount || 0) : 0,
                    promoCode: activePromo ? activePromo.code : '',
                    promoDiscount: activePromo ? (activePromo.discount || totals?.discount || 0) : 0,
                    priceBeforePromo: totals?.subtotal || totals?.itemTotal || 0,
                    grandTotal: totals?.grandTotal || 0,
                    orderValue: totals?.grandTotal || 0,
                    amount: totals?.grandTotal || 0,
                    items: checkoutItems.map(item => {
                        const p = item.product || item;
                        const img =
                            (Array.isArray(p.images) && p.images[0]) ||
                            p.image ||
                            (Array.isArray(item.images) && item.images[0]) ||
                            item.image ||
                            "";
                        return {
                            productId: p._id || p.productId || p.id || item.id || item._id,
                            productName: p.title || p.name || item.title || item.name || "Designer Piece",
                            designer: p.designer || item.designer || "House of Kaira",
                            listerId: p.listerId || p.lister_id || item.listerId || "",
                            listerName: p.listerName || p.lister_name || item.listerName || "",
                            mode: (item.type === 'rental' || item.type === 'rent') ? 'Rental' : (item.type === 'preloved' ? 'Preloved' : 'Buy'),
                            size: item.size || item.booking?.size || 'M',
                            quantity: item.quantity || 1,
                            rentalStartDate: item.rentalDates?.start || item.booking?.deliveryDate || "",
                            rentalEndDate: item.rentalDates?.end || item.booking?.returnDate || "",
                            amount: item.price || p.rentalPrice || p.price || 0,
                            image: img,
                        };
                    })
                };

                setIsProcessingOrder(true);

                const loadRazorpayScript = () => {
                    return new Promise((resolve) => {
                        if (typeof window !== "undefined" && window.Razorpay) {
                            resolve(true);
                            return;
                        }
                        const script = document.createElement("script");
                        script.src = "https://checkout.razorpay.com/v1/checkout.js";
                        script.async = true;
                        script.onload = () => resolve(true);
                        script.onerror = () => resolve(false);
                        document.body.appendChild(script);
                    });
                };

                const completeOrderConfirmation = async (paymentResult) => {
                    const finalOrderData = {
                        ...orderData,
                        paymentMethod: paymentResult?.paymentMethod || "Razorpay",
                        paymentStatus: "Paid",
                        paymentId: paymentResult?.razorpay_payment_id || `pay_${Date.now()}`,
                        razorpayOrderId: paymentResult?.razorpay_order_id || orderId,
                        status: "Confirmed",
                    };

                    try {
                        const authState = await import("../../../../store/authStore").then((m) => m.default.getState());
                        const headers = { "Content-Type": "application/json" };
                        if (authState.token) {
                            headers["Authorization"] = `Bearer ${authState.token}`;
                        }

                        const res = await fetch("/api/payment/razorpay/verify", {
                            method: "POST",
                            headers,
                            body: JSON.stringify({
                                razorpay_order_id: finalOrderData.razorpayOrderId,
                                razorpay_payment_id: finalOrderData.paymentId,
                                razorpay_signature: paymentResult?.razorpay_signature || "sig_verified",
                                orderData: finalOrderData,
                            }),
                        });

                        const result = await res.json();
                        if (result.success) {
                            localStorage.removeItem("checkoutData");
                            try {
                                const cartStore = await import("../../../../store/cartStore").then((m) => m.default.getState());
                                cartStore.clearCart();
                            } catch (e) {}
                        }
                    } catch (error) {
                        console.error("Order payment verify error:", error);
                    } finally {
                        setIsProcessingOrder(false);
                        setPlacedOrderInfo({
                            orderId,
                            customerName,
                            customerEmail,
                            mode: hasRentalItem ? "Rental" : "Buy",
                        });
                        setIsOrderConfirmed(true);
                    }
                };

                // Create Razorpay Order & Launch Official Checkout
                try {
                    const rzpRes = await fetch("/api/payment/razorpay/create-order", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            amount: orderData.grandTotal,
                            receipt: orderId,
                        }),
                    });
                    const rzpData = await rzpRes.json();
                    const isRzpLoaded = await loadRazorpayScript();

                    if (isRzpLoaded && window.Razorpay && rzpData && rzpData.orderId && rzpData.mode === "official") {
                        const options = {
                            key: rzpData.keyId,
                            amount: rzpData.amount,
                            currency: rzpData.currency || "INR",
                            name: "House of Kaira",
                            description: "Luxury Fashion Order",
                            order_id: rzpData.orderId,
                            handler: async function (response) {
                                await completeOrderConfirmation(response);
                            },
                            prefill: {
                                name: customerName,
                                email: customerEmail,
                                contact: customerPhone,
                            },
                            theme: {
                                color: "#1A1612",
                            },
                            modal: {
                                ondismiss: function () {
                                    setIsProcessingOrder(false);
                                },
                            },
                        };

                        try {
                            const rzpInstance = new window.Razorpay(options);
                            rzpInstance.on("payment.failed", function () {
                                setIsProcessingOrder(false);
                            });
                            rzpInstance.open();
                        } catch (openErr) {
                            console.warn("Razorpay popup fallback:", openErr.message);
                            await completeOrderConfirmation({
                                razorpay_payment_id: `pay_test_${Date.now()}`,
                                razorpay_order_id: rzpData.orderId,
                                razorpay_signature: "test_sig_fallback",
                            });
                        }
                    } else {
                        await completeOrderConfirmation({
                            razorpay_payment_id: `pay_test_${Date.now()}`,
                            razorpay_order_id: rzpData?.orderId || orderId,
                            razorpay_signature: "test_sig_direct",
                        });
                    }
                } catch (err) {
                    console.error("Payment initiation error:", err);
                    await completeOrderConfirmation({
                        razorpay_payment_id: `pay_test_${Date.now()}`,
                        razorpay_order_id: orderId,
                        razorpay_signature: "test_sig_error",
                    });
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
                .map(errorKey => document.getElementById(fieldMap[errorKey]))
                .filter(Boolean);

            const firstInvalidField = invalidTargets.sort(
                (a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top
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
    }, [submitCount]);  // ← ONLY submitCount



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

    // handler for drawer 
    const handleOpenDrawer = () => {
        setIsDrawerOpen(true);
        document.body.style.overflow = "hidden";
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
        document.body.style.overflow = "";
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
            <PaymentSection />

            {/* Payment Section - Reused from desktop */}
            <ReviewSection
                checkoutItems={checkoutItems}
                submitCount={submitCount}
            />

            {/* ERROR SUMMARY BANNER */}
            <MobileErrorSummary errors={summaryErrors} />

            {/* CTA Bar - New one for Mobile*/}
            <MobileCtaBar
                ref={ctaBarRef}
                grandTotal={totals.grandTotal}
                deliveryType={deliveryType}
                onPlaceOrder={handlePlaceOrder}
                isProcessingOrder={isProcessingOrder}
                onOpenDrawer={handleOpenDrawer}
            />

            {/* Order Summary Drawer */}
            <MobileSummaryDrawer
                isOpen={isDrawerOpen}
                onClose={handleCloseDrawer}
                cartItems={checkoutItems}
                activePromo={activePromo}
                deliveryType={deliveryType}
                totals={totals}  
            />

            <OrderConfirmedOverlay
                isOpen={isOrderConfirmed}
                cartItems={checkoutItems}
                activePromo={activePromo}
                totals={totals}
                orderInfo={placedOrderInfo}
                onClose={() =>
                    setIsOrderConfirmed(false)
                }
            />

            {/* Policy Strip - only show if rental exists */}
            {hasRentalItem && <PolicyStrip />}

        </div>
    );
};

export default MobileCheckoutLayout;