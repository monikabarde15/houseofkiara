// src/components/FAQ/ReadingPane/ReadingPane.jsx
// Sticky Reading Pane (D3-D6) per Section D3-D6 & 10.8
import React, { useRef } from "react";
import AnswerContent from "./AnswerContent";
import FeedbackRow from "./FeedbackRow";
import AppliesToDot from "../common/AppliesToDot";

export default function ReadingPane({
  question,
  moment,
  section,
  onSelectQuestion,
  onShowToast,
  isReviewMode,
}) {
  const paneRef = useRef(null);

  if (!question) return null;

  // Kicker label: section name, or moment name when moment has 1 section (Section D3)
  const kickerLabel =
    moment && moment.sections && moment.sections.length > 1 && section
      ? section.title
      : moment?.kicker || "HELP & FAQS";

  // Applies-to badge for kicker
  const showAppliesTo = question.appliesTo && question.appliesTo !== "both";
  const appliesLabel = question.appliesTo === "rent" ? "Renting" : "Preloved";

  const handleNextClick = () => {
    if (question.nextQuestion && onSelectQuestion) {
      onSelectQuestion(question.nextQuestion.id);

      // If pane top has scrolled above viewport, scroll to bring it into view (Section 10.3)
      if (paneRef.current) {
        const rect = paneRef.current.getBoundingClientRect();
        if (rect.top < 138) {
          paneRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }
  };

  return (
    <aside
      className="pane"
      aria-label="Answer reading pane"
      ref={paneRef}
    >
      <div key={question.id} className="fade">
        {/* Kicker row with gold rule (D3) */}
        <div className="pane-k">
          <span>{kickerLabel}</span>
          {showAppliesTo && (
            <span className="pane-applies" aria-hidden="true">
              <AppliesToDot type={question.appliesTo} />
              <span>{appliesLabel}</span>
            </span>
          )}
        </div>

        {/* Question Title H3 (D3, 10.10) */}
        <h3 className="pane-title">{question.question}</h3>

        {/* Answer body (D4) */}
        <AnswerContent
          answer={question.answer}
          onSelectQuestion={onSelectQuestion}
        />

        {/* Next Question Link (D5) */}
        {question.nextQuestion && (
          <div className="next">
            <span>Next</span>
            <button type="button" onClick={handleNextClick}>
              {question.nextQuestion.question}
            </button>
          </div>
        )}

        {/* Feedback row (D6) */}
        <FeedbackRow
          question={question}
          onShowToast={onShowToast}
        />

        {/* Optional Review Mode Decision Note (D7) */}
        {isReviewMode && question.decisionNote && (
          <div className="rv-note" role="note">
            <strong>Open decision (internal):</strong> {question.decisionNote}
          </div>
        )}
      </div>
    </aside>
  );
}
