/**
 * House of Kaira - Deposit Policy Closing Band (D13)
 * Section 5 (D13), 6.7, 6.8 & 7.8 of Build Specification v2.0 (hok_deposit_policy_v2)
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { DEPOSIT_SETTINGS } from '../../data/deposit/depositSettings.js';

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="fill" aria-hidden="true">
    <path d="M17.5 14.4c-.3-.1-1.7-.8-2-1-.3-.1-.5-.1-.7.2-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.4-.5-2.6-1.6-.9-.8-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7.1-.1.3-.4.5-.6.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5s-.7-1.7-1-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.4-1.2 1.2-1.2 2.9s1.2 3.4 1.4 3.6c.2.3 2.4 3.7 5.9 5.2.8.4 1.5.6 2 .8.8.3 1.6.2 2.2.1.7-.1 2.1-.9 2.4-1.7.3-.8.3-1.6.2-1.7-.1-.2-.3-.3-.6-.4zM12 2C6.5 2 2 6.5 2 12c0 2 .6 3.8 1.6 5.3L2 22l4.8-1.6C8.2 21.4 10 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2z" />
  </svg>
);

const EnvelopeIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M22 6l-10 7L2 6" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const DepositClosingBand = ({ onShowToast }) => {
  const handleWhatsApp = (e) => {
    e.preventDefault();
    if (onShowToast) onShowToast('Opening WhatsApp');
    const msg = 'Hello House of Kaira, I have a question about my security deposit.';
    const url = `https://wa.me/${DEPOSIT_SETTINGS.support_whatsapp_raw}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const emailHref = `mailto:${DEPOSIT_SETTINGS.support_email}?subject=${encodeURIComponent('A question about my security deposit')}`;

  return (
    <section className="still" aria-labelledby="closing-band-title">
      <div className="still-grid">
        {/* Left Column: Heading, Paragraph, Sign-off & Primary Action Buttons */}
        <div>
          <div className="fq-eyebrow">SUPPORT</div>
          <h2 id="closing-band-title">
            Can&apos;t find your <em>answer?</em>
          </h2>

          <p className="still-p">
            Every rental is a little different. If your question is not answered here, or you would simply like to talk it through, we are only a message away. We would much rather help you personally than have you worry, and no question is ever too small.
          </p>

          <p className="still-sign">With love, the House of Kaira team</p>

          <div className="still-btns">
            <button
              type="button"
              className="btn-wa"
              onClick={handleWhatsApp}
              aria-label="Message us on WhatsApp"
            >
              <WhatsAppIcon />
              MESSAGE US ON WHATSAPP
            </button>

            <a
              href={emailHref}
              className="btn-line"
              aria-label="Write to us by email"
            >
              <EnvelopeIcon />
              WRITE TO US
            </a>
          </div>
        </div>

        {/* Right Column: 3 Contact & Tracker Channels */}
        <ul className="chan" aria-label="Support channels">
          {/* Channel 1: WhatsApp */}
          <li className="chan-row">
            <div className="chan-ic" aria-hidden="true">
              <WhatsAppIcon />
            </div>
            <div>
              <div className="chan-k">WhatsApp</div>
              <div className="chan-v">
                The quickest way to reach us. {DEPOSIT_SETTINGS.support_days}, {DEPOSIT_SETTINGS.support_hours}, with replies usually within {DEPOSIT_SETTINGS.support_sla}.
              </div>
            </div>
            <button
              type="button"
              className="chan-go"
              onClick={handleWhatsApp}
              aria-label="Start a WhatsApp chat"
            >
              Start a chat
            </button>
          </li>

          {/* Channel 2: Email */}
          <li className="chan-row">
            <div className="chan-ic" aria-hidden="true">
              <EnvelopeIcon />
            </div>
            <div>
              <div className="chan-k">Email</div>
              <div className="chan-v">
                {DEPOSIT_SETTINGS.support_email}. Ideal for sharing photographs or a payment receipt.
              </div>
            </div>
            <a
              href={emailHref}
              className="chan-go"
              aria-label="Send an email to House of Kaira"
            >
              Send an email
            </a>
          </li>

          {/* Channel 3: Deposit Tracker */}
          <li className="chan-row">
            <div className="chan-ic" aria-hidden="true">
              <UserIcon />
            </div>
            <div>
              <div className="chan-k">Your deposit, in one place</div>
              <div className="chan-v">
                Follow every step, from Deposit requested to Refunded, in the Deposit Tracker in My Account.
              </div>
            </div>
            <Link
              to="/account"
              className="chan-go"
              aria-label="Go to My Account deposit tracker"
            >
              Go to my account
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default React.memo(DepositClosingBand);
