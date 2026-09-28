import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RefundHero from "../../components/Refunds/Hero/RefundHero";
import PolicyTabs from "../../components/Refunds/Tabs/PolicyTabs";
import SectionBar from "../../components/Refunds/SectionBar/SectionBar";
import RefundToast from "../../components/Refunds/common/RefundToast";
import {
  ALL_REFUND_QUESTIONS,
  POLICY_SECTIONS,
  getQuestionsForPolicy,
  getSectionsWithQuestions,
} from "../../data/refunds/refundPolicyRegistry";
import "../../styles/refunds/refunds-variables.css";
import "../../styles/refunds/refunds-chrome.css";
import "../../styles/refunds/refunds-hero.css";
import "../../styles/refunds/refunds-tabs.css";
import "../../styles/refunds/refunds-section-bar.css";

import PolicySections from "../../components/Refunds/PolicyBody/PolicySections";
import RelatedPoliciesLine from "../../components/Refunds/Policies/RelatedPoliciesLine";
import CantFindAnswerBand from "../../components/Refunds/ClosingBand/CantFindAnswerBand";
import RefundReviewBar from "../../components/Refunds/ReviewMode/RefundReviewBar";
import RefundPrintDocument from "../../components/Refunds/Print/RefundPrintDocument";
import RefundFloatingWhatsApp from "../../components/Refunds/common/RefundFloatingWhatsApp";
import "../../styles/refunds/refunds-policy-body.css";
import "../../styles/refunds/refunds-closing-band.css";
import "../../styles/refunds/refunds-review.css";
import "../../styles/refunds/refunds-print.css";

export default function RefundsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // State
  const [activeTab, setActiveTab] = useState("rental");
  const [openQuestionIds, setOpenQuestionIds] = useState(new Set());
  const [flashingQuestionId, setFlashingQuestionId] = useState(null);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [isDecisionsOnly, setIsDecisionsOnly] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isToastVisible, setIsToastVisible] = useState(false);
  const toastTimerRef = useRef(null);
  const flashTimerRef = useRef(null);

  const showToast = useCallback((msg) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(msg);
    setIsToastVisible(true);
    toastTimerRef.current = setTimeout(() => {
      setIsToastVisible(false);
    }, 2200);
  }, []);

  const triggerFlash = useCallback((qId) => {
    if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    setFlashingQuestionId(qId);
    flashTimerRef.current = setTimeout(() => {
      setFlashingQuestionId(null);
    }, 2400);
  }, []);

  // Sections with questions for current tab
  const sectionsWithQuestions = getSectionsWithQuestions(activeTab);
  const currentSections = POLICY_SECTIONS[activeTab] || [];
  const [activeSectionId, setActiveSectionId] = useState(currentSections[0]?.id || "cancel");

  // Keep activeSectionId valid when tab switches
  useEffect(() => {
    const validSections = POLICY_SECTIONS[activeTab] || [];
    if (!validSections.some((s) => s.id === activeSectionId)) {
      setActiveSectionId(validSections[0]?.id || "cancel");
    }
  }, [activeTab, activeSectionId]);

  // Helper to get live header height accurately across desktop (112px) and mobile (58px)
  const getLiveHeaderHeight = useCallback(() => {
    const candidates = [
      document.querySelector(".hok-mobile-header"),
      document.querySelector(".hok-header-desktop"),
      document.querySelector("header"),
    ];

    for (const el of candidates) {
      if (
        el &&
        el.offsetHeight > 0 &&
        window.getComputedStyle(el).display !== "none"
      ) {
        return el.offsetHeight;
      }
    }

    return typeof window !== "undefined" && window.innerWidth <= 767 ? 58 : 112;
  }, []);

  // Section Scroll Spy (Section 12.6)
  useEffect(() => {
    const handleScrollSpy = () => {
      const headerH = getLiveHeaderHeight();
      const secBarEl = document.querySelector(".secbar");
      const secBarH = secBarEl ? secBarEl.offsetHeight : 50;
      const triggerLine = headerH + secBarH + 12 + 60;

      const validSections = POLICY_SECTIONS[activeTab] || [];
      let currentFound = null;

      for (const sec of validSections) {
        const el = document.getElementById(`sec-${sec.id}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= triggerLine) {
            currentFound = sec.id;
          }
        }
      }

      if (currentFound) {
        setActiveSectionId(currentFound);
      }
    };

    window.addEventListener("scroll", handleScrollSpy, { passive: true });
    return () => window.removeEventListener("scroll", handleScrollSpy);
  }, [activeTab, getLiveHeaderHeight]);

  // Handle URL query parameters and hash on mount/change (Section 12.1, 12.2)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const forParam = searchParams.get("for");
    const reviewParam = searchParams.get("review") === "1";
    setIsReviewMode(reviewParam);

    if (forParam === "preloved" || forParam === "pre") {
      setActiveTab("preloved");
    } else {
      setActiveTab("rental");
    }

    const hash = location.hash ? location.hash.replace("#", "") : "";
    if (hash) {
      if (hash.startsWith("s-")) {
        const secId = hash.replace("s-", "");
        setTimeout(() => {
          const el = document.getElementById(`sec-${secId}`);
          if (el) {
            const headerH = getLiveHeaderHeight();
            const secBarEl = document.querySelector(".secbar");
            const secBarH = secBarEl ? secBarEl.offsetHeight : 50;
            const y = el.getBoundingClientRect().top + window.pageYOffset - (headerH + secBarH + 12);
            window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
          }
        }, 120);
      } else {
        const targetQ = ALL_REFUND_QUESTIONS.find((q) => q.id === hash);
        if (targetQ) {
          if (targetQ.for === "pre") setActiveTab("preloved");
          if (targetQ.for === "rent") setActiveTab("rental");

          setOpenQuestionIds((prev) => new Set([...prev, targetQ.id]));
          triggerFlash(targetQ.id);

          setTimeout(() => {
            const el = document.getElementById(`q-${targetQ.id}`);
            if (el) {
              const headerH = getLiveHeaderHeight();
              const secBarEl = document.querySelector(".secbar");
              const secBarH = secBarEl ? secBarEl.offsetHeight : 50;
              const y = el.getBoundingClientRect().top + window.pageYOffset - (headerH + secBarH + 12);
              window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
            }
          }, 120);
        }
      }
    }
  }, [location.search, location.hash, triggerFlash, getLiveHeaderHeight]);

  // Handle switching policy tabs per Section 12.3
  const handleSelectTab = useCallback(
    (newTab) => {
      if (newTab === activeTab) return;

      setActiveTab(newTab);
      setOpenQuestionIds(new Set()); // Answers start closed

      const searchParams = new URLSearchParams(window.location.search);
      const reviewQuery = searchParams.get("review") === "1" ? "&review=1" : "";
      const forParam = newTab === "preloved" ? "?for=preloved" : "?for=rental";
      const newUrl = `/refunds${forParam}${reviewQuery}`;
      window.history.replaceState(null, "", newUrl);

      const secBarEl = document.querySelector(".secbar");
      if (secBarEl && secBarEl.classList.contains("stuck")) {
        const headerH = getLiveHeaderHeight();
        const secBarH = secBarEl.offsetHeight || 50;
        const bodyEl = document.getElementById("policy-body");
        if (bodyEl) {
          const y = bodyEl.getBoundingClientRect().top + window.pageYOffset - (headerH + secBarH + 12);
          window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
        }
      }
    },
    [activeTab, getLiveHeaderHeight]
  );

  // Jump to section handler (Section 12.5)
  const handleSelectSection = useCallback((secId) => {
    setActiveSectionId(secId);
    const secEl = document.getElementById(`sec-${secId}`);
    if (secEl) {
      const headerH = getLiveHeaderHeight();
      const secBarEl = document.querySelector(".secbar");
      const secBarH = secBarEl ? secBarEl.offsetHeight : 50;
      const y = secEl.getBoundingClientRect().top + window.pageYOffset - (headerH + secBarH + 12);
      window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
    }
  }, [getLiveHeaderHeight]);

  // Toggle individual question accordion
  const handleToggleQuestion = useCallback((qId) => {
    setOpenQuestionIds((prev) => {
      const next = new Set(prev);
      if (next.has(qId)) {
        next.delete(qId);
        const currentHash = window.location.hash.replace("#", "");
        if (currentHash === qId) {
          const searchParams = new URLSearchParams(window.location.search);
          const qStr = searchParams.toString() ? `?${searchParams.toString()}` : "";
          window.history.replaceState(null, "", `/refunds${qStr}`);
        }
      } else {
        next.add(qId);
        const searchParams = new URLSearchParams(window.location.search);
        const qStr = searchParams.toString() ? `?${searchParams.toString()}` : "";
        window.history.replaceState(null, "", `/refunds${qStr}#${qId}`);
      }
      return next;
    });
  }, []);

  // Jump to question handler (Section 12.5)
  const handleJumpToQuestion = useCallback(
    (qId) => {
      const targetQ = ALL_REFUND_QUESTIONS.find((q) => q.id === qId);
      if (!targetQ) return;

      if (targetQ.for === "pre") setActiveTab("preloved");
      if (targetQ.for === "rent") setActiveTab("rental");

      setOpenQuestionIds((prev) => new Set([...prev, targetQ.id]));
      triggerFlash(targetQ.id);

      const searchParams = new URLSearchParams(window.location.search);
      const reviewQuery = searchParams.get("review") === "1" ? "&review=1" : "";
      const forTabQuery = targetQ.for === "pre" ? "?for=preloved" : "?for=rental";
      const query = `${forTabQuery}${reviewQuery}`;
      window.history.replaceState(null, "", `/refunds${query}#${targetQ.id}`);

      setTimeout(() => {
        const el = document.getElementById(`q-${targetQ.id}`);
        if (el) {
          const headerH = getLiveHeaderHeight();
          const secBarEl = document.querySelector(".secbar");
          const secBarH = secBarEl ? secBarEl.offsetHeight : 50;
          const y = el.getBoundingClientRect().top + window.pageYOffset - (headerH + secBarH + 12);
          window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
        }
      }, 50);
    },
    [triggerFlash, getLiveHeaderHeight]
  );

  const handleOpenWhatsApp = useCallback((url, msg = "Opening WhatsApp") => {
    showToast(msg);
    setTimeout(() => {
      window.open(url, "_blank", "noopener,noreferrer");
    }, 300);
  }, [showToast]);

  return (
    <main
      className={`hok-refunds-page ${isReviewMode ? "review" : ""} ${
        isDecisionsOnly ? "rv-only" : ""
      }`.trim()}
    >
      {/* Hero Section with Breadcrumb, Search, and Popular Questions */}
      <RefundHero
        currentTab={activeTab}
        onJumpToQuestion={handleJumpToQuestion}
        onOpenWhatsApp={handleOpenWhatsApp}
      />

      {/* Policy Tabs (Overlaps Hero by -44px) */}
      <PolicyTabs
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        rentalCount={getQuestionsForPolicy("rental").length}
        prelovedCount={getQuestionsForPolicy("preloved").length}
      />

      {/* Sticky Section Bar */}
      <SectionBar
        activeTab={activeTab}
        sections={currentSections}
        activeSectionId={activeSectionId}
        onSelectTab={handleSelectTab}
        onSelectSection={handleSelectSection}
      />

      {/* Policy Body: Intro, Policy in Brief & Sections with Question Accordions */}
      <PolicySections
        activeTab={activeTab}
        sectionsWithQuestions={sectionsWithQuestions}
        openQuestionIds={openQuestionIds}
        flashingQuestionId={flashingQuestionId}
        isReviewMode={isReviewMode}
        onToggleQuestion={handleToggleQuestion}
        onJumpToQuestion={handleJumpToQuestion}
        onJumpToSection={handleSelectSection}
        onShowToast={showToast}
      />

      {/* Related Policies Line (Section 08) */}
      <RelatedPoliciesLine onPrint={() => window.print()} />

      {/* "Can't Find Your Answer?" Closing Band (Section 09) */}
      <CantFindAnswerBand onOpenWhatsApp={handleOpenWhatsApp} />

      {/* Floating Review Mode Toolbar (Section 10) */}
      {isReviewMode && (
        <RefundReviewBar
          isDecisionsOnly={isDecisionsOnly}
          onToggleDecisionsOnly={() => setIsDecisionsOnly((prev) => !prev)}
        />
      )}

      {/* Hidden Print Document (Section 11) */}
      <RefundPrintDocument />

      {/* Floating WhatsApp Action Button (Section 03 & 12.8) */}
      <RefundFloatingWhatsApp onShowToast={showToast} />

      {/* Toast Notification */}
      <RefundToast
        message={toastMessage}
        isVisible={isToastVisible}
        onClose={() => setIsToastVisible(false)}
      />
    </main>
  );
}
