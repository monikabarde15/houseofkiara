import React from 'react';
import { TERMS_PARTS } from '../../data/terms/termsRegistry.js';
import PartHeader from './PartHeader.jsx';
import ClauseItem from './ClauseItem.jsx';

/**
 * Terms & Conditions 12 Parts & 59 Clauses Container
 * Section 5.8 & 5.9 of Build Specification v3.0
 */
const TermsSectionsList = ({ onShowToast }) => {
  return (
    <div className="terms-sections-list">
      {TERMS_PARTS.map((part) => {
        return (
          <section
            key={`part-${part.partNumber}`}
            className="terms-part-block"
            aria-label={`Part ${part.partNumber}: ${part.title}`}
          >
            {/* Part Header */}
            <PartHeader part={part} />

            {/* Clauses in this Part */}
            <div className="terms-part-clauses">
              {part.clauses.map((clause) => (
                <ClauseItem
                  key={`clause-${clause.number}`}
                  clause={clause}
                  onShowToast={onShowToast}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default React.memo(TermsSectionsList);
