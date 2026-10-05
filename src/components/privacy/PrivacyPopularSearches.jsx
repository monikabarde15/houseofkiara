/**
 * House of Kaira - Privacy Policy Popular Searches
 * Section 5.4 of Build Specification v2.0
 */

import React from 'react';
import { POPULAR_SEARCH_LINKS } from '../../data/privacy/privacyKeywords.js';
import { scrollToAnchor } from '../../utils/privacy/privacyFormatter.jsx';

const PrivacyPopularSearches = ({ onSelectClause }) => {
  const handleClick = (link, e) => {
    e.preventDefault();
    if (onSelectClause) {
      onSelectClause(link);
    } else {
      scrollToAnchor(link.anchor, true);
    }
  };

  return (
    <div className="privacy-popular-container" aria-label="Popular search topics">
      <span className="privacy-popular-label">Popular:</span>
      <div className="privacy-popular-links">
        {POPULAR_SEARCH_LINKS.map((link, idx) => (
          <React.Fragment key={`pop-${idx}`}>
            <button
              type="button"
              className="privacy-popular-btn"
              onClick={(e) => handleClick(link, e)}
            >
              {link.label}
            </button>
            {idx < POPULAR_SEARCH_LINKS.length - 1 && (
              <span className="privacy-popular-separator" aria-hidden="true" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default React.memo(PrivacyPopularSearches);
