// src\components\Checkout\sections\FulfilmentSection.jsx
import FormSection from "./components/FormSection";
import "../../../styles/checkout/sections/components/field.css";
import "../../../styles/checkout/sections/components/form-section.css";
import "../../../styles/checkout/sections/fulfilment-section.css";
import { useLocation } from "react-router-dom";
// import ModeSeparator from "../../Cart/ui/ModeSeparator";
// import RentalTimeline from "../../Cart/items/modes/rental/RentalTimeline";

import RentalPriceBlock from "../../Cart/items/modes/rental/RentalPriceBlock";
import PrelovedPriceBlock from "../../Cart/items/modes/preloved/PrelovedPriceBlock";
import NewPriceBlock from "../../Cart/items/modes/new/NewPriceBlock";
import RentalTimeline from "../../Cart/items/modes/rental/RentalTimeline";

// import RentalDepositNotice from "../../Cart/items/modes/rental/RentalDepositNotice";
// import PrelovedDisclosure from "../../Cart/items/modes/preloved/PrelovedDisclosure";
// import PrelovedFinalNote from "../../Cart/items/modes/preloved/PrelovedFinalNote";
// import NewPurchaseNotice from "../notices/NewPurchaseNotice";
import Notice from "../../shared/Notice/Notice";


const OrderFulfilmentSection = () => {

  const location = useLocation();
  let items = location.state?.items;

  //  fallback (dev + refresh safe)
  if (!items || items.length === 0) {
    const stored = localStorage.getItem("checkoutItems");
    if (stored) {
      items = JSON.parse(stored);
    }
  }

  items = items || [];


  const getRentalDays = (booking) => {
    if (!booking?.deliveryDate || !booking?.returnDate) return 0;

    const start = new Date(booking.deliveryDate);
    const end = new Date(booking.returnDate);

    const diff = end - start;

    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <FormSection>

      <div className="order-fulfilment-section">

        {/* HEADER */}
        <div className="checkout-section-header">

          <div className="checkout-section-number">04</div>

          <h2 className="checkout-section-title">
            Order <em>Fulfilment</em>
          </h2>

          <div className="checkout-section-status">
            Confirm before payment
          </div>

        </div>

        {/* Items  */}

        {["rental", "preloved", "new"].map((type) => {
          const groupItems = items.filter(item => item.type === type);

          if (!groupItems.length) return null;

          return (
            <div key={type} className="checkout-order-group">

              {/* GROUP LABEL (we'll style later) */}
              <div className={`checkout-mode-separator checkout-mode-separator--${type}`}>
                <span className="checkout-mode-dot"></span>
                <span className="checkout-mode-text">
                  {type === "rental"
                    ? "Rental Booking"
                    : type === "preloved"
                      ? "Preloved · Buy to Own"
                      : "Buy New"}
                </span>
              </div>

              {groupItems.map(item => {
                const condition = item.product?.condition?.grade;

                return (
                  <div key={item.id} className="checkout-piece">

                    <div className="checkout-piece-top">

                      {/* IMAGE */}
                      <div className="checkout-piece-thumb">
                        <img
                          src={item.product?.images?.[0]}
                          alt={item.product?.title}
                        />
                        <span className={`checkout-piece-tag checkout-piece-tag--${item.type}`}>
                          {item.type === "rental"
                            ? "Rent"
                            : item.type === "preloved"
                              ? "Preloved"
                              : "New"}
                        </span>
                      </div>

                      {/* CONTENT */}
                      <div className="checkout-piece-content">

                        <div className="checkout-piece-designer">
                          {item.product?.designer}
                        </div>

                        <div className="checkout-piece-title">
                          {item.product?.title}
                        </div>

                        <div className="checkout-piece-desc">

                          {[
                            item.product?.description,

                            item.booking?.size
                              ? `Size ${item.booking.size}`
                              : null,

                            condition
                              ? condition === "pristine"
                                ? "Pristine condition"
                                : condition === "excellent"
                                  ? "Excellent condition"
                                  : `${condition} condition`
                              : null

                          ]
                            .filter(Boolean)
                            .join(" · ")}

                        </div>

                        <div
                          className={`checkout-piece-price checkout-piece-price--${item.type}`}
                        >

                          {item.type === "rental" && (
                            <RentalPriceBlock
                              product={item.product}

                              booking={{
                                ...item.booking,
                                rentalWindowDays: getRentalDays(item.booking)
                              }}
                            />
                          )}

                          {item.type === "preloved" && (
                            <PrelovedPriceBlock
                              product={item.product}
                            />
                          )}

                          {item.type === "new" && (
                            <NewPriceBlock
                              product={item.product}
                            />
                          )}

                        </div>

                      </div>

                    </div>

                    {/* DIVIDER */}
                    <div className="checkout-piece-divider" />


                    {/* RENTAL TIMELINE */}
                    {item.type === "rental" && (
                      <div className="checkout-piece-timeline">

                        <RentalTimeline
                          booking={{
                            ...item.booking,
                            rentalWindowDays: getRentalDays(item.booking)
                          }}
                        />

                      </div>
                    )}

                    {/* RENTAL NOTICE */}
                    {item.type === "rental" && (
                      <div className="checkout-piece-notices">

                        <Notice variant="amber">

                          <strong>
                            ₹15,000 refundable security deposit
                          </strong>{" "}
                          — not collected at checkout. Our team will
                          contact you on WhatsApp within 24 hours of
                          order confirmation to arrange this via UPI or
                          bank transfer before dispatch. Refunded in
                          full within 3–5 business days of a clean
                          return inspection. Late returns attract
                          ₹1,700 per additional day.

                        </Notice>

                      </div>
                    )}

                    
                    {/* PRELOVED */}
                    {item.type === "preloved" && (
                      <div className="checkout-piece-notices">

                        <Notice variant="rose">

                          <strong>
                            Final sale reminder:
                          </strong>{" "}
                          The Ivory Tissue Organza Saree is a preloved
                          item sold on a non-returnable basis. You
                          accepted this condition at checkout. If you
                          have any concerns about the piece on arrival,
                          please contact us on WhatsApp within 24 hours
                          of delivery and we will do our best to assist.

                        </Notice>

                        <Notice variant="slate">

                          <strong>
                            Final sale.
                          </strong>{" "}
                          Pre-loved pieces cannot be returned once
                          dispatched. Please review all condition notes
                          and photographs before confirming. Any
                          questions? Reach us on WhatsApp before
                          placing your order.

                        </Notice>

                      </div>
                    )}

                    {/* NEW */}
                    {item.type === "new" && (
                      <div className="checkout-piece-notices">

                        {/* NEW */}
                        {item.type === "new" && (
                          <div className="checkout-piece-notices">

                            <Notice variant="navy">

                              <strong>
                                Dispatch timeline:
                              </strong>{" "}
                              Ships within 3–5 business days of order
                              confirmation from Manyavar's fulfilment
                              centre. Eligible for a 7-day return from
                              the date of delivery. Price is GST-inclusive
                              at <strong>18%</strong> (GST 2.0 rate,
                              effective 22 Sep 2025 — garments priced
                              above ₹2,500). Tracking details shared on
                              WhatsApp and email.

                            </Notice>

                          </div>
                        )}

                      </div>
                    )}


                  </div>
                );
              })}

            </div>
          );
        })}

      </div>
    </FormSection>
  );
};

export default OrderFulfilmentSection;