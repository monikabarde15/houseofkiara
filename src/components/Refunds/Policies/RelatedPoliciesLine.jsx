/**
 * Related Policies & Last Reviewed Line Component
 * Spec v1.2 · Section 08
 */

import React from "react";
import { Link } from "react-router-dom";
import { REFUND_PAGE_METADATA } from "../../../data/refunds/refundTokens";

export default function RelatedPoliciesLine({ onPrint }) {
  const handlePrint = (e) => {
    e.preventDefault();
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  return (
    <section className="pol" aria-label="Related policies and terms notice">
      <div className="pol-in">
        <b>Related policies</b>
        <Link to="/deposit-policy">Deposit Policy</Link>
        <Link to="/care-cleaning-damage">Care, Cleaning &amp; Damage Policy</Link>
        <Link to="/terms">Terms &amp; Conditions</Link>
        <Link to="/privacy">Privacy Policy</Link>
        <Link to="/faqs">Help &amp; FAQs</Link>
      </div>

      <p>
        This page explains our policy in plain words. Where it ever differs from
        our Terms &amp; Conditions, the Terms apply. Last reviewed{" "}
        {REFUND_PAGE_METADATA.lastReviewedDate}.
        <button type="button" onClick={handlePrint}>
          Print or save as PDF
        </button>
      </p>
    </section>
  );
}
