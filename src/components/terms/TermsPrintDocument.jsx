import React from 'react';
import { TERMS_SETTINGS } from '../../data/terms/termsSettings.js';
import { TERMS_PARTS, OPENING_PARAGRAPH } from '../../data/terms/termsRegistry.js';
import { formatTermsText } from '../../utils/terms/termsFormatter.jsx';

/**
 * Terms & Conditions Print-Only Document
 * Section 5.13 of Build Specification v3.0
 */
const TermsPrintDocument = () => {
  return (
    <div id="termsPrintDoc" className="terms-print-only">
      {/* 1. Print Title */}
      <h1 className="terms-print-title">Terms &amp; Conditions</h1>

      {/* 2. Print Metadata Line */}
      <div className="terms-print-meta-line">
        House of Kaira · {TERMS_SETTINGS.terms_version} · In force from {TERMS_SETTINGS.terms_effective} · Last updated {TERMS_SETTINGS.terms_updated} · {TERMS_SETTINGS.site_url}
      </div>

      {/* 3. Opening Paragraph */}
      <p className="terms-print-opening">
        {OPENING_PARAGRAPH}
      </p>

      {/* 4. Complete 12 Parts & 59 Clauses */}
      <div className="terms-print-parts">
        {TERMS_PARTS.map((part) => {
          const rangeLabel = part.startClause === part.endClause
            ? `CLAUSE ${part.startClause}`
            : `CLAUSES ${part.startClause} TO ${part.endClause}`;

          return (
            <div key={`print-part-${part.partNumber}`} className="terms-print-part">
              <h2 className="terms-print-part-title">{part.title}</h2>
              <div className="terms-print-part-range">{rangeLabel}</div>
              <div className="terms-print-part-divider" />

              <div className="terms-print-clauses">
                {part.clauses.map((clause) => {
                  return (
                    <div key={`print-c-${clause.number}`} className="terms-print-clause">
                      <h3 className="terms-print-clause-title">
                        {clause.number}. {clause.title}
                      </h3>

                      <div className="terms-print-subclauses">
                        {clause.subclauses.map((sub) => {
                          return (
                            <div key={`print-sub-${sub.number}`} className="terms-print-subclause-row">
                              <span className="terms-print-sub-num">{sub.number}</span>
                              <div className="terms-print-sub-text">
                                {formatTermsText(sub.text)}
                              </div>
                            </div>
                          );
                        })}

                        {/* Special definitions table in print for Clause 4 */}
                        {clause.number === 4 && clause.definitions && (
                          <div className="terms-print-definitions">
                            <div className="terms-print-def-head">
                              <span className="terms-print-def-th">Term</span>
                              <span className="terms-print-def-th">Meaning</span>
                            </div>
                            {clause.definitions.map((def, dIdx) => (
                              <div key={`print-def-${dIdx}`} className="terms-print-def-row">
                                <span className="terms-print-def-term">{def.term}</span>
                                <span className="terms-print-def-meaning">{def.meaning}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(TermsPrintDocument);
