/**
 * House of Kaira: Shipping Closing Band Component (D13)
 * Section 4.13 & Page 23, 24, 25 of Build Specification v2 (hok_shipping_policy_v3)
 */

import React from "react";
import { Link } from "react-router-dom";
import { SHIPPING_CLOSING_BAND } from "../../data/shipping/shippingRegistry";
import { SHIPPING_SETTINGS } from "../../data/shipping/shippingSettings";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.5 14.4c-.3-.1-1.7-.8-2-1-.3-.1-.5-.1-.7.2-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.4-.5-2.6-1.6-.9-.8-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7.1-.1.3-.4.5-.6.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5s-.7-1.7-1-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.4-1.2 1.2-1.2 2.9s1.2 3.4 1.4 3.6c.2.3 2.4 3.7 5.9 5.2.8.4 1.5.6 2 .8.8.3 1.6.2 2.2.1.7-.1 2.1-.9 2.4-1.7.3-.8.3-1.6.2-1.7-.1-.2-.3-.3-.6-.4zM12 2C6.5 2 2 6.5 2 12c0 2 .6 3.8 1.6 5.3L2 22l4.8-1.6C8.2 21.4 10 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="1" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

function PackageIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M16.5 9.4L7.55 4.24a1.8 1.8 0 0 0-1.8 0L3.5 5.5" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function ShippingClosingBand({ onShowToast }) {
  const whatsAppUrl = `https://wa.me/${SHIPPING_SETTINGS.support_whatsapp_raw}?text=${encodeURIComponent("Hello House of Kaira, I have a question about delivery.")}`;
  const emailUrl = `mailto:${SHIPPING_SETTINGS.support_email}?subject=${encodeURIComponent("A question about delivery")}`;

  const handleWhatsAppClick = () => {
    if (onShowToast) {
      onShowToast("Opening WhatsApp");
    }
  };

  const handleEmailClick = () => {
    if (onShowToast) {
      onShowToast("Opening Email Client");
    }
  };

  return (
    <section className="still" aria-labelledby="closing-band-title">
      <div className="still-grid">
        {/* Left Column */}
        <div>
          <div className="fq-eyebrow">
            <i aria-hidden="true" />
            <span>{SHIPPING_CLOSING_BAND.eyebrow}</span>
            <i aria-hidden="true" />
          </div>

          <h2 id="closing-band-title">
            {SHIPPING_CLOSING_BAND.titlePrefix}
            <em>{SHIPPING_CLOSING_BAND.italicWord}</em>
          </h2>

          <p className="still-p">{SHIPPING_CLOSING_BAND.paragraph}</p>
          <p className="still-sign">{SHIPPING_CLOSING_BAND.signOff}</p>

          <div className="still-btns">
            <a
              href={whatsAppUrl}
              className="btn-wa"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsAppClick}
            >
              <WhatsAppIcon />
              Message us on WhatsApp
            </a>
            <a
              href={emailUrl}
              className="btn-line"
              onClick={handleEmailClick}
            >
              <EmailIcon />
              Write to us
            </a>
          </div>
        </div>

        {/* Right Column: Channels */}
        <div className="chan">
          {/* Channel 1: WhatsApp */}
          <div className="chan-row">
            <div className="chan-ic">
              <svg viewBox="0 0 24 24" className="fill" aria-hidden="true">
                <path d="M17.5 14.4c-.3-.1-1.7-.8-2-1-.3-.1-.5-.1-.7.2-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.4-.5-2.6-1.6-.9-.8-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7.1-.1.3-.4.5-.6.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5s-.7-1.7-1-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.4-1.2 1.2-1.2 2.9s1.2 3.4 1.4 3.6c.2.3 2.4 3.7 5.9 5.2.8.4 1.5.6 2 .8.8.3 1.6.2 2.2.1.7-.1 2.1-.9 2.4-1.7.3-.8.3-1.6.2-1.7-.1-.2-.3-.3-.6-.4zM12 2C6.5 2 2 6.5 2 12c0 2 .6 3.8 1.6 5.3L2 22l4.8-1.6C8.2 21.4 10 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2z" />
              </svg>
            </div>
            <div>
              <div className="chan-k">WhatsApp</div>
              <div className="chan-v">
                The fastest way to reach us. Seven days a week, 10 AM to 8 PM IST, with replies usually within 2 hours.
              </div>
            </div>
            <a
              href={whatsAppUrl}
              className="chan-go"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsAppClick}
            >
              Start a chat
            </a>
          </div>

          {/* Channel 2: Email */}
          <div className="chan-row">
            <div className="chan-ic">
              <EmailIcon />
            </div>
            <div>
              <div className="chan-k">Email</div>
              <div className="chan-v">
                {SHIPPING_SETTINGS.support_email}. Best when you want to send photographs of a parcel or a piece.
              </div>
            </div>
            <a
              href={emailUrl}
              className="chan-go"
              onClick={handleEmailClick}
            >
              Send an email
            </a>
          </div>

          {/* Channel 3: My Account */}
          <div className="chan-row">
            <div className="chan-ic">
              <PackageIcon />
            </div>
            <div>
              <div className="chan-k">Every delivery, in one place</div>
              <div className="chan-v">
                Follow each order and booking, with its dates and tracking, in My Account.
              </div>
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

export default React.memo(ShippingClosingBand);
