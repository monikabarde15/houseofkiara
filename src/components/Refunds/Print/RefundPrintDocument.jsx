/**
 * Clean Print & PDF Document Component for Refund & Cancellation Policy Page
 * Spec v1.2 · Section 11
 */

import React from "react";
import {
  POLICY_INTROS,
  getSectionsWithQuestions,
} from "../../../data/refunds/refundPolicyRegistry";
import { formatInlineText, formatSectionTitle } from "../../../utils/refundFormatter";
import { REFUND_PAGE_METADATA } from "../../../data/refunds/refundTokens";

export default function RefundPrintDocument() {
  const rentalSections = getSectionsWithQuestions("rental");
  const prelovedSections = getSectionsWithQuestions("preloved");

  const renderSectionQuestions = (sections) => {
    return sections.map((sec) => (
      <div key={sec.id}>
        <h2 className="pr-sec">
          {sec.number} {formatSectionTitle(sec.title)}
        </h2>
        {sec.questions.map((q) => {
          const lines = Array.isArray(q.a) ? q.a : [q.a];
          return (
            <div key={q.id} className="pr-q">
              <h3>{formatInlineText(q.q)}</h3>
              <div className="ans">
                {lines.map((line, lIdx) => {
                  if (line === "[[steps]]") return null;
                  if (line.startsWith("> ")) {
                    return <p key={lIdx}>{formatInlineText(line.substring(2))}</p>;
                  }
                  if (line.startsWith("- ")) {
                    return <p key={lIdx}>• {formatInlineText(line.substring(2))}</p>;
                  }
                  return <p key={lIdx}>{formatInlineText(line)}</p>;
                })}
              </div>
            </div>
          );
        })}
      </div>
    ));
  };

  return (
    <div id="printAll" aria-hidden="true">
      <h1>Refund &amp; Cancellation Policy</h1>
      <p className="pr-meta">
        House of Kaira · Last reviewed {REFUND_PAGE_METADATA.lastReviewedDate}
      </p>

      {/* Rental Policy */}
      <h2 className="pr-mode">Rental policy</h2>
      <p className="pr-intro">{formatInlineText(POLICY_INTROS.rental)}</p>
      {renderSectionQuestions(rentalSections)}

      {/* Preloved Policy */}
      <h2 className="pr-mode pr-pre">Preloved policy</h2>
      <p className="pr-intro">{formatInlineText(POLICY_INTROS.preloved)}</p>
      {renderSectionQuestions(prelovedSections)}
    </div>
  );
}
