// src/components/pricing/PricingSideIntro.jsx
// Side Intro paragraph (D7) matching Page 20 & Page 44 of hok_pricing_fees_v4

import React from "react";
import { PRICING_SIDE_INTROS } from "../../data/pricing/pricingRegistry";

function PricingSideIntro({ activeSide }) {
  const introText = activeSide === "pay" ? PRICING_SIDE_INTROS.pay : PRICING_SIDE_INTROS.earn;

  return (
    <div className="dp-intro-wrap" aria-label="Perspective overview">
      <p className="dp-intro">{introText}</p>
    </div>
  );
}

export default React.memo(PricingSideIntro);
