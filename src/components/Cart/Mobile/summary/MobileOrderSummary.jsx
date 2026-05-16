import { useState } from "react";
import { FileText, ChevronDown } from "lucide-react";
import "../../../../styles/cart/mobile/summary/mobile-order-summary.css";

const MobileOrderSummary = ({ cartItems = [], activePromo = null, totals = {}, onCheckout }) => {
  const [isGstOpen, setIsGstOpen] = useState(false);

  // Safe destructuring with defaults
  const { 
    subtotal = 0, 
    grandTotal = 0, 
    gstTotal = 0, 
    discount = 0 
  } = totals;

  const hasRental = cartItems.some(item => item.type === "rental");
  const hasPromo = activePromo && discount > 0;

  // Group items by type
  const rentalItems = cartItems.filter(item => item.type === "rental");
  const prelovedItems = cartItems.filter(item => item.type === "preloved");
  const newItems = cartItems.filter(item => item.type === "new");

  const formatPrice = (price) => {
    if (price === undefined || price === null) return "₹0";
    return `₹${Number(price).toLocaleString("en-IN")}`;
  };

  // Helper to get item price
  const getItemPrice = (item) => {
    if (item.type === "rental") {
      return item.product?.rent?.pricing?.pricePerDay * 5 || 8500;
    }
    if (item.type === "preloved") {
      return item.product?.preloved?.pricing?.price || 22000;
    }
    if (item.type === "new") {
      return item.product?.price || 18500;
    }
    return 0;
  };

  return (
    <div className="mobile-order-summary" data-rise="5">
      
      {/* Summary Container - Spec 7.1 */}
      <div className="summary-container">
        <div className="summary-eyebrow">Order Summary</div>

        {/* Rental Section - Spec 7.2 */}
        {rentalItems.length > 0 && (
          <>
            <div className="summary-section-head">
              <span className="summary-dot summary-dot-rental" />
              <span className="summary-section-label">Rental Booking</span>
            </div>

            {rentalItems.map(item => (
              <div key={item.id} className="summary-row">
                <div className="summary-row-name">
                  {item.product?.title || "Rental Item"}
                  <small>5-day window - Nov 14–18</small>
                </div>
                <div className="summary-row-value">
                  {formatPrice(getItemPrice(item))}
                </div>
              </div>
            ))}

            {/* Deposit Row - Spec 7.3 */}
            <div className="summary-row">
              <div className="summary-row-name">
                Security deposit
                <small>Collected separately by ops team</small>
              </div>
              <div className="summary-row-value deposit">
                ₹15,000 *
              </div>
            </div>
          </>
        )}

        {/* Preloved Section */}
        {prelovedItems.length > 0 && (
          <>
            <div className="summary-section-head">
              <span className="summary-dot summary-dot-preloved" />
              <span className="summary-section-label">Buy Preloved</span>
            </div>

            {prelovedItems.map(item => (
              <div key={item.id} className="summary-row">
                <div className="summary-row-name">
                  {item.product?.title || "Preloved Item"}
                  <small>Final sale - non-returnable</small>
                </div>
                <div className="summary-row-value">
                  {formatPrice(getItemPrice(item))}
                </div>
              </div>
            ))}
          </>
        )}

        {/* New Section */}
        {newItems.length > 0 && (
          <>
            <div className="summary-section-head">
              <span className="summary-dot summary-dot-new" />
              <span className="summary-section-label">Buy New</span>
            </div>

            {newItems.map(item => (
              <div key={item.id} className="summary-row">
                <div className="summary-row-name">
                  {item.product?.title || "New Item"}
                  <small>Size 40 - L - incl. GST</small>
                </div>
                <div className="summary-row-value">
                  {formatPrice(getItemPrice(item))}
                </div>
              </div>
            ))}
          </>
        )}

        {/* Subtotal Row */}
        <div className="summary-row subtotal">
          <div className="summary-row-name">Subtotal</div>
          <div className="summary-row-value">{formatPrice(subtotal)}</div>
        </div>

        {/* Delivery Row - Spec 7.3 */}
        <div className="summary-row">
          <div className="summary-row-name">
            Delivery
            <small>Calculated at checkout</small>
          </div>
          <div className="summary-row-value dim">TBD</div>
        </div>

        {/* Promo Row - Spec 7.5 */}
        {hasPromo && (
          <div className="summary-row promo">
            <div className="summary-row-name">
              Promo — <span className="promo-code">{activePromo.code || "CODE"}</span>
              <small>Applied on non-deposit items</small>
            </div>
            <div className="summary-row-value promo-value">
              — {formatPrice(discount)}
            </div>
          </div>
        )}

        {/* GST Accordion Row - Spec 7.4 */}
        <div className="gst-accordion" onClick={() => setIsGstOpen(!isGstOpen)}>
          <div className="gst-accordion-row">
            <div className="gst-accordion-left">
              <FileText size={10} strokeWidth={1.5} />
              <span>Taxes &amp; GST</span>
              <span className="gst-incl">incl.</span>
            </div>
            <div className="gst-accordion-right">
              <span className="gst-total">{formatPrice(gstTotal)}</span>
              <ChevronDown 
                size={8} 
                className={`gst-caret ${isGstOpen ? "open" : ""}`}
              />
            </div>
          </div>
        </div>

        {/* GST Detail Panel - Spec 7.4 */}
        <div className={`gst-detail-panel ${isGstOpen ? "vis" : ""}`}>
          
          {rentalItems.length > 0 && (
            <div className="gst-line">
              <div className="gst-line-left">
                <span className="gst-badge rental">Rental</span>
                <span>18% GST · SAC 997329</span>
              </div>
              <div className="gst-line-value">₹1,530</div>
            </div>
          )}

          {prelovedItems.length > 0 && (
            <div className="gst-line">
              <div className="gst-line-left">
                <span className="gst-badge preloved">Preloved</span>
                <span>5% GST · HSN 6204</span>
              </div>
              <div className="gst-line-value">₹1,100</div>
            </div>
          )}

          {newItems.length > 0 && (
            <div className="gst-line">
              <div className="gst-line-left">
                <span className="gst-badge new">New</span>
                <span>12% GST · HSN 6101</span>
              </div>
              <div className="gst-line-value">₹1,982 ±</div>
            </div>
          )}

          <div className="gst-line">
            <div className="gst-line-left">
              <span className="gst-badge delivery">Delivery</span>
              <span>18% GST · SAC 996812</span>
            </div>
            <div className="gst-line-value dim">At checkout</div>
          </div>

          <div className="gst-footnote">
            ± New item price is tax-inclusive — GST shown is already embedded, 
            not added again. IGST or CGST+SGST applied at checkout by delivery state.
          </div>
        </div>

        {/* Grand Total Row - Spec 7.6 */}
        <div className="grand-total-row">
          <div className="grand-total-left">
            <div className="grand-total-label">Total at Checkout</div>
            <div className="grand-total-sub">
              {hasRental ? "Excl. delivery + ₹15,000 deposit" : "Excl. delivery charges"}
            </div>
          </div>
          <div className="grand-total-amount">
            <sup>₹</sup>{grandTotal.toLocaleString("en-IN")}
          </div>
        </div>

        {/* Deposit & Delivery Note - Spec 7.7 */}
        <div className="deposit-delivery-note">
          <p>
            <b>** Security deposit (₹15,000)</b> not collected here — our team 
            contacts you before dispatch. Refunded within 3–5 business days of 
            return inspection.
          </p>
          <p>
            *† Delivery calculated at checkout based on your address and the 
            item's dispatch location.
          </p>
        </div>

        {/* Trust Signals - Spec 7.8 */}
        <div className="trust-signals">
          <div className="trust-item">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
              <path d="M12 2L3 7v7c0 5 9 8 9 8s9-3 9-8V7l-9-5z" />
              <path d="M12 12l2 2 4-4" />
            </svg>
            <span>Every piece quality-verified before dispatch</span>
          </div>
          <div className="trust-item">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
              <path d="M23 4L1 10l8 3 2 8 12-7z" />
            </svg>
            <span>Security deposits refunded within 3–5 days</span>
          </div>
          <div className="trust-item">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
              <rect x="2" y="6" width="20" height="12" rx="2" />
              <path d="M8 6v12M16 6v12M2 10h20" />
            </svg>
            <span>Pan-India shipping · Rentals arrive 2 days before event</span>
          </div>
        </div>

        {/* Payment Method Marks - Spec 7.9 */}
        <div className="payment-marks">
          <span>UPI</span>
          <span>Visa</span>
          <span>Mastercard</span>
          <span>Net Banking</span>
          <span>EMI</span>
        </div>

      </div>
    </div>
  );
};

export default MobileOrderSummary;