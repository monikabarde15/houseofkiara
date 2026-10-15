// src/pages/PricingPolicyPage.jsx
// Main page shell for House of Kaira Pricing & Fees specification

import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PRICING_PAGE_CONFIG } from "../data/pricing/pricingSettings";
import { PRICING_SECTION_BAR_ITEMS } from "../data/pricing/pricingRegistry";
import { scrollToPricingTarget } from "../utils/pricing/pricingScroll";

// Components
import PricingBreadcrumb from "../components/pricing/PricingBreadcrumb";
import PricingHero from "../components/pricing/PricingHero";
import PricingLedgerCard from "../components/pricing/PricingLedgerCard";
import PricingSectionBar from "../components/pricing/PricingSectionBar";
import PricingSideIntro from "../components/pricing/PricingSideIntro";
import PricingWorkedExamples from "../components/pricing/PricingWorkedExamples";
import PricingSectionsList from "../components/pricing/PricingSectionsList";
import PricingWayAcross from "../components/pricing/PricingWayAcross";
import PricingRelatedPolicies from "../components/pricing/PricingRelatedPolicies";
import PricingClosingBand from "../components/pricing/PricingClosingBand";
import PricingFloatingWhatsApp from "../components/pricing/PricingFloatingWhatsApp";
import PricingPrintDocument from "../components/pricing/PricingPrintDocument";

// Stylesheets
import "../styles/pricing/pricing-variables.css";
import "../styles/pricing/pricing-chrome.css";
import "../styles/pricing/pricing-hero.css";
import "../styles/pricing/pricing-ledger.css";
import "../styles/pricing/pricing-section-bar.css";
import "../styles/pricing/pricing-intro.css";
import "../styles/pricing/pricing-worked-examples.css";
import "../styles/pricing/pricing-sections.css";
import "../styles/pricing/pricing-related.css";
import "../styles/pricing/pricing-closing.css";
import "../styles/pricing/pricing-print.css";

export default function PricingPolicyPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Active side state: "pay" (What you pay) or "earn" (What you earn)
  const [activeSide, setActiveSide] = useState("pay");
  const [activeSectionId, setActiveSectionId] = useState("numbers");
  const [openQuestionIds, setOpenQuestionIds] = useState(() => new Set());
  const [copiedToast, setCopiedToast] = useState(false);

  // Sync document title and meta description
  useEffect(() => {
    document.title = PRICING_PAGE_CONFIG.pageTitle;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = PRICING_PAGE_CONFIG.pageDescription;
  }, []);

  // Sync active side and questions with URL hash or params
  useEffect(() => {
    const rawHash = location.hash || "";
    const cleanHash = rawHash.replace("#", "");

    if (!cleanHash) return;

    if (cleanHash === "earn") {
      setActiveSide("earn");
      setActiveSectionId("s-share");
    } else if (cleanHash === "pay") {
      setActiveSide("pay");
      setActiveSectionId("numbers");
    } else if (
      cleanHash.startsWith("e-") ||
      cleanHash.startsWith("s-share") ||
      cleanHash.startsWith("s-costs") ||
      cleanHash.startsWith("s-payouts") ||
      cleanHash.startsWith("s-tax") ||
      cleanHash.startsWith("s-prices")
    ) {
      // Belongs to earn side
      setActiveSide("earn");
      if (!cleanHash.startsWith("s-")) {
        setOpenQuestionIds((prev) => new Set([...prev, cleanHash]));
      }
      setTimeout(() => {
        scrollToPricingTarget(cleanHash, { flash: true });
      }, 150);
    } else {
      // Belongs to pay side
      setActiveSide("pay");
      if (!cleanHash.startsWith("s-") && cleanHash !== "numbers" && cleanHash !== "ledger") {
        setOpenQuestionIds((prev) => new Set([...prev, cleanHash]));
      }
      setTimeout(() => {
        scrollToPricingTarget(cleanHash, { flash: true });
      }, 150);
    }
  }, [location.hash]);

  // Handler to switch perspective side
  const handleSideChange = (newSide) => {
    if (newSide !== activeSide) {
      setActiveSide(newSide);
      const defaultSection = newSide === "pay" ? "numbers" : "s-share";
      setActiveSectionId(defaultSection);
      navigate(`/pricing-fees#${newSide}`, { replace: true });
    }
  };

  // Handler for clicking a section bar link
  const handleSelectSection = (sectionId) => {
    setActiveSectionId(sectionId);
    navigate(`/pricing-fees#${sectionId}`, { replace: true });
    scrollToPricingTarget(sectionId, { flash: false });
  };

  // Handler to toggle an accordion question open/closed
  const handleToggleQuestion = useCallback((questionId) => {
    setOpenQuestionIds((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  }, []);

  // Handler when selecting a question from search, popular chips, or ledger cells
  const handleSelectQuestion = (questionId, targetSide) => {
    if (targetSide && targetSide !== activeSide) {
      setActiveSide(targetSide);
      navigate(`/pricing-fees#${questionId}`, { replace: true });
    } else {
      navigate(`/pricing-fees#${questionId}`, { replace: true });
    }

    setOpenQuestionIds((prev) => new Set([...prev, questionId]));

    setTimeout(() => {
      scrollToPricingTarget(questionId, { flash: true });
    }, 120);
  };

  // Scroll spy to highlight active section link (Section 5.8)
  useEffect(() => {
    const handleScroll = () => {
      const isMobile = window.innerWidth <= 1199;
      const headerHeight = isMobile ? 61 : 114;
      const barHeight = 52;
      const triggerLine = headerHeight + barHeight + 12 + 60;

      const currentLinks = PRICING_SECTION_BAR_ITEMS[activeSide] || [];
      let currentActive = currentLinks[0]?.id || "";

      for (const item of currentLinks) {
        const el = document.getElementById(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= triggerLine) {
            currentActive = item.id;
          }
        }
      }

      if (currentActive && currentActive !== activeSectionId) {
        setActiveSectionId(currentActive);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeSide, activeSectionId]);

  // Toast trigger for copy link actions
  const triggerCopyToast = (message = "Link copied. Paste it anywhere to share this answer.") => {
    setCopiedToast(message);
    setTimeout(() => {
      setCopiedToast(false);
    }, 2800);
  };

  return (
    <div className="pf-page" id="pricing-policy-page">
      <main id="pf-main">
        {/* D1 Breadcrumbs */}
        <PricingBreadcrumb />

        {/* D2 Hero with D3 Search and D4 Popular questions */}
        <PricingHero
          activeSide={activeSide}
          onSelectQuestion={handleSelectQuestion}
          onShowToast={triggerCopyToast}
        />

        {/* D5 Price Ledger Card (rests on hero lower edge) */}
        <PricingLedgerCard
          activeSide={activeSide}
          onSideChange={handleSideChange}
          onSelectQuestion={handleSelectQuestion}
        />

        {/* D6 Section Bar & Body Wrapper */}
        <div className="sh-wrap">
          <PricingSectionBar
            activeSide={activeSide}
            activeSectionId={activeSectionId}
            onSideChange={handleSideChange}
            onSelectSection={handleSelectSection}
          />

          {/* Policy Body */}
          <div className="dp-body">
            {/* D7 Side Intro */}
            <PricingSideIntro activeSide={activeSide} />

            {/* D8 In Numbers (Worked Examples): Only rendered on What you pay side */}
            {activeSide === "pay" && <PricingWorkedExamples />}

            {/* D9 Sections List: Renders 8 sections on pay, 5 sections on earn */}
            <PricingSectionsList
              activeSide={activeSide}
              openQuestionIds={openQuestionIds}
              onToggleQuestion={handleToggleQuestion}
              onSelectQuestion={handleSelectQuestion}
              onShowToast={triggerCopyToast}
            />

            {/* D12 The Way Across: perspective switcher */}
            <PricingWayAcross
              activeSide={activeSide}
              onSideChange={handleSideChange}
            />
          </div>
        </div>

        {/* D13 Related Policies */}
        <PricingRelatedPolicies />

        {/* D14 Closing Band */}
        <PricingClosingBand onShowToast={triggerCopyToast} />

        {/* D16 Print Document */}
        <PricingPrintDocument />
      </main>

      {/* Floating WhatsApp Concierge */}
      <PricingFloatingWhatsApp onShowToast={triggerCopyToast} />

      {/* Copy link feedback toast */}
      {copiedToast && (
        <div className="pf-toast" role="status" aria-live="polite">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>{copiedToast}</span>
        </div>
      )}
    </div>
  );
}
