import React from "react";
import { SHIPPING_INTRO } from "../../data/shipping/shippingRegistry";

function ShippingIntro({ getVal }) {
  const p1 = getVal ? getVal("shipping_intro_part1", SHIPPING_INTRO.text) : SHIPPING_INTRO.text;
  const p2 = getVal ? getVal("shipping_intro_part2", SHIPPING_INTRO.suffix) : SHIPPING_INTRO.suffix;

  return (
    <p className="dp-intro">
      {p1}
      {SHIPPING_INTRO.emphasis && <strong>{SHIPPING_INTRO.emphasis}</strong>}
      {p2}
    </p>
  );
}

export default React.memo(ShippingIntro);
