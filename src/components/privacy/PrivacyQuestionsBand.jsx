/**
 * House of Kaira - Privacy Policy Dark Questions Band
 * Section 5.13 & 12.4 of Build Specification v2.0
 */

import React from 'react';
import { PRIVACY_SETTINGS } from '../../data/privacy/privacySettings.js';
import { scrollToAnchor } from '../../utils/privacy/privacyFormatter.jsx';
import { WhatsAppIcon, EmailIcon, ShieldIcon } from './PrivacyIcons.jsx';

const PrivacyQuestionsBand = ({ onShowToast, onJumpClause }) => {
  const handleWhatsAppChat = (e) => {
    e.preventDefault();
    if (onShowToast) {
      onShowToast('Opening WhatsApp');
    }
    const message = 'Hello House of Kaira, I have a question about your Privacy Policy.';
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${PRIVACY_SETTINGS.support_whatsapp_raw}?text=${encoded}`, '_blank');
  };

  const handleEmailUs = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent('A question about your Privacy Policy');
    window.location.href = `mailto:${PRIVACY_SETTINGS.support_email}?subject=${subject}`;
  };

  const handleHowToAsk = (e) => {
    e.preventDefault();
    if (onJumpClause) {
      onJumpClause('38');
    } else {
      scrollToAnchor('#c-ask', true);
    }
  };

  return (
    <section className="privacy-questions-band" aria-label="Questions about your data">
      {/* Decorative Large Quotation Mark (Section 5.13) */}
      <span className="privacy-questions-quote-mark" aria-hidden="true">
        “
      </span>

      <div className="privacy-questions-band-inner">
        {/* Left Column: Heading, Copy, CTA Buttons */}
        <div className="privacy-questions-left-col">
          <div className="privacy-questions-eyebrow-row">
            <span className="privacy-questions-eyebrow-line" aria-hidden="true" />
            <span className="privacy-questions-eyebrow-text">We’re here for you</span>
          </div>

          <h2 className="privacy-questions-heading">
            Questions about your <em className="privacy-questions-heading-italic">data?</em>
          </h2>

          <p className="privacy-questions-paragraph">
            If a clause is unclear, or you would like to know exactly what we hold about you and why, message us. We would much rather explain it now than have you wonder later.
          </p>

          <p className="privacy-questions-signature">
            With love, the House of Kaira team
          </p>

          <div className="privacy-questions-buttons-row">
            <button
              type="button"
              className="privacy-band-btn-whatsapp"
              onClick={handleWhatsAppChat}
            >
              <WhatsAppIcon size={16} color="#FFFFFF" />
              <span>MESSAGE US ON WHATSAPP</span>
            </button>

            <button
              type="button"
              className="privacy-band-btn-email"
              onClick={handleEmailUs}
            >
              <EmailIcon size={15} color="var(--hok-cream)" />
              <span>WRITE TO US</span>
            </button>
          </div>
        </div>

        {/* Right Column: Contact Channels */}
        <div className="privacy-questions-right-col">
          <div className="privacy-channels-list">
            {/* Channel 1: WhatsApp */}
            <div className="privacy-channel-row">
              <div className="privacy-channel-icon-circle">
                <WhatsAppIcon size={17} color="var(--hok-gold-light)" />
              </div>
              <div className="privacy-channel-body">
                <h3 className="privacy-channel-title">WhatsApp</h3>
                <p className="privacy-channel-desc">
                  The fastest way to reach us. {PRIVACY_SETTINGS.support_days}, {PRIVACY_SETTINGS.support_hours}, with replies usually within {PRIVACY_SETTINGS.support_sla}.
                </p>
              </div>
              <button
                type="button"
                className="privacy-channel-action-btn"
                onClick={handleWhatsAppChat}
              >
                START A CHAT
              </button>
            </div>

            {/* Channel 2: Email */}
            <div className="privacy-channel-row">
              <div className="privacy-channel-icon-circle">
                <EmailIcon size={17} color="var(--hok-gold-light)" />
              </div>
              <div className="privacy-channel-body">
                <h3 className="privacy-channel-title">Email</h3>
                <p className="privacy-channel-desc">
                  {PRIVACY_SETTINGS.support_email}. Best when you want to send photos or documents.
                </p>
              </div>
              <button
                type="button"
                className="privacy-channel-action-btn"
                onClick={handleEmailUs}
              >
                SEND AN EMAIL
              </button>
            </div>

            {/* Channel 3: Privacy Request / Grievance */}
            <div className="privacy-channel-row">
              <div className="privacy-channel-icon-circle">
                <ShieldIcon size={17} color="var(--hok-gold-light)" />
              </div>
              <div className="privacy-channel-body">
                <h3 className="privacy-channel-title">A privacy request or complaint</h3>
                <p className="privacy-channel-desc">
                  Our Grievance Officer acknowledges every request within {PRIVACY_SETTINGS.grievance_ack} and responds within {PRIVACY_SETTINGS.grievance_resolve}.
                </p>
              </div>
              <button
                type="button"
                className="privacy-channel-action-btn"
                onClick={handleHowToAsk}
              >
                HOW TO ASK
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(PrivacyQuestionsBand);
