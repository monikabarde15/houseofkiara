/**
 * House of Kaira - Privacy Policy Register Row Component (Clauses 7 & 8)
 * Section 5.11 of Build Specification v2.0
 */

import React from 'react';
import { copyClauseLink, renderRichText } from '../../utils/privacy/privacyFormatter.jsx';

const PrivacyRegisterRow = ({ row, onShowToast, onJumpClause }) => {
  const cleanAnchor = row.anchor.replace(/^#/, '');

  const handleCopy = (e) => {
    e.preventDefault();
    copyClauseLink(row.anchor, row.subclauseNumber, onShowToast);
  };

  return (
    <article className="privacy-register-row-container" id={cleanAnchor}>
      <div className="privacy-register-num-col">
        <button
          type="button"
          className="privacy-subclause-num-btn privacy-tabular-num"
          title={`Copy a link to clause ${row.subclauseNumber}`}
          aria-label={`Clause ${row.subclauseNumber}, copy a link to it`}
          onClick={handleCopy}
        >
          {row.subclauseNumber}
        </button>
      </div>

      <div className="privacy-register-body-col">
        <h4 className="privacy-register-title">{row.title}</h4>

        <div className="privacy-register-table">
          {row.rows.map((r, idx) => {
            const isNever = r.isNever || r.label.toLowerCase() === 'never';
            return (
              <div
                key={`reg-item-${idx}`}
                className={`privacy-register-item ${isNever ? 'privacy-register-item-never' : ''}`}
              >
                <div className={`privacy-register-label ${isNever ? 'privacy-register-label-never' : ''}`}>
                  {r.label}
                </div>
                <div className={`privacy-register-text ${isNever ? 'privacy-register-text-never' : ''}`}>
                  {renderRichText(r.text, onJumpClause)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </article>
  );
};

export default React.memo(PrivacyRegisterRow);
