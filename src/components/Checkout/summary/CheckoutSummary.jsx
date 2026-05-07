// CheckoutSummary.jsx
import {
  ShoppingBag,
  RefreshCcw,
  Shield,
  Truck,
  Lock
} from "lucide-react";
import "./checkout-summary.css";

const CheckoutSummary = () => {
  return (
    <aside className="summary-col">
      {/* HEADING */}
      <div className="sum-eyebrow">
        ORDER SUMMARY
      </div>

      {/* RENTAL */}
      <div className="sum-head">
        <div className="sum-dot rental" />
        <span>RENTAL</span>
      </div>

      <div className="sum-row">
        <div>
          <div className="sum-name">
            Crimson Zardozi Bridal Lehenga
          </div>

          <span className="sum-sub">
            5-day window · Nov 14–18
          </span>
        </div>

        <div className="sum-val">
          ₹8,500
        </div>
      </div>

      <div className="sum-row deposit-row">
        <div>
          <div className="sum-name">
            Security deposit
          </div>

          <span className="sum-sub">
            Collected separately via WhatsApp
          </span>
        </div>

        <div className="sum-val">
          ₹15,000 *
        </div>
      </div>

      {/* PRELOVED */}
      <div className="sum-head">
        <div className="sum-dot preloved" />
        <span>PRELOVED</span>
      </div>

      <div className="sum-row">
        <div>
          <div className="sum-name">
            Ivory Tissue Organza Saree
          </div>

          <span className="sum-sub">
            Final sale · non-returnable
          </span>
        </div>

        <div className="sum-val">
          ₹22,000
        </div>
      </div>

      {/* BUY NEW */}
      <div className="sum-head">
        <div className="sum-dot new" />
        <span>BUY NEW</span>
      </div>

      <div className="sum-row">
        <div>
          <div className="sum-name">
            Royal Navy Silk Sherwani Set
          </div>

          <span className="sum-sub">
            Size 40 · incl. GST · ships 3–5 days
          </span>
        </div>

        <div className="sum-val">
          ₹18,500
        </div>
      </div>

      {/* SUBTOTAL */}
      <div className="sum-row">
        <div className="sum-name">
          Subtotal
        </div>

        <div className="sum-val">
          ₹49,000
        </div>
      </div>

      {/* PROMO */}
      <div className="sum-row promo-row">
        <div>
          <div className="sum-name">
            Promo — KAIRA10
          </div>

          <span className="sum-sub">
            10% off applied from cart
          </span>
        </div>

        <div className="sum-val">
          − ₹4,900
        </div>
      </div>

      {/* DELIVERY */}
      <div className="sum-row">
        <div>
          <div className="sum-name">
            Delivery
          </div>

          <span className="sum-sub">
            Standard · 3–5 business days
          </span>
        </div>

        <div className="sum-val free">
          Free
        </div>
      </div>
      <div className="sum-row tax-row">
        <div>
          <div className="sum-name tax-name">
            📄 Taxes & GST
          </div>

          <span className="sum-sub">
            included in total
          </span>
        </div>

        <div className="sum-val">
          ₹5,452
        </div>
      </div>

      {/* TOTAL */}
      <div className="grand-total">
        <div>
          <div className="gt-label">
            Total due today
          </div>

          <div className="gt-sub">
            Incl. free standard delivery ·
            Excl. ₹15,000 deposit
          </div>
        </div>

        <div className="gt-amount">
          ₹46,730
        </div>
      </div>

      {/* DEPOSIT NOTE */}
      <div className="deposit-note">
        <strong>
          * Security deposit (₹15,000)
        </strong>{" "}
        not due today — our ops team
        will contact you before dispatch.to arrange this separately Fully refunded within 3-5 days of return inspection.
      </div>

      <div className="estimated-box">

        <div className="estimated-title">
         <Truck className="final-icon" size={10}/> &nbsp;
          Estimated delivery
        </div>

        <div className="estimated-text">
          Rental arrives 14 Nov ·
          Preloved ships within 2 days of confirmation ·
          Sherwani ships within 3–5 days
        </div>

      </div>

      {/* PLACE ORDER */}
      <button className="cta-btn">
        PLACE ORDER · ₹46,730
      </button>

      {/* RETURN */}
      <button className="cta-back">
        ← RETURN TO CART
      </button>

      {/* SSL */}
      <div className="secure-note">
            <Lock size={10} /> &nbsp;
            SSL encrypted · Secured by Razorpay
      </div>

      {/* TRUST */}
       <div className="final-payment">

      {/* DIVIDER */}
      <div className="final-divider" />

      {/* TRUST LIST */}
      <div className="final-trust-list">

        <div className="final-trust-item">
          <Shield className="final-icon" size={15}  />
          <span>Every piece quality-verified before dispatch</span>
        </div>

        <div className="final-trust-item">
          <RefreshCcw className="final-icon" />
          <span>Security deposits refunded within 3–5 business days</span>
        </div>

        <div className="final-trust-item">
          <Truck className="final-icon" />
          <span>Pan-India shipping · Rentals arrive 2 days before event</span>
        </div>

      </div>

      {/* PAYMENT METHODS */}
      

    </div>

      {/* PAYMENT */}
      <div className="pay-marks">
        {[
          "UPI",
          "VISA",
          "MASTERCARD",
          "RUPAY",
          "NET BANKING",
          "EMI",
        ].map((item) => (
          <div
            className="pay-mark"
            key={item}
          >
            {item}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default CheckoutSummary;