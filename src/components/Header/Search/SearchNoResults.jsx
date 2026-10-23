/**
 * House of Kaira: Search Panel No Results State
 * Section 7 of System Pages Specification v1.0
 */

import React, { useMemo } from "react";
import { TRENDING_SEARCHES } from "../../../data/system/systemVocabulary";
import { SITE_SETTINGS } from "../../../data/system/systemTokens";
import { analyzeNoResultsState } from "../../../utils/system/searchEngine";
import { getDidYouMeanSuggestion } from "../../../utils/system/didYouMean";
import "../../../styles/Header/Search/search-overlay.css";

const SearchNoResults = ({ query, setQuery, runSearch, closeSearch }) => {
  const cleanQ = useMemo(() => {
    return (query || "").replace(/\s+/g, " ").trim();
  }, [query]);

  // Analyze state
  const stateAnalysis = useMemo(() => {
    return analyzeNoResultsState(cleanQ);
  }, [cleanQ]);

  // Check Did You Mean
  const didYouMean = useMemo(() => {
    if (stateAnalysis?.state === "designer_empty") return null;
    if (stateAnalysis?.state === "narrowed") return null;
    return getDidYouMeanSuggestion(cleanQ);
  }, [cleanQ, stateAnalysis?.state]);

  const handleChipClick = (term) => {
    if (setQuery) setQuery(term);
    if (runSearch) runSearch(term);
  };

  const handleDidYouMeanClick = (corrected) => {
    if (setQuery) setQuery(corrected);
    if (runSearch) runSearch(corrected);
  };

  const handleNarrowedClick = (otherMode) => {
    if (setQuery) setQuery(stateAnalysis?.query || cleanQ);
    if (runSearch) runSearch(stateAnalysis?.query || cleanQ);
  };

  // Determine title, line, and WhatsApp message (Section 7.1)
  let title = (
    <>
      Nothing matches <em>“{cleanQ}”</em> yet
    </>
  );
  let subtitle = "Try a designer, an occasion or a colour, or let our team look for it for you.";
  let whatsAppLabel = "Ask our team to find it, on WhatsApp";
  let whatsAppMessage = `Hello House of Kaira, I searched for “${cleanQ}” and could not find it. Could you help me find it, or something close to it?`;

  if (stateAnalysis?.state === "designer_empty" && stateAnalysis.designer) {
    const dName = stateAnalysis.designer.name;
    title = (
      <>
        Nothing by <span className="panel-gold">{dName}</span> is with us right now
      </>
    );
    subtitle = `Our team can tell you the moment the next piece by ${dName} arrives.`;
    whatsAppLabel = "Ask us to tell you, on WhatsApp";
    whatsAppMessage = `Hello House of Kaira, please let me know when a piece by ${dName} arrives.`;
  } else if (stateAnalysis?.state === "narrowed") {
    const isAskedRent = stateAnalysis.askedMode === "rent";
    title = isAskedRent ? (
      <>
        Nothing to rent matches <em>“{stateAnalysis.query}”</em> yet
      </>
    ) : (
      <>
        Nothing preloved matches <em>“{stateAnalysis.query}”</em> yet
      </>
    );
    subtitle = isAskedRent
      ? "The same words find pieces when you look beyond rentals."
      : "The same words find pieces when you look beyond preloved pieces.";
  }

  const whatsAppUrl = `https://wa.me/${SITE_SETTINGS.support_whatsapp_raw}?text=${encodeURIComponent(whatsAppMessage)}`;

  return (
    <div className="search-no-results" role="region" aria-live="polite">
      <div className="search-no-results-inner">
        <h2 className="search-no-results-title">{title}</h2>

        <p className="search-no-results-subtitle">{subtitle}</p>

        {/* Extra Line for Did You Mean or Narrowed (Section 7.1) */}
        {didYouMean && (
          <div className="search-panel-extra-line">
            <span>Did you mean </span>
            <button
              type="button"
              className="search-panel-query-link"
              onClick={() => handleDidYouMeanClick(didYouMean)}
            >
              “{didYouMean}”
            </button>
            <span>?</span>
          </div>
        )}

        {stateAnalysis?.state === "narrowed" && (
          <div className="search-panel-extra-line">
            <span>
              <strong>{stateAnalysis.otherCount}</strong> {stateAnalysis.otherMode}{" "}
              {stateAnalysis.otherCount === 1 ? "piece matches" : "pieces match"} “{stateAnalysis.query}”.
            </span>
            <button
              type="button"
              className="search-panel-text-link"
              onClick={() => handleNarrowedClick(stateAnalysis.otherMode)}
            >
              See the {stateAnalysis.otherCount} {stateAnalysis.otherMode} pieces
            </button>
          </div>
        )}

        {/* Trending Searches (Section 7.1) */}
        <div className="search-rescue-pills">
          {TRENDING_SEARCHES.map((item) => (
            <button
              key={item}
              type="button"
              className="search-rescue-pill"
              onClick={() => handleChipClick(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {/* WhatsApp Link (Section 7.1 & 7.2) */}
        <div className="search-panel-whatsapp-wrap">
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="search-panel-whatsapp-link"
          >
            <svg
              className="search-panel-whatsapp-icon"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.531 1.77.813 2.796.814 3.183 0 5.77-2.586 5.771-5.766.001-3.181-2.585-5.8-5.771-5.8zm3.376 8.21c-.144.405-.837.774-1.17.824-.312.045-.694.079-2.127-.514-1.834-.759-3.003-2.617-3.094-2.738-.09-.121-.745-.989-.745-1.887 0-.898.469-1.339.636-1.523.167-.184.364-.23.485-.23.122 0 .243.002.349.007.112.006.262-.042.41.314.152.364.517 1.26.562 1.352.045.092.076.199.015.321-.06.121-.091.198-.182.304-.09.106-.191.237-.273.318-.091.091-.186.19-.08.372.106.182.472.778 1.013 1.259.697.621 1.285.814 1.468.905.182.091.289.076.395-.045.106-.121.456-.531.577-.713.121-.182.243-.152.41-.091.167.061 1.061.5 1.243.591.182.091.303.136.349.213.045.076.045.438-.099.843z" />
            </svg>
            <span>{whatsAppLabel}</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default SearchNoResults;
