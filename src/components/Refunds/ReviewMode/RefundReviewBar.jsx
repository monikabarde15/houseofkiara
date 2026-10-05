/**
 * Review Mode Bar Component for Refund & Cancellation Policy Page
 * Spec v1.2 · Section 10
 */

import React from "react";

export default function RefundReviewBar({
  isDecisionsOnly,
  onToggleDecisionsOnly,
}) {
  return (
    <div className="rv-bar" role="toolbar" aria-label="Review mode toolbar">
      <span>
        Review mode · 103 answers · 55 open decisions · 4 figures awaiting
        confirmation
      </span>
      <button type="button" onClick={onToggleDecisionsOnly}>
        {isDecisionsOnly ? "Show all questions" : "Show decisions only"}
      </button>
    </div>
  );
}
