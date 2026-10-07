/**
 * House of Kaira - Care Question Accordion Row Component (Component C9)
 * Sections 5.9, 6.1, 9 of Build Specification 2.0
 */

import React from "react";
import CareVerdictTag from "./CareVerdictTag";
import CareAnswerContent from "./CareAnswerContent";

export default function CareQuestionRow({
  question,
  isOpen,
  onToggle,
  onJumpToQuestion
}) {
  if (!question) return null;

  return (
    <div
      className={`cq ${isOpen ? "on" : ""}`}
      id={question.id}
    >
      <button
        type="button"
        className="cq-b"
        onClick={() => onToggle(question.id)}
        aria-expanded={isOpen}
        aria-controls={`care-ans-${question.id}`}
      >
        <span className="cq-t">{question.title}</span>

        {question.tag ? <CareVerdictTag tag={question.tag} /> : <span />}

        <svg viewBox="0 0 24 24" aria-hidden="true">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      <div
        className="cq-body"
        id={`care-ans-${question.id}`}
        role="region"
        aria-label={question.title}
      >
        <div className="cq-in">
          <div className="cq-pad">
            <CareAnswerContent
              question={question}
              onJumpToQuestion={onJumpToQuestion}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
