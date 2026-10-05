import React from 'react';
import { ALL_CLAUSES } from '../../data/terms/termsRegistry.js';
import { POPULAR_SEARCH_CLAUSES } from '../../data/terms/termsKeywords.js';
import { scrollToClause } from '../../utils/terms/termsFormatter.jsx';

/**
 * Terms & Conditions Popular Searches Bar
 * Section 5.3 of Build Specification v3.0
 */
const TermsPopularSearches = ({ onSelectClause }) => {
  const popularItems = POPULAR_SEARCH_CLAUSES.map(num => {
    const clause = ALL_CLAUSES.find(c => c.number === num);
    return clause || null;
  }).filter(Boolean);

  const handleClick = (clause, e) => {
    e.preventDefault();
    if (onSelectClause) {
      onSelectClause(clause);
    } else {
      scrollToClause(clause.anchor);
    }
  };

  return (
    <div className="terms-popular-container" aria-label="Popular searches">
      <span className="terms-popular-label">Popular:</span>
      <div className="terms-popular-list">
        {popularItems.map((item, idx) => (
          <React.Fragment key={`pop-${item.number}`}>
            {idx > 0 && <span className="terms-popular-dot" aria-hidden="true">·</span>}
            <button
              type="button"
              className="terms-popular-link"
              onClick={(e) => handleClick(item, e)}
            >
              {item.title}
            </button>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default React.memo(TermsPopularSearches);
