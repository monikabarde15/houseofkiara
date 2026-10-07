/**
 * House of Kaira - Care Policy Closing Contact Band (Component C15)
 * Sections 5.15, 6.7, 6.9, 7.11 of Build Specification 2.0
 */

import React from "react";
import { Link } from "react-router-dom";
import { CLOSING_BAND_CHANNELS } from "../../data/care/careRegistry";
import { CARE_SETTINGS } from "../../data/care/careSettings";
import { showToast } from "../AboutUs/shared/Toast";

export default function CareClosingBand() {
  const handleWhatsApp = () => {
    if (typeof showToast === "function") {
      showToast("Opening WhatsApp");
    }
    const msg = "Hello House of Kaira, I have a question about caring for my piece.";
    const url = `https://wa.me/${CARE_SETTINGS.support_whatsapp_raw}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const renderIcon = (type) => {
    switch (type) {
      case "whatsapp":
        return (
          <svg viewBox="0 0 24 24" className="fill" aria-hidden="true">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.77.813 2.796.814 3.183 0 5.769-2.587 5.77-5.768.001-3.182-2.585-5.798-5.77-5.798zm3.084 8.016c-.149.42-1.002.825-1.391.865-.389.04-1.026.064-3.183-.834-2.157-.899-3.238-3.32-3.344-3.469-.105-.15-.85-1.127-.85-2.152s.537-1.529.728-1.74c.191-.21.417-.262.556-.262.139 0 .278.002.399.008.127.006.297-.048.464.354.17.412.581 1.419.632 1.523.051.105.085.228.017.365-.068.136-.102.221-.203.34-.102.119-.214.266-.306.357-.102.102-.208.213-.09.417.119.204.528.871 1.134 1.412.781.696 1.439.912 1.643 1.014.204.102.323.085.442-.051.119-.136.51-.595.646-.799.136-.204.272-.17.459-.102.187.068 1.187.56 1.391.662.204.102.34.153.391.238.051.085.051.493-.098.913z" />
          </svg>
        );
      case "email":
        return (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        );
      case "account":
        return (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section className="still" aria-labelledby="still-title">
      <div className="still-grid">
        {/* Left Column: Heading, description, and direct CTA buttons */}
        <div className="still-col-info">
          <div className="fq-eyebrow">
            <i aria-hidden="true" />
            <span>We are here for you</span>
          </div>

          <h2 id="still-title">
            Can't find your <em>answer?</em>
          </h2>

          <p className="still-p">
            Every piece and every celebration is a little different. If your
            question is not answered here, or something has happened and you
            would like to talk it through, we are only a message away. No question
            is ever too small.
          </p>

          <p className="still-sign">With love, the House of Kaira team</p>

          <div className="still-btns">
            <button type="button" className="btn-wa" onClick={handleWhatsApp}>
              Message us on WhatsApp
            </button>

            <a
              href={`mailto:${CARE_SETTINGS.support_email}?subject=${encodeURIComponent("A question about caring for my piece")}`}
              className="btn-line"
            >
              Write to us
            </a>
          </div>
        </div>

        {/* Right Column: Channels list */}
        <div className="still-col-channels">
          <div className="chan">
            {CLOSING_BAND_CHANNELS.map((ch, idx) => (
              <div key={idx} className="chan-row">
                <div className="chan-ic">{renderIcon(ch.type)}</div>
                <div className="chan-text">
                  <h3 className="chan-k">{ch.title}</h3>
                  <p className="chan-v">{ch.desc}</p>
                </div>
                {ch.type === "account" ? (
                  <Link to={ch.actionHref} className="chan-go">
                    {ch.actionText}
                  </Link>
                ) : ch.type === "whatsapp" ? (
                  <button
                    type="button"
                    className="chan-go"
                    onClick={handleWhatsApp}
                  >
                    {ch.actionText}
                  </button>
                ) : (
                  <a href={ch.actionHref} className="chan-go">
                    {ch.actionText}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
