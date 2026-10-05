/**
 * House of Kaira - Privacy Policy Search Results Dropdown
 * Section 5.3 of Build Specification v2.0
 */

import React, { useEffect, useRef } from 'react';
import { PRIVACY_SETTINGS } from '../../data/privacy/privacySettings.js';
import { highlightTitleMatches } from '../../utils/privacy/privacySearch.js';
import { WhatsAppIcon } from './PrivacyIcons.jsx';

const PrivacySearchResultsDropdown = ({
  results,
  query,
  isOpen,
  selectedIndex,
  onSelectResult,
  onShowToast
}) => {
  const dropdownRef = useRef(null);

  // Auto-scroll active selection into view inside dropdown (Section 5.3)
  useEffect(() => {
    if (isOpen && dropdownRef.current && selectedIndex >= 0) {
      const activeItem = dropdownRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      if (activeItem) {
        activeItem.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [isOpen, selectedIndex]);

  if (!isOpen || !query.trim()) return null;

  const handleWhatsAppHelp = (e) => {
    e.preventDefault();
    if (onShowToast) {
      onShowToast('Opening WhatsApp');
    }
    const message = `Hello House of Kaira, I have a question about your Privacy Policy: ${query.trim()}`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${PRIVACY_SETTINGS.support_whatsapp_raw}?text=${encoded}`, '_blank');
  };

  const countText = results.length === 1 ? '1 CLAUSE' : `${results.length} CLAUSES`;

  return (
    <div
      ref={dropdownRef}
      className="privacy-search-dropdown"
      role="listbox"
      id="privacy-search-results"
      aria-label="Matching clauses"
    >
      {results.length > 0 ? (
        <>
          <div className="privacy-search-dropdown-header" aria-live="polite">
            <span className="privacy-search-count">{countText}</span>
          </div>
          <ul className="privacy-search-results-list">
            {results.map((item, idx) => {
              const isSelected = selectedIndex === idx;
              return (
                <li
                  key={`priv-res-${item.anchor}-${idx}`}
                  role="option"
                  data-index={idx}
                  aria-selected={isSelected}
                  className={`privacy-search-result-item ${isSelected ? 'privacy-search-item-selected' : ''}`}
                  onClick={() => onSelectResult(item)}
                >
                  <div className="privacy-search-item-title-row">
                    <span className="privacy-search-item-num privacy-tabular-num">
                      {item.numberDisplay}
                    </span>
                    <span
                      className="privacy-search-item-title"
                      dangerouslySetInnerHTML={{
                        __html: highlightTitleMatches(item.title, item.matchedWords)
                      }}
                    />
                  </div>
                  <div className="privacy-search-item-context">
                    {item.context}
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <div className="privacy-search-no-results">
          <h4 className="privacy-no-res-title">No clause matches that yet</h4>
          <p className="privacy-no-res-desc">
            Ask us and we will point you to the part of this policy you need, or explain it in plain words.
          </p>
          <button
            type="button"
            className="privacy-no-res-btn"
            onClick={handleWhatsAppHelp}
          >
            <WhatsAppIcon size={16} color="#FFFFFF" />
            <span>ASK ON WHATSAPP</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default React.memo(PrivacySearchResultsDropdown);
