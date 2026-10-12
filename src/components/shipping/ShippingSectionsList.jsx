/**
 * House of Kaira: Shipping Sections List Component (D9)
 * Section 4.9 & 9.5 of Build Specification v2 (hok_shipping_policy_v3)
 */

import React from "react";
import { SHIPPING_SECTIONS } from "../../data/shipping/shippingRegistry";
import ShippingSectionBlock from "./ShippingSectionBlock";

function ShippingSectionsList({
  openQuestionIds,
  onToggleQuestion,
  onSelectQuestion,
  onShowToast
}) {
  return (
    <div className="sh-sections-wrap">
      {SHIPPING_SECTIONS.map((section) => (
        <ShippingSectionBlock
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

export default React.memo(ShippingSectionsList);
