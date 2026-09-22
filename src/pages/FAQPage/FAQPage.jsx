import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FAQ_MOMENTS, ALL_QUESTIONS, QUESTION_MAP } from "../../data/faq/faqRegistry";
import { ADMIN_FIGURES } from "../../data/faq/adminFigures";
import Breadcrumb from "../../components/FAQ/common/Breadcrumb";
import FloatingWhatsApp from "../../components/FAQ/common/FloatingWhatsApp";
import ActionToast from "../../components/FAQ/common/ActionToast";
import ConciergeHero from "../../components/FAQ/Hero/ConciergeHero";
import MomentSection from "../../components/FAQ/Moment/MomentSection";
import SplitLayout from "../../components/FAQ/ReadingPane/SplitLayout";
import PoliciesLine from "../../components/FAQ/Policies/PoliciesLine";
import StillWonderingBand from "../../components/FAQ/StillWondering/StillWonderingBand";
import ReviewBar from "../../components/FAQ/ReviewMode/ReviewBar";
import "../../styles/faq/faq-variables.css";
import "../../styles/faq/faq-chrome.css";
import "../../styles/faq/faq-hero.css";
import "../../styles/faq/faq-cards.css";
import "../../styles/faq/faq-moment.css";
import "../../styles/faq/faq-rental-calculator.css";
import "../../styles/faq/faq-reading-pane.css";
import "../../styles/faq/faq-still-wondering.css";
import "../../styles/faq/faq-review.css";

export default function FAQPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // State
  const [momentId, setMomentId] = useState("before");
  const [sectionId, setSectionId] = useState("choosing-a-piece");
  const [currentQuestionId, setCurrentQuestionId] = useState("what-is-hok");
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [isDecisionsOnly, setIsDecisionsOnly] = useState(false);
  const [toast, setToast] = useState({ message: "", visible: false });
  const toastTimerRef = useRef(null);

  // Toast trigger (stays for 2.2s then hides - Section A10)
  const showToast = useCallback((message) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToast({ message, visible: true });
    toastTimerRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 2200);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  // Active moment object
  const currentMoment = useMemo(() => {
    return FAQ_MOMENTS.find((m) => m.id === momentId) || FAQ_MOMENTS[0];
  }, [momentId]);

  // Active section object
  const currentSection = useMemo(() => {
    if (!currentMoment || !currentMoment.sections) return null;
    return (
      currentMoment.sections.find((s) => s.id === sectionId) ||
      currentMoment.sections[0]
    );
  }, [currentMoment, sectionId]);

  // Active question object: always guaranteed to be valid and belong to the active section
  const currentQuestion = useMemo(() => {
    if (currentQuestionId && QUESTION_MAP[currentQuestionId]) {
      return QUESTION_MAP[currentQuestionId];
    }
    if (currentSection && currentSection.questions && currentSection.questions.length > 0) {
      return QUESTION_MAP[currentSection.questions[0].id] || currentSection.questions[0];
    }
    return ALL_QUESTIONS[0];
  }, [currentQuestionId, currentSection]);

  // Initialize and handle URL params & hash on mount / change (Section 10.2)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const reviewParam = searchParams.get("review") === "1";
    setIsReviewMode(reviewParam);

    const forParam = searchParams.get("for");
    const mParam = searchParams.get("m");
    const hash = location.hash ? location.hash.replace("#", "") : "";

    if (hash && QUESTION_MAP[hash]) {
      const q = QUESTION_MAP[hash];
      setMomentId(q.momentId);
      setSectionId(q.sectionId);
      setCurrentQuestionId(q.id);
      return;
    }

    if (forParam === "rent") {
      setMomentId("before");
      setSectionId("rental-dates");
      setCurrentQuestionId("how-rent");
      return;
    }

    if (forParam === "pre") {
      setMomentId("pre");
      setSectionId("buying");
      setCurrentQuestionId("how-buy");
      return;
    }

    if (mParam && FAQ_MOMENTS.some((m) => m.id === mParam)) {
      const targetMoment = FAQ_MOMENTS.find((m) => m.id === mParam);
      setMomentId(targetMoment.id);
      setSectionId(targetMoment.sections[0].id);
      setCurrentQuestionId(targetMoment.sections[0].questions[0].id);
      return;
    }
  }, [location.search, location.hash]);

  // Ensure current question belongs to the active section when section/moment changes
  useEffect(() => {
    if (!currentSection || !currentSection.questions || currentSection.questions.length === 0) return;
    const exists = currentSection.questions.some(
      (q) => q.id === currentQuestionId || q.originalId === currentQuestionId
    );
    if (!exists) {
      setCurrentQuestionId(currentSection.questions[0].id);
    }
  }, [currentSection, currentQuestionId]);

  // Handler to select a question & update address bar hash without polluting history (Section 10.1)
  const handleSelectQuestion = useCallback(
    (qId, shouldScroll = false) => {
      if (qId === null) {
        // Only on mobile can an inline accordion row be collapsed
        if (window.innerWidth <= 900) {
          setCurrentQuestionId(null);
        }
        return;
      }

      const target = QUESTION_MAP[qId];
      if (!target) return;

      setMomentId(target.momentId);
      setSectionId(target.sectionId);
      setCurrentQuestionId(target.id);

      const searchParams = new URLSearchParams(window.location.search);
      const reviewQuery = searchParams.get("review") === "1" ? "?review=1" : "";
      window.history.replaceState(null, "", `/faqs${reviewQuery}#${target.id}`);

      if (shouldScroll) {
        setTimeout(() => {
          const el = document.getElementById(`q-${target.id}`) || document.getElementById("moment-section");
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }, 50);
      }
    },
    []
  );

  // Handler to select a moment card or account link (Section 10.3)
  const handleSelectMoment = useCallback(
    (mId) => {
      const moment = FAQ_MOMENTS.find((m) => m.id === mId);
      if (!moment) return;
      setMomentId(moment.id);
      const firstSec = moment.sections[0];
      setSectionId(firstSec.id);
      const firstQ = firstSec.questions[0];
      setCurrentQuestionId(firstQ.id);

      const searchParams = new URLSearchParams(window.location.search);
      const reviewQuery = searchParams.get("review") === "1" ? "?review=1" : "";
      window.history.replaceState(null, "", `/faqs${reviewQuery}#${firstQ.id}`);

      // Smooth scroll to moment section (140px offset on desktop, 70px on mobile)
      setTimeout(() => {
        const momentEl = document.getElementById("moment-section");
        if (momentEl) {
          const yOffset = window.innerWidth <= 760 ? -70 : -140;
          const y = momentEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 50);
    },
    []
  );

  // Handler to select a section chip (Section 10.3)
  const handleSelectSection = useCallback(
    (sId) => {
      const sec = currentMoment.sections.find((s) => s.id === sId);
      if (!sec) return;
      setSectionId(sec.id);
      const firstQ = sec.questions[0];
      setCurrentQuestionId(firstQ.id);

      const searchParams = new URLSearchParams(window.location.search);
      const reviewQuery = searchParams.get("review") === "1" ? "?review=1" : "";
      window.history.replaceState(null, "", `/faqs${reviewQuery}#${firstQ.id}`);
    },
    [currentMoment]
  );

  return (
    <main className={`hok-faq-page ${isReviewMode ? "review" : ""} ${isDecisionsOnly ? "rv-only" : ""}`}>
      {/* Breadcrumb (A8) */}
      <Breadcrumb onSelectMoment={handleSelectMoment} />

      {/* Concierge Hero (B1-B13) */}
      <ConciergeHero
        selectedMomentId={momentId}
        onSelectMoment={handleSelectMoment}
        onSelectQuestion={handleSelectQuestion}
        onShowToast={showToast}
      />

      {/* Open Moment Section (C1-C6) */}
      <MomentSection
        moment={currentMoment}
        activeSectionId={sectionId}
        onSelectSection={handleSelectSection}
        onSelectQuestion={handleSelectQuestion}
      >
        {/* Questions & Reading Pane Split Layout (D1-D6) */}
        <SplitLayout
          moment={currentMoment}
          section={currentSection}
          currentQuestion={currentQuestion}
          currentQuestionId={currentQuestionId}
          onSelectQuestion={handleSelectQuestion}
          onShowToast={showToast}
          isReviewMode={isReviewMode}
        />
      </MomentSection>

      {/* Policies Line (E1) */}
      <PoliciesLine onShowToast={showToast} />

      {/* Still Wondering Support Band (F1-F3) */}
      <StillWonderingBand onShowToast={showToast} />

      {/* Floating WhatsApp Button (A9) */}
      <FloatingWhatsApp onShowToast={showToast} />

      {/* Action Toast (A10) */}
      <ActionToast toast={toast} />

      {/* Review Mode Bar (D7, 10.9) */}
      {isReviewMode && (
        <ReviewBar
          isDecisionsOnly={isDecisionsOnly}
          onToggleDecisionsOnly={() => setIsDecisionsOnly((prev) => !prev)}
        />
      )}
    </main>
  );
}
