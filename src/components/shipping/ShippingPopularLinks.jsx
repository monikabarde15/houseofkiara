/**
 * House of Kaira: Shipping Popular Questions Bar (D4)
 * Section 4.4 of Build Specification v2 (hok_shipping_policy_v3)
 */

import React from "react";
import { SHIPPING_POPULAR_QUESTIONS } from "../../data/shipping/shippingRegistry";

function ShippingPopularLinks({ onSelectQuestion }) {
  return (
    <div className="ch-pop enter e4">
      <span className="pop-lbl">Popular:</span>
      {SHIPPING_POPULAR_QUESTIONS.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelectQuestion && onSelectQuestion(`#${item.id}`)}
        >
          {item.text}
        </button>
      ))}
    </div>
  );
}

export default React.memo(ShippingPopularLinks);
