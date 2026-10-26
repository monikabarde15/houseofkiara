// src/components/pricing/PricingSectionsList.jsx
// Filtered list of policy sections for active side (D9) matching Pages 24-28 of hok_pricing_fees_v4

import React from "react";
import { PRICING_SECTIONS } from "../../data/pricing/pricingRegistry";
import PricingSectionBlock from "./PricingSectionBlock";

function PricingSectionsList({
  activeSide,
  openQuestionIds,
  onToggleQuestion,
  onSelectQuestion,
  onShowToast,
}) {
  const currentSections = PRICING_SECTIONS.filter((sec) => sec.side === activeSide);

  return (
    <div className="dp-sections-list">
      {currentSections.map((section) => (
        <PricingSectionBlock
          key={section.id}
          section={section}
          openQuestionIds={openQuestionIds}
          onToggleQuestion={onToggleQuestion}
          onSelectQuestion={onSelectQuestion}
          onShowToast={onShowToast}
        />
      ))}
    </div>
  );
}

export default React.memo(PricingSectionsList);
