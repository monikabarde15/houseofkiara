import React, { useState, useRef, useEffect } from 'react';
import { searchTerms } from '../../utils/terms/termsSearch.js';
import { scrollToClause } from '../../utils/terms/termsFormatter.jsx';
import { SearchIcon, ClearIcon } from './TermsIcons.jsx';
import TermsSearchResultsDropdown from './TermsSearchResultsDropdown.jsx';

/**
 * Terms & Conditions Search Input Box
 * Section 5.3 of Build Specification v3.0
 */
const TermsSearchBox = ({ onSelectClause }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isMobilePlaceholder, setIsMobilePlaceholder] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Responsive placeholder detection (<760px)
  useEffect(() => {
    const handleResize = () => {
      setIsMobilePlaceholder(window.innerWidth < 760);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update search results on query change
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      setSelectedIndex(-1);
      return;
    }

    const res = searchTerms(query);
    setResults(res);
    setIsOpen(true);
    setSelectedIndex(-1);
  }, [query]);

  // Click outside to close dropdown
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
    setSelectedIndex(-1);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleSelectResult = (item) => {
    setIsOpen(false);
    if (onSelectClause) {
      onSelectClause(item);
    } else {
      scrollToClause(item.anchor);
    }
  };

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    if (e.key === 'Escape') {
      setIsOpen(false);
      if (inputRef.current) inputRef.current.blur();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && results[selectedIndex]) {
        handleSelectResult(results[selectedIndex]);
      } else if (results.length > 0) {
        handleSelectResult(results[0]);
      }
    }
  };

  const placeholderText = isMobilePlaceholder
    ? 'Search the terms or a clause number'
    : 'Search the terms, like “deposit”, “late return” or a clause number';

  return (
    <div className="terms-search-box-wrapper" ref={containerRef}>
      <div className={`terms-search-input-container ${isOpen ? 'terms-search-open' : ''}`}>
        <SearchIcon size={16} className="terms-search-icon" color="var(--hok-muted)" />
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls="terms-search-results"
          aria-label="Search the terms and conditions"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (query.trim()) setIsOpen(true); }}
          onKeyDown={handleKeyDown}
          placeholder={placeholderText}
          className="terms-search-input terms-focus-ring"
          autoComplete="off"
          spellCheck="false"
        />
        {query.length > 0 && (
          <button
            type="button"
            className="terms-search-clear-btn"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <span className="terms-clear-text">CLEAR</span>
            <ClearIcon size={12} className="terms-clear-icon" />
          </button>
        )}
      </div>

      <TermsSearchResultsDropdown
        results={results}
        query={query}
        isOpen={isOpen}
        selectedIndex={selectedIndex}
        onSelectResult={handleSelectResult}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
};

export default React.memo(TermsSearchBox);
