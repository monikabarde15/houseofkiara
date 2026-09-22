// src/components/FAQ/Hero/PopularQuestions.jsx
// Popular questions row (B7) per Section B7 & Appendix C
import React from "react";
import { POPULAR_QUESTIONS } from "../../../data/faq/searchKeywords";

export default function PopularQuestions({ onSelectQuestion }) {
  return (
    <div className="ch-pop enter e4">
      <span>Popular:</span>
      {POPULAR_QUESTIONS.map((item) => (
        <button
          key={item.id}
          type="button"
          className="ch-pop-link"
          onClick={() => onSelectQuestion(item.id, true)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
