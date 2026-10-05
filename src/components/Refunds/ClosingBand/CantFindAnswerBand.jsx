/**
 * "Can't find your answer?" Closing Support Band
 * Spec v1.2 · Section 09
 */

import React from "react";
import { Link } from "react-router-dom";
import {
  WhatsAppIcon,
  EnvelopeIcon,
  CardIcon,
} from "../common/RefundIcons";
import { resolveTokenValue } from "../../../data/refunds/refundTokens";

export default function CantFindAnswerBand({ onOpenWhatsApp }) {
  const whatsappRaw = resolveTokenValue("support_whatsapp_raw");
  const supportEmail = resolveTokenValue("support_email");
  const supportDays = resolveTokenValue("support_days");
  const supportHours = resolveTokenValue("support_hours");
  const supportSla = resolveTokenValue("support_sla");

  const defaultWhatsAppMsg =
    "Hello House of Kaira, I have a question about a refund or cancellation.";

  const handleWhatsAppClick = (e) => {
    e.preventDefault();
    const url = `https://wa.me/${whatsappRaw}?text=${encodeURIComponent(
      defaultWhatsAppMsg
    )}`;
    if (onOpenWhatsApp) {
      onOpenWhatsApp(url, "Opening WhatsApp");
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const handleEmailClick = (e) => {
    e.preventDefault();
    window.location.href = `mailto:${supportEmail}?subject=${encodeURIComponent(
      "A question about a refund or cancellation"
    )}`;
  };

  return (
    <section className="still" aria-label="Support and contact channels">
      <div className="still-grid">
        {/* Left Message Column */}
        <div className="still-left">
          <div className="fq-eyebrow">
            <i aria-hidden="true" />
            <span>We're here for you</span>
          </div>

          <h2>
            Can't find your <em>answer?</em>
          </h2>

          <p className="still-p">
            Every situation is a little different. If yours is not covered here,
            or you would simply like to talk it through, message us. We would
            much rather help you directly than have you worry, and nothing is
            too small to ask.
          </p>

          <p className="still-sign">With love, the House of Kaira team</p>

          <div className="still-btns">
            <button
              type="button"
              className="btn-wa"
              onClick={handleWhatsAppClick}
            >
              <WhatsAppIcon size={16} />
              Message us on WhatsApp
            </button>

            <button
              type="button"
              className="btn-line"
              onClick={handleEmailClick}
            >
              <EnvelopeIcon size={15} />
              Write to us
            </button>
          </div>
        </div>

        {/* Right Channels Column */}
        <div className="chan">
          {/* Channel 1: WhatsApp */}
          <div className="chan-row">
            <div className="chan-ic">
              <WhatsAppIcon size={17} className="fill" />
            </div>
            <div>
              <span className="chan-k">WhatsApp</span>
              <span className="chan-v">
                The fastest way to reach us. {supportDays}, {supportHours}, with
                replies usually within {supportSla}.
              </span>
            </div>
            <button
              type="button"
              className="chan-go"
              onClick={handleWhatsAppClick}
            >
              Start a chat
            </button>
          </div>

          {/* Channel 2: Email */}
          <div className="chan-row">
            <div className="chan-ic">
              <EnvelopeIcon size={17} />
            </div>
            <div>
              <span className="chan-k">Email</span>
              <span className="chan-v">
                {supportEmail}. Best when you want to send photos or documents.
              </span>
            </div>
            <button
              type="button"
              className="chan-go"
              onClick={handleEmailClick}
            >
              Send an email
            </button>
          </div>

          {/* Channel 3: My Account */}
          <div className="chan-row">
            <div className="chan-ic">
              <CardIcon size={17} />
            </div>
            <div>
              <span className="chan-k">Your order, in one place</span>
              <span className="chan-v">
                Cancel, track a refund, or follow your deposit, all inside My
                Account.
              </span>
            </div>
            <Link to="/profile" className="chan-go">
              Go to my account
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
