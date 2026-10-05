/**
 * House of Kaira - Cookie Policy Sections List Component
 * Renders all 6 Parts and their Clauses
 * Section 5.7 to 5.10 of Build Specification v1.0 (hok_cookie_v4)
 */

import React from 'react';
import CookieOpeningIntro from './CookieOpeningIntro.jsx';
import CookieEssentials from './CookieEssentials.jsx';
import CookiePartHeader from './CookiePartHeader.jsx';
import CookieClauseItem from './CookieClauseItem.jsx';
import { COOKIE_PARTS } from '../../data/cookies/cookieRegistry.js';

const CookieSectionsList = ({ onShowToast, onJumpClause }) => {
  return (
    <div className="cookie-policy-body-container">
      {/* 1. Opening Introduction Paragraph */}
      <CookieOpeningIntro />

      {/* 2. The Essentials (7 Promises) */}
      <CookieEssentials onSelectClause={onJumpClause} />

      {/* 3. The 6 Policy Parts */}
      <div className="cookie-parts-container">
        {COOKIE_PARTS.map((part) => {
          const cleanPartAnchor = part.anchor.replace(/^#/, '');
          return (
            <section
              key={`part-${part.number}`}
              className="cookie-part-section"
              id={cleanPartAnchor}
              aria-label={`Part ${part.number}: ${part.title}`}
            >
              <CookiePartHeader part={part} />

              <div className="cookie-part-clauses-wrapper">
                {part.clauses.map((clause) => (
                  <CookieClauseItem
                    key={`clause-${clause.number}`}
                    clause={clause}
                    onShowToast={onShowToast}
                    onJumpClause={onJumpClause}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(CookieSectionsList);
