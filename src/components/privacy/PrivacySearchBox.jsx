/**
 * House of Kaira - Privacy Policy Search Input Box
 * Section 5.3 of Build Specification v2.0
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { searchPrivacyPolicy } from '../../utils/privacy/privacySearch.js';
import { scrollToAnchor } from '../../utils/privacy/privacyFormatter.jsx';
import { SearchIcon } from './PrivacyIcons.jsx';
import PrivacySearchResultsDropdown from './PrivacySearchResultsDropdown.jsx';

const PrivacySearchBox = ({ onSelectClause, onShowToast, onOpenChange }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMobilePlaceholder, setIsMobilePlaceholder] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Notify parent hero of open state to adjust stacking context
  useEffect(() => {
    if (onOpenChange) {
      onOpenChange(isOpen);
    }
  }, [isOpen, onOpenChange]);

  // Responsive placeholder detection (<760px on load / resize)
  useEffect(() => {
    const handleResize = () => {
      setIsMobilePlaceholder(window.innerWidth <= 760);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update search results on query change (Section 5.3: updates on every key press)
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      setSelectedIndex(0);
      return;
    }

    const res = searchPrivacyPolicy(query);
    setResults(res);
    setIsOpen(true);
    setSelectedIndex(0);
  }, [query]);

  // Click outside to close dropdown (Section 5.3)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setSelectedIndex(0);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSelectResult = useCallback((item) => {
    setIsOpen(false);
    if (inputRef.current) {
      inputRef.current.blur();
    }
    if (onSelectClause) {
      onSelectClause(item);
    } else if (item.anchor) {
      scrollToAnchor(item.anchor, true);
    }
  }, [onSelectClause]);

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (query.trim() && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'Escape') {
      setIsOpen(false);
      // text stays
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (results.length > 0) {
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0));
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (results.length > 0) {
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1));
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results.length > 0 && selectedIndex >= 0 && results[selectedIndex]) {
        handleSelectResult(results[selectedIndex]);
      }
    }
  };

  const placeholderText = isMobilePlaceholder
    ? 'Search the policy or a clause number'
    : 'Search the policy, like “delete my data”, “WhatsApp” or a clause number';

  return (
    <div className="privacy-search-box-wrapper" ref={containerRef}>
      <div className={`privacy-search-field-row ${isOpen ? 'privacy-search-open' : ''}`}>
        <SearchIcon size={18} color="var(--hok-charcoal)" className="privacy-search-icon" />
        <label htmlFor="privacy-search-input" className="sr-only">
          Search the privacy policy
        </label>
        <input
          id="privacy-search-input"
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls="privacy-search-results"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (query.trim()) setIsOpen(true); }}
          onKeyDown={handleKeyDown}
          placeholder={placeholderText}
          className="privacy-search-input"
          autoComplete="off"
          spellCheck="false"
        />
        {query.length > 0 && (
          <button
            type="button"
            className="privacy-search-clear-btn"
            onClick={handleClear}
            aria-label="Clear search text"
          >
            CLEAR
          </button>
        )}
      </div>

      <PrivacySearchResultsDropdown
        results={results}
        query={query}
        isOpen={isOpen}
        selectedIndex={selectedIndex}
        onSelectResult={handleSelectResult}
        onShowToast={onShowToast}
      />
    </div>
  );
};

export default React.memo(PrivacySearchBox);
