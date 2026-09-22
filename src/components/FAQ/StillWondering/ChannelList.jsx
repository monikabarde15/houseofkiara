// src/components/FAQ/StillWondering/ChannelList.jsx
// Contact channels list (F3) per Section F3 & Appendix F
import React from "react";
import { useNavigate } from "react-router-dom";
import { WhatsAppGlyphIcon, EmailIcon, YourOrderIcon } from "../common/FaqIcons";
import { ADMIN_FIGURES } from "../../../data/faq/adminFigures";

export default function ChannelList({ onShowToast }) {
  const navigate = useNavigate();

  const handleWhatsApp = () => {
    if (onShowToast) onShowToast("Opening WhatsApp");
    const msg = encodeURIComponent("Hello House of Kaira, I have a question.");
    const url = `https://wa.me/${ADMIN_FIGURES.support_whatsapp_raw}?text=${msg}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleEmail = () => {
    window.location.href = `mailto:${ADMIN_FIGURES.support_email}?subject=${encodeURIComponent(
      "A question for House of Kaira"
    )}`;
  };

  const handleAccount = () => {
    navigate("/profile");
  };

  return (
    <div className="chan" role="region" aria-label="Support contact channels">
      {/* Channel 1: WhatsApp */}
      <div className="chan-row">
        <div className="chan-ic" aria-hidden="true">
          <WhatsAppGlyphIcon className="chan-svg fill" fill="#E8D5B0" style={{ width: 17, height: 17 }} />
        </div>
        <div className="chan-info">
          <h4 className="chan-k">WhatsApp</h4>
          <p className="chan-v">
            The fastest way to reach us. {ADMIN_FIGURES.support_days}, {ADMIN_FIGURES.support_hours}, with replies usually within {ADMIN_FIGURES.support_sla}.
          </p>
        </div>
        <button
          type="button"
          className="chan-go"
          onClick={handleWhatsApp}
        >
          Start a chat
        </button>
      </div>

      {/* Channel 2: Email */}
      <div className="chan-row">
        <div className="chan-ic" aria-hidden="true">
          <EmailIcon className="chan-svg" />
        </div>
        <div className="chan-info">
          <h4 className="chan-k">Email</h4>
          <p className="chan-v">
            {ADMIN_FIGURES.support_email}. Best for anything with photos or documents attached.
          </p>
        </div>
        <button
          type="button"
          className="chan-go"
          onClick={handleEmail}
        >
          Send an email
        </button>
      </div>

      {/* Channel 3: Your order, in one place */}
      <div className="chan-row">
        <div className="chan-ic" aria-hidden="true">
          <YourOrderIcon className="chan-svg" />
        </div>
        <div className="chan-info">
          <h4 className="chan-k">Your order, in one place</h4>
          <p className="chan-v">
            Booking status, tracking and your deposit, all inside My Account.
          </p>
        </div>
        <button
          type="button"
          className="chan-go"
          onClick={handleAccount}
        >
          Go to my account
        </button>
      </div>
    </div>
  );
}
