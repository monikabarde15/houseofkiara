/**
 * Policy In Brief Component for Refund & Cancellation Policy Page
 * Spec v1.2 · Section 07.2 & 13.5
 */

import React from "react";
import { POLICY_IN_BRIEF } from "../../../data/refunds/refundPolicyRegistry";
import VerdictTag from "../common/VerdictTag";
import { ChevronRightIcon } from "../common/RefundIcons";
import { formatInlineText } from "../../../utils/refundFormatter";

export default function PolicyInBrief({ activeTab = "rental", onJumpToQuestion }) {
  const briefRows = POLICY_IN_BRIEF[activeTab] || [];

  return (
    <div className="glance">
      <span className="ey">The policy in brief</span>
      <div className="glance-list" role="list">
        {briefRows.map((row, index) => (
          <button
            key={index}
            type="button"
            className="g-row"
            role="listitem"
            onClick={() => onJumpToQuestion(row.opens)}
          >
            <span className="g-sit">{formatInlineText(row.situation)}</span>
            <VerdictTag text={row.verdict} tone={row.tone} />
            <ChevronRightIcon />
          </button>
        ))}
      </div>
    </div>
  );
}
