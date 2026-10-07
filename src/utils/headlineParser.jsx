import React from "react";

/**
 * Parses a headline string with *asterisks* into highlighted italic elements
 * and handles newline (\n) breaks.
 *
 * @param {string|object} text - Headline string with optional *words* or legacy object
 * @param {string} [highlightElement='em'] - HTML element to wrap highlighted word ('em' or 'span')
 * @param {string} [highlightClass=''] - Optional CSS class for the highlighted element
 */
export function renderHeadline(
  text,
  highlightElement = "em",
  highlightClass = ""
) {
  if (!text) return null;

  // Support legacy object format { before, highlight, after }
  if (typeof text === "object") {
    if (text.before !== undefined || text.highlight !== undefined) {
      const HighlightTag = highlightElement;
      return (
        <>
          {text.before}
          <HighlightTag className={highlightClass || undefined}>
            {text.highlight}
          </HighlightTag>
          {text.after}
        </>
      );
    }
    // Support legacy mobileTitle object format
    if (text.line1 !== undefined) {
      const HighlightTag = highlightElement;
      return (
        <>
          {text.line1}
          <br />
          {text.line2Before}
          <HighlightTag className={highlightClass || undefined}>
            {text.highlight}
          </HighlightTag>
          {text.line2After}
          <br />
          {text.line3}
        </>
      );
    }
  }

  const str = String(text);
  const lines = str.split("\n");

  return lines.map((line, lineIdx) => {
    const parts = line.split(/(\*[^*]+\*)/g);
    const HighlightTag = highlightElement;

    return (
      <React.Fragment key={lineIdx}>
        {lineIdx > 0 && <br />}
        {parts.map((part, partIdx) => {
          if (part.startsWith("*") && part.endsWith("*")) {
            const inner = part.slice(1, -1);
            return (
              <HighlightTag key={partIdx} className={highlightClass || undefined}>
                {inner}
              </HighlightTag>
            );
          }
          return <React.Fragment key={partIdx}>{part}</React.Fragment>;
        })}
      </React.Fragment>
    );
  });
}
