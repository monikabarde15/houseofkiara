/**
 * House of Kaira: Shipping Section Block Component (D9)
 * Section 4.9 & Page 20 of Build Specification v2 (hok_shipping_policy_v3)
 */

import React from "react";
import ShippingQuestionRow from "./ShippingQuestionRow";

function ShippingSectionBlock({
  section,
  openQuestionIds,
  onToggleQuestion,
  onSelectQuestion,
  onShowToast
}) {
  return (
    <section
      className="sec"
      id={section.id}
      data-anchor={section.id}
      aria-labelledby={`${section.id}-title`}
    >
      <div className="sec-hd">
        <span className="sec-n">{section.num}</span>
        <h2 id={`${section.id}-title`}>
          {section.titlePrefix}
          <em>{section.italicWord}</em>
        </h2>
        <p>{section.desc}</p>
      </div>

      <div className="sec-list">
        {section.questions.map((q) => (
          <ShippingQuestionRow
            key={q.id}
            question={q}
            isOpen={openQuestionIds && openQuestionIds.has(q.id)}
            onToggle={onToggleQuestion}
            onSelectQuestion={onSelectQuestion}
            onShowToast={onShowToast}
          />
        ))}
      </div>
    </section>
  );
}

export default React.memo(ShippingSectionBlock);
