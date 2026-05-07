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

const OrderFulfilmentSection = () => {

  const location = useLocation();
  let items = location.state?.items;

  // ✅ fallback (dev + refresh safe)
  if (!items || items.length === 0) {
    const stored = localStorage.getItem("checkoutItems");
    if (stored) {
      items = JSON.parse(stored);
    }
  }

  items = items || [];


  console.log("CHECKOUT ITEMS:", items);

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
                          {item.product?.description}
                        </div>

                        {/* META FIXED (SIZE + CONDITION) */}
                        {(item.booking?.size || condition) && (
                          <div className="checkout-piece-meta">

                            {item.booking?.size && (
                              <span className="meta-size">
                                Size {item.booking.size}
                              </span>
                            )}

                            {item.booking?.size && condition && (
                              <span className="meta-dot">•</span>
                            )}

                            {condition && (
                              <span className={`meta-condition meta-condition--${condition}`}>
                                {condition === "pristine"
                                  ? "Pristine condition"
                                  : condition === "excellent"
                                    ? "Excellent condition"
                                    : condition}
                              </span>
                            )}

                          </div>
                        )}

                        <div className="checkout-piece-price">

                          {item.type === "rental" && (
                            <RentalPriceBlock
                              product={item.product}
                              booking={item.booking}
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