import FormSection from "./components/FormSection";
import "../../../styles/checkout/sections/components/field.css";
import "../../../styles/checkout/sections/components/form-section.css";
import "../../../styles/checkout/sections/fulfilment-section.css";
import { useLocation } from "react-router-dom";
import ModeSeparator from "../../Cart/ui/ModeSeparator";
import RentalTimeline from "../../Cart/items/modes/rental/RentalTimeline";

const OrderFulfilmentSection = () => {

  const location = useLocation();
  const items = location.state?.items || [];


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

        {
          ["rental", "preloved", "new"].map((type) => {
            const groupItems = items.filter(item => item.type === type);

            if (!groupItems.length) return null;

            return (
              <div key={type} className="checkout-order-group">

                <ModeSeparator type={type} variant="d" />

                {groupItems.map((item) => (
                  <div
                    key={item.id}
                    className="checkout-order-fulfilment-piece"
                  >

                    

                    {/* THUMB - LEFT */}
                    <div className="checkout-order-fulfilment-piece-thumb">
                      <img
                        src={item.product.images?.[0]}
                        alt={item.product.title}
                      />

                      <div className={`checkout-order-fulfilment-piece-tag checkout-order-fulfilment-piece-tag--${item.type}`}>
                        {item.type === "rental"
                          ? "RENT"
                          : item.type === "preloved"
                            ? "PRELOVED"
                            : "NEW"}
                      </div>
                    </div>

                    {/* CONTENT - RIGHT */}
                    <div className="checkout-order-fulfilment-piece-content">

                      <div className="checkout-order-fulfilment-piece-designer">
                        {item.product.designer}
                      </div>

                      <div className="checkout-order-fulfilment-piece-title">
                        {item.product.title}
                      </div>

                      {/* DESCRIPTION */}
                      <div className="checkout-order-fulfilment-piece-desc">
                        {item.product.description}
                      </div>

                      {/* META */}
                      <div className="checkout-order-fulfilment-piece-meta">

                        <span className="meta-size">
                          Size {item.booking?.size || "-"}
                        </span>

                        {(item.type === "rental" || item.type === "preloved") && item.product?.condition?.grade && (
                          <>
                            <span className="meta-dot">•</span>

                            <span
                              className={`meta-condition meta-condition--${item.product.condition.grade}`}
                            >
                              {item.product.condition.grade === "pristine"
                                ? "Pristine condition"
                                : "Excellent condition"}
                            </span>
                          </>
                        )}

                      </div>

                      {/* PRICE BLOCK */}
                      {item.type === "rental" && (
                        <div className="checkout-order-fulfilment-price">

                          <div className="checkout-rental-price-label">
                            RENTAL FEE · {item.booking?.duration || 5}-DAY WINDOW
                          </div>

                          <div className="checkout-rental-price-value">
                            ₹{item.pricing?.rentalTotal?.toLocaleString?.() || item.pricing?.rental || 0}
                          </div>

                          <div className="checkout-rental-price-sub">
                            ₹{item.pricing?.perDay || 0} per day · 18% GST (₹{item.pricing?.gst || 0}) added at total
                          </div>

                        </div>
                      )}
                    </div>

                     

                    {/* INTERNAL DIVIDER (SPEC) */}
                    <div className="checkout-order-fulfilment-divider" />

                    {/* RENTAL TIMELINE */}
                    {item.type === "rental" && item.booking && (
                      <div className="checkout-order-fulfilment-piece-timeline">
                        <RentalTimeline booking={item.booking} />
                      </div>
                    )}



                  </div>
                ))}

              </div>
            );
          })
        }

      </div>
    </FormSection>
  );
};

export default OrderFulfilmentSection;