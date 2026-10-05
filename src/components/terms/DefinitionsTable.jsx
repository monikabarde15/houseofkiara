import React from 'react';
import { DEFINITIONS } from '../../data/terms/termsRegistry.js';
import { formatTermsText } from '../../utils/terms/termsFormatter.jsx';

/**
 * Terms & Conditions Definitions Table (Clause 4)
 * Section 8.1 & Clause 4 of Build Specification v3.0
 */
const DefinitionsTable = () => {
  return (
    <div className="terms-definitions-container">
      <div className="terms-definitions-table" role="table" aria-label="Definitions of special terms">
        <div className="terms-def-header-row" role="row">
          <div className="terms-def-col-term terms-def-th" role="columnheader">Term</div>
          <div className="terms-def-col-meaning terms-def-th" role="columnheader">Meaning</div>
        </div>
        <div className="terms-def-body" role="rowgroup">
          {DEFINITIONS.map((def, idx) => {
            const rowId = def.anchor ? def.anchor.replace(/^#/, '') : `def-${idx}`;
            return (
              <div
                key={`def-${def.term}-${idx}`}
                id={rowId}
                className="terms-def-row"
                role="row"
              >
                <div className="terms-def-col-term" role="cell">
                  <span className="terms-def-term-text">{def.term}</span>
                </div>
                <div className="terms-def-col-meaning" role="cell">
                  <span className="terms-def-meaning-text">
                    {formatTermsText(def.meaning)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default React.memo(DefinitionsTable);
