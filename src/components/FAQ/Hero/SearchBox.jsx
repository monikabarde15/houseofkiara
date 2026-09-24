// src/components/FAQ/Hero/SearchBox.jsx
// Search Field (B4) & Controller per Section B4 & 10.4
import React, { useState, useEffect, useRef, useCallback } from "react";
import { SearchMagnifierIcon } from "../common/FaqIcons";
import SearchResultsDropdown from "./SearchResultsDropdown";
import { searchQuestions } from "../../../utils/faqSearch";

export default function SearchBox({ onSelectQuestion, onShowToast }) {
  const [inputValue, setInputValue] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  // 110ms debounce per Section 10.4
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(inputValue);
    }, 110);
    return () => clearTimeout(timer);
  }, [inputValue]);

  // Execute search on debounced query
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSearchResults([]);
      setIsOpen(false);
      setSelectedIndex(0);
      return;
    }

    const { results, hasQuery, validWords } = searchQuestions(debouncedQuery);
    if (validWords.length > 0) {
      setSearchResults(results);
      setIsOpen(true);
      setSelectedIndex(0);
    } else {
      setSearchResults([]);
      setIsOpen(false);
    }
  }, [debouncedQuery]);

  // Handle global "/" shortcut (Section 10.4)
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        if (inputRef.current) {
          inputRef.current.focus();
          // Scroll to center smoothly
          inputRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  // Click outside to close dropdown (Section 10.4)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation inside search (Section 10.4)
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      if (isOpen) {
        setIsOpen(false);
      } else {
        setInputValue("");
        setSearchResults([]);
      }
      return;
    }

    if (!isOpen || searchResults.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % searchResults.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + searchResults.length) % searchResults.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (searchResults[selectedIndex]) {
        handleSelect(searchResults[selectedIndex].id);
      }
    }
  };

  const handleSelect = useCallback(
    (questionId) => {
      setIsOpen(false);
      if (onSelectQuestion) {
        onSelectQuestion(questionId, true);
      }
    },
    [onSelectQuestion]
  );

  const handleClear = () => {
    setInputValue("");
    setSearchResults([]);
    setIsOpen(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const hasQuery = inputValue.length > 0;

  return (
    <div
      className={`ch-find enter e3 ${hasQuery ? "has-q" : ""} ${isOpen ? "open" : ""}`}
      ref={wrapperRef}
    >
      <div className="ch-search">
        <SearchMagnifierIcon className="ch-search-svg" />
        <label htmlFor="faq-search-input" className="sr-only">
          Search every answer
        </label>
        <input
          id="faq-search-input"
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => {
            if (searchResults.length > 0 || (inputValue.trim().length >= 2)) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything: deposit, fit, late return, offer…"
          autoComplete="off"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls="faq-search-results"
          aria-autocomplete="list"
          aria-activedescendant={
            isOpen && searchResults[selectedIndex]
              ? `faq-hit-${searchResults[selectedIndex].id}`
              : undefined
          }
        />

        {/* / Key Hint or CLEAR button */}
        {!hasQuery ? (
          <span className="ch-kbd" aria-hidden="true">
            /
          </span>
        ) : (
          <button
            type="button"
            className="ch-x"
            onClick={handleClear}
            aria-label="Clear search text"
          >
            CLEAR
          </button>
        )}
      </div>

      {/* Live Dropdown */}
      <SearchResultsDropdown
        results={searchResults}
        isOpen={isOpen}
        query={inputValue}
        selectedIndex={selectedIndex}
        onSelectResult={handleSelect}
        onShowToast={onShowToast}
      />
    </div>
  );
}
