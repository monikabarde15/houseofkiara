/**
 * Question Row Accordion Component for Refund & Cancellation Policy Page
 * Spec v1.2 · Section 07.5 & 10
 */

import React, { useState, useEffect } from "react";
import VerdictTag from "../common/VerdictTag";
import { ChevronRightIcon } from "../common/RefundIcons";
import AnswerContent from "./AnswerContent";
import { formatInlineText } from "../../../utils/refundFormatter";

export default function QuestionRow({
  question,
  isOpen,
  isFlashing,
  isReviewMode,
  activeTab,
  onToggle,
  onJumpToQuestion,
  onJumpToSection,
  onShowToast,
}) {
  return (
    <div
      id={`q-${question.id}`}
      className={`cq ${isOpen ? "on" : ""} ${isFlashing ? "flash" : ""} ${
        question.rv ? "has-rv" : ""
      }`.trim()}
    >
      <button
        type="button"
        className="cq-b"
        aria-expanded={isOpen}
        aria-controls={`ans-${question.id}`}
        onClick={() => onToggle(question.id)}
      >
        <span className="cq-t">
          {formatInlineText(question.q, { isReviewMode })}
        </span>
        {question.tag && (
          <VerdictTag text={question.tag.text} tone={question.tag.tone} />
        )}
        <ChevronRightIcon />
      </button>

      <div
        id={`ans-${question.id}`}
        className="cq-body"
        role="region"
        aria-label={question.q}
      >
        <div className="cq-in">
          <div className="cq-pad">
            <AnswerContent
              question={question}
              activeTab={activeTab}
              isReviewMode={isReviewMode}
              onJumpToQuestion={onJumpToQuestion}
              onJumpToSection={onJumpToSection}
              onShowToast={onShowToast}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
