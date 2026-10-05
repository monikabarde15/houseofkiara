/**
 * House of Kaira - Cookie Policy Clause Item Component
 * Sections 5.8 to 5.10 of Build Specification v1.0 (hok_cookie_v4)
 */

import React from 'react';
import { CopyLinkIcon } from './CookieIcons.jsx';
import CookieDefinitionsList from './CookieDefinitionsList.jsx';
import CookieRowBlock from './CookieRowBlock.jsx';
import { copyClauseLink, renderRichText } from '../../utils/cookies/cookieFormatter.jsx';

const CookieClauseItem = ({ clause, onShowToast, onJumpClause }) => {
  const cleanAnchor = clause.anchor.replace(/^#/, '');

  const handleCopyClause = (e) => {
    e.preventDefault();
    copyClauseLink(clause.anchor, clause.number, onShowToast);
  };

  const handleCopySubclause = (sub, e) => {
    e.preventDefault();
    copyClauseLink(sub.anchor, sub.number, onShowToast);
  };

  return (
    <article className="cookie-clause-container" id={cleanAnchor}>
      {/* 1. Clause Header Row */}
      <div className="cookie-clause-header-row">
        <div className="cookie-clause-num-col" aria-hidden="true">
          <span className="cookie-clause-number">{clause.number}</span>
        </div>

        <div className="cookie-clause-title-col">
          <h3 className="cookie-clause-title">
            <span className="sr-only">Clause {clause.number}: </span>
            {clause.title}
          </h3>

          <button
            type="button"
            className="cookie-clause-copy-btn cookie-clause-copy-btn-mobile"
            onClick={handleCopyClause}
          >
            <CopyLinkIcon size={13} color="currentColor" />
            <span>Copy link</span>
          </button>
        </div>

        <div className="cookie-clause-actions-col cookie-clause-copy-btn-desktop">
          <button
            type="button"
            className="cookie-clause-copy-btn"
            onClick={handleCopyClause}
          >
            <CopyLinkIcon size={13} color="currentColor" />
            <span>Copy link</span>
          </button>
        </div>
      </div>

      {/* 2. Clause Body & Sub-clauses */}
      <div className="cookie-clause-body">
        {/* Special Case A: Clause 4 with Definitions list */}
        {clause.hasDefinitions ? (
          <div className="cookie-clause-definitions-wrapper">
            {clause.subclauses && clause.subclauses[0] && (
              <div
                className="cookie-subclause-row"
                id={clause.subclauses[0].anchor.replace(/^#/, '')}
              >
                <div className="cookie-subclause-num-col">
                  <button
                    type="button"
                    className="cookie-subclause-num-btn cookie-tabular-num"
                    title={`Copy a link to clause ${clause.subclauses[0].number}`}
                    aria-label={`Clause ${clause.subclauses[0].number}, copy a link to it`}
                    onClick={(e) => handleCopySubclause(clause.subclauses[0], e)}
                  >
                    {clause.subclauses[0].number}
                  </button>
                </div>
                <div className="cookie-subclause-text-col">
                  <p className="cookie-subclause-paragraph">
                    {renderRichText(clause.subclauses[0].text, onJumpClause)}
                  </p>
                </div>
              </div>
            )}

            {/* Definitions Table Component */}
            <CookieDefinitionsList />

            {clause.subclauses && clause.subclauses[1] && (
              <div
                className="cookie-subclause-row"
                id={clause.subclauses[1].anchor.replace(/^#/, '')}
              >
                <div className="cookie-subclause-num-col">
                  <button
                    type="button"
                    className="cookie-subclause-num-btn cookie-tabular-num"
                    title={`Copy a link to clause ${clause.subclauses[1].number}`}
                    aria-label={`Clause ${clause.subclauses[1].number}, copy a link to it`}
                    onClick={(e) => handleCopySubclause(clause.subclauses[1], e)}
                  >
                    {clause.subclauses[1].number}
                  </button>
                </div>
                <div className="cookie-subclause-text-col">
                  <p className="cookie-subclause-paragraph">
                    {renderRichText(clause.subclauses[1].text, onJumpClause)}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : clause.hasCookieRows ? (
          /* Special Case B: Clauses 11, 12, 13, 15 with Cookie Rows */
          <div className="cookie-clause-rows-wrapper">
            {clause.subclauses && clause.subclauses.map((sub, idx) => (
              <div
                key={`sub-intro-${sub.number}-${idx}`}
                className="cookie-subclause-row"
                id={sub.anchor.replace(/^#/, '')}
              >
                <div className="cookie-subclause-num-col">
                  <button
                    type="button"
                    className="cookie-subclause-num-btn cookie-tabular-num"
                    title={`Copy a link to clause ${sub.number}`}
                    aria-label={`Clause ${sub.number}, copy a link to it`}
                    onClick={(e) => handleCopySubclause(sub, e)}
                  >
                    {sub.number}
                  </button>
                </div>
                <div className="cookie-subclause-text-col">
                  <p className="cookie-subclause-paragraph">
                    {renderRichText(sub.text, onJumpClause)}
                  </p>
                </div>
              </div>
            ))}

            {/* Render Cookie Rows */}
            {clause.cookieRows && clause.cookieRows.map((row, idx) => (
              <CookieRowBlock
                key={`cookie-row-${row.subclauseNumber}-${idx}`}
                row={row}
                onShowToast={onShowToast}
                onJumpClause={onJumpClause}
              />
            ))}

            {/* Extra Subclauses after rows (e.g. 13.4, 13.5, 15.4) */}
            {clause.extraSubclauses && clause.extraSubclauses.map((sub, idx) => (
              <div
                key={`extra-sub-${sub.number}-${idx}`}
                className="cookie-subclause-row"
                id={sub.anchor.replace(/^#/, '')}
              >
                <div className="cookie-subclause-num-col">
                  <button
                    type="button"
                    className="cookie-subclause-num-btn cookie-tabular-num"
                    title={`Copy a link to clause ${sub.number}`}
                    aria-label={`Clause ${sub.number}, copy a link to it`}
                    onClick={(e) => handleCopySubclause(sub, e)}
                  >
                    {sub.number}
                  </button>
                </div>
                <div className="cookie-subclause-text-col">
                  <p className="cookie-subclause-paragraph">
                    {renderRichText(sub.text, onJumpClause)}
                  </p>
                  {sub.list && (
                    <ol className="cookie-lettered-list">
                      {sub.list.map((item, lIdx) => (
                        <li key={`extra-list-${sub.number}-${lIdx}`} className="cookie-lettered-item">
                          <span className="cookie-list-letter">{item.letter}</span>
                          <span className="cookie-list-text">
                            {renderRichText(item.text, onJumpClause)}
                          </span>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Standard Case C: Regular Sub-clauses */
          <div className="cookie-clause-subclauses-wrapper">
            {clause.subclauses && clause.subclauses.map((sub, idx) => {
              const cleanSubAnchor = sub.anchor.replace(/^#/, '');
              return (
                <div
                  key={`sub-${sub.number}-${idx}`}
                  className="cookie-subclause-row"
                  id={cleanSubAnchor}
                >
                  <div className="cookie-subclause-num-col">
                    <button
                      type="button"
                      className="cookie-subclause-num-btn cookie-tabular-num"
                      title={`Copy a link to clause ${sub.number}`}
                      aria-label={`Clause ${sub.number}, copy a link to it`}
                      onClick={(e) => handleCopySubclause(sub, e)}
                    >
                      {sub.number}
                    </button>
                  </div>

                  <div className="cookie-subclause-text-col">
                    <p className="cookie-subclause-paragraph">
                      {renderRichText(sub.text, onJumpClause)}
                    </p>

                    {/* Lettered list if present */}
                    {sub.list && (
                      <ol className="cookie-lettered-list">
                        {sub.list.map((item, lIdx) => (
                          <li key={`list-${sub.number}-${lIdx}`} className="cookie-lettered-item">
                            <span className="cookie-list-letter">{item.letter}</span>
                            <span className="cookie-list-text">
                              {renderRichText(item.text, onJumpClause)}
                            </span>
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </article>
  );
};

export default React.memo(CookieClauseItem);
