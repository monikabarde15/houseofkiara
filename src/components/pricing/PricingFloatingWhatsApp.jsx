// src/components/pricing/PricingFloatingWhatsApp.jsx
// Floating WhatsApp concierge trigger

import React from "react";
import { PRICING_TOKENS } from "../../data/pricing/pricingSettings";

export default function PricingFloatingWhatsApp({ onShowToast }) {
  const handleClick = () => {
    if (onShowToast) {
      onShowToast("Opening WhatsApp");
    }
    const message = encodeURIComponent(
      "Hello House of Kaira, I have a question about pricing."
    );
    const url = `https://wa.me/${PRICING_TOKENS.support_whatsapp_raw}?text=${message}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      type="button"
      className="whatsapp-float"
      onClick={handleClick}
      aria-label="Ask us anything on WhatsApp"
    >
      <svg
        viewBox="0 0 24 24"
        className="whatsapp-float-svg"
        fill="#FFFFFF"
        aria-hidden="true"
      >
        <path d="M17.5 14.4c-.3-.1-1.7-.8-2-1-.3-.1-.5-.1-.7.2-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.4-.5-2.6-1.6-.9-.8-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7.1-.1.3-.4.5-.6.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5s-.7-1.7-1-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.4-1.2 1.2-1.2 2.9s1.2 3.4 1.4 3.6c.2.3 2.4 3.7 5.9 5.2.8.4 1.5.6 2 .8.8.3 1.6.2 2.2.1.7-.1 2.1-.9 2.4-1.7.3-.8.3-1.6.2-1.7-.1-.2-.3-.3-.6-.4zM12 2C6.5 2 2 6.5 2 12c0 2 .6 3.8 1.6 5.3L2 22l4.8-1.6C8.2 21.4 10 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2z" />
      </svg>
      <span className="whatsapp-tooltip" role="tooltip">
        Ask us anything
      </span>
    </button>
  );
}
