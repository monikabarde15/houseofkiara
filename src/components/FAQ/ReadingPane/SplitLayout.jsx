// src/components/FAQ/ReadingPane/SplitLayout.jsx
// Split Layout (D1) per Section D1
import React from "react";
import QuestionList from "./QuestionList";
import ReadingPane from "./ReadingPane";

export default function SplitLayout({
  moment,
  section,
  currentQuestion,
  currentQuestionId,
  onSelectQuestion,
  onShowToast,
  isReviewMode,
}) {
  return (
    <div className="sp">
      {/* Left Question List Column */}
      <QuestionList
        moment={moment}
        section={section}
        currentQuestionId={currentQuestionId}
        onSelectQuestion={onSelectQuestion}
        onShowToast={onShowToast}
        isReviewMode={isReviewMode}
      />

      {/* Right Sticky Reading Pane (hidden on <=900px in CSS) */}
      <ReadingPane
        question={currentQuestion}
        moment={moment}
        section={section}
        onSelectQuestion={onSelectQuestion}
        onShowToast={onShowToast}
        isReviewMode={isReviewMode}
      />
    </div>
  );
}
