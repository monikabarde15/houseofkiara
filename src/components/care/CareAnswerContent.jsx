/**
 * House of Kaira - Care Answer Content & Footers (Component C9)
 * Sections 5.9, 6.7, 6.8, 7.10 of Build Specification 2.0
 */

import React from "react";
import { Link } from "react-router-dom";
import { CARE_SETTINGS } from "../../data/care/careSettings";
import { showToast } from "../AboutUs/shared/Toast";

export default function CareAnswerContent({ question, onJumpToQuestion }) {
  if (!question) return null;

  const handleWhatsAppAsk = () => {
    if (typeof showToast === "function") {
      showToast("Opening WhatsApp");
    }
    const msg = `Hello House of Kaira, I have a question about caring for my piece: ${question.title}`;
    const url = `https://wa.me/${CARE_SETTINGS.support_whatsapp_raw}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCopyLink = () => {
    const cleanUrl = `${window.location.origin}${window.location.pathname}#${question.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(cleanUrl).then(() => {
        if (typeof showToast === "function") {
          showToast("Link copied. Paste it anywhere to share this answer.");
        }
      });
    }
  };

  // Render paragraphs and bulleted lists
  const renderFormattedAnswer = (text) => {
    if (!text) return null;
    const blocks = text.split("\n\n");

    return blocks.map((block, idx) => {
      // Check if this block contains bullet points starting with '• '
      if (block.includes("•")) {
        const lines = block.split("\n");
        const listItems = [];
        const leadLines = [];

        lines.forEach((line) => {
          const trimmed = line.trim();
          if (trimmed.startsWith("•")) {
            listItems.push(trimmed.replace(/^•\s*/, ""));
          } else if (trimmed.length > 0) {
            leadLines.push(trimmed);
          }
        });

        return (
          <React.Fragment key={idx}>
            {leadLines.map((lead, lIdx) => (
              <p key={lIdx}>{lead}</p>
            ))}
            <ul>
              {listItems.map((item, iIdx) => (
                <li key={iIdx}>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </React.Fragment>
        );
      }

      // Check if jump link or page link needs to be embedded
      if (question.jumpLink && block.includes(question.jumpLink.text)) {
        const parts = block.split(question.jumpLink.text);
        return (
          <p key={idx}>
            {parts[0]}
            <button
              type="button"
              className="lnk"
              onClick={() => onJumpToQuestion && onJumpToQuestion(question.jumpLink.targetId)}
            >
              {question.jumpLink.text}
            </button>
            {parts[1]}
          </p>
        );
      }

      if (question.pageLink && block.includes(question.pageLink.text)) {
        const parts = block.split(question.pageLink.text);
        return (
          <p key={idx}>
            {parts[0]}
            <Link to={question.pageLink.href} className="lnk">
              {question.pageLink.text}
            </Link>
            {parts[1]}
          </p>
        );
      }

      return <p key={idx}>{block}</p>;
    });
  };

  return (
    <div className="ans">
      {renderFormattedAnswer(question.answer)}

      {/* Answer Footer per Section 5.9, 6.7, 6.8 */}
      <div className="cq-foot">
        <button
          type="button"
          onClick={handleWhatsAppAsk}
          aria-label={`Ask about ${question.title} on WhatsApp`}
        >
          <svg viewBox="0 0 24 24" className="fill" aria-hidden="true">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.77.813 2.796.814 3.183 0 5.769-2.587 5.77-5.768.001-3.182-2.585-5.798-5.77-5.798zm3.084 8.016c-.149.42-1.002.825-1.391.865-.389.04-1.026.064-3.183-.834-2.157-.899-3.238-3.32-3.344-3.469-.105-.15-.85-1.127-.85-2.152s.537-1.529.728-1.74c.191-.21.417-.262.556-.262.139 0 .278.002.399.008.127.006.297-.048.464.354.17.412.581 1.419.632 1.523.051.105.085.228.017.365-.068.136-.102.221-.203.34-.102.119-.214.266-.306.357-.102.102-.208.213-.09.417.119.204.528.871 1.134 1.412.781.696 1.439.912 1.643 1.014.204.102.323.085.442-.051.119-.136.51-.595.646-.799.136-.204.272-.17.459-.102.187.068 1.187.56 1.391.662.204.102.34.153.391.238.051.085.051.493-.098.913z" />
          </svg>
          <span>Still unsure? Ask us about this</span>
        </button>

        <button
          type="button"
          onClick={handleCopyLink}
          aria-label={`Copy link to answer for ${question.title}`}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          <span>Copy link</span>
        </button>
      </div>
    </div>
  );
}
