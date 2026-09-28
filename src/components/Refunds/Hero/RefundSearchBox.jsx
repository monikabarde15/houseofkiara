/**
 * Search Box Component for Refund & Cancellation Policy Page
 * Spec v1.2 · Section 04.4, 04.5, 12.7
 */

import React, { useState, useEffect, useRef } from "react";
import { SearchIcon } from "../common/RefundIcons";
import RefundSearchResultsDropdown from "./RefundSearchResultsDropdown";
import { searchRefundPolicy } from "../../../utils/refundSearch";

export default function RefundSearchBox({
  currentTab = "rental",
  onJumpToQuestion,
  onOpenWhatsApp,
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [placeholder, setPlaceholder] = useState(
    "Search a question, like “late return” or “deposit”"
  );

  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Responsive placeholder chosen once on mount
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth <= 760) {
      setPlaceholder("Search your question");
    }
  }, []);

  // Global keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (
        e.key === "/" &&
        document.activeElement !== inputRef.current &&
        !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)
      ) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  // Run search when query or active tab changes
  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      setIsOpen(false);
      return;
    }

    const searchRes = searchRefundPolicy(query, currentTab);
    if (searchRes === null) {
      setResults(null);
      setIsOpen(false);
    } else {
      setResults(searchRes);
      setIsOpen(true);
      setSelectedIndex(0);
    }
  }, [query, currentTab]);

  // Click outside to close results
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (!isOpen || !results || results.length === 0) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelectResult(results[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  const handleSelectResult = (item) => {
    setIsOpen(false);
    inputRef.current?.blur();
    if (onJumpToQuestion) {
      onJumpToQuestion(item.id);
    }
  };

  const handleClear = () => {
    setQuery("");
    setResults(null);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const hasQuery = query.trim().length > 0;
  const isPanelOpen = isOpen && results !== null;

  return (
    <div
      ref={containerRef}
      className={`ch-find ${hasQuery ? "has-q" : ""} ${
        isPanelOpen ? "open" : ""
      }`.trim()}
    >
      <div className="ch-search">
        <SearchIcon />
        <label htmlFor="refund-search-input" className="sr-only">
          Search the refund and cancellation policy
        </label>
        <input
          ref={inputRef}
          id="refund-search-input"
          type="search"
          role="combobox"
          aria-expanded={isPanelOpen}
          aria-controls="refund-search-results"
          aria-autocomplete="list"
          aria-activedescendant={
            isPanelOpen && results && results[selectedIndex]
              ? `result-${results[selectedIndex].id}`
              : undefined
          }
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results !== null) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
        {hasQuery && (
          <button
            type="button"
            className="ch-x"
            onClick={handleClear}
            aria-label="Clear search"
          >
            Clear
          </button>
        )}
      </div>

      <RefundSearchResultsDropdown
        isOpen={isPanelOpen}
        results={results}
        query={query}
        selectedIndex={selectedIndex}
        onSelectResult={handleSelectResult}
        onOpenWhatsApp={onOpenWhatsApp}
      />
    </div>
  );
}
