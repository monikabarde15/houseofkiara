// src/components/FAQ/ReviewMode/ReviewBar.jsx
// Internal review mode bar (D7, 10.9) shown when ?review=1
import React from "react";

export default function ReviewBar({ isDecisionsOnly, onToggleDecisionsOnly }) {
  return (
    <div className="rv-bar" role="toolbar" aria-label="Internal Review Toolbar">
      <span>
        Review mode · 120 answers · 2 open decisions · 2 figures awaiting confirmation
      </span>
      <button
        type="button"
        onClick={onToggleDecisionsOnly}
        aria-pressed={isDecisionsOnly}
      >
        {isDecisionsOnly ? "Show All Answers" : "Show Decisions Only"}
      </button>
    </div>
  );
}
