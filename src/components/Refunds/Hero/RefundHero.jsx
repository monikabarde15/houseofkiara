/**
 * Hero Section Container for Refund & Cancellation Policy Page
 * Spec v1.2 · Section 04
 */

import React from "react";
import RefundBreadcrumb from "../common/RefundBreadcrumb";
import RefundSearchBox from "./RefundSearchBox";
import RefundPopularQuestions from "./RefundPopularQuestions";

export default function RefundHero({
  currentTab = "rental",
  onJumpToQuestion,
  onOpenWhatsApp,
}) {
  return (
    <section className="rc-hero-section">
      <RefundBreadcrumb />
      <div className="rc-hero">
        <div className="fq-eyebrow">
          <i aria-hidden="true" />
          <span>Our commitment to you</span>
          <i aria-hidden="true" />
        </div>

        <h1 className="rc-h1">
          Refunds &amp; <em>cancellations</em>
        </h1>

        <p className="rc-sub">
          Plans change, and we understand. Before you order or after, here is
          exactly what happens when they do, in plain words and with no surprises.
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
