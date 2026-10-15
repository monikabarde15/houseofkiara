// src/components/pricing/PricingSearchResultsDropdown.jsx
// Floating dropdown for two-sided search results (D3, Page 11)

import React from "react";
import { PRICING_TOKENS } from "../../data/pricing/pricingSettings";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" width="13" height="13" fill="currentColor">
      <path d="M17.5 14.4c-.3-.1-1.7-.8-2-1-.3-.1-.5-.1-.7.2-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.4-.5-2.6-1.6-.9-.8-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7.1-.1.3-.4.5-.6.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5s-.7-1.7-1-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.4-1.2 1.2-1.2 2.9s1.2 3.4 1.4 3.6c.2.3 2.4 3.7 5.9 5.2.8.4 1.5.6 2 .8.8.3 1.6.2 2.2.1.7-.1 2.1-.9 2.4-1.7.3-.8.3-1.6.2-1.7-.1-.2-.3-.3-.6-.4zM12 2C6.5 2 2 6.5 2 12c0 2 .6 3.8 1.6 5.3L2 22l4.8-1.6C8.2 21.4 10 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2z" />
    </svg>
  );
}

function PricingSearchResultsDropdown({
  isOpen,
  query,
  results,
  totalFound,
  selectedIndex,
  onSelectResult,
  onShowToast,
}) {
  if (!isOpen) return null;

  const handleWhatsAppClick = () => {
    if (onShowToast) {
      onShowToast("Opening WhatsApp concierge");
    }
  };

  const encodedQuery = encodeURIComponent(query);
  const whatsAppUrl = `https://wa.me/${PRICING_TOKENS.support_whatsapp_raw}?text=${encodeURIComponent(`Hello House of Kaira, I have a question about pricing: ${query}`)}`;

  return (
    <div
      className="ch-drop"
      role="listbox"
      id="pricing-search-results-list"
      aria-label="Search results"
    >
      {results.length > 0 ? (
        <>
          <div className="ch-drop-hd" aria-live="polite">
            {totalFound} {totalFound === 1 ? "answer" : "answers"}
            {totalFound > 8 ? ", showing the closest 8" : ""}
          </div>

          {results.map((item, index) => {
            const isSelected = index === selectedIndex;
            const sideName = item.side === "earn" ? "What you earn" : "What you pay";

            return (
              <button
                type="button"
                key={item.id}
                id={`pricing-search-result-${item.id}`}
                role="option"
                aria-selected={isSelected}
                className="ch-hit"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onSelectResult(item)}
              >
                <b>{item.question}</b>
                <small>{sideName} &middot; {item.sectionTitle}</small>
              </button>
            );
          })}
        </>
      ) : (
        <div className="ch-none">
          <b>We could not find that one</b>
          <p>Ask us directly and we will answer it personally.</p>
          <a
            className="btn-wa"
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsAppClick}
          >
            <WhatsAppIcon />
            Ask on WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}

export default React.memo(PricingSearchResultsDropdown);
