// src/components/pricing/PricingRelatedPolicies.jsx
// D13 Related policies and fine print

import React from "react";
import { Link } from "react-router-dom";

const RELATED_LINKS = [
  { label: "Refund & Cancellation Policy", path: "/refunds" },
  { label: "Deposit Policy", path: "/deposit-policy" },
  { label: "Shipping & Delivery Policy", path: "/shipping-policy" },
  { label: "Care, Cleaning & Damage Policy", path: "/care-policy" },
  { label: "Seller Guidelines", path: "/seller-guidelines" },
  { label: "Terms & Conditions", path: "/terms" },
  { label: "Help & FAQs", path: "/faqs" },
];

export default function PricingRelatedPolicies() {
  const handlePrint = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="pol" aria-label="Related policies and document information">
      <div className="pol-in">
        <b>Related policies</b>
        {RELATED_LINKS.map((item) => (
          <Link key={item.path} to={item.path}>
            {item.label}
          </Link>
        ))}
      </div>

      <p>
        This page explains our prices, charges and shares in plain words. Where
        it ever differs from our Terms & Conditions, the Terms apply. Last
        reviewed 11 October 2026.
        <button
          type="button"
          onClick={handlePrint}
          aria-label="Print or save as PDF"
        >
          Print or save as PDF
        </button>
      </p>
    </div>
  );
}
