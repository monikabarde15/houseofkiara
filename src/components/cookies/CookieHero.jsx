/**
 * House of Kaira - Cookie Policy Hero Section
 * Section 5.2 of Build Specification v1.0
 */

import React from 'react';
import { COOKIE_SETTINGS } from '../../data/cookies/cookieSettings.js';
import { scrollToAnchor } from '../../utils/cookies/cookieFormatter.jsx';

const CookieHero = ({ onPrint, onOpenCookieSettings }) => {
  const handleCookieSettingsClick = (e) => {
    e.preventDefault();
    if (onOpenCookieSettings) {
      onOpenCookieSettings();
    } else {
      // Until site-wide cookie settings panel exists, jump to clause 19 and highlight it (Section 6)
      scrollToAnchor('#c-change', true);
    }
  };

  const handlePrintClick = (e) => {
    e.preventDefault();
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  return (
    <section className="cookie-hero" aria-label="Cookie Policy introduction">
      <div className="cookie-hero-inner">
        {/* 1. Eyebrow Tag Line */}
        <div className="cookie-hero-tag-row cookie-enter cookie-e1">
          <span className="cookie-hero-tag-line" aria-hidden="true" />
          <span className="cookie-hero-tag-text">YOUR CHOICES, EXPLAINED</span>
          <span className="cookie-hero-tag-line" aria-hidden="true" />
        </div>

        {/* 2. Main Page Title (H1) */}
        <h1 className="cookie-hero-title cookie-enter cookie-e2">
          Cookie <span className="cookie-title-italic">policy</span>
        </h1>

        {/* 3. Intro Paragraph & 5-Item Version Row */}
        <div className="cookie-enter cookie-e3">
          <p className="cookie-hero-intro">
            Every cookie and similar technology our website uses, who sets it, what it does and how long it lasts, and how to change your mind at any time. Written to be read, with every clause numbered so it is easy to find and share.
          </p>

          <div className="cookie-hero-version-row">
            <span className="cookie-version-item">
              {COOKIE_SETTINGS.cookie_version}
            </span>
            <span className="cookie-version-item">
              In force from {COOKIE_SETTINGS.cookie_effective}
            </span>
            <span className="cookie-version-item">
              Last updated {COOKIE_SETTINGS.cookie_updated}
            </span>
            <button
              type="button"
              className="cookie-version-link-btn cookie-version-settings-btn"
              onClick={handleCookieSettingsClick}
              aria-label="Open cookie settings"
            >
              Cookie settings
            </button>
            <button
              type="button"
              className="cookie-version-link-btn cookie-version-print-btn"
              onClick={handlePrintClick}
              aria-label="Print or save a copy of cookie policy"
            >
              Print or save a copy
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(CookieHero);
