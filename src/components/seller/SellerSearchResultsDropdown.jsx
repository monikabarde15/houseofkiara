/**
 * House of Kaira - Seller Guidelines Search Results Dropdown (Component C3 Dropdown)
 * Section 5.3 & Appendix B of Build Specification 1.0
 */

import React, { useEffect, useRef } from "react";
import { SITE_TOKENS } from "../../data/seller/sellerSettings";
import { expandWordWithSynonyms, normalizeText } from "../../utils/seller/sellerSearch";

/**
 * Highlights matched query terms in text using <mark>
 */
function HighlightedText({ text, activeWords = [] }) {
  if (!text || activeWords.length === 0) return <span>{text}</span>;

  // Build a set of all term expansions to highlight
  const allTerms = new Set();
  activeWords.forEach((word) => {
    const expansions = expandWordWithSynonyms(word);
    expansions.forEach((t) => {
      const clean = normalizeText(t);
      if (clean && clean.length >= 2) {
        allTerms.add(clean);
      }
    });
  });

  if (allTerms.size === 0) return <span>{text}</span>;

  // Sort terms by length descending so longer phrases match first
  const sortedTerms = Array.from(allTerms).sort((a, b) => b.length - a.length);
  const regexPattern = sortedTerms.map((t) => `\\b${t}\\w*`).join("|");
  const regex = new RegExp(`(${regexPattern})`, "gi");

  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, i) => {
        if (!part) return null;
        const isMatch = sortedTerms.some((t) => {
          const partNorm = normalizeText(part);
          return partNorm.startsWith(t);
        });
        return isMatch ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>;
      })}
    </span>
  );
}

export default function SellerSearchResultsDropdown({
  results = [],
  query = "",
  activeWords = [],
  activeIndex = -1,
  onSelectResult,
  onSelectChip,
  dropdownRef
}) {
  const activeItemRef = useRef(null);

  // Auto-scroll active item into view during keyboard navigation
  useEffect(() => {
    if (activeItemRef.current) {
      activeItemRef.current.scrollIntoView({
        block: "nearest",
        behavior: "smooth"
      });
    }
  }, [activeIndex]);

  if (results.length === 0) {
    return (
      <div className="sg-results" ref={dropdownRef} role="listbox">
        <div className="sg-empty">
          <p>
            Nothing in these guidelines matches &ldquo;{query}&rdquo;. Try a simpler
            word, or message us on WhatsApp at{" "}
            <a
              href={`https://wa.me/${SITE_TOKENS.support_whatsapp_raw}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {SITE_TOKENS.support_whatsapp}
            </a>
            .
          </p>

          <div className="sg-try">
            {["payout", "damage", "take my piece back", "share"].map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => onSelectChip(chip)}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const countLabel =
    results.length === 1 ? "1 answer" : `${results.length} answers`;

  return (
    <div className="sg-results" ref={dropdownRef} role="listbox">
      <div className="sg-res-count">{countLabel}</div>

      {results.map((item, index) => {
        const isActive = index === activeIndex;

        return (
          <button
            key={item.question.id}
            type="button"
            className={`sg-res ${isActive ? "active" : ""}`}
            ref={isActive ? activeItemRef : null}
            onClick={() => onSelectResult(item.question)}
            role="option"
            aria-selected={isActive}
          >
            <span className="sg-res-q">
              <HighlightedText
                text={item.question.title}
                activeWords={activeWords}
              />
            </span>
            <span className="sg-res-ch">{item.chapterTitle}</span>
            {item.snippet && (
              <span className="sg-res-snip">
                <HighlightedText
                  text={item.snippet}
                  activeWords={activeWords}
                />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
