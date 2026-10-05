import React, { useState } from 'react';
import { LinkIcon, CheckIcon } from './TermsIcons.jsx';
import DefinitionsTable from './DefinitionsTable.jsx';
import { formatTermsText } from '../../utils/terms/termsFormatter.jsx';

/**
 * Terms & Conditions Individual Clause Item
 * Section 5.9 of Build Specification v3.0
 */
const ClauseItem = ({ clause, onShowToast }) => {
  const [copiedHeader, setCopiedHeader] = useState(false);
  const [copiedSub, setCopiedSub] = useState(null);

  const cleanAnchor = clause.anchor ? clause.anchor.replace(/^#/, '') : `c-${clause.number}`;

  const copyToClipboard = async (anchorTarget, toastMsg) => {
    const url = `${window.location.origin}${window.location.pathname}#${anchorTarget}`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback for older browsers
        const tempInput = document.createElement('input');
        tempInput.value = url;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }
      window.history.pushState(null, '', `#${anchorTarget}`);
      if (onShowToast) onShowToast(toastMsg);
    } catch (err) {
      if (onShowToast) onShowToast(url);
    }
  };

  const handleCopyClause = () => {
    setCopiedHeader(true);
    copyToClipboard(
      cleanAnchor,
      `Link to clause ${clause.number} copied. Paste it anywhere to share it.`
    );
    setTimeout(() => setCopiedHeader(false), 2000);
  };

  const handleCopySubclause = (subNumber) => {
    const subAnchor = `${cleanAnchor}-${subNumber.replace('.', '-')}`;
    setCopiedSub(subNumber);
    copyToClipboard(
      subAnchor,
      `Link to clause ${subNumber} copied. Paste it anywhere to share it.`
    );
    setTimeout(() => setCopiedSub(null), 2000);
  };

  // Helper to render lettered lists like (a), (b), (c)
  const renderSubclauseContent = (sub) => {
    const text = sub.text;

    // Check if contains (a), (b), (c)...
    if (sub.hasList && /\([a-z]\)/.test(text)) {
      // Split text into lead and list items
      const parts = text.split(/(\([a-z]\)[^(\()]*)/g).filter(Boolean);
      const leadText = !parts[0].startsWith('(') ? parts[0] : '';
      const listItems = parts.filter(p => /^\([a-z]\)/.test(p.trim()));

      return (
        <div className="terms-subclause-body">
          {leadText && (
            <p className="terms-subclause-lead">{formatTermsText(leadText.trim())}</p>
          )}
          <ul className="terms-lettered-list">
            {listItems.map((item, idx) => {
              const markerMatch = item.match(/^\(([a-z])\)\s*/);
              const marker = markerMatch ? `(${markerMatch[1]})` : '';
              const itemContent = item.replace(/^\([a-z]\)\s*/, '');

              return (
                <li key={`list-${sub.number}-${idx}`} className="terms-lettered-item">
                  <span className="terms-list-marker">{marker}</span>
                  <span className="terms-list-text">{formatTermsText(itemContent.trim())}</span>
                </li>
              );
            })}
          </ul>
        </div>
      );
    }

    return (
      <div className="terms-subclause-body">
        <p className="terms-subclause-text">{formatTermsText(text)}</p>
      </div>
    );
  };

  return (
    <article className="terms-clause-item" id={cleanAnchor}>
      {/* Clause Header */}
      <div className="terms-clause-header">
        <div className="terms-clause-header-left">
          <span className="terms-clause-number" aria-hidden="true">{clause.number}</span>
          <h3 className="terms-clause-title">
            <span className="terms-sr-only">Clause {clause.number}: </span>
            {clause.title}
          </h3>
        </div>
        <button
          type="button"
          className="terms-copy-btn"
          onClick={handleCopyClause}
          aria-label={`Copy link to clause ${clause.number}`}
          title="Copy link to this clause"
        >
          {copiedHeader ? (
            <CheckIcon size={12} color="var(--hok-gold-deep)" />
          ) : (
            <LinkIcon size={12} color="var(--hok-muted)" />
          )}
          <span className="terms-copy-btn-text">
            {copiedHeader ? 'COPIED' : 'COPY LINK'}
          </span>
        </button>
      </div>

      {/* Sub-clauses Container */}
      <div className="terms-subclauses-list">
        {clause.subclauses.map((sub) => {
          const subId = `${cleanAnchor}-${sub.number.replace('.', '-')}`;
          const isCopied = copiedSub === sub.number;

          return (
            <div
              key={`sub-${sub.number}`}
              id={subId}
              className="terms-subclause-row"
            >
              <button
                type="button"
                className="terms-subclause-num-btn"
                onClick={() => handleCopySubclause(sub.number)}
                title={`Copy a link to clause ${sub.number}`}
                aria-label={`Clause ${sub.number}, copy a link to it`}
              >
                <span className="terms-subclause-num-text">{sub.number}</span>
              </button>

              {renderSubclauseContent(sub)}
            </div>
          );
        })}

        {/* Render special definitions table if this is Clause 4 */}
        {clause.number === 4 && <DefinitionsTable />}
      </div>
    </article>
  );
};

export default React.memo(ClauseItem);
