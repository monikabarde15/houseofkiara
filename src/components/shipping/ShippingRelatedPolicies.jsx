/**
 * House of Kaira: Shipping Related Policies Component (D12)
 * Section 4.12 & Page 23 of Build Specification v2 (hok_shipping_policy_v3)
 */

import React from "react";
import { Link } from "react-router-dom";
import {
  SHIPPING_RELATED_POLICIES,
  SHIPPING_FINE_PRINT
} from "../../data/shipping/shippingRegistry";

function ShippingRelatedPolicies() {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="pol">
      <div className="pol-in">
        <b>Related policies</b>
        {SHIPPING_RELATED_POLICIES.map((policy) => (
          <Link key={policy.key} to={policy.path}>
            {policy.label}
          </Link>
        ))}
      </div>

      <p>
        {SHIPPING_FINE_PRINT.text}
        <button
          type="button"
          onClick={handlePrint}
          aria-label="Print or save as PDF"
        >
          {SHIPPING_FINE_PRINT.printAction}
        </button>
      </p>
    </div>
  );
}

export default React.memo(ShippingRelatedPolicies);
