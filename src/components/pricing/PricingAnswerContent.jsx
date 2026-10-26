// src/components/pricing/PricingAnswerContent.jsx
// Answer content drawer and action footer (D11) matching Page 27 & 35 of hok_pricing_fees_v4

import React from "react";
import { Link } from "react-router-dom";
import { PRICING_TOKENS } from "../../data/pricing/pricingSettings";

function WhatsAppIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M17.5 14.4c-.3-.1-1.7-.8-2-1-.3-.1-.5-.1-.7.2-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.4-.5-2.6-1.6-.9-.8-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7.1-.1.3-.4.5-.6.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5s-.7-1.7-1-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.4-1.2 1.2-1.2 2.9s1.2 3.4 1.4 3.6c.2.3 2.4 3.7 5.9 5.2.8.4 1.5.6 2 .8.8.3 1.6.2 2.2.1.7-.1 2.1-.9 2.4-1.7.3-.8.3-1.6.2-1.7-.1-.2-.3-.3-.6-.4zM12 2C6.5 2 2 6.5 2 12c0 2 .6 3.8 1.6 5.3L2 22l4.8-1.6C8.2 21.4 10 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2z" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function PricingAnswerContent({ question, onSelectQuestion, onShowToast }) {
  const handleCopyLink = () => {
    const url = `${window.location.origin}/pricing-fees#${question.id}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        if (onShowToast) {
          onShowToast("Link copied. Paste it anywhere to share this answer.");
        }
      });
    } else {
      // Fallback
      if (onShowToast) {
        onShowToast("Link copied. Paste it anywhere to share this answer.");
      }
    }
  };

  const handleWhatsAppClick = () => {
    const message = `Hello House of Kaira, I have a question about pricing: ${question.question}`;
    const url = `https://wa.me/${PRICING_TOKENS.support_whatsapp_raw}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    if (onShowToast) {
      onShowToast("Opening WhatsApp concierge");
    }
  };

  const renderContentBlocks = () => {
    if (!question.content || question.content.length === 0) {
      return <p>{question.summary}</p>;
    }

    return question.content.map((block, idx) => {
      if (block.type === "paragraph") {
        return <p key={idx}>{block.text}</p>;
      }
      if (block.type === "callout" || block.type === "note") {
        return (
          <div key={idx} className="note">
            {block.title && <strong>{block.title}: </strong>}
            {block.text}
          </div>
        );
      }
      if (block.type === "list") {
        return (
          <ul key={idx}>
            {block.items.map((item, itemIdx) => (
              <li key={itemIdx}>{item}</li>
            ))}
          </ul>
        );
      }
      return null;
    });
  };

  return (
    <div className="ans">
      {renderContentBlocks()}

      {/* Answer Footer Actions (Section 5.10 & Page 27) */}
      <div className="cq-foot">
        <button
          type="button"
          onClick={handleWhatsAppClick}
          aria-label="Ask about this question on WhatsApp"
        >
          <WhatsAppIcon className="fill" />
          <span>Still unsure? Ask us about this</span>
        </button>

        <button
          type="button"
          onClick={handleCopyLink}
          aria-label="Copy direct link to this answer"
        >
          <LinkIcon />
          <span>Copy link</span>
        </button>
      </div>
    </div>
  );
}

export default React.memo(PricingAnswerContent);
