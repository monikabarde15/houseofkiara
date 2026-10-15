// src/components/pricing/PricingClosingBand.jsx
// D14 Closing Band: direct contact channels and concierge assistance

import React from "react";
import { Link } from "react-router-dom";
import { PRICING_TOKENS } from "../../data/pricing/pricingSettings";

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

export default function PricingClosingBand({ onShowToast }) {
  const whatsAppUrl = `https://wa.me/${PRICING_TOKENS.support_whatsapp_raw}?text=Hello%20House%20of%20Kaira%2C%20I%20have%20a%20question%20about%20pricing.`;
  const emailUrl = `mailto:${PRICING_TOKENS.support_email}?subject=A%20question%20about%20pricing`;

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
            <span>We are here for you</span>
            <i aria-hidden="true" />
          </div>

          <h2 id="closing-band-title">
            A question about a <em>price?</em>
          </h2>

          <p className="still-p">
            Every piece has its own story, and its own prices. If you would like
            the exact figures for a piece, help planning a rental around your
            celebrations, or a word about listing with us, message us. We would
            much rather help you directly, and nothing is too small to ask.
          </p>

          <p className="still-sign">With love, the House of Kaira team</p>

          <div className="still-btns">
            <a
              href={whatsAppUrl}
              className="btn-wa"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsAppClick}
            >
              <WhatsAppIcon />
              <span>Message us on WhatsApp</span>
            </a>
            <a
              href={emailUrl}
              className="btn-line"
              onClick={handleEmailClick}
            >
              <EmailIcon />
              <span>Write to us</span>
            </a>
          </div>
        </div>

        {/* Right Column: Channels List */}
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
                The fastest way to reach us. Seven days a week, 10 AM to 8 PM
                IST, with replies usually within 2 hours.
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
                {PRICING_TOKENS.support_email}. Best for anything you would
                like in writing, such as an invoice or a payout statement.
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

          {/* Channel 3: Account */}
          <div className="chan-row">
            <div className="chan-ic">
              <PackageIcon />
            </div>
            <div>
              <div className="chan-k">Every order and payout, in one place</div>
              <div className="chan-v">
                Your bookings, receipts, deposits and payouts, in My Account.
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
