/**
 * Section Heading Component for Refund & Cancellation Policy Page
 * Spec v1.2 · Section 07.4
 */

import React from "react";
import { formatSectionTitle } from "../../../utils/refundFormatter";

export default function SectionHeading({ number, title, description }) {
  return (
    <div className="sec-hd">
      <span className="sec-n">{number}</span>
      <div>
        <h2>{formatSectionTitle(title)}</h2>
        {description && <p>{description}</p>}
      </div>
    </div>
  );
}
