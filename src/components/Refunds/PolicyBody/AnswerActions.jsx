/**
 * Answer Actions Component for Refund & Cancellation Policy Page
 * Spec v1.2 · Section 07.7 & 12.8
 */

import React from "react";
import { WhatsAppIcon, CopyLinkIcon } from "../common/RefundIcons";
import { resolveTokenValue, replaceTokensInText } from "../../../data/refunds/refundTokens";

export default function AnswerActions({
  question,
  activeTab = "rental",
  onShowToast,
}) {
  const handleWhatsAppClick = (e) => {
    e.stopPropagation();
    const rawNumber = resolveTokenValue("support_whatsapp_raw");
    const cleanQuestion = replaceTokensInText(question.q);
    const msg = `Hello House of Kaira, I have a question about a refund or cancellation: ${cleanQuestion}`;
    const url = `https://wa.me/${rawNumber}?text=${encodeURIComponent(msg)}`;

    if (onShowToast) onShowToast("Opening WhatsApp");
    setTimeout(() => {
      window.open(url, "_blank", "noopener,noreferrer");
    }, 250);
  };

  const handleCopyLinkClick = (e) => {
    e.stopPropagation();
    const origin = window.location.origin;
    const tabParam = question.for === "pre" ? "?for=preloved" : "";
    const shareableUrl = `${origin}/refunds${tabParam}#${question.id}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(shareableUrl)
        .then(() => {
          if (onShowToast) {
            onShowToast("Link copied. Paste it anywhere to share this answer.");
          }
        })
        .catch(() => {
          if (onShowToast) onShowToast(`Link: ${shareableUrl}`);
        });
    } else {
      if (onShowToast) onShowToast(`Link: ${shareableUrl}`);
    }
  };

  return (
    <div className="cq-foot">
      <button
        type="button"
        onClick={handleWhatsAppClick}
        aria-label="Ask about this question on WhatsApp"
      >
        <WhatsAppIcon size={13} className="fill" />
        Still unsure? Ask us about this
      </button>

      <button
        type="button"
        onClick={handleCopyLinkClick}
        aria-label="Copy link to this answer"
      >
        <CopyLinkIcon size={13} />
        Copy link
      </button>
    </div>
  );
}
