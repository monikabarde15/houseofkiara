import React from 'react';
import { TERMS_SETTINGS } from '../../data/terms/termsSettings.js';
import { highlightMatches } from '../../utils/terms/termsSearch.js';
import { WhatsAppIcon, ChevronRightIcon } from './TermsIcons.jsx';

/**
 * Terms & Conditions Search Results Dropdown
 * Section 5.3 of Build Specification v3.0
 */
const TermsSearchResultsDropdown = ({
  results,
  query,
  isOpen,
  onSelectResult,
  onClose,
  selectedIndex
}) => {
  if (!isOpen || !query.trim()) return null;

  const handleWhatsAppHelp = (e) => {
    e.preventDefault();
    const encoded = encodeURIComponent(`Hi House of Kaira, I had a question about: "${query}" in your Terms & Conditions.`);
    window.open(`https://wa.me/${TERMS_SETTINGS.support_whatsapp_raw}?text=${encoded}`, '_blank');
  };

  const countText = results.length === 1 ? '1 CLAUSE' : `${results.length} CLAUSES`;

  return (
    <div className="terms-search-dropdown" role="listbox" id="terms-search-results">
      {results.length > 0 ? (
        <>
          <div className="terms-search-dropdown-header">
            <span className="terms-search-count">{countText}</span>
          </div>
          <ul className="terms-search-results-list">
            {results.map((item, idx) => {
              const isSelected = selectedIndex === idx;
              return (
                <li
                  key={`res-${item.clauseNumber}-${idx}`}
                  role="option"
                  aria-selected={isSelected}
                  className={`terms-search-result-item ${isSelected ? 'terms-search-item-active' : ''}`}
                  onClick={() => onSelectResult(item)}
                >
                  <div className="terms-search-item-left">
                    <span className="terms-search-item-num">{item.clauseNumber}</span>
                  </div>
                  <div className="terms-search-item-body">
                    <div className="terms-search-item-title-row">
                      <span className="terms-search-item-title">{item.title}</span>
                      {item.subclauseNumber && (
                        <span className="terms-search-item-subtag">Clause {item.subclauseNumber}</span>
                      )}
                    </div>
                    <p
                      className="terms-search-item-snippet"
                      dangerouslySetInnerHTML={{
                        __html: highlightMatches(
                          item.snippet.length > 120 ? item.snippet.substring(0, 120) + '…' : item.snippet,
                          item.matchedWords
                        )
                      }}
                    />
                  </div>
                  <ChevronRightIcon size={12} className="terms-search-item-chevron" color="var(--hok-gold)" />
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <div className="terms-search-no-results">
          <h4 className="terms-no-res-title">No clause matches that yet</h4>
          <p className="terms-no-res-desc">
            Ask us and we will point you to the part of our terms you need, or explain it in plain words.
          </p>
          <button
            type="button"
            className="terms-no-res-btn"
            onClick={handleWhatsAppHelp}
          >
            <WhatsAppIcon size={15} color="#FFFFFF" />
            <span>ASK ON WHATSAPP</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default React.memo(TermsSearchResultsDropdown);
