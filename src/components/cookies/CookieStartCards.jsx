/**
 * House of Kaira - Cookie Policy "Where to Start" Cards
 * Section 5.3 of Build Specification v1.0 (hok_cookie_v4)
 */

import React from 'react';
import { WHERE_TO_START_CARDS } from '../../data/cookies/cookieRegistry.js';
import { scrollToAnchor } from '../../utils/cookies/cookieFormatter.jsx';

const CookieStartCards = ({ onSelectCard }) => {
  const handleCardClick = (card, e) => {
    e.preventDefault();
    if (onSelectCard) {
      onSelectCard(card);
    } else if (card.anchor) {
      scrollToAnchor(card.anchor, false); // Section 5.3: Parts are not highlighted
    }
  };

  return (
    <section
      className="cookie-start-cards-region"
      aria-label="Where to start"
    >
      <div className="cookie-start-cards-container">
        {WHERE_TO_START_CARDS.map((card, idx) => (
          <div
            key={`cookie-start-${idx}`}
            className="cookie-start-card"
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
            <span className="cookie-card-tag">{card.tag}</span>
            <div className="cookie-card-main-row">
              <h3 className="cookie-card-title">{card.title}</h3>
              <span className="cookie-card-range">{card.range}</span>
            </div>
            <span className="cookie-card-hover-line" aria-hidden="true" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default React.memo(CookieStartCards);
