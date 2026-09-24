// src/components/FAQ/ReadingPane/QuestionList.jsx
// Question List Column (D1, D2)
import React from "react";
import QuestionRow from "./QuestionRow";

export default function QuestionList({
  moment,
  section,
  currentQuestionId,
  onSelectQuestion,
  onShowToast,
  isReviewMode,
}) {
  if (!section || !section.questions) return null;

  const isSharedMoment = moment && moment.appliesTo === "both";

  return (
    <div className="cl" role="region" aria-label="Question list">
      {section.questions.map((q) => (
        <QuestionRow
          key={q.id}
          question={q}
          isCurrent={currentQuestionId === q.id}
          isSharedMoment={isSharedMoment}
          onSelectQuestion={onSelectQuestion}
          onShowToast={onShowToast}
          isReviewMode={isReviewMode}
        />
      ))}
    </div>
  );
}
