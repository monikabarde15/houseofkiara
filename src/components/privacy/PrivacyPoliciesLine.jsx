/**
 * House of Kaira - Privacy Policy "Our Policies" & "Your Choices" Footer Band
 * Section 5.12 & 12.4 of Build Specification v2.0
 */

import React from 'react';
import { PRIVACY_SETTINGS } from '../../data/privacy/privacySettings.js';
import { scrollToAnchor } from '../../utils/privacy/privacyFormatter.jsx';

const PrivacyPoliciesLine = ({ onPrint, onJumpClause }) => {
  const handlePrivacyRequest = (e) => {
    e.preventDefault();
    if (onJumpClause) {
      onJumpClause('38');
    } else {
      scrollToAnchor('#c-ask', true);
    }
  };

  return (
    <footer className="privacy-policies-line-container" aria-label="Our policies and your choices">
      {/* Row 1: Our Policies */}
      <div className="privacy-policies-row privacy-policies-row-1">
        <span className="privacy-policies-label">Our policies</span>
        <div className="privacy-policies-links-group">
          <a href="/terms" className="privacy-policy-link">Terms & Conditions</a>
          <span className="privacy-policy-separator" aria-hidden="true" />
          <a href="/cookies" className="privacy-policy-link">Cookie Policy</a>
          <span className="privacy-policy-separator" aria-hidden="true" />
          <a href="/refunds" className="privacy-policy-link">Refund & Cancellation Policy</a>
          <span className="privacy-policy-separator" aria-hidden="true" />
          <a href="/deposit" className="privacy-policy-link">Deposit Policy</a>
          <span className="privacy-policy-separator" aria-hidden="true" />
          <a href="/care-damage" className="privacy-policy-link">Care, Cleaning & Damage Policy</a>
          <span className="privacy-policy-separator" aria-hidden="true" />
          <a href="/shipping" className="privacy-policy-link">Shipping & Delivery Policy</a>
          <span className="privacy-policy-separator" aria-hidden="true" />
          <a href="/faqs" className="privacy-policy-link">Help & FAQs</a>
        </div>
      </div>

      {/* Row 2: Your Choices */}
      <div className="privacy-policies-row privacy-policies-row-2">
        <span className="privacy-policies-label">Your choices</span>
        <div className="privacy-policies-links-group">
          <a href="/cookies" className="privacy-policy-link">Cookie settings</a>
          <span className="privacy-policy-separator" aria-hidden="true" />
          <a href="/profile" className="privacy-policy-link">Notification settings</a>
          <span className="privacy-policy-separator" aria-hidden="true" />
          <a href="/profile" className="privacy-policy-link">My Account</a>
          <span className="privacy-policy-separator" aria-hidden="true" />
          <button
            type="button"
            className="privacy-policy-link privacy-policy-btn-link"
            onClick={handlePrivacyRequest}
          >
            Make a privacy request
          </button>
        </div>
      </div>

      {/* Policies Band Note */}
      <div className="privacy-policies-note-row">
        <p className="privacy-policies-note-text">
          This policy is our notice to you about your personal data, and forms part of our Terms. {PRIVACY_SETTINGS.privacy_version}, last updated {PRIVACY_SETTINGS.privacy_updated}. Earlier versions are kept, and we send them on request.{' '}
          <button
            type="button"
            className="privacy-policies-print-link"
            onClick={onPrint}
          >
            Print or save as PDF
          </button>
        </p>
      </div>
    </footer>
  );
};

export default React.memo(PrivacyPoliciesLine);
