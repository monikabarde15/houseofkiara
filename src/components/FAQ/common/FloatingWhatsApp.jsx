// src/components/FAQ/common/FloatingWhatsApp.jsx
// Floating WhatsApp button per Section A9, A11 & Section 10.6
import React, { useEffect, useState } from "react";
import { WhatsAppGlyphIcon } from "./FaqIcons";
import { ADMIN_FIGURES } from "../../../data/faq/adminFigures";
import {
  getContactSettings,
  buildWhatsAppUrl,
  defaultContactConfig,
} from "../../../services/contactApi";

export default function FloatingWhatsApp({ onShowToast }) {
  const [contact, setContact] = useState(defaultContactConfig);

  useEffect(() => {
    let isMounted = true;
    getContactSettings().then((cfg) => {
      if (isMounted && cfg) setContact(cfg);
    });

    const handleUpdated = (e) => {
      if (e.detail) {
        setContact(e.detail);
      } else {
        getContactSettings(true).then((cfg) => {
          if (isMounted && cfg) setContact(cfg);
        });
      }
    };

    window.addEventListener("hok_contact_updated", handleUpdated);
    return () => {
      isMounted = false;
      window.removeEventListener("hok_contact_updated", handleUpdated);
    };
  }, []);

  if (contact.whatsAppButton && contact.whatsAppButton.show === false) {
    return null;
  }

  const tooltipText = contact.whatsAppButton?.tooltip || "Ask us anything";
  const prefilled =
    contact.whatsAppButton?.preFilledMessage ||
    "Hello House of Kaira, I have a question.";
  const waNumber = contact.whatsApp || ADMIN_FIGURES.support_whatsapp_raw;

  const handleClick = () => {
    if (onShowToast) {
      onShowToast("Opening WhatsApp");
    }
    const url = buildWhatsAppUrl(waNumber, prefilled);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      type="button"
      className="whatsapp-float"
      onClick={handleClick}
      aria-label={tooltipText}
    >
      <WhatsAppGlyphIcon className="whatsapp-float-svg" fill="#FFFFFF" />
      <span className="whatsapp-tooltip" role="tooltip">
        {tooltipText}
      </span>
    </button>
  );
}
