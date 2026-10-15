// src/components/pricing/PricingQuestionRow.jsx
// Question row accordion item (D10) matching Pages 25-27 of hok_pricing_fees_v4

import React from "react";
import PricingAnswerContent from "./PricingAnswerContent";

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function PricingQuestionRow({
  question,
  isOpen,
  onToggle,
  onSelectQuestion,
  onShowToast,
}) {
  const tagText =
    typeof question.tag === "object" && question.tag !== null
      ? question.tag.text
      : question.tag;
  const tagTone =
    typeof question.tag === "object" && question.tag !== null
      ? question.tag.tone
      : question.tagTone;

  const getTagClass = () => {
    if (tagTone === "good" || tagTone === "yes") return "v-yes";
    if (tagTone === "caution" || tagTone === "no") return "v-no";
    return "v-mid";
  };

  return (
    <div className={`cq ${isOpen ? "on" : ""}`} id={question.id}>
      <button
        type="button"
        className="cq-b"
        onClick={() => onToggle(question.id)}
        aria-expanded={isOpen}
        aria-controls={`answer-panel-${question.id}`}
      >
        <span className="cq-t">{question.question}</span>

        {tagText && (
          <span className={`vd ${getTagClass()}`}>
            {tagText}
          </span>
        )}

        <ChevronIcon />
      </button>

      <div
        id={`answer-panel-${question.id}`}
        className="cq-body"
        role="region"
        aria-hidden={!isOpen}
      >
        <div className="cq-in">
          <div className="cq-pad">
            <PricingAnswerContent
              question={question}
              onSelectQuestion={onSelectQuestion}
              onShowToast={onShowToast}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(PricingQuestionRow);
