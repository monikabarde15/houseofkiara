import React from 'react';
import { TERMS_SETTINGS } from '../../data/terms/termsSettings.js';
import { PrintIcon } from './TermsIcons.jsx';
import TermsSearchBox from './TermsSearchBox.jsx';
import TermsPopularSearches from './TermsPopularSearches.jsx';

/**
 * Terms & Conditions Hero Section
 * Section 5.2 of Build Specification v3.0
 */
const TermsHero = ({ onSelectClause, onPrint }) => {
  const handlePrintClick = (e) => {
    e.preventDefault();
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  return (
    <section className="terms-hero" aria-labelledby="terms-main-title">
      <div className="terms-hero-inner">
        {/* Small gold header with decorative side lines */}
        <div className="terms-hero-tag-row">
          <span className="terms-hero-tag-line" aria-hidden="true" />
          <span className="terms-hero-tag-text">THE AGREEMENT BETWEEN US</span>
          <span className="terms-hero-tag-line" aria-hidden="true" />
        </div>

        {/* Page title */}
        <h1 id="terms-main-title" className="terms-hero-title">
          Terms &amp; <span className="terms-title-italic">conditions</span>
        </h1>

        {/* Introduction paragraph */}
        <p className="terms-hero-intro">
          Everything you and House of Kaira agree to when you rent, buy or list with us. Written to be read, with every clause numbered so it is easy to find and share.
        </p>

        {/* Version metadata & Print trigger line */}
        <div className="terms-hero-version-row">
          <span className="terms-version-item">{TERMS_SETTINGS.terms_version}</span>
          <span className="terms-version-slash" aria-hidden="true">/</span>
          <span className="terms-version-item">In force from {TERMS_SETTINGS.terms_effective}</span>
          <span className="terms-version-slash" aria-hidden="true">/</span>
          <span className="terms-version-item">Last updated {TERMS_SETTINGS.terms_updated}</span>
          <span className="terms-version-slash" aria-hidden="true">/</span>
          <button
            type="button"
            className="terms-version-print-btn"
            onClick={handlePrintClick}
            aria-label="Print or save a copy of terms and conditions"
          >
            <PrintIcon size={13} className="terms-print-icon" color="var(--hok-charcoal)" />
            <span>Print or save a copy</span>
          </button>
        </div>

        {/* Search Bar Component */}
        <TermsSearchBox onSelectClause={onSelectClause} />

        {/* Popular Searches Component */}
        <TermsPopularSearches onSelectClause={onSelectClause} />
      </div>
    </section>
  );
};

export default React.memo(TermsHero);
