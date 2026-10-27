/**
 * House of Kaira: System Search Field Component (C3)
 * Section 4 C3 of System Pages Specification v1.0
 */

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { normalizeWords } from "../../../utils/system/searchEngine";
import "../../../styles/system/system-variables.css";
import "../../../styles/system/system-hero.css";

export default function SystemSearchField({
  initialQuery = "",
  onSearch = null,
  placeholderDesktop = "Search designers, pieces, occasions",
  placeholderPhone = "Search designers, occasions"
}) {
  const [value, setValue] = useState(initialQuery);
  const [isPhone, setIsPhone] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setValue(initialQuery || "");
  }, [initialQuery]);

  useEffect(() => {
    const checkWidth = () => {
      setIsPhone(window.innerWidth <= 760);
    };
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  const handleClear = () => {
    setValue("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();

    const trimmed = (value || "").trim();
    const meaningfulWords = normalizeWords(trimmed);

    // Section 4 C3: A search with no real words never runs
    if (meaningfulWords.length === 0) {
      if (inputRef.current) {
        inputRef.current.focus();
      }
      toast("Type a designer, a piece or an occasion", {
        duration: 2500,
        id: "sys-search-empty-toast"
      });
      return;
    }

    if (onSearch) {
      onSearch(trimmed);
    } else {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <form
      className="sys-search-form"
      role="search"
      onSubmit={handleSubmit}
      action="/search"
      method="get"
    >
      {/* Magnifier Icon */}
      <svg
        className="sys-search-magnifier"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>

      {/* Input Field */}
      <input
        ref={inputRef}
        type="text"
        name="q"
        value={value}
        onChange={(e) => setValue(e.target.value.slice(0, 80))}
        placeholder={isPhone ? placeholderPhone : placeholderDesktop}
        aria-label="Search House of Kaira"
        className="sys-search-input"
        maxLength={80}
        autoComplete="off"
        spellCheck="false"
      />

      {/* Clear Button */}
      {value.length > 0 && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="sys-search-clear-btn"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        aria-label="Search"
        className="sys-search-submit-btn"
      >
        <span className="sys-desktop-search-text">Search</span>
        <svg
          className="sys-phone-search-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>
    </form>
  );
}
