import React, { useEffect, useState } from "react";
import { SELLER_PAGE_CONFIG } from "../data/seller/sellerSettings";
import { SELLER_CHAPTERS, getChapterById, getQuestionsByChapterId } from "../data/seller/sellerRegistry";
import {
  scrollToChapter,
  scrollToQuestion,
  determineActiveChapter
} from "../utils/seller/sellerScroll";

import SellerHero from "../components/seller/SellerHero";
import SellerSectionBar from "../components/seller/SellerSectionBar";
import SellerChapterSection from "../components/seller/SellerChapterSection";
import SellerTwoWaysFeature from "../components/seller/SellerTwoWaysFeature";
import SellerFiveStepsFeature from "../components/seller/SellerFiveStepsFeature";
import SellerCareTrioFeature from "../components/seller/SellerCareTrioFeature";
import SellerClosingBand from "../components/seller/SellerClosingBand";

import "../styles/seller/seller-variables.css";
import "../styles/seller/seller-chrome.css";
import "../styles/seller/seller-hero.css";
import "../styles/seller/seller-search.css";
import "../styles/seller/seller-section-bar.css";
import "../styles/seller/seller-questions.css";
import "../styles/seller/seller-chapters.css";
import "../styles/seller/seller-features.css";
import "../styles/seller/seller-closing.css";

export default function SellerGuidelinesPage() {
  const [activeChapterId, setActiveChapterId] = useState("ways");
  const [openQuestionIds, setOpenQuestionIds] = useState(new Set());
  const [toastMessage, setToastMessage] = useState("");
  const [isToastVisible, setIsToastVisible] = useState(false);

  const showToast = (msg = "Link copied") => {
    setToastMessage(msg);
    setIsToastVisible(true);
    setTimeout(() => {
      setIsToastVisible(false);
    }, 2200);
  };

  // Page title & meta description (Section 2)
  useEffect(() => {
    document.title = SELLER_PAGE_CONFIG.title;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = SELLER_PAGE_CONFIG.meta_description;
  }, []);

  // ScrollSpy tracking 40px line below the sticky bar (Section 5.5 & 6.6)
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const current = determineActiveChapter(SELLER_CHAPTERS);
          setActiveChapterId(current);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle URL hash on initial page load (e.g. #ch-protect or #q-damaged)
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const timer = setTimeout(() => {
      if (hash.startsWith("#ch-")) {
        const chapId = hash.replace("#ch-", "");
        scrollToChapter(chapId);
      } else if (hash.startsWith("#q-")) {
        const qId = hash.replace("#q-", "");
        setOpenQuestionIds((prev) => new Set(prev).add(qId));
        scrollToQuestion(qId);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const handleScrollToProtect = () => {
    scrollToChapter("protect");
  };

  const handleSelectQuestion = (questionId) => {
    setOpenQuestionIds((prev) => {
      const next = new Set(prev);
      next.add(questionId);
      return next;
    });

    setTimeout(() => {
      scrollToQuestion(questionId);
    }, 100);
  };

  const handleSelectChapter = (chapterId) => {
    setActiveChapterId(chapterId);
    scrollToChapter(chapterId);
  };

  const handleToggleQuestion = (questionId) => {
    setOpenQuestionIds((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  };

  return (
    <div className="sg-page" id="seller-guidelines-page">
      <a href="#ch-ways" className="sg-skip">
        Skip to the guidelines
      </a>

      {/* Main Content Area */}
      <main id="main-content" role="main">
        {/* Step 2 & 3: Hero Band & Search */}
        <SellerHero
          onScrollToProtect={handleScrollToProtect}
          onSelectQuestion={handleSelectQuestion}
        />

        {/* Step 4: Sticky Section Bar */}
        <SellerSectionBar
          activeChapterId={activeChapterId}
          onSelectChapter={handleSelectChapter}
        />

        {/* Step 6: Chapter 1 - Two ways to list */}
        <SellerChapterSection
          chapter={getChapterById("ways")}
          questions={getQuestionsByChapterId("ways")}
          featureComponent={<SellerTwoWaysFeature />}
          openQuestionIds={openQuestionIds}
          onToggleQuestion={handleToggleQuestion}
          onSelectQuestion={handleSelectQuestion}
          onSelectChapter={handleSelectChapter}
          onShowToast={showToast}
        />

        {/* Step 7: Chapter 2 - Getting started (Before your piece goes live) */}
        <SellerChapterSection
          chapter={getChapterById("start")}
          questions={getQuestionsByChapterId("start")}
          featureComponent={<SellerFiveStepsFeature />}
          openQuestionIds={openQuestionIds}
          onToggleQuestion={handleToggleQuestion}
          onSelectQuestion={handleSelectQuestion}
          onSelectChapter={handleSelectChapter}
          onShowToast={showToast}
        />

        {/* Step 8: Chapter 3 - Pricing & your share */}
        <SellerChapterSection
          chapter={getChapterById("price")}
          questions={getQuestionsByChapterId("price")}
          featureComponent={null}
          openQuestionIds={openQuestionIds}
          onToggleQuestion={handleToggleQuestion}
          onSelectQuestion={handleSelectQuestion}
          onSelectChapter={handleSelectChapter}
          onShowToast={showToast}
        />

        {/* Step 8: Chapter 4 - How we care (How we look after your piece) */}
        <SellerChapterSection
          chapter={getChapterById("care")}
          questions={getQuestionsByChapterId("care")}
          featureComponent={<SellerCareTrioFeature />}
          openQuestionIds={openQuestionIds}
          onToggleQuestion={handleToggleQuestion}
          onSelectQuestion={handleSelectQuestion}
          onSelectChapter={handleSelectChapter}
          onShowToast={showToast}
        />

        {/* Step 9: Chapter 5 - Your protection (If something happens) - Cream Tint */}
        <SellerChapterSection
          chapter={getChapterById("protect")}
          questions={getQuestionsByChapterId("protect")}
          featureComponent={null}
          openQuestionIds={openQuestionIds}
          onToggleQuestion={handleToggleQuestion}
          onSelectQuestion={handleSelectQuestion}
          onSelectChapter={handleSelectChapter}
          onShowToast={showToast}
        />

        {/* Step 9: Chapter 6 - When it sells (When your piece is sold) */}
        <SellerChapterSection
          chapter={getChapterById("selling")}
          questions={getQuestionsByChapterId("selling")}
          featureComponent={null}
          openQuestionIds={openQuestionIds}
          onToggleQuestion={handleToggleQuestion}
          onSelectQuestion={handleSelectQuestion}
          onSelectChapter={handleSelectChapter}
          onShowToast={showToast}
        />

        {/* Step 10: Chapter 7 - Staying in control (Your piece, your decision) */}
        <SellerChapterSection
          chapter={getChapterById("control")}
          questions={getQuestionsByChapterId("control")}
          featureComponent={null}
          openQuestionIds={openQuestionIds}
          onToggleQuestion={handleToggleQuestion}
          onSelectQuestion={handleSelectQuestion}
          onSelectChapter={handleSelectChapter}
          onShowToast={showToast}
        />

        {/* Step 10: Chapter 8 - Payouts & tax */}
        <SellerChapterSection
          chapter={getChapterById("payouts")}
          questions={getQuestionsByChapterId("payouts")}
          featureComponent={null}
          openQuestionIds={openQuestionIds}
          onToggleQuestion={handleToggleQuestion}
          onSelectQuestion={handleSelectQuestion}
          onSelectChapter={handleSelectChapter}
          onShowToast={showToast}
        />

        {/* Step 10: Chapter 9 - Privacy (Privacy and photographs) */}
        <SellerChapterSection
          chapter={getChapterById("privacy")}
          questions={getQuestionsByChapterId("privacy")}
          featureComponent={null}
          openQuestionIds={openQuestionIds}
          onToggleQuestion={handleToggleQuestion}
          onSelectQuestion={handleSelectQuestion}
          onSelectChapter={handleSelectChapter}
          onShowToast={showToast}
        />

        {/* Step 11: Closing Band */}
        <SellerClosingBand />
      </main>

      {/* Global Toast for Link Copied */}
      <div
        className={`toast ${isToastVisible ? "show" : ""}`}
        role="status"
        aria-live="polite"
      >
        {toastMessage}
      </div>
    </div>
  );
}
