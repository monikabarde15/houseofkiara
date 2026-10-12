/**
 * House of Kaira: Shipping Policy Intro (D7)
 * Section 4.7 & 9.3 of Build Specification v2 (hok_shipping_policy_v3)
 */

import React from "react";
import { SHIPPING_INTRO } from "../../data/shipping/shippingRegistry";

function ShippingIntro() {
  return (
    <p className="dp-intro">
      {SHIPPING_INTRO.text}
      <strong>{SHIPPING_INTRO.emphasis}</strong>
      {SHIPPING_INTRO.suffix}
    </p>
  );
}

export default React.memo(ShippingIntro);
