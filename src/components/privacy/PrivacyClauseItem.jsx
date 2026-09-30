/**
 * House of Kaira - Privacy Policy Clause Item Component
 * Section 5.10 & 5.11 of Build Specification v2.0
 */

import React from 'react';
import { CopyLinkIcon } from './PrivacyIcons.jsx';
import PrivacyDefinitionsList from './PrivacyDefinitionsList.jsx';
import PrivacyRegisterRow from './PrivacyRegisterRow.jsx';
import { copyClauseLink, renderRichText } from '../../utils/privacy/privacyFormatter.jsx';

const PrivacyClauseItem = ({ clause, onShowToast, onJumpClause }) => {
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
    <article className="privacy-clause-container" id={cleanAnchor}>
      {/* 1. Clause Header Row */}
      <div className="privacy-clause-header-row">
        <div className="privacy-clause-num-col" aria-hidden="true">
          <span className="privacy-clause-number">{clause.number}</span>
        </div>

        <div className="privacy-clause-title-col">
          <h3 className="privacy-clause-title">
            <span className="sr-only">Clause {clause.number}: </span>
            {clause.title}
          </h3>

          <button
            type="button"
            className="privacy-clause-copy-btn privacy-clause-copy-btn-mobile"
            onClick={handleCopyClause}
          >
            <CopyLinkIcon size={13} color="currentColor" />
            <span>Copy link</span>
          </button>
        </div>

        <div className="privacy-clause-actions-col privacy-clause-copy-btn-desktop">
          <button
            type="button"
            className="privacy-clause-copy-btn"
            onClick={handleCopyClause}
          >
            <CopyLinkIcon size={13} color="currentColor" />
            <span>Copy link</span>
          </button>
        </div>
      </div>

      {/* 2. Clause Body & Sub-clauses */}
      <div className="privacy-clause-body">
        {/* Special Case A: Clause 4 with Definitions list */}
        {clause.hasDefinitions ? (
          <div className="privacy-clause-definitions-wrapper">
            {clause.subclauses && clause.subclauses[0] && (
              <div
                className="privacy-subclause-row"
                id={clause.subclauses[0].anchor.replace(/^#/, '')}
              >
                <div className="privacy-subclause-num-col">
                  <button
                    type="button"
                    className="privacy-subclause-num-btn privacy-tabular-num"
                    title={`Copy a link to clause ${clause.subclauses[0].number}`}
                    aria-label={`Clause ${clause.subclauses[0].number}, copy a link to it`}
                    onClick={(e) => handleCopySubclause(clause.subclauses[0], e)}
                  >
                    {clause.subclauses[0].number}
                  </button>
                </div>
                <div className="privacy-subclause-text-col">
                  <p className="privacy-subclause-paragraph">
                    {renderRichText(clause.subclauses[0].text, onJumpClause)}
                  </p>
                </div>
              </div>
            )}

            {/* Definitions Table Component */}
            <PrivacyDefinitionsList />

            {clause.subclauses && clause.subclauses[1] && (
              <div
                className="privacy-subclause-row"
                id={clause.subclauses[1].anchor.replace(/^#/, '')}
              >
                <div className="privacy-subclause-num-col">
                  <button
                    type="button"
                    className="privacy-subclause-num-btn privacy-tabular-num"
                    title={`Copy a link to clause ${clause.subclauses[1].number}`}
                    aria-label={`Clause ${clause.subclauses[1].number}, copy a link to it`}
                    onClick={(e) => handleCopySubclause(clause.subclauses[1], e)}
                  >
                    {clause.subclauses[1].number}
                  </button>
                </div>
                <div className="privacy-subclause-text-col">
                  <p className="privacy-subclause-paragraph">
                    {renderRichText(clause.subclauses[1].text, onJumpClause)}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : clause.isRegisterClause ? (
          /* Special Case B: Clauses 7 & 8 with Register Rows */
          <div className="privacy-clause-registers-wrapper">
            {clause.registerRows && clause.registerRows.map((row, idx) => (
              <PrivacyRegisterRow
                key={`reg-row-${row.subclauseNumber}-${idx}`}
                row={row}
                onShowToast={onShowToast}
                onJumpClause={onJumpClause}
              />
            ))}
          </div>
        ) : (
          /* Standard Case C: Regular Sub-clauses */
          <div className="privacy-clause-subclauses-wrapper">
            {clause.subclauses && clause.subclauses.map((sub, idx) => {
              const cleanSubAnchor = sub.anchor.replace(/^#/, '');
              return (
                <div
                  key={`sub-${sub.number}-${idx}`}
                  className="privacy-subclause-row"
                  id={cleanSubAnchor}
                >
                  <div className="privacy-subclause-num-col">
                    <button
                      type="button"
                      className="privacy-subclause-num-btn privacy-tabular-num"
                      title={`Copy a link to clause ${sub.number}`}
                      aria-label={`Clause ${sub.number}, copy a link to it`}
                      onClick={(e) => handleCopySubclause(sub, e)}
                    >
                      {sub.number}
                    </button>
                  </div>

                  <div className="privacy-subclause-text-col">
                    <p className="privacy-subclause-paragraph">
                      {renderRichText(sub.text, onJumpClause)}
                    </p>

                    {/* Lettered list if present (e.g. clause 5.1, 9.1, 11.1, etc.) */}
                    {sub.list && (
                      <ol className="privacy-lettered-list">
                        {sub.list.map((item, lIdx) => (
                          <li key={`list-${sub.number}-${lIdx}`} className="privacy-lettered-item">
                            <span className="privacy-list-letter">{item.letter}</span>
                            <span className="privacy-list-text">
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

export default React.memo(PrivacyClauseItem);
