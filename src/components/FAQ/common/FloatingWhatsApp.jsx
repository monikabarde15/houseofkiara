// src/components/FAQ/common/FloatingWhatsApp.jsx
// Floating WhatsApp button per Section A9, A11 & Section 10.6
import React from "react";
import { WhatsAppGlyphIcon } from "./FaqIcons";
import { ADMIN_FIGURES } from "../../../data/faq/adminFigures";

export default function FloatingWhatsApp({ onShowToast }) {
  const handleClick = () => {
    if (onShowToast) {
      onShowToast("Opening WhatsApp");
    }
    const message = encodeURIComponent("Hello House of Kaira, I have a question.");
    const url = `https://wa.me/${ADMIN_FIGURES.support_whatsapp_raw}?text=${message}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      type="button"
      className="whatsapp-float"
      onClick={handleClick}
      aria-label="Ask us anything on WhatsApp"
    >
      <WhatsAppGlyphIcon className="whatsapp-float-svg" fill="#FFFFFF" />
      <span className="whatsapp-tooltip" role="tooltip">
        Ask us anything
      </span>
    </button>
  );
}
