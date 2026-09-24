// src/components/FAQ/ReadingPane/QuestionRow.jsx
// Question item row and inline mobile answer (D2, 10.3)
import React, { useRef } from "react";
import { ChevronIcon } from "../common/FaqIcons";
import AppliesToDot from "../common/AppliesToDot";
import AnswerContent from "./AnswerContent";
import FeedbackRow from "./FeedbackRow";

export default function QuestionRow({
  question,
  isCurrent,
  isSharedMoment,
  onSelectQuestion,
  onShowToast,
  isReviewMode,
}) {
  const rowRef = useRef(null);

  // Show applies-to label only in moments that serve both renters and buyers,
  // and only on questions that apply to just one of the two (Section D2 & Checklist 4)
  const showAppliesToTag =
    isSharedMoment && question.appliesTo && question.appliesTo !== "both";
  const tagLabel = question.appliesTo === "rent" ? "Renting" : "Preloved";

  const handleRowClick = () => {
    // If on desktop (>900px), always select question
    // If on mobile (<=900px), tapping the open row again closes it (Section 10.3)
    if (window.innerWidth <= 900 && isCurrent) {
      onSelectQuestion(null); // Closes inline answer
      return;
    }

    onSelectQuestion(question.id);

    // On mobile (<=900px), if tapped row is closer than 70px to top, scroll so row sits under header (Section 10.3)
    if (window.innerWidth <= 900 && rowRef.current) {
      setTimeout(() => {
        const rect = rowRef.current.getBoundingClientRect();
        if (rect.top < 70) {
          const y = rect.top + window.pageYOffset - 70;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 50);
    }
  };

  return (
    <div
      id={`q-${question.id}`}
      className={`cq ${isCurrent ? "on" : ""} ${question.decisionNote ? "has-rv" : ""}`}
      ref={rowRef}
    >
      <button
        type="button"
        className="cq-b"
        onClick={handleRowClick}
        aria-expanded={isCurrent}
        aria-current={isCurrent ? "true" : undefined}
      >
        <span className="cq-t">{question.question}</span>

        {/* Applies-to tag */}
        {showAppliesToTag && (
          <span className="cq-tag" aria-hidden="true">
            <AppliesToDot type={question.appliesTo} />
            <span>{tagLabel}</span>
          </span>
        )}

        <ChevronIcon className="cq-chevron" />
      </button>

      {/* Inline Answer on Mobile / Tablet (<= 900px) */}
      {isCurrent && (
        <div className="cq-inline" role="region">
          <AnswerContent
            answer={question.answer}
            onSelectQuestion={onSelectQuestion}
          />
          <FeedbackRow
            question={question}
            onShowToast={onShowToast}
          />
          {isReviewMode && question.decisionNote && (
            <div className="rv-note" role="note">
              <strong>Open decision (internal):</strong> {question.decisionNote}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
