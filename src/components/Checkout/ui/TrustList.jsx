import {
  ShieldCheck,
  RefreshCcw,
  Truck
} from "lucide-react";

import "../../../styles/checkout/ui/trust-list.css";

const TRUST_ITEMS = [
  {
    id: 1,
    icon: ShieldCheck,
    text: "Every piece quality-verified before dispatch"
  },
  {
    id: 2,
    icon: RefreshCcw,
    text: "Security deposits refunded within 3–5 business days"
  },
  {
    id: 3,
    icon: Truck,
    text: "Pan-India shipping · Rentals arrive 2 days before event"
  }
];

const PAYMENT_MARKS = [
  "UPI",
  "Visa",
  "Mastercard",
  "RuPay",
  "Net Banking",
  "EMI"
];

export default function TrustList() {

  return (
    <div className="trust-wrapper">

      {/* ========================================
          TRUST LIST
      ======================================== */}

      <div className="trust-list">

        {TRUST_ITEMS.map((item) => {

          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className="trust-item"
            >

              <Icon
                size={14}
                strokeWidth={1.3}
                className="trust-item__icon"
              />

              <p className="trust-item__text">
                {item.text}
              </p>

            </div>
          );
        })}

      </div>


      {/* ========================================
          PAYMENT MARKS
      ======================================== */}

      <div className="pay-marks">

        {PAYMENT_MARKS.map((mark) => (
          <span
            key={mark}
            className="pay-mark"
          >
            {mark}
          </span>
        ))}

      </div>

    </div>
  );
}