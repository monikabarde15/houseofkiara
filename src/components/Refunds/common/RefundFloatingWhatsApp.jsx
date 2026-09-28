/**
 * Floating WhatsApp Button Component for Refund & Cancellation Policy Page
 * Spec v1.2 · Section 03 & 12.8
 */

import React from "react";
import { WhatsAppIcon } from "./RefundIcons";
import { resolveTokenValue } from "../../../data/refunds/refundTokens";

export default function RefundFloatingWhatsApp({ onShowToast }) {
  const handleClick = (e) => {
    e.preventDefault();
    if (onShowToast) {
      onShowToast("Opening WhatsApp");
    }
    const rawNumber = resolveTokenValue("support_whatsapp_raw");
    const msg = encodeURIComponent(
      "Hello House of Kaira, I have a question about a refund or cancellation."
    );
    const url = `https://wa.me/${rawNumber}?text=${msg}`;
    setTimeout(() => {
      window.open(url, "_blank", "noopener,noreferrer");
    }, 250);
  };

  return (
    <button
      type="button"
      className="whatsapp-float"
      onClick={handleClick}
      aria-label="Ask us anything about refunds or cancellations on WhatsApp"
    >
      <WhatsAppIcon size={26} className="whatsapp-float-svg fill" />
      <span className="whatsapp-tooltip" role="tooltip">
        Ask us anything
      </span>
    </button>
  );
}
