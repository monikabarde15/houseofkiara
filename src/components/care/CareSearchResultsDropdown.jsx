/**
 * House of Kaira - Care Policy Search Results Dropdown (Component C3)
 * Section 5.3, 6.4, 6.7 of Build Specification 2.0
 */

import React from "react";
import { CARE_SETTINGS } from "../../data/care/careSettings";

export default function CareSearchResultsDropdown({
  results,
  totalFound,
  query,
  selectedIndex,
  onSelectResult
}) {
  const handleWhatsAppAsk = (e) => {
    e.stopPropagation();
    const msg = `Hello House of Kaira, I have a question about caring for my piece: ${query}`;
    const url = `https://wa.me/${CARE_SETTINGS.support_whatsapp_raw}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const countText =
    totalFound > 8
      ? `${totalFound} answers, showing the closest 8`
      : `${totalFound} answer${totalFound === 1 ? "" : "s"}`;

  return (
    <div
      className="ch-drop"
      role="listbox"
      id="careSearchResults"
      aria-label="Search suggestions"
    >
      {results.length > 0 ? (
        <>
          <div className="ch-drop-hd" aria-live="polite">
            {countText}
          </div>
          {results.map((q, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={q.id}
                type="button"
                className="ch-hit"
                role="option"
                id={`search-opt-${idx}`}
                aria-selected={isSelected}
                onClick={() => onSelectResult(q)}
              >
                <b>{q.title}</b>
                <small>{q.sectionName}</small>
              </button>
            );
          })}
        </>
      ) : (
        <div className="ch-none">
          <b>We could not find that answer</b>
          <p style={{ margin: "4px 0 0", color: "var(--care-ink-3)" }}>
            Ask us and we will reply to you personally.
          </p>
          <button
            type="button"
            className="btn-wa"
            onClick={handleWhatsAppAsk}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "var(--care-charcoal)",
              color: "var(--care-cream)",
              border: "1px solid var(--care-charcoal)",
              padding: "11px 18px",
              fontSize: "10px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              cursor: "pointer",
              borderRadius: "1px",
              marginTop: "14px"
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.77.813 2.796.814 3.183 0 5.769-2.587 5.77-5.768.001-3.182-2.585-5.798-5.77-5.798zm3.084 8.016c-.149.42-1.002.825-1.391.865-.389.04-1.026.064-3.183-.834-2.157-.899-3.238-3.32-3.344-3.469-.105-.15-.85-1.127-.85-2.152s.537-1.529.728-1.74c.191-.21.417-.262.556-.262.139 0 .278.002.399.008.127.006.297-.048.464.354.17.412.581 1.419.632 1.523.051.105.085.228.017.365-.068.136-.102.221-.203.34-.102.119-.214.266-.306.357-.102.102-.208.213-.09.417.119.204.528.871 1.134 1.412.781.696 1.439.912 1.643 1.014.204.102.323.085.442-.051.119-.136.51-.595.646-.799.136-.204.272-.17.459-.102.187.068 1.187.56 1.391.662.204.102.34.153.391.238.051.085.051.493-.098.913z" />
            </svg>
            <span>Ask on WhatsApp</span>
          </button>
        </div>
      )}
    </div>
  );
}
