/**
 * Search Results Dropdown & Empty Fallback for Refund & Cancellation Policy
 * Spec v1.2 · Section 04.5 & 04.6
 */

import React, { useEffect, useRef } from "react";
import { WhatsAppIcon } from "../common/RefundIcons";
import { resolveTokenValue } from "../../../data/refunds/refundTokens";

export default function RefundSearchResultsDropdown({
  isOpen,
  results,
  query,
  selectedIndex,
  onSelectResult,
  onOpenWhatsApp,
}) {
  const listRef = useRef(null);

  // Keep selected item scrolled into view
  useEffect(() => {
    if (listRef.current && selectedIndex >= 0) {
      const selectedEl = listRef.current.querySelector(
        `[data-index="${selectedIndex}"]`
      );
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  if (!isOpen || results === null) return null;

  const handleWhatsAppNoResults = () => {
    const rawNumber = resolveTokenValue("support_whatsapp_raw");
    const msg = `Hello House of Kaira, I have a question about a refund or cancellation: ${query}`;
    const url = `https://wa.me/${rawNumber}?text=${encodeURIComponent(msg)}`;
    if (onOpenWhatsApp) {
      onOpenWhatsApp(url, "Opening WhatsApp");
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      className="ch-drop"
      role="listbox"
      id="refund-search-results"
      ref={listRef}
    >
      {results.length > 0 ? (
        <>
          <div className="ch-drop-hd">
            {results.length === 1 ? "1 answer" : `${results.length} answers`}
          </div>
          {results.map((item, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={item.id}
                type="button"
                className="ch-hit"
                role="option"
                data-index={idx}
                aria-selected={isSelected}
                onClick={() => onSelectResult(item)}
              >
                <b
                  dangerouslySetInnerHTML={{
                    __html: item.highlightedQuestion || item.q,
                  }}
                />
                <small>{item.policySectionLabel}</small>
              </button>
            );
          })}
        </>
      ) : (
        <div className="ch-none">
          <b>We could not find that one</b>
          <span>Ask us directly and we will answer it personally.</span>
          <div>
            <button
              type="button"
              className="btn-wa"
              onClick={handleWhatsAppNoResults}
            >
              <WhatsAppIcon size={14} />
              Ask on WhatsApp
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
