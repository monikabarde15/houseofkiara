/**
 * House of Kaira - Care Policy Popular Quick Links (Component C3)
 * Section 5.3, 6.4, 7.1 of Build Specification 2.0
 */

import React from "react";
import { CARE_POPULAR_LINKS } from "../../data/care/careRegistry";

export default function CarePopularLinks({ onLinkClick }) {
  return (
    <div className="ch-pop enter e5">
      <span className="ch-pop-label">Popular:</span>
      {CARE_POPULAR_LINKS.map((link) => (
        <button
          key={link.targetId}
          type="button"
          onClick={() => onLinkClick(link.targetId)}
        >
          {link.label}
        </button>
      ))}
    </div>
  );
}
