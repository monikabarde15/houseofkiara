import React, { useState } from 'react';
import { PRIVACY_SETTINGS } from '../../data/privacy/privacySettings.js';
import PrivacySearchBox from './PrivacySearchBox.jsx';
import PrivacyPopularSearches from './PrivacyPopularSearches.jsx';

const PrivacyHero = ({ onSelectClause, onPrint, onShowToast }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <section
      className={`privacy-hero ${isSearchOpen ? 'privacy-hero-search-active' : ''}`}
      aria-label="Privacy Policy introduction and search"
    >
      <div className="privacy-hero-inner">
        {/* 1. Eyebrow Tag Line */}
        <div className="privacy-hero-tag-row privacy-enter privacy-e1">
          <span className="privacy-hero-tag-line" aria-hidden="true" />
          <span className="privacy-hero-tag-text">YOUR INFORMATION WITH US</span>
          <span className="privacy-hero-tag-line" aria-hidden="true" />
        </div>

        {/* 2. Main Page Title */}
        <h1 className="privacy-hero-title privacy-enter privacy-e2">
          Privacy <span className="privacy-title-italic">policy</span>
        </h1>

        {/* 3. Intro Paragraph & Version Row */}
        <div className="privacy-enter privacy-e3">
          <p className="privacy-hero-intro">
            What we collect when you rent, buy or list with us, why we need it, who sees it, and how you stay in control. Written to be read, with every clause numbered so it is easy to find and share.
          </p>

          <div className="privacy-hero-version-row">
            <span className="privacy-version-item">
              {PRIVACY_SETTINGS.privacy_version}
            </span>
            <span className="privacy-version-item">
              In force from {PRIVACY_SETTINGS.privacy_effective}
            </span>
            <span className="privacy-version-item">
              Last updated {PRIVACY_SETTINGS.privacy_updated}
            </span>
            <button
              type="button"
              className="privacy-version-print-btn"
              onClick={onPrint}
            >
              Print or save a copy
            </button>
          </div>
        </div>

        {/* 4. Real-time Search Box */}
        <div className="privacy-enter privacy-e4">
          <PrivacySearchBox
            onSelectClause={onSelectClause}
            onShowToast={onShowToast}
            onOpenChange={setIsSearchOpen}
          />
        </div>

        {/* 5. Popular Search Links */}
        <div className="privacy-enter privacy-e5">
          <PrivacyPopularSearches
            onSelectClause={onSelectClause}
          />
        </div>
      </div>
    </section>
  );
};

export default React.memo(PrivacyHero);
