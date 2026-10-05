import React from 'react';
import { WHERE_TO_START_CARDS } from '../../data/terms/termsRegistry.js';
import { scrollToClause } from '../../utils/terms/termsFormatter.jsx';

/**
 * Terms & Conditions "Where to Start" Cards
 * Section 5.4 of Build Specification v3.0
 */
const WhereToStartCards = () => {
  const handleCardClick = (anchor, e) => {
    e.preventDefault();
    scrollToClause(anchor);
  };

  return (
    <section
      className="terms-start-cards-region"
      aria-label="Where to start"
    >
      <div className="terms-start-cards-container">
        {WHERE_TO_START_CARDS.map((card, idx) => {
          const rangeText = `CLAUSES ${card.startClause} TO ${card.endClause}`;
          return (
            <div
              key={`start-card-${idx}`}
              className="terms-start-card"
              role="button"
              tabIndex={0}
              onClick={(e) => handleCardClick(card.anchor, e)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCardClick(card.anchor, e);
                }
              }}
            >
              <span className="terms-card-tag">{card.tag}</span>
              <h3 className="terms-card-title">{card.title}</h3>
              <span className="terms-card-range">{rangeText}</span>
              <span className="terms-card-hover-line" aria-hidden="true" />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default React.memo(WhereToStartCards);
