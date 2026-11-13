/**
 * House of Kaira: Ways We Deliver Band (D8)
 * Section 4.8, 5.10 & Page 18, 19, 22 of Build Specification v2 (hok_shipping_policy_v3)
 */

import React from "react";
import { SHIPPING_WAYS_WE_DELIVER } from "../../data/shipping/shippingRegistry";

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function ShippingWaysWeDeliver({ onSelectQuestion, getVal }) {
  return (
    <section
      className="opt"
      id="opts"
      data-anchor="opts"
      aria-labelledby="opts-title"
    >
      <div className="ex-hd">
        <h2 id="opts-title">
          {getVal ? getVal("shipping_ways_prefix", SHIPPING_WAYS_WE_DELIVER.titlePrefix) : SHIPPING_WAYS_WE_DELIVER.titlePrefix}
          <em>{getVal ? getVal("shipping_ways_italic", SHIPPING_WAYS_WE_DELIVER.italicWord) : SHIPPING_WAYS_WE_DELIVER.italicWord}</em>
        </h2>
        <p>{getVal ? getVal("shipping_ways_subline", SHIPPING_WAYS_WE_DELIVER.subline) : SHIPPING_WAYS_WE_DELIVER.subline}</p>
      </div>

      <div className="opt-grid">
        {SHIPPING_WAYS_WE_DELIVER.options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className="opt-c"
            onClick={() => onSelectQuestion && onSelectQuestion(`#${opt.targetAnswerId}`)}
          >
            <span className="opt-where">{opt.place}</span>
            <span className="opt-k">{opt.name}</span>
            <span className="opt-t">{opt.time}</span>
            <span className={`vd v-${opt.tag.tone}`}>{opt.tag.text}</span>
            <p className="opt-n">{opt.note}</p>
            <span className="opt-go">
              {opt.linkText}
              <ChevronRightIcon />
            </span>
          </button>
        ))}
      </div>

      <p className="note">{SHIPPING_WAYS_WE_DELIVER.footnote}</p>
    </section>
  );
}

export default React.memo(ShippingWaysWeDeliver);
