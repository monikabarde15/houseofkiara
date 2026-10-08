/**
 * House of Kaira - Seller Chapter Section Component
 * Section 4.2, 5.6 & Appendix A of Build Specification 1.0
 */

import React from "react";
import SellerQuestionRow from "./SellerQuestionRow";

export default function SellerChapterSection({
  chapter,
  questions = [],
  featureComponent = null,
  openQuestionIds = new Set(),
  onToggleQuestion,
  onSelectQuestion,
  onSelectChapter,
  onShowToast
}) {
  if (!chapter) return null;

  return (
    <section
      className={`ch ${chapter.bg === "cream" ? "tint" : ""}`}
      id={`ch-${chapter.id}`}
      aria-labelledby={`ch-title-${chapter.id}`}
    >
      <div className="ch-inner">
        {/* Left Column: Sticky Title & Intro */}
        <div className="ch-head">
          <h2 id={`ch-title-${chapter.id}`}>{chapter.title}</h2>
          <p className="ch-intro">{chapter.intro}</p>
        </div>

        {/* Right Column: Visual Feature (if any) & Questions */}
        <div className="ch-body">
          {featureComponent && (
            <div className="ch-feature">{featureComponent}</div>
          )}

          <div className="qs">
            {questions.map((q) => (
              <SellerQuestionRow
                key={q.id}
                question={q}
                isOpen={openQuestionIds.has(q.id)}
                onToggle={onToggleQuestion}
                onSelectQuestion={onSelectQuestion}
                onSelectChapter={onSelectChapter}
                onShowToast={onShowToast}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
