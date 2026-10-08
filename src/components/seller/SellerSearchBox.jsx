/**
 * House of Kaira - Seller Search Box Component (Component C3)
 * Section 5.3 & Appendix B of Build Specification 1.0
 */

import React, { useState, useRef, useEffect } from "react";
import { searchGuidelines } from "../../utils/seller/sellerSearch";
import SellerSearchResultsDropdown from "./SellerSearchResultsDropdown";

export default function SellerSearchBox({ onSelectQuestion }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [escapeCount, setEscapeCount] = useState(0);

  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const { results, isOnlyStopWords, activeWords } = searchGuidelines(query);

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setActiveIndex(-1);
        setEscapeCount(0);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setEscapeCount(0);
    setActiveIndex(-1);

    // Open if text entered and not only stop words
    if (val.trim()) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setIsOpen(false);
    setActiveIndex(-1);
    setEscapeCount(0);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleFocus = () => {
    if (query.trim() && !isOnlyStopWords) {
      setIsOpen(true);
    }
  };

  const handleSelectResult = (question) => {
    setIsOpen(false);
    setActiveIndex(-1);
    setEscapeCount(0);
    if (onSelectQuestion) {
      onSelectQuestion(question.id);
    }
  };

  const handleSelectChip = (chipText) => {
    setQuery(chipText);
    setIsOpen(true);
    setActiveIndex(-1);
    setEscapeCount(0);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      if (isOpen) {
        setIsOpen(false);
        setEscapeCount(1);
      } else {
        handleClear();
      }
      return;
    }

    if (!isOpen || results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1 >= results.length ? 0 : prev + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 < 0 ? results.length - 1 : prev - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const targetIndex = activeIndex >= 0 ? activeIndex : 0;
      if (results[targetIndex]) {
        handleSelectResult(results[targetIndex].question);
      }
    }
  };

  const hasValue = query.trim().length > 0;
  const showDropdown = isOpen && hasValue && !isOnlyStopWords;

  return (
    <div
      className={`sg-search ${hasValue ? "has-value" : ""} ${
        showDropdown ? "open" : ""
      }`}
      ref={containerRef}
    >
      <label htmlFor="sg-search-input">Search the guidelines</label>

      <div className="sg-search-box">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <line x1="16.5" y1="16.5" x2="21.5" y2="21.5" />
        </svg>

        <input
          id="sg-search-input"
          ref={inputRef}
          type="search"
          autoComplete="off"
          placeholder="Try payouts or damage"
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          aria-expanded={showDropdown}
          aria-autocomplete="list"
          role="combobox"
        />

        <button
          type="button"
          className="sg-clear"
          onClick={handleClear}
          aria-label="Clear search"
          tabIndex={hasValue ? 0 : -1}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="6" y1="18" x2="18" y2="6" />
          </svg>
        </button>
      </div>

      {showDropdown && (
        <SellerSearchResultsDropdown
          results={results}
          query={query}
          activeWords={activeWords}
          activeIndex={activeIndex}
          onSelectResult={handleSelectResult}
          onSelectChip={handleSelectChip}
        />
      )}
    </div>
  );
}
