/**
 * House of Kaira - Cookie Policy "The Essentials"
 * Section 5.6 & 11.2 of Build Specification v1.0 (hok_cookie_v4)
 */

import React from 'react';
import { THE_ESSENTIALS } from '../../data/cookies/cookieRegistry.js';
import { scrollToAnchor } from '../../utils/cookies/cookieFormatter.jsx';
import { ChevronIcon } from './CookieIcons.jsx';

const CookieEssentials = ({ onSelectClause }) => {
  const handleClick = (item, e) => {
    e.preventDefault();
    if (onSelectClause) {
      onSelectClause(item);
    } else if (item.anchor) {
      scrollToAnchor(item.anchor, true);
    }
  };

  return (
    <section className="cookie-essentials-section" aria-label="The essentials">
      <span className="cookie-essentials-label">THE ESSENTIALS</span>

      <div className="cookie-essentials-list" role="list">
        {THE_ESSENTIALS.map((item) => (
          <button
            key={`essentials-${item.id}`}
            type="button"
            className="cookie-essentials-row"
            onClick={(e) => handleClick(item, e)}
          >
            <div className="cookie-essentials-main-col">
              <span className="cookie-essentials-text">{item.text}</span>
              <span className="cookie-essentials-ref cookie-essentials-ref-mobile">
                {item.reference}
              </span>
            </div>

            <span className="cookie-essentials-ref cookie-essentials-ref-desktop">
              {item.reference}
            </span>

            <div className="cookie-essentials-chevron-col">
              <ChevronIcon size={14} className="cookie-essentials-chevron" />
            </div>
          </button>
        ))}
      </div>

      <p className="cookie-essentials-note">
        These points help you find your way; the clauses themselves are our notice to you. Nothing in this policy limits your rights under the Digital Personal Data Protection Act, 2023 or any other law.
      </p>
    </section>
  );
};

export default React.memo(CookieEssentials);
