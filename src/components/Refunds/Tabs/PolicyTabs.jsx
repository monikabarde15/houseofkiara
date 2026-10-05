/**
 * Policy Tabs Component for Refund & Cancellation Policy Page
 * Spec v1.2 · Section 05
 */

import React from "react";
import { POLICY_TABS } from "../../../data/refunds/refundPolicyRegistry";

export default function PolicyTabs({
  activeTab = "rental",
  onSelectTab,
  rentalCount = 68,
  prelovedCount = 53,
}) {
  return (
    <div className="mode-bar-wrapper">
      <div className="mode-bar" role="group" aria-label="Choose a policy">
        <button
          type="button"
          className="mode-tab"
          aria-pressed={activeTab === "rental"}
          onClick={() => onSelectTab("rental")}
        >
          <span className="mt-k">{POLICY_TABS.rental.kicker}</span>
          <span className="mt-t">{POLICY_TABS.rental.title}</span>
          <span className="mt-n">{rentalCount} answers</span>
        </button>

        <button
          type="button"
          className="mode-tab"
          aria-pressed={activeTab === "preloved"}
          onClick={() => onSelectTab("preloved")}
        >
          <span className="mt-k">{POLICY_TABS.preloved.kicker}</span>
          <span className="mt-t">{POLICY_TABS.preloved.title}</span>
          <span className="mt-n">{prelovedCount} answers</span>
        </button>
      </div>
    </div>
  );
}
