/**
 * House of Kaira - Cookie Policy Dedicated A4 Print Document
 * Section 9 of Build Specification v1.0 (hok_cookie_v4)
 */

import React from 'react';
import { COOKIE_SETTINGS } from '../../data/cookies/cookieSettings.js';
import { COOKIE_PARTS, DEFINITIONS } from '../../data/cookies/cookieRegistry.js';

const CookiePrintDocument = () => {
  return (
    <div id="cookiePrintDoc" className="cookie-print-document" aria-hidden="true">
      {/* 1. Document Title & Metadata Header */}
      <div className="cookie-print-header">
        <h1 className="cookie-print-title">Cookie Policy</h1>
        <p className="cookie-print-meta">
          House of Kaira · Version {COOKIE_SETTINGS.cookie_version} · In force from {COOKIE_SETTINGS.cookie_effective} · Last updated {COOKIE_SETTINGS.cookie_updated} · {COOKIE_SETTINGS.site_url}
        </p>
        <p className="cookie-print-intro">
          Every piece on House of Kaira comes with an honest disclosure, and so does our website. This policy lists every cookie and similar technology we use, who sets it, what it does and how long it lasts, and it explains how to allow, refuse or change your mind at any time. Nothing beyond what the website needs to work runs until you choose.
        </p>
      </div>

      {/* 2. All 6 Parts with 30 Clauses, Definitions & Cookie Rows */}
      <div className="cookie-print-parts-list">
        {COOKIE_PARTS.map((part) => (
          <div key={`print-part-${part.number}`} className="cookie-print-part-block">
            <div className="cookie-print-part-header">
              <span className="cookie-print-part-range">{part.range}</span>
              <h2 className="cookie-print-part-title">
                Part {part.number}. {part.title}
              </h2>
              <div className="cookie-print-part-line" />
            </div>

            <div className="cookie-print-clauses-list">
              {part.clauses.map((clause) => (
                <div key={`print-clause-${clause.number}`} className="cookie-print-clause-item">
                  <h3 className="cookie-print-clause-title">
                    {clause.number}. {clause.title}
                  </h3>

                  {/* Special Case A: Clause 4 with Definitions */}
                  {clause.hasDefinitions ? (
                    <div className="cookie-print-definitions-wrapper">
                      {clause.subclauses && clause.subclauses[0] && (
                        <div className="cookie-print-subclause-row">
                          <span className="cookie-print-sub-num">{clause.subclauses[0].number}</span>
                          <span className="cookie-print-sub-text">{clause.subclauses[0].text}</span>
                        </div>
                      )}

                      <div className="cookie-print-def-table">
                        {DEFINITIONS.map((def, dIdx) => (
                          <div key={`print-def-${dIdx}`} className="cookie-print-def-row">
                            <span className="cookie-print-def-term">{def.term}</span>
                            <span className="cookie-print-def-meaning">{def.meaning}</span>
                          </div>
                        ))}
                      </div>

                      {clause.subclauses && clause.subclauses[1] && (
                        <div className="cookie-print-subclause-row">
                          <span className="cookie-print-sub-num">{clause.subclauses[1].number}</span>
                          <span className="cookie-print-sub-text">{clause.subclauses[1].text}</span>
                        </div>
                      )}
                    </div>
                  ) : clause.hasCookieRows ? (
                    /* Special Case B: Clauses 11, 12, 13, 15 with Cookie Rows */
                    <div className="cookie-print-rows-wrapper">
                      {clause.subclauses && clause.subclauses.map((sub, sIdx) => (
                        <div key={`print-sub-${sub.number}-${sIdx}`} className="cookie-print-subclause-row">
                          <span className="cookie-print-sub-num">{sub.number}</span>
                          <div className="cookie-print-sub-content">
                            <p className="cookie-print-sub-paragraph">{sub.text}</p>
                          </div>
                        </div>
                      ))}

                      {clause.cookieRows && clause.cookieRows.map((row, rIdx) => (
                        <div key={`print-cookie-${row.subclauseNumber}-${rIdx}`} className="cookie-print-row-block">
                          <div className="cookie-print-row-head">
                            <span className="cookie-print-row-num">{row.subclauseNumber}</span>
                            <h4 className="cookie-print-row-title">{row.title}</h4>
                          </div>

                          <div className="cookie-print-row-table">
                            {row.items.map((item, itemIdx) => (
                              <div key={`print-cookie-item-${itemIdx}`} className="cookie-print-row-item">
                                <span className="cookie-print-row-label">{item.label}</span>
                                <span className="cookie-print-row-text">{item.text}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}

                      {clause.extraSubclauses && clause.extraSubclauses.map((sub, eIdx) => (
                        <div key={`print-extra-sub-${sub.number}-${eIdx}`} className="cookie-print-subclause-row">
                          <span className="cookie-print-sub-num">{sub.number}</span>
                          <div className="cookie-print-sub-content">
                            <p className="cookie-print-sub-paragraph">{sub.text}</p>
                            {sub.list && (
                              <div className="cookie-print-lettered-list">
                                {sub.list.map((item, lIdx) => (
                                  <div key={`print-extra-list-${lIdx}`} className="cookie-print-lettered-item">
                                    <span className="cookie-print-letter">{item.letter}</span>
                                    <span className="cookie-print-letter-text">{item.text}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Standard Sub-clauses */
                    <div className="cookie-print-subclauses-wrapper">
                      {clause.subclauses && clause.subclauses.map((sub, sIdx) => (
                        <div key={`print-sub-${sub.number}-${sIdx}`} className="cookie-print-subclause-row">
                          <span className="cookie-print-sub-num">{sub.number}</span>
                          <div className="cookie-print-sub-content">
                            <p className="cookie-print-sub-paragraph">{sub.text}</p>
                            {sub.list && (
                              <div className="cookie-print-lettered-list">
                                {sub.list.map((item, lIdx) => (
                                  <div key={`print-list-${lIdx}`} className="cookie-print-lettered-item">
                                    <span className="cookie-print-letter">{item.letter}</span>
                                    <span className="cookie-print-letter-text">{item.text}</span>
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

export default React.memo(CookiePrintDocument);
