/**
 * House of Kaira: No Search Results Page (/search)
 * Sections 6 & Appendix A, B of System Pages Specification v1.0
 */

import React, { useEffect, useRef, useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import InvitationFrame from "../components/system/shared/InvitationFrame";
import SystemHeroHeader from "../components/system/shared/SystemHeroHeader";
import SystemSearchField from "../components/system/shared/SystemSearchField";
import SystemChips from "../components/system/shared/SystemChips";
import SystemConciergeBand from "../components/system/shared/SystemConciergeBand";
import SystemOccasionsBand from "../components/system/shared/SystemOccasionsBand";
import WidenNotice from "../components/system/shared/WidenNotice";
import SystemPiecesBand from "../components/system/shared/SystemPiecesBand";
import { SystemQueryLink } from "../components/system/shared/SystemButtons";
import { TRENDING_SEARCHES } from "../data/system/systemVocabulary";
import {
  executeSearch,
  analyzeNoResultsState,
  normalizeWords
} from "../utils/system/searchEngine";
import { getDidYouMeanSuggestion } from "../utils/system/didYouMean";
import "../styles/system/system-variables.css";
import "../styles/system/system-hero.css";

export default function NoSearchResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const headingRef = useRef(null);

  const rawQuery = searchParams.get("q") || "";
  const urlMode = searchParams.get("mode") || null;

  // Collapse spaces and trim
  const cleanQ = useMemo(() => {
    return rawQuery.replace(/\s+/g, " ").trim();
  }, [rawQuery]);

  // Section 6.1: A visit to /search with no words redirects to the home page
  useEffect(() => {
    const words = normalizeWords(cleanQ);
    if (!cleanQ || words.length === 0) {
      navigate("/", { replace: true });
    }
  }, [cleanQ, navigate]);

  // Check if live pieces match the query
  const liveResults = useMemo(() => {
    if (!cleanQ) return [];
    return executeSearch(cleanQ, urlMode);
  }, [cleanQ, urlMode]);

  // Analyze the 0-results state
  const stateAnalysis = useMemo(() => {
    if (liveResults.length > 0) return null;
    return analyzeNoResultsState(cleanQ, urlMode);
  }, [cleanQ, urlMode, liveResults.length]);

  // Check for Did You Mean suggestion (Section 6.6)
  const didYouMean = useMemo(() => {
    if (liveResults.length > 0) return null;
    if (stateAnalysis?.state === "designer_empty") return null;
    if (stateAnalysis?.state === "narrowed") return null;
    return getDidYouMeanSuggestion(cleanQ);
  }, [cleanQ, liveResults.length, stateAnalysis?.state]);

  // Update browser title & meta tags (Section 6.2)
  useEffect(() => {
    const displayQuery = cleanQ.length > 60 ? cleanQ.slice(0, 60) + "…" : cleanQ;

    if (stateAnalysis?.state === "designer_empty" && stateAnalysis.designer) {
      document.title = `Nothing by ${stateAnalysis.designer.name} right now · House of Kaira`;
    } else {
      document.title = `No results for “${displayQuery}” · House of Kaira`;
    }

    // Set noindex meta tag
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement("meta");
      robotsMeta.name = "robots";
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.content = "noindex";

    return () => {
      if (robotsMeta) {
        robotsMeta.content = "index, follow";
      }
    };
  }, [cleanQ, stateAnalysis]);

  // Reset scroll and focus heading on new search (Section 6.7)
  useEffect(() => {
    window.scrollTo(0, 0);
    if (headingRef.current) {
      headingRef.current.focus();
    }
  }, [cleanQ, urlMode]);

  const handleSearchAgain = (newQuery) => {
    navigate(`/search?q=${encodeURIComponent(newQuery)}`);
  };

  const handleWidenToOtherMode = (otherMode) => {
    navigate(`/search?q=${encodeURIComponent(stateAnalysis?.query || cleanQ)}&mode=${otherMode}`);
  };

  // If live results exist, render results list band
  if (liveResults.length > 0) {
    return (
      <main className="sys-page" id="search-results-page">
        <section className="sys-hero-band">
          <InvitationFrame>
            <SystemHeroHeader
              eyebrow="Search"
              heading={`Pieces matching “${cleanQ}”`}
              sub={`We found ${liveResults.length} ${liveResults.length === 1 ? "piece" : "pieces"} for you.`}
              headingRef={headingRef}
            />
            <SystemSearchField
              initialQuery={cleanQ}
              onSearch={handleSearchAgain}
            />
          </InvitationFrame>
        </section>

        <SystemPiecesBand
          eyebrow="Results"
          title={`Pieces for “${cleanQ}”`}
          pieces={liveResults}
        />

        <SystemConciergeBand
          eyebrow="Our team, on WhatsApp"
          title="Looking for something in particular?"
          line="Tell us what you had in mind and our team will look for it, or the closest thing to it. Your search is already in the message."
          whatsAppMessage={`Hello House of Kaira, I searched for “${cleanQ}”. Could you help me with this search?`}
        />

        <SystemOccasionsBand />
      </main>
    );
  }

  // 0-results state setup
  const displayQ = cleanQ.length > 60 ? cleanQ.slice(0, 60) + "…" : cleanQ;

  // 1. Designer empty state (Section 6.5)
  if (stateAnalysis?.state === "designer_empty" && stateAnalysis.designer) {
    const designerName = stateAnalysis.designer.name;
    return (
      <main className="sys-page" id="no-search-results-page">
        <section className="sys-hero-band">
          <InvitationFrame>
            <SystemHeroHeader
              eyebrow="Search"
              heading={
                <>
                  Nothing by <span className="sys-gold-text">{designerName}</span> is with us right now
                </>
              }
              sub="Pieces by designers come and go as they are rented and sold. Our team can tell you the moment the next one arrives."
              headingRef={headingRef}
            />

            <SystemSearchField
              initialQuery={cleanQ}
              onSearch={handleSearchAgain}
            />

            <div className="sys-query-link-row">
              <SystemQueryLink
                label="See every designer, A to Z"
                to="/main-page?section=designers"
              />
            </div>

            <SystemChips
              label="Trending now"
              chips={TRENDING_SEARCHES}
              onSelectChip={handleSearchAgain}
            />
          </InvitationFrame>
        </section>

        <SystemConciergeBand
          eyebrow="Our team, on WhatsApp"
          title={`Hear first when ${designerName} arrives`}
          highlightWord={designerName}
          line={`Message our team and we will tell you on WhatsApp the moment a piece by ${designerName} joins the house.`}
          buttonLabel="Ask us to tell you"
          whatsAppMessage={`Hello House of Kaira, please let me know when a piece by ${designerName} arrives.`}
        />

        <SystemOccasionsBand />
      </main>
    );
  }

  // 2. Narrowed state (Section 6.5)
  if (stateAnalysis?.state === "narrowed") {
    const isAskedRent = stateAnalysis.askedMode === "rent";
    const headingText = isAskedRent
      ? `Nothing to rent matches “${stateAnalysis.query}” yet`
      : `Nothing preloved matches “${stateAnalysis.query}” yet`;
    const subText = isAskedRent
      ? "The same words find pieces when you look beyond rentals."
      : "The same words find pieces when you look beyond preloved pieces.";

    return (
      <main className="sys-page" id="no-search-results-page">
        <section className="sys-hero-band">
          <InvitationFrame>
            <SystemHeroHeader
              eyebrow="Search"
              heading={headingText}
              highlightText={stateAnalysis.query}
              sub={subText}
              headingRef={headingRef}
            />

            <WidenNotice
              query={stateAnalysis.query}
              otherMode={stateAnalysis.otherMode}
              count={stateAnalysis.otherCount}
              onWiden={handleWidenToOtherMode}
            />

            <SystemSearchField
              initialQuery={cleanQ}
              onSearch={handleSearchAgain}
            />

            <SystemChips
              label="Trending now"
              chips={TRENDING_SEARCHES}
              onSelectChip={handleSearchAgain}
            />
          </InvitationFrame>
        </section>

        <SystemConciergeBand
          eyebrow="Our team, on WhatsApp"
          title="Can’t find what you have in mind?"
          whatsAppMessage={`Hello House of Kaira, I searched for “${cleanQ}” and could not find it. Could you help me find it, or something close to it?`}
        />

        <SystemOccasionsBand />
      </main>
    );
  }

  // 3. Did You Mean state (Section 6.5 & 6.6)
  if (didYouMean) {
    return (
      <main className="sys-page" id="no-search-results-page">
        <section className="sys-hero-band">
          <InvitationFrame>
            <SystemHeroHeader
              eyebrow="Search"
              heading={`Nothing matches “${displayQ}” yet`}
              highlightText={displayQ}
              sub="New pieces arrive all the time. Try a designer, an occasion or a colour, or let our team look for it for you."
              headingRef={headingRef}
            />

            <SystemSearchField
              initialQuery={cleanQ}
              onSearch={handleSearchAgain}
            />

            <div className="sys-query-link-row">
              <span>Did you mean </span>
              <SystemQueryLink
                query={didYouMean}
                onClick={(e) => {
                  e.preventDefault();
                  handleSearchAgain(didYouMean);
                }}
              />
              <span>?</span>
            </div>

            <SystemChips
              label="Trending now"
              chips={TRENDING_SEARCHES}
              onSelectChip={handleSearchAgain}
            />
          </InvitationFrame>
        </section>

        <SystemConciergeBand
          eyebrow="Our team, on WhatsApp"
          title="Can’t find what you have in mind?"
          whatsAppMessage={`Hello House of Kaira, I searched for “${cleanQ}” and could not find it. Could you help me find it, or something close to it?`}
        />

        <SystemOccasionsBand />
      </main>
    );
  }

  // 4. Default Nothing state (with word chips if multi-word query has individual matches)
  const wordChips = stateAnalysis?.wordChips || [];

  return (
    <main className="sys-page" id="no-search-results-page">
      <section className="sys-hero-band">
        <InvitationFrame>
          <SystemHeroHeader
            eyebrow="Search"
            heading={`Nothing matches “${displayQ}” yet`}
            highlightText={displayQ}
            sub="New pieces arrive all the time. Try a designer, an occasion or a colour, or let our team look for it for you."
            headingRef={headingRef}
          />

          <SystemSearchField
            initialQuery={cleanQ}
            onSearch={handleSearchAgain}
          />

          {wordChips.length > 0 && (
            <SystemChips
              label="These words find pieces on their own"
              chips={wordChips}
              onSelectChip={handleSearchAgain}
            />
          )}

          <SystemChips
            label="Trending now"
            chips={TRENDING_SEARCHES}
            onSelectChip={handleSearchAgain}
          />
        </InvitationFrame>
      </section>

      <SystemConciergeBand
        eyebrow="Our team, on WhatsApp"
        title="Can’t find what you have in mind?"
        whatsAppMessage={`Hello House of Kaira, I searched for “${cleanQ}” and could not find it. Could you help me find it, or something close to it?`}
      />

      <SystemOccasionsBand />
    </main>
  );
}
