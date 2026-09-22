// src/components/FAQ/Hero/SearchNoResults.jsx
// Empty State (B6) & WhatsApp button per Section B6 and 10.6
import React from "react";
import { ADMIN_FIGURES } from "../../../data/faq/adminFigures";
import { WhatsAppGlyphIcon } from "../common/FaqIcons";

export default function SearchNoResults({ query, onShowToast }) {
  const handleWhatsApp = () => {
    if (onShowToast) onShowToast("Opening WhatsApp");
    const prefilledText = `Hello House of Kaira, I have a question: ${query}`;
    const url = `https://wa.me/${ADMIN_FIGURES.support_whatsapp_raw}?text=${encodeURIComponent(
      prefilledText
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="ch-none" role="status">
      <b>We haven't written about that yet.</b>
      <p>
        Our team can answer it in a message. Your question goes straight to us on WhatsApp, already typed in.
      </p>
      <button
        type="button"
        className="btn-wa"
        onClick={handleWhatsApp}
      >
        <WhatsAppGlyphIcon fill="#FFFFFF" style={{ width: 14, height: 14 }} />
        <span>Ask us on WhatsApp</span>
      </button>
    </div>
  );
}
