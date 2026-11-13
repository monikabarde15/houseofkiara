/**
 * Hero Section Container for Refund & Cancellation Policy Page
 * Spec v1.2 · Section 04
 */

import React from "react";
import RefundBreadcrumb from "../common/RefundBreadcrumb";
import RefundSearchBox from "./RefundSearchBox";
import RefundPopularQuestions from "./RefundPopularQuestions";

export default function RefundHero({
  getVal,
  currentTab = "rental",
  onJumpToQuestion,
  onOpenWhatsApp,
}) {
  const eyebrow = getVal ? getVal("refunds_hero_eyebrow", "Our commitment to you") : "Our commitment to you";
  const heading = getVal ? getVal("refunds_hero_heading", null) : null;
  const lead = getVal ? getVal("refunds_hero_lead", "Plans change, and we understand. Before you order or after, here is exactly what happens when they do, in plain words and with no surprises.") : "Plans change, and we understand. Before you order or after, here is exactly what happens when they do, in plain words and with no surprises.";

  return (
    <section className="rc-hero-section">
      <RefundBreadcrumb />
      <div className="rc-hero">
        <div className="fq-eyebrow">
          <i aria-hidden="true" />
          <span>{eyebrow}</span>
          <i aria-hidden="true" />
        </div>

        <h1 className="rc-h1">
          {heading ? heading : <>Refunds &amp; <em>cancellations</em></>}
        </h1>

        <p className="rc-sub">
          {lead}
        </p>

        <RefundSearchBox
          currentTab={currentTab}
          onJumpToQuestion={onJumpToQuestion}
          onOpenWhatsApp={onOpenWhatsApp}
        />

        <RefundPopularQuestions onJumpToQuestion={onJumpToQuestion} />
      </div>
    </section>
  );
}
