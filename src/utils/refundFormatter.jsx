/**
 * Answer & Copy Formatter for Refund & Cancellation Policy Page
 * Spec v1.2 · Section 07.6 & 13.2
 */

import React from "react";
import { Link } from "react-router-dom";
import { REFUND_TOKENS, resolveTokenValue } from "../data/refunds/refundTokens.js";

/**
 * Parses inline formatting: tokens {{...}}, bold **...**, and links [...](...)
 */
export function formatInlineText(text, options = {}) {
  const { isReviewMode = false, onJumpToQuestion, onJumpToSection } = options;
  if (!text) return null;

  // Regex pattern matching:
  // 1. Tokens: {{token_name}}
  // 2. Bold: **text**
  // 3. Links: [label](target)
  const regex = /(\{\{([a-zA-Z0-9_]+)\}\})|(\*\*([^*]+)\*\*)|(\[([^\]]+)\]\(([^)]+)\))/g;

  const elements = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Push preceding plain text
    if (match.index > lastIndex) {
      elements.push(text.substring(lastIndex, match.index));
    }

    if (match[1]) {
      // {{token_name}}
      const tokenKey = match[2];
      const tokenObj = REFUND_TOKENS[tokenKey];
      const tokenVal = tokenObj ? tokenObj.value : resolveTokenValue(tokenKey);

      if (isReviewMode && tokenObj) {
        const tooltip = `{{${tokenKey}}} · ${tokenObj.owner}${
          tokenObj.status === "Awaiting decision" ? " · awaiting decision" : ""
        }`;
        elements.push(
          <span
            key={`tok-${match.index}`}
            className="tok"
            title={tooltip}
          >
            {tokenVal}
          </span>
        );
      } else {
        elements.push(tokenVal);
      }
    } else if (match[3]) {
      // **bold text**
      elements.push(
        <strong key={`b-${match.index}`}>
          {match[4]}
        </strong>
      );
    } else if (match[5]) {
      // [label](target)
      const label = match[6];
      const target = match[7];

      if (target.startsWith("q:")) {
        const questionId = target.replace("q:", "");
        elements.push(
          <button
            key={`link-q-${match.index}`}
            type="button"
            className="lnk"
            onClick={(e) => {
              e.preventDefault();
              if (onJumpToQuestion) onJumpToQuestion(questionId);
            }}
          >
            {label}
          </button>
        );
      } else if (target.startsWith("sec:")) {
        const sectionId = target.replace("sec:", "");
        elements.push(
          <button
            key={`link-sec-${match.index}`}
            type="button"
            className="lnk"
            onClick={(e) => {
              e.preventDefault();
              if (onJumpToSection) onJumpToSection(sectionId);
            }}
          >
            {label}
          </button>
        );
      } else if (target === "list-your-piece") {
        elements.push(
          <Link
            key={`link-page-${match.index}`}
            to="/list-your-piece"
            className="lnk"
          >
            {label}
          </Link>
        );
      } else {
        elements.push(
          <a
            key={`link-ext-${match.index}`}
            href={`#${target}`}
            className="lnk"
          >
            {label}
          </a>
        );
      }
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    elements.push(text.substring(lastIndex));
  }

  return elements;
}

/**
 * Formats a title with an italic gold word (*word*)
 */
export function formatSectionTitle(title) {
  if (!title) return null;
  const parts = title.split(/\*([^*]+)\*/g);

  return parts.map((part, index) => {
    if (index % 2 === 1) {
      return <em key={index}>{part}</em>;
    }
    return part;
  });
}

/**
 * 4-column refund steps block component (Section 07.6)
 */
export function RefundStepsBlock({ isReviewMode = false }) {
  const refundTimeline = resolveTokenValue("refund_timeline");
  const tokenObj = REFUND_TOKENS.refund_timeline;

  const steps = [
    { num: "1", text: "You cancel in My Account or on WhatsApp" },
    { num: "2", text: "We confirm the same day" },
    { num: "3", text: "Your refund is started straight away" },
    {
      num: "4",
      text: (
        <>
          It reaches you in{" "}
          {isReviewMode ? (
            <span
              className="tok"
              title={`{{refund_timeline}} · ${tokenObj.owner} · awaiting decision`}
            >
              {refundTimeline}
            </span>
          ) : (
            refundTimeline
          )}
        </>
      ),
    },
  ];

  return (
    <div className="steps4">
      {steps.map((step) => (
        <div key={step.num}>
          <b>{step.num}</b>
          <span>{step.text}</span>
        </div>
      ))}
    </div>
  );
}
