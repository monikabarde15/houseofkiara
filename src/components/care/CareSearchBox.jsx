/**
 * House of Kaira - Care Policy Search Box Controller (Component C3)
 * Sections 5.3, 6.4, 9 of Build Specification 2.0
 */

import React, { useState, useRef, useEffect } from "react";
import CareSearchResultsDropdown from "./CareSearchResultsDropdown";
import CarePopularLinks from "./CarePopularLinks";
import { searchCarePolicy } from "../../utils/care/careSearch";

export default function CareSearchBox({ onSelectQuestion }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [totalFound, setTotalFound] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Responsive placeholder detection (<= 760px per Section 7.1)
  useEffect(() => {
    const checkWidth = () => {
      setIsMobile(window.innerWidth <= 760);
    };
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  // Live matching on query change (Section 6.4)
  useEffect(() => {
    if (query.trim().length >= 2) {
      const { totalFound: found, results: hits } = searchCarePolicy(query);
      setResults(hits);
      setTotalFound(found);
      setSelectedIndex(0);
      setIsOpen(true);
    } else {
      setResults([]);
      setTotalFound(0);
      setIsOpen(false);
    }
  }, [query]);

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard accessibility (Section 6.4 & Section 9)
  const handleKeyDown = (e) => {
    if (!isOpen || results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  const handleSelect = (question) => {
    setIsOpen(false);
    if (onSelectQuestion) {
      onSelectQuestion(question.id);
    }
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <div
      className={`ch-find enter e4 ${query ? "has-q" : ""} ${isOpen ? "open" : ""}`}
      ref={containerRef}
    >
      <div className="ch-search">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isMobile ? "Search your question" : "Search designers, occasions…"}
          aria-label="Search the care, cleaning and damage policy"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls="careSearchResults"
          aria-autocomplete="list"
          aria-activedescendant={isOpen && results.length > 0 ? `search-opt-${selectedIndex}` : undefined}
          autoComplete="off"
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

      {isOpen && (
        <CareSearchResultsDropdown
          results={results}
          totalFound={totalFound}
          query={query}
          selectedIndex={selectedIndex}
          onSelectResult={handleSelect}
        />
      )}

      <CarePopularLinks onLinkClick={onSelectQuestion} />
    </div>
  );
}
