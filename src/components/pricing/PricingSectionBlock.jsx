// src/components/pricing/PricingSectionBlock.jsx
// Policy section block with number, header, description and rows list (D9) matching Pages 24-25 of hok_pricing_fees_v4

import React from "react";
import PricingQuestionRow from "./PricingQuestionRow";

function renderSectionTitle(title, italicWord) {
  if (!italicWord || !title.includes(italicWord)) return title;
  const parts = title.split(italicWord);
  return (
    <>
      {parts[0]}
      <em>{italicWord}</em>
      {parts[1]}
    </>
  );
}

function PricingSectionBlock({
  section,
  openQuestionIds,
  onToggleQuestion,
  onSelectQuestion,
  onShowToast,
}) {
  return (
    <section className="sec" id={section.id} aria-labelledby={`sec-hd-${section.id}`}>
      {/* Section Header */}
      <div className="sec-hd">
        <span className="sec-n">{section.number}</span>
        <h2 id={`sec-hd-${section.id}`}>
          {renderSectionTitle(section.title, section.italic || section.italicWord)}
        </h2>
        <p>{section.summary}</p>
      </div>

      {/* Rows List */}
      <div className="sec-list">
        {section.questions.map((question) => {
          const isOpen = openQuestionIds.has(question.id);
          return (
            <PricingQuestionRow
              key={question.id}
              question={question}
              isOpen={isOpen}
              onToggle={onToggleQuestion}
              onSelectQuestion={onSelectQuestion}
              onShowToast={onShowToast}
            />
          );
        })}
      </div>
    </section>
  );
}

export default React.memo(PricingSectionBlock);
