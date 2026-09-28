import React from 'react';
import { THE_ESSENTIALS } from '../../data/terms/termsRegistry.js';
import { scrollToClause, formatTermsText } from '../../utils/terms/termsFormatter.jsx';
import { ChevronRightIcon } from './TermsIcons.jsx';

/**
 * The Essentials 8-Row Summary List
 * Section 5.7 of Build Specification v3.0
 */
const TheEssentials = ({ onSelectClause }) => {
  const handleRowClick = (item, e) => {
    e.preventDefault();
    if (onSelectClause) {
      onSelectClause(item);
    } else {
      scrollToClause(item.anchor);
    }
  };

  const noteText = "These points help you find your way; the clauses themselves are the agreement. Nothing in these Terms limits your rights under Indian consumer law, as clause 54 explains.";

  return (
    <section className="terms-essentials-section" aria-labelledby="terms-essentials-label">
      <div className="terms-essentials-label-row">
        <span id="terms-essentials-label" className="terms-essentials-label">
          THE ESSENTIALS
        </span>
      </div>

      <div className="terms-essentials-list">
        {THE_ESSENTIALS.map((row, idx) => {
          return (
            <button
              key={`essential-${idx}`}
              type="button"
              className="terms-essentials-row"
              onClick={(e) => handleRowClick(row, e)}
              aria-label={`Clause ${row.clauseNumber}: ${row.summary}`}
            >
              <span className="terms-essentials-summary">{row.summary}</span>
              <div className="terms-essentials-right">
                <span className="terms-essentials-ref">CLAUSE {row.clauseNumber}</span>
                <ChevronRightIcon size={12} className="terms-essentials-chevron" color="var(--hok-chevron-grey)" />
              </div>
            </button>
          );
        })}
      </div>

      <p className="terms-essentials-note">
        {formatTermsText(noteText)}
      </p>
    </section>
  );
};

export default React.memo(TheEssentials);
