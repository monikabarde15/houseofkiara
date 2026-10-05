/**
 * House of Kaira - Cookie Policy Dark Questions Band
 * Section 5.11 & 11.4 of Build Specification v1.0 (hok_cookie_v4)
 */

import React from 'react';
import { COOKIE_SETTINGS } from '../../data/cookies/cookieSettings.js';
import { scrollToAnchor } from '../../utils/cookies/cookieFormatter.jsx';
import { WhatsAppIcon, EmailIcon, ShieldIcon } from './CookieIcons.jsx';

const CookieQuestionsBand = ({ onShowToast, onJumpClause }) => {
  const handleWhatsAppChat = (e) => {
    e.preventDefault();
    if (onShowToast) {
      onShowToast('Opening WhatsApp');
    }
    const message = 'Hello House of Kaira, I have a question about your Cookie Policy.';
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${COOKIE_SETTINGS.support_whatsapp_raw}?text=${encoded}`, '_blank');
  };

  const handleEmailUs = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent('A question about your Cookie Policy');
    window.location.href = `mailto:${COOKIE_SETTINGS.support_email}?subject=${subject}`;
  };

  const handleContactDetails = (e) => {
    e.preventDefault();
    if (onJumpClause) {
      onJumpClause('#c-contact');
    } else {
      scrollToAnchor('#c-contact', true);
    }
  };

  return (
    <section className="cookie-questions-band" aria-label="Questions about cookies">
      {/* Decorative Large Quotation Mark */}
      <span className="cookie-questions-quote-mark" aria-hidden="true">
        “
      </span>

      <div className="cookie-questions-band-inner">
        {/* Left Column: Heading, Copy, CTA Buttons */}
        <div className="cookie-questions-left-col">
          <div className="cookie-questions-eyebrow-row">
            <span className="cookie-questions-eyebrow-line" aria-hidden="true" />
            <span className="cookie-questions-eyebrow-text">We’re here for you</span>
          </div>

          <h2 className="cookie-questions-heading">
            Questions about <em className="cookie-questions-heading-italic">cookies?</em>
          </h2>

          <p className="cookie-questions-paragraph">
            If a clause is unclear, or you would like to know exactly what a cookie on our website does, message us. We would much rather explain it now than have you wonder later.
          </p>

          <p className="cookie-questions-signature">
            With love, the House of Kaira team
          </p>

          <div className="cookie-questions-buttons-row">
            <button
              type="button"
              className="cookie-band-btn-whatsapp"
              onClick={handleWhatsAppChat}
            >
              <WhatsAppIcon size={16} color="#FFFFFF" />
              <span>MESSAGE US ON WHATSAPP</span>
            </button>

            <button
              type="button"
              className="cookie-band-btn-email"
              onClick={handleEmailUs}
            >
              <EmailIcon size={15} color="var(--hok-cream)" />
              <span>WRITE TO US</span>
            </button>
          </div>
        </div>

        {/* Right Column: Contact Channels */}
        <div className="cookie-questions-right-col">
          <div className="cookie-channels-list">
            {/* Channel 1: WhatsApp */}
            <div className="cookie-channel-row">
              <div className="cookie-channel-icon-circle">
                <WhatsAppIcon size={17} color="var(--hok-gold-light)" />
              </div>
              <div className="cookie-channel-body">
                <h3 className="cookie-channel-title">WhatsApp</h3>
                <p className="cookie-channel-desc">
                  The fastest way to reach us. {COOKIE_SETTINGS.support_days}, {COOKIE_SETTINGS.support_hours}, with replies usually within {COOKIE_SETTINGS.support_sla}.
                </p>
              </div>
              <button
                type="button"
                className="cookie-channel-action-btn"
                onClick={handleWhatsAppChat}
              >
                START A CHAT
              </button>
            </div>

            {/* Channel 2: Email */}
            <div className="cookie-channel-row">
              <div className="cookie-channel-icon-circle">
                <EmailIcon size={17} color="var(--hok-gold-light)" />
              </div>
              <div className="cookie-channel-body">
                <h3 className="cookie-channel-title">Email</h3>
                <p className="cookie-channel-desc">
                  {COOKIE_SETTINGS.support_email}. Best when you want to send photos or documents.
                </p>
              </div>
              <button
                type="button"
                className="cookie-channel-action-btn"
                onClick={handleEmailUs}
              >
                SEND AN EMAIL
              </button>
            </div>

            {/* Channel 3: Grievance / Privacy Request */}
            <div className="cookie-channel-row">
              <div className="cookie-channel-icon-circle">
                <ShieldIcon size={17} color="var(--hok-gold-light)" />
              </div>
              <div className="cookie-channel-body">
                <h3 className="cookie-channel-title">A privacy request or complaint</h3>
                <p className="cookie-channel-desc">
                  Our Grievance Officer acknowledges every request within {COOKIE_SETTINGS.grievance_ack} and responds within {COOKIE_SETTINGS.grievance_resolve}.
                </p>
              </div>
              <button
                type="button"
                className="cookie-channel-action-btn"
                onClick={handleContactDetails}
              >
                CONTACT DETAILS
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(CookieQuestionsBand);
