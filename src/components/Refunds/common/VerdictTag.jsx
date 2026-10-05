/**
 * Verdict Tag Component for Refund & Cancellation Policy
 * Spec v1.2 · Section 07.3
 */

import React from "react";
import { replaceTokensInText } from "../../../data/refunds/refundTokens.js";

/**
 * Renders a verdict label (e.g. "Full refund", "Tell us within 24 hours", "No refund")
 * with a 6px colored dot: Sage for 'yes', Gold deep for 'mid', Terracotta for 'no'.
 */
export default function VerdictTag({ text, tone = "yes", className = "" }) {
  if (!text) return null;

  const resolvedText = replaceTokensInText(text);

  let toneClass = "v-yes";
  if (tone === "mid") toneClass = "v-mid";
  if (tone === "no") toneClass = "v-no";

  return (
    <span className={`vd ${toneClass} ${className}`.trim()}>
      {resolvedText}
    </span>
  );
}
