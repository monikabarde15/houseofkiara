// src/components/FAQ/ReadingPane/FeedbackRow.jsx
// Feedback row (D6) per Section D6 & 10.6
import React, { useState } from "react";
import { ChainIcon, WhatsAppGlyphIcon } from "../common/FaqIcons";
import { ADMIN_FIGURES } from "../../../data/faq/adminFigures";

export default function FeedbackRow({ question, onShowToast }) {
  const [vote, setVote] = useState(null); // null | 'yes' | 'no'

  const handleVote = (choice) => {
    // Clicking the chosen button again clears the choice (Section D6)
    if (vote === choice) {
      setVote(null);
    } else {
      setVote(choice);
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/faqs#${question.id}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          if (onShowToast) {
            onShowToast("Link copied. Paste it anywhere to share this answer.");
          }
        })
        .catch(() => {
          if (onShowToast) {
            onShowToast(`Link: ${url}`);
          }
        });
    } else {
      if (onShowToast) {
        onShowToast(`Link: ${url}`);
      }
    }
  };

  const handleAskWhatsApp = () => {
    if (onShowToast) onShowToast("Opening WhatsApp");
    const text = `Hello House of Kaira, I have a question: "${question.question}"`;
    const url = `https://wa.me/${ADMIN_FIGURES.support_whatsapp_raw}?text=${encodeURIComponent(
      text
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const voteClass = vote ? (vote === "yes" ? "yes" : "no") : "";

  return (
    <div className={`fb ${voteClass}`}>
      <div className="fb-v">
        <span>Did this help?</span>
        <button
          type="button"
          aria-pressed={vote === "yes"}
          onClick={() => handleVote("yes")}
        >
          Yes
        </button>
        <button
          type="button"
          aria-pressed={vote === "no"}
          onClick={() => handleVote("no")}
        >
          Not quite
        </button>
      </div>

      {/* Copy link on the right (D6) */}
      <button
        type="button"
        className="fb-copy"
        onClick={handleCopyLink}
        aria-label="Copy link to this answer"
      >
        <ChainIcon />
        <span>Copy link</span>
      </button>

      {/* Thank you confirmation on Yes (D6) */}
      <div className="fb-thanks" role="status">
        Thank you, that is lovely to hear.
      </div>

      {/* Ask box on Not quite (D6) */}
      <div className="fb-more" role="status">
        <span>Sorry this didn’t cover it. Ask us and a real person will reply.</span>
        <button
          type="button"
          className="btn-wa sm"
          onClick={handleAskWhatsApp}
        >
          <WhatsAppGlyphIcon fill="#FFFFFF" style={{ width: 13, height: 13 }} />
          <span>Ask about this</span>
        </button>
      </div>
    </div>
  );
}
