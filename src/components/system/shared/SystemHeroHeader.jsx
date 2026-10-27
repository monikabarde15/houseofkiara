/**
 * House of Kaira: System Hero Header Component (C2)
 * Eyebrow, Heading, and Line
 * Section 4 C2 of System Pages Specification v1.0
 */

import React from "react";
import "../../../styles/system/system-variables.css";
import "../../../styles/system/system-hero.css";

export default function SystemHeroHeader({
  eyebrow,
  heading,
  sub,
  highlightText = null,
  headingRef = null
}) {
  /**
   * Formats heading with italic gold text and joins two-word designer names with non-breaking spaces
   */
  const renderHeading = () => {
    if (React.isValidElement(heading)) {
      return heading;
    }

    const text = String(heading || "");

    // If highlightText is provided (e.g. search query or designer name)
    if (highlightText && text.includes(highlightText)) {
      const parts = text.split(highlightText);
      const safeHighlight = highlightText.replace(/\s+/g, "\u00A0");
      return (
        <>
          {parts[0]}
          <span className="sys-gold-text">“{safeHighlight}”</span>
          {parts.slice(1).join(highlightText)}
        </>
      );
    }

    // Replace asterisks *word* if present in copy with italic gold span
    if (text.includes("*")) {
      const tokens = text.split(/(\*[^*]+\*)/g);
      return tokens.map((tok, i) => {
        if (tok.startsWith("*") && tok.endsWith("*")) {
          const inner = tok.slice(1, -1).replace(/\s+/g, "\u00A0");
          return (
            <span key={i} className="sys-gold-text">
              {inner}
            </span>
          );
        }
        return tok;
      });
    }

    return text;
  };

  return (
    <header className="sys-header-block">
      {eyebrow && (
        <div className="sys-eyebrow" aria-hidden="true">
          <span className="sys-eyebrow-rule" />
          <span className="sys-eyebrow-text">{eyebrow}</span>
          <span className="sys-eyebrow-rule" />
        </div>
      )}

      <h1
        ref={headingRef}
        tabIndex={-1}
        className="sys-h1"
      >
        {renderHeading()}
      </h1>

      {sub && <p className="sys-lead-line">{sub}</p>}
    </header>
  );
}
