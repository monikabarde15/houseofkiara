// src/components/FAQ/Hero/SearchResultsDropdown.jsx
// Live search results dropdown (B5) per Section B5 & 10.4
import React, { useEffect, useRef } from "react";
import { highlightText } from "../../../utils/faqSearch";
import SearchNoResults from "./SearchNoResults";

export default function SearchResultsDropdown({
  results,
  isOpen,
  query,
  selectedIndex,
  onSelectResult,
  onShowToast,
}) {
  const listRef = useRef(null);

  // Auto-scroll selected result into view
  useEffect(() => {
    if (isOpen && listRef.current && selectedIndex >= 0) {
      const selectedItem = listRef.current.querySelector(
        `[data-index="${selectedIndex}"]`
      );
      if (selectedItem) {
        selectedItem.scrollIntoView({ block: "nearest" });
      }
    }
  }, [isOpen, selectedIndex]);

  if (!isOpen) return null;

  return (
    <div
      className="ch-drop"
      role="listbox"
      id="faq-search-results"
      aria-label="Search every answer"
      ref={listRef}
    >
      {results.length > 0 ? (
        <>
          <div className="ch-drop-hd" aria-live="polite">
            {results.length} {results.length === 1 ? "answer" : "answers"}, best match first
          </div>
          {results.map((q, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={q.id}
                type="button"
                className="ch-hit"
                role="option"
                data-index={idx}
                aria-selected={isSelected}
                onClick={() => onSelectResult(q.id)}
              >
                <b>{highlightText(q.question, q.matchedTerms)}</b>
                <small>{q.momentKicker}</small>
              </button>
            );
          })}
        </>
      ) : (
        <SearchNoResults query={query} onShowToast={onShowToast} />
      )}
    </div>
  );
}
