// src/components/FAQ/StillWondering/StillWonderingBand.jsx
// Still Wondering Band (F1-F3) per Section F1-F3 & Appendix F
import React from "react";
import ChannelList from "./ChannelList";
import { WhatsAppGlyphIcon, EmailIcon } from "../common/FaqIcons";
import { ADMIN_FIGURES } from "../../../data/faq/adminFigures";

export default function StillWonderingBand({ onShowToast }) {
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

  return (
    <section className="still" aria-label="Still wondering support band">
      <div className="still-grid">
        {/* Left Message Column (F2) */}
        <div className="still-msg">
          <div className="fq-eyebrow">
            <i aria-hidden="true" />
            <span>We're here for you</span>
          </div>

          <h2>
            Still wondering about <em>something?</em>
          </h2>

          <p className="still-p">
            Ask us anything, however small. A measurement you want double checked, a date that feels tight, a shade that looks different on your screen. Our team knows every piece in the house, and we would genuinely love to help you get this right.
          </p>

          <p className="still-sign">
            With love, the House of Kaira team
          </p>

          <div className="still-btns">
            <button
              type="button"
              className="btn-wa"
              onClick={handleWhatsApp}
            >
              <WhatsAppGlyphIcon fill="#FFFFFF" style={{ width: 16, height: 16 }} />
              <span>Message us on WhatsApp</span>
            </button>
            <button
              type="button"
              className="btn-line"
              onClick={handleEmail}
            >
              <EmailIcon style={{ width: 15, height: 15 }} />
              <span>Write to us</span>
            </button>
          </div>
        </div>

        {/* Right Channel List Column (F3) */}
        <ChannelList onShowToast={onShowToast} />
      </div>
    </section>
  );
}
