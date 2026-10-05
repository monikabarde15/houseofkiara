/**
 * House of Kaira - Privacy Policy Sections List
 * Renders all 10 Parts and 47 Clauses per Section 5.9 & 5.10
 */

import React from 'react';
import { PRIVACY_PARTS } from '../../data/privacy/privacyRegistry.js';
import PrivacyPartHeader from './PrivacyPartHeader.jsx';
import PrivacyClauseItem from './PrivacyClauseItem.jsx';

const PrivacySectionsList = ({ onShowToast, onJumpClause }) => {
  return (
    <div className="privacy-sections-list">
      {PRIVACY_PARTS.map((part) => {
        const cleanPartAnchor = part.anchor.replace(/^#/, '');
        return (
          <section
            key={`part-${part.number}`}
            className="privacy-part-section"
            id={cleanPartAnchor}
            aria-label={part.title}
          >
            {/* Part Header */}
            <PrivacyPartHeader part={part} />

            {/* Clauses in this Part */}
            <div className="privacy-part-clauses">
              {part.clauses.map((clause) => (
                <PrivacyClauseItem
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
  );
};

export default React.memo(PrivacySectionsList);
