/**
 * House of Kaira: Shipping Search Box (D3)
 * Section 4.3 & 5.5 of Build Specification v2 (hok_shipping_policy_v3)
 */

import React, { useState, useRef, useEffect, useCallback } from "react";
import { searchShippingPolicy } from "../../utils/shipping/shippingSearch";
import ShippingSearchResultsDropdown from "./ShippingSearchResultsDropdown";

function MagnifierIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <line x1="16.5" y1="16.5" x2="21" y2="21" />
    </svg>
  );
}

function ShippingSearchBox({ onSelectQuestion, onShowToast }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [totalFound, setTotalFound] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Responsive placeholder detection (Section 4.3, D3)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 760);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Run search when query changes
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setTotalFound(0);
      setIsOpen(false);
      setSelectedIndex(0);
      return;
    }

    const { totalFound: found, results: res } = searchShippingPolicy(trimmed, 8);
    setResults(res);
    setTotalFound(found);
    setIsOpen(true);
    setSelectedIndex(0);
  }, [query]);

  // Click outside to close (Section 5.5)
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
        onSelectQuestion(`#${item.id}`);
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
      ? `shipping-search-result-${results[selectedIndex].id}`
      : undefined;

  const placeholderText = isMobile
    ? "Search your question"
    : "Search a question, like “express” or “pickup”";

  return (
    <div
      ref={containerRef}
      className={`ch-find enter e3 ${query ? "has-q" : ""} ${isOpen ? "open" : ""}`}
    >
      <div className="ch-search">
        <MagnifierIcon />
        <label htmlFor="shipping-search-input" className="sr-only">
          Search the shipping and delivery policy
        </label>
        <input
          ref={inputRef}
          id="shipping-search-input"
          type="search"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls="shipping-search-results-list"
          aria-activedescendant={activeDescendantId}
          aria-autocomplete="list"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          placeholder={placeholderText}
          autoComplete="off"
          spellCheck="false"
        />
        <button
          type="button"
          className="ch-x"
          onClick={handleClear}
          aria-label="Clear search query"
        >
          Clear
        </button>
      </div>

      <ShippingSearchResultsDropdown
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

export default React.memo(ShippingSearchBox);
