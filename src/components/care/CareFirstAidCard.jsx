/**
 * House of Kaira - Care Policy "If something happens" First Aid Card (Component C4)
 * Section 5.4, 6.7, 7.2 of Build Specification 2.0
 */

import React from "react";
import { FIRST_AID_STEPS } from "../../data/care/careRegistry";
import { CARE_SETTINGS } from "../../data/care/careSettings";
import { showToast } from "../AboutUs/shared/Toast";

export default function CareFirstAidCard({ onStepClick }) {
  const handleWhatsAppClick = () => {
    if (typeof showToast === "function") {
      showToast("Opening WhatsApp");
    }
    const msg = "Hello House of Kaira, something has happened to the piece I am wearing. Here is a photo:";
    const url = `https://wa.me/${CARE_SETTINGS.support_whatsapp_raw}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="rest enter e5" id="faCard" aria-labelledby="fa-heading">
      <div className="fa-hd">
        <div className="fa-hd-text">
          <h2 id="fa-heading">
            If something <em>happens</em>
          </h2>
          <p>
            A spill at dinner, a snag on the dance floor, a hook that gives way. Most things can be beautifully restored when we hear about them early.
          </p>
        </div>

        <button
          type="button"
          className="btn-wa"
          onClick={handleWhatsAppClick}
          aria-label="Message us on WhatsApp about garment care or damage"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.77.813 2.796.814 3.183 0 5.769-2.587 5.77-5.768.001-3.182-2.585-5.798-5.77-5.798zm3.084 8.016c-.149.42-1.002.825-1.391.865-.389.04-1.026.064-3.183-.834-2.157-.899-3.238-3.32-3.344-3.469-.105-.15-.85-1.127-.85-2.152s.537-1.529.728-1.74c.191-.21.417-.262.556-.262.139 0 .278.002.399.008.127.006.297-.048.464.354.17.412.581 1.419.632 1.523.051.105.085.228.017.365-.068.136-.102.221-.203.34-.102.119-.214.266-.306.357-.102.102-.208.213-.09.417.119.204.528.871 1.134 1.412.781.696 1.439.912 1.643 1.014.204.102.323.085.442-.051.119-.136.51-.595.646-.799.136-.204.272-.17.459-.102.187.068 1.187.56 1.391.662.204.102.34.153.391.238.051.085.051.493-.098.913z" />
          </svg>
          <span>Message us on WhatsApp</span>
        </button>
      </div>

      <div className="fa-steps" role="list">
        {FIRST_AID_STEPS.map((step) => (
          <button
            key={step.num}
            type="button"
            className="fa-step"
            onClick={() => onStepClick(step.opens)}
            aria-label={`Step ${step.num}: ${step.title}. Click to view details.`}
          >
            <div className="fa-n" aria-hidden="true">
              {step.num}
            </div>
            <h3 className="fa-k">{step.title}</h3>
            <p className="fa-d">{step.line}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
