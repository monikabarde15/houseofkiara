/**
 * House of Kaira - Cookie Policy Definitions List (Clause 4)
 * Section 5.8 & 11.3 of Build Specification v1.0 (hok_cookie_v4)
 */

import React from 'react';
import { DEFINITIONS } from '../../data/cookies/cookieRegistry.js';

const CookieDefinitionsList = () => {
  return (
    <div className="cookie-definitions-container">
      <dl className="cookie-definitions-list">
        {DEFINITIONS.map((def, idx) => (
          <div key={`def-${idx}`} className="cookie-definition-row">
            <dt className="cookie-definition-term">{def.term}</dt>
            <dd className="cookie-definition-meaning">{def.meaning}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default React.memo(CookieDefinitionsList);
