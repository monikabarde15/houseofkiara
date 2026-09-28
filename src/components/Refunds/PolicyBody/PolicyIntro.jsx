/**
 * Policy Intro Component for Refund & Cancellation Policy Page
 * Spec v1.2 · Section 07.1 & 13.6
 */

import React from "react";
import { POLICY_INTROS } from "../../../data/refunds/refundPolicyRegistry";
import { formatInlineText } from "../../../utils/refundFormatter";

export default function PolicyIntro({ activeTab = "rental" }) {
  const introText = POLICY_INTROS[activeTab] || POLICY_INTROS.rental;

  return (
    <div className="rc-intro">
      <p>{formatInlineText(introText)}</p>
    </div>
  );
}
