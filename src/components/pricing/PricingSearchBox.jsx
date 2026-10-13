// src/components/pricing/PricingSearchBox.jsx
// Interactive search input with two-sided scoring and dropdown management (D3, Page 10-11)

import React, { useState, useRef, useEffect, useCallback } from "react";
import { searchPricing } from "../../utils/pricing/pricingSearch";
import PricingSearchResultsDropdown from "./PricingSearchResultsDropdown";

function MagnifierIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <line x1="16.5" y1="16.5" x2="21" y2="21" />
    </svg>
  );
}

function PricingSearchBox({ activeSide, onSelectQuestion, onShowToast }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [totalFound, setTotalFound] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [placeholder, setPlaceholder] = useState(
    "Search a question, like 'late return' or 'my share'"
  );

  useEffect(() => {
    const updatePlaceholder = () => {
      if (typeof window !== "undefined" && window.innerWidth <= 760) {
        setPlaceholder("Search your question");
      } else {
        setPlaceholder("Search a question, like 'late return' or 'my share'");
      }
    };
    updatePlaceholder();
    window.addEventListener("resize", updatePlaceholder);
    return () => window.removeEventListener("resize", updatePlaceholder);
  }, []);

  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Run search when query or activeSide changes
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setTotalFound(0);
      setIsOpen(false);
      setSelectedIndex(0);
      return;
    }

    const scored = searchPricing(trimmed, activeSide);
    setResults(scored);
    setTotalFound(scored.length);
    setIsOpen(true);
    setSelectedIndex(0);
  }, [query, activeSide]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" && query.trim()) {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (results.length > 0) {
        setSelectedIndex((prev) => (prev + 1) % results.length);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (results.length > 0) {
        setSelectedIndex((prev) => (prev + (-1) + results.length) % results.length);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results.length > 0 && results[selectedIndex]) {
        handleSelectResult(results[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  const handleSelectResult = useCallback(
    (item) => {
      setIsOpen(false);
      if (inputRef.current) {
        inputRef.current.blur();
      }
      if (onSelectQuestion) {
        onSelectQuestion(item.id, item.side);
      }
    },
    [onSelectQuestion]
  );

  const handleClear = () => {
    setQuery("");
    setIsOpen(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleFocus = () => {
    if (query.trim()) {
      setIsOpen(true);
    }
  };

  const activeDescendantId =
    isOpen && results.length > 0 && results[selectedIndex]
      ? `pricing-search-result-${results[selectedIndex].id}`
      : undefined;

  return (
    <div
      ref={containerRef}
      className={`ch-find enter e3 ${query ? "has-q" : ""} ${isOpen ? "open" : ""}`}
    >
      <div className="ch-search">
        <MagnifierIcon />

        {/* Screen reader only label. Strictly styled with .sr-only and .pf-visually-hidden */}
        <label htmlFor="pricing-search-input" className="sr-only pf-visually-hidden">
          Search pricing and fees
        </label>

        <input
          ref={inputRef}
          id="pricing-search-input"
          type="search"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls="pricing-search-results-list"
          aria-activedescendant={activeDescendantId}
          aria-autocomplete="list"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck="false"
        />

        <button
          type="button"
          className="ch-x"
          onClick={handleClear}
          aria-label="Clear search input"
        >
          Clear
        </button>
      </div>

      <PricingSearchResultsDropdown
        isOpen={isOpen}
        query={query}
        results={results}
        totalFound={totalFound}
        selectedIndex={selectedIndex}
        onSelectResult={handleSelectResult}
        onShowToast={onShowToast}
      />
    </div>
  );
}

export default React.memo(PricingSearchBox);
