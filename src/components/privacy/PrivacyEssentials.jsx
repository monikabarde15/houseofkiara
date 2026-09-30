/**
 * House of Kaira - Privacy Policy "The Essentials"
 * Section 5.8 of Build Specification v2.0
 */

import React from 'react';
import { THE_ESSENTIALS } from '../../data/privacy/privacyRegistry.js';
import { scrollToAnchor } from '../../utils/privacy/privacyFormatter.jsx';
import { ChevronRightIcon } from './PrivacyIcons.jsx';

const PrivacyEssentials = ({ onSelectClause }) => {
  const handleClick = (item, e) => {
    e.preventDefault();
    if (onSelectClause) {
      onSelectClause(item);
    } else if (item.anchor) {
      scrollToAnchor(item.anchor, true);
    }
  };

  return (
    <section className="privacy-essentials-section" aria-label="The essentials">
      <span className="privacy-essentials-label">THE ESSENTIALS</span>

      <div className="privacy-essentials-list" role="list">
        {THE_ESSENTIALS.map((item) => (
          <button
            key={`essentials-${item.id}`}
            type="button"
            className="privacy-essentials-row"
            onClick={(e) => handleClick(item, e)}
          >
            <div className="privacy-essentials-main-col">
              <span className="privacy-essentials-text">{item.text}</span>
              <span className="privacy-essentials-ref privacy-essentials-ref-mobile">
                {item.reference}
              </span>
            </div>

            <span className="privacy-essentials-ref privacy-essentials-ref-desktop">
              {item.reference}
            </span>

            <div className="privacy-essentials-chevron-col">
              <ChevronRightIcon size={12} className="privacy-essentials-chevron" />
            </div>
          </button>
        ))}
      </div>

      <p className="privacy-essentials-note">
        These points help you find your way; the clauses themselves are our notice to you. Nothing in this policy limits your rights under the Digital Personal Data Protection Act, 2023 or any other law.
      </p>
    </section>
  );
};

export default React.memo(PrivacyEssentials);
