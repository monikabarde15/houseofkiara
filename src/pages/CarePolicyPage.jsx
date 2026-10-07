/**
 * House of Kaira - Care, Cleaning & Damage Policy Page
 * Build Specification 2.0 Orchestrator
 */

import React, { useEffect, useState } from "react";
import CareBreadcrumb from "../components/care/CareBreadcrumb";
import CareHero from "../components/care/CareHero";
import CareFirstAidCard from "../components/care/CareFirstAidCard";
import CareIntro from "../components/care/CareIntro";
import CareSectionBar from "../components/care/CareSectionBar";
import CareMomentsSection from "../components/care/CareMomentsSection";
import CareQuestionRow from "../components/care/CareQuestionRow";
import CareWearDamageSection from "../components/care/CareWearDamageSection";
import CarePieceByPieceSection from "../components/care/CarePieceByPieceSection";
import CareRestoringSection from "../components/care/CareRestoringSection";
import CareOwnedSection from "../components/care/CareOwnedSection";
import CareRelatedPolicies from "../components/care/CareRelatedPolicies";
import CareClosingBand from "../components/care/CareClosingBand";
import CarePrintDocument from "../components/care/CarePrintDocument";

import { scrollToTarget } from "../utils/care/careScroll";
import { ALL_QUESTIONS } from "../data/care/careRegistry";

import "../styles/care/care-chrome.css";
import "../styles/care/care-hero.css";
import "../styles/care/care-first-aid.css";
import "../styles/care/care-section-bar.css";
import "../styles/care/care-moments.css";
import "../styles/care/care-questions.css";
import "../styles/care/care-wear-damage.css";
import "../styles/care/care-piece-by-piece.css";
import "../styles/care/care-restoring.css";
import "../styles/care/care-owned.css";
import "../styles/care/care-related.css";
import "../styles/care/care-closing.css";
import "../styles/care/care-print.css";

export default function CarePolicyPage() {
  const [activeMomentTab, setActiveMomentTab] = useState("arrives");
  const [activePieceChip, setActivePieceChip] = useState("lehenga");
  const [activeSection, setActiveSection] = useState("faCard");
  const [openQuestionIds, setOpenQuestionIds] = useState(new Set());

  // Page title & meta description (Section 2)
  useEffect(() => {
    document.title = "Care, Cleaning & Damage Policy · House of Kaira";
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content =
      "How House of Kaira cares for every piece, how to look after a rental while it is with you, and how normal wear and damage are decided.";
  }, []);

  // ScrollSpy tracking 60px line below the sticky bar (Section 6.6)
  useEffect(() => {
    const handleScroll = () => {
      const isMobile = window.innerWidth <= 760;
      const headerH = isMobile ? 58 : 114;
      const secbarH = 48;
      const triggerLine = headerH + secbarH + 60;

      const sections = [
        "faCard",
        "mod-moments",
        "mod-line",
        "mod-pieces",
        "mod-ours",
        "mod-owned"
      ];

      let currentActive = "faCard";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= triggerLine) {
            currentActive = id;
          }
        }
      }
      setActiveSection(currentActive);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hash deep linking on load (Section 6.5)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const cleanId = hash.replace("#", "");
      setTimeout(() => {
        handleSelectQuestion(cleanId);
      }, 300);
    }
  }, []);

  // Jump to question handler (Section 6.5)
  const handleSelectQuestion = (questionId) => {
    const cleanId = questionId.startsWith("#") ? questionId.slice(1) : questionId;

    // Special jump rule (Section 6.5): #p-care scrolls to C13 and flashes its top block
    if (cleanId === "p-care") {
      scrollToTarget("mod-owned", { flash: false });
      const grid = document.getElementById("ow-grid-block");
      if (grid) {
        grid.classList.remove("flash");
        void grid.offsetWidth;
        grid.classList.add("flash");
        setTimeout(() => grid.classList.remove("flash"), 2400);
      }
      return;
    }

    const targetQ = ALL_QUESTIONS.find((q) => q.id === cleanId);

    if (targetQ) {
      // If the answer sits in another moment, that moment is selected first
      if (
        ["arrives", "ready", "celebration", "after", "sending"].includes(
          targetQ.section
        )
      ) {
        setActiveMomentTab(targetQ.section);
      }
      // If it is a piece, that piece's chip is selected
      if (targetQ.section === "pieces") {
        if (targetQ.id === "pc-lehenga") setActivePieceChip("lehenga");
        else if (targetQ.id === "pc-saree") setActivePieceChip("saree");
        else if (targetQ.id === "pc-sets") setActivePieceChip("sets");
        else if (targetQ.id === "pc-gowns") setActivePieceChip("gowns");
        else if (targetQ.id === "pc-men") setActivePieceChip("men");
      }

      // Open the answer and update hash
      setOpenQuestionIds((prev) => new Set([...prev, cleanId]));
      window.history.replaceState(null, "", `#${cleanId}`);
    }

    // Scroll with sticky offset and flash
    setTimeout(() => {
      scrollToTarget(cleanId);
    }, 50);
  };

  const handleSectionBarClick = (sectionId) => {
    scrollToTarget(sectionId);
  };

  const toggleQuestion = (id) => {
    setOpenQuestionIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        if (window.location.hash === `#${id}`) {
          window.history.replaceState(null, "", window.location.pathname);
        }
      } else {
        next.add(id);
        window.history.replaceState(null, "", `#${id}`);
      }
      return next;
    });
  };

  return (
    <main className="care-page" id="carePolicyMain">
      {/* C1: Breadcrumb */}
      <CareBreadcrumb />

      {/* C2: Hero with C3: Search Box & Popular Links */}
      <CareHero onSelectQuestion={handleSelectQuestion} />

      {/* C4: If something happens First Aid Card */}
      <CareFirstAidCard onStepClick={handleSelectQuestion} />

      {/* C5: Intro Line */}
      <CareIntro />

      {/* Care Wrap Container: Allows sticky section bar to release before C14 */}
      <div className="care-wrap">
        {/* C6: Sticky Section Bar */}
        <CareSectionBar
          activeSection={activeSection}
          onSectionClick={handleSectionBarClick}
        />

        {/* C7: Your piece, moment by moment with C8: Care Notes & C9: Question Rows */}
        <CareMomentsSection
          activeMomentTab={activeMomentTab}
          onMomentTabChange={setActiveMomentTab}
          renderQuestions={(qIds) => (
            <div className="sec-list">
              {qIds.map((qId) => {
                const q = ALL_QUESTIONS.find((item) => item.id === qId);
                if (!q) return null;
                return (
                  <CareQuestionRow
                    key={q.id}
                    question={q}
                    isOpen={openQuestionIds.has(q.id)}
                    onToggle={toggleQuestion}
                    onJumpToQuestion={handleSelectQuestion}
                  />
                );
              })}
            </div>
          )}
        />

        {/* C10: Normal wear, or damage? */}
        <CareWearDamageSection
          renderQuestions={(qIds) => (
            <div className="sec-list">
              {qIds.map((qId) => {
                const q = ALL_QUESTIONS.find((item) => item.id === qId);
                if (!q) return null;
                return (
                  <CareQuestionRow
                    key={q.id}
                    question={q}
                    isOpen={openQuestionIds.has(q.id)}
                    onToggle={toggleQuestion}
                    onJumpToQuestion={handleSelectQuestion}
                  />
                );
              })}
            </div>
          )}
        />

        {/* C11: Care, piece by piece */}
        <CarePieceByPieceSection
          activePieceChip={activePieceChip}
          onPieceChipChange={setActivePieceChip}
        />

        {/* C12: Our care, and If a piece needs restoring */}
        <CareRestoringSection
          renderQuestions={(qIds) => (
            <div className="sec-list">
              {qIds.map((qId) => {
                const q = ALL_QUESTIONS.find((item) => item.id === qId);
                if (!q) return null;
                return (
                  <CareQuestionRow
                    key={q.id}
                    question={q}
                    isOpen={openQuestionIds.has(q.id)}
                    onToggle={toggleQuestion}
                    onJumpToQuestion={handleSelectQuestion}
                  />
                );
              })}
            </div>
          )}
        />

        {/* C13: A piece that is yours to keep */}
        <CareOwnedSection
          renderQuestions={(qIds) => (
            <div className="sec-list">
              {qIds.map((qId) => {
                const q = ALL_QUESTIONS.find((item) => item.id === qId);
                if (!q) return null;
                return (
                  <CareQuestionRow
                    key={q.id}
                    question={q}
                    isOpen={openQuestionIds.has(q.id)}
                    onToggle={toggleQuestion}
                    onJumpToQuestion={handleSelectQuestion}
                  />
                );
              })}
            </div>
          )}
        />
      </div>

      {/* C14: Related policies and last reviewed (outside .care-wrap so secbar releases) */}
      <CareRelatedPolicies />

      {/* C15: Can't find your answer? closing band */}
      <CareClosingBand />

      {/* Section 6.10: Complete Printable Layout */}
      <CarePrintDocument />
    </main>
  );
}
