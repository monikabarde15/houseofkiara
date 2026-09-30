/**
 * House of Kaira - Privacy Policy Definitions List (Clause 4)
 * Section 5.10 of Build Specification v2.0
 */

import React from 'react';
import { DEFINITIONS } from '../../data/privacy/privacyRegistry.js';

const PrivacyDefinitionsList = () => {
  return (
    <div className="privacy-definitions-container">
      <dl className="privacy-definitions-list">
        {DEFINITIONS.map((def, idx) => (
          <div key={`def-${idx}`} className="privacy-definition-row">
            <dt className="privacy-definition-term">{def.term}</dt>
            <dd className="privacy-definition-meaning">{def.meaning}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default React.memo(PrivacyDefinitionsList);
