/**
 * House of Kaira - Care Trio Feature Component (Component C8)
 * Section 5.9 & Appendix A of Build Specification 1.0
 */

import React from "react";
import { CARE_TRIO_FEATURE } from "../../data/seller/sellerRegistry";

export default function SellerCareTrioFeature() {
  return (
    <div className="trio" aria-label="Care in three moments">
      {CARE_TRIO_FEATURE.map((moment, idx) => (
        <div key={idx}>
          <h3>{moment.title}</h3>
          <p>{moment.desc}</p>
        </div>
      ))}
    </div>
  );
}
