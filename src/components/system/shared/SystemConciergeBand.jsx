/**
 * House of Kaira: System Concierge Band (S6 / C8)
 * Section 4 C8, 5.8 & 6.9 of System Pages Specification v1.0
 */

import React from "react";
import { SITE_SETTINGS } from "../../../data/system/systemTokens";
import "../../../styles/system/system-variables.css";
import "../../../styles/system/system-concierge.css";

export default function SystemConciergeBand({
  eyebrow = "Our team, on WhatsApp",
  title = "Can’t find what you have in mind?",
  highlightWord = null,
  line = "Tell us the piece, the designer or the occasion, and our team will look for it and come back to you on WhatsApp. Your search is already in the message.",
  buttonLabel = "Ask us on WhatsApp",
  whatsAppMessage = "Hello House of Kaira, I need help finding a piece."
}) {
  const whatsAppUrl = `https://wa.me/${SITE_SETTINGS.support_whatsapp_raw}?text=${encodeURIComponent(whatsAppMessage)}`;

  const renderTitle = () => {
    if (!title) return null;
    const text = String(title);

    if (highlightWord && text.includes(highlightWord)) {
      const parts = text.split(highlightWord);
      return (
        <>
          {parts[0]}
          <em>{highlightWord}</em>
          {parts.slice(1).join(highlightWord)}
        </>
      );
    }

    if (text.includes("what you have in mind?")) {
      const parts = text.split("what you have in mind?");
      return (
        <>
          {parts[0]}
          <em>what you have in mind?</em>
        </>
      );
    }

    if (text.includes("a piece like it?")) {
      const parts = text.split("a piece like it?");
      return (
        <>
          {parts[0]}
          <em>a piece like it?</em>
        </>
      );
    }

    return text;
  };

  return (
    <section className="sys-concierge-band" aria-labelledby="sys-concierge-heading">
      <div className="sys-concierge-inner">
        <div className="sys-concierge-left">
          {eyebrow && (
            <div className="sys-concierge-eyebrow" aria-hidden="true">
              <span className="sys-concierge-eyebrow-rule" />
              <span className="sys-concierge-eyebrow-text">{eyebrow}</span>
            </div>
          )}

          <h2 id="sys-concierge-heading" className="sys-concierge-title">
            {renderTitle()}
          </h2>

          {line && <p className="sys-concierge-line">{line}</p>}
        </div>

        <div className="sys-concierge-right">
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="sys-concierge-btn"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.531 1.77.813 2.796.814 3.183 0 5.77-2.586 5.771-5.766.001-3.181-2.585-5.8-5.771-5.8zm3.376 8.21c-.144.405-.837.774-1.17.824-.312.045-.694.079-2.127-.514-1.834-.759-3.003-2.617-3.094-2.738-.09-.121-.745-.989-.745-1.887 0-.898.469-1.339.636-1.523.167-.184.364-.23.485-.23.122 0 .243.002.349.007.112.006.262-.042.41.314.152.364.517 1.26.562 1.352.045.092.076.199.015.321-.06.121-.091.198-.182.304-.09.106-.191.237-.273.318-.091.091-.186.19-.08.372.106.182.472.778 1.013 1.259.697.621 1.285.814 1.468.905.182.091.289.076.395-.045.106-.121.456-.531.577-.713.121-.182.243-.152.41-.091.167.061 1.061.5 1.243.591.182.091.303.136.349.213.045.076.045.438-.099.843z" />
            </svg>
            <span>{buttonLabel}</span>
          </a>

          <div className="sys-concierge-hours">
            We reply {SITE_SETTINGS.support_hours}.
          </div>
        </div>
      </div>
    </section>
  );
}
