import React from 'react';
import { TERMS_SETTINGS } from '../../data/terms/termsSettings.js';
import { PrintIcon } from './TermsIcons.jsx';
import TermsSearchBox from './TermsSearchBox.jsx';
import TermsPopularSearches from './TermsPopularSearches.jsx';

/**
 * Terms & Conditions Hero Section
 * Section 5.2 of Build Specification v3.0
 */
const TermsHero = ({ onSelectClause, onPrint, getVal }) => {
  const handlePrintClick = (e) => {
    e.preventDefault();
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  const eyebrow = getVal ? getVal("terms_hero_eyebrow", "THE AGREEMENT BETWEEN US") : "THE AGREEMENT BETWEEN US";
  const heading = getVal ? getVal("terms_hero_heading", null) : null;
  const intro = getVal ? getVal("terms_hero_lead", "Everything you and House of Kaira agree to when you rent, buy or list with us. Written to be read, with every clause numbered so it is easy to find and share.") : "Everything you and House of Kaira agree to when you rent, buy or list with us. Written to be read, with every clause numbered so it is easy to find and share.";

  return (
    <section className="terms-hero" aria-labelledby="terms-main-title">
      <div className="terms-hero-inner">
        {/* Small gold header with decorative side lines */}
        <div className="terms-hero-tag-row">
          <span className="terms-hero-tag-line" aria-hidden="true" />
          <span className="terms-hero-tag-text">{eyebrow}</span>
          <span className="terms-hero-tag-line" aria-hidden="true" />
        </div>

        {/* Page title */}
        <h1 id="terms-main-title" className="terms-hero-title">
          {heading ? heading : <>Terms &amp; <span className="terms-title-italic">conditions</span></>}
        </h1>

        {/* Introduction paragraph */}
        <p className="terms-hero-intro">
          {intro}
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
            className="terms-print-btn"
            onClick={handlePrintClick}
            aria-label="Print Terms and Conditions"
          >
            <PrintIcon />
            <span>Print or save as PDF</span>
          </button>
        </div>

        {/* Search Input Box */}
        <TermsSearchBox onSelectClause={onSelectClause} />

        {/* Popular / Quick-Find Topics */}
        <TermsPopularSearches onSelectClause={onSelectClause} />
      </div>
    </section>
  );
};

export default React.memo(TermsHero);
