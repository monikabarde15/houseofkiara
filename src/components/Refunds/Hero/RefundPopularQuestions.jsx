/**
 * Popular Questions Row Component for Refund & Cancellation Policy Page
 * Spec v1.2 · Section 04.7 & 13.7
 */

import React from "react";
import { POPULAR_QUESTIONS } from "../../../data/refunds/refundKeywords";

export default function RefundPopularQuestions({ onJumpToQuestion }) {
  return (
    <div className="ch-pop" aria-label="Popular questions">
      <span className="ch-pop-label">Popular:</span>
      {POPULAR_QUESTIONS.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onJumpToQuestion(item.id)}
        >
          {item.text}
        </button>
      ))}
    </div>
  );
}
