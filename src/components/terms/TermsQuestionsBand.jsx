import React from 'react';
import { TERMS_SETTINGS } from '../../data/terms/termsSettings.js';
import { scrollToClause } from '../../utils/terms/termsFormatter.jsx';
import { WhatsAppIcon, EmailIcon, DocumentIcon } from './TermsIcons.jsx';

/**
 * Terms & Conditions "Can't Find Your Answer?" Questions Band
 * Section 5.11 of Build Specification v3.0
 */
const TermsQuestionsBand = ({ onShowToast }) => {
  const handleWhatsAppChat = (e) => {
    e.preventDefault();
    if (onShowToast) onShowToast('Opening WhatsApp');
    const msg = encodeURIComponent('Hi House of Kaira, I had a question about your Terms & Conditions.');
    window.open(`https://wa.me/${TERMS_SETTINGS.support_whatsapp_raw}?text=${msg}`, '_blank');
  };

  const handleEmailUs = (e) => {
    e.preventDefault();
    window.location.href = `mailto:${TERMS_SETTINGS.support_email}?subject=Question%20about%20Terms%20%26%20Conditions`;
  };

  const handleComplaintClause = (e) => {
    e.preventDefault();
    scrollToClause('#c-grievance');
  };

  return (
    <section className="terms-questions-band" aria-labelledby="terms-questions-heading">
      {/* Background large decorative quotation mark watermark */}
      <span className="terms-band-watermark" aria-hidden="true">“</span>

      <div className="terms-questions-band-inner">
        {/* Left Column: Heading, Paragraph, Buttons */}
        <div className="terms-questions-left">
          <div className="terms-band-tag-row">
            <span className="terms-band-tag-line" aria-hidden="true" />
            <span className="terms-band-tag-text">WE’RE HERE FOR YOU</span>
          </div>

          <h2 id="terms-questions-heading" className="terms-band-title">
            Questions about these <span className="terms-band-title-italic">terms?</span>
          </h2>

          <p className="terms-band-paragraph">
            If a clause is unclear, or you would like to know how it applies to your booking, order or listing, message us. We would much rather explain it now than have you wonder later.
          </p>

          <p className="terms-band-signoff">
            With love, the House of Kaira team
          </p>

          <div className="terms-band-buttons-row">
            <button
              type="button"
              className="terms-band-btn-whatsapp"
              onClick={handleWhatsAppChat}
            >
              <WhatsAppIcon size={16} color="#FFFFFF" className="terms-band-btn-icon" />
              <span>MESSAGE US ON WHATSAPP</span>
            </button>

            <button
              type="button"
              className="terms-band-btn-email"
              onClick={handleEmailUs}
            >
              <EmailIcon size={15} color="var(--hok-gold-light)" className="terms-band-btn-icon" />
              <span>WRITE TO US</span>
            </button>
          </div>
        </div>

        {/* Right Column: 3 Contact & Grievance Channels */}
        <div className="terms-questions-right">
          <div className="terms-channels-list">
            {/* Channel 1: WhatsApp */}
            <div className="terms-channel-row">
              <div className="terms-channel-icon-circle">
                <WhatsAppIcon size={17} color="var(--hok-gold-light)" />
              </div>
              <div className="terms-channel-info">
                <h4 className="terms-channel-name">WhatsApp</h4>
                <p className="terms-channel-desc">
                  The fastest way to reach us. {TERMS_SETTINGS.support_days}, {TERMS_SETTINGS.support_hours}, with replies usually within {TERMS_SETTINGS.support_sla}.
                </p>
              </div>
              <button
                type="button"
                className="terms-channel-action-btn"
                onClick={handleWhatsAppChat}
              >
                START A CHAT
              </button>
            </div>

            {/* Channel 2: Email */}
            <div className="terms-channel-row">
              <div className="terms-channel-icon-circle">
                <EmailIcon size={17} color="var(--hok-gold-light)" />
              </div>
              <div className="terms-channel-info">
                <h4 className="terms-channel-name">Email</h4>
                <p className="terms-channel-desc">
                  {TERMS_SETTINGS.support_email}. Best when you want to send photos or documents.
                </p>
              </div>
              <button
                type="button"
                className="terms-channel-action-btn"
                onClick={handleEmailUs}
              >
                SEND AN EMAIL
              </button>
            </div>

            {/* Channel 3: Grievance / Complaint */}
            <div className="terms-channel-row">
              <div className="terms-channel-icon-circle">
                <DocumentIcon size={17} color="var(--hok-gold-light)" />
              </div>
              <div className="terms-channel-info">
                <h4 className="terms-channel-name">A formal complaint</h4>
                <p className="terms-channel-desc">
                  Our Grievance Officer acknowledges every complaint within {TERMS_SETTINGS.grievance_ack} and resolves it within {TERMS_SETTINGS.grievance_resolve}.
                </p>
              </div>
              <button
                type="button"
                className="terms-channel-action-btn"
                onClick={handleComplaintClause}
              >
                READ THE CLAUSE
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(TermsQuestionsBand);
