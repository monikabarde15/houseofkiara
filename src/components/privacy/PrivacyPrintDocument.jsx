/**
 * House of Kaira - Privacy Policy Dedicated A4 Print Document
 * Section 10 of Build Specification v2.0
 */

import React from 'react';
import { PRIVACY_SETTINGS } from '../../data/privacy/privacySettings.js';
import { PRIVACY_PARTS, DEFINITIONS } from '../../data/privacy/privacyRegistry.js';

const PrivacyPrintDocument = () => {
  return (
    <div id="privacyPrintDoc" className="privacy-print-document" aria-hidden="true">
      {/* 1. Document Title & Metadata Header */}
      <div className="privacy-print-header">
        <h1 className="privacy-print-title">Privacy Policy</h1>
        <p className="privacy-print-meta">
          House of Kaira · {PRIVACY_SETTINGS.privacy_version} · In force from {PRIVACY_SETTINGS.privacy_effective} · Last updated {PRIVACY_SETTINGS.privacy_updated} · {PRIVACY_SETTINGS.site_url}
        </p>
        <p className="privacy-print-intro">
          Every piece on House of Kaira comes with an honest disclosure: what it is, where it has been, and anything you should know before it becomes part of your story. This policy gives your information the same care. It tells you, in plain words, what we collect, why we need it, who sees it, how long we keep it and how you stay in control, with every clause numbered so it is easy to find and share.
        </p>
      </div>

      {/* 2. All 10 Parts with 47 Clauses, Definitions & Register Rows */}
      <div className="privacy-print-parts-list">
        {PRIVACY_PARTS.map((part) => (
          <div key={`print-part-${part.number}`} className="privacy-print-part-block">
            <div className="privacy-print-part-header">
              <span className="privacy-print-part-range">{part.range}</span>
              <h2 className="privacy-print-part-title">
                Part {part.number}. {part.title}
              </h2>
              <div className="privacy-print-part-line" />
            </div>

            <div className="privacy-print-clauses-list">
              {part.clauses.map((clause) => (
                <div key={`print-clause-${clause.number}`} className="privacy-print-clause-item">
                  <h3 className="privacy-print-clause-title">
                    {clause.number}. {clause.title}
                  </h3>

                  {/* Special Case: Clause 4 with Definitions */}
                  {clause.hasDefinitions ? (
                    <div className="privacy-print-definitions-wrapper">
                      {clause.subclauses && clause.subclauses[0] && (
                        <div className="privacy-print-subclause-row">
                          <span className="privacy-print-sub-num">{clause.subclauses[0].number}</span>
                          <span className="privacy-print-sub-text">{clause.subclauses[0].text}</span>
                        </div>
                      )}

                      <div className="privacy-print-def-table">
                        {DEFINITIONS.map((def, dIdx) => (
                          <div key={`print-def-${dIdx}`} className="privacy-print-def-row">
                            <span className="privacy-print-def-term">{def.term}</span>
                            <span className="privacy-print-def-meaning">{def.meaning}</span>
                          </div>
                        ))}
                      </div>

                      {clause.subclauses && clause.subclauses[1] && (
                        <div className="privacy-print-subclause-row">
                          <span className="privacy-print-sub-num">{clause.subclauses[1].number}</span>
                          <span className="privacy-print-sub-text">{clause.subclauses[1].text}</span>
                        </div>
                      )}
                    </div>
                  ) : clause.isRegisterClause ? (
                    /* Special Case: Clauses 7 & 8 with Register Rows */
                    <div className="privacy-print-registers-wrapper">
                      {clause.registerRows && clause.registerRows.map((reg, rIdx) => (
                        <div key={`print-reg-${reg.subclauseNumber}-${rIdx}`} className="privacy-print-register-block">
                          <div className="privacy-print-reg-head">
                            <span className="privacy-print-reg-num">{reg.subclauseNumber}</span>
                            <h4 className="privacy-print-reg-title">{reg.title}</h4>
                          </div>

                          <div className="privacy-print-reg-table">
                            {reg.rows.map((r, itemIdx) => {
                              const isNever = r.isNever || r.label.toLowerCase() === 'never';
                              return (
                                <div
                                  key={`print-reg-item-${itemIdx}`}
                                  className={`privacy-print-reg-row ${isNever ? 'privacy-print-reg-never' : ''}`}
                                >
                                  <span className="privacy-print-reg-label">{r.label}</span>
                                  <span className="privacy-print-reg-text">{r.text}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Standard Sub-clauses */
                    <div className="privacy-print-subclauses-wrapper">
                      {clause.subclauses && clause.subclauses.map((sub, sIdx) => (
                        <div key={`print-sub-${sub.number}-${sIdx}`} className="privacy-print-subclause-row">
                          <span className="privacy-print-sub-num">{sub.number}</span>
                          <div className="privacy-print-sub-content">
                            <p className="privacy-print-sub-paragraph">{sub.text}</p>
                            {sub.list && (
                              <div className="privacy-print-lettered-list">
                                {sub.list.map((item, lIdx) => (
                                  <div key={`print-list-${lIdx}`} className="privacy-print-lettered-item">
                                    <span className="privacy-print-letter">{item.letter}</span>
                                    <span className="privacy-print-letter-text">{item.text}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(PrivacyPrintDocument);
