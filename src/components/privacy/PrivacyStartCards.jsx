/**
 * House of Kaira - Privacy Policy "Where to Start" Cards
 * Section 5.5 of Build Specification v2.0
 */

import React from 'react';
import { WHERE_TO_START_CARDS } from '../../data/privacy/privacyKeywords.js';
import { scrollToAnchor } from '../../utils/privacy/privacyFormatter.jsx';

const PrivacyStartCards = ({ onSelectCard }) => {
  const handleCardClick = (card, e) => {
    e.preventDefault();
    if (onSelectCard) {
      onSelectCard(card);
    } else if (card.anchor) {
      scrollToAnchor(card.anchor, false); // Section 5.5: Parts are not highlighted
    }
  };

  return (
    <section
      className="privacy-start-cards-region"
      aria-label="Where to start"
    >
      <div className="privacy-start-cards-container">
        {WHERE_TO_START_CARDS.map((card, idx) => (
          <div
            key={`priv-start-${idx}`}
            className="privacy-start-card"
            role="button"
            tabIndex={0}
            onClick={(e) => handleCardClick(card, e)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCardClick(card, e);
              }
            }}
          >
            <span className="privacy-card-tag">{card.tag}</span>
            <div className="privacy-card-main-row">
              <h3 className="privacy-card-title">{card.title}</h3>
              <span className="privacy-card-range">{card.range}</span>
            </div>
            <span className="privacy-card-hover-line" aria-hidden="true" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default React.memo(PrivacyStartCards);
