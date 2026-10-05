/**
 * Answer Content Formatter Component for Refund & Cancellation Policy Page
 * Spec v1.2 · Section 07.6 & 10
 */

import React from "react";
import { formatInlineText, RefundStepsBlock } from "../../../utils/refundFormatter";
import AnswerActions from "./AnswerActions";

export default function AnswerContent({
  question,
  activeTab = "rental",
  isReviewMode = false,
  onJumpToQuestion,
  onJumpToSection,
  onShowToast,
}) {
  const lines = Array.isArray(question.a) ? question.a : [question.a];

  // Group bullet items together into <ul> lists
  const renderedBlocks = [];
  let currentBullets = [];

  const flushBullets = (keyPrefix) => {
    if (currentBullets.length > 0) {
      renderedBlocks.push(
        <ul key={`ul-${keyPrefix}`}>
          {currentBullets.map((bullet, bIdx) => (
            <li key={bIdx}>
              {formatInlineText(bullet, {
                isReviewMode,
                onJumpToQuestion,
                onJumpToSection,
              })}
            </li>
          ))}
        </ul>
      );
      currentBullets = [];
    }
  };

  lines.forEach((line, idx) => {
    if (line.startsWith("- ")) {
      currentBullets.push(line.substring(2));
    } else {
      flushBullets(idx);
      if (line.startsWith("> ")) {
        renderedBlocks.push(
          <div key={`note-${idx}`} className="note">
            {formatInlineText(line.substring(2), {
              isReviewMode,
              onJumpToQuestion,
              onJumpToSection,
            })}
          </div>
        );
      } else if (line === "[[steps]]") {
        renderedBlocks.push(
          <RefundStepsBlock key={`steps-${idx}`} isReviewMode={isReviewMode} />
        );
      } else {
        renderedBlocks.push(
          <p key={`p-${idx}`}>
            {formatInlineText(line, {
              isReviewMode,
              onJumpToQuestion,
              onJumpToSection,
            })}
          </p>
        );
      }
    }
  });

  flushBullets("end");

  return (
    <div className="ans">
      {renderedBlocks}

      {/* Open Decision Note (Review Mode Only - Section 10) */}
      {isReviewMode && question.rv && (
        <div className="rv-note">
          <strong>Open decision.</strong> {question.rv}
        </div>
      )}

      {/* Answer Actions */}
      <AnswerActions
        question={question}
        activeTab={activeTab}
        onShowToast={onShowToast}
      />
    </div>
  );
}
