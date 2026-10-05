/**
 * House of Kaira - Cookie Policy Cookie Row Block Component
 * Clauses 11, 12, 13, 15
 * Section 5.9 of Build Specification v1.0 (hok_cookie_v4)
 */

import React from 'react';
import { copyClauseLink, renderRichText } from '../../utils/cookies/cookieFormatter.jsx';

const CookieRowBlock = ({ row, onShowToast, onJumpClause }) => {
  const cleanAnchor = row.anchor.replace(/^#/, '');

  const handleCopy = (e) => {
    e.preventDefault();
    copyClauseLink(row.anchor, row.subclauseNumber, onShowToast);
  };

  return (
    <article className="cookie-row-block-container" id={cleanAnchor}>
      <div className="cookie-row-num-col">
        <button
          type="button"
          className="cookie-subclause-num-btn cookie-tabular-num"
          title={`Copy a link to clause ${row.subclauseNumber}`}
          aria-label={`Clause ${row.subclauseNumber}, copy a link to it`}
          onClick={handleCopy}
        >
          {row.subclauseNumber}
        </button>
      </div>

      <div className="cookie-row-body-col">
        <h4 className="cookie-row-title">{row.title}</h4>

        <dl className="cookie-row-table">
          {row.items.map((item, idx) => {
            const isConsentNeeded =
              item.label.toLowerCase() === 'consent' &&
              item.text.trim().toLowerCase().startsWith('needed');

            return (
              <div key={`cookie-item-${idx}`} className="cookie-row-item">
                <dt className="cookie-row-label">{item.label}</dt>
                <dd
                  className={`cookie-row-text ${
                    isConsentNeeded ? 'cookie-row-consent-needed' : ''
                  }`}
                >
                  {renderRichText(item.text, onJumpClause)}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </article>
  );
};

export default React.memo(CookieRowBlock);
