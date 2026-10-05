/**
 * House of Kaira - Cookie Policy "Our Policies" & "Your Choices" Footer Band
 * Section 5.11 & 11.4 of Build Specification v1.0 (hok_cookie_v4)
 */

import React from 'react';
import { COOKIE_SETTINGS } from '../../data/cookies/cookieSettings.js';

const CookiePoliciesLine = ({ onPrint, onOpenCookieSettings }) => {
  return (
    <footer className="cookie-policies-line-container" aria-label="Our policies and your choices">
      {/* Row 1: Our Policies */}
      <div className="cookie-policies-row cookie-policies-row-1">
        <span className="cookie-policies-label">Our policies</span>
        <div className="cookie-policies-links-group">
          <a href="/privacy-policy" className="cookie-policy-link">Privacy Policy</a>
          <span className="cookie-policy-separator" aria-hidden="true" />
          <a href="/terms" className="cookie-policy-link">Terms & Conditions</a>
          <span className="cookie-policy-separator" aria-hidden="true" />
          <a href="/refund-and-cancellation" className="cookie-policy-link">Refund & Cancellation Policy</a>
          <span className="cookie-policy-separator" aria-hidden="true" />
          <a href="/deposit-policy" className="cookie-policy-link">Deposit Policy</a>
          <span className="cookie-policy-separator" aria-hidden="true" />
          <a href="/care-and-cleaning" className="cookie-policy-link">Care, Cleaning & Damage Policy</a>
          <span className="cookie-policy-separator" aria-hidden="true" />
          <a href="/shipping-and-delivery" className="cookie-policy-link">Shipping & Delivery Policy</a>
          <span className="cookie-policy-separator" aria-hidden="true" />
          <a href="/faqs" className="cookie-policy-link">Help & FAQs</a>
        </div>
      </div>

      {/* Row 2: Your Choices */}
      <div className="cookie-policies-row cookie-policies-row-2">
        <span className="cookie-policies-label">Your choices</span>
        <div className="cookie-policies-links-group">
          <button
            type="button"
            className="cookie-policy-link cookie-policy-btn-link"
            onClick={onOpenCookieSettings}
          >
            Cookie settings
          </button>
          <span className="cookie-policy-separator" aria-hidden="true" />
          <a href="/profile" className="cookie-policy-link">Notification settings</a>
          <span className="cookie-policy-separator" aria-hidden="true" />
          <a href="/profile" className="cookie-policy-link">My Account</a>
          <span className="cookie-policy-separator" aria-hidden="true" />
          <a href="/privacy-policy#c-ask" className="cookie-policy-link">Make a privacy request</a>
        </div>
      </div>

      {/* Policies Band Note */}
      <div className="cookie-policies-note-row">
        <p className="cookie-policies-note-text">
          This policy forms part of our Privacy Policy and our Terms. Version {COOKIE_SETTINGS.cookie_version}, last updated {COOKIE_SETTINGS.cookie_updated}. Earlier versions are kept, and we send them on request.{' '}
          <button
            type="button"
            className="cookie-policies-print-link"
            onClick={onPrint}
          >
            Print or save as PDF
          </button>
        </p>
      </div>
    </footer>
  );
};

export default React.memo(CookiePoliciesLine);
