/**
 * Policy Sections & Body Container for Refund & Cancellation Policy Page
 * Spec v1.2 · Section 07
 */

import React from "react";
import PolicyIntro from "./PolicyIntro";
import PolicyInBrief from "./PolicyInBrief";
import SectionHeading from "./SectionHeading";
import QuestionRow from "./QuestionRow";

export default function PolicySections({
  activeTab = "rental",
  sectionsWithQuestions = [],
  openQuestionIds = new Set(),
  flashingQuestionId = null,
  isReviewMode = false,
  onToggleQuestion,
  onJumpToQuestion,
  onJumpToSection,
  onShowToast,
}) {
  return (
    <div className="rc-body" id="policy-body">
      {/* 07.1 Intro Paragraph */}
      <PolicyIntro activeTab={activeTab} />

      {/* 07.2 Policy in Brief Summary Table */}
      <PolicyInBrief
        activeTab={activeTab}
        onJumpToQuestion={onJumpToQuestion}
      />

      {/* 07.4 – 07.7 Policy Sections & Question Dropdowns */}
      {sectionsWithQuestions.map((section) => {
        const hasDecisions = section.questions.some((q) => Boolean(q.rv));
        return (
          <section
            key={section.id}
            id={`sec-${section.id}`}
            className={`sec ${!hasDecisions ? "no-rv" : ""}`.trim()}
          >
            <SectionHeading
              number={section.number}
              title={section.title}
              description={section.description}
            />

            <div className="sec-list">
              {section.questions.map((q) => {
                const isOpen = openQuestionIds.has(q.id);
                const isFlashing = flashingQuestionId === q.id;
                return (
                  <QuestionRow
                    key={q.id}
                    question={q}
                    isOpen={isOpen}
                    isFlashing={isFlashing}
                    isReviewMode={isReviewMode}
                    activeTab={activeTab}
                    onToggle={onToggleQuestion}
                    onJumpToQuestion={onJumpToQuestion}
                    onJumpToSection={onJumpToSection}
                    onShowToast={onShowToast}
                  />
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
