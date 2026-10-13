/**
 * House of Kaira: Shipping Question Row Component (D10, D11)
 * Section 4.10, 4.11 & Page 20, 21, 22 of Build Specification v2 (hok_shipping_policy_v3)
 */

import React from "react";
import ShippingAnswerContent from "./ShippingAnswerContent";

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function ShippingQuestionRow({
  question,
  isOpen,
  onToggle,
  onSelectQuestion,
  onShowToast
}) {
  return (
    <article
      className={`cq ${isOpen ? "on" : ""}`}
      id={question.id}
      data-anchor={question.id}
    >
      <button
        type="button"
        className="cq-b"
        id={`btn-${question.id}`}
        aria-expanded={isOpen}
        aria-controls={`ans-${question.id}`}
        onClick={() => onToggle && onToggle(question.id)}
      >
        <span className="cq-t">{question.question}</span>

        {question.tag && (
          <span className={`vd v-${question.tag.tone}`}>
            {question.tag.text}
          </span>
        )}

        <ChevronRightIcon />
      </button>

      <div
        id={`ans-${question.id}`}
        className="cq-body"
        role="region"
        aria-labelledby={`btn-${question.id}`}
      >
        <div className="cq-in">
          <div className="cq-pad">
            <ShippingAnswerContent
              question={question}
              onSelectQuestion={onSelectQuestion}
              onShowToast={onShowToast}
            />
          </div>
        </div>
      </div>
    </article>
  );
}

export default React.memo(ShippingQuestionRow);
